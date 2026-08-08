# Backlink campaign ledger

Campaign date: 2026-08-06

Latest update: 2026-08-08

## Summary

- Canonical target: https://zoxide.org/
- Linkable tool target: https://zoxide.org/tools/zoxide-doctor/
- Source repositories / configuration assets: 2 (`jiankn/zoxide`, `jiankn/zoxide-doctor`)
- Completed external public listings: 1 public article; three external contributions are awaiting maintainer review
- Published source surfaces: 3 GitHub repository / release pages
- Unique published referring root domains: 2 (`github.com` source surfaces; `dev.to` article)
- Follow + indexable external listings: 0 completed; 3 expected after review and deployment
- Nofollow / UGC listings: 3 GitHub source pages on one root domain; DEV.to's anchor links are not `rel=nofollow`, but the page itself currently has `noindex,nofollow`
- Noindex listings: 1 (DEV.to article)
- Pending: 3 external contributions
- Draft ready for a qualified technical-writing surface: 1 Hashnode shell-startup troubleshooting article, awaiting account sign-in and publication approval
- Blocked: 2 platforms pending npm authentication / package publication
- Rejected after qualification: 6 platforms

Source repositories are tracked for evidence but are not counted as completed external listings.

## Platforms

| Platform | Root domain | Public URL | Source asset | Primary keyword intent | Planned anchor | Target URL | Link location | rel tokens | Index directives | Status | Evidence / next action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GitHub project repository | github.com | https://github.com/jiankn/zoxide | Main repository | zoxide guide | zoxide.org / zoxide installation guide | https://zoxide.org/ | Repository homepage and README | `nofollow`; metadata link also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface | Homepage corrected from the old Vercel URL; audited 2026-08-06 |
| GitHub tool repository | github.com | https://github.com/jiankn/zoxide-doctor | zoxide-doctor repository | zoxide diagnostics | zoxide-doctor documentation | https://zoxide.org/tools/zoxide-doctor/ | Repository homepage and README | `nofollow`; metadata link also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface | Public MIT repository with cross-platform tests; audited 2026-08-06 |
| GitHub tool release | github.com | https://github.com/jiankn/zoxide-doctor/releases/tag/v0.1.0 | zoxide-doctor release | zoxide diagnostic CLI | Documentation URL | https://zoxide.org/tools/zoxide-doctor/ | Release notes | `nofollow` | HTTP 200; no `noindex` | Published source surface | Stable `v0.1.0` release published and audited 2026-08-06 |
| Devhints | devhints.io | https://github.com/rstacruz/cheatsheets/pull/2229 | Complete zoxide CLI cheatsheet | zoxide commands / how to use zoxide | zoxide commands reference | https://zoxide.org/blog/zoxide-commands/ | Proposed cheatsheet “Also see” reference | Expected followable | Existing site is public; proposed page requires deployment verification | Pending maintainer review | PR is mergeable and ready. Prettier and 21 non-Ruby tests passed; six local render tests could not start because Ruby Bundler is not installed. Expected public URL: https://devhints.io/zoxide |
| OpenCLI | opencli.co | https://github.com/gvkhosla/open-cli/pull/3 | zoxide-doctor repository | CLI tool directory / shell diagnostics | Website and Docs | https://zoxide.org/tools/zoxide-doctor/ | Proposed CLI detail page | Expected followable; existing detail-page links use `noreferrer` only | Existing detail pages are HTTP 200 with no `noindex` | Pending maintainer review | PR is mergeable; data validation, ESLint, production build, and CodeRabbit review passed. Vercel preview requires maintainer authorization |
| Tiny Tool Town | tinytooltown.com | https://github.com/shanselman/TinyToolTown/pull/726 | zoxide-doctor repository | tiny developer tool / zoxide commands | Website; zoxide commands reference | https://zoxide.org/tools/zoxide-doctor/; https://zoxide.org/blog/zoxide-commands/ | Proposed tool detail page | Expected followable; verified in local production output | Existing site is HTTP 200 and indexable | Pending maintainer review | PR is mergeable; the contextual keyword link was added on 2026-08-08; 51 tests and production build passed. First-time contributor CI needs maintainer approval |
| DEV Community | dev.to | https://dev.to/jiankn/zoxide-setup-that-actually-works-install-initialize-and-verify-2dng | Original zoxide setup tutorial | what is zoxide / install zoxide / zoxide commands | what zoxide is; install zoxide; zoxide commands reference | https://zoxide.org/blog/what-is-zoxide-smarter-cd/; https://zoxide.org/download/; https://zoxide.org/blog/zoxide-commands/ | Tutorial body | Anchors have `noopener noreferrer` only; page-level robots include `noindex,nofollow` | HTTP 200; canonical self-reference; currently not indexable by page directives | Published — noindex | Published 2026-08-08 after user approval. All three target URLs and anchors verified in public HTML; re-audit after DEV.to removes the page-level robots restriction |
| Hashnode | hashnode.com | — | Original shell-startup troubleshooting article | install zoxide | install zoxide | https://zoxide.org/download/ | Tutorial body | Not yet verifiable | Developer technical-writing surface; final page audit awaits publication | Draft ready — account sign-in required | Draft is stored at `docs/backlink-assets/hashnode-zoxide-shell-startup-debugging-2026-08-08.md`. Hashnode showed an unauthenticated session on 2026-08-08, so nothing has been posted or counted |
| npm | npmjs.com | https://www.npmjs.com/package/zoxide-doctor | zoxide-doctor package | zoxide diagnostic CLI | Homepage | https://zoxide.org/tools/zoxide-doctor/ | Package metadata | Not yet verifiable | Not yet verifiable | Blocked | Package name is available, but the local npm client is not authenticated. Publish only after `npm login` or an `NPM_TOKEN` is supplied |
| Terminal Trove | terminaltrove.com | https://terminaltrove.com/zoxide-doctor/ | zoxide-doctor package | terminal tool directory | Website | https://zoxide.org/tools/zoxide-doctor/ | Tool detail page | Not yet verifiable | Submission page is indexable | Blocked | Submission requires an install command that already exists in a package registry and a preview image; revisit after npm publication |
| CLIHub | clihub.ai | https://clihub.ai/submit | zoxide-doctor repository | CLI directory | Website | https://zoxide.org/tools/zoxide-doctor/ | Tool detail page | Not evaluated | Direct TLS certificate validation failed during qualification | Rejected | Do not submit while the public domain has a certificate failure |
| Dev Containers Features | containers.dev | https://containers.dev/features | Main repository | developer environment / zoxide | — | https://zoxide.org/ | Feature listing | — | Indexable | Rejected | A zoxide feature already exists; another entry would be a duplicate rather than a useful contribution |
| OpenCLI Hub | openclihub.com | https://www.openclihub.com/submit | zoxide-doctor repository | AI-agent CLI directory | Website | https://zoxide.org/tools/zoxide-doctor/ | Tool detail page | Not evaluated | Site is HTTP 200 | Rejected | The public form requires the operator's private API key; the only prior public submission issue remained unprocessed for more than two months |
| CliAppStore | cliapp.store | https://cliapp.store/ | zoxide-doctor repository | CLI app directory | Website | https://zoxide.org/tools/zoxide-doctor/ | App detail page | Not evaluated | TLS handshake failed | Rejected | Repository accepts PRs, but its custom domain is not currently usable |
| Does It CLI | doesitcli.com | https://doesitcli.com/ | zoxide-doctor repository | desktop app CLI directory | — | https://zoxide.org/tools/zoxide-doctor/ | App detail page | Not evaluated | Site is HTTP 200 | Rejected | Directory scope is CLIs for desktop applications; a standalone zoxide diagnostic is out of scope |
| ecosyste.ms Repos | repos.ecosyste.ms | https://repos.ecosyste.ms/hosts/GitHub/repositories/jiankn%2Fzoxide-doctor | zoxide-doctor repository | repository metadata | Homepage | https://zoxide.org/tools/zoxide-doctor/ | Repository detail page | Not evaluated | Requested repository page returned 404 | Rejected | The new repository is not indexed; the older project page also does not render its homepage as a target link |

