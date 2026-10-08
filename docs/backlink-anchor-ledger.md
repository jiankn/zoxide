# Backlink Anchor Ledger

Campaign: zoxide.org developer backlink build  
Ledger date: 2026-08-09  
Last audit: 2026-08-09  
Operating rule: Codex selects platforms, builds assets, tests contributions, and prepares submission packets. The owner handles account binding, OAuth/SSH/token setup, form pasting, and the final submit action.

Progress log: [backlink-progress-log.md](backlink-progress-log.md)

## Canonical target

- Preferred brand: `zoxide.org` (independent zoxide guide site)
- Canonical homepage: https://zoxide.org/
- Reusable asset: `zoxide-doctor`, an independent MIT-licensed CLI that diagnoses zoxide PATH and shell initialization without modifying configuration
- Tool guide: https://zoxide.org/tools/zoxide-doctor/
- Source repositories: https://github.com/jiankn/zoxide, https://github.com/jiankn/zoxide-doctor, and https://github.com/jiankn/zoxide-doctor-mcp

## Keyword routing

| Primary intent | Approved anchor pool | Canonical target | Routing rule |
|---|---|---|---|
| Commands / how-to | `zoxide commands`; `how to use zoxide`; `zoxide commands reference` | https://zoxide.org/blog/zoxide-commands/ | Use in cheatsheets, command references, and tutorials that explain usage |
| Install | `install zoxide`; `zoxide install`; `zoxide installation guide` | https://zoxide.org/download/ | Use when the external page contains installation steps |
| Definition | `what zoxide is`; `what is zoxide`; `how zoxide works` | https://zoxide.org/blog/what-is-zoxide-smarter-cd/ | Use in explanatory or troubleshooting introductions |
| Diagnostics | `zoxide-doctor`; `zoxide diagnostic CLI` | https://zoxide.org/tools/zoxide-doctor/ | Use only for the independent diagnostic tool and its directory entries |
| Comparison | `zoxide vs z`; `compare zoxide and z` | https://zoxide.org/comparisons/z/ | Second-wave target; only use in genuinely comparative content |

## Statistics

Counts are deliberately separated. A GitHub source page is evidence for the asset, not a second referring domain for every repository page.

| Metric | Count | Definition |
|---|---:|---|
| Source repositories / configuration assets | 3 | `jiankn/zoxide`, `jiankn/zoxide-doctor`, `jiankn/zoxide-doctor-mcp` |
| Completed public HTML listings | 6 | DEV.to, Hashnode, npm, npm.io, libraries.io, and jsDelivr public pages |
| Accepted public metadata records | 1 | Official MCP Registry API record for `io.github.jiankn/zoxide-doctor`; its non-HTML `websiteUrl` is the canonical tool guide |
| Published source surfaces | 4 | GitHub project/tool/MCP repositories and the tool release |
| Unique published referring root domains | 8 | `github.com`, `dev.to`, `hashnode.dev`, `npmjs.com`, `npm.io`, `libraries.io`, `jsdelivr.com`, `modelcontextprotocol.io` |
| Follow + indexable completed listings | 3 | DEV.to, npm, and npm.io pass public-page, target-link, and followability checks |
| Nofollow / UGC public listings | 7 | Four GitHub pages, Hashnode, libraries.io, and jsDelivr |
| Noindex public listings | 0 | No completed public listing currently has a page-level noindex directive |
| Pending external contributions | 5 | Devhints, OpenCLI, Tiny Tool Town, OSSDrop, and Terminal Trove moderation |
| Ready for owner publication | 0 | The MCP package and Registry entry were published as `@agoes/zoxide-doctor-mcp@0.1.2` |
| Blocked | 0 | No account-side action currently remains; Terminal Trove is in external moderation |
| Rejected after qualification | 7 | Includes AUR after owner-reported registration failure |

## External link ledger

One row represents one public platform surface. `External page address` is where the link will live; `Target URL` is the first-party destination. A platform-generated `Homepage`, `Website`, `Source`, or `Project URL` label is recorded but is not treated as a keyword anchor unless the rendered label contains the planned text.

