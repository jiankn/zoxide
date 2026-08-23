# Content overlap decision register — 2026-08-23

This register separates low-risk intent clarification from URL-changing actions. It uses the latest final GSC Query × Page windows; anonymous low-volume queries remain undisclosed.

| Cluster | Primary page | Supporting or legacy page | Current decision | Reason |
| --- | --- | --- | --- | --- |
| English init | `/blog/zoxide-init-guide/` | `/tutorials/shell-setup/` | Primary already enforced; monitor | Init blog owns about 93% of disclosed pair impressions and the exact query |
| English general troubleshooting | `/blog/zoxide-not-working/` | `/tutorials/troubleshooting/` | Primary already enforced; monitor | Blog is the disclosed English winner; new copy acts as a routing hub |
| No match | `/blog/troubleshooting-zoxide-no-match-found/` | not-working and command-not-found pages | Keep separate | Exact no-match query belongs to the specialist page; other pages should only route to it |
| Windows install | `/tutorials/install-windows/` | homepage and download | PROTECT | Exact Windows queries remain strong; do not rewrite based on mixed page averages |
| How to use | `/blog/mastering-terminal-navigation-zoxide-guide/` | `/tutorials/quick-start/` | Observe one full window | One page wins impressions/rank while the other wins clicks; responsibilities are now distinct |
| fzf | `/tutorials/fzf-integration/` | legacy fzf blog slugs | Existing permanent redirects; PROTECT target | Tutorial holds the strongest exact-query position and clicks |
| Download | `/download/` | download blog | Existing permanent redirect; monitor | Download page overwhelmingly owns disclosed download intent |
| Commands | `/blog/zoxide-commands/` | `/tutorials/basic-commands/` | Keep separate | English reference and beginner exercise intents differ; locale winners also differ |

## Post-deployment measurement

Use deployment day 2026-08-23 as the boundary. Do not compare partial pre/post windows as if they were independent.

1. Early signal: compare daily fixed Query × Page pairs after at least 14 final-data days.
2. Decision window: compare the first complete 28 final-data days after deployment with the immediately preceding 28 days.
3. Track exact and page-level metrics separately. A reduction in generic `no match found` impressions is acceptable if branded no-match clicks and CTR improve.
4. Keep homepage, Windows, fzf, and Chinese Quick Start as protection controls.
5. Require explicit approval before any new 301, deletion, noindex, canonical migration, or locale-wide rule.
