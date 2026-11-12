# Image sources

All photographs on the site are official Panchayat stills and key art (credit: Panchayat / TVF / Prime Video). They were downloaded at full size, then cropped and resized to WebP. No AI-generated images are used anywhere on the site.

## Store images

Published on Prime Video's press pages at About Amazon India, downloaded on 4 November 2026.

| Original file | Original size | Source page |
|---|---|---|
| 66a5779-cc.jpg (ensemble) | 8192×4608 | https://www.aboutamazon.in/news/entertainment/panchayat-season-3-interview-with-neena-gupta |
| 66a4383-cc.jpg (Pradhan ji and Manju Devi) | 8192×4608 | same |
| 66a3935-cc.jpg (Pradhan ji, Nehru jacket and garland) | 8192×4608 | same |
| 66a8004-cc.jpg (Manju Devi at the office desk) | 8192×4608 | same |
| 66a2204-cc.jpg (Prahlad Cha) | 8192×4608 | same |
| 66a1375-2-cc.jpg (Sachiv ji on the bike) | 8192×4608 | same |
| panchayat-season-4-image-1.jpg (Manju Devi and Pradhan ji at the office) | 3200×1800 | https://www.aboutamazon.in/news/entertainment/panchayat-season-4-review |
| panchayat-season-4-image-2.jpg (Sachiv ji and Vikas on bikes) | 2000×1125 | same |
| panchayat-season-4-image-3.jpg (Sachiv ji in a half sweater) | 3000×1688 | same |

## Experimental Phulera walk (`lab/phulera/`)

Downloaded on 6 November 2026 with the user's approval. The IMDb and TMDB files are official images as hosted on those sites, not TVF's own masters. TVF should replace them with originals before launch where it can.

| Used for | File | Size | Host |
|---|---|---|---|
| Stop 1, the almirah: `assets/img/op/1*` | MV5BMjJjNjg1YjktNmQ0OC00NzQ5LWI1YzEtZGE5NDc5OTg1ZGNjXkEyXkFqcGc@._V1_.jpg | 6000×4000 | https://m.media-amazon.com (IMDb) |
| Stop 2, the tanki: `assets/img/op/2*` | cNKoTIHRBFAMr7epq1aJEtTCF5p.jpg | 2560×1441 | https://image.tmdb.org |
| Stop 3, the slogan wall: `assets/img/op/3*` | tu1rnLvaZZMnUZizNwCF5ag9iD3.jpg | 2560×1440 | https://image.tmdb.org |
| Stop 4, the lauki: `assets/img/op/4*` | nYaNWrta7kHnmQZnI9o61hAavDM.jpg | 2048×1152 | https://image.tmdb.org |

Also downloaded but not on the site at the moment: election art (gSaDMv503bbxylh3y3aPS0UMHgo.jpg), Pradhan ji and Prahlad Cha on the road (oHMgdbrBwOO1xscfTiQaBOqPPRU.jpg), the washing line (h94SvM4bNkWVxQ27vC4xLcUAeky.jpg), office art with the umbrella (lM9LGo4qnpOl0l94hE0DLXbcaXn.jpg), and the Phulera welcome board (panchayat-blog-banner-1280x720.jpg, About Amazon India). The opening's curtain sets the board's wording as live text; it does not use the photo.

**The live opening and stop 5** (`assets/img/intro-a*.webp`, `intro-b*.webp`) uses 66a4383-cc.jpg (aviators, linen shirt) and panchayat-season-4-image-1.jpg (half sweater). Their backgrounds were removed with classical image segmentation (OpenCV GrabCut, no generative AI), and the two were scaled to line up at the eyes and lightly colour-matched. The people and clothing are unaltered.

**What changed in the reveal layers (stops 1 to 4).** The first image of each pair (`*a-*.webp`) is the official image, only cropped and scaled. The second (`*b-*.webp`) is the same image altered by code, with no generative AI:
- Colour and light were re-graded: the office goes dark as in a power cut, the poster's sky goes to evening using its own clouds, and the desk's lamp is lifted. People were not altered, other than by this light.
- Everything added is drawn by a small offline renderer written for this project, then flattened into the WebP: the open almirah's doors and insides, the kurtas, the folded clothes, the clothes on the tank and washing line, and the gift box.
- Those added items use real textures sampled from the official stills: the almirah's paint, weave from Prahlad Cha's kurta, the cardboard box on the office rack. Colours of the checks come from shirts in the stills. They are placeholders for real product photography.
- The slogan wall's words "बच्चे" and "बवासीर" were painted out and replaced with "कुर्ते" and "अमीर", set in Nirmala UI and roughened to match the hand-painted letters. This parody line needs TVF's approval.

Not photographs:
- `p-gift-box.webp`: a drawn kraft-paper placeholder tile (shapes and text), used until a real gift-box photo exists.
- `p-kurta-neel.webp`, `p-kurta-safed.webp`, `p-kurta-mitti.webp`, `p-kurta-mehendi.webp`, `p-kurta-jute.webp`: kurtas drawn by code (no AI), placeholders until real product photos exist.
- `grain.png`: a procedurally generated noise texture.
- `intro-contours.svg`: procedurally generated map-style contour lines.

Products are named after the characters' on-screen outfits and use the stills as placeholders until real product photography is supplied.

The experimental 3D office (`lab/office-3d/`) uses licensed CC-BY garment models and CC0 Poly Haven materials; their credits are in `lab/office-3d/assets/models/README.models.md` and `lab/office-3d/assets/models/office-materials/README.md`.
