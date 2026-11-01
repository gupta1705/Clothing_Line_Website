# Pradhan — Craft-led design recommendation

The client is TVF, and Pradhan is a clothing line derived from its series Panchayat (confirmed by the user on 1 November 2026). The current direction carries Phulera’s office, water tank, everyday warmth and relationships into a mature apparel identity. The approved tagline and artisan philosophy are retained; Phulera is a fictional inspiration, not a claim about where garments are made.

The initial structure took inspiration from Kurono Tokyo's maker-to-collection sequence, anOrdain's emphasis on craft processes, and Injiri's Indian textile storytelling. The design, writing and generated images are original to this preview. It is not a clone of those sites.

The homepage contains philosophy, craft, collection themes and gifting stories. It has no individual garment listings, prices or purchase controls. Collection links lead to clearly labelled sample silhouettes with an accessible size/gifting dialog; no information is submitted or stored, and no ordering/payment is implemented.

## Design

- Panchayat direction: a Phulera-inspired office hero, muted mustard story band, original water-tank postmark, TVF credit and collection names Phulera days / The gathering edit / For our own. Alegreya typography retained after positive feedback.
- Deep olive hero, parchment philosophy, pale clay craft section, espresso collection gallery and a muted clay gifting section. Updated 1 November 2026 after feedback that the original ivory-dominant version felt too plain.
- Uses the approved tagline “Every thread has a village.” and name-led homepage philosophy from the project brief.
- Alegreya for headings, wordmark and sentence-case navigation; Alegreya Sans for body and utility text. Local Latin WOFF2 subsets (about 132 KiB total), with `font-display: swap` and a preload for the main serif. No third-party font requests. Font sources: [Alegreya](https://github.com/huertatipografica/Alegreya) and [Alegreya Sans](https://github.com/huertatipografica/Alegreya-Sans); both SIL Open Font License texts are included in `assets/fonts/`. Updated 1 November 2026 after feedback on the generic navigation type.
- A small correspondence detail in the gifting section retains a connection to the earlier letter concept.
- Responsive WebP images and lazy loading below the hero.
- No frameworks, video, animation libraries or third-party services. Light CSS interactions respect reduced motion.

## Preview and verification

Panchayat update checked at 1280, 768, 390 and 320 px: new story/menu anchor, concept-image crop, horizontal overflow, renamed collection navigation and loaded collection images. The three collection links resolve to their matching titles and sample counts. No new application behavior or third-party dependencies were introduced.

Serve the repository root with `python -m http.server 4176 --bind 127.0.0.1`, then open `/recommended/`.

Typography reviewed at desktop width 1280, tablet width 768 and phone widths 390 and 320, including the expanded mobile menu and collection dialog. No horizontal overflow at those widths. Verified collection links, mobile menu, required size selection, gifting selections, gift message summary, Escape closing and focus restoration. Local references and JavaScript syntax checked. These checks do not constitute a Lighthouse performance score or a production checkout test.

## Image provenance

All five conceptual photographs were generated with the built-in image-generation tool. They do not document Pradhan's actual artisans, facilities, products or packaging and are not actual show stills. Replace them with supplied brand photographs before production. The new office image received one composition edit in the image-generation tool; other subsequent processing was WebP conversion and responsive resizing. Originals remain outside the public repository.

Project files: `assets/loom-hands.webp`, `assets/loom-hands-small.webp`, `assets/courtyard.webp`, `assets/courtyard-small.webp`, `assets/textiles.webp`, `assets/textiles-small.webp`, `assets/gift.webp`, `assets/gift-small.webp`.

### Loom hands — exact prompt

Use case: photorealistic-natural. Asset type: editorial website hero photograph for an Indian village-craft apparel brand concept. Create one original, horizontal landscape photograph (3:2). Close-up of mature Indian artisan hands carefully guiding raw cream cotton threads across a traditional wooden handloom, no face visible. The beautifully worn teak loom and taut ecru yarn are the subjects, with hands concentrated in the center-right of the composition. Physically plausible loom construction and weaving action, anatomically natural hands and fingers. Warm natural side-light from a workshop window, gentle shadows, tactile fibers, quiet desaturated documentary luxury editorial atmosphere. Palette of cream, weathered teak, dark brown, soft charcoal; rich but restrained. Intimate observational photography, shallow but sufficient depth of field to show craft detail, no glamour retouching. No text, lettering, logos, watermarks, finished garments, product display, collage, frames or decorative graphic elements.

### Courtyard — exact prompt

Use case: photorealistic-natural. Asset type: original editorial landscape photograph for an Indian village-craft apparel brand website design preview. A quiet rural Indian limewashed courtyard in warm early morning light. An old dark teak door, an empty woven charpai, dappled neem tree shadows across the pale wall and floor, and a simple earthen pot. Tasteful documentary photography, truthful architectural proportions, serene and lived-in rather than staged rustic kitsch. Muted stone, ochre, ecru and subdued olive tones. Tactile plaster, old wood and woven rope. Landscape 3:2 framing, carefully balanced composition, medium-wide lens. No people, no clothing, no merchandise display, no text, no logos, no watermark. This is conceptual mood imagery, not documentation of an identifiable real place.

### Textiles — exact prompt

Use case: photorealistic-natural. Asset type: original editorial landscape textile photograph for an Indian village-craft apparel brand website design preview. An extreme tactile close-up still life of raw cream handwoven cotton, with a softly folded muted olive textile and one old wooden thread spool. Warm natural sidelight, delicate shadows, visible subtle imperfections in the weave, cinematic documentary still life with understated premium styling. Ecru, stone, subdued olive and warm brown palette. Landscape 3:2 composition, detail sharp but softly fall off in the background. No finished garments, no clothing for sale, no packaging, no text, no logo, no watermark. This is conceptual mood imagery, not a claim about an actual supplier or product.

### Gifting — exact prompt

Use case: photorealistic-natural. Asset type: supporting editorial photograph for the gifting section of an Indian village-craft apparel website concept. Create one original horizontal landscape photograph, 3:2. On an old dark teak table sits a simple closed handmade ivory-paper gift box, neatly tied with a single natural cotton thread. Beside it lies one small blank cream correspondence card and one tiny dried leaf. Intimate tasteful restraint, a real tactile handmade object in a real setting, soft afternoon window light with rich brown shadows. Natural subtle irregularities in paper, visible cotton fibers and weathered wood grain. Warm desaturated documentary editorial photography; muted ivory, oatmeal and deep teak-brown palette. Compose the complete gift box comfortably within the center of the frame, with breathing room around it for responsive cropping. Physically realistic materials, natural camera perspective and softly graded shadows. No words, lettering, logos, brands, watermarks, clothing, ribbons, elaborate decorations, graphic elements, CGI or glossy 3D-render aesthetics.

## Panchayat references

The following official sources ground the setting references. Copy, collection names and visual interpretation are original design proposals, not dialogue quotations.

- [Prime Video: Panchayat, Season 1](https://www.primevideo.com/detail/0KAFPP1MAADAFUOA6I2WR5D4TM) — Phulera and the village panchayat office; studio The Viral Fever.
- [About Amazon: Panchayat’s familiar world](https://www.aboutamazon.in/news/entertainment/panchayat-season-4-review) — office, water tank, village lanes, familiarity and relationships.

### Phulera-inspired office — concept image

Built-in image generation, followed by one composition edit. This is an imagined scene, not an official set photograph or show still. WebP resizing/conversion was the only other processing. Desktop: assets/phulera-courtyard.webp (1200 × 800); mobile: assets/phulera-courtyard-small.webp (640 × 427).

Generation prompt:
Use case: photorealistic-natural. Asset type: new editorial website hero photograph for a TVF Panchayat-inspired clothing brand concept. Create ONE original photorealistic horizontal 3:2 composition, an evocative imagined setting inspired by Phulera in the television series Panchayat, not a reproduction of an actual set photograph. The scene is empty of people. Show a humble, modest single-storey rural Indian panchayat office, creamy pale-yellow weathered limewashed walls, a faded green lower-wall band, dark-green plain wooden doors, and a simple concrete veranda supported by unadorned square pillars. An old black roadster bicycle leans against the wall near a green door, and an empty plain wooden bench sits on the veranda. A dusty earthen courtyard fills the foreground; a leafy neem tree enters along one edge. A distant cylindrical concrete village water tank on tall legs is glimpsed clearly but unobtrusively above the roofline. Quiet late-afternoon sunlight, gentle natural shadows, everyday rural institutional architecture, authentic worn plaster and concrete textures. Faded mustard, chalky cream, muted olive-green and earthy brown palette. Understated cinematic observational photography, grounded, inviting, unpretentious, realistic proportions. Compose the building, bicycle and bench within the central two-thirds so they remain legible when cropped to a centered square; keep the camera relatively straight-on at human eye level. No people, no actors, no clothing or garments or products, no writing, no signs, no labels, no logos, no watermark. Avoid designer courtyards, heritage hotels, decorative arches, lavish architecture, exaggerated rustic props, orange filters, sepia treatment, CGI or illustration.

Composition edit prompt:

Edit this photograph only to improve responsive cropping, preserving its photorealistic style, exact modest rural panchayat-office architecture, afternoon light, faded cream/yellow walls and green lower band, shadows, tree and dusty foreground. Move the same black roadster bicycle from the far-left edge to lean beside the central green door, with both wheels fully within the middle third of the full image (approximately x=580 to x=880 in a 1536px-wide image). Move the plain wooden bench slightly to the right as needed, keeping it beside the barred window and fully inside the central two-thirds. Reposition the distant cylindrical concrete water tank so it is glimpsed over the roof near the upper center-right, horizontally around x=1050, not at the far-right border. The office doorway, bicycle, bench and water tank must all remain visible together inside a centered square crop and a right-aligned square crop of this landscape image. Keep landscape 3:2. No people, text, signs, logos, garments, products or watermarks. Preserve the unpretentious rural Indian institutional feeling, natural wear and physically plausible scene; do not redesign it as a luxury hotel.
