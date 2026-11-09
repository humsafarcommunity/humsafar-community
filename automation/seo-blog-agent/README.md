# Humsafar SEO Blog Agent

Local-first automation foundation for Humsafar Community's existing Next.js 14 + Sanity CMS + Vercel website.

## Confirmed operating policy

- Research cadence: daily.
- Draft cap: 3 per calendar week (not 3 per day).
- Evidence sources: Google Search Console + competitor/public travel websites.
- Generation: local Ollama model.
- CMS: existing Sanity project `fghdctku`, dataset `production`.
- Publishing: **human approval only**. The agent must create Sanity draft documents; it must never publish or replace a published document automatically.
- Hosting: existing Vercel website is not moved or replaced.

## Current implementation status

This folder is the deployment and integration specification. It is not yet an active agent: the n8n instance, local model, Google OAuth connection and Sanity write token must be configured on the operator's Mac. No credentials are stored in this repository.

## Architecture

1. n8n runs locally and starts a daily research workflow.
2. Google Search Console Search Analytics supplies Humsafar's real query/page/click/impression/position evidence.
3. Public competitor pages and sitemaps are sampled for topic coverage, page structure and content gaps. Third-party traffic estimates must be labelled estimates, never competitor Analytics facts.
4. Candidate topics are scored for search intent, relevance to Humsafar destinations/packages, GSC opportunity, seasonality, originality and conversion relevance.
5. Ollama generates an evidence-led article brief and draft locally.
6. A duplicate check queries Sanity for matching slug/title/topic before any write.
7. The workflow creates an unpublished Sanity draft document only. A human reviews and publishes it in the existing Sanity Studio.

## Weekly production control

Run research daily, but use a persistent weekly counter in n8n Data Tables (or a local database) before drafting. Stop generation once 3 drafts have been created in the current ISO week. Research can continue and queue opportunities. Do not reset the counter on workflow restart.

## Required n8n credentials (configure in n8n UI)

- Google Search Console OAuth2 credential with read-only Search Console access for the verified Humsafar property.
- Sanity write token with the minimum required dataset write permission. Store it as an n8n credential/secret, never in workflow JSON or Git.
- Ollama endpoint on the local Docker network (no API key for a local Ollama server).

Do not paste tokens into chat, GitHub, workflow JSON, or this repository.

## Sanity document mapping

The current `sanity/schemas/blog.js` schema supports:
`title`, `slug`, `category`, `tags`, `author`, `publishedAt`, `updatedAt`, `readTime`, `excerpt`, `coverImage`, `content`, `relatedTours`, `faqs`, `seoTitle`, `seoDesc`, `keywords`, and `directAnswer`.

Create draft IDs using Sanity's `drafts.<document-id>` convention. Do not create a published document ID. Do not set a public publication date until human approval. Ensure the website's public Sanity client excludes drafts (normal public API queries do not return draft documents).

## Research quality rules

- Never copy competitor wording, headings verbatim, images, itineraries or proprietary research.
- Use competitors to identify demand, coverage gaps and page-format patterns; write original content.
- Separate measured Humsafar GSC metrics from third-party SEO-tool estimates.
- Do not invent keyword volumes, competitor traffic, prices, dates, permits, distances, altitude, weather or opening status.
- Cite reliable primary sources for safety, permits, official dates, transport restrictions and other changing facts.
- Do not target a keyword solely because a competitor ranks for it. Confirm intent and commercial relevance.
- Check existing Sanity blog slugs and published website URLs before proposing a new article. Prefer updating a useful existing article over creating a near-duplicate.
- Include useful internal links to relevant Humsafar package pages and related blogs only when the destination exists.
- Do not keyword-stuff, mass-produce thin pages, or generate doorway pages.

## Suggested daily workflow stages

1. Fetch GSC query/page performance for the previous 28 days; compare with the preceding 28 days.
2. Identify high-impression/low-CTR queries, positions around page 1–2, declining pages and unanswered question queries.
3. Inspect competitor public sitemaps and relevant ranking pages for content coverage and format patterns.
4. Build a deduplicated opportunity queue and score each opportunity.
5. If fewer than 3 drafts have been created this week, select the highest-quality eligible opportunity and generate one draft. The weekly cap is three.
6. Run factual, originality, metadata, internal-link and duplicate checks.
7. Save to Sanity as an unpublished draft.
8. Notify the owner with the draft title, proposed slug, target query, evidence summary and CMS link.
9. Stop. Do not publish, schedule publication or alter existing live content without human approval.

## Local setup

The accompanying `docker-compose.yml` starts n8n and Ollama locally. From this directory:

```bash
cp .env.example .env
# Edit .env and replace every placeholder with strong local values.
docker compose up -d
docker compose exec ollama ollama pull qwen2.5:3b
```

Open n8n at http://localhost:5678 and complete the owner account setup. Configure credentials in the n8n UI. Keep the n8n data volume private and back it up.

The local workflow must be tested with a single dry run and a Sanity draft before enabling the daily schedule. Confirm that the draft is not visible on the public website and that the publish action remains manual.

## Rollout checklist

- [ ] Rotate any administrator password that has ever been committed to a public repository; remove secrets from tracked files and review repository history.
- [ ] Set unique n8n encryption key and strong owner password in local .env.
- [ ] Connect read-only Google Search Console OAuth2.
- [ ] Connect restricted Sanity write token through n8n credentials.
- [ ] Verify Ollama responds and model fits available Mac memory.
- [ ] Import/configure the workflow and persist weekly draft count.
- [ ] Verify duplicate detection against existing Sanity blog documents.
- [ ] Run dry-run research without CMS writes.
- [ ] Create one test Sanity draft and verify public site does not expose it.
- [ ] Verify manual approval/publishing in Sanity Studio.
- [ ] Enable daily schedule only after all checks pass.

## Security notice

A previous repository README contained a literal admin username/password. Treat that credential as compromised: rotate it immediately, remove it from the README and any other tracked files, and inspect commit history. Never put passwords or API tokens in source control.