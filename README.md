# Pradhan by Panchayat

Static storefront preview, modelled on shopkshm.com (KSHM).

- Pages: `index.html`, `collection.html`, `product.html?id=…`, `about.html`
- Shared header, footer and cart drawer live in `build.py`. After editing it or anything in `assets/`, run `python build.py` to regenerate the pages (CSS and JS are cache-busted automatically).
- Product data: `assets/js/data.js` (sample products and prices).
- Local preview: `python -m http.server 5173`, then open http://localhost:5173
