# Five priority pages — GSC-only action plan

## Input and confidence

Five user-supplied Search Console ZIP exports were analyzed in dry-run mode. All are filtered to Web search, past three months, and the named final URL. No external keyword, SERP, backlink, or competitor data was used.

The graph totals are the decision metrics. Query tables are incomplete by design: anonymized and truncated query rows create large differences for every page, especially `/blog/zoxide-commands/`. Do not make URL removals, redirects, or page splits from these ZIPs.

| Priority | URL | Graph clicks | Impressions | CTR | GSC interpretation |
| ---: | --- | ---: | ---: | --- |
| 1 | `/blog/mastering-terminal-navigation-zoxide-guide/` | 81 | 17,170 | 0.47% | Reposition; broad page is attracting poorly matched general and brand queries. |
| 2 | `/download/` | 33 | 12,153 | 0.27% | Reposition; low-trust/low-specificity snippet for install and brand searches. |
| 3 | `/blog/zoxide-init-guide/` | 182 | 15,284 | 1.19% | Protect the winning core intent; strengthen shell-specific usefulness. |
| 4 | `/blog/zoxide-fzf-interactive-guide-en/` | 155 | 9,589 | 1.62% | Protect relevant `zoxide fzf` intent; improve only the setup/error path. |
| 5 | `/blog/zoxide-commands/` | 220 | 12,803 | 1.72% | Validate and correct before optimization; visible queries explain only 9 clicks. |

## 1. Mastering terminal navigation

### Evidence

- `how to use zoxide`: 318 impressions, position 3.54, 0.31% CTR.
- `zoxide`: 708 impressions, position 4.82, 0.14% CTR.
- `z vs zoxide`: 87 impressions, position 4.56, 0% CTR.
- In the most recent 28 days it fell from 30 to 21 clicks while impressions rose from 3,615 to 3,908.

### Decision

Make this one focused onboarding page for **how to use zoxide**. Do not ask it to own branded `zoxide`, installation, shell-init, fzf, comparison, and troubleshooting queries simultaneously.

### Low-risk edit brief

- Proposed title: `How to Use zoxide: First Jump, Shell Setup, and zi`
- Proposed meta description: `Learn zoxide in minutes: install it, add the correct shell init line, jump with z, choose with zi + fzf, and fix common setup issues.`
- First screen: a 3-step quick start (`install` → `init` → `z project`) with a tested expected result and links to the platform, init, fzf, and troubleshooting guides.
- Move installation, init, fzf, and comparison detail into concise summaries that link to their specialist pages. Preserve a short, original explanation of when `z` and `zi` differ.
- Add a dated source note and tested shell/version matrix. Remove unverified speed claims and generic marketing prose.

## 2. Download

### Evidence

- `zoxide`: 2,571 impressions, position 7.5, 0.08% CTR.
- `zoxide install`: 378 impressions, position 3.33, 0.53% CTR.
- `install zoxide`: 208 impressions, position 3.66, 0.48% CTR.
- `zoxide windows`: 265 impressions, position 6.2, 0.38% CTR.
- Recent 28-day impressions fell from 4,351 to 2,554; clicks held at 9.

### Decision

Keep the URL and make it an explicit **official-source install chooser**, not an attempt to be the official zoxide site. It should own `zoxide download` and route OS-specific intent to the existing install guides.

### Low-risk edit brief

- Proposed title: `Zoxide Download & Install: Official Sources for macOS, Windows, and Linux`
- Proposed meta description: `Get zoxide from its official GitHub releases or a trusted package manager. Choose your OS, verify the install, then add the shell init line.`
- Put verified outbound official-source links and a three-OS chooser before any long explanation. Give the exact verification command and expected output.
- State visibly that zoxide.org is independent. This improves trust even if it does not chase the misleading branded click.
- Keep platform-specific technical detail in the existing OS tutorial pages; link to those pages with clear OS labels.

## 3. zoxide init guide

### Evidence