| Platform / surface | External page address | Exact anchor text or label | Target URL | Source asset / link location | Date | rel tokens | Index evidence | Status | Next action |
|---|---|---|---|---|---|---|---|---|---|
| GitHub project repository | https://github.com/jiankn/zoxide | `zoxide.org`; `zoxide installation guide` | https://zoxide.org/ | Main README and repository homepage metadata | 2026-08-06 | `nofollow`; metadata also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface; not followable | Keep as entity/source evidence |
| GitHub tool repository | https://github.com/jiankn/zoxide-doctor | `zoxide-doctor documentation` | https://zoxide.org/tools/zoxide-doctor/ | README and repository homepage metadata | 2026-08-06 | `nofollow`; metadata also `noopener noreferrer` | HTTP 200; no `noindex` | Published source surface; not followable | Keep as tool provenance |
| GitHub tool release | https://github.com/jiankn/zoxide-doctor/releases/tag/v0.1.0 | `Documentation URL` (platform/release label) | https://zoxide.org/tools/zoxide-doctor/ | Release notes | 2026-08-06 | `nofollow` | HTTP 200; no `noindex` | Published source surface; not followable | Keep as release evidence |
| DEV Community | https://dev.to/jiankn/zoxide-setup-that-actually-works-install-initialize-and-verify-2dng | `what zoxide is`; `install zoxide`; `zoxide commands reference` | https://zoxide.org/blog/what-is-zoxide-smarter-cd/; https://zoxide.org/download/; https://zoxide.org/blog/zoxide-commands/ | Original tutorial body | 2026-08-08 | Anchors: `noopener noreferrer` | HTTP 200; no page-level noindex; self-canonical; all three target anchors followable | Completed - follow + indexable | Re-audit periodically; preserve exact anchors and destinations |
| Hashnode | https://zoxide-guides.hashnode.dev/when-zoxide-works-but-z-does-not | `zoxide`; `install zoxide`; `zoxide.org` | https://zoxide.org/; https://zoxide.org/download/; https://zoxide.org/ | Troubleshooting article body | 2026-08-08 | `nofollow ugc noopener noreferrer` | HTTP 200; self-canonical; no page robots block | Public nofollow/UGC listing | Keep as public mention; do not count as follow |
| Devhints | https://github.com/rstacruz/cheatsheets/pull/2229 | `zoxide commands reference` | https://zoxide.org/blog/zoxide-commands/ | Proposed cheatsheet “Also see” reference | 2026-08-08 | Expected followable; final page audit required | Representative site is public; proposed detail page pending | Pending maintainer review | Maintainer must merge/deploy; then audit `https://devhints.io/zoxide` |
| OpenCLI | https://github.com/gvkhosla/open-cli/pull/3 | Platform Website / Docs labels; planned `zoxide-doctor` context | https://zoxide.org/tools/zoxide-doctor/ | Proposed CLI detail page metadata and docs | 2026-08-09 | Expected followable; existing detail pages use `noreferrer` only | PR remains open; Vercel still requires maintainer authorization. Commit `3d34b84` updates the entry to `npm install -g zoxide-doctor`; local data validation passes | Pending maintainer review | Maintainer team must authorize Vercel preview, then merge/deploy and audit |
| Tiny Tool Town | https://github.com/shanselman/TinyToolTown/issues/725 | `zoxide-doctor` | https://zoxide.org/tools/zoxide-doctor/ | Generated tool detail page | 2026-08-08 | Expected ordinary anchor; final page audit required | Existing tool pages HTTP 200 and indexable; issue is `ready-to-approve` | Pending maintainer approval | Maintainer approves Issue #725; audit `https://www.tinytooltown.com/tools/zoxide-doctor/` |
| OSSDrop | https://github.com/OSSDrop/OSSDrop/pull/5 | `zoxide-doctor` (tool entry/title); homepage field points to guide | https://zoxide.org/tools/zoxide-doctor/ | One `data/tools.json` entry; generated `/tool/zoxide-doctor` page | 2026-08-09 | Expected followable; final page audit required | PR open; current slug returns HTTP 200 fallback but has conflicting `noindex` and `index, follow` directives and no target link | Pending maintainer review | Maintainer merges/syncs PR #5; re-audit after deployment |
| Arch User Repository | https://aur.archlinux.org/packages/zoxide-doctor | Platform-generated package URL / project URL | https://zoxide.org/tools/zoxide-doctor/ | `PKGBUILD` `url` field; tested package files retained | 2026-08-08 | Expected followable; never reached final-page verification | Representative pages qualified, but the final page does not exist | Rejected / skipped: account registration failed | Freeze the tested artifact; do not retry registration or submission |
| npm | https://www.npmjs.com/package/zoxide-doctor | `Homepage` metadata label | https://zoxide.org/tools/zoxide-doctor/ | `package.json` homepage and rendered package metadata | 2026-08-08 | User-verified; no blocking rel reported | HTTP 200; public `0.1.0`; no page-level noindex; target homepage verified | Completed - follow + indexable | Keep package metadata stable; use the npm page for Terminal Trove submission |
| npm.io | https://npm.io/package/zoxide-doctor | `homepage` | https://zoxide.org/tools/zoxide-doctor/ | Automatically generated npm package page | 2026-08-09 | Target `homepage` link: `noopener noreferrer` | HTTP 200; `index, follow`; canonical is self; target link is ordinary follow | Completed - follow + indexable | Re-audit after future package metadata changes |
| libraries.io | https://libraries.io/npm/zoxide-doctor | `Homepage`; `zoxide-doctor documentation` | https://zoxide.org/tools/zoxide-doctor/ | Automatically generated npm package page | 2026-08-09 | `nofollow` on both target links | HTTP 200; no page-level `noindex` | Public nofollow listing | Keep as an independently verified mirror; do not count it as follow |
| jsDelivr | https://www.jsdelivr.com/package/npm/zoxide-doctor | Platform metadata (no visible anchor text) | https://zoxide.org/tools/zoxide-doctor/ | Automatically generated npm package page | 2026-08-09 | `nofollow noopener noreferrer` | HTTP 200; no page-level `noindex` | Public nofollow listing | Keep as an independently verified mirror; do not count it as follow |
| zoxide-doctor MCP source repository | https://github.com/jiankn/zoxide-doctor-mcp | `zoxide-doctor` | https://zoxide.org/tools/zoxide-doctor/ | Contextual README link and registry metadata source | 2026-08-09 | GitHub external links are nofollow | Public source repository and tag `v0.1.2`; Linux/macOS/Windows CI `31298580818` succeeds | Published source surface; duplicate `github.com` root | Do not add a unique RD; package and Registry have been published; audit downstream aggregators separately |
| npm MCP package | https://www.npmjs.com/package/@agoes/zoxide-doctor-mcp | `zoxide-doctor` / `zoxide-doctor guide` | https://zoxide.org/tools/zoxide-doctor/ | README rendered on public package page | 2026-08-09 | `rel` not captured: direct automated request receives npm bot 403 | npm registry API returns public `0.1.2`, provenance, and the exact `homepage`; reader rendering shows the two correct contextual target links | Published package; duplicate `npmjs.com` root; follow status intentionally uncounted pending direct-page rel audit | Re-audit from a normal browser if a separate HTML-follow classification is required |
| Official MCP Registry | https://registry.modelcontextprotocol.io/v0.1/servers/io.github.jiankn%2Fzoxide-doctor/versions/latest | Registry `websiteUrl` | https://zoxide.org/tools/zoxide-doctor/ | Active `server.json` metadata for the local stdio MCP server | 2026-08-09 | Not an HTML link; `rel` and ordinary-follow semantics are not applicable | HTTP 200; Registry reports `active`, `0.1.2`, `@agoes/zoxide-doctor-mcp`, and the exact canonical `websiteUrl` | Completed public metadata record; unique `modelcontextprotocol.io` root, not counted as ordinary-follow HTML RD | Search/verify downstream rendered aggregators after synchronization |
| Terminal Trove | https://terminaltrove.com/zoxide-doctor/ | `Website` metadata label | https://zoxide.org/tools/zoxide-doctor/ | Tool directory submission packet | 2026-08-09 | Not yet verifiable | Owner reports the form was submitted; expected public detail URL currently returns HTTP 404 with no target link | Pending platform moderation | Do not submit again; audit only after the public detail page appears |

