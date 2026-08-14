# SEO change report — search intent and internal-link architecture

Date: 2026-08-15
Data source: Google Search Console Query × Page exports for 2026-06-18–2026-07-15 and 2026-07-16–2026-08-12.

## Objective

Give each material search intent one locale-specific primary URL, make supporting pages link to that URL, and consolidate only the conflicts supported by GSC evidence. Query data is privacy-filtered, so low-volume locale decisions remain conservative.

## Primary URL decisions

| Intent | English | Chinese | Japanese |
| --- | --- | --- | --- |
| Download / install entry | `/download/` | `/zh/download/` | `/ja/download/` |
| Five-minute verification | `/tutorials/quick-start/` | `/zh/tutorials/quick-start/` | `/ja/tutorials/quick-start/` |
| Complete how-to | `/blog/mastering-zoxide-smarter-cd-command/` | localized equivalent | localized equivalent |
| Commands reference | `/blog/zoxide-commands/` | `/zh/tutorials/basic-commands/` | `/ja/blog/zoxide-commands/` |
| Shell initialization | `/blog/zoxide-init-guide/` | `/zh/tutorials/shell-setup/` | `/ja/tutorials/shell-setup/` |
| fzf / `zi` | `/tutorials/fzf-integration/` | localized equivalent | localized equivalent |
| Advanced configuration | `/tutorials/advanced-config/` | localized equivalent | localized equivalent |
| General troubleshooting | `/blog/zoxide-not-working/` | `/zh/tutorials/troubleshooting/` | `/ja/tutorials/troubleshooting/` |
| autojump comparison | `/blog/zoxide-vs-autojump/` | localized equivalent | localized equivalent |

Specific error intents remain separate: command-not-found, no-match/ranking, and the zoxide doctor each keep their own primary page.

## Consolidations implemented

- Download blog → download page in all locales.
- Blog quick-start → tutorial quick-start in all locales.
- Locale-specific fzf blogs → fzf tutorial in all locales.
- autojump comparison detail → editorial autojump article in all locales.
- English macOS install blog → macOS tutorial.
- English shell-setup tutorial → init guide.
- English general troubleshooting tutorial → not-working guide.
- English advanced-config blog → advanced-config tutorial.

These are 308 redirects. Redirect sources were removed from the sitemap, search API, hubs, and related-post candidates. Existing markdown links are resolved to the locale-correct target at render time.

## Conflicts deliberately not redirected

- Complete how-to vs quick-start: the former owns comprehensive learning; quick-start now owns post-install verification only.
- Commands reference vs basic-commands: English and Japanese use the editorial reference as primary while the beginner tutorial remains a practice lesson; Chinese keeps the tutorial as primary based on its GSC performance.
- General troubleshooting vs specific error pages: the general page routes readers to distinct command-not-found, no-match, and doctor pages instead of absorbing them.
- Chinese and Japanese init/troubleshooting pages were retained because locale-level GSC signals do not justify applying the English redirects globally.

## Internal-link changes

- Added a locale-aware intent registry used by home, features, FAQ, download, blog, tutorials, comparison pages, article learning paths, and markdown content.
- Replaced fixed related-guide blocks with page-context sequences that vote for the relevant primary URLs.
- Added curated task hubs to blog and tutorials.
- Reduced the comparison hub from full duplicate tables to summaries that link to the detail owner.
- Corrected About, Contact, and search-result links so Chinese and Japanese users stay in their language.
- Removed hreflang alternatives that would resolve through a redirect; valid self-references and reciprocal locale pairs remain.

## Verification

- `npx tsc --noEmit`: pass.
- ESLint on all changed TypeScript/TSX source files: pass.
- `npm run build`: pass; 195 static pages generated.
- `npm run build:cf`: pass; OpenNext Cloudflare worker bundle generated.
- Runtime redirect check: all 12 representative redirect cases returned 308 with the expected locale target.
- Runtime sitemap check: 128 URLs; tested redirect sources absent and primary targets present.
- Runtime crawl: all 128 sitemap URLs returned 200; no sitemap entry or rendered link pointed to a consolidated source URL.
- Full `npm run lint` is noisy because the repository currently includes generated `.open-next` output in ESLint discovery; source-scoped lint is clean.

## Measurement window

Do not judge this release from sitewide average position alone. Compare 28-day windows for task queries, split by locale and intent. Track each cluster's primary URL share, clicks, CTR, and position; separately exclude navigational GitHub queries, commit hashes, and other machine-like zero-click impressions.
