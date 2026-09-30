import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Authoring checks only: never invokes run, dispatch, provider, browser or wallet commands.
const cli = process.argv[2] || process.env.PROOFRUN_CLI;
if (!cli || !fs.existsSync(cli)) {
  console.error('Usage: node docs/proofrun/validate-contracts.mjs /absolute/path/to/proofrun/bin/proofrun.js');
  process.exit(2);
}
const require = createRequire(path.resolve(path.dirname(cli), '../package.json'));
const YAML = require('yaml');
const root = path.dirname(fileURLToPath(import.meta.url));
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'socialcert-proofrun-compile-'));
const read = (relative) => YAML.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const preset = read('presets/socialcert-wave1.yaml');
const oracleDocs = fs.readFileSync(path.join(root, 'oracles.md'), 'utf8');
const invoke = (args) => {
  const result = spawnSync(process.execPath, [path.resolve(cli), ...args], {encoding:'utf8'});
  if (result.status !== 0) throw new Error(`${args[0]} failed: ${result.stderr || result.stdout || result.error}`);
};
try {
  const files = ['profiles/socialcert-newcomer.yaml','devices/chromium-desktop-fixture.yaml','presets/socialcert-wave1.yaml'];
  const workflows = fs.readdirSync(path.join(root, 'workflows')).filter(name => name.endsWith('.v1.proofrun.yaml')).sort();
  for (const file of files) invoke(['validate', path.join(root,file)]);
  let cases = 0;
  for (const name of workflows) {
    const relative = `workflows/${name}`;
    const workflow = read(relative);
    const audit = read(`flows/${name.replace('.v1.proofrun.yaml','.proofrun.yaml')}`);
    if (audit.id !== workflow.metadata.id) throw new Error(`Audit ID mismatch: ${name}`);
    for (const ref of workflow.journeys.flatMap(j => j.steps.flatMap(s => s.oracleRefs || []))) {
      if (!preset.fragment.oracles[ref] || !oracleDocs.includes(`\`${ref}\``)) throw new Error(`Undocumented mandatory oracle: ${ref}`);
    }
    if (workflow.target.environment !== 'local-fixture' || workflow.budget.maxProviderCalls !== 0 || workflow.policy.spendLimit !== 0) throw new Error(`Unsafe authoring default: ${name}`);
    invoke(['validate',path.join(root,relative)]);
    const compiled = path.join(output, `${workflow.metadata.id}.json`);
    invoke(['compile',path.join(root,relative),'--profile',path.join(root,files[0]),'--device',path.join(root,files[1]),'--preset',path.join(root,files[2]),'--output',compiled]);
    const plan=JSON.parse(fs.readFileSync(compiled,'utf8'));
    cases += plan.cases.length;
  }
  console.log(JSON.stringify({status:'validated-and-compiled-not-run',v1Documents:files.length+workflows.length,workflows:workflows.length,legacyDeclarations:workflows.length,compiledCases:cases,planDirectory:output},null,2));
} catch (error) {
  console.error(error.message);
  process.exitCode=1;
}