- `zoxide init`: 157 impressions, position 1.79, 18.47% CTR.
- `zoxide init zsh`: 83 impressions, position 2.16, 14.46% CTR.
- `zoxide nushell`: 212 impressions, position 2.45, 5.19% CTR.
- `zoxide init zsh official docs`: 183 impressions, position 2.57, 0% CTR.
- Recent 28-day clicks were effectively stable (44 → 43) while impressions fell (4,530 → 2,944).

### Decision

This is a **PROTECT** page. Do not replace its core `zoxide init` positioning or split it into shell pages. The missing value is fast, verifiable per-shell help, especially PowerShell and Zsh.

### Low-risk edit brief

- Keep the leading title phrase `zoxide init`; only clarify its continuation if needed: `zoxide init: Shell Setup for Bash, Zsh, Fish, PowerShell, and Nushell`.
- Add a table of contents and one anchor per shell: command, config-file location, reload command, expected `z`/`zi` behavior, and common failure.
- Verify every command against the upstream project before publishing. Use a clearly labeled official documentation link rather than presenting this independent page as official.
- Link `zoxide init` users to the download page only when the binary is missing; link configuration failures to the troubleshooting guide.

## 4. zoxide + fzf guide

### Evidence

- `zoxide fzf`: 231 impressions, position 3.86, 6.93% CTR.
- `fzf zoxide`: 61 impressions, position 4.03, 6.56% CTR.
- `zoxide fzf integration`: 47 impressions, position 4.0, 8.51% CTR.
- `zoxide interactive`: 42 impressions, position 3.07, 11.9% CTR.
- Recent 28-day clicks improved (38 → 49) while impressions fell (2,952 → 1,914).

### Decision

This is already the most coherent non-brand page. Preserve the exact `zoxide fzf` / `zi` intent; do not broaden it into a generic zoxide introduction or `zoxide vs fzf` comparison.

### Low-risk edit brief

- Proposed title: `zoxide + fzf: Set Up and Use zi for Interactive Directory Jumps`
- Make the first screen show the prerequisite check, the correct shell init line, `zi`, and the expected selection behavior.
- Add a visible branch for `zoxide: could not find fzf, is it installed?`; this is a real shown query (29 impressions, position 5.14).
- Replace unverified aliases, performance claims, and assumptions with tested commands and citations. Link broad setup questions back to the init guide.

## 5. Commands guide

### Evidence

- Visible query rows account for only 9 of 220 graph clicks, so their ranking mix is not representative enough for a title-driven change.
- Healthy visible intent: `zoxide remove path` (65 impressions, position 2.75, 7.69% CTR) and `zoxide remove entry` (35, position 1.71, 5.71%).
- Unhealthy/mismatched visible terms include quoted implementation error text such as `storebuilder::new(data_dir)` (77 impressions, position 2.6, 0% CTR).
- Recent clicks declined slightly (70 → 61) while impressions grew (2,600 → 3,386).

### Decision

Correctness and query-to-section mapping come before CTR work. Retain the existing URL and core command-reference intent, but do not make a large metadata change until commands are verified against the upstream CLI documentation.

### Low-risk edit brief

- After verification, use a task-first title such as `zoxide Commands: z, zi, query, add, remove, and import`.
- Put a concise command table at the top: goal, command, prerequisite, expected output/behavior, and a link to the detailed section.
- Add a real `remove`/database troubleshooting section, because it has demonstrated intent. Do not optimize for internal source-code error strings.
- Remove or correct obsolete, unsupported, or unsourced examples before adding new content.

## Cross-page guardrails

1. Edit no more than two pages in the same release, beginning with #1 and #2.
2. Do not create five near-duplicate pages. Route each task to one canonical page through internal links.
3. Do not delete, redirect, or noindex any URL based on these exports. That requires an explicit approved technical review.
4. For each completed edit, record the baseline above, submit for recrawl only after deployment, and compare the same page/query cohort after 28 and 56 complete days.

