# Pradhan by Panchayat

Static storefront for the clothing line from TVF's Panchayat. Layout modelled on snitch.com, in a rustic cream palette, opening inside a real-time 3D reconstruction based on Panchayat office production stills: open the steel almirah for hanging kurtas, or visit Sachiv ji’s clothing wall for everyday casuals.

- Pages: `index.html`, `shop.html`, `product.html?id=...`, `about.html`
- Shared header, footer, bag and opening screen live in `build.py`. After editing it or anything in `assets/`, run `python build.py` to regenerate the pages (CSS and JS are cache-busted automatically).
- Opening screen: `partials/intro.html`, `assets/js/intro.js`, `assets/css/intro.css`, `assets/js/intro-office-3d.js`, and `assets/js/intro-garments-3d.js`. Home only; all store content stays independent.
- 3D: local Three.js 0.187.0 renders the set, hinged doors and volumetric cloth. Motion mini 12.23.24 handles interface transitions. Licenses are in `assets/js/vendor/`. The user explicitly requested a 3D opening on 6 November 2026.
- Rendering pauses when idle or hidden; shadow maps are cached while the camera moves. Reduced motion preserves browsing with immediate camera changes; devices without WebGL2 retain collection links and store entry. Escape returns from a collection, then exits the intro. The renderer is disposed when entering the store.
- Product data: `assets/js/data.js` (sample products and prices).
- Image credits: `IMAGE-SOURCES.md`.
- `v2/` only forwards old links to the main address.
- Local preview: `python -m http.server 5173`, then open http://localhost:5173
