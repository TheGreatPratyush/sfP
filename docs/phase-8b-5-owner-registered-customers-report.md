# Phase 8B-5 — Owner Registered Customers

## 1. Existing Owner Customers Architecture Inspected
- Reviewed `customer.repository.js` and observed `getCustomers` initially used `SELECT * FROM customers`.
- Validated that `customers` correctly models the schema as the single source of truth using `is_registered` (boolean).

## 2. API Changes & Database Queries
- Added `is_registered` boolean filtration support directly to the Owner-protected `GET /api/customers` API endpoint.
- Extended the `customerRepository.getCustomers` SQL to `LEFT JOIN orders` natively.
- This allows aggregating `COUNT(o.id) as total_orders` and `SUM(o.total_amount) as total_spent` strictly within the PostgreSQL query planner, rather than doing N+1 queries.

## 3. Password/Token Leak Protection
- **CRITICAL FIX:** Replaced `SELECT * FROM customers` inside `getCustomers` and `getCustomerById` with an explicit, statically typed list of safe business columns (`id, name, email, phone, address, city, state, pincode, created_at, updated_at, is_registered`).
- Ensured `password_hash` is fundamentally impossible for the Owner API to return, while keeping `findCustomerByEmail` intact so Customer login functions normally.

## 4. Owner UI Changes
- Modified `client/src/pages/Customers.jsx` to inject a sleek React tab interface ("All Customers" vs "Registered Customers").
- Added distinct `Status`, `Total Orders`, and `Total Spent` columns to the table to reflect the new aggregated SQL data dynamically.
- Filter toggle flawlessly interfaces with the existing pagination state layer.
- Added explicit visual badging ("Registered Account" vs "Guest Customer") to `CustomerDetails.jsx` so Owners have immediate context.

## 5. Security & Isolation Tests
Executed via HTTP simulator:
1.  **Owner JWT -> Registered Endpoint:** `200 OK` (Only registered accounts returned, no passwords leaked).
2.  **No Token -> Registered Endpoint:** `401 Unauthorized`.
3.  **Invalid Token -> Registered Endpoint:** `401 Unauthorized`.
4.  **Customer JWT -> Registered Endpoint:** `401 Unauthorized` (Customer tokens remain explicitly rejected by the Owner middleware boundary).

## 6. Guest Preservation
- Guest customers are perfectly preserved in the database (with `is_registered = FALSE`).
- The Owner can view them using the "All Customers" tab seamlessly. No guest data was deleted, mutated, or forcibly migrated.

## 7. Performance Considerations
- Kept the query efficient by relying on PostgreSQL `LEFT JOIN orders ... GROUP BY c.id` instead of fetching order histories independently per mapped customer node. This remains highly optimized for the 100-200 user baseline threshold.

## 8. Exact Files Changed
- `client/src/pages/Customers.jsx`
- `client/src/pages/CustomerDetails.jsx`
- `client/src/api/customers.api.js`
- `server/src/controllers/customer.controller.js`
- `server/src/services/customer.service.js`
- `server/src/repositories/customer.repository.js`

## 9. Known Limitations
- The "Registered Customers" system is strictly a filtered view on the unified `customers` schema. We do not explicitly track the exact *timestamp* a guest user elevates into a registered user, only that their status is currently `true`.
