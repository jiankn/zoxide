# Backlink campaign ledger

Master anchor/target ledger: [backlink-anchor-ledger.md](backlink-anchor-ledger.md)
Progress log: [backlink-progress-log.md](backlink-progress-log.md)

Campaign date: 2026-08-06

Latest update: 2026-08-09

## Summary

- Canonical target: https://zoxide.org/
- Linkable tool target: https://zoxide.org/tools/zoxide-doctor/
- Source repositories / configuration assets: 3 (`jiankn/zoxide`, `jiankn/zoxide-doctor`, `jiankn/zoxide-doctor-mcp`)
- Completed external public HTML listings: 6 public listings (DEV.to, Hashnode, npm, npm.io, libraries.io, jsDelivr), plus one accepted MCP Registry metadata record; five external contributions are awaiting maintainer review or moderation
- Published source surfaces: 4 GitHub repository / release pages
- Unique published referring root domains: 8 (`github.com`, `dev.to`, `hashnode.dev`, `npmjs.com`, `npm.io`, `libraries.io`, `jsdelivr.com`, `modelcontextprotocol.io`)
- Follow + indexable external listings: 3 completed (DEV.to, npm, npm.io); 4 additional maintainer contributions remain pending
- Nofollow / UGC listings: 7 public pages (four GitHub source pages, Hashnode, libraries.io, jsDelivr)
- Noindex listings: 0 completed public listings
- Pending: 5 external contributions or moderation queues
- Ready for user-owned publication: 0 (the MCP package and Registry entry are published as `@agoes/zoxide-doctor-mcp@0.1.2`)
- Blocked: 0 account-side actions
- Rejected after qualification: 7 platforms, including AUR after account registration failed

Source repositories are tracked for evidence but are not counted as completed external listings.

## Platforms

