# KlickKar Security Audit — Current GitHub Branch

Audit date: 2026-11-06  
Audited branch: `security-audit/2026-11-06`  
Baseline production branch: `main` at `7a04d46e9d58cd783ba5b7d8a490db7bb7ee2204`

## Scope and safety

This is a source-code review only. No production deployment, environment-variable change, database migration, DNS change, or modification to `main` was performed. The isolated branch is not connected to the Render production deploy branch.

Do not merge or deploy this branch until the items below are addressed and verified.

## Confirmed findings

### Critical: client-side authentication and role trust
- `src/context/AppContext.tsx` compares submitted passwords against the browser's `users` state.
- Registration stores the submitted password in the client-side user object.
- User records and the current user are persisted in localStorage.
- The selected role is also stored in localStorage. Client-side route/UI checks are not a server authorization boundary.
- `src/data/initialData.ts` contains demo account credentials. They must never be reused for real accounts.

### Critical: business data is browser-local, not a protected shared system
- The AppContext persists bookings, quotations, invoices, leads, payments, users, services, offers, settings, and site content in localStorage.
- Different browsers/devices do not share these records.
- Browser storage can be modified by the visitor and must not be treated as authoritative for payment state, invoice state, user roles, or business records.
- The current server does not expose authenticated CRUD endpoints for these records.

### High: Telegram credential containment
- The previously hard-coded Telegram credential was revoked by the owner.
- The credential literal has been removed from `src/data/companyDetails.ts` on this branch.
- `.env.example` now documents a blank server-only `TELEGRAM_BOT_TOKEN` variable.
- The current `server.ts` has no Telegram Bot API send operation. The UI's lead handling currently updates local app state; therefore the replacement token must not be added to Render until a real server-side integration exists and is tested.
- The revoked credential may remain in old Git history. Because it is revoked, history rewriting is not an urgent production recovery step; do not force-push or rewrite shared history without a separate reviewed plan.

### High: demo and business data bundled with the client
- `src/data/initialData.ts` includes demo users and sample customer, booking, provider, and business records.
- Review the production bundle and replace sample/demo records before treating the portal as a live multi-user business system.
- Do not publish personal, financial, or statutory identifiers in client-side source unless there is a clear public-display requirement.

### Medium: server API scope
- The current GitHub `server.ts` implements the AI chat endpoint and static/Vite serving.
- It does not implement server-side login, session validation, role-based authorization, database persistence, or a Telegram notification endpoint.
- The AI Studio audit report described a newer API surface than this GitHub baseline. Do not assume those routes exist in this branch or copy them without reviewing the actual matching source files.

## Why a quick auth-only patch is unsafe

A server login endpoint alone would not secure this application while the portals continue to read and write business records in browser state. Proper protection requires:
1. A persistent server-side user store with password hashes (never plaintext passwords).
2. Secure server-managed sessions/cookies and logout/session invalidation.
3. Authorization checks on every protected server API, based on the authenticated server session—not a role sent by the browser.
4. Server-side CRUD endpoints for each protected data category.
5. A reviewed migration path for existing localStorage records, with export/backup and restore verification.
6. UI integration that preserves the current login, registration, admin, customer, provider, booking, invoice, and property flows.

Do not replace the current synchronous client login with a temporary in-memory server login: it would lose accounts/sessions on restart and would not secure localStorage-based CRUD.

## Recommended implementation order

1. Select and verify a ₹0 database option and its limits; do not create a paid resource.
2. Design database schema and backup/restore procedure.
3. Implement server-side auth and session tests.
4. Implement protected APIs and role checks for admin/customer/provider operations.
5. Migrate AppContext incrementally from localStorage to API-backed state while retaining a controlled local export/restore path.
6. Implement Telegram notification server-side using only the new secret stored in Render environment settings after branch testing.
7. Run TypeScript, production build, API tests, and manual browser QA.
8. Review the complete diff and obtain explicit approval before merge or deployment.

## Regression checklist

