# Temporary garment demonstration models

These models provide temporary, professionally authored clothing for the opening office scene. They are demonstration garments, not digital replicas of the Panchayat products in the catalogue. Replace them with the final supplied garment assets when available.

The model licenses below apply to the model assets independently of the licenses of the GitHub repositories that mirror them. The unrelated `t-shirt-polo.glb` found during research was not included because its embedded license was the Sketchfab Standard license rather than Creative Commons.

## Attribution

### Dickies Long Sleeve Shirt — Kodie Russell

- Local file: [`intro-demo/collared-shirt.glb`](intro-demo/collared-shirt.glb)
- Author: [Kodie Russell](https://sketchfab.com/KodieRussell)
- Primary source: [Dickies Long Sleeve Shirt](https://sketchfab.com/3d-models/dickies-long-sleeve-shirt-f6f27327fbaf423081ae9da8e5dc109e)
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- Download mirror: [LeTiepTuyen/3D-Clothes-Design-Application, `client/public/full_shirt.glb`](https://github.com/LeTiepTuyen/3D-Clothes-Design-Application/blob/main/client/public/full_shirt.glb)
- Verification: the primary source identifies Kodie Russell and CC Attribution; the GLB `asset.extras` explicitly records this author, source, title, and `CC-BY-4.0` license. The source describes sculpting in ZBrush, retopology in Maya, and texturing in Substance Painter.
- Changes: renamed file only; original mesh, normals, UVs, materials, and embedded textures retained. Any scene scaling, rotation, lighting, or material tint is applied at runtime.
- Asset details: 7,727 triangles; one material; three 1024-pixel base-color, occlusion/metallic/roughness, and normal maps. This is a dark long-sleeve pocket crew-neck, despite the retained integration filename `collared-shirt.glb`; it has no pointed collar or button placket. Native orientation is Y up with the front toward +Z; extended sleeves create a broad silhouette.
- SHA-256: `57809bd4b54d943aefa994986f26838d46710d39c7da0cef82a0d7839dd18fd1`

### Puffer Jacket — oluwaphemi

- Local file: [`intro-demo/studio-jacket.glb`](intro-demo/studio-jacket.glb)
- Author: [oluwaphemi](https://sketchfab.com/oluwaphemi)
- Primary source: [Puffer Jacket](https://sketchfab.com/3d-models/puffer-jacket-7d95660645834760a0a638775e5fe4a7)
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- Download mirror: [BhavyaAk25/ar-virtual-try-on, `assets/jackets/studio_jacket.glb`](https://github.com/BhavyaAk25/ar-virtual-try-on/blob/main/assets/jackets/studio_jacket.glb)
- Verification: the primary source identifies oluwaphemi, CC Attribution, and 85.4K triangles. The GLB `asset.extras` explicitly records this author, source, title, and `CC-BY-4.0` license.
- Changes: renamed file and downsampled its three embedded PNG maps from 4096 to 2048 pixels for browser delivery. No geometry simplification or mesh deformation. All authored mesh data, normals, UVs, material definitions, and node transforms are preserved exactly. Any additional scene scaling, rotation, lighting, or material tint is applied at runtime.
- Asset details: 85,373 triangles; 30 mesh entries; seven materials; red nylon base-color, occlusion/metallic/roughness, and normal maps with ribbed cuff detail. Optimized file size is 7,448,872 bytes versus 15,309,944 bytes in the downloaded original.
- SHA-256: `34e5063ce89e91b2ac0a20678a096a3a89bc389c74a1aff8569922c4847b8ad3`

### shirt_baked — ttv.thuyvy

- Local file: [`intro-demo/studio-tee.glb`](intro-demo/studio-tee.glb)
- Author: [ttv.thuyvy](https://sketchfab.com/ttv.thuyvy)
- Primary source: [shirt_baked](https://sketchfab.com/3d-models/shirt-baked-803c1f1527824c3baf62693b9afc4e13)
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- Download mirror: [adrianhajdin/project_threejs_ai, `client/public/shirt_baked.glb`](https://github.com/adrianhajdin/project_threejs_ai/blob/main/client/public/shirt_baked.glb)
- Verification: the indexed primary source identifies ttv.thuyvy, CC Attribution, 19.5K triangles, and a publication date of 3 December 2023. Attribution of this mirror is inferred from its matching model/title and 19,517-triangle geometry; no checksum from the original Sketchfab download was available for comparison. Unlike the other two assets, this file does not embed author/license metadata, so this attribution record must accompany it.
- Changes: renamed file only; original mesh, normals, UVs, materials, and embedded textures retained. Any scene scaling, rotation, lighting, or material tint is applied at runtime.
- Asset details: 19,517 triangles; one material; two 1024-pixel maps, including repeating fabric normal detail and baked occlusion. `KHR_texture_transform` is used by the authored normal map and must be respected by the loader.
- SHA-256: `4c020995f86593348909fc6da64c390d60ef2a22f8a4d421f70aced70acc3725`

## Attribution when distributed

Keep this document with the assets and retain accessible credits in the experience. Suitable compact credit text:

> Demo clothing: “Dickies Long Sleeve Shirt” by Kodie Russell, “Puffer Jacket” by oluwaphemi, and “Shirt baked” by ttv.thuyvy, licensed under CC BY 4.0. Puffer textures resized; garments positioned and lit for this demonstration. Source links and modification details are in the model credits.

The licenses grant permission for these model assets; the creators do not endorse this website. Existing brand markings belong to their respective owners.
