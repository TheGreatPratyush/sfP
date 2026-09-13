# Phase 3 — Customer Cart + Checkout Frontend

**Date:** September 4, 2026
**Project path:** `/Users/pratyushgupta/Desktop/WorkAccomplised/sfP`

## Summary of work completed
In this phase, we implemented the frontend cart and checkout experience. The architecture heavily relies on React Context (`CartContext.jsx`) for global state management and utilizes `localStorage` to securely persist cart data across page reloads. We replaced placeholder `alert()` actions with a fully functional slide-out Cart Drawer and a dedicated Cart page (`/cart`). A fully mocked Checkout page (`/checkout`) handles form validation and produces a frontend-only mock order leading to an Order Success page (`/order-success`). The cart accurately handles variant separation, stock limitation, and automatic calculation of subtotals.

## Files created
- `client/src/storefront/context/CartContext.jsx`
- `client/src/storefront/components/CartDrawer.jsx`
- `client/src/storefront/pages/Cart.jsx`
- `client/src/storefront/pages/Checkout.jsx`
- `client/src/storefront/pages/OrderSuccess.jsx`

## Files modified
- `client/src/App.jsx` (Registered routing for `/cart`, `/checkout`, `/order-success`)
- `client/src/storefront/layout/StorefrontLayout.jsx` (Wrapped layout in `<CartProvider>` and added `<CartDrawer />`)
- `client/src/storefront/components/StoreHeader.jsx` (Linked cart icon to open drawer and displayed accurate `cartCount`)
- `client/src/storefront/pages/ProductDetails.jsx` (Integrated `addToCart` from context; removed temporary `alert()`)
- `client/src/storefront/styles/storefront.css` (Added specific styles for Drawer, Cart Page, Checkout forms, and overlays)

## Cart architecture
We introduced a custom React Context (`CartContext.jsx`) as the simplest and most native approach to share global state between the Product Details page, Header, Cart Drawer, and Checkout form. This avoided the unnecessary overhead of Redux or Zustand, adhering strictly to the "Simplicity" mandate. 

## Cart state management approach
The `useCart` hook exposes state variables (`cartItems`, `cartTotal`, `cartCount`, `isCartOpen`) and actions (`addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `toggleCart`). When an item is added to the cart, the drawer immediately slides out for UX feedback.

## Cart persistence approach
`localStorage.setItem('sfp_cart', JSON.stringify(cartItems))` runs as a side-effect whenever the `cartItems` array is modified. On startup, the Context eagerly retrieves and parses this data within a `try-catch` block. If parsing fails, it gracefully falls back to an empty cart array.

## Cart item data structure
Cart items explicitly represent the exact *Variant*, not just the Product.
```javascript
{
    product: { id, title, price, image },
    variant: { id, size, color, stock }, // Unique variant tracking
    quantity: number
}
```

## Add-to-cart behavior
Validates variant selection. Uses `Array.findIndex` to determine if the EXACT variant exists in the cart. If yes, it increments the quantity (capped at the variant's mock stock limit). If no, it pushes a new item. The Cart Drawer is then toggled open.

## Cart drawer behavior
An overlay slide-out menu mimicking the right-aligned desktop drawer behavior on the live reference. Allows adjusting quantities directly or removing items. Contains an explicit checkout link.

## Cart page behavior
Dedicated URL (`/cart`) for deeper review. Responsive layout displaying items horizontally on desktop (collapsing vertically on mobile). Enforces stock limits on `+` buttons. Re-routes to `/shop` on empty state.

## Checkout behavior
Frontend-only implementation located at `/checkout`. Features two controlled form sections: Customer Information and Delivery Address, paired with an immutable Order Summary. Prevents empty-cart checkouts.

## Form validation
Implements simple Regex for emails, 10-digit boundaries for phone numbers, and 6-digit boundaries for pincodes. Required empty fields render in-line `<span className="error-text">` feedback preventing submission.

## Mock order behavior
Does NOT submit to backend. Intercepts `onSubmit`, asserts validation rules, calls `clearCart()`, and programmatically routes the user using `navigate('/order-success', { state: { orderId: mockOrderId } })`.

## Order success behavior
Accepts the generated `orderId` via router state. Clearly explicitly warns the user that "This is a frontend-only mock order. No actual charge or database entry was made."

## Mock data used
Relies directly on the previously established `mockData.js` arrays and strictly respects the defined stock limits for each variant.

## Reference website inspected
- `https://kurtiwalas.in/` (Inspected cart slide-out overlay mechanism).

## Reference screenshots captured
- Captured via Puppeteer in the previous terminal instance.

## Screenshot locations
- `/Users/pratyushgupta/Desktop/WorkAccomplised/sfP/reference/demo-site/screenshots/desktop/cart_drawer.png`

## Backend changes
No backend changes.

## Payment changes
No payment integration.

## Authentication changes
No authentication.

## Testing performed
- **Product → Add to Cart:** PASS
- **Add product without selecting required variant:** PASS (Blocked)
- **Add product with valid variant:** PASS (Added and drawer opens)
- **Add same variant twice:** PASS (Increments quantity)
- **Add different variants of same product:** PASS (Maintains separate cart items)
- **Cart quantity increase / decrease:** PASS
- **Quantity cannot exceed stock / go below 1:** PASS
- **Remove item / Empty cart state:** PASS
- **Cart persistence after refresh:** PASS (Via `localStorage`)
- **Cart count in header:** PASS
- **Cart drawer and Cart page visual rendering:** PASS
- **Continue shopping navigation:** PASS
- **Checkout page customer / address validation:** PASS (Verified error states)
- **Empty-cart checkout prevented:** PASS (Auto-redirects to `/cart`)
- **Mock Place Order & Cart Clearing:** PASS
- **Order success page:** PASS

## Browser testing
- **Desktop:** PASS (1440px viewport verified)
- **Mobile:** PASS (Responsive media queries verified)
- **Tablet:** PASS
- **Console:** PASS (No warnings regarding state or dev-tools missing)

## Phase 1 regression
- **Homepage & Collections:** PASS (Unchanged visually; `<CartProvider>` wrapper introduced safely).

## Phase 2 regression
- **Product Details Variant selection:** PASS (Unchanged core logic, simply replaced `alert()` payload).

## Owner regression
- **Owner Dashboard (`/dashboard`):** PASS (Untouched by `<StorefrontLayout>` additions).

## Issues encountered and fixes
- **Issue:** Needed immediate feedback on "Add to Cart" since `alert()` was disallowed.
- **Fix:** Hooked up `addToCart()` to trigger `openCart()` which forces the right-hand `CartDrawer` to slide into the viewport immediately.

## Known limitations
- The checkout process has zero knowledge of shipping costs, taxes, or discounts (hardcoded to solely subtotal calculations).
- Order generated has zero backend persistence.

## Deferred features
- DEFERRED TO PHASE 4: Actual Backend API routing for placing orders.
- DEFERRED TO PHASE 4: Fetching real products and variants from PostgreSQL.
- DEFERRED: Online Payment Gateway, Customer Auth login flow.

## Next phase recommendation
Phase 4 should proceed with connecting the entire Customer Storefront to the existing Express/PostgreSQL backend APIs, swapping out `mockData.js` for actual `fetch/axios` calls and persisting real orders.
