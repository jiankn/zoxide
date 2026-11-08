# 改版上线后检查（只读）：每日/每小时走势、承接页 × 关键词、网址检查抓取状态。
# 复用 gsc_query_page_fetch.py 的授权与代理；不改原脚本。
# 运行：PYTHONIOENCODING=utf-8 python .seo/scripts/gsc_post_redesign_check.py
import json
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from gsc_query_page_fetch import PROPERTY, build_service, get_credentials  # noqa: E402

OUT = Path(r"C:\antigravity\zoxide\.seo\runs") / date.today().isoformat() / "post-redesign-check.json"
service = build_service(get_credentials())


def sa(body):
    rows, start = [], 0
    while True:
        r = service.searchanalytics().query(siteUrl=PROPERTY, body={**body, "rowLimit": 25000, "startRow": start}).execute()
        got = r.get("rows", [])
        rows += got
        if len(got) < 25000:
            return rows
        start += 25000


today = date.today()
result = {"property": PROPERTY, "pulled": today.isoformat()}

# 最近 21 天每日（含未定稿数据）
result["daily"] = sa({"startDate": (today - timedelta(days=21)).isoformat(), "endDate": today.isoformat(),
                      "dimensions": ["date"], "dataState": "all"})
# 每日 × 页面，看主要承接页逐日变化
result["daily_page"] = sa({"startDate": (today - timedelta(days=14)).isoformat(), "endDate": today.isoformat(),
                           "dimensions": ["date", "page"], "dataState": "all"})
# 每小时（Search Console 按太平洋时间），看上线前后几个小时
try:
    result["hourly"] = sa({"startDate": (today - timedelta(days=2)).isoformat(), "endDate": today.isoformat(),
                           "dimensions": ["hour"], "dataState": "hourly_all"})
except Exception as e:  # 旧接口不支持时跳过
    result["hourly_error"] = str(e)[:300]
# 最近 28 天页面 × 关键词（定稿数据）
end = today - timedelta(days=3)
result["page_query_28d"] = sa({"startDate": (end - timedelta(days=27)).isoformat(), "endDate": end.isoformat(),
                               "dimensions": ["page", "query"]})
result["window_28d"] = [(end - timedelta(days=27)).isoformat(), end.isoformat()]

# 网址检查：主要承接页的最近抓取时间与收录状态
pages = sorted({r["keys"][1] for r in result["daily_page"]},
               key=lambda p: -sum(x["clicks"] for x in result["daily_page"] if x["keys"][1] == p))[:20]
for extra in ["https://zoxide.org/tools/ranking-simulator/"]:
    if extra not in pages:
        pages.append(extra)
inspections = []
for url in pages:
    try:
        r = service.urlInspection().index().inspect(body={"inspectionUrl": url, "siteUrl": PROPERTY}).execute()
        s = r["inspectionResult"]["indexStatusResult"]
        inspections.append({"url": url, "verdict": s.get("verdict"), "coverage": s.get("coverageState"),
                            "lastCrawl": s.get("lastCrawlTime"), "googleCanonical": s.get("googleCanonical"),
                            "userCanonical": s.get("userCanonical")})
    except Exception as e:
        inspections.append({"url": url, "error": str(e)[:200]})
result["inspections"] = inspections

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print("saved", OUT, {k: len(v) for k, v in result.items() if isinstance(v, list)})
