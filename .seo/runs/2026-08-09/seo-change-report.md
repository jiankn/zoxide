# GSC dry-run report — 2026-08-09

## Scope

- Source: `zoxide.org-Performance-on-Search-2026-08-09.zip`
- Filter: Web search, 2026-05-08 through 2026-08-07
- Mode: analysis only; no production content, URL, metadata, or deployment changes.

## Property-level result

- 5,592 clicks / 169,822 impressions / 3.29% CTR over 92 days.
- This is an average of 61 clicks and 1,846 impressions per day.
- The most recent complete 28 days had 1,435 clicks and 42,284 impressions, versus 1,918 and 45,947 in the first 28 days. That is a 25% click decline and 8% impression decline.
- The best query is branded: `zoxide` (1,452 clicks, 24,367 impressions, 5.96% CTR, position 2.8).
- US traffic is the largest low-CTR segment: 996 clicks / 84,822 impressions / 1.17% CTR / position 4.58. Desktop accounts for 5,267 of 5,592 clicks (94.2%).

## Metric interpretation

The chart total is the relevant total for the selected property, search type, and date range: it counts clicks from Google Web Search to this property, after Search Console processing. It is not all website visits (direct, referral, social, email, and other search surfaces are outside this export).

The query table only contains 895 rows and totals 3,141 clicks / 55,112 impressions. It is not the whole query universe: Search Console omits anonymized low-volume/sensitive queries and table rows can be truncated.

The page table sums to more than the chart (5,760 clicks / 264,428 impressions). Do not add page rows as site totals: the graph is aggregated by property while the page table is aggregated by URL. Multiple result URLs from the same property can receive page-level credit for the same search results page.

## Highest-value CTR opportunities

These URLs already average positions 3–7 yet have very low CTR. Validate each URL's query set in GSC before editing titles, descriptions, and the page opening.

| URL | Clicks | Impressions | CTR | Avg. position |
| --- | ---: | ---: | ---: | ---: |
| `/blog/mastering-terminal-navigation-zoxide-guide/` | 81 | 17,170 | 0.47% | 6.33 |
| `/blog/zoxide-init-guide/` | 182 | 15,284 | 1.19% | 4.59 |
| `/download/` | 33 | 12,153 | 0.27% | 5.62 |
| `/blog/zoxide-commands/` | 220 | 12,803 | 1.72% | 4.15 |
| `/blog/zoxide-fzf-interactive-guide-en/` | 155 | 9,589 | 1.62% | 4.94 |
| `/blog/zoxide-alternatives-comparison-open-source/` | 142 | 9,302 | 1.53% | 6.49 |
| `/blog/` | 1 | 5,246 | 0.02% | 5.82 |
| `/features/` | 3 | 3,271 | 0.09% | 4.08 |

The listed low-CTR pages represent an indicative 2,833 additional clicks if their *separately measured* CTR reached 3%. This must not be summed as a forecast because property/page aggregation overlaps.

## Query quality

The query export shows many low-fit exposures: `z cd` (2,836 impressions, 0.28% CTR, position 5.82), generic `no match found` (1,288, 0.08%, 9.17), and several Git commit-hash queries. More impressions for these terms are not an objective. Each target page should instead be optimized for a concrete task and shell/platform combination that it genuinely solves.

## Recommended sequence

1. In GSC, inspect query × page data for the six high-impression URLs above; group queries by a single user task rather than by keyword spelling.
2. Rewrite only the title, meta description, first screen, and internal links for the first three validated URLs. State the platform/shell, exact outcome, and current command source; remove generic promises such as universal speed claims.
3. Consolidate near-duplicate and overlapping guides only after a query-intent review. Keep one canonical, deeply tested guide per task and redirect duplicates only with explicit approval.
4. Add original material to priority pages: tested command output, OS/shell/version matrix, failure conditions, dated source links, and a real troubleshooting decision path. Do not publish more generic or translated listicles until these pages have been materially improved.
5. Measure the same URL/query cohorts after 28 days and 56 days. A CTR win needs impressions stable or rising; a ranking win needs comparison against the previous period, not a single average-position snapshot.

## AdSense readiness implication

There is no traffic threshold established by the current AdSense eligibility guidance. The priority is unique, interesting, high-quality content and policy compliance. For this independent documentation site, content that largely repeats upstream documentation without original testing, commentary, or clear added value is the key approval risk—not the 5,592-click total by itself.

## Source notes

- Search Console data semantics: https://support.google.com/webmasters/answer/7042828
- Search Console aggregation and table differences: https://support.google.com/webmasters/answer/17011364
- Search Console data truncation/anonymized queries: https://support.google.com/webmasters/answer/96568
- AdSense eligibility: https://support.google.com/adsense/answer/9724
- Publisher content/inventory rules: https://support.google.com/adsense/answer/10502938

## Implementation — 2026-08-09

User authorized implementation after reviewing five page-level GSC exports. The following English pages now use focused editorial overrides while keeping their existing URLs, canonical URLs, hreflang structure, and locale routes:

- `/blog/mastering-terminal-navigation-zoxide-guide/`: rebuilt as a first-use `z` / `zi` onboarding page; links broad tasks to the specialist guides instead of competing with them.
- `/download/`: rebuilt as an independent, official-source installation chooser for Linux/WSL, macOS, and Windows.
- `/blog/zoxide-init-guide/`: rebuilt as a shell-specific reference for Bash, Zsh, Fish, PowerShell, and Nushell. It preserves the proven `zoxide init` intent.
- `/blog/zoxide-fzf-interactive-guide-en/`: rebuilt around `zi`, fzf v0.51.0+, and the observed missing-fzf failure.
- `/blog/zoxide-commands/`: rebuilt as a verified task reference for `z`, `zi`, `query`, `add`, `remove`, and `import`.

All command claims were rechecked against the zoxide upstream README and command manuals. The new prose removes generic performance claims, unverified aliases, and unsupported command syntax. It also links each task to a single relevant internal page rather than adding new pages.

Validation:

- `npx eslint data/zoxide-editorial-guides.ts app/[locale]/blog/[slug]/page.tsx app/[locale]/download/page.tsx` passed.
- `npx tsc --noEmit` passed.
- `npm run build` passed, including TypeScript and static generation for 195 pages.
- Local production HTTP checks returned 200 for all five target URLs. Their expected titles, descriptions, canonical URLs, and unique body text were present in the rendered HTML.
- Application-source lint (`app`, `components`, `data`, `lib`, `i18n`, middleware, and Next config) completed with zero errors and one pre-existing unused-variable warning in `components/Hero/TerminalDemo.tsx`.
- The unfiltered `npm run lint` command remains blocked by pre-existing ESLint errors inside generated `.open-next` output and CommonJS maintenance scripts. Those files were not edited in this work.