- Public home, About, Contact, all service pages, and property-for-sale pages.
- Property listings, gallery, and Price-on-Request safeguards.
- Customer registration/login/logout and customer-only records.
- Provider login and only assigned job visibility/actions.
- Admin login, user status/password administration, bookings, quotations, invoices, leads, CMS, settings, and backup/restore.
- Booking modal, WhatsApp link, AI chat, Telegram notification, mobile navigation, and responsive layouts.
- Build/lint passes; no secret appears in client bundle, logs, commits, or browser storage.

## Approval boundary

Work may continue on this isolated branch. No merge, pull request, production deploy, Render environment update, DNS change, or destructive migration without explicit approval after risks and rollback steps are explained.


## Additional verified findings — data lifecycle

### Confirmed: 13 localStorage data keys
The current `AppContext.tsx` reads/writes 13 named application keys:
- users and current authenticated user
- role
- services, offers, and site content
- bookings, quotations, invoices, leads, AI sessions, payments, and settings

These keys are not a shared database and are not protected from browser-side inspection or modification.

### High: destructive Reset Data action
- The Admin Dashboard exposes a `Reset Data` button that calls `resetAllData`.
- `resetAllData` calls `localStorage.clear()`, which clears every localStorage key for the site origin—not just KlickKar's named application keys.
- The button has no confirmation step in the reviewed code.
- This can delete unrelated same-origin browser data as well as all locally stored KlickKar records. It does not reset the payments React state in the same function, so its reset behavior is also inconsistent until reload.
- Before production use, this action must be disabled or redesigned as a guarded demo-only reset. If retained, it must target only explicit KlickKar keys, clearly warn about irreversible local data loss, require deliberate confirmation, and include a verified export/restore workflow. Never invoke it on production customer data.

### Implementation note
A safe migration must preserve existing local browser data before any change to storage initialization or reset behavior. Do not run `localStorage.clear()` or any destructive migration against the live site during remediation.


## Database candidate review — no resource created

As of 2026-11-06, Neon documents a $0 Free tier with 1 GB PostgreSQL storage per project, 100 compute-hours per project per month, 5 GB public network transfer per project per month, and compute suspension after 5 minutes of inactivity. If compute-hours or network transfer are exhausted, the project is suspended until the next monthly period; writes that exceed the storage cap fail. These limits make it a plausible zero-cost development/pilot candidate, not a guaranteed always-on production database.

Decision:
- Neon PostgreSQL is the leading technical candidate because this application is an Express/Node app and its business records are relational.
- Do not provision it or put a connection string in Render until the owner explicitly approves the account/resource setup and the free-tier limitations are accepted.
- Before production use, verify backup/export, restore, connection pooling, TLS, and usage monitoring. A free plan with no production SLA is not a reliability guarantee.
- No database has been created, no connection string has been requested, and no billing or hosting setting has been changed.


## Additional verified findings — public AI endpoint and test coverage

### High: public AI API can be abused
- `POST /api/chat` is exposed without authentication or request-rate limiting in the reviewed `server.ts`.
- When `GEMINI_API_KEY` is configured, arbitrary public requests can consume the account's AI quota/cost allowance.
- The route validates that `message` is a string, but accepts `history` as an array and forwards item text without a complete per-item schema/length check.
- Before enabling the AI integration for unrestricted public traffic, add conservative request/body limits, per-IP and global rate limits appropriate for Render's proxy setup, strict history/message validation, safe error handling, and usage monitoring. Preserve a graceful fallback if the AI provider is unavailable.

### Medium: automated test coverage is not configured
- The current `package.json` provides `build` and TypeScript `lint` scripts but no test script or test framework.
- Add tests for authentication, authorization, data ownership, validation, migration/restore, and critical existing UI flows before changing the architecture.
- A successful TypeScript build alone does not prove authentication or business workflows are secure.

## Configuration review — ADMIN_PASSWORD_HASH

- The branch's tracked `.env.example` currently documents `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `APP_URL`; it does not document `ADMIN_PASSWORD_HASH`.
- The reviewed branch's `server.ts` does not read or validate `ADMIN_PASSWORD_HASH` and does not currently implement an admin-authentication endpoint.
- Therefore, a duplicate `ADMIN_PASSWORD_HASH` entry cannot be meaningfully checked against this branch's current server implementation.
- The actual local `.env` file is not available for inspection in this connected repository view. Do not paste or upload its contents. If a local duplicate check is still needed for another version of the project, inspect only the variable names/count locally and keep all values private.

