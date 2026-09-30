// Product-owned adapter for independent LOCAL fixture evidence. No network, provider,
// wallet action or production acceptance is performed by this module.
export function blocked(message) {
  const error = new Error(message);
  error.code = 'PROOFRUN_BLOCKED';
  return error;
}

const requireFact = (packet, key) => {
  const value = key.split('.').reduce((item, field) => item?.[field], packet);
  if (value === undefined || value === null) throw blocked(`Missing independent fixture evidence: ${key}`);
  return value;
};
const array = (packet, key) => {
  const value = requireFact(packet, key);
  if (!Array.isArray(value)) throw blocked(`Expected independent evidence ledger: ${key}`);
  return value;
};
const sameSet = (a, b) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort());
const certificate = (p) => {
  const receipt = requireFact(p, 'wallet.acquisitionReceipt');
  return receipt.verified === true && receipt.operationId && receipt.subjectRef === requireFact(p,'provider.subjectRef')
    && receipt.family === requireFact(p,'provider.family')
    && receipt.issuerRef === requireFact(p,'release.expectedIssuerRef')
    && receipt.network === requireFact(p,'release.expectedNetwork')
    && sameSet(receipt.fields || [], array(p,'provider.fields'))
    && array(p,'wallet.inventoryOperationIds').includes(receipt.operationId);
};

