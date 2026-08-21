# SEO Change Report — Redirect URL Cleanup

Date: 2026-08-22

Evidence: `zoxide.org-Coverage-Drilldown-2026-08-22.zip`

Scope: low-risk technical SEO cleanup

## GSC evidence

- Affected redirect URLs: 99
- Missing trailing slash: 71
- Explicit default-locale `/en` prefix: 39
- Redirected content paths: 14
- `www` variants: 9
- HTTP variants: 2

Categories overlap. The current sitemap contains 128 canonical URLs and has zero exact matches with the 99 affected URLs.

## Classification

- Page class: PROTECT
- Title before/after: unchanged
- H1 before/after: unchanged
- Visible copy: unchanged except two internal link destinations losing the redundant `/en` prefix
- Canonical/hreflang: unchanged
- Final page URLs: unchanged
- Existing redirect targets: unchanged

## Changes

1. Markdown-rendered root-relative page links now reuse the existing `localizePath()` helper. This makes rendered links consistent with the routing policy:
   - English has no `/en` prefix.
   - Japanese and Chinese keep their locale prefix.
   - Page URLs end with `/`.
   - Existing content-consolidation mappings still point directly to their final target.
2. Removed two hard-coded `/en` prefixes from English blog source links.
3. Added a middleware 308 redirect for explicit default-locale URLs:
   - `/en/` → `/`
   - `/en/download/` → `/download/`
   - Content consolidation remains higher priority, for example `/en/blog/quick-start/` → `/tutorials/quick-start/`.

## Verification

- Targeted ESLint (`middleware.ts`, `markdownComponents.tsx`, `data/blog.ts`): pass
- TypeScript (`npx tsc --noEmit`, run after build): pass
- Existing URL smoke test (`node simple-test.js`): pass
- Production build (`npm run build`): pass, 195 static pages generated
- Generated HTML files scanned: 189
- Crawlable internal page links without trailing slash: 0
- Explicit `/en` internal links in generated HTML: 0
- Local production response checks:
  - `/` → 200
  - `/en/` → 308 `/`
  - `/en/download/` → 308 `/download/`
  - `/en/blog/quick-start/` → 308 `/tutorials/quick-start/`
  - `/blog/zoxide-download-guide/` → 308 `/download/`
  - `/zh/comparisons/autojump/` → 308 `/zh/blog/zoxide-vs-autojump/`
  - All tested final targets → 200
- Generated sitemap URL count: 128
- Sitemap URLs with non-canonical scheme/host/locale/trailing-slash shape: 0

The repository-wide `npm run lint` still fails on pre-existing generated `.open-next` files and CommonJS helper scripts (706 errors and 18,636 warnings). No reported full-lint error was in the three changed source files; targeted lint passes.

## Risk

- Ranking risk: low
- Redirect/canonical risk: low
- Confidence: high

No content, title, H1, canonical, hreflang, sitemap target, or final indexable URL was changed. Existing old-URL redirects remain in place.

## Follow-up

After deployment, resubmit `https://zoxide.org/sitemap.xml` in GSC. Inspect and request indexing only for final 200 URLs. Historical “Page with redirect” rows may remain for weeks and do not need to reach zero.
