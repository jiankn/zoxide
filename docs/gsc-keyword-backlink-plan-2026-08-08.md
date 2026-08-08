# GSC keyword and backlink plan — 2026-08-08

## Decision

Build external links around three tightly related keyword clusters instead of spreading authority across every zoxide query:

1. **Commands / how-to** → `https://zoxide.org/blog/zoxide-commands/`
2. **Install** → `https://zoxide.org/download/`
3. **Definition** → `https://zoxide.org/blog/what-is-zoxide-smarter-cd/`

`zoxide vs z` remains a second-wave target. `zoxide fzf` is a protection query, not an active backlink target, because it already averages position 1.89 with 31.61% CTR. `arch linux package zoxide` is excluded because 4,177 impressions and zero clicks is an anomalous pattern that should be validated before spending link-building effort.

## GSC evidence

Source: zoxide.org Search Console export, Web search, past 12 months, exported 2026-08-08.

| Priority | Query | Clicks | Impressions | CTR | Position | Decision |
|---:|---|---:|---:|---:|---:|---|
| 1 | `zoxide commands` | 12 | 174 | 6.90% | 5.29 | Primary anchor |
| 1 | `how to use zoxide` | 29 | 864 | 3.36% | 4.58 | Primary variation |
| 2 | `what is zoxide` | 23 | 1,196 | 1.92% | 4.01 | Primary anchor |
| 3 | `zoxide install` | 141 | 1,757 | 8.03% | 3.25 | Primary variation |
| 3 | `install zoxide` | 75 | 1,265 | 5.93% | 3.08 | Primary anchor |
| 4 | `zoxide vs z` | 11 | 529 | 2.08% | 5.99 | Secondary |
| Hold | `zoxide fish` | 19 | 1,293 | 1.47% | 5.24 | Improve page fit first |
| Protect | `zoxide fzf` | 294 | 930 | 31.61% | 1.89 | No active link push |
| Reject | `arch linux package zoxide` | 0 | 4,177 | 0.00% | 4.09 | Suspected anomaly |

The opportunity score in the workbook is a transparent GSC heuristic using demand, position, CTR gap and landing-page fit. It is not presented as paid search volume.

## Anchor routing

| Cluster | Preferred anchor pool | Target | Distribution guidance |
|---|---|---|---|
| Commands / how-to | `zoxide commands`, `how to use zoxide`, `zoxide commands reference` | https://zoxide.org/blog/zoxide-commands/ | Favor natural partial/branded variants; exact match remains a minority |
| Install | `install zoxide`, `zoxide install`, `zoxide installation guide` | https://zoxide.org/download/ | Mix both word orders and editorial sentence anchors |
| Definition | `what is zoxide`, `how zoxide works` | https://zoxide.org/blog/what-is-zoxide-smarter-cd/ | Mostly partial/branded anchors |
| Comparison | `zoxide vs z`, `compare zoxide and z` | https://zoxide.org/comparisons/z/ | Use only in genuinely comparative content |

## Cost-controlled external validation

Ten candidates were placed into the keyword evaluator dry run. The budget envelope was one overview batch, three live SERPs and at most two domain-metric calls: **six calls maximum**.

No `AISA_API_KEY` or DataForSEO credentials were available in the environment, so no paid request was made. Actual paid API calls: **0**. Recorded API cost: **$0.0000**. The decision therefore uses first-party GSC data plus live SERP review and does not invent volume or CPC figures.

## Backlinks built in this round

| Platform | Contribution | Anchor / target | State |
|---|---|---|---|
| Devhints | [PR #2229](https://github.com/rstacruz/cheatsheets/pull/2229), a complete zoxide cheatsheet | `zoxide commands reference` → commands guide | Pending maintainer merge and deployment |
| Tiny Tool Town | [PR #726](https://github.com/shanselman/TinyToolTown/pull/726), amended tool documentation | `zoxide commands reference` → commands guide | Pending maintainer merge and deployment |
| OpenCLI | [PR #3](https://github.com/gvkhosla/open-cli/pull/3), zoxide-doctor directory entry | Schema-native Website / Docs → doctor guide | Pending maintainer merge and deployment |
| DEV Community | Original English setup tutorial prepared locally | `what is zoxide`, `install zoxide`, `zoxide commands reference` → three mapped pages | Awaiting explicit publication approval |

Pending pull requests are not counted as live backlinks. After each merge and deployment, verify the final URL, HTTP status, index directives, rendered anchor and `rel` attributes before changing its status.
