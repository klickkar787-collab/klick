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
- [ ] Select and provision an approved database with a documented backup/restore path.
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
- [x] TypeScript check passed on commit `0a9f25bbcab8a0ce616add6783e0d4828cd136fe` (workflow run `42092514485`).
- [x] Production Vite build passed on the same commit. Vite reported the main JavaScript bundle at 952.49 kB (274.58 kB gzip); it is below the configured 1,000 kB warning threshold but close enough to monitor.
- [x] Dependency installation reported 0 known vulnerabilities in the resolved dependency tree at that run.
- The initial CI run exposed TypeScript errors in invoice/payment status values, bank-transfer enum usage, optional booking type declarations, and missing AppContext provider values. These were corrected, and the subsequent TypeScript check passed.
- Admin create-user and reset-password inputs now mask password text. This is only a UI shoulder-surfing improvement; it does not fix plaintext password storage or client-side authentication.
- npm emitted warnings for a deprecated transitive package and install scripts not covered by npm's allowScripts policy. The build passed, but runtime verification of affected integrations remains pending.
- No full browser QA, API integration test suite, database migration test, or restore drill has been completed.
- Render remains configured to deploy from `main`; this branch is not the live deployment source.

## Deployment gate

**Do not merge or deploy while any P0 item is open.** Deployment also requires all applicable P1 checks to pass, review of the exact final diff, a verified backup/restore plan, and explicit owner approval. This file does not authorize merge, deployment, production configuration changes, or DNS changes.
