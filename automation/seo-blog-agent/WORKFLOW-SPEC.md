# Humsafar SEO Blog Agent — workflow specification

This specification is the build contract for the n8n workflow. It deliberately does not contain credentials.

## Trigger and timezone

- Schedule: every day at 07:00 Asia/Kolkata.
- Research window: last 28 complete days and previous 28 days for comparison.
- Daily research runs regardless of the weekly draft quota.
- Weekly quota: at most 3 newly-created draft blog documents per ISO week.
- Persist quota in n8n Data Tables or a database, not in workflow execution memory. Use a unique week key such as `2026-W46`; make draft creation idempotent.

## Node sequence

1. **Schedule Trigger** — daily at 07:00, timezone Asia/Kolkata.
2. **Load Agent Settings** — fixed configuration: site `https://www.humsafarcommunity.com`, Sanity project `fghdctku`, dataset `production`, locale `en-IN`, weekly draft limit 3.
3. **Read Weekly Quota** — retrieve current ISO-week draft count and queued opportunities.
4. **Google Search Console: Search Analytics** — read-only property query; dimensions query/page/device/country as appropriate; date ranges for current and previous 28-day periods. Do not infer volume from impressions.
5. **Fetch Public Competitor Sitemaps** — collect sitemap URLs from an allowlist of relevant travel publishers/operators; obey robots.txt, rate limits and site terms.
6. **Fetch Selected Competitor Pages** — only relevant public pages; extract title, headings, date, topic coverage and page format. Do not bypass paywalls, logins, bot protections or access controls.
7. **Normalize & Score Opportunities** — deduplicate by intent/topic. Score GSC impressions/CTR/position changes, destination/package fit, seasonality, content gap, factual source availability and conversion relevance.
8. **Load Sanity Blog Inventory** — query published and draft blog titles/slugs/topics. Also check current public blog URLs. Never create a duplicate slug or near-identical search-intent page.
9. **Quota Gate** — if count >= 3, save research/opportunity queue and stop before generation. Otherwise select the highest-scoring eligible topic.
10. **Research Evidence Pack** — gather primary sources for changing/technical facts (tourism boards, district administration, official permits, transport providers). Record source URL, title, access date and supported claims.
11. **Ollama: Generate Brief** — local model creates audience, intent, primary query, related questions, outline, internal link candidates and evidence map.
12. **Ollama: Generate Article** — original article in structured JSON matching the existing Sanity schema. No competitor paraphrase or unsupported claim.
13. **Validate Draft** — required fields, title/slug, meta length, one H1, useful headings, FAQs, source coverage, factual flags, internal-link validity, duplicate similarity, no keyword stuffing, no invented claims.
14. **Sanity Duplicate Check** — re-check slug and title immediately before write to avoid race conditions.
15. **Sanity Create Draft** — create only `drafts.<stable-id>`; never write a published document ID. Leave `publishedAt` unset. Do not schedule or publish.
16. **Increment Weekly Quota** — only after Sanity confirms draft creation. Use idempotency key so retries do not double count.
17. **Notify Owner** — send draft title, proposed slug, target query, GSC evidence, competitor coverage notes, source list, quality warnings and Sanity Studio link.
18. **Failure Handler** — log error without publishing; retry transient API failures with backoff; never bypass validation or approval.

## Candidate scoring

Use a transparent 0–100 score with recorded component scores:
- Search Console opportunity: 0–25
- Search intent and relevance to actual Humsafar destinations/products: 0–20
- Competitor coverage gap and differentiation potential: 0–15
- Seasonality/timeliness: 0–10
- Conversion/internal-link value: 0–15
- Availability of reliable primary sources: 0–15

A high score does not override safety/factual checks. Reject opportunities that require unsupported claims, duplicate an existing page, or are unrelated to Humsafar's real products.

## Required Sanity output

Map to the existing `blog` schema:
- `title`, `slug.current`, `category`, `tags`, `author`
- `updatedAt`, `readTime`, `excerpt`, `content` (Portable Text blocks)
- `faqs`, `seoTitle`, `seoDesc`, `keywords`, `directAnswer`
- `relatedTours` only when matching tour document references are verified.
- `coverImage` only when an approved, licensed/owned image is available; do not scrape competitor images.

## Approval boundary

Sanity Studio is the human approval interface. The workflow creates drafts only. It must not call Sanity publish, release, schedule, or mutate existing published documents. After the owner manually publishes in Sanity, the existing website's public queries should serve the published document according to the current site implementation.

## Manual acceptance tests

1. Daily trigger fires at 07:00 Asia/Kolkata.
2. GSC returns actual property data and previous-period comparison.
3. Competitor fetch respects robots.txt and throttling.
4. Existing title/slug is detected and no duplicate is created.
5. Quota allows exactly three drafts in a week; fourth run queues only.
6. Retry of same execution does not create a second draft or increment quota twice.
7. Sanity document ID begins with `drafts.`; no published ID is created.
8. Public website cannot read the draft.
9. No workflow node or credential invokes publish/schedule.
10. Notification includes evidence and any unverified claims for human review.
