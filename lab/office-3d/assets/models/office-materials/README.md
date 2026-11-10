# Panchayat office surface scans

These six material sets are downloaded from Poly Haven's primary distribution. They replace generated noise in the office's main surfaces with photographed surface detail, tangent-space OpenGL normals, measured roughness, and surface ambient occlusion. They are demonstration surfaces selected to resemble the office reference; they are not scans of the actual television set.

All six sources are **CC0 1.0**, including commercial use and redistribution. See [Poly Haven's asset license](https://polyhaven.com/license) and [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Attribution is retained here for provenance even though CC0 does not require it.

| Material key | Primary source | Artists | One texture tile in metres |
| --- | --- | --- | --- |
| `upper` | [Plastered Wall 04](https://polyhaven.com/a/plastered_wall_04) | Rob Tuytel | 3.2 × 3.2 |
| `lower` | [Yellow Plaster](https://polyhaven.com/a/yellow_plaster) | Rob Tuytel | 2 × 2 |
| `floor` | [Grey Tiles](https://polyhaven.com/a/grey_tiles) | Amal Kumar | 2.2 × 2.2 |
| `wood` | [Wood Table 001](https://polyhaven.com/a/wood_table_001) | Dimitrios Savva, photography; Rico Cilliers, processing | 1.5 × 1.5 |
| `cloth` | [Stretch Poplin](https://polyhaven.com/a/stretch_poplin) | colormass, photography; Rico Cilliers, processing | 0.291 × 0.2808 |
| `metal` | [Blue Metal Plate](https://polyhaven.com/a/blue_metal_plate) | Rob Tuytel | 2.5 × 2.5 |

The floor scan contains approximately four square stone tiles in each direction, so the calibrated tile width is approximately 55 cm. The metal scan is blue painted flat sheet with scuffs; it is deliberately not a corrugated texture. Green poplin preserves its fine photographed weave. Material color multipliers warm the grey plaster, deepen the mustard paint, darken the furniture, and tint the cloth green; they do not generate new surface patterns.

## Files and optimization

Each material has four local JPG files: `diffuse`, `nor_gl`, `rough`, and `ao`. Walls, floor, and wood use 2048-pixel color/normal/roughness maps and 1024-pixel AO. Cloth and metal use the source's 1K maps. Cloth has the original 1024 × 988 aspect ratio. All native source pixel dimensions are preserved.

The source JPGs were recompressed for the browser at quality 86 (color/roughness/AO) or quality 91 with 4:4:4 chroma (normal maps). No generated texture, baked lighting, image synthesis, or geometric alteration was introduced. The 24 local images total approximately **7.93 MiB**, reduced from approximately 19.6 MiB. The adjacent `manifest.json` records every original URL, source hash, distributed hash, byte count, author, physical dimensions, and license. Primary metadata was obtained from `https://api.polyhaven.com/info/{asset}` and file links from `https://api.polyhaven.com/files/{asset}`.

## Runtime contract

Load `assets/js/intro-office-materials.js` before requesting the office scene, then call `await window.loadPanchayatOfficeMaterials(THREE, renderer)`. It returns `{ materials, dispose, manifest }`, where `materials` has the six keys listed above.

Mesh UVs must be expressed in **world metres**. The loader sets map repeats to the reciprocal of each scan's physical size. Avoid applying that physical scale a second time. All four maps use UV channel 0. Only color maps use sRGB; normals, roughness, and AO remain linear data. Materials use conservative normal strengths and AO influence to avoid exaggerated plaster relief or overly dark dirt. The cloth is double-sided.

The loader keeps all URLs local to this directory, caps anisotropy at 8, times out individual loads after 25 seconds, aborts pending fetches on failure, and reclaims object URLs, textures, decoded bitmap resources if present, and materials. The owner must call `dispose()` when the office ends.

Downloaded and verified 2026-11-06.
