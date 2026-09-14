# Phase 8B-3 — Authenticated Checkout + Customer Address Popup

## 1. Existing Checkout Architecture Inspected
- The original `Checkout.jsx` displayed an inline form unconditionally.
- `POST /api/orders` was entirely public for guest checkout.
- Guest customer conflict resolution relied completely on `email`.

## 2. Authentication Gating Design
- Unauthenticated users can still fully browse, add to cart, and arrive at the `/checkout` route smoothly.
- When an unauthenticated user clicks the primary "Place Order" button on the summary screen, they are redirected to `/login`, passing their current intent through React Router state (`{ state: { returnTo: '/checkout' } }`).
- Validating the checkout requires explicit authentication.

## 3. Login/Register Return-to-Checkout Behavior
- Edited `CustomerLogin.jsx` and `CustomerRegister.jsx` to dynamically respect `location.state?.returnTo`.
- After successfully authenticating, the customer is routed back directly to `/checkout` instead of being indiscriminately dropped at `/shop`.

## 4. Address/Customer Details Popup
- Overhauled `Checkout.jsx` to simplify the core layout into an Order Summary and a primary Call-to-Action button.
- When authenticated, clicking the button invokes a clean storefront-native `.address-modal` (complete with overlay, subtle animation, close button, and inline validation).
- Prefilled user details dynamically inside the modal using data from `CustomerAuthContext`.
- Retained all explicit inline error displays and removed `window.alert()`.

## 5. Backend Authenticated Customer Association
- Built `optionalCustomerAuth.middleware.js` strictly for `POST /api/orders` so it could decode customer tokens without indiscriminately blocking legacy endpoints.
- If a token is detected, `req.customer.email` overrides the `customer.email` object submitted by the frontend payload. 
- Because the repository utilizes `ON CONFLICT (email)`, forcing the verified JWT email unconditionally maps the newly placed order to the authenticated user's exact row inside `customers`, ensuring perfectly secure association without modifying schema.

## 6. Order Creation & Inventory Preservation
- Successfully verified that backend prices, transaction boundaries (rollback safety), and variant stock calculations operate completely autonomously. Frontend data does not dictate total cost.

## 7. Cart & Error Preservation
- Added logic ensuring `cartItems.length` acts as a guard.
- Form submissions throwing standard API 400s explicitly render inside the address modal's `submitError` state. The modal stays open, data is preserved, and the cart survives perfectly intact.
- Upon 201 success, `clearCart()` triggers and the native `successOrderId` popup assumes control without disrupting the natural empty-cart view behind it.

## 8. Double-Submit Protection
- Set a rigorous `isSubmitting` hook overriding form fields and action buttons to `disabled=true` while the `apiClient` finishes the order request.

## 9. Security & Regression Tests
- **Logged-out Action:** Tested checkout block; successfully bounced to login.
- **Cart Survival:** Ensured that logging in preserves variants and quantities exactly.
- **Backend API Test:** Verified `fake_hacker@email.com` payload against `johnauth@example.com` token mapped perfectly to the user's correct `customer_id` inside PostgreSQL.
- **Owner Scope:** Confirmed the new middleware leaves Owner Dashboard untouched.
- **Guest Compatibility:** Simulated legacy guest API requests manually; observed graceful handling without throwing 401s.

## 10. Responsive Browser Tests
- Mobile (`375px/390px`): The `.address-modal` expands to max edges cleanly without horizontal overflows, allowing for natural scrolling within the popup.
- Desktop (`1440px`): The simplified `Checkout.jsx` centers securely and the modal overlays neatly with a slight shadow (`rgba(67, 6, 6, 0.15)`).

## 11. Files Changed
- `client/src/storefront/pages/Checkout.jsx`
- `client/src/storefront/pages/CustomerLogin.jsx`
- `client/src/storefront/pages/CustomerRegister.jsx`
- `client/src/storefront/styles/storefront.css`
- `server/src/controllers/order.controller.js`
- `server/src/routes/order.routes.js`
- `server/src/middleware/optionalCustomerAuth.middleware.js` (New)

## 12. Known Limitations / Future Work
- The customer profile details can only currently be updated at the time of checkout.
- Persistent Account Management ("My Orders", "Profile Editor") is strictly reserved for Phase 8B-4 as mandated.
