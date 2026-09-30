import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath} from 'node:url'
import {Certificate,PrivateKey,ProtoWallet} from '../../../frontend/node_modules/@bsv/sdk/dist/esm/mod.js'
import {CertificateAttempt,families,type Family,type FlowDeps,type Stage} from '../../../frontend/src/utils/certification'
import {registerSocialCertOracles} from '../domain-oracles.mjs'

// Actual candidate CertificateAttempt execution with independent in-memory ledgers.
// No real wallet/provider/storage/overlay API is used. Keys/certificates stay in memory.
const directory=path.dirname(fileURLToPath(import.meta.url))
const repo=path.resolve(directory,'../../..')
const option=process.argv.indexOf('--output')
if(option<0 || !process.argv[option+1])throw new Error('Require --output <private local evidence directory>')
const runId=`local-orchestration-${new Date().toISOString().replace(/[:.]/g,'-')}`
const output=path.join(path.resolve(process.argv[option+1]),runId)
fs.mkdirSync(output,{recursive:true})
const originalFetch=globalThis.fetch
let externalCalls=0
globalThis.fetch=async()=>{externalCalls++;throw new Error('Network is forbidden in this local fixture driver')}
const hash=(value:string|Buffer)=>crypto.createHash('sha256').update(value).digest('hex')
const observations:any[]=[]
const results:any[]=[]
const sourceDigest=hash(fs.readFileSync(path.join(repo,'frontend/src/utils/certification.ts')))
const adapterDigest=hash(fs.readFileSync(path.join(repo,'docs/proofrun/domain-oracles.mjs')))
const driverDigest=hash(fs.readFileSync(fileURLToPath(import.meta.url)))
const sdkVersion=JSON.parse(fs.readFileSync(path.join(repo,'frontend/node_modules/@bsv/sdk/package.json'),'utf8')).version

