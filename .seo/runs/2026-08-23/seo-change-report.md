# SEO change report — 2026-08-23

## Evidence and scope

- Source: Search Console API, Query × Page, Web search.
- Recent window: 2026-07-24 through 2026-08-20, 2,294 disclosed rows.
- Comparison window: 2026-06-26 through 2026-07-23, 2,077 disclosed rows.
- Site totals: clicks 1,549 → 1,439 (-7.1%); impressions 59,435 → 44,865 (-24.5%); average position 4.81 → 6.28.
- Same-pair decomposition confirmed a ranking decline rather than query mix alone: meaningful common Query × Page pairs worsened by about 0.55 positions at the previous-period mix.
- Full diagnosis: `gsc-query-page-api-report.md`.

## Implemented pages

### IMPROVE — `/tutorials/install-ubuntu/`

- GSC evidence: disclosed-query clicks 44 → 21; impressions 300 → 273; average position 4.95 → 9.64.
- Before title/H1: `How to Install zoxide on Ubuntu 24.04`.
- After title/H1: `How to Install zoxide on Ubuntu 26.04 or 24.04`.
- Change: added a 26.04/24.04 package and fzf version matrix, version-specific apt guidance, current upstream comparison, end-to-end verification, symptom-led troubleshooting, and official sources.
- URL, canonical, hreflang, and page purpose remain unchanged.
- Risk: low. The page is still the single Ubuntu installation guide.
- Confidence: high.

### REBUILD — `/tutorials/install-macos/`

- GSC evidence: disclosed-query clicks 59 → 46; impressions 337 → 324; average position 4.80 → 7.25.
- Before title/H1: `zoxide install macOS`.
- After title/H1: `Install zoxide on macOS with Homebrew`.
- Change: replaced generic fallback copy with an English verified guide for Homebrew, Apple Silicon and Intel paths, Zsh/Bash/Fish initialization, Cargo and upstream installer alternatives, fzf, end-to-end verification, and PATH/plugin troubleshooting.
- URL, canonical, hreflang, and page purpose remain unchanged.
- Risk: low.
- Confidence: high.

### IMPROVE — intent architecture and internal links

- The configured `howTo` primary path pointed to the nonexistent `/blog/mastering-zoxide-smarter-cd-command/`.
- It now points to the existing `/blog/mastering-terminal-navigation-zoxide-guide/`, whose English editorial content is already narrowed to the first-jump workflow.
- Quick Start links now use the same primary how-to URL.
- Existing fzf legacy URLs continue to return permanent redirects to `/tutorials/fzf-integration/`; no new redirect, canonical migration, deletion, or URL change was introduced.
- Risk: low.
- Confidence: high.

### PROTECT

- No substantial content or metadata changes were made to the homepage, Windows installation tutorial, Chinese Quick Start, or the primary fzf tutorial.

## Technical verification

- Repository SEO audit completed: Next.js, 21 detected route patterns.
- `messages/en.json` parses successfully.
- ESLint passed for every changed TypeScript source file. The repository-wide lint command is not a stable post-build check because it scans ignored `.open-next` output and existing CommonJS build helpers; after a Cloudflare artifact exists it reports generated-code and pre-existing `require()` violations unrelated to this change.
- TypeScript `--noEmit` passed.
- Next.js production build passed: 195 static pages generated.
- Local production-response checks passed:
  - Ubuntu and macOS tutorials: HTTP 200 with the expected titles and content.
  - Quick Start: links to the real how-to primary page.
  - Legacy English fzf guide: HTTP 308 to `/tutorials/fzf-integration/`.
  - English Sitemap lastmod: 2026-08-23 for both changed tutorials.

## Third-batch review gate

Do not add redirects or merge more URLs merely because a short window fluctuates. After a complete post-deployment 28-day window is final in GSC, compare it with the deployment baseline and review:

1. Same Query × Page ranking for meaningful common pairs.
2. Non-brand clicks and impressions for Ubuntu and macOS tutorials.
3. Primary-page impression share for `how to use zoxide`, `zoxide fzf`, `zoxide install`, and `what is zoxide`.
4. CTR for rank 1–2 pairs such as `zoxide init`, `zoxide alias`, and `zoxide no match found`.
5. Protection metrics for the homepage, Windows tutorial, Chinese Quick Start, and fzf tutorial.

Any additional 301, canonical change, merge, or deletion still requires explicit approval after that review.
