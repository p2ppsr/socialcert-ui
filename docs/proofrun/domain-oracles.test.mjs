import test from 'node:test';
import assert from 'node:assert/strict';
import {checks,registerSocialCertOracles} from './domain-oracles.mjs';

const packet=()=>({schemaVersion:1,scope:'local-fixture',isolation:{dedicatedProfile:true,localhostOnly:true},
  evidence:{artifactRefs:['fixture-observation-digest-reference']},release:{expectedIssuerRef:'test-issuer',expectedNetwork:'test'},
  provider:{verified:true,proofValidated:true,subjectRef:'disposable-subject',family:'email',fields:['email']},
  wallet:{acquisitionReceipt:{verified:true,operationId:'acquire-one',subjectRef:'disposable-subject',family:'email',issuerRef:'test-issuer',network:'test',fields:['email']},inventoryOperationIds:['acquire-one']},
  consent:{initialChecked:false,checked:false,fields:['email'],family:'email'},publication:{records:[]},lookup:{newlyExposedFields:[]},
  effects:{records:[{kind:'acquisition',intentRef:'intent-one',operationId:'acquire-one'}],expectedIntentLedgerChecked:true},
  ui:{stage:'complete',issuedClaim:true,receiptOperationId:'acquire-one'}});

test('certificate possession needs wallet inventory, validated receipt and expected issuer',()=>{
  const p=packet(); assert.ok(checks['certificate-possession'](p));
  p.wallet.inventoryOperationIds=[]; assert.equal(Boolean(checks['certificate-possession'](p)),false);
  p.wallet.inventoryOperationIds=['acquire-one']; p.wallet.acquisitionReceipt.issuerRef='other-issuer';
  assert.equal(Boolean(checks['certificate-possession'](p)),false);
});
test('provider/certificate subject mismatch cannot pass binding',()=>{
  const p=packet(); p.provider.subjectRef='other-subject'; assert.equal(Boolean(checks['verification-binding'](p)),false);
});
test('success page cannot override absent wallet acquisition',()=>{
  const p=packet(); p.wallet.inventoryOperationIds=[]; p.wallet.acquisitionReceipt=null;
  assert.equal(checks['terminal-state'](p),false);
  assert.equal(checks['no-false-success'](p),false);
  p.ui={stage:'error',issuedClaim:false,recoveryObserved:true};
  assert.equal(checks['no-false-success'](p),true);
});
test('rejected wrong-subject receipt in inventory must not be claimed as intended issuance',()=>{
  const p=packet(); p.wallet.acquisitionReceipt.subjectRef='other-subject';
  p.ui={stage:'error',issuedClaim:false,recoveryObserved:true};
  assert.equal(checks['no-false-success'](p),true);
  p.ui.issuedClaim=true; assert.equal(checks['no-false-success'](p),false);
});
test('private certificate cannot silently publish an attribute',()=>{
  const p=packet(); assert.equal(checks['private-nondisclosure'](p),true);
  p.publication.records=[{fields:['email']}]; assert.equal(checks['private-nondisclosure'](p),false);
});
test('public receipt requires explicit matching consent and acquisition',()=>{
  const p=packet(); p.consent.checked=true; p.consent.explicitActionObserved=true;
  p.publication.records=[{acknowledged:true,certificateOperationId:'acquire-one',subjectRef:'disposable-subject',family:'email',fields:['email']}];
  assert.equal(checks['publication-receipt'](p),true); assert.equal(checks['consent-scope'](p),true);
  p.publication.records[0].fields=['email','phone']; assert.equal(checks['publication-receipt'](p),false); assert.equal(checks['consent-scope'](p),false);
});
test('duplicate effects after retry cannot pass a unique intended operation',()=>{
  const p=packet(); assert.equal(checks['at-most-once-effects'](p),true);
  p.effects.records.push({kind:'acquisition',intentRef:'intent-one',operationId:'acquire-two'});
  assert.equal(checks['at-most-once-effects'](p),false);
});
test('stuck pending UI needs bounded progress',()=>{
  const p=packet(); p.ui.stage='publishing'; p.ui.progressBounded=false; assert.equal(checks['terminal-state'](p),false);
});
test('wallet action followed by broadcast failure remains partial and cannot claim private',()=>{
  const p=packet(); p.consent.checked=true; p.ui.stage='partial';
  p.publication.records=[{acknowledged:false,disclosurePossible:true,operationId:'public-action-one'}];
  assert.equal(checks['terminal-state'](p),true);
  p.ui.privateClaim=true; assert.equal(checks['terminal-state'](p),false);
  p.ui.privateClaim=false; p.publication.records[0].acknowledged=true;
  assert.equal(checks['terminal-state'](p),false);
});
test('public lookup needs independent result matching the verified subject',()=>{
  const p=packet(); p.lookup={independentRelyingParty:true,status:'found',validated:true,subjectRef:'disposable-subject',issuerRef:'test-issuer',family:'email',humanLabelObserved:true,newlyExposedFields:['email']};
  assert.equal(checks['identity-lookup'](p),true);
  p.lookup.subjectRef='other-subject'; assert.equal(checks['identity-lookup'](p),false);
});
test('phone unavailability cannot pass when a fixture provider request was sent',()=>{
  const p=packet(); p.metadata={phoneEnabled:false}; p.ui.phoneUnavailableObserved=true; p.provider.phoneRequests=[];
  assert.equal(checks['disabled-family-boundary'](p),true);
  p.provider.phoneRequests.push({requestRef:'unexpected'}); assert.equal(checks['disabled-family-boundary'](p),false);
});
test('help link does not fabricate feedback delivery',()=>{
  const p=packet(); p.feedback={surface:'help-link-only'};
  assert.throws(()=>checks['feedback-receipt'](p),e=>e.code==='PROOFRUN_BLOCKED');
});
test('missing or real-production packet blocks oracle evaluation',async()=>{
  const plugins=new Map(); const registry={registerOracle:(name,value)=>plugins.set(name,value)};
  registerSocialCertOracles(registry,{readEvidence:async()=>null});
  await assert.rejects(plugins.get('socialcert.certificate-possession').evaluate({}),e=>e.code==='PROOFRUN_BLOCKED');
  registerSocialCertOracles({registerOracle:(name,value)=>plugins.set(name,value)},{readEvidence:async()=>({...packet(),scope:'production'})});
  await assert.rejects(plugins.get('socialcert.certificate-possession').evaluate({}),e=>e.code==='PROOFRUN_BLOCKED');
});
test('all mandatory plugins are registered and refuse absent proof',async()=>{
  const plugins=new Map(); registerSocialCertOracles({registerOracle:(name,value)=>plugins.set(name,value)},{readEvidence:async()=>packet()});
  assert.equal(plugins.size,19);
  await assert.rejects(plugins.get('socialcert.release-identity').evaluate({}),e=>e.code==='PROOFRUN_BLOCKED');
});
