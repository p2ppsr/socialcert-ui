# Deterministic fixture interaction contract

These selectors were coordinated with the first-wave frontend implementation. Check them against the exact candidate build before execution; selector presence alone is not a domain oracle.

| UI contract | Meaning |
|---|---|
| `main[data-testid="socialcert-main"]` | Main content landmark |
| `[data-testid="wallet-status"]`, `wallet-retry` | Wallet guidance and recovery |
| `family-email`, `family-x`, `family-discord` | Supported family entry buttons |
| `phone-unavailable` | Honest telephone availability statement |
| `email-address`, `send-code` | Email challenge request |
| `verification-code`, `verify-code`, `resend-code`, `change-address` | Challenge confirmation and recovery |
| `publication-consent` | Explicit unchecked-by-default disclosure choice |
| `oauth-start` | Explicit provider handoff |
| `flow-status[data-stage]` | Stage: verifying, issuing, issued, publishing, complete, partial or error |
| `retry-issuance`, `retry-publication` | Separate recovery boundaries |
| `certificate-receipt` | Receipt rendered only from actual acquisition result |
| `publication-status` | Separate publication outcome |
| `start-over`, `help` | Safe restart and help |

For names without a full selector in the table, use `[data-testid="<name>"]`. Do not scrape personal attributes or tokens into logs. Direct `/VerifyResult/success` navigation must not produce a certificate claim without the runtime receipt. Legacy phone deep links must explain unavailability and produce no SMS request. Confirm the backend discovery endpoint and metadata version against the candidate source before implementing the `family-availability` oracle.
