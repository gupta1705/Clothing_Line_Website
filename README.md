# Pradhan by Panchayat

Design iterations of the storefront, each in its own folder:

- `v1/`: KSHM layout (shopkshm.com)
- `v2/`: Snitch layout (snitch.com)

The root `index.html` is the version picker. `versions.js` is the single list of versions; it also adds the floating "Version" switcher to every page inside a version folder. To add a version, create `vN/`, include `../versions.js` in its pages, add an entry to `versions.js` and a 960x600 thumbnail at `versions/vN.webp`.

Inside each version, shared header, footer and cart live in `build.py`. After editing it or anything in `assets/`, run `python build.py` in that folder.

Local preview: `python -m http.server 5173`, then open http://localhost:5173
