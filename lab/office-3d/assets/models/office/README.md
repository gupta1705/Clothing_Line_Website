# Authored office props

These models were downloaded directly from Poly Haven through its public asset API. The original glTF, binary buffers, and texture downloads were checked against the MD5 hashes published in the official API before packaging. No generated meshes or AI-created textures are included here.

All seven assets are [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), under the [Poly Haven asset license](https://polyhaven.com/license). Credit is included for provenance even though CC0 does not require attribution.

| File | Original asset and author | Textures | Triangles |
| --- | --- | --- | ---: |
| `chair.glb` | [Plastic Monobloc Chair 01](https://polyhaven.com/a/plastic_monobloc_chair_01) — Kuutti Siitonen | 2K | 3,356 |
| `desk.glb` | [Metal Office Desk](https://polyhaven.com/a/metal_office_desk) — Ulan Cabanilla | 1K | 6,898 |
| `table.glb` | [Wooden Table 02](https://polyhaven.com/a/wooden_table_02) — Serhii Khromov | 1K | 196 |
| `jug.glb` | [Metal Jug](https://polyhaven.com/a/metal_jug) — Anzor Lezhava | 1K | 6,040 |
| `books.glb` | [Book Encyclopedia Set 01](https://polyhaven.com/a/book_encyclopedia_set_01) — John Malcolm | 1K | 67,306 total |
| `binder.glb` | [Binder Notebook](https://polyhaven.com/a/binder_notebook) — DaDrood | 1K | 18,077 total |
| `stationery.glb` | [Stationery Supplies](https://polyhaven.com/a/stationery_supplies) — Mateusz Sadek | 1K | 4,412 total |

Each asset's official file listing is `https://api.polyhaven.com/files/<asset_id>` and creator information is `https://api.polyhaven.com/info/<asset_id>`. Asset IDs, exact output sizes, SHA-256 hashes, and selectable node names are recorded in [`sources.json`](sources.json). Source/author/license information is also embedded in the GLB `asset.extras`.

## Packaging changes

The glTF geometry and textures were embedded in single GLB files. Authored geometry, normals, UVs, node transforms, and PBR material definitions were retained. The desk and table maps were downsampled from 2K to 1K for delivery; the chair retains its original 2K maps. Other props use the source's original 1K maps. There was no geometry simplification or deformation.

The runtime adapter clones materials for each instance while sharing immutable geometry and textures. Optional tinting, scale, positioning and rotation happen only at runtime. The maps retain the authored base color, normal, ambient-occlusion and metallic/roughness detail.

## Placement contract

`window.loadPanchayatOfficeProps(THREE, renderer)` resolves to `{ create, dispose, manifest }`. `create(key, options)` returns a new Group centered in X/Z and aligned to floor Y=0. Native furniture uses Y up; the chair faces +Z and desk drawer handles face +Z.

- `height`, `width`, and `depth` fit the model within those limits while preserving its proportions. With no size options, dimensions remain in source metres.
- `rotationX` and `rotationZ` are applied before fitting and floor alignment. `rotationY` turns the completed Group.
- `color` applies an optional tint while retaining the texture maps.
- `castShadow` and `receiveShadow` default to true.
- `create('book', { index: 3, height: .25 })` selects one volume from the 20-book set. The equivalent is `create('books', { book: 3, height: .25 })`. A single volume has two meshes and about 3,365 triangles; avoid repeating the complete set unnecessarily.
- `create('binder', { variant: 'open', width: .43 })` selects the open notebook; `variant: 'closed'` selects the closed one.
- `create('stationery', { part: 'pencilcup', height: .12 })` selects one item. Other `part` values are `pen_red`, `pen_blue`, `pen_fancy`, `pencil_new_a`, `pencil_new_b`, `pencil_used`, `pencil_old`, and `eraser`. Native pens lie flat; use `rotationZ` plus `height` to stand a pen upright.

Native approximate dimensions (width × height × depth, metres): chair .642 × .880 × .628; desk 2 × .788 × .947; wooden table 1.134 × .800 × .706; metal jug .197 × .288 × .195. A .25-m-tall single book is roughly .02–.04 m wide and .172 m deep. `manifest[key].nativeSize` and each instance's `userData.size` provide measured bounds.

## Set matching

The monobloc chair is a strong match for the set's ordinary molded plastic seating. The metal desk is a worn double-pedestal office desk; the wooden table is a plain rural table. The object called `jug` by its source is a small galvanized milk churn, suitable only as an optional background prop; it is not a tabletop pouring jug. The books are encyclopedia volumes, so office archive files should remain separate set dressing.

No downloaded fan is included: the inspected freely downloadable authored examples had modern four-blade/light fixtures, unlike the traditional three-blade fan in the Panchayat reference. No unrelated ornate cabinet was substituted for the interactive steel almirah.
