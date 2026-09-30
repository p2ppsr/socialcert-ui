# Required independent domain oracles

All names below are product-owned plugins, deliberately separate from model judgment. The preset declares them and [domain-oracles.mjs](domain-oracles.mjs) supplies local fixture checks; the stock ProofRun runner does not register them. A controlled fixture driver must connect an independent evidence reader, register the required plugins and enforce admission before actions. No missing result, stale evidence, empty screenshot or narrative inference may become a pass. No security exploitation is part of these contracts.

Each result carries a redacted action/case correlation reference, relevant immutable artifact/source identity and observation evidence. Implementors should return blocked/inconclusive admission when evidence/resources are absent; only evaluated assertions yield pass/fail. Avoid retaining raw tokens, codes, identity keys, emails, profiles or certificate bodies.

## Product-owned integration boundary

The adapter registers 19 plugins into an injected V1 registry without changing the core or stock runner. It performs no network calls, provider sends, wallet operations or signing. Missing/nonisolated/nonlocal packets throw `PROOFRUN_BLOCKED`. A future driver can wrap its existing runner context:

```js
import { registerSocialCertOracles } from './domain-oracles.mjs';
// registry and fixtureLedger belong to a reviewed isolated driver/harness.
registerSocialCertOracles(registry, {
  readEvidence: async (context) => fixtureLedger.packetFor({
    caseId: context.caseSpec.caseId,
    plugin: context.definition.plugin,
    stepId: context.step.id,
    assertionId: context.assertion?.id,
  }),
});
```

The reader returns immutable scenario-specific snapshots. Select the private snapshot for nondisclosure assertions and the public snapshot for lookup assertions; select valid-acquisition versus invalid-verification snapshots separately. End-of-journey assertions must reference the relevant prior snapshot rather than accidentally using the latest reset/error state. Each snapshot must trace to actions the driver actually performed on the candidate, not a hand-written success packet.

Common packet boundary: `schemaVersion: 1`, `scope: local-fixture`, `isolation.dedicatedProfile: true`, `isolation.localhostOnly: true`, and nonempty `evidence.artifactRefs` referencing retained observation artifacts. Criterion facts use independent `release`, `metadata`, `permissions`, `challenge`, `provider`, `wallet`, `consent`, `publication`, `lookup`, `effects`, `feedback`, `accessibility` and corroborating `ui` ledgers. The exact field keys are in the adapter and test examples. The reader must verify artifact identity/integrity and source provenance before returning the packet; an arbitrary JSON packet is not trustworthy evidence.

`wallet.acquisitionReceipt.verified` and `provider.proofValidated` must be produced by independent fixture/contract validators, never copied from UI success flags. Receipt subject/issuer references are local opaque fixture labels, not personal data. At-most-once records identify each intentional operation with `kind`, `intentRef`, `operationId`; separate intended reissuance must get a distinct intent instead of being misreported as a duplicate. Production packets are rejected by this adapter; real issuance requires a separately reviewed evidence adapter and approved bounded work order.

Publication records must distinguish `acknowledged: true` from an attempted/uncertain record. Set `disclosurePossible: true` when wallet action creation exposed revelation material even if a later overlay broadcast failed. A truthful partial state can pass with an unacknowledged record, but `ui.privateClaim: true` cannot pass after a disclosure-possible attempt. Do not infer nondisclosure from a failed SDK call, or retry an uncertain wallet action merely because its overlay acknowledgment is absent. Independent receipt/effect reconciliation determines whether retry is safe.

