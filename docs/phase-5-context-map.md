# Phase 5 Context Map: Pre-Integration Audit

This document serves as the absolute source of truth for the project's state before beginning backend integration (Phase 5).

## 1. Project Purpose
A real-world e-commerce platform built for a clothing-brand client, expected to handle 100-200 concurrent users. It prioritizes simplicity, maintainability, readable code, and predictability over enterprise abstractions. The final goal is to merge an already-working Owner panel (connected to PostgreSQL) with a polished Storefront UI (currently using mock data).

## 2. Architecture Overview
- **Client (Frontend):** React (Vite), React Router, Context API, vanilla BEM CSS. No Redux, no Axios.
- **Server (Backend):** Node.js, Express, PostgreSQL (`pg`), Multer (file uploads), Socket.IO.
- **Database:** PostgreSQL.
- **Communication:** Standard fetch-based API client for REST.

## 3. Frontend Architecture
- `/client/src/App.jsx`: Main router defining `StorefrontLayout` routes and `OwnerLayout` routes.
- `/client/src/api/client.js`: Native `fetch` wrapper handling JSON/FormData, errors, and standardizing headers.
- `/client/src/hooks/`: Custom hooks like `useOrders.js` abstract API calls for the Owner panel.
- `/client/src/components/`: Reusable components (Owner-focused).
- `/client/src/pages/`: Owner panel pages.

## 4. Storefront Architecture
Encapsulated inside `client/src/storefront/`:
- **State Management:** Natively handled by `CartContext.jsx` with `localStorage` persistence (`sfp_cart`).
- **Data:** Driven entirely by `client/src/storefront/data/mockData.js`.
- **Components:** High-fidelity presentation components (`ProductCard.jsx`, `ProductCarousel.jsx`). Strict BEM-style CSS `storefront.css` sandboxed from Owner panel.

## 5. Owner Architecture
A dashboard for managing the e-commerce backend. It directly queries real APIs.
- Features: View/Update Orders, Manage Customers, Manage Products (CRUD), Upload Images, Manage Categories, Manage Variants, Manage Inventory.

## 6. Backend Architecture
Express.js layered architecture:
- `server/src/routes/`: Route definitions (Customer, Order, Product, Variant, Inventory, Category, Dashboard).
- `server/src/controllers/`: Request parsing and response formatting.
- `server/src/services/`: Core business logic (e.g., `order.service.js` handles transactions).
- `server/src/repositories/`: Raw SQL queries using `pg` pool.
- `server/src/validators/`: Request validation.

## 7. Database Structure
Key tables:
- `products`: id, name, description, category_id, price, discount_percentage, status
- `categories`: id, name
- `product_variants`: id, product_id, size, color, sku, price
- `inventory`: variant_id, quantity, low_stock_threshold
- `product_images`: id, product_id, image_url, display_order, is_primary
- `customers`: id, name, email, phone, address, city, state, pincode
- `orders`: id, customer_id, total_amount, address, city, state, pincode, status
- `order_items`: id, order_id, variant_id, product_name, variant_sku, variant_size, variant_color, quantity, price_at_purchase

## 8. API Endpoint Map
| Feature | Method | Endpoint |
|---------|--------|----------|
| Product | GET    | `/api/products` |
| Product | GET    | `/api/products/:id` |
| Product | POST/PUT | `/api/products` & `/:id` |
| Image   | POST   | `/api/products/:id/image` (Multer) |
| Order   | POST   | `/api/orders` |
| Order   | GET    | `/api/orders` & `/:id` |
| Order   | PUT    | `/api/orders/:id/status` |
| Customer| POST/GET | `/api/customers` |
| Variant | POST/GET | `/api/variants` |
| Inventory | POST/GET | `/api/inventory` |

## 9. Product Data Flow
- **Current Storefront:** Maps over `MOCK_PRODUCTS`.
- **Current Owner:** Fetches from `/api/products`.
- **Future State:** Storefront must fetch `/api/products` and hydrate components seamlessly.

## 10. Category Data Flow
- **Current Storefront:** `MOCK_COLLECTIONS`.
- **Future State:** Needs to map to `/api/categories` or rely on backend classification.

## 11. Variant/Inventory Flow
- **Current Storefront:** Nested array inside mock product (`variants: [{ id, size, color, stock }]`).
- **Future State:** Must fetch real variants and inventory tables (or rely on aggregate product payload if backend includes it).

## 12. Cart Flow
Managed by `CartContext`.
- Tracks `variant` and `quantity`.
- Validates against `variant.stock`.
- Persists to `localStorage`.

