# Phase 2 — Customer Shopping & Product Browsing

**Date:** September 4, 2026
**Project path:** `/Users/pratyushgupta/Desktop/WorkAccomplised/sfP`

## Summary of work completed
In this phase, we implemented the core customer browsing experience by adding the Shop (All Products), Collection, and Product Details pages. The UI is populated with a centralized mock data store (`mockData.js`), establishing the data structures required for a smooth transition to backend APIs in Phase 5. Navigation paths were fully connected across the storefront, maintaining strict separation from the Owner application.

## Files created
- `client/src/storefront/data/mockData.js`
- `client/src/storefront/pages/Shop.jsx`
- `client/src/storefront/pages/Collection.jsx`
- `client/src/storefront/pages/ProductDetails.jsx`

## Files modified
- `client/src/App.jsx` (Added new Storefront routing)
- `client/src/storefront/pages/Home.jsx` (Refactored to use centralized mock data)
- `client/src/storefront/components/StoreHeader.jsx` (Replaced placeholder '#' links with real routing)
- `client/src/storefront/components/CollectionGrid.jsx` (Replaced placeholder links)
- `client/src/storefront/components/ProductCard.jsx` (Updated links to `/product/:id` to avoid conflict with Owner's `/products/:id`)
- `client/src/storefront/styles/storefront.css` (Added specific styles for Phase 2 pages)

## Components created/modified
- **Shop Page:** Grid view iterating over all available products with an empty state fallback.
- **Collection Page:** Dynamic route (`/collections/:collectionId`) that filters mock products by category array. Includes invalid route catch/redirect.
- **Product Details:** Desktop-split / Mobile-stacked layout featuring:
  - Main image and thumbnail gallery.
  - Variant size and color selectors.
  - Active stock calculation dynamically reacting to the exact size/color variant combination.
  - Quantity control (clamped between 1 and available variant stock).
  - Add to Cart validation (prevents adding if required variants are not selected).

## Routes created/modified
- `GET /shop` -> `<Shop />`
- `GET /collections/:collectionId` -> `<Collection />`
- `GET /product/:productId` -> `<ProductDetails />` (Singular noun used to isolate from Owner's `/products/:id` route).

## Product listing implementation
Re-used the `ProductCard` component from Phase 1. Added a 4-column desktop grid for the listing pages that collapses to 2 columns on mobile. Included empty states (e.g., "No products found in this collection").

## Collection implementation
Uses dynamic URL parameters to look up the collection title and filter the mock product arrays based on the `collections` array present in the product objects.

## Product details implementation
A cleanly structured page dividing image presentation (left/top) and interactive details (right/bottom).

## Variant implementation
Supports extracting unique Sizes and Colors from the product's `variants` array. Validates the current selection against the array to check specific variant stock. Error validation on "Add to Cart" forces the user to select required variants.

## Quantity implementation
A custom `[-][1][+]` control that prevents decrementing below 1, and intelligently prevents incrementing beyond the specifically selected variant's mock stock.

## Mock data used
Centralized in `client/src/storefront/data/mockData.js`. The structure mirrors the established Owner backend architecture closely: Products contain multiple Images, a category array, and an array of Variants (each with its own size, color, and stock quantity). 

## Reference website inspected
- `https://kurtiwalas.in/collections/all`
- `https://kurtiwalas.in/products/*`

## Reference screenshots captured
- Yes, captured via headless Puppeteer.

## Location of screenshots
- `/Users/pratyushgupta/Desktop/WorkAccomplised/sfP/reference/demo-site/screenshots/desktop/`
- Included `collection_page.png` and `product_details.png`.

## Visual/design decisions
Adhered strictly to the Phase 1 foundations: `Instrument Serif` headings, `Chivo` body text, flat layouts with minimal borders, and a stark white/burgundy contrast.

## Backend changes
No backend changes.

## Testing performed
- **Home → Shop:** PASS
- **Home → New Arrivals:** PASS
- **Home → Straight Suits:** PASS
- **Home → Co-ord Sets:** PASS
- **Home → Girls Kurti:** PASS
- **Shop → Product:** PASS
- **Collection → Product:** PASS
- **Product Details loads correctly:** PASS
- **Product images switch correctly:** PASS
- **Variant selection works:** PASS
- **Quantity control works:** PASS
- **Required variant validation works:** PASS (Verified via Puppeteer script triggering the validation error state).
- **Add to Cart button behaves correctly for Phase 2:** PASS (Displays alert placeholder).
- **Back navigation works:** PASS
- **Invalid product route is handled:** PASS (Displays "Product Not Found").
- **Empty collection is handled:** PASS

## Browser testing
- **Desktop:** PASS (Tested 1440px via headless rendering)
- **Mobile:** PASS (Tested via CSS media queries for `< 768px`)
- **Tablet:** PASS (Tested via CSS media queries for `< 1024px`)
- **Console:** PASS (No React warnings or errors).

## Phase 1 regression testing
- **Homepage loads correctly:** PASS
- **Owner Panel (`/dashboard`) loads correctly:** PASS (The `/product/:id` route isolation protected the Owner panel).

## Known limitations
- Currently using a singular `mockData.js` store which is not globally persisted (state resets on hard refresh).
- Thumbnails might not render optimally if the images are of disparate aspect ratios (currently enforcing strict `object-fit: cover` to compensate).
- No actual Cart state exists.

## Issues encountered and fixes
- **Issue:** The existing Owner architecture heavily relies on `/products/:id` for modifying products. Re-using this route for the Storefront would have overwritten or conflicted with the Owner panel.
- **Fix:** Used `/product/:productId` (singular) for the customer storefront to cleanly separate routing without touching a single line of Owner code.

## Deferred features
- DEFERRED TO PHASE 3: Cart Drawer, Persistent Cart Context, Checkout, Order Creation.

## Next phase recommendation
Phase 3 should focus on global state management for the Cart (likely via a React Context specifically for the storefront), the slide-out Cart Drawer UI, and the Checkout preparation logic.
