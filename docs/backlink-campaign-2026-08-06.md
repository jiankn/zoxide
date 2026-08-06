# Backlink campaign ledger

Campaign date: 2026-08-06

## Summary

- Canonical target: https://zoxide.org/
- Linkable tool target: https://zoxide.org/tools/zoxide-doctor/
- Source repositories / configuration assets: 2 (`jiankn/zoxide`, `jiankn/zoxide-doctor`)
- Completed external public listings: 0; two directory contributions are awaiting maintainer review
- Published source surfaces: 2 GitHub repository pages
- Unique published referring root domains: 1 (`github.com`, source surfaces only)
- Follow + indexable external listings: 0 completed; 2 expected after review
- Nofollow / UGC listings: 2 repository pages on one root domain
- Noindex listings: 0
- Pending: 2 external directory contributions
- Blocked: 2 platforms pending npm authentication / package publication
- Rejected after qualification: 6 platforms

Source repositories are tracked for evidence but are not counted as completed external listings.

## Platforms

| Platform | Root domain | Public URL | Source asset | Primary keyword intent | Planned anchor | Target URL | Link location | rel tokens | Index directives | Status | Evidence / next action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GitHub project repository | github.com | https://github.com/jiankn/zoxide | Main repository | zoxide guide | zoxide.org / zoxide installation guide | https://zoxide.org/ | Repository homepage and README | `nofollow`; metadata link also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface | Homepage corrected from the old Vercel URL; audited 2026-08-06 |
| GitHub tool repository | github.com | https://github.com/jiankn/zoxide-doctor | zoxide-doctor repository | zoxide diagnostics | zoxide-doctor documentation | https://zoxide.org/tools/zoxide-doctor/ | Repository homepage and README | `nofollow`; metadata link also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface | Public MIT repository with cross-platform tests; audited 2026-08-06 |
| OpenCLI | opencli.co | https://github.com/gvkhosla/open-cli/pull/3 | zoxide-doctor repository | CLI tool directory / shell diagnostics | Website and Docs | https://zoxide.org/tools/zoxide-doctor/ | Proposed CLI detail page | Expected followable; existing detail-page links use `noreferrer` only | Existing detail pages are HTTP 200 with no `noindex` | Pending maintainer review | PR is mergeable; data validation, ESLint, production build, and CodeRabbit review passed. Vercel preview requires maintainer authorization |
| Tiny Tool Town | tinytooltown.com | https://github.com/shanselman/TinyToolTown/pull/726 | zoxide-doctor repository | tiny developer tool / CLI diagnostics | Website | https://zoxide.org/tools/zoxide-doctor/ | Proposed tool detail page | Expected followable | Existing site is HTTP 200 and indexable | Pending maintainer review | PR is mergeable; 51 tests and production build passed. First-time contributor CI needs maintainer approval |
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

- Both published GitHub links return HTTP 200 and are indexable by page directives, but GitHub adds `nofollow`; they are not reported as follow links.
- OpenCLI and Tiny Tool Town are reported as pending until their maintainers merge and deploy the contributions. Expected URLs and rel behavior must be audited again after deployment.
- The zoxide-doctor package passed syntax checks, seven unit tests, package dry-run, installed-tarball smoke testing, and successful jobs across Linux, macOS, and Windows. Some matrix jobs were delayed at `Set up job` during GitHub's 2026-08-06 Actions incident rather than failing project steps.
- Do not count npm or Terminal Trove until the package is genuinely published and the public pages are verified.
