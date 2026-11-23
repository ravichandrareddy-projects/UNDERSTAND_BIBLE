# SECURITY AND PRIVACY REQUIREMENTS

**Status:** Draft for human review · **Date:** 2026-11-21 · **Not legal advice** — counsel must confirm the legal items before launch.

---

## 1. Why this platform needs more than baseline security

- **Reading habits, highlights and notes can reveal religious belief.** Under the EU GDPR, data revealing religious beliefs is a special category; in India, the DPDP Act applies to all digital personal data. In some countries, exposure of religious activity can put users at risk. We treat all personal reading data as **sensitive by default**.
- **Content integrity is a trust issue.** Altered Scripture text, fake explanations or tampered genealogies would damage the product's core promise.
- **Licence keys and permissions are assets.** Leaking a provider key or exceeding licence limits can end access to licensed texts.

## 2. Legal and policy frame

| Regime | Relevance | Key planning facts (verify with counsel) |
|---|---|---|
| **India — Digital Personal Data Protection Act, 2023** and **DPDP Rules, 2025** | Primary user base and hosting region | Act enacted 11 Aug 2023; Rules notified 14 Nov 2025 with phased commencement: Data Protection Board provisions immediately, Consent Manager framework from 14 Nov 2026, remaining core obligations (notice, consent, security safeguards, breach intimation, rights of data principals) by around 13 May 2027. V1 launch will likely fall near the final phase → **build to full compliance from the start.** Children (under 18 under the Act) require verifiable parental consent — confirm age-gating approach with counsel |
| **EU/EEA — GDPR** | Spanish, Portuguese, French, German users in Europe | Religious-belief data is special-category (Art. 9) → explicit consent or another valid condition; DPIA recommended; EU representative may be needed depending on scale |
| **Other markets** (Brazil LGPD, Indonesia PDP Law, etc.) | Portuguese, Indonesian users | Assess before marketing in those countries |
| **Provider terms** | API.Bible FUMS sends usage pings with device/session IDs; YouVersion sign-in (if ever used) shares data | Disclose in privacy notice; only in V1.1 integrations |

## 3. Privacy requirements

| ID | Requirement |
|---|---|
| PR-01 | **Use without an account.** Reading, parallel view, search and UNDERSTAND work anonymously; positions/highlights stored locally. |
| PR-02 | **Data minimisation.** Account = email (or Google ID), UI language, settings. No phone numbers, contacts, location or demographic fields in V1. |
| PR-03 | **Clear notice and consent** in the user's UI language before account creation and before enabling reminders, sync or analytics; consent records stored (DPDP / GDPR). |
| PR-04 | **Explicit consent for syncing reading data** (positions, history, highlights, notes) because it may reveal religious belief. |
| PR-05 | **Notes encrypted at application level** (envelope encryption with a per-user data key; keys in a KMS). Staff cannot read notes in normal operations. |
| PR-06 | **No advertising or tracking SDKs.** Analytics are privacy-preserving (no cross-site cookies; aggregated; IP truncated), opt-out available; no reading-content events (no "user read Romans 8" events) — only feature usage counts. |
| PR-07 | **No personal data to AI providers.** Explanations are generated offline from public texts. Optional P1 query rewriting sends only the query text, without user identifiers; queries are not retained beyond operational logs (7 days). |
| PR-08 | **Voice privacy.** Audio is never stored; prefer on-device recognition; disclose when a browser vendor's cloud recognizer may be used. V1.1 server ASR deletes audio immediately after transcription. |
| PR-09 | **User rights:** export (JSON + readable HTML), correction, deletion (account and all data within 30 days, backups purged per retention schedule), withdrawal of consent, grievance contact. |
| PR-10 | **Retention schedule:** operational logs 30 days; security logs 1 year; deleted-account data purged from backups within 35 days; analytics aggregates only. |
| PR-11 | **Children:** no targeting of children; if under-18 use is supported, implement verifiable parental consent per DPDP Rules (counsel to define); until then, terms require users to be 18+ or use with a parent/guardian account. |
| PR-12 | **Data location:** primary storage in India; transfers (CDN, email, AI provider) documented in a record of processing. |
| PR-13 | **Breach response:** incident runbook with intimation to the Data Protection Board and affected users within the timelines set by the DPDP Rules, and GDPR 72-hour notification where applicable. |

## 4. Security requirements

Baseline: **OWASP ASVS Level 2** for web and API.