| Plugin | Independent observation and acceptance |
|---|---|
| `socialcert.release-identity` | UI/backend build/source and digest tuple matches the candidate; fixture configuration and oracle/runner versions are pinned. A page title/image tag alone is insufficient. |
| `socialcert.family-availability` | Confirm the candidate's public discovery contract (`/metadata` in the coordinated first wave) and configured issuer/network/family fields. UI choices agree with explicitly enabled families; telephone stays unavailable. Provider entitlement still needs separate evidence for a real run. |
| `socialcert.wallet-permission-baseline` | Isolated wallet identity/profile and origin/action permission inventory are established before interaction; fresh vs standing approvals are recorded. Missing prompt alone is not failure when an approved standing permission explains it. |
| `socialcert.no-side-effects` | Controlled request/action ledger remains unchanged on landing, missing-wallet and telephone unavailable steps. No challenge, issuance, disclosure, feedback or spend occurs without intent. |
| `socialcert.accessible-controls` | Automated accessibility results plus keyboard/focus/label/zoom evidence on the exact page; important controls and errors are perceivable/reachable. This is bounded browser evidence, not a blanket WCAG conformance claim. |
| `socialcert.challenge-delivery` | Controlled mailbox/provider delivery receipt and challenge issuance record correlate with the request and declared TTL/attempt policy, without storing code or mailbox contents. UI progress agrees. |
| `socialcert.verification-binding` | Controlled provider verification receipt is bound to the same subject, family, session and requested attributes as the acquired certificate. Use the reviewed contract and independent validator, not client-supplied success flags. |
| `socialcert.certificate-possession` | Wallet acquisition response and independent wallet certificate possession/verification agree on issuer, subject, family/type, fields/signature and expected network. Safe receipt correlation proves the exact requested acquisition; a toast or HTTP 200 is insufficient. |
| `socialcert.private-nondisclosure` | No new publication call or overlay attributes exist for the declared private case; independent lookup does not expose the fixture's new attributes. Existing deliberately public returning state must be declared separately. |
| `socialcert.terminal-state` | Observed transition ledger and actual domain receipts agree with visible verifying/issuing/issued/publishing/complete/partial/error state. Pending states have progress/time bounds; reload/direct result route does not fabricate completion. |
| `socialcert.invalid-verification-no-issuance` | Invalid/expired/denied local verification fixture produces no acquisition/signing/publication record. Recover only through a new eligible challenge/provider proof. Do not send adversarial requests to production. |
| `socialcert.consent-scope` | Initial explicit unchecked choice and selected family/attributes are captured; exactly that choice reaches publication. No inherited cross-family toggle or retry broadens disclosure. |
| `socialcert.safe-evidence` | Before retaining artifacts, redaction checks and manual sample review exclude credentials/codes/OAuth data/contact/profile PII/auth/raw certificates/transactions. Useful counts, error classes and receipts remain queryable. |
| `socialcert.at-most-once-effects` | Independent local operation ledger verifies acquisition, publication, feedback and any paid effects only occur as intentionally declared after retry/double-click/refresh. Correlation/idempotency mechanism follows the product contract; do not assume exactly one certificate is normative for every product policy. |
| `socialcert.publication-receipt` | Independent publication acknowledgment and expected scoped overlay submission/state match the acquired certificate and explicit disclosure consent. An issued certificate alone is not publication. |
| `socialcert.identity-lookup` | Independent relying-party lookup resolves the declared disposable public attributes to the expected verified subject/issuer/trust/family, with useful human label; unavailable/not-found differ. No fallback to fabricated names or private fields. |
| `socialcert.no-false-success` | Acquisition failure after valid provider proof and absent-runtime-receipt result deep links do not display an issued receipt or success claim. Existing legitimate receipts are handled only in their declared returning case. |
| `socialcert.disabled-family-boundary` | Candidate UI/deep-link/public contract says telephone unavailable; local routed fixture observes no SMS/provider call or unsupported issuance. Do not activate providers to make a test pass. |
| `socialcert.feedback-receipt` | Approved local feedback record/outbox receipt matches the labelled disposable submission exactly once and agrees with UI acknowledgment. Help/mailto/link-only surfaces leave delivery criterion blocked. Live notification delivery requires a separately approved send. |

Binding, cryptography, lifecycle and presentation requirements should be pinned to reviewed contracts, including the proposed BRC-200/BRC-201 revisions when accepted by the owner. Their draft existence is not deployed conformance. This authoring wave does not implement revocation or DID/VC adapters.
