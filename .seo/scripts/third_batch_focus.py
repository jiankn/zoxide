import csv
from collections import defaultdict
from pathlib import Path

ROOT = Path(r"C:\antigravity\zoxide\.seo\runs")
CURRENT = ROOT / "2026-09-24" / "source" / "api"
BASELINE = ROOT / "2026-08-23" / "source" / "api"

def rows(folder, name):
    with (folder / name).open(encoding="utf-8-sig", newline="") as f:
        return [{**r, "clicks": float(r["clicks"]), "impressions": float(r["impressions"]), "position": float(r["position"])} for r in csv.DictReader(f)]

def stat(items):
    c=sum(x["clicks"] for x in items); i=sum(x["impressions"] for x in items)
    return (c,i,100*c/i if i else 0,sum(x["position"]*x["impressions"] for x in items)/i if i else 0)

def f(s): return f"{s[0]:.0f}/{s[1]:.0f}，CTR {s[2]:.1f}%，排名 {s[3]:.2f}"
def page(items,p): return [x for x in items if x["page"].rstrip("/")==p]
def query(items,q): return [x for x in items if x["query"].lower()==q]
def qpage(items,q,p): return [x for x in query(items,q) if x["page"].rstrip("/")==p]

prev=rows(CURRENT,"previous_28d-query-page.csv"); recent=rows(CURRENT,"recent_28d-query-page.csv")
base=rows(BASELINE,"recent_28d-query-page.csv")
print("# 第三批重点指标（Query × Page 已披露数据）")
print("\n窗口：当前 2026-08-25～09-21；前窗 2026-07-28～08-24；部署基线 2026-07-24～08-20。格式为点击/展示，随后 CTR、排名。")
for label,p in [("首页","https://zoxide.org"),("Windows 教程","https://zoxide.org/tutorials/install-windows"),("中文 Quick Start","https://zoxide.org/zh/tutorials/quick-start"),("fzf 教程","https://zoxide.org/tutorials/fzf-integration")]:
    print(f"\n- {label}：前窗 {f(stat(page(prev,p)))}；当前 {f(stat(page(recent,p)))}；基线 {f(stat(page(base,p)))}")
for label,p in [("Ubuntu","https://zoxide.org/tutorials/install-ubuntu"),("macOS","https://zoxide.org/tutorials/install-macos")]:
    current=[x for x in page(recent,p) if "zoxide" not in x["query"].lower()]
    old=[x for x in page(prev,p) if "zoxide" not in x["query"].lower()]
    baseitems=[x for x in page(base,p) if "zoxide" not in x["query"].lower()]
    print(f"\n- {label} 非品牌：前窗 {f(stat(old))}；当前 {f(stat(current))}；基线 {f(stat(baseitems))}")
for q in ["how to use zoxide","zoxide fzf","zoxide install","what is zoxide"]:
    for dataset,label in [(prev,"前窗"),(recent,"当前"),(base,"基线")]:
        qrows=query(dataset,q); total=sum(x["impressions"] for x in qrows)
        top=max(qrows,key=lambda x:x["impressions"]) if qrows else None
        print(f"\n- {q} {label}：总展示 {total:.0f}；主页 {top['page'] if top else '无'}，份额 {(100*top['impressions']/total if total else 0):.1f}%，{f(stat([top])) if top else '无'}")
for dataset,label in [(prev,"前窗"),(recent,"当前"),(base,"基线")]:
    items=[x for x in dataset if 1<=x["position"]<=2]
    print(f"\n- 排名 1–2 {label}：{f(stat(items))}")
for q,p in [("zoxide fzf","https://zoxide.org/tutorials/fzf-integration"),("zoxide install","https://zoxide.org"),("what is zoxide","https://zoxide.org/blog/what-is-zoxide-smarter-cd"),("how to use zoxide","https://zoxide.org/tutorials/quick-start")]:
    print(f"\n- 精确组合 {q} → {p}：前窗 {f(stat(qpage(prev,q,p)))}；当前 {f(stat(qpage(recent,q,p)))}；基线 {f(stat(qpage(base,q,p)))}")
