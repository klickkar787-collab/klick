# KlickKar Pre-deployment Readiness

Status: **NOT READY FOR PRODUCTION DEPLOYMENT**

Branch: `security-audit/2026-11-06`

This checklist is intentionally conservative. A green frontend build is not proof that authentication, authorization, privacy, persistence, or payment flows are safe.

## Release-blocking findings

### P0 — Server-side identity and access control
- [ ] Replace browser-side password comparison with server-side authentication.
- [ ] Hash passwords using a modern password-hashing algorithm; never store or return plaintext passwords or hashes to the browser.
- [ ] Use secure server-managed sessions (HttpOnly, Secure, SameSite cookies) and session invalidation.
- [ ] Derive identity and role only from the authenticated server session. Ignore client-supplied role/user IDs.
- [ ] Protect every business-data API with role and ownership checks.
- [ ] Customer endpoints must return only that customer's records.
- [ ] Provider endpoints must return only jobs assigned to that provider.
- [ ] Admin endpoints must enforce admin authorization on the server.

### P0 — Remove client-exposed demo credentials and personal sample records
- [ ] Remove demo passwords and quick-login credentials from client source and production bundles.
- [ ] Replace demo accounts with a controlled non-production fixture or server-only test setup.
- [ ] Review seeded names, phone numbers, email addresses, chat histories, booking, invoice, and payment records; remove or safely anonymize personal sample data before public production builds.
- [ ] Verify browser storage and API responses contain no password, hash, session secret, or integration token.

### P0 — Durable business-data persistence
- [x] Select and provision an approved Neon Free development/testing database and isolated development branch. This does not satisfy production database readiness or authorize production use.
- [ ] Establish a production-approved database plan and documented backup/restore path.
- [ ] Migrate users, bookings, quotations, invoices, payments, leads, providers, CMS, and settings to server-side persistence.
- [ ] Establish a tested export, migration, rollback, and restore procedure before importing any live records.
- [ ] Do not use browser localStorage or an in-memory server map as the production system of record.

### P1 — Integration and operational safety
- [ ] Implement and test server-only Telegram integration before configuring a replacement token.
- [ ] Keep Telegram/Gemini credentials out of browser settings, localStorage, client bundles, and logs.
- [ ] Add rate limiting using a verified trusted client-IP strategy and a shared store if multiple instances are used.
- [ ] Review CORS, CSRF, session cookie, security headers, request validation, and error handling.
- [ ] Confirm payment details are not disclosed by the public chatbot. Existing payment/invoice UI is a separate owner-approved workflow and must be regression-tested.

### P1 — Functional regression and quality
- [ ] TypeScript check and production build pass on the exact release commit.
- [ ] Automated tests cover authentication, session expiry/logout, role boundaries, ownership, validation, and failure cases.
- [ ] Browser QA covers desktop/mobile navigation, property listings and gallery, booking modal, Price-on-Request, customer portal, provider portal, admin workflows, CMS, quotations, invoices, payments, AI chat, and backups.
- [ ] Verify no feature or existing record is lost during migration.
- [ ] Verify Render configuration, environment variables, health checks, logs, and rollback plan without deploying.

## Current verification state

- Source-level checks have been performed for the recent chatbot request bounds and payment-disclosure changes.
- A GitHub Actions workflow has been added to run dependency installation, the repository's TypeScript check, and production build on the isolated security branch and on pull requests targeting main.
- [x] Latest TypeScript check and production Vite build passed on commit `61850451e1984642f91c99c508784b9e7f1601e9` (workflow run `42095951633`).
- [x] Nine chatbot safety unit tests plus one Express chat API integration test passed on commit `61850451e1984642f91c99c508784b9e7f1601e9` (10 total, 0 failures).
- [x] Dependency installation reported 0 known vulnerabilities in the resolved dependency tree at that run.
- Earlier successful build output showed the main JavaScript bundle at 952.49 kB (274.58 kB gzip), below the configured 1,000 kB warning threshold but close enough to monitor.
- CI actions were upgraded to current Node 24-runtime major releases to remove the prior Node 20 action-runtime deprecation warning.
- The initial CI run exposed TypeScript errors in invoice/payment status values, bank-transfer enum usage, optional booking type declarations, and missing AppContext provider values. These were corrected, and the subsequent TypeScript check passed.
- Admin create-user and reset-password inputs now mask password text. This is only a UI shoulder-surfing improvement; it does not fix plaintext password storage or client-side authentication.
- npm emitted a warning for a deprecated transitive package and warnings that install scripts for five packages were not covered by npm's allowScripts policy. Build and unit tests passed, but runtime verification of affected integrations remains pending.
- No full browser QA, API integration test suite, database migration test, or restore drill has been completed.
- Render remains configured to deploy from `main`; this branch is not the live deployment source.

## Deployment gate

**Do not merge or deploy while any P0 item is open.** Deployment also requires all applicable P1 checks to pass, review of the exact final diff, a verified backup/restore plan, and explicit owner approval. This file does not authorize merge, deployment, production configuration changes, or DNS changes.


## Additional chatbot payment-disclosure guard — 2026-11-06

- [x] Server-side response guard added before public chatbot replies are returned; common IFSC, labelled bank-account, NEFT/RTGS/IMPS beneficiary, and UPI patterns trigger a safe replacement response.
- [x] Nine unit tests, TypeScript check, and production build passed on commit `b53b5b273af9b90cfdd0bfeb099c21c24b367f0e` (workflow run `42095055106`).
- [ ] Pattern-based output checks are not exhaustive. Test the live Gemini and fallback paths with adversarial prompts in a controlled environment before release.
- [ ] Full browser QA and the P0 authentication, authorization, demo-data, and durable-persistence blockers remain open.


## Chat API integration tests — 2026-11-06

- [x] Added an Express HTTP integration test for the no-Gemini fallback route and request validation.
- [x] 10 tests passed (9 chatbot safety unit tests + 1 API integration test), TypeScript check passed, and production build passed on commit `61850451e1984642f91c99c508784b9e7f1601e9` (workflow run `42095951633`).
- [ ] Real Gemini calls, hostile prompt tests, full browser QA, auth/RBAC, durable persistence, and production backup/restore remain unverified.


## Neon development preparation — 2026-11-06

- [x] Neon Free project `klickkar-dev` created after explicit owner approval.
- [x] Separate `development` branch created; default `production` branch was not changed.
- [x] Initial 19-table schema applied and verified on the development branch only.
- [x] Added `pg` / `@types/pg`, optional pool module, versioned migration runner, and local setup guide on this isolated GitHub branch.
- [x] Added scrypt password hashing and high-entropy session-token hash primitives with unit tests.
- [ ] Application auth/session routes and protected CRUD APIs are not yet connected to PostgreSQL.
- [ ] Local development connection string has not been configured; no secret was committed or shared in chat.
- [ ] CI validation for the newest database/auth changes is pending; do not infer success from earlier CI runs.
- [ ] No production data import, Render configuration, PR, merge, or deployment has occurred.
