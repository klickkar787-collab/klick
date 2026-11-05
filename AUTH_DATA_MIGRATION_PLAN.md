# KlickKar Authentication & Data Migration Plan

Date: 2026-11-06
Branch: `security-audit/2026-11-06`
Status: analysis/design only — no runtime migration or database resource created.

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
- The current server does not expose authenticated CRUD endpoints for these records and no database driver/ORM is declared in `package.json`.

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
- Confirm a zero-cost database option and its suspension/availability limits before provisioning. No resource is created by this plan.

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

- No database or paid service provisioned.
- No Render environment variables changed.
- No live data imported, migrated, or deleted.
- No main-branch changes, merge, PR, or deployment.
- No credentials or secret values included in this document.
