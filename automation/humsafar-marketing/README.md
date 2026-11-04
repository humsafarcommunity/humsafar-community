# Humsafar Community — Local AI Marketing System

This folder contains an **optional local automation companion** for the existing website.

## Production safety

- Existing production website remains Next.js 14 + Sanity v3 + Vercel.
- This setup does not add packages to the Next.js app, alter Sanity schemas, or change Vercel deployment settings.
- n8n and Ollama run locally on your Mac.
- The included approval workflow publishes **new blog documents only** after explicit approval. It uses Sanity's `create` mutation (not `createOrReplace`) so it cannot silently overwrite an existing published document.
- Blog updates require a separate update workflow with revision comparison and explicit approval; do not use this new-post workflow to update an existing live blog.
- Do not commit API tokens, OAuth client secrets, n8n encryption keys, or webhook secrets.

## 1. Prerequisites

Install:
1. Docker Desktop for Mac: https://www.docker.com/products/docker-desktop/
2. Ollama for Mac: https://ollama.com/download
3. Git (usually available through Xcode Command Line Tools).

Check in Terminal:

```bash
docker --version
docker compose version
ollama --version
```

## 2. Start the local services

From this folder:

```bash
cp .env.example .env
```

Generate a unique n8n encryption key and put it in `.env`:

```bash
openssl rand -hex 32
```

Open `.env` in a text editor and replace `CHANGE_ME_WITH_OUTPUT_OF_OPENSSL` with the generated value. Keep `.env` private.

Start n8n:

```bash
docker compose up -d
```

Open http://localhost:5678 and create the n8n owner account. This is a local-only service; the compose file binds it to 127.0.0.1.

Start Ollama in another Terminal window (or use the Ollama menu-bar app):

```bash
ollama serve
```

Download the local writing model:

```bash
ollama pull qwen2.5:7b
```

Check the model:

```bash
ollama run qwen2.5:7b
```

If the Mac has limited unified memory, use `qwen2.5:3b` instead. Local inference is free of per-token API charges but uses your Mac's memory and power.

## 3. Create the Sanity API token

1. Sign in at https://www.sanity.io/manage
2. Open project `fghdctku` (Humsafar CMS).
3. Open **API** / **Tokens**.
4. Create a token named `Humsafar n8n Local`.
5. Select the minimum permission that allows creating, reading and deleting documents (normally **Editor**). Do not use an Administrator token.
6. Copy the token once and store it in a password manager.
7. In n8n, open **Credentials → Add credential → Header Auth** (or the HTTP Header Auth credential type).
8. Set header name to `Authorization`, value to `Bearer YOUR_SANITY_TOKEN`, and save as `Humsafar Sanity API`.

Never put this token in this repository, a browser form, a Next.js `NEXT_PUBLIC_*` variable, or a workflow export.

Project configuration:
- Project ID: `fghdctku`
- Dataset: `production`
- API version: `2023-08-01`

## 4. Import the approval workflow

1. In n8n, select **Workflows → Import from File**.
2. Import `n8n/workflows/blog-approval-publish.json`.
3. Open the workflow's two HTTP Request nodes and select your saved `Humsafar Sanity API` credential.
4. Open the Webhook node. Create a **Header Auth** credential named `Humsafar Approval Webhook Secret`, header `x-humsafar-approval`, with a long random value. Save it and select it on the Webhook node.
5. Save the workflow but keep it **inactive** until the test checklist below passes.
6. Use the Test URL shown by the Webhook node while testing. The Production URL works only after the workflow is activated.

Expected request body:

```json
{
  "decision": "approve",
  "draftId": "drafts.your-existing-draft-id",
  "expectedRev": "revision-id-from-the-review-screen",
  "approvedBy": "Dhananjay",
  "feedback": ""
}
```

The webhook requires the `x-humsafar-approval` header. Treat the URL and secret as private.

## 5. Test safely before activating

Use a **throwaway Sanity blog draft** with:
- `_type: "blog"`
- a unique slug
- title, excerpt, content, `seoTitle`, and `seoDesc`
- a known `_rev`

Test the workflow with a deliberately wrong `expectedRev` first. It must stop without publishing. Then test with the exact revision and confirm:
- one canonical document is created (ID is the draft ID without `drafts.`);
- the draft is removed only after the successful create mutation;
- the published document contains the complete content, SEO fields, FAQs and references;
- the blog appears on the website after its normal cache/revalidation behaviour.

The workflow deliberately refuses to overwrite a canonical document with the same ID. It is for **new posts**, not live-blog updates.

## 6. Google Search Console connection

The initial research workflow should use Google Search Console's Search Analytics API:
- Google Cloud Console: https://console.cloud.google.com/
- Enable **Google Search Console API** in a project.
- Configure the OAuth consent screen.
- Create an OAuth Client ID for a Desktop application (or use n8n's documented Google OAuth setup).
- In n8n, create the matching Google Search Console / Google OAuth2 credential and authorize the Google account that has access to the verified Humsafar property.
- Use the exact property URL registered in Search Console (for example, the HTTPS domain property).
- Start with read-only access. Do not grant write permissions.

The site property must be accessible to the Google account used in OAuth. Search Console data is not instant; use 28-day windows and compare against the previous period.

## 7. Operating model

Recommended first month:
- Weekly: query and page performance report from Search Console.
- Weekly: competitor/topic research from public sources; store URLs and dates.
- Twice weekly: produce original article drafts in Sanity.
- Every article: human review and explicit approval before publishing.
- Monthly: identify existing articles needing refresh and create separate proposed revisions.

Do not copy competitor text. Use sources to identify traveller questions, content gaps and facts to verify. Never invent trip prices, dates, hotel names, inclusions, route conditions or permit requirements.

## 8. Troubleshooting

- n8n unavailable: `docker compose ps`, then `docker compose logs -f n8n`.
- Ollama unavailable: `ollama list` and `curl http://localhost:11434/api/tags`.
- n8n cannot reach Ollama from Docker: use `http://host.docker.internal:11434` (already set in compose).
- Sanity 401/403: confirm the token belongs to project `fghdctku`, has Editor permission, and the credential includes `Bearer `.
- Sanity 409/conflict: do not retry blindly; inspect whether the canonical document already exists.
- Never disable validation to force a publish.

## 9. Security note

A public repository README currently contains an apparent CMS login credential. Treat it as exposed: rotate the CMS password immediately, remove the credential from the repository history as appropriate, and use a password manager. Do not reuse that credential for n8n or any API token.