| Platform | Root domain | Public URL | Source asset | Primary keyword intent | Planned anchor | Target URL | Link location | rel tokens | Index directives | Status | Evidence / next action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GitHub project repository | github.com | https://github.com/jiankn/zoxide | Main repository | zoxide guide | zoxide.org / zoxide installation guide | https://zoxide.org/ | Repository homepage and README | `nofollow`; metadata link also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface | Homepage corrected from the old Vercel URL; audited 2026-08-06 |
| GitHub tool repository | github.com | https://github.com/jiankn/zoxide-doctor | zoxide-doctor repository | zoxide diagnostics | zoxide-doctor documentation | https://zoxide.org/tools/zoxide-doctor/ | Repository homepage and README | `nofollow`; metadata link also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface | Public MIT repository with cross-platform tests; audited 2026-08-06 |
| GitHub tool release | github.com | https://github.com/jiankn/zoxide-doctor/releases/tag/v0.1.0 | zoxide-doctor release | zoxide diagnostic CLI | Documentation URL | https://zoxide.org/tools/zoxide-doctor/ | Release notes | `nofollow` | HTTP 200; no `noindex` | Published source surface | Stable `v0.1.0` release published and audited 2026-08-06 |
| Devhints | devhints.io | https://github.com/rstacruz/cheatsheets/pull/2229 | Complete zoxide CLI cheatsheet | zoxide commands / how to use zoxide | zoxide commands reference | https://zoxide.org/blog/zoxide-commands/ | Proposed cheatsheet “Also see” reference | Expected followable | Existing site is public; proposed page requires deployment verification | Pending maintainer review | PR remains open; GitHub currently reports `UNSTABLE` with no status checks. Prettier and 21 non-Ruby tests passed; six local render tests could not start because Ruby Bundler is not installed. Expected public URL: https://devhints.io/zoxide |
| OpenCLI | opencli.co | https://github.com/gvkhosla/open-cli/pull/3 | zoxide-doctor repository | CLI tool directory / shell diagnostics | Website and Docs | https://zoxide.org/tools/zoxide-doctor/ | Proposed CLI detail page | Expected followable; existing detail-page links use `noreferrer` only | Existing detail pages are HTTP 200 with no `noindex` | Pending maintainer review | PR remains open. Commit `3d34b84` updates the entry to the published command `npm install -g zoxide-doctor` and data validation passes; Vercel preview still needs `khosla` team authorization |
| Tiny Tool Town | tinytooltown.com | https://github.com/shanselman/TinyToolTown/issues/725 | zoxide-doctor repository | zoxide diagnostic CLI | zoxide-doctor | https://zoxide.org/tools/zoxide-doctor/ | Generated tool detail page | Expected followable; existing tool pages use ordinary anchors | Existing tool pages are HTTP 200 and indexable | Pending maintainer approval | Maintainer closed PR #726 and requested the standard Issue form. Issue #725 was reopened on 2026-08-08 with five tags; automated repo/license/README checks now pass and the issue is `ready-to-approve` |
| OSSDrop | ossdrop.com | https://github.com/OSSDrop/OSSDrop/pull/5 | zoxide-doctor repository | developer tools / CLI | zoxide-doctor | https://zoxide.org/tools/zoxide-doctor/ | Generated `/tool/zoxide-doctor` detail page | Expected followable; final page audit required | PR open; live slug returns HTTP 200 fallback with `noindex` and no target link | Pending maintainer review | Maintainer merges/syncs PR #5; audit after deployment |
| DEV Community | dev.to | https://dev.to/jiankn/zoxide-setup-that-actually-works-install-initialize-and-verify-2dng | Original zoxide setup tutorial | what is zoxide / install zoxide / zoxide commands | what zoxide is; install zoxide; zoxide commands reference | https://zoxide.org/blog/what-is-zoxide-smarter-cd/; https://zoxide.org/download/; https://zoxide.org/blog/zoxide-commands/ | Tutorial body | `noopener noreferrer` only; no blocking `nofollow`/`ugc` | HTTP 200; self-canonical; no page-level noindex; all three target anchors followable | Published — follow + indexable | Published 2026-08-08; re-audited 2026-08-08 and promoted to completed followable listing |
| Hashnode | hashnode.dev | https://zoxide-guides.hashnode.dev/when-zoxide-works-but-z-does-not | Original shell-startup troubleshooting article | install zoxide | zoxide; install zoxide; zoxide.org | https://zoxide.org/; https://zoxide.org/download/ | Tutorial introduction, install guidance, and closing resource sentence | `nofollow ugc noopener noreferrer` on all three anchors | HTTP 200; no meta or header robots restriction; self-canonical | Published — nofollow/UGC | Published 2026-08-08. Exact links and anchors audited in public static HTML: homepage anchors `zoxide` and `zoxide.org`, plus `install zoxide` to the download page |
| Arch User Repository | aur.archlinux.org | https://aur.archlinux.org/packages/zoxide-doctor | Installable `zoxide-doctor` package | zoxide installation diagnostics | Platform-generated package URL | https://zoxide.org/tools/zoxide-doctor/ | Package URL field | Expected followable; never reached final-page verification | Representative pages qualified, but the final page does not exist | Rejected / skipped | Account registration failed on 2026-08-08. Preserve the passing Arch CI artifact, but do not retry registration or submission |
| npm | npmjs.com | https://www.npmjs.com/package/zoxide-doctor | zoxide-doctor package | zoxide diagnostic CLI | Homepage | https://zoxide.org/tools/zoxide-doctor/ | Package metadata | User-verified; no blocking rel reported | HTTP 200; public `0.1.0`; no page-level noindex; target homepage verified | Completed — follow + indexable | Workflow run `31260656835` succeeded; use the package page for Terminal Trove submission |
| npm.io | npm.io | https://npm.io/package/zoxide-doctor | zoxide-doctor package | zoxide diagnostic CLI | homepage | https://zoxide.org/tools/zoxide-doctor/ | Automatically generated package page | `noopener noreferrer` on target homepage link | HTTP 200; self-canonical; `index, follow` | Completed — follow + indexable | Discovered and audited 2026-08-09 |
| libraries.io | libraries.io | https://libraries.io/npm/zoxide-doctor | zoxide-doctor package | zoxide diagnostic CLI | Homepage / zoxide-doctor documentation | https://zoxide.org/tools/zoxide-doctor/ | Automatically generated package page | `nofollow` | HTTP 200; no page-level `noindex` | Published — nofollow | Discovered and audited 2026-08-09 |
| jsDelivr | jsdelivr.com | https://www.jsdelivr.com/package/npm/zoxide-doctor | zoxide-doctor package | zoxide diagnostic CLI | Platform metadata | https://zoxide.org/tools/zoxide-doctor/ | Automatically generated package page | `nofollow noopener noreferrer` | HTTP 200; no page-level `noindex` | Published — nofollow | Discovered and audited 2026-08-09 |
| npm MCP package | npmjs.com | https://www.npmjs.com/package/@agoes/zoxide-doctor-mcp | zoxide-doctor MCP server | agent-accessible zoxide diagnostics | `zoxide-doctor` / `zoxide-doctor guide` | https://zoxide.org/tools/zoxide-doctor/ | Rendered README | `rel` not captured; raw automation receives bot 403 | npm registry confirms `@agoes/zoxide-doctor-mcp@0.1.2`, provenance, and canonical homepage; reader rendering confirms correct contextual links | Published; duplicate root | Re-audit rel from a normal browser before counting as an ordinary-follow HTML listing |
| Official MCP Registry | modelcontextprotocol.io | https://registry.modelcontextprotocol.io/v0.1/servers/io.github.jiankn%2Fzoxide-doctor/versions/latest | zoxide-doctor MCP server | agent-accessible zoxide diagnostics | Registry `websiteUrl` | https://zoxide.org/tools/zoxide-doctor/ | Active `server.json` metadata | Non-HTML API metadata; `rel` not applicable | HTTP 200; status `active`, version `0.1.2`, package `@agoes/zoxide-doctor-mcp`, exact canonical websiteUrl | Completed public metadata record | Do not count as ordinary-follow; audit downstream rendered aggregators after synchronization |
| Terminal Trove | terminaltrove.com | https://terminaltrove.com/zoxide-doctor/ | zoxide-doctor package | terminal tool directory | Website | https://zoxide.org/tools/zoxide-doctor/ | Tool detail page | Not yet verifiable | Owner reports submission completed; expected detail page currently returns HTTP 404 | Pending moderation | Do not resubmit; audit the public page after publication |
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
- Devhints, OpenCLI, Tiny Tool Town, and OSSDrop are reported as pending until their maintainers accept and deploy the contributions. Expected URLs and rel behavior must be audited again after deployment.
- Devhints currently reports no GitHub status checks; OpenCLI's Vercel status is blocked on maintainer team authorization. Neither is a completed listing.
- Tiny Tool Town PR #726 was closed at the maintainer's request, not rejected for fit. The standard submission Issue #725 is open with a five-tag payload; automated repo/license/README checks pass and it is marked `ready-to-approve`.
- OSSDrop PR #5 is open with a nine-line addition to `data/tools.json`; the expected public page is `https://ossdrop.com/tool/zoxide-doctor` after the site sync.
- Tiny Tool Town's local production build renders the `zoxide commands reference` link as a normal anchor without a `rel` restriction. This remains an expectation, not a live backlink, until the PR is merged and deployed.
- DEV.to article is public and HTTP 200. The 2026-08-08 re-audit found no page-level `noindex`/`nofollow`; its three zoxide.org anchors are ordinary `noopener noreferrer` links and followable, so it is now counted as completed follow + indexable.
- Hashnode article is public, HTTP 200, self-canonical, and indexable by page directives. Its three target anchors are accurately rendered, but Hashnode adds `nofollow ugc noopener noreferrer` to each external link. It is therefore recorded as a public nofollow/UGC listing, not a follow link.
- AUR was skipped after account registration failed on 2026-08-08. The tested package files remain documented in `docs/backlink-assets/aur-zoxide-doctor-submission-2026-08-08.md`, but no retry or submission is planned.
- The zoxide-doctor package passed syntax checks, seven unit tests, package dry-run, installed-tarball smoke testing, and successful jobs across Linux, macOS, and Windows. Some matrix jobs were delayed at `Set up job` during GitHub's 2026-08-06 Actions incident rather than failing project steps.
- OSSDrop's expected slug currently returns an HTTP 200 fallback with page-level `noindex` and no target link; keep PR #5 pending until the generated page exists.
- npm package `zoxide-doctor@0.1.0` is public at `https://www.npmjs.com/package/zoxide-doctor`; the successful GitHub Actions run is `31260656835`, and the package homepage points to the diagnostic guide.
- npm is published and verified. Terminal Trove remains pending moderation because its expected public page is still HTTP 404; do not count it until the rendered target link passes audit.
- npm.io is a completed ordinary-follow mirror of the published package. libraries.io and jsDelivr are completed public mirrors with `nofollow` target links and are not counted as follow listings.

## GSC keyword routing — 2026-08-08

- Primary cluster 1: `zoxide commands`, `how to use zoxide`, and natural variants → https://zoxide.org/blog/zoxide-commands/
- Primary cluster 2: `zoxide install`, `install zoxide`, and natural variants → https://zoxide.org/download/
- Primary cluster 3: `what is zoxide` and explanatory variants → https://zoxide.org/blog/what-is-zoxide-smarter-cd/
- Secondary: `zoxide vs z` → https://zoxide.org/comparisons/z/
- Protect rather than push: `zoxide fzf` (GSC position 1.89, CTR 31.61%).
- Excluded pending validation: `arch linux package zoxide` (4,177 impressions, zero clicks).

The DataForSEO/AIsa evaluator was run in dry-run mode against ten candidates. The planned cap was six calls; no credentials were present, so paid calls and reported API cost both remained zero. Full scoring and raw GSC tabs are in the 2026-08-08 keyword/backlink workbook.