## Linkable asset created

`zoxide-doctor` is a zero-dependency diagnostic CLI that checks zoxide availability on `PATH`, validates `zoxide init` for the selected shell, inspects common profile files without modifying them, reports optional `fzf` availability, and supports JSON output. It is deliberately identified as an independent community tool rather than an official zoxide release.

The production guide is live in English, Chinese, and Japanese, has a self-referencing canonical URL, appears in the sitemap, and links to the public source repository and relevant troubleshooting guide.

## Verification notes

- All three published GitHub source links return HTTP 200 and are indexable by page directives, but GitHub adds `nofollow`; they are not reported as follow links.
- Devhints, OpenCLI, and Tiny Tool Town are reported as pending until their maintainers merge and deploy the contributions. Expected URLs and rel behavior must be audited again after deployment.
- Tiny Tool Town's local production build renders the `zoxide commands reference` link as a normal anchor without a `rel` restriction. This remains an expectation, not a live backlink, until the PR is merged and deployed.
- DEV.to article is public and HTTP 200, and its three zoxide.org anchors are ordinary `noopener noreferrer` links. Its current response includes page-level `noindex` and `nofollow`, so it is recorded as a public noindex listing rather than an indexable external backlink. Re-audit before counting it as an SEO result.
- The zoxide-doctor package passed syntax checks, seven unit tests, package dry-run, installed-tarball smoke testing, and successful jobs across Linux, macOS, and Windows. Some matrix jobs were delayed at `Set up job` during GitHub's 2026-08-06 Actions incident rather than failing project steps.
- Do not count npm or Terminal Trove until the package is genuinely published and the public pages are verified.

## GSC keyword routing — 2026-08-08

- Primary cluster 1: `zoxide commands`, `how to use zoxide`, and natural variants → https://zoxide.org/blog/zoxide-commands/
- Primary cluster 2: `zoxide install`, `install zoxide`, and natural variants → https://zoxide.org/download/
- Primary cluster 3: `what is zoxide` and explanatory variants → https://zoxide.org/blog/what-is-zoxide-smarter-cd/
- Secondary: `zoxide vs z` → https://zoxide.org/comparisons/z/
- Protect rather than push: `zoxide fzf` (GSC position 1.89, CTR 31.61%).
- Excluded pending validation: `arch linux package zoxide` (4,177 impressions, zero clicks).

The DataForSEO/AIsa evaluator was run in dry-run mode against ten candidates. The planned cap was six calls; no credentials were present, so paid calls and reported API cost both remained zero. Full scoring and raw GSC tabs are in the 2026-08-08 keyword/backlink workbook.
