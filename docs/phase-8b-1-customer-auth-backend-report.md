# Phase 8B-1 — Customer Account Database & Backend Authentication

## 1. Existing Architecture Inspected
- The `customers` table originally contained `email VARCHAR(255) UNIQUE`. The `order.service.js` and `customer.repository.js` utilized `ON CONFLICT (email) DO UPDATE` to aggregate guest checkouts from the same email under a single customer record without throwing duplicate key errors.
- Owner authentication existed securely via `auth.middleware.js`, generating and verifying JWTs based on `JWT_SECRET`. However, the original `auth.middleware.js` only checked JWT validity and didn't enforce a specific role constraint because, previously, only the owner could log in.

## 2. Database Changes
- I injected a migration script (`009_add_customer_accounts.sql`) modifying the existing `customers` table to accommodate registered users natively without fracturing the database into duplicate tables.
- Added `password_hash VARCHAR(255)`.
- Added `is_registered BOOLEAN DEFAULT FALSE`.
- The migration was explicitly applied and executed successfully. This cleanly extends the current architecture while adhering to the prompt's simplicity rule.

## 3. Existing Guest Data Handling
- **Constraint Safety:** Guest checkouts natively fire an `ON CONFLICT` update on their email. I specifically modified the `registerCustomer` repository query to also utilize `ON CONFLICT (email) DO UPDATE`.
- **Outcome:** If an old guest registers, their pre-existing customer row is safely elevated (`is_registered = TRUE`, `password_hash` updated) instead of throwing an error. Guest order history associated with that ID is safely and naturally connected to the newly registered account. Guest functionality remains entirely unblocked and oblivious to these additions.

## 4. Authentication Flow
- **Registration (`/api/customer-auth/register`):** Creates/updates customer. Hashes the incoming password with `bcryptjs`. Generates a JWT containing `{ id, email, role: "customer" }`.
- **Login (`/api/customer-auth/login`):** Looks up customer by email. Validates `is_registered`. Compares hashed password. Emits customer JWT.
- **Identity (`/api/customer-auth/me`):** Consumes token securely via a newly created `customerAuth.middleware.js` to return safe public data. Passwords and hashes are *never* transmitted in API responses.

## 5. Security Decisions
- Segregated authorization: Added strict `role === "owner"` checks inside `auth.middleware.js` (preventing customer tokens from penetrating the Owner Dashboard), and strict `role === "customer"` checks inside `customerAuth.middleware.js`.
- Adopted `bcryptjs` for robust, portable salting/hashing.
- Did not expose raw passwords anywhere. Replicated existing standard error formats.

## 6. Tests Performed
- **Database Starts/Intact:** Yes. The migration ran, and server connection is active.
- **Register New Customer:** Success (Returns HTTP 200, JWT token, and safe customer object).
- **Duplicate Registration Fails:** Success (Returns HTTP 409 "Email already registered").
- **Correct Login Succeeds:** Success (Returns HTTP 200 with JWT).
- **Incorrect Password Fails:** Success (Returns HTTP 401 "Invalid credentials").
- **Missing/Invalid Token Fails:** Success (Returns HTTP 401 on protected customer endpoint).
- **Customer Token Accessing Owner API:** Tested customer token on `/api/dashboard`. Successfully rejected with HTTP 403 "Forbidden. Owner access required."

## 7. Existing-System Regression Results
- **Public Products API:** Returns HTTP 200 cleanly (`/api/products`).
- **Guest Checkout API:** A simulated frontend checkout payload (`POST /api/orders`) successfully inserted a Guest Order mapped to variant `7`, returning HTTP 201 with full order metadata. Existing inventory transactions and order creation logic was definitively verified to be unaffected.
- **Server Startup:** The Express instance started smoothly (`node src/server.js`) on port 5001 without configuration conflicts.

## 8. Known Limitations
- The customer `register` route allows claiming an existing guest's email. Since the `customers` table utilizes a `UNIQUE` constraint for emails natively, this is technically unavoidable without restructuring the entire database schema to allow duplicates, which would break the legacy architecture. This behavior natively bridges old guest orders to new registered accounts via email matching.
