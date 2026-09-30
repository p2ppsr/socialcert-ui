# SocialCert ProofRun coverage

These are versioned first-wave acceptance contracts, **not executed evidence**. No production/provider/device/model resource was dispatched when they were authored. Do not create a passing run record from successful compilation or a success-page screenshot.

The eight required IDs are `socialcert-onboarding`, `socialcert-email`, `socialcert-x`, `socialcert-discord`, `socialcert-privacy`, `socialcert-recovery`, `socialcert-phone-disabled` and `socialcert-feedback`. V1 definitions live in `workflows/`; matching legacy declarations in `flows/` let the current Commercial Readiness reader discover the same inventory. The canonical executable acceptance contract is V1. Keep changes aligned rather than recording different criteria in each format.

## Local contract validation

Use the already installed ProofRun core CLI, without network/package installation:

```sh
node docs/proofrun/validate-contracts.mjs /absolute/path/to/proofrun/bin/proofrun.js
```

This validates all V1 Workflow/Profile/Device/Preset documents, compiles every workflow with the local profile/device/preset, checks matching legacy IDs, and checks that every referenced mandatory oracle has an explicit contract. Plans go to a fresh temporary directory. It does not execute the plans, start a server, create a browser or wallet, or contact any provider. Pin the compiler source revision and package version in the validation handoff.

## Admission and execution boundary

Defaults are `http://127.0.0.1:8088`, `local-fixture`, localhost-only network allowance, zero model calls/tokens/provider cost, zero spend, no automatic remediation and one case. The fixture device's custom capabilities are requirements, not evidence that the stock runner implements them. A driver must establish isolated providers/wallet/feedback and register the product-owned [domain-oracles.mjs](domain-oracles.mjs) plugins with an independent fixture evidence reader as described in [oracles.md](oracles.md). The stock runner currently registers only generic reachability/accessibility/performance oracles; it cannot accept these domain criteria by itself. Refuse admission if a required fixture, plugin or resource is absent. A raw missing-plugin exception is infrastructure incompleteness, not a proved SocialCert user defect.

`scripted@1` identifies a deterministic engineering lane. It needs a reviewed action driver; the authored natural-language steps are not already validated coordinate sequences. These documents can compile before fixture/driver implementation is complete. A separate fresh, uncoached role trial must receive only a goal and ordinary available product knowledge, never the selectors or a prior successful path. Actual target-user acceptance is still required.

The product oracle adapter has negative regression tests:

```sh
node --test docs/proofrun/domain-oracles.test.mjs
```

They verify that known bad fixture packets cannot turn missing wallet possession, wrong subjects/issuers, accidental disclosure, duplicate effects, stuck pending state, wrong lookup, unexpected phone sends or help-link-only feedback into acceptance. These verifier tests are not browser/user-flow execution. The real fixture driver/evidence collector is still a required integration.

## Executed candidate orchestration fixtures

A product-owned driver runs the actual `CertificateAttempt` module with real SDK certificate signing/verification, ephemeral test-only keys and independent in-memory acquisition/inventory/publication/effect ledgers:

```sh
cd frontend
node_modules/.bin/vite-node ../docs/proofrun/scripts/run-local-fixtures.ts --output /absolute/private/local/evidence-directory
```

The driver forbids fetch/network calls and writes redacted per-scenario observations plus a SHA-256 manifest/summary. It executes private Email/X/Discord receipt paths, acknowledged publication, wallet action followed by overlay failure, receipt storage recheck without another acquisition, concurrent calls, unknown acquisition without blind retry, wrong subject, tampered signature, network mismatch and disabled family. Expected rejection is recorded as an actual error terminal state with a passing regression expectation, never as successful issuance.

