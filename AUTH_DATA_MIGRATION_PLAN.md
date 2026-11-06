# KlickKar Authentication & Data Migration Plan

Date: 2026-11-06
Branch: `security-audit/2026-11-06`
Status: design plus development-only database preparation. A Neon Free project and isolated `development` branch have been created; the initial schema is applied and verified there. The application is not connected and no production data is present.

## 1. Current implementation verified on this branch

### Authentication and roles
- `UserAccount` in `src/types/index.ts` contains a required `password: string` property.
- `INITIAL_USERS` in `src/data/initialData.ts` includes seeded demo accounts with plaintext passwords. These are sample credentials and must not be used for real accounts.
- `AppContext.login` compares the submitted password with the browser's `users` state.
- `registerCustomer` constructs a user object containing the submitted password and stores it in React state.
- The `users` array is serialized to `klickkar_users_v2` in localStorage.
- The full `currentUser` object is serialized to `klickkar_auth_user_v2`. Since it is copied from the user record, it also contains the password property.
- `role` is read from and written to `klickkar_user_role_v2`; `setRole` is exposed by the context. Client-side role state is not an authorization boundary.
- `addUser` and `resetUserPassword` currently mutate local user state. `updateUserStatus` and `deleteUser` are also local-only operations.
- The admin dashboard checks `currentUser.role` in the browser. This is useful for UI rendering only, not server authorization.

### Business data and settings
- `AppContext` reads and writes bookings, quotations, invoices, leads, payments, services, offers, site content, AI sessions, users, and settings through named localStorage keys.
- `providers` is initialized from `INITIAL_PROVIDERS` and has no persistence/API operation in the current context contract.
- `addTelegramLead`, `replyToTelegramLead`, and lead status changes update local React state; they do not persist to a server or send a Telegram message.
- `saveAiChatSession` updates local AI sessions and may create a local lead from captured contact details.
- `AppSettings.telegram.botToken` is part of the settings type. The entire settings object is persisted to localStorage. Do not enter or store a real bot token in browser settings/localStorage; a Telegram credential must be server-only.
- The current server does not expose authenticated CRUD endpoints for these records. The `pg` driver and a development schema/migration runner have since been added, but the application is not yet connected to PostgreSQL.

### Existing synchronous UI contract
The context currently exposes synchronous methods for login, registration, user management, booking creation/status, quotation operations, invoice operations, payments, leads, CMS updates, and settings. A secure server-backed implementation will require asynchronous request handling and explicit loading/error states in the UI. Replacing only `login` would leave protected business data writable from the browser.

## 2. Target security design

1. Store users in a persistent database. Store only a strong password hash (never plaintext) and never return the hash to the browser.
2. Use server-managed sessions with secure, HttpOnly, SameSite cookies; use HTTPS in production. Provide session invalidation on logout and when accounts are suspended or credentials are reset.
3. Resolve role and user identity from the server session. Ignore any client-supplied role, user ID, owner ID, or admin flag when authorizing an operation.
4. Put authorization checks on every protected API route. Admin-only operations must require admin role; provider operations must be limited to assigned work; customer reads/writes must be scoped to the authenticated customer.
5. Keep integration secrets such as Telegram and AI provider keys in server environment configuration only. Remove secret fields from browser-facing settings types and APIs.
6. Validate request bodies and IDs on the server; use bounded pagination and conservative payload limits.
7. Return safe user DTOs that contain profile fields only—never password hashes, password values, session identifiers, or integration secrets.

## 3. API and UI migration map

