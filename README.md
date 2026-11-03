# Pradhan by Panchayat — Storefront preview

A clothing line by TVF, derived from Panchayat. The current preview retains the earthy palette, Alegreya typography, approved “Every thread has a village.” tagline and name-led artisan philosophy.

Live preview: https://gupta1705.github.io/Clothing_Line_Website/

## Current design — 3 November 2026

- Shopping navigation, clear category links, collection calls to action and a bag on every page.
- Authentic Panchayat stills replace all generated imagery on the homepage. The ensemble introduces the brand; Sachiv Ji and Pradhan Ji introduce collection edits; Manju Devi and Pradhan Ji support gifting.
- Removed numbered philosophy cards, decorative postmarks, repeated italic slogans, the mock letter and generated artisan-story section. The approved philosophy remains in a compact section.
- The homepage remains collection-led, with individual garments and prices on collection pages as requested in the earlier brief.
- All four official stills total approximately 204 KB; a smaller responsive hero is also included. Two local font families, no frameworks or third-party client dependencies.

## Shopping behaviour and limits

Collection pages support all, shirts, kurtas, Nehru jackets and gifts; previous everyday/gathering/heirloom links continue to work. Filters support browser Back, and products can be sorted by sample price.

Existing garment illustrations remain placeholders because final product photography and specifications have not been supplied. Prices (₹1,490 shirt, ₹2,490 kurta, ₹3,990 jacket) are illustrative and visibly labelled. These are not garments claimed to have been worn by the cast.

Choose a required size, optional gift wrap, price-free invoice and personal note, then add to a browser-local preview bag. The bag supports quantity changes, removal and a calculated sample subtotal. Storage failure falls back to the current page. Gift messages are rendered as text.

This static preview takes no orders or payments and sends no information to a server. Razorpay, inventory, delivery calculation, order storage and actual checkout are not connected. “Review bag” explains this; it never reports a completed order.

## Image sources

Authentic official stills, resized and converted to WebP only:

- [About Amazon India: Panchayat Season 3, Neena Gupta interview](https://www.aboutamazon.in/news/entertainment/panchayat-season-3-interview-with-neena-gupta) — ensemble, Sachiv Ji on motorcycle, Pradhan Ji and Manju Devi.
- [About Amazon India: Panchayat Season 4 review](https://www.aboutamazon.in/news/entertainment/panchayat-season-4-review) — Manju Devi and Pradhan Ji at the office.

Full image URLs, dimensions, descriptions and crop notes: assets/panchayat/sources.json. Credit: Panchayat / TVF / Prime Video. Original downloads are outside the public repository in preview-review/panchayat-source-images.

The old generated assets are retained in assets for provenance, but are not referenced by the current homepage.

## Preview and verification

Serve this directory with Python's static HTTP server on port 4176 and open http://127.0.0.1:4176/.

Verified responsive homepage at 320, 390, 768 and 1280 pixels, image loading, mobile menu, collection navigation, filters, sorting and browser Back. Verified required size validation, gift message and invoice selection, adding to bag, quantity/subtotal updates, persistence between pages, removal and focus restoration. JavaScript syntax and local asset references checked.

These checks do not constitute a production checkout test, a Lighthouse score or testing on a physical low-end Android device.

Fonts: Alegreya and Alegreya Sans, locally hosted Latin WOFF2 subsets with font-display: swap. SIL Open Font License texts are included in assets/fonts/.
