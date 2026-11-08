# 只读：按关键词片段拉取 GSC 查询（近 16 个月 + 近 3 个月），看某个话题的真实搜索展示。
# 用法：PYTHONIOENCODING=utf-8 python .seo/scripts/gsc_query_contains.py uninstall remove delete 卸载 アンインストール
import json
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from gsc_query_page_fetch import PROPERTY, build_service, get_credentials  # noqa: E402

terms = sys.argv[1:]
service = build_service(get_credentials())
end = date.today() - timedelta(days=3)
out = {}
for label, days in (('16m', 480), ('3m', 90)):
    rows = []
    for term in terms:
        body = {
            'startDate': (end - timedelta(days=days)).isoformat(), 'endDate': end.isoformat(),
            'dimensions': ['query', 'page'], 'rowLimit': 25000,
            'dimensionFilterGroups': [{'filters': [{'dimension': 'query', 'operator': 'contains', 'expression': term}]}],
        }
        rows += service.searchanalytics().query(siteUrl=PROPERTY, body=body).execute().get('rows', [])
    out[label] = rows
path = Path(r'C:\antigravity\zoxide\.seo\runs') / date.today().isoformat() / ('query-contains-' + '-'.join(t for t in terms if t.isascii()) + '.json')
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
for label, rows in out.items():
    print(f'== {label} ({(end - timedelta(days=480 if label == "16m" else 90)).isoformat()} ~ {end.isoformat()})')
    for r in sorted(rows, key=lambda r: -r['impressions'])[:40]:
        q, p = r['keys']
        print(f"  {q[:45]:45} {p.replace('https://zoxide.org', ''):55} i={r['impressions']:<5} c={r['clicks']:<3} pos={r['position']:.1f}")
print('saved', path)