## Historical finding — public AI prompt contained payment details

- The initial audit found company, statutory, contact, and bank-transfer information in the AI system prompt, with bank-transfer details also present in the no-Gemini fallback for tax/invoice keywords.
- The owner has since confirmed that bank-transfer details must not be disclosed by the public chatbot. The remediation and its verification are recorded in the payment-disclosure section below.
- Never place bank-transfer details or private account access data in the client bundle. Customers should obtain verified payment instructions through the official helpline or an official itemized invoice.

## Remediation progress — Reset Demo Data action

- On this isolated branch, the Admin Dashboard action is now labelled `Reset Demo Data`.
- The reset handler asks for explicit browser confirmation and warns that locally saved KlickKar records will be replaced; it advises exporting a backup first.
- It removes only the 13 named KlickKar localStorage keys instead of calling `localStorage.clear()`, so unrelated same-origin application keys are not intentionally cleared.
- It now resets the payments state as well, which the previous handler omitted.
- This is a source-level remediation only. It has not yet been built or browser-tested, and it is not deployed. Do not use the reset action on production data until backup/export and restore have been verified.



## Remediation progress — public chat request hardening

- `server.ts` now caps parsed JSON request bodies at 16 KB.
- `POST /api/chat` rejects non-object bodies, missing/blank messages, messages over 2,000 characters, non-array history, malformed history entries, unsupported history roles, individual history entries over 1,500 characters, and recent history text over 8,000 characters.
- The server continues to use only the most recent eight history entries, matching the prior behavior.
- Oversized and malformed JSON bodies now receive consistent JSON 413/400 responses.
- The Express `X-Powered-By` response header is disabled.
- These changes are source-level only. They have not yet passed a local TypeScript build, production build, API tests, or browser QA. They are not deployed.

### Chatbot frontend compatibility follow-up
- The chat widget now sends only the most recent eight prior messages, matching the server's history window and avoiding unbounded history growth in request bodies.
- The chat input now has a 2,000-character maximum, matching the server's message validation.
- The widget's message role type is `user | model`, matching the server's accepted roles.
- Source review verified both frontend limits are present. Runtime and build verification are still pending.

### Rate limiting remains open
- Render's current guidance explains that requests pass through Cloudflare and Render load balancers and recommends application-level rate limiting using the client IP from forwarded request metadata. Express warns that forwarded headers must only be trusted when the exact proxy chain is understood and configured correctly.
- We have not yet verified the exact client-IP value observed by this service, so no per-IP rate limiter or proxy-trust setting has been added. A wrong configuration could make every visitor share one limit or allow spoofed IP values to bypass the limit.
- Next safe step is to validate the client-IP source in a controlled non-production environment, then add a limiter with a shared store if the service ever runs multiple instances. The current Render service has one instance, but the free instance can restart and in-memory counters would reset.

### Payment disclosure — owner decision and branch remediation
- Owner explicitly confirmed that bank-transfer details must **not** be disclosed by the public chatbot.
- On this isolated branch, the bank-detail line has been removed from the AI system instruction and the prompt now explicitly prohibits disclosing or confirming bank account numbers, IFSC codes, payment credentials, or other bank-transfer details, including details appearing in chat history.
- The GST/invoice fallback no longer includes bank details. It directs customers to request verified payment instructions through the official helpline or an official itemized invoice.
- Source review verified that the bank details are absent from the system-instruction block and the old fallback wording is absent.
- This is a source-level change only. Build, runtime chatbot tests (including Gemini and fallback paths), and browser QA are still pending. It is not deployed.
- Source review also found that the existing Payment Modal and GST Invoice UI read bank details from company settings and render them as part of the payment/invoice workflow. Those screens were not changed because the owner's explicit decision concerned public chatbot disclosure; changing them could alter the existing payment flow. Treat any broader removal from payment screens as a separate owner decision.