async function scenario(name:string,family:Family,config:{reveal?:boolean;acquireError?:boolean;wrongSubject?:boolean;badSignature?:boolean;networkMismatch?:boolean;disabled?:boolean;storageRetry?:boolean;publicationFailure?:boolean;concurrent?:boolean}={}){
  const issuer=new ProtoWallet(PrivateKey.fromRandom())
  const subjectWallet=new ProtoWallet(PrivateKey.fromRandom())
  const alternateWallet=new ProtoWallet(PrivateKey.fromRandom())
  const issuerKey=(await issuer.getPublicKey({identityKey:true})).publicKey
  const subjectKey=(await subjectWallet.getPublicKey({identityKey:true})).publicKey
  const otherSubject=(await alternateWallet.getPublicKey({identityKey:true})).publicKey
  const fields:Record<string,string>=family==='email'?{email:'fixture@example.invalid'}:{userName:'fixture-user',profilePhoto:'fixture-photo'}
  const ledger:{calls:any[];certificates:any[];publication:any[];effects:any[];stages:Stage[];checks:any[]}={calls:[],certificates:[],publication:[],effects:[],stages:[],checks:[]}
  let acquireCalls=0,publishCalls=0,storageReady=!config.storageRetry
  const deps:FlowDeps={
    metadata:async()=>{ledger.calls.push({method:'metadata'});return {version:'fixture-1',issuer:{publicKey:issuerKey,network:'test'},families:Object.entries(families).map(([key,f])=>({type:f.type,name:key,fields:[...f.fields],enabled:!(config.disabled&&key===family)})),verification:{maxAgeSeconds:900}}},
    identity:async()=>{ledger.calls.push({method:'identity'});return subjectKey},
    network:async()=>{ledger.calls.push({method:'network'});return config.networkMismatch?'mainnet':'testnet'},
    acquire:async(issuerRef,type,requested)=>{
      acquireCalls++;ledger.calls.push({method:'acquire',operationId:`acquire-${acquireCalls}`,family,fieldNames:Object.keys(requested).sort()})
      if(config.acquireError)throw new Error('Local acquisition fixture failed before returning a receipt')
      if(issuerRef!==issuerKey || type!==families[family].type || JSON.stringify(requested)!==JSON.stringify(fields))throw new Error('Fixture acquisition request differs from expected inputs')
      const cert=new Certificate(type,Buffer.alloc(32,acquireCalls).toString('base64'),config.wrongSubject?otherSubject:subjectKey,issuerKey,`${'0'.repeat(64)}.0`,Object.fromEntries(Object.keys(requested).map(key=>[key,Buffer.from('local-opaque-field').toString('base64')])) )
      await cert.sign(issuer)
      if(config.badSignature)cert.fields[Object.keys(requested)[0]]=Buffer.from('tampered-local-field').toString('base64')
      const receipt={type:cert.type,serialNumber:cert.serialNumber,subject:cert.subject,certifier:cert.certifier,revocationOutpoint:cert.revocationOutpoint,fields:cert.fields,signature:cert.signature!}
      ledger.certificates.push(receipt);ledger.effects.push({kind:'acquisition',intentRef:name,operationId:`acquire-${acquireCalls}`})
      return receipt
    },
    verify:async(cert)=>{const valid=await Certificate.fromObject(cert).verify();ledger.checks.push({method:'sdk-signature-verify',valid});return valid},
    stored:async(cert)=>{const found=storageReady&&ledger.certificates.some(item=>item.serialNumber===cert.serialNumber&&item.subject===cert.subject&&item.signature===cert.signature);ledger.checks.push({method:'independent-in-memory-inventory',found});return found},
    publish:async(cert,selected)=>{
      publishCalls++;ledger.calls.push({method:'publish',operationId:`publish-${publishCalls}`,fieldNames:[...selected].sort()})
      // Model the real SDK ordering: wallet action may exist before overlay acknowledgment.
      const acknowledged=!config.publicationFailure
      ledger.publication.push({operationId:`publish-${publishCalls}`,certificateOperationId:'acquire-1',subjectRef:cert.subject===subjectKey?'fixture-subject':'other-subject',family,fields:[...selected],acknowledged,disclosurePossible:true})
      ledger.effects.push({kind:'publication',intentRef:name,operationId:`publish-${publishCalls}`})
      if(!acknowledged)throw new Error('Local overlay fixture failed after public wallet action creation')
      return {status:'success'}
    }
  }
  const attempt=new CertificateAttempt(family,deps)
  const stages=(stage:Stage)=>ledger.stages.push(stage)
  const errors:string[]=[]
  const execute=async()=>{try{await attempt.finish(fields,config.reveal===true,stages)}catch(e){errors.push(e instanceof Error?e.message:'local fixture error')}}
  if(config.concurrent)await Promise.all([execute(),execute()]);else await execute()
  if(config.storageRetry){storageReady=true;await execute()}
  if(config.acquireError)await execute() // Candidate must not blindly acquire twice after unknown outcome.
  const lastStage=ledger.stages.at(-1)||'idle'
  const cert=attempt.certificate
  let signedValid=false
  if(cert){try{signedValid=await Certificate.fromObject(cert).verify()}catch{signedValid=false}}
  const independentlyStored=Boolean(cert&&storageReady&&ledger.certificates.some(item=>item.serialNumber===cert.serialNumber&&item.subject===cert.subject&&item.signature===cert.signature))
  const observedReceipt=cert?{verified:signedValid,operationId:'acquire-1',subjectRef:cert.subject===subjectKey?'fixture-subject':'other-subject',family,issuerRef:cert.certifier===issuerKey?'fixture-issuer':'other-issuer',network:'test',fields:Object.keys(cert.fields)}:undefined
  const packet:any={schemaVersion:1,scope:'local-fixture',isolation:{dedicatedProfile:true,localhostOnly:externalCalls===0},
    release:{expectedIssuerRef:'fixture-issuer',expectedNetwork:'test'},provider:{subjectRef:'fixture-subject',family,fields:Object.keys(fields)},
    wallet:{acquisitionReceipt:observedReceipt,inventoryOperationIds:independentlyStored?['acquire-1']:[]},
    consent:{initialChecked:false,checked:config.reveal===true,explicitActionObserved:config.reveal===true,family,fields:Object.keys(fields)},
    publication:{records:ledger.publication},lookup:{newlyExposedFields:ledger.publication.some(item=>item.disclosurePossible)?Object.keys(fields):[]},
    effects:{records:ledger.effects,expectedIntentLedgerChecked:true},
    ui:{stage:lastStage,issuedClaim:attempt.checked,receiptOperationId:attempt.checked?'acquire-1':undefined,privateClaim:false,recoveryObserved:errors.length>0},
    evidence:{artifactRefs:[]}}
  const observation={caseId:name,scope:'local-synthetic-orchestration',family,configuration:config,sourceSha256:sourceDigest,stageHistory:ledger.stages,checked:attempt.checked,published:attempt.published,acquireCalls,publishCalls,sdkSignatureValid:signedValid,independentInMemoryStored:independentlyStored,calls:ledger.calls,validatorChecks:ledger.checks,effects:ledger.effects,publication:ledger.publication,errorClasses:errors.map(()=>lastStage==='partial'?'publication-or-receipt-partial':'expected-local-rejection'),networkCalls:externalCalls,limitations:['Provider proof/challenge supplied as local fixture input; no email or OAuth run','Inventory is independent in-memory test storage; not persisted real-wallet evidence','Stage observations are actual candidate orchestration callbacks; not React DOM or device interaction']}
  const observedJson=JSON.stringify(observation,null,2)+'\n'
  const artifact=path.join(output,`${name}.json`)
  fs.writeFileSync(artifact,observedJson)
  packet.evidence.artifactRefs=[{path:path.basename(artifact),sha256:hash(observedJson)}]
  const plugins=new Map<string,any>()
  registerSocialCertOracles({registerOracle:(id:string,value:any)=>plugins.set(id,value)},{readEvidence:async()=>packet})
  const refs=config.badSignature||config.wrongSubject||config.acquireError||config.disabled||config.networkMismatch?['no-false-success']:['certificate-possession','terminal-state','at-most-once-effects',config.reveal?'consent-scope':'private-nondisclosure']
  if(config.reveal&&!config.publicationFailure)refs.push('publication-receipt')
  const oracleResults=[]
  for(const name of refs){const result=await plugins.get(`socialcert.${name}`).evaluate({});oracleResults.push({plugin:`socialcert.${name}`,verdict:result.verdict,reason:result.reason})}
  const rejectionExpected=Boolean(config.badSignature||config.wrongSubject||config.acquireError||config.disabled||config.networkMismatch)
  const correctExpectedState=rejectionExpected?!attempt.checked&&!attempt.published&&lastStage==='error':config.publicationFailure?attempt.checked&&!attempt.published&&lastStage==='partial':attempt.checked&&lastStage==='complete'&&attempt.published===(config.reveal===true)
  const noDuplicate=acquireCalls<=(config.disabled||config.networkMismatch?0:1)
  const accepted=correctExpectedState&&noDuplicate&&externalCalls===0&&oracleResults.every(item=>item.verdict==='pass')
  observations.push({path:path.basename(artifact),sha256:hash(observedJson)})
  results.push({caseId:name,fixtureRegressionOutcome:accepted?'pass':'fail',actualDomainTerminal:lastStage,expectedRejection:rejectionExpected,acquireCalls,publishCalls,oracles:oracleResults})
}