export const checks = {
  'release-identity': (p) => {
    const r=requireFact(p,'release');
    for(const field of ['uiRevision','backendRevision','uiArtifactDigest','backendArtifactDigest','expectedUiRevision','expectedBackendRevision','expectedUiArtifactDigest','expectedBackendArtifactDigest']) requireFact(p,`release.${field}`);
    return Boolean(r.uiRevision && r.backendRevision && r.uiArtifactDigest && r.backendArtifactDigest)
      && r.uiRevision===r.expectedUiRevision && r.backendRevision===r.expectedBackendRevision
      && r.uiArtifactDigest===r.expectedUiArtifactDigest && r.backendArtifactDigest===r.expectedBackendArtifactDigest;
  },
  'family-availability': (p) => {
    const enabled=array(p,'metadata.families').filter(f=>f.enabled===true).map(f=>f.name);
    return requireFact(p,'metadata.contractChecked')===true && !enabled.includes('phone')
      && sameSet(enabled,array(p,'ui.offeredFamilies'));
  },
  'wallet-permission-baseline': (p) => requireFact(p,'permissions.recorded')===true
    && requireFact(p,'permissions.dedicatedProfile')===true
    && ['fresh','returning'].includes(requireFact(p,'permissions.startingState')),
  'no-side-effects': (p) => array(p,'effects.records').length===requireFact(p,'effects.expectedInitialCount'),
  'accessible-controls': (p) => array(p,'accessibility.violations').length===0
    && requireFact(p,'accessibility.keyboardObserved')===true && requireFact(p,'accessibility.zoomObserved')===true
    && requireFact(p,'accessibility.focusAndLabelsObserved')===true,
  'challenge-delivery': (p) => requireFact(p,'challenge.deliveryAcknowledged')===true
    && requireFact(p,'challenge.requestCorrelation')===requireFact(p,'challenge.deliveryCorrelation')
    && requireFact(p,'challenge.policyChecked')===true,
  'verification-binding': (p) => requireFact(p,'provider.verified')===true
    && requireFact(p,'provider.proofValidated')===true && certificate(p),
  'certificate-possession': certificate,
  'private-nondisclosure': (p) => requireFact(p,'consent.checked')===false
    && array(p,'publication.records').length===0 && array(p,'lookup.newlyExposedFields').length===0,
  'terminal-state': (p) => {
    const stage=requireFact(p,'ui.stage');
    const issued=Boolean(p.wallet?.acquisitionReceipt?.verified===true
      && p.wallet?.inventoryOperationIds?.includes(p.wallet.acquisitionReceipt.operationId));
    const publicationRecords=array(p,'publication.records');
    const published=publicationRecords.some(r=>r.acknowledged===true);
    // Wallet action creation can expose revelation material before overlay acknowledgment.
    // Failed broadcast cannot establish that previously attempted publication stayed private.
    if(p.ui.privateClaim===true && publicationRecords.some(r=>r.disclosurePossible===true)) return false;
    if(requireFact(p,'ui.issuedClaim')!==issued) return false;
    if(p.ui.receiptOperationId && p.ui.receiptOperationId!==p.wallet?.acquisitionReceipt?.operationId) return false;
    if(['verifying','issuing','publishing'].includes(stage)) return requireFact(p,'ui.progressBounded')===true;
    if(['issued','partial'].includes(stage)) return issued && !published;
    if(stage==='complete') return issued && (requireFact(p,'consent.checked')===false || published);
    return stage==='error' && requireFact(p,'ui.recoveryObserved')===true;
  },
  'invalid-verification-no-issuance': (p) => requireFact(p,'provider.invalidOrExpired')===true
    && array(p,'wallet.inventoryOperationIds').length===0 && array(p,'publication.records').length===0
    && !array(p,'effects.records').some(r=>['acquisition','signing','publication'].includes(r.kind)),
  'consent-scope': (p) => {
    if(requireFact(p,'consent.initialChecked')!==false) return false;
    const records=array(p,'publication.records');
    if(requireFact(p,'consent.checked')===false) return records.length===0;
    return requireFact(p,'consent.explicitActionObserved')===true && records.every(r=>r.family===p.consent.family
      && sameSet(r.fields || [],array(p,'consent.fields')));
  },
  'safe-evidence': (p) => requireFact(p,'evidence.redactionChecked')===true
    && requireFact(p,'evidence.sampleReviewed')===true && array(p,'evidence.sensitiveFindings').length===0,
  'at-most-once-effects': (p) => {
    const records=array(p,'effects.records');
    const ids=new Set();
    for(const r of records){
      if(!r.kind || !r.intentRef || !r.operationId) throw blocked('Incomplete independent operation receipt');
      const key=`${r.kind}:${r.intentRef}`;
      if(ids.has(key)) return false;
      ids.add(key);
    }
    return requireFact(p,'effects.expectedIntentLedgerChecked')===true;
  },
  'publication-receipt': (p) => certificate(p) && requireFact(p,'consent.checked')===true
    && array(p,'publication.records').some(r=>r.acknowledged===true
      && r.certificateOperationId===p.wallet.acquisitionReceipt.operationId
      && r.subjectRef===p.wallet.acquisitionReceipt.subjectRef
      && r.family===p.consent.family && sameSet(r.fields || [],array(p,'consent.fields'))),
  'identity-lookup': (p) => requireFact(p,'lookup.independentRelyingParty')===true
    && requireFact(p,'lookup.status')==='found' && requireFact(p,'lookup.validated')===true
    && requireFact(p,'lookup.subjectRef')===requireFact(p,'wallet.acquisitionReceipt.subjectRef')
    && requireFact(p,'lookup.issuerRef')===requireFact(p,'release.expectedIssuerRef')
    && requireFact(p,'lookup.family')===requireFact(p,'provider.family')
    && requireFact(p,'lookup.humanLabelObserved')===true
    && sameSet(array(p,'lookup.newlyExposedFields'),array(p,'consent.fields')),
  'no-false-success': (p) => requireFact(p,'ui.issuedClaim')===false
    && !p.ui.receiptOperationId && (array(p,'wallet.inventoryOperationIds').length===0
      || (p.wallet.acquisitionReceipt && !certificate(p)))
    && ['partial','error'].includes(requireFact(p,'ui.stage')),
  'disabled-family-boundary': (p) => requireFact(p,'metadata.phoneEnabled')===false
    && requireFact(p,'ui.phoneUnavailableObserved')===true && array(p,'provider.phoneRequests').length===0,
  'feedback-receipt': (p) => {
    if(requireFact(p,'feedback.surface')==='help-link-only') throw blocked('Help link is not feedback delivery');
    const receipts=array(p,'feedback.receipts');
    const acknowledged=receipts.some(r=>r.acknowledged===true && r.intentRef===requireFact(p,'feedback.intentRef'));
    return requireFact(p,'ui.feedbackConfirmed')===acknowledged
      && (acknowledged || requireFact(p,'ui.recoveryObserved')===true);
  }
};

export function registerSocialCertOracles(registry, {readEvidence} = {}) {
  if(typeof readEvidence!=='function') throw blocked('Independent fixture evidence reader is required');
  for(const [name,check] of Object.entries(checks)){
    registry.registerOracle(`socialcert.${name}`, {
      async evaluate(context){
        const p=await readEvidence(context);
        if(!p || p.schemaVersion!==1 || p.scope!=='local-fixture'
          || p.isolation?.dedicatedProfile!==true || p.isolation?.localhostOnly!==true) {
          throw blocked('Missing or nonisolated local fixture evidence packet');
        }
        const refs=array(p,'evidence.artifactRefs');
        if(refs.length===0) throw blocked('No immutable observation evidence references');
        const passed=Boolean(check(p));
        return {verdict:passed?'pass':'fail',title:`SocialCert ${name}`,
          reason:passed?'Independent local fixture ledger and observed UI satisfy the criterion.':'Independent local fixture state does not satisfy the criterion.',
          confidence:1,evidence:refs};
      }
    });
  }
  return registry;
}
