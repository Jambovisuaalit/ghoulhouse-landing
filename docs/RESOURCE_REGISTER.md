# Website resources — selection and rights register

Reviewed 20 October 2026. [resources.json](resources.json) is the exact technical
manifest for all 17 public files and the local font: hash, bytes, usage class,
source, rights evidence and approval evidence. Run npm run qa:resources after changes.

## Selection hierarchy

1. Repository/main and deployed SHA define the website implementation.
2. The read official [visual identity source](https://docs.google.com/document/d/17U3eQmbktVY3YBMU8B9zYWqPLtklPgBdQJLxoe79Jrs/edit)
   defines the existing four-color brand and lockup rules; it replaces the old green identity.
3. Repository media are the selected website exports. Their presence does not prove
   licensing, external reuse permission or byte equality to a Drive master.
4. Other files named current/master/v1/v2 are reference candidates until compared.
   Do not select by highest version number, newest timestamp or filename alone.

## Working website assets

| Purpose | Selected files | Evidence / restriction |
| --- | --- | --- |
| Desktop logo | ghoulhouse-logo.svg, ghoulhouse-logo-reverse.svg | Existing brand export; external master equivalence pending |
| Mobile lockup / footer wordmark | favicon.svg, ghoulhouse-wordmark-black.svg, ghoulhouse-wordmark-white.svg | Current local exports |
| Small content mark | ghoulhouse-mark.svg | Current local export |
| Hero / example photo | worksite-concept-v3.webp | Concept; never customer work |
| Second photo example | bathroom-concept-v2.webp | Concept; never customer work |
| Founder portrait | hanna-nyholm-portrait.webp | Existing site use; photographer/license/approval evidence pending |
| Own-project proof | ghoulhouse-site-proof.png | Earlier screenshot of our site; not customer proof or current screenshot |
| Typeface | src/app/fonts/Montserrat-Variable.woff2 | Source and SIL OFL 1.1 documented locally |

hero-dot-grid.svg is referenced by retained CSS; computed visibility was not assumed.
The Android/Apple static PNGs, reverse standalone mark and proof-before/after files
are legacy-retained. They have no active component use found in the inventory;
keep their public URLs until external use and retention are separately reviewed.
The current manifest generates PNG icons through /brand-icons/[size].

## External materials — disposition

| Located resource | Working classification | Action |
| --- | --- | --- |
| [Current Brand Assets folder](https://drive.google.com/drive/folders/1VGCGofbGPyAXMdh2I6DxuBT24c7sbKDL) | Master candidate collection | Retain originals; compare actual exports before changing website files |
| [Logo Pack v2_0](https://drive.google.com/drive/folders/1ky2y8Na-oKYNgXU9Sf8fEMWDC-HwOHt0) | Candidate; version alone not authoritative | Several child folders returned empty lists; availability unresolved |
| Full Logo Pack v1 / identity guide / Brand Guidelines v1.0 and v1.1 | Historical or candidate references | Keep; no inferred byte equality or supersession |
| Earlier hero desktop/mobile/source, feed/story and Canva exports | Unverified alternatives | Do not replace current site imagery automatically |
| Previous preview/production/launch/QA archives and screenshots | Dated evidence | Not release sources or current QA results |
| Export Board SOURCE.svg, Hanna Brand Toolkit CURRENT.zip, Mockup Board PNG named by identity guide | Not located in checked master folders | Locate and compare; do not recreate as purported originals |

This change establishes a single selection register; it does not rename, delete or
move external shared Drive/Library originals. Full discovery metadata is in the
20 October inventory deliverable. That private research archive is not copied into
this public repository.

## Rights completion — required evidence

For every non-font asset, fill source/creator, license or permission evidence,
approval evidence, approver and date, allowed channels/scope, and replacement/master
relationship. Unknown fields remain null. A brand guide confirms identity rules,
not the photographer's rights. Customer permission must name the actual material;
permission for another client's images is not transferable.

Existing uses remain documented as existing uses. Pending evidence is not a new
approval, and no new customer/reference claim is authorized. Store permission
messages and personal documents privately; put only an appropriate evidence reference
in the manifest. The content owner must confirm the responsible assignee.

When adding or replacing an asset: record the exact file/hash and evidence, update
the consuming page and alternative text/disclosure, run resource and browser QA, and
review the change in a PR. Keep old URLs or add an explicit migration where necessary.
