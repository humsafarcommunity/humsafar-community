# Phase 2A — Himachal package SEO audit

## Scope and data source

Himachal packages are selected from the live Sanity CMS using the `tour.region == "himachal"` field. The query excludes draft document IDs and requires a published URL slug. The website's `data/index.js` fetches the live tour collection from the same Sanity project; the repository's static `data/data.json` is not a reliable inventory of published tours.

Run the complete region-specific audit with:

```bash
npm run audit:himachal-seo
```

The command checks SEO title and description lengths and duplicates, required package content, keyword/AEO fields, and a potential price mismatch between the numeric CMS price and package marketing copy.

## Direct CMS inspection — one verified record

The authenticated CMS browser view was open on this published Himachal record:

- **Title:** Naggar, Baralacha La & Bijli Mahadev — Himachal Group Trip from Delhi
- **Slug:** `naggar-baralacha-la-bijli-mahadev-himachal-trip`
- **Region:** Himachal
- **Location:** Manali, Naggar, Lahaul and Kullu, Himachal Pradesh
- **Travel type / departure:** Group / Saturday
- **Duration:** 5 Days / 4 Nights
- **Numeric CMS price:** blank
- **SEO title:** 63 characters — above the 50–60 character target
- **SEO description:** 201 characters — above the 120–160 character target
- **SEO keywords:** populated
- **AEO direct answer:** populated
- **CMS status:** Published

### Confirmed issue requiring operator decision

The numeric CMS price field is blank, while package highlights contain a starting price of ₹8,499 per person for triple/quad sharing plus 5% GST. The structured-data generator only emits an Offer when a positive numeric `tour.price` exists. This means the displayed package price and structured data can disagree.

Do not automatically populate the numeric price from marketing copy: confirm that ₹8,499 is the current approved base price and whether the CMS price field is intended to represent the triple/quad starting price before changing it.

### SEO metadata review

The current SEO title and description exceed the recommended length targets. Shortening them should preserve the primary intent (Himachal group trip from Delhi) and the actual named destinations. Avoid adding unverified inclusions, departure dates or availability claims.

## Audit boundary

Only the Naggar / Baralacha La / Bijli Mahadev record was individually opened and inspected in the authenticated CMS session. The complete Himachal CMS inventory and all package-level findings must be produced by running the included live Sanity audit command in a network-enabled project environment. This document does not invent a total package count or claim that unseen records have been checked.

No Sanity records are edited by this PR.
