# SocialCert commercial readiness

First remediation wave: clearer account-control purpose, truthful certificate/publication states, supported-family availability and recovery, plus reusable ProofRun acceptance contracts. Runtime availability is supporting evidence; no live issuance/provider/publication/device flow has been accepted by these documents.

## Required acceptance inventory

Use the eight IDs in [ProofRun coverage](proofrun/README.md): onboarding, Email, X, Discord, privacy/public identity lookup, recovery, telephone unavailable and feedback. New workflows are `proofrun.dev/v1`; matching legacy audit definitions support the current Network Ops scanner. All are **NOT RUN**. Adding YAML or compiling it does not change the readiness status to passed.

Exact frontend/backend source and deployed artifact identities must be reconciled for each candidate. A successful provider verification must create an actual certificate receipt before issuance is claimed. Public disclosure is explicit, optional and a separate operation; publication/lookup failure should preserve a successfully issued certificate and offer the correct retry. Independent wallet/provider/backend/lookup oracles, consent, at-most-once effect checks and private evidence redaction gate completion.

## Release gate

| Gate | Evidence required |
|---|---|
| Scope and runtime | Current public discovery metadata, supported families/wallet/browser offer, exact frontend/backend source/build/digest, dependency health and ownership |
| Functional issuance | Separate current passing Email/X/Discord cases on approved disposable identities; verified subject binding and wallet possession, not success text |
| Privacy and useful identity | Private certificate remains undisclosed; explicit public case has scoped publication acknowledgment and independent human-readable identity lookup |
| Recovery | Invalid/expired proof, denial/unavailable wallet/provider, issuance failure, partial publication, pending/back/refresh and bounded retry agree with domain state; no false-success or unintended duplicate effects |
| Usability/accessibility | Purpose/next use/requirements/consequences understood without coaching; keyboard/focus/labels/zoom and declared actual mobile/wallet handoff coverage. Desktop fixtures do not certify native or physical devices. |
| Support/observability | Queryable redacted success/failure stage events correlated to release; help accessible from failures; feedback delivery separately proved where offered |
| Data/lifecycle | Named data owner, backup/restore/retention policy and honest expiry/revocation/removal/compromise support; do not claim current unsupported revocation exists |
| Catalogue | Existing canonical listing verified read-only against the current domain and refreshed within the configured window; stale evidence does not itself require paid republishing |
| ProofRun | Required definitions plus recent complete passing run summaries and immutable evidence for the exact affected candidate; no required warn/fail/blocked criterion |
| Operations/economics | Evans/CARS source-owned availability/rollout/drain/rollback and monitoring; approved bounded all-attempt pilot cost, cleanup and operator capacity. Economic policy is not proof of runtime cost enforcement. |

Independent production execution, actual fixture driver/evidence-collector integration and target-user acceptance remain open. Initial V1 documents compile only a local desktop fixture lane with zero paid/model/provider execution. A product-owned adapter provides the SocialCert plugins and negative verifier tests; the stock runner needs that adapter plus independently collected scenario receipts before executing the contract. Add actual device/wallet profiles and their validated reset/permission fixtures before advertising their coverage. Telephone remains unavailable until a separately scoped provider/product decision; testing should not activate it.

## Contract and approval dependencies

Proposed [BRC-200 certifier operations](https://github.com/bsv-blockchain/BRCs/pull/286) and [BRC-201 Social family profile](https://github.com/bsv-blockchain/BRCs/pull/287) are drafts awaiting owner review. Pin reviewed revisions for adapter subject/family/identifier/lifecycle acceptance; do not treat existing code or draft publication as normative/deployed conformance. Concurrent W3C DID/VC work is a future adapter dependency and is not duplicated here.

Implementation/deployment authorization does not silently authorize creating provider accounts, increasing paid quotas, changing provider permissions, issuing real certificates, revealing real public attributes, submitting notifications or allocating paid device/model resources. Use a separate bounded work order for those test actions. September 29 economic requirements prohibit resuming the old broad paid matrix; unknown fees/labor/reset/owned-capacity costs are not zero. Documentation and local fixture checks can proceed without those external resources.

## Staging and promotion

The checked-in UI workflow releases CARS project 1 on `master` or manual dispatch; the backend workflow explicitly deploys production on `master`/`production` and its scripts reject other environments. There is no current source-owned staging path in those workflows. Do not point them at historical `staging.socialcert.net` or `staging-backend.socialcert.net` and assume isolation.

The safe first check is a local UI with intercepted mock providers/wallet/feedback and an isolated local backend/database fixture. Before any cluster staging, root should define a separate Evans namespace/database/issuer/test network, provider test configuration, Gateway route/certificate and CARS project or candidate preview with its own backend URL. Production credentials/issuer key/database/OAuth callback registration must not be reused merely for convenience. Source-owned staging manifests and deployment tooling need review; do not copy the production script with a substituted hostname and call it safe staging.

Source references: [UI deployment workflow](../.github/workflows/deploy.yaml), and the backend repository's `.github/workflows/deploy-production-local.yml`, `scripts/k8s/deploy-local.sh`, `scripts/k8s/build-local-image.sh`, `infra/kubernetes/overlays/prod/`. Root/Network Ops owns staging infrastructure and promotion. No staging resources were created by this documentation wave.

## Local assurance achieved

The product-owned fixture driver executes the candidate `CertificateAttempt` with actual SDK test-certificate signature verification and independent in-memory receipt/effect ledgers. Its 12 scenarios cover private Email/X/Discord, accepted publication, uncertain publication after wallet action, receipt recheck, concurrent calls, unknown acquisition, wrong subject, tampered signature, network mismatch and disabled family. This proves bounded synthetic orchestration behavior only. No full V1 browser workflow, production provider/API, real-wallet persistence, actual public lookup, feedback send, mobile/device or customer acceptance was executed by this driver. The separate frontend tests/browser checks remain separately scoped evidence.

`/metadata` verification age 900 seconds is a prospective policy/descriptor contract. Preverified local fixtures do not establish real challenge expiry or production issuer/provider enforcement. Preserve that gap in rollout acceptance rather than interpreting metadata reachability as a security or issuance pass.