## CI verification and type fixes — 2026-11-06

- Added `.github/workflows/predeploy-checks.yml` to run dependency installation, `npm run lint` (TypeScript `tsc --noEmit`), and `npm run build` on the isolated security branch and pull requests to main.
- First TypeScript run failed with errors in invoice/payment status literals, bank-transfer payment-mode literals, `addBooking`'s optional `bookingType` type, and the AppContext provider value omitting properties already declared in its interface.
- Fixed those type mismatches: use `Pending` instead of unsupported `Unpaid`, use the supported `Bank Transfer` payment mode, exclude `Refunded` from pending-revenue totals instead of comparing an invoice payment status to booking status `Cancelled`, omit `bookingType` before making it optional in the add-booking input, and expose the already-implemented payment/legal context members from the provider value.
- Admin user-create and password-reset form inputs now use password masking and `autocomplete=new-password`.
- Successful GitHub Actions run: `42092514485`, commit `0a9f25bbcab8a0ce616add6783e0d4828cd136fe`. Both TypeScript check and production build passed. npm reported 0 known vulnerabilities in the resolved dependency tree.
- Build output: Vite 8.3.6; main JS bundle 952.49 kB (274.58 kB gzip), under the configured 1,000 kB warning threshold.
- npm still emitted a deprecated transitive dependency warning and warnings that install scripts for five packages were not covered by npm's `allowScripts` policy. Build success does not replace runtime tests of Gemini/other integrations.
- These results validate compilation and bundling only. The P0 authentication, authorization, client-exposed demo records, and durable database persistence blockers remain open; no deployment is authorized.


## Chatbot lead-data validation and unit tests — 2026-11-06

- Moved model-generated lead-tag parsing into `src/server/chatSafety.ts`, a pure helper.
- The helper accepts only an object, copies only the five allowed lead fields, requires string values, trims them, applies field-specific length limits, and strips internal lead-capture markup even when the JSON is malformed or not an object.
- Added four Node test-runner cases covering allowed fields/trim, length limits, malformed and non-object payloads, and ordinary replies with no marker.
- The chatbot widget now clips each historical entry to the server's 1,500-character limit and drops oldest history entries until the aggregate is at most 8,000 characters, while retaining at most eight entries.
- GitHub Actions workflow now runs unit tests, TypeScript check, and production build; actions were updated to current Node 24-runtime releases.
- The earlier successful run `42093513575` passed the original 4-test suite; the latest run and expanded 7-test coverage are recorded below. npm reported 0 known vulnerabilities in the resolved dependency tree.
- This does not constitute a full API integration or browser test. The P0 authentication, authorization, public demo data, and database persistence blockers remain open.


## Public chatbot bank-detail output guard — 2026-11-06

- Added `sanitizePublicChatReply` in `src/server/chatSafety.ts`; the complete Gemini output is checked before lead metadata is parsed, so sensitive details cannot leak through either the visible reply or the returned lead fields.
- If the output matches common IFSC-code, labelled bank-account-number, NEFT/RTGS/IMPS transfer-reference, labelled UPI/VPA, or common bank-linked UPI-handle patterns, the entire output is replaced with safe payment guidance.
- The deterministic fallback remains free of bank-transfer details. The system instruction continues to prohibit disclosure, including when the user asks directly or includes details in chat history.
- Added five tests covering IFSC, bank-account/UPI, ordinary helpline replies, details hidden inside lead metadata, and labelled UPI/transfer references. The suite now passes 9/9 tests.
- Latest GitHub Actions run: `42095055106`, commit `b53b5b273af9b90cfdd0bfeb099c21c24b367f0e`; unit tests (9/9), TypeScript check, and production build all passed. npm reported 0 known vulnerabilities in the resolved dependency tree.
- Build output on the prior successful run: Vite 8.3.6; main JavaScript bundle 952.61 kB (274.64 kB gzip), below the configured 1,000 kB warning threshold.
- The guard is pattern-based, not a guarantee against every possible obfuscation or novel payment identifier. Runtime tests with the real model, adversarial prompts, and browser QA are still required. This change is isolated to the security branch and is not deployed.
