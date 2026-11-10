# Pradhan by Panchayat

Static storefront for the clothing line from TVF's Panchayat. Layout modelled on snitch.com, in a rustic cream palette, opening on a landonorris.com-style hover reveal of Pradhan ji. Experimental openings live under `lab/` (list at `lab/index.html`): the Phulera walk (`lab/phulera/`) and the 3D office (`lab/office-3d/`).

- Pages: `index.html`, `shop.html`, `product.html?id=...`, `about.html`
- Shared header, footer, bag and opening screen live in `build.py`. After editing it or anything in `assets/`, run `python build.py` to regenerate the pages (CSS and JS are cache-busted automatically).
- Opening screen (live): `assets/js/intro.js`, `assets/css/intro.css`, `assets/img/intro-*`.
- Phulera walk (experimental): `lab/phulera/intro.js` (stops, text and hotspots are in `STOPS` at the top), `lab/phulera/intro.css`, `assets/img/op/`; `INTRO_PHULERA` in `build.py`. It is 2D canvas only, with no libraries; the scripts that made its images are kept outside the site in `../local-backups/opening-plates-2026-11-06/`. Lab pages use `<base href>` so they share the store's files.
- 3D office (experimental): `lab/office-3d/assets/`, rebuilt from `lab/office-3d/source-index.txt` by `build.py`. It downloads about 35 MB.
- Product data: `assets/js/data.js` (sample products and prices).
- Image credits: `IMAGE-SOURCES.md`.
- `v2/` only forwards old links to the main address.
- Local preview: `python -m http.server 5173`, then open http://localhost:5173