| Domain | Current local operation | Target server operation / authorization |
|---|---|---|
| Session | `login`, `logout`, persisted `currentUser` | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`; server session is authoritative |
| Registration | `registerCustomer` | `POST /api/auth/register`; public registration creates customer role only |
| Users | `addUser`, `updateUserStatus`, `resetUserPassword`, `deleteUser` | Admin-only user APIs; password reset never returns a password |
| Role | `role`, `setRole` | Derived from authenticated session; remove client authority to set role |
| Providers | `INITIAL_PROVIDERS` | Persist provider profiles; provider can read only assigned jobs |
| Bookings | `addBooking`, `updateBookingStatus`, `assignProviderToBooking` | Server CRUD with customer ownership, provider assignment, and admin authorization |
| Quotations | `addQuotation`, `approveQuotation`, `rejectQuotation` | Server CRUD; customer approval scoped to quote owner; admin/provider permissions explicitly defined |
| Invoices | `createInvoiceFromBookingOrQuote`, `updateInvoicePayment` | Server-side invoice creation and controlled status updates; customer cannot set paid status |
| Payments | `recordPayment`, `updatePaymentStatus`, `updatePaymentTerms` | Server-side payment records; only trusted reconciliation/admin flow may mark payments paid |
| Leads | `addTelegramLead`, `replyToTelegramLead`, `updateLeadStatus`, `convertLeadToBooking` | Server lead persistence; admin-only management; Telegram notification is a separate server integration |
| AI sessions | `saveAiChatSession`, `updateAiSessionStatus` | Decide retention/privacy policy first; persist only necessary records with restricted access |
| CMS | services, offers, site content, settings update methods | Public read endpoints for approved public content; admin-only writes |
| Backups | localStorage export/restore utility (path not found in this branch at expected location) | Versioned database export and tested restore; preserve a user-controlled local export during transition |

## 4. Migration and rollout sequence

### Phase A — preserve and define
- Inventory every consumer of the context methods and identify which UI handlers must become async.
- Define ownership rules and API request/response DTOs before writing endpoints.
- Create a local export format and verify export/import against a copy of sample data.
- Confirm the intended production policy for seeded demo records and any customer personal data in sample data.
- One Neon Free project (`klickkar-dev`) and its isolated `development` branch have been explicitly approved and provisioned for development/testing only; 19 application tables have been applied and verified. No production data is imported and no live/Render connection is authorized.

### Phase B — backend foundation
- Add database schema/migrations and server-side repositories.
- Implement password hashing, sessions, CSRF protections appropriate to cookie auth, login throttling, and safe auth responses.
- Add authorization middleware and tests before exposing CRUD routes.
- Keep integration secrets exclusively on the server.

### Phase C — vertical-slice migration
- Migrate one complete workflow at a time, beginning with auth/session and then a low-risk data domain.
- For each domain: server validation, ownership tests, UI async/loading/error states, export/restore compatibility, and regression tests.
- Do not dual-write blindly. Define one source of truth per migration stage to avoid divergent records.
- Do not treat browser localStorage as authoritative for payment status, invoice status, roles, or ownership.

### Phase D — cutover readiness
- Test migration on a copied dataset, not on live customer records.
- Verify rollback and restore from backup.
- Run TypeScript checks, production build, API tests, and manual browser QA.
- Review the full diff and get explicit approval before merge or deployment.

## 5. Required regression checks

- Public home, service pages, and property-for-sale pages remain available and unchanged.
- Customer registration/login/logout and customer-owned booking visibility.
- Provider login and assigned-job-only access.
- Admin login, users, bookings, quotations, invoices, leads, CMS, settings, and backup.
- Booking modal, Price-on-Request safeguards, WhatsApp links, AI chat, Telegram integration, and responsive navigation.
- No password/hash/session/token appears in browser storage, client bundles, API responses, or logs.
- No existing records are overwritten or deleted during migration.

## 6. Explicit non-actions

- No production database provisioned and no paid service selected. The approved Neon Free development/testing project is the only provisioned database resource.
- No Render environment variables changed.
- No live data imported, migrated, or deleted.
- No main-branch changes, merge, PR, or deployment.
- No credentials or secret values included in this document.


## 7. Portal and login UI findings verified after the initial plan

- `src/components/auth/LoginModal.tsx` includes quick-fill demo credentials and displays role-specific demo password hints in the login UI. These values are part of the public client bundle and must be removed or replaced with a non-secret demo flow before production use.
- The login form calls the synchronous `login` function directly and immediately expects a result. It must be updated to handle a pending async request, server errors, and session refresh without changing the customer/provider/admin navigation behavior.
- `src/components/customer/CustomerPortal.tsx` loads the shared bookings, quotations, and invoices arrays into the browser and filters them by the current user's email/phone. This is presentation filtering, not data access control; all records already delivered to the browser can be inspected or altered.
- `src/components/provider/ProviderPortal.tsx` filters the shared bookings array by a client-derived provider ID. This is also presentation filtering, not server-side assignment enforcement. A provider must receive only assigned records from the server.
- `src/App.tsx` routes between portals using client-side `activeNav` and `role`. These checks must remain for navigation/UI only; every protected API must independently authorize the server session.
- `src/components/admin/AdminDashboard.tsx` creates users by passing a plaintext password to `addUser`. This must become an admin-authorized server request with server-side hashing and no password echo.
- The Admin Dashboard header renders bank-account information from the browser settings object. Before treating this site as public production software, confirm which payment details are intentionally public. Any credential-like integration token must never be rendered or stored there.

Implementation implication: the migration must change the data-delivery boundary, not merely replace the login form. Customer and provider APIs should return only records authorized for that session; the browser must never download the full shared dataset and rely on filtering to hide other people's information.


## 8. PostgreSQL schema baseline (applied to isolated Neon development branch)

This schema baseline was applied only to the isolated Neon `development` branch for development/testing. It does not authorize production use.

### Proposed relational domains

- `user_accounts`: stable user ID, normalized unique email, name/contact/company fields, role, account status, timestamps, and **password_hash only**. Never store a `password` field in a database response DTO or browser state.
- `user_sessions`: user ID, hash of a high-entropy session token, creation/expiry/revocation timestamps, and limited session metadata. Store only the token hash; send the raw token only in an HttpOnly, Secure, SameSite cookie.
- `password_reset_tokens`: user ID, hashed one-time token, expiry, used timestamp, and creation timestamp.
- `service_providers`: provider profile and specialization, linked to a provider-role user account. Do not infer a provider identity from a client-provided ID.
- `services` and `offers`: CMS catalog records with validated JSON arrays only where the current UI expects arrays.
- `bookings`: customer owner user ID, optional assigned provider profile ID, service reference, status, dates, payment summary, and customer-facing snapshot fields needed for historical records.
- `quotations` and `quotation_items`: quote header, booking/customer ownership, tax totals, status, and normalized line items.
- `invoices` and `invoice_items`: invoice header, booking/quotation references, tax totals, payment summary, and normalized line items.
- `payment_records`: payment/receipt references, linked booking/quote/invoice, amount, mode, status, transaction reference, and actor. Add idempotency protection before accepting any future online payment callbacks.
- `leads` and `lead_messages`: lead details, status, linked booking, and conversation history. Restrict staff access and apply a retention policy to phone numbers and message content.
- `ai_chat_sessions` and `ai_chat_messages`: separate session/message records with a documented retention policy; avoid storing unnecessary personal data.
- `site_content`, `app_settings`, and `audit_log`: controlled CMS/configuration records and immutable records of sensitive administrative actions.

### Required data-boundary decisions

- Split `UserAccount` into a safe browser-facing user DTO (no password or hash) and a server-only credential record (`password_hash`).
- Split `AppSettings`: public website settings, restricted administrative settings, and server-only integration secrets. Never persist a real Telegram/Gemini token in browser settings or localStorage.
- Bank-transfer details currently appear in the frontend company-settings/payment/invoice workflow. The public chatbot is prohibited from disclosing them, but the intended visibility in customer-facing payment/invoice screens remains a separate owner decision; do not silently change that workflow.
- Add explicit `customer_user_id` and provider ownership references. Existing demo/live records must be reconciled with verified account ownership during a reviewed migration; do not auto-assign ambiguous records using a loose email-or-phone match.
- Keep provider and customer APIs scoped in SQL queries by the authenticated session identity. Do not fetch a global collection and filter it in React.
- Use database transactions for related booking/quote/invoice/payment changes and write audit events for role, status, payment, and settings changes.

### Provisioning and validation gate

- [ ] User approval to create a Neon Free development/testing project is still required before provisioning.
- [ ] After approval, keep the connection string in the provider's secret manager only; never paste it into chat or commit it.
- [ ] Validate schema/migrations against a disposable test database before any live-data migration.
- [ ] Production database choice, backup/restore policy, and production configuration remain unapproved and out of scope.


## 9. Development database implementation status

- Neon Free project `klickkar-dev` created after explicit owner approval.
- Isolated Neon `development` branch created; default `production` branch remains unchanged.
- Initial PostgreSQL schema applied and verified in the development branch.
- PostgreSQL client dependencies `pg` and `@types/pg` added on the isolated GitHub security branch.
- Added optional connection pool module at `src/server/db.ts`.
- Added transactional, advisory-lock-protected migration runner at `scripts/migrate.ts`, invoked by `npm run db:migrate`.
- Added `NEON_DEVELOPMENT_SETUP.md` with local secret configuration steps.
- No connection string has been added to source control or chat.
- No application runtime routes are connected to PostgreSQL yet; authentication and domain APIs remain to be implemented and tested.
- No Render settings, production database, live data, main branch, PR, merge, or deployment changed.


## 8. Login UI follow-up — 2026-11-06

- Removed the login modal's quick-demo buttons, credential autofill helper, and visible password hints from the isolated security branch.
- Seeded demo account records with plaintext passwords remain in `src/data/initialData.ts`, and `AppContext.login` still compares passwords in browser-side state. Registration also stores passwords in the browser-side user object. These are unresolved critical blockers.
- Password hashing/session-token helpers and a PostgreSQL schema are groundwork only. There is not yet a PostgreSQL-backed auth router mounted in `server.ts`, and no login/registration UI is connected to a server session.
- Do not enable production authentication or migrate real accounts until server routes, authorization, session/CSRF protections, API tests, and UI async states are complete.
