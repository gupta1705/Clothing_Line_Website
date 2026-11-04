# Pradhan by Panchayat

Static storefront preview, modelled on The Candy Vault (Awwwards nominee).

- Pages: `index.html`, `shop.html`, `product.html?id=…`, `gift-card.html`, `about.html`
- Shared header, footer and cart drawer live in `build.py`. After editing it or anything in `assets/`, run `python build.py` to regenerate the pages (the script also cache-busts the CSS and JS).
- Product data: `assets/js/data.js` (sample products and prices).
- Local preview: `python -m http.server 5173`, then open http://localhost:5173