## Prepared submission files

| Platform | Prepared file or remote contribution | Owner-only action |
|---|---|---|
| Tiny Tool Town | Issue #725 (form payload already prepared) | No account action beyond maintainer review; do not create a duplicate issue |
| OSSDrop | PR #5, fork branch `jiankn:codex/add-zoxide-doctor` | No account action; wait for maintainer review |
| Devhints | PR #2229 | No account action; wait for maintainer review/deployment |
| OpenCLI | PR #3 | Maintainer-side Vercel authorization is required; owner should not supply a secret in chat |
| AUR | `docs/backlink-assets/aur-zoxide-doctor-submission-2026-08-08.md` | Skipped after registration failure; no owner action and no retry planned |
| DEV.to | `docs/backlink-assets/devto-zoxide-setup-guide-2026-08-08.md` | Already published; current page is indexable and followable; keep exact routing |
| Hashnode | `docs/backlink-assets/hashnode-zoxide-shell-startup-debugging-2026-08-08.md` | Already published; retain as nofollow/UGC mention |
| Official MCP Registry | `docs/backlink-assets/zoxide-doctor-mcp-publish-2026-08-09.md` | Published as `@agoes/zoxide-doctor-mcp@0.1.2`; Registry record is active. Await downstream aggregator pages before claiming another ordinary-follow HTML link. |

## Acceptance rule

An entry moves to **Completed** only after its public detail page is live and audited for HTTP 2xx, no `noindex`, exact target URL, exact planned anchor where controllable, and recorded `rel` tokens. A source PR, successful CI, package metadata, or a platform preview is not completion evidence.
