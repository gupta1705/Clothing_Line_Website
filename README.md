# Pradhan by Panchayat

Static storefront for the clothing line from TVF's Panchayat. Layout modelled on snitch.com, in a rustic cream palette, opening on a landonorris.com-style hover reveal of Pradhan ji.

- Pages: `index.html`, `shop.html`, `product.html?id=...`, `about.html`
- Shared header, footer, bag and opening screen live in `build.py`. After editing it or anything in `assets/`, run `python build.py` to regenerate the pages (CSS and JS are cache-busted automatically).
- Opening screen: `assets/js/intro.js`, `assets/css/intro.css`, `assets/img/intro-*`.
- Product data: `assets/js/data.js` (sample products and prices).
- Image credits: `IMAGE-SOURCES.md`.
- `v2/` only forwards old links to the main address.
- Local preview: `python -m http.server 5173`, then open http://localhost:5173
