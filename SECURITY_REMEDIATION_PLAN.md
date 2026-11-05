# KlickKar Security and Reliability Remediation Plan

Status: working plan for the isolated `security-audit/2026-11-06` branch.
Baseline: GitHub `main` at commit `7a04d46e9d58cd783ba5b7d8a490db7bb7ee2204`.
Safety rule: do not merge, deploy, change production settings, or alter live DNS as part of this work.

## Confirmed findings in the current GitHub baseline

1. Authentication is implemented in the browser in `src/context/AppContext.tsx`. Login compares a password against user data held by the client.
2. Customer registration and password reset write password values into the client-side user object. User objects are persisted in browser localStorage.
3. `src/data/initialData.ts` contains demo user credentials. Treat them as exposed; do not reuse them for real accounts.
4. `src/data/companyDetails.ts` contained a hard-coded Telegram bot credential. The owner has now revoked it. The isolated branch removes the literal from client source and documents a server-only `TELEGRAM_BOT_TOKEN` placeholder. The current `server.ts` has no Telegram Bot API call/notification endpoint, so the replacement token must NOT be added to Render yet; first implement and test the server-side integration.
5. Business records (including bookings, quotations, invoices, leads, payments, users, and CMS data) are persisted in browser localStorage. This is not shared cloud persistence and is not a secure system of record.
6. The current `server.ts` exposes the chat endpoint but does not provide server-side authentication or authorization for the business operations described above.
7. The current baseline does not declare a database client/ORM dependency in `package.json`.

## Remediation order

### P0 — contain exposed credentials
- [x] Owner revoked the exposed Telegram credential.
- [x] Removed the credential literal from `src/data/companyDetails.ts` on this isolated branch.
- [x] Added a blank server-only `TELEGRAM_BOT_TOKEN` placeholder to `.env.example`.
- [ ] Implement and test the actual server-side Telegram integration before configuring the new token in Render.
- Keep all values out of chat, logs, commits, and client bundles.

### P1 — authentication and authorization
- Design server-side login, password hashing, session lifecycle, and role checks.
- Never trust a role, user ID, or authorization flag supplied by the browser.
- Remove plaintext password storage from browser state and localStorage.
- Preserve the existing login/register UI while changing its data flow only after the server contract is tested.
- Add safe migration/transition handling so existing demo data does not become a production credential source.

### P2 — persistence
- Select a zero-cost database option only after confirming current limits and operational fit.
- Define schemas and server-side CRUD APIs for business records.
- Keep a backup/export path and verify restore behavior before migrating any existing records.
- Do not silently discard browser-local data.

### P3 — verification
- Run TypeScript/lint and production build.
- Add tests for login, role boundaries, invalid sessions, and protected endpoints.
- Verify property-for-sale pages, listings, gallery, booking flow, Price-on-Request safeguards, CMS, mobile navigation, and existing routes.
- Review deployment configuration without triggering deployment.

## Approval gates

- Work in this branch only.
- Do not modify `main`, merge a PR, deploy to Render, change environment variables, rotate credentials, or change DNS without explicit owner approval.
- Ask the owner to perform credential revocation/rotation in the provider dashboard; never ask them to paste the new secret into chat.
- Preserve all existing public website features and the property-for-sale experience.