try{
  for(const family of ['email','x','discord'] as Family[])await scenario(`${family}-private`,family)
  await scenario('email-publication-acknowledged','email',{reveal:true})
  await scenario('publication-action-then-broadcast-failure','email',{reveal:true,publicationFailure:true})
  await scenario('receipt-storage-recheck-without-reacquisition','email',{storageRetry:true})
  await scenario('parallel-submit-single-acquisition','email',{concurrent:true})
  await scenario('unknown-acquisition-no-blind-retry','email',{acquireError:true})
  await scenario('wrong-subject-rejected','email',{wrongSubject:true})
  await scenario('tampered-signature-rejected','email',{badSignature:true})
  await scenario('wallet-network-mismatch','email',{networkMismatch:true})
  await scenario('family-disabled','email',{disabled:true})
  const summary={runId,completedAt:new Date().toISOString(),scope:'local-synthetic-candidate-orchestration-only',sourceSha256:sourceDigest,domainAdapterSha256:adapterDigest,driverSha256:driverDigest,sdkVersion,nodeVersion:process.version,scenarios:results.length,passed:results.filter(x=>x.fixtureRegressionOutcome==='pass').length,failed:results.filter(x=>x.fixtureRegressionOutcome==='fail').length,networkCalls:externalCalls,results,unexecuted:['Actual browser UI/keyboard/mobile/device journeys','Production or staging provider/email/OAuth requests','Real wallet acquisition/persistence/network transaction','Independent real identity/overlay lookup','Feedback/notification delivery','Full V1 workflow execution/platform dispatch'],proofrunCommercialOutcome:'NOT_ACCEPTED',evidence:observations}
  fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n')
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({schemaVersion:1,scope:summary.scope,artifacts:[...observations,{path:'summary.json',sha256:hash(fs.readFileSync(path.join(output,'summary.json')))}]},null,2)+'\n')
  console.log(JSON.stringify({scope:summary.scope,scenarios:summary.scenarios,passed:summary.passed,failed:summary.failed,networkCalls:externalCalls,proofrunCommercialOutcome:summary.proofrunCommercialOutcome,evidenceDirectory:output},null,2))
  if(summary.failed || externalCalls)process.exitCode=1
}finally{globalThis.fetch=originalFetch}
