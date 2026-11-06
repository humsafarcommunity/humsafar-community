# Phase 2 — Package SEO audit

## Scope

The package detail route is data-driven: `pages/packages/[slug].jsx` renders each package from the published Sanity `tour` documents. `getStaticPaths` derives package paths from the CMS data, and the page uses incremental static regeneration.

The repository's `data/data.json` intentionally has an empty `TOURS` fallback, so it cannot be used to count or inspect the live package records. The live records are fetched from the Sanity project configured in `data/index.js`.

## Findings from the shared package implementation

1. **Missing SEO descriptions could become generic.** The page passed `tour.seoDesc` directly to the shared SEO component. When a CMS record had no description, multiple package pages could inherit the same generic site fallback.
2. **Structured data inherited the same missing description.** `generateTourSchema` used `tour.seoDesc`, so missing CMS metadata also weakened each package's JSON-LD.
3. **Offer markup could claim an invalid price or availability.** The previous schema always emitted an Offer, even when the package price was absent/zero, and hard-coded `InStock` plus a generated `validFrom` date without checking actual departure inventory.
4. **CMS editors had no SEO length guidance.** SEO title and description fields had no validation guidance.

## Changes in this phase

- Add a shared tour metadata helper. Explicit CMS metadata remains authoritative; otherwise each package receives a title and description derived from its own tour name, location and duration.
- Pass the same effective description into the page metadata and Tour/Product structured data.
- Emit an Offer only when a positive package price is present. Remove unsupported hard-coded availability and generated validity claims.
- Add non-blocking Sanity warnings for SEO title and description lengths.
- Add `npm run audit:tour-seo` to inspect every published Sanity tour for missing, duplicate and over-length metadata.

## Live CMS verification

Run `npm run audit:tour-seo` in the repository environment with network access to the public Sanity dataset. The command excludes draft document IDs and reports the published package count plus each metadata finding.

The live Sanity records are not stored in Git, so an exact package count and per-package CMS findings cannot be truthfully stated from repository files alone. The audit command is included so those records can be checked against the source of truth rather than guessed.

## Verification still required before merge

- Run `npm run audit:tour-seo` and review the package-level report.
- Run `npm run lint` and `npm run build` in the project environment.
- Inspect representative package pages from different regions in a deployment preview.
- Validate generated title, description, canonical URL and JSON-LD on rendered HTML.
