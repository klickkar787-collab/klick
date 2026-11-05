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