This is **local synthetic candidate-orchestration proof**. Provider proof is a preverified fixture input; the inventory is in-memory test state; stages are actual orchestration callbacks, not observed React DOM. It does not run the full V1 browser workflows or establish email/OAuth delivery, production API security, real-wallet persistence, paid transactions, independent real overlay lookup, feedback delivery, accessibility/device behavior or commercial acceptance. Those criteria remain not executed/blocked. Raw certificates, keys, signatures and attribute values are not written to evidence. Record source/adapter/driver digests and SDK/runtime version, and rerun affected cases when that source changes.

An SDK publication failure may follow successful wallet action creation. The driver records that as possible disclosure with no overlay acknowledgment, validates honest partial state, and does not blindly retry publication. A private claim after such an attempt must fail; failure does not prove nondisclosure.

The coordinated `/metadata` descriptor advertises `verification.maxAgeSeconds: 900`. These local fixtures supply preverified inputs and a descriptor; they do not execute a real delivery/OAuth challenge or measure its lifetime. Treat that window as prospective policy/local contract assurance until separately approved exact-deployment challenge/expiry and subject-binding evidence is collected. Publishing the descriptor is not proof that every issuer/provider path enforces it.

For any later real provider/issuance/publication/feedback run, require an explicit bounded work order: exact frontend/backend source and deployment/artifact identities, environment, disposable identities and wallet baseline, declared state variants, provider entitlements, all-attempt worst-case cost including fees/setup/reset/model/human work, cancellation owner, deadline and stop condition. Change target/allowlist/budgets as a reviewed configuration revision; never silently point a fixture workflow at production. Do not collect customer login/PII, issue public attributes without consent, or test security bypasses.

The September 29 Network Ops economic requirements supersede the old broad paid device matrix. Local capacity and agent effort are allocated costs, not free. Economics remain unknown until reconciled; internal zero provider budget is an execution boundary, not a commercial margin claim.

## Independent acceptance and coverage

Provider verification, certificate acquisition, optional publication and independent lookup have separate oracles. A valid code or OAuth callback is not certificate issuance. A certificate receipt must match wallet possession and a validator checked against the verified provider subject. Publication success must have a separate receipt and lookup proof; privately held certificates should not be expected in public lookup.

Selectors for fixture regressions are described in [selectors.md](selectors.md). They guide deterministic drivers only. A `data-stage` or success-page string can corroborate an oracle, never replace it. Required failure cases include invalid/expired verification, provider/wallet denial or unavailable state, acquisition failure after verified proof, publication failure after issuance, refresh/back/pending and duplicate submission inside a controlled local harness. No production fault injection is authorized by these definitions.

The current contract compiles one desktop browser fixture configuration. It does not certify desktop-wallet/native prompt behavior, iOS Safari, Android Chrome, wallet browsers, real devices or all accessibility. Keyboard/zoom assertions can run in this lane; add exact actual mobile/browser/wallet DeviceProfiles and separate acquisition fixtures before claiming those platforms. A responsive viewport cannot substitute for required native or mobile execution.

Feedback submission is an explicit future criterion. If the product only links to help/support and has no form/receipt backend, mark submission blocked and retain the help discovery result separately. A link click or mailto opening is not delivered feedback.

## Evidence after actual execution

Public-safe run summaries go in `runs/` only after an actual run, with `Outcome`, `Completed at`, flow ID, candidate source/deployment identity, matrix, initial permissions, per-criterion verdicts, timings, cleanup and private evidence references. No run records exist in this authoring wave. Store raw privacy-sensitive evidence only in approved private Network Ops artifacts. Exclude OAuth tokens, cookies, OTPs, signatures, mailbox/profile data, secrets, raw certificates/transactions and unrelated wallet information. Preserve artifact digests and failed attempts.

Default trust targets are meaningful content ≤2 seconds, click feedback ≤500 ms, wallet prompt ≤5 seconds, approval-to-confirmation ≤10 seconds, full auth flow ≤45 seconds with external delivery/user deliberation separated, and telemetry visibility ≤60 seconds. Exceptions require an explicit rationale and visible progress. A missing required oracle, blocked supported family or ambiguous issuance cannot pass merely because timing is acceptable.