| Area | Requirement |
|---|---|
| Transport | TLS 1.2+ everywhere, HSTS with preload, secure cookies |
| Web | Strict CSP (no inline scripts except hashed), Trusted Types where possible, `X-Content-Type-Options`, `frame-ancestors 'none'` except embed routes |
| Auth | Email magic links (short expiry, single use), Google OAuth (PKCE), passkeys (P1); session rotation; httpOnly SameSite=Lax cookies; CSRF tokens on mutations |
| Authorisation | Per-user ownership checks on every `/v1/me/*` resource; role-based access for review console (editor, theological reviewer, lead, admin) |
| Admin | Mandatory 2FA/passkeys for staff; admin routes on separate host; IP allow-list for ingest/publish actions |
| Input | Schema validation on all inputs (contracts); output encoding; markdown in notes sanitised |
| Rate limiting | Per IP and per account on search, auth, sync, report endpoints; bot detection on sign-up |
| Secrets | Cloud secret manager; rotation every 90 days for provider keys; never shipped to the browser (API.Bible and other licensed keys server-side only) |
| Database | Least-privilege roles (content-read, user-data, ingest, migration); row-level security for user tables as defence in depth; encrypted at rest; PITR |
| Supply chain | Lockfiles, dependency scanning, SBOM, signed container images, pinned GitHub Actions |
| Logging | No note contents, no full queries tied to user IDs; structured security events (auth, admin actions, publish, licence denials) |
| Backups | Encrypted, tested restore quarterly |

## 5. Content integrity

| ID | Control |
|---|---|
| CI-01 | Source files stored read-only with SHA-256; every verse row stores `source_hash`; nightly job re-verifies a sample against sources. |
| CI-02 | Content versions are immutable; publishing requires validation report = pass + named approver; audit log entry. |
| CI-03 | Explanation edits are versioned with diff, editor, time; published explanations cannot be edited in place. |
| CI-04 | Genealogy/timeline curated changes require review (two-person rule for `disputed`/`tradition` edges). |
| CI-05 | API responses for verse text include content version and attribution; offline bundles are signed and verified by the PWA before use. |
| CI-06 | Monitoring alert if any served verse text hash differs from the stored hash (detects tampering in cache/CDN). |

## 6. AI-specific safeguards

| Risk | Control |
|---|---|
| Model invents or alters verses | Models never emit verse text; quotes are placeholders filled from DB (AV-04 n-gram check also catches memorised copyrighted wording) |
| Prompt injection via user query | Queries placed in data fields of a fixed template; outputs parsed as JSON and validated; no tool execution from model output |
| Copyrighted text sent to AI | Licence policy engine denies `ai_process` for non-permitted editions; unit tests over the licensing matrix |
| Provider training on our data | Contract terms checked before use (D-017); prefer zero-retention endpoints |
| Theologically harmful or partisan output | Validators AV-06/AV-07, sensitive-passage register, human review before "Reviewed" label |
| Over-trust | Disclosure labels on every AI-assisted surface; "Report a problem" |

## 7. Threat model (summary)

| Threat (STRIDE) | Example | Mitigation |
|---|---|---|
| Spoofing | Account takeover via email link phishing | Short-lived single-use links; passkeys; new-device notifications |
| Tampering | Altering verse text in DB or CDN | Hashes, immutable versions, CI-06 monitoring, restricted ingest role |
| Repudiation | Reviewer disputes an approval | Signed audit log |
| Information disclosure | Leak of notes/highlights | App-level encryption, RLS, minimal logging, access reviews |
| Denial of service | Search abuse driving cost | Rate limits, caching, CDN, query cost caps |
| Elevation of privilege | Review-console bug lets user publish | RBAC tests, separate admin host, 2FA |

## 8. Compliance deliverables (owner)

| Deliverable | Owner | When |
|---|---|---|
| Privacy notice (14 languages) and terms | Human lead + counsel; Antigravity implements UI | Phase 4 |
| Record of processing & data map | OpenCode (OC-32) + human lead | Phase 3 |
| DPIA (GDPR) / risk assessment | Human lead + counsel | Phase 3 |
| Consent records and rights endpoints | OpenCode (OC-32) | Phase 3 |
| Pen test / security review | External | Before launch |
| Incident response runbook | OpenCode (OC-30) | Phase 4 |

## 9. Sources (checked 2026-11-21)

- PIB note, "DPDP Rules, 2025 Notified" (17 Nov 2025): https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf
- Phased implementation annexure (Govt. of NCT Delhi IT dept.): https://it.delhi.gov.in/sites/default/files/IT/generic_multiple_files/annexure-i.pdf
- AZB & Partners, phased rollout to May 2027: https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/
- API.Bible FUMS reporting parameters: https://docs.api.bible/resources/fair-use
- Web Speech API on-device processing: https://developer.mozilla.org/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