## 13. Checkout Flow
- Validates user input (First/Last name, Email, Phone, Address, City, State, Pincode).
- Currently mocks order ID and clears cart.

## 14. Existing Order Flow (Backend)
`POST /api/orders` transaction in `order.service.js`:
1. `BEGIN` transaction.
2. Upsert customer.
3. Merge duplicate variants in request.
4. Fetch variant details `FOR UPDATE` (row lock).
5. Update `inventory` (`quantity = quantity - $1`). Throw error if insufficient.
6. Snapshot variant details (price, size, color, name).
7. Insert `orders` and `order_items`.
8. `COMMIT` transaction.

## 15. Customer Flow
Handled implicitly during checkout. The API expects customer data alongside the order payload, upserting or creating the customer. No OTP/Auth exists or is required.

## 16. Image Flow
- **Owner:** Uploads file -> Multer saves to `/uploads/` -> DB stores path -> Frontend serves `http://localhost:5001/uploads/...`.
- **Storefront:** Currently hardcodes local deterministic `/storefront/images/imgX.jpg`.

## 17. Current Mock vs Real Data
| Feature | Storefront (Mock) | Owner (Real) |
|---------|-------------------|--------------|
| Products | `mockData.js` | PostgreSQL |
| Inventory | Hardcoded `stock` | `inventory` table |
| Orders  | Math.random ID | PostgreSQL `orders` |

## 18. Existing Validations
- **Frontend Checkout:** Validates all fields locally.
- **Backend Order Validator:** Ensures `customer.name`, `phone`, `address`, `city`, `state`, `pincode` exist. Ensures `items` array is valid and quantities > 0.

## 19. Existing Transactions
Order creation and status updates (`cancelled`) are fully wrapped in PostgreSQL transactions with `FOR UPDATE` locks ensuring safe concurrent inventory modifications.

## 20. Important Business Rules
- Canceled orders must restore inventory (already implemented in backend).
- Prices on variants override product base prices (implicit in DB structure).
- No frontend authentication or accounts required for customers.

## 21. Important Architectural Decisions
- Keep everything simple.
- No heavy state managers (Redux/Zustand) or API wrappers (React Query/Axios).

## 22. Things That MUST NOT Be Changed
- The Owner architecture and CRUD operations.
- Backend order transaction and concurrency logic.
- Cart visual design and Checkout visual design.
- The 4-column compact product card geometry from Phase 4.
- BEM CSS styling constraints.
- Native `fetch` `apiClient.js` wrapper.

## 23. Integration Gaps
- **[CRITICAL]** Storefront `ProductCard` / `ProductDetails` need to map to DB Product schema.
- **[CRITICAL]** `CartContext` needs to accept DB schema variants and track DB prices.
- **[CRITICAL]** `Checkout.jsx` must send a POST request to `/api/orders` matching the exact backend validator structure.

## 24. Known Limitations
- Backend returns absolute/relative paths for images. The storefront will need `http://localhost:5001` prepended if not returned as absolute.

## 25. Final Expected System Flow
Storefront -> Load Real Products -> Select Variant -> Add to Cart -> Checkout -> API Call -> DB Transaction -> Order visible in Owner Panel.

## 26. Testing Status
- Backend manual endpoints tested via scripts/Postman (assumed based on `test_harness.js`).
- Frontend visual layout tested heavily via Puppeteer in Phase 4.

## 27. Recommended Phase 5 Sequence
1. **Phase 5A:** Align schemas. Write mappers/adapters for the Storefront so it understands DB JSON payloads without destroying UI.
2. **Phase 5B:** Connect Homepage and Shop routes to GET APIs.
3. **Phase 5C:** Refactor `CartContext` slightly to match real DB structures.
4. **Phase 5D:** Wire `Checkout.jsx` to `POST /api/orders` and handle transaction responses/errors.
5. **Phase 5E:** Image path alignment and final E2E testing.

---

## Appendix: Immediate Contract Mismatches Found
| Field / Concept | Storefront Mock Expects | Backend DB Provides / Expects |
|-----------------|-------------------------|--------------------------------|
| **Product ID** | String (`na-1`) | Integer |
| **Title** | `title` | `name` |
| **Image(s)** | `image` (string), `images` (array of strings) | `images` (array of objects: `{ image_url }`) |
| **Collections** | Array of string IDs | `category_id` & `category_name` |
| **Stock** | `variant.stock` | `inventory.quantity` |
| **Price location** | `product.price` | `product.price` AND `variant.price` |
| **Checkout Name** | `firstName` + `lastName` | `customer.name` (single string) |
| **Order Payload** | N/A (was mocked) | `{ customer: {...}, items: [{variant_id, quantity}] }` |
