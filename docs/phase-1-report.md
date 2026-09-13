# Phase 1 — Customer Storefront Foundation + Homepage

**Date:** September 4, 2026
**Project path:** `/Users/pratyushgupta/Desktop/WorkAccomplised/sfP`

## Summary of work completed
In this phase, we established the core architectural foundation for the Customer Storefront. We cleanly isolated the Storefront layout from the existing Owner panel without introducing any conflicting dependencies or global style overwrites. We successfully reproduced the `kurtiwalas.in` reference homepage, implementing the Announcement Bar, Header, Hero section, Product Carousel (used for Featured Collections and New Arrivals), Collection Grid, and Footer. The layout is fully responsive and adheres to the specified design tokens (Chivo and Instrument Serif fonts, maroon and white palette).

## Files/folders created
- `reference/demo-site/screenshots/desktop/home_desktop_initial.png`
- `reference/demo-site/screenshots/desktop/featured_collection.png`
- `reference/demo-site/notes/visual_notes.txt`
- `client/src/storefront/layout/StorefrontLayout.jsx`
- `client/src/storefront/pages/Home.jsx`
- `client/src/storefront/components/AnnouncementBar.jsx`
- `client/src/storefront/components/StoreHeader.jsx`
- `client/src/storefront/components/Hero.jsx`
- `client/src/storefront/components/ProductCard.jsx`
- `client/src/storefront/components/ProductCarousel.jsx`
- `client/src/storefront/components/CollectionGrid.jsx`
- `client/src/storefront/components/StoreFooter.jsx`
- `client/src/storefront/styles/storefront.css`

## Files modified
- `client/src/App.jsx` (Added Storefront routes and redirected root `/` from dashboard to storefront)

## Components created
- `StorefrontLayout`: Wraps all storefront routes and manages global storefront resets.
- `AnnouncementBar`: Static top banner for offers.
- `StoreHeader`: Navigation header featuring scroll-based transparency transition and a mobile hamburger menu.
- `Hero`: Large 70vh cover image area.
- `ProductCard`: Individual portrait-ratio product card matching reference typography and layout.
- `ProductCarousel`: Horizontal scrolling track with left/right chevron arrows that snap and hide on mobile.
- `CollectionGrid`: 4-column desktop layout for collection discovery.
- `StoreFooter`: Multi-column footer structure.

## Routes created/modified
- Created `Route path="/"` pointing to `<Home />` inside the `<StorefrontLayout />`.
- Retained all `<OwnerLayout />` routes under their respective paths (e.g., `/dashboard`, `/products`).

## CSS/styling work
- Utilized the `storefront.css` file to safely sandbox customer-facing styles under the `.storefront` namespace.
- Implemented pure CSS scroll snapping for carousels (`scroll-snap-type: x mandatory`).
- Implemented responsive breakpoints for mobile (hamburger menu drawer, hiding external slider arrows, converting grids from 4 columns to 2 columns).

## Reference website inspected
- `https://kurtiwalas.in/`

## Reference screenshots captured
- Yes, captured via Puppeteer headless browser rendering.

## Location of captured screenshots
- `/Users/pratyushgupta/Desktop/WorkAccomplised/sfP/reference/demo-site/screenshots/desktop/`

## Important design observations
- **Typography:** Headings use `Instrument Serif` for elegance; body text uses `Chivo`.
- **Colors:** Deep burgundy/maroon (`rgb(67, 6, 6)`) over stark white.
- **Header:** Overlays the hero image initially but shifts to solid white when scrolled down.
- **Product Presentation:** No inline buttons ("Add to Cart") on the homepage grids. Focus is strictly on the portrait photography, title, and price.

## Mock data created
- Maintained inside `Home.jsx` explicitly marked as `MOCK DATA` to be swapped with actual Redux/Context state or direct API calls in Phase 5. Includes mock products and collection arrays.

## Backend changes
No backend changes.

## Testing performed
- Application startup: PASS
- Homepage rendering: PASS
- Desktop browser layout: PASS (verified via full-page screenshot)
- Mobile browser layout: PASS (verified via custom window size screenshot)
- Responsive behavior: PASS
- Console errors: NONE
- Owner panel regression check: PASS (verified `/dashboard` rendering is untouched)

## Known limitations
- Authentication functionality was purposefully omitted from the header (no Login modal).
- Links within the StoreHeader and Footer currently point to `#` as Phase 2 pages are not yet built.
- All product data is currently mocked.

## Issues encountered and fixes
- **Issue:** The existing `index.css` defined root-level body background colors optimized for the dark-mode Owner dashboard.
- **Fix:** Used a strict `.storefront` container class inside `StorefrontLayout.jsx` to apply specific background/color resets only to the customer side without bleeding into the dashboard.

## Next phase
**Phase 2 — Customer shopping/browsing pages:** We will create the Collection/Shop pages and the detailed Product Details pages, utilizing the existing mock data strategy until Phase 5.
