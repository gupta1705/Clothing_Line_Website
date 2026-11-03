# Pradhan by Panchayat — Storefront preview

A clothing line by TVF, derived from Panchayat. The earthy palette, local Alegreya typography, approved “Every thread has a village.” tagline and artisan philosophy remain.

Live preview: https://gupta1705.github.io/Clothing_Line_Website/
Collection: https://gupta1705.github.io/Clothing_Line_Website/collection.html?collection=all

## Current storefront — 3 November 2026

- Shared header: Shop, Collections, Gifting and Our story, with wishlist and bag controls. Clothing categories live in the shop sidebar and mobile filter panel, rather than being repeated in the main header.
- Collection pages have six real clothing photographs, alternate views, clear names/colours/prices, search, category and price filters, sorting and product details with required size selection.
- A browser-local wishlist supports saving/removing products, header counts, product deep links and syncing between open tabs. Heart controls work on cards and product details.
- The bag uses the shared catalogue for current names, prices and thumbnails, retains earlier saved product IDs, and supports quantity changes, removal, gift wrap, notes and a price-free invoice.
- The collection-led homepage retains authentic Panchayat stills. Individual products and prices remain on collection pages.

## Product photography and commerce status

The product photographs are genuine retailer photographs from Nicobar and Fabindia, used as styling references. They are not photographs of confirmed Pradhan inventory. Full source product names, image URLs, dimensions, credits and provenance are in assets/products/sources.json. Every product has a matching alternate image. Six front images total about 187 KB; all twelve images total about 390 KB. Only proportional resizing and WebP conversion were applied.

Names and prices are proposed for the design; final Pradhan products, photography, specifications and measurements have not been supplied. The photo/reference distinction appears in product details and the footer. No per-card “design sample” labels or sketches remain.

This static store does not take orders or payments. Razorpay, inventory, shipping calculation and order storage are not connected. The bag clearly says checkout is not available yet and never claims that an order has been placed. Wishlist, sizes and gift choices are stored only in the browser; gift notes are rendered as text. Storage failure falls back to the current page.

## Panchayat image sources

- [About Amazon India: Panchayat Season 3, Neena Gupta interview](https://www.aboutamazon.in/news/entertainment/panchayat-season-3-interview-with-neena-gupta) — ensemble, Sachiv Ji, Pradhan Ji and Manju Devi.
- [About Amazon India: Panchayat Season 4 review](https://www.aboutamazon.in/news/entertainment/panchayat-season-4-review) — Manju Devi and Pradhan Ji at the office.

Full details: assets/panchayat/sources.json. Credit: Panchayat / TVF / Prime Video. These are actual show stills, resized and converted to WebP.

## Preview and verification

Serve this directory with Python's static HTTP server on port 4176 and open http://127.0.0.1:4176/.

Verified desktop and mobile layouts at 320, 390, 768, 1280 and 1440 pixels, with no horizontal page overflow. Checked all twelve product images, mobile navigation/filter controls, search, price filtering, empty-state recovery, sorting, wishlist save/remove/pressed states, persistence and cross-tab synchronisation, wishlist product deep links, alternate views, required sizes, gift options, bag thumbnails and quantity/subtotal updates. Local references, unique IDs and JavaScript syntax checked.

These checks are not a production checkout test, a Lighthouse score or physical low-end Android testing.

No framework or third-party client library. Two locally hosted font families with font-display: swap; font licences are in assets/fonts/.
