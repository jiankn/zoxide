import csv
import json
from collections import defaultdict
from pathlib import Path


BASE = Path(r"C:\antigravity\zoxide\.seo\runs\2026-09-24\source\api")


def read_rows(path):
    rows = []
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            rows.append(
                {
                    "query": row["query"],
                    "page": row["page"].rstrip("/") or row["page"],
                    "clicks": float(row["clicks"]),
                    "impressions": float(row["impressions"]),
                    "position": float(row["position"]),
                }
            )
    return rows


def metric(rows):
    clicks = sum(row["clicks"] for row in rows)
    impressions = sum(row["impressions"] for row in rows)
    weighted_position = (
        sum(row["position"] * row["impressions"] for row in rows) / impressions
        if impressions
        else 0
    )
    return {
        "clicks": clicks,
        "impressions": impressions,
        "ctr": clicks / impressions if impressions else 0,
        "position": weighted_position,
    }


def aggregate(rows, field):
    grouped = defaultdict(list)
    for row in rows:
        grouped[row[field]].append(row)
    return {key: metric(items) for key, items in grouped.items()}


def compare(previous, recent):
    keys = set(previous) | set(recent)
    result = []
    empty = {"clicks": 0, "impressions": 0, "ctr": 0, "position": None}
    for key in keys:
        old = previous.get(key, empty)
        new = recent.get(key, empty)
        result.append(
            {
                "key": key,
                "previous": old,
                "recent": new,
                "click_delta": new["clicks"] - old["clicks"],
                "impression_delta": new["impressions"] - old["impressions"],
                "position_delta": (
                    new["position"] - old["position"]
                    if new["position"] is not None and old["position"] is not None
                    else None
                ),
            }
        )
    return result


def compact(item):
    return {
        "key": item["key"],
        "previous_clicks": round(item["previous"]["clicks"], 2),
        "recent_clicks": round(item["recent"]["clicks"], 2),
        "click_delta": round(item["click_delta"], 2),
        "previous_impressions": round(item["previous"]["impressions"], 2),
        "recent_impressions": round(item["recent"]["impressions"], 2),
        "impression_delta": round(item["impression_delta"], 2),
        "previous_position": round(item["previous"]["position"], 2)
        if item["previous"]["position"] is not None
        else None,
        "recent_position": round(item["recent"]["position"], 2)
        if item["recent"]["position"] is not None
        else None,
        "position_delta": round(item["position_delta"], 2)
        if item["position_delta"] is not None
        else None,
    }


def compact_pair(item):
    result = compact(item)
    query, page = result["key"]
    result["key"] = {"query": query, "page": page}
    return result


def main():
    previous_rows = read_rows(BASE / "previous_28d-query-page.csv")
    recent_rows = read_rows(BASE / "recent_28d-query-page.csv")
    manifest = json.loads((BASE / "manifest.json").read_text(encoding="utf-8"))

    previous_pages = aggregate(previous_rows, "page")
    recent_pages = aggregate(recent_rows, "page")
    previous_queries = aggregate(previous_rows, "query")
    recent_queries = aggregate(recent_rows, "query")
    previous_pairs = {(row["query"], row["page"]): metric([row]) for row in previous_rows}
    recent_pairs = {(row["query"], row["page"]): metric([row]) for row in recent_rows}

    common_pair_keys = set(previous_pairs) & set(recent_pairs)
    common_old_impressions = sum(previous_pairs[key]["impressions"] for key in common_pair_keys)
    common_new_impressions = sum(recent_pairs[key]["impressions"] for key in common_pair_keys)
    common_old_position = sum(
        previous_pairs[key]["position"] * previous_pairs[key]["impressions"] for key in common_pair_keys
    ) / common_old_impressions
    common_new_position_old_mix = sum(
        recent_pairs[key]["position"] * previous_pairs[key]["impressions"] for key in common_pair_keys
    ) / common_old_impressions
    common_new_position_actual_mix = sum(
        recent_pairs[key]["position"] * recent_pairs[key]["impressions"] for key in common_pair_keys
    ) / common_new_impressions

    meaningful_common_keys = {
        key
        for key in common_pair_keys
        if previous_pairs[key]["impressions"] >= 3 and recent_pairs[key]["impressions"] >= 3
    }
    meaningful_old_impressions = sum(previous_pairs[key]["impressions"] for key in meaningful_common_keys)
    meaningful_new_impressions = sum(recent_pairs[key]["impressions"] for key in meaningful_common_keys)
    meaningful_old_position = sum(
        previous_pairs[key]["position"] * previous_pairs[key]["impressions"] for key in meaningful_common_keys
    ) / meaningful_old_impressions
    meaningful_new_position_old_mix = sum(
        recent_pairs[key]["position"] * previous_pairs[key]["impressions"] for key in meaningful_common_keys
    ) / meaningful_old_impressions
    meaningful_new_position_actual_mix = sum(
        recent_pairs[key]["position"] * recent_pairs[key]["impressions"] for key in meaningful_common_keys
    ) / meaningful_new_impressions

    page_compare = compare(previous_pages, recent_pages)
    query_compare = compare(previous_queries, recent_queries)
    pair_compare = compare(previous_pairs, recent_pairs)

    top_page_click_losses = sorted(page_compare, key=lambda x: x["click_delta"])[:12]
    top_page_impression_losses = sorted(page_compare, key=lambda x: x["impression_delta"])[:12]
    top_page_click_gains = sorted(page_compare, key=lambda x: x["click_delta"], reverse=True)[:10]
    top_query_click_losses = sorted(query_compare, key=lambda x: x["click_delta"])[:15]
    top_query_impression_losses = sorted(query_compare, key=lambda x: x["impression_delta"])[:15]
    top_pair_click_losses = sorted(pair_compare, key=lambda x: x["click_delta"])[:15]
    top_pair_click_gains = sorted(pair_compare, key=lambda x: x["click_delta"], reverse=True)[:15]
    top_pair_impression_losses = sorted(pair_compare, key=lambda x: x["impression_delta"])[:15]

    ranking_losses = [
        item
        for item in query_compare
        if item["previous"]["impressions"] >= 20
        and item["recent"]["impressions"] >= 20
        and item["position_delta"] is not None
        and item["position_delta"] > 0
    ]
    ranking_losses.sort(
        key=lambda x: x["position_delta"] * min(x["previous"]["impressions"], x["recent"]["impressions"]),
        reverse=True,
    )

    recent_by_query = defaultdict(list)
    previous_by_query = defaultdict(list)
    for row in recent_rows:
        recent_by_query[row["query"]].append(row)
    for row in previous_rows:
        previous_by_query[row["query"]].append(row)

    cannibalization = []
    for query, rows in recent_by_query.items():
        meaningful = [row for row in rows if row["impressions"] >= 3]
        total_impressions = sum(row["impressions"] for row in meaningful)
        if len(meaningful) >= 2 and total_impressions >= 20:
            ranked = sorted(meaningful, key=lambda row: row["impressions"], reverse=True)
            cannibalization.append(
                {
                    "query": query,
                    "total_impressions": total_impressions,
                    "primary_share": ranked[0]["impressions"] / total_impressions,
                    "pages": [
                        {
                            "page": row["page"],
                            "clicks": row["clicks"],
                            "impressions": row["impressions"],
                            "position": row["position"],
                        }
                        for row in ranked[:4]
                    ],
                }
            )
    cannibalization.sort(key=lambda x: x["total_impressions"], reverse=True)

    switches = []
    for query in set(previous_by_query) & set(recent_by_query):
        old_rows = previous_by_query[query]
        new_rows = recent_by_query[query]
        if sum(r["impressions"] for r in old_rows) < 10 or sum(r["impressions"] for r in new_rows) < 10:
            continue
        old_top = max(old_rows, key=lambda row: row["impressions"])
        new_top = max(new_rows, key=lambda row: row["impressions"])
        if old_top["page"] != new_top["page"]:
            switches.append(
                {
                    "query": query,
                    "previous_page": old_top["page"],
                    "previous_impressions": old_top["impressions"],
                    "recent_page": new_top["page"],
                    "recent_impressions": new_top["impressions"],
                    "recent_total_impressions": sum(r["impressions"] for r in new_rows),
                }
            )
    switches.sort(key=lambda x: x["recent_total_impressions"], reverse=True)

    property_previous = manifest["windows"]["previous_28d"]["totals"]
    property_recent = manifest["windows"]["recent_28d"]["totals"]
    disclosed_previous = metric(previous_rows)
    disclosed_recent = metric(recent_rows)

    output = {
        "windows": manifest["windows"],
        "property_delta": {
            "clicks": property_recent["clicks"] - property_previous["clicks"],
            "impressions": property_recent["impressions"] - property_previous["impressions"],
            "ctr_points": (property_recent["ctr"] - property_previous["ctr"]) * 100,
            "position": property_recent["position"] - property_previous["position"],
        },
        "disclosed": {
            "previous": disclosed_previous,
            "recent": disclosed_recent,
            "previous_impression_coverage": disclosed_previous["impressions"] / property_previous["impressions"],
            "recent_impression_coverage": disclosed_recent["impressions"] / property_recent["impressions"],
            "previous_click_coverage": disclosed_previous["clicks"] / property_previous["clicks"],
            "recent_click_coverage": disclosed_recent["clicks"] / property_recent["clicks"],
        },
        "position_decomposition": {
            "common_pairs": len(common_pair_keys),
            "common_previous_impressions": common_old_impressions,
            "common_recent_impressions": common_new_impressions,
            "common_previous_position": common_old_position,
            "common_recent_position_at_previous_mix": common_new_position_old_mix,
            "within_pair_position_delta": common_new_position_old_mix - common_old_position,
            "common_recent_position_actual_mix": common_new_position_actual_mix,
            "common_mix_delta": common_new_position_actual_mix - common_new_position_old_mix,
            "meaningful_common_pairs": len(meaningful_common_keys),
            "meaningful_previous_impressions": meaningful_old_impressions,
            "meaningful_recent_impressions": meaningful_new_impressions,
            "meaningful_previous_position": meaningful_old_position,
            "meaningful_recent_position_at_previous_mix": meaningful_new_position_old_mix,
            "meaningful_within_pair_position_delta": meaningful_new_position_old_mix - meaningful_old_position,
            "meaningful_recent_position_actual_mix": meaningful_new_position_actual_mix,
            "meaningful_mix_delta": meaningful_new_position_actual_mix - meaningful_new_position_old_mix,
        },
        "top_page_click_losses": [compact(item) for item in top_page_click_losses],
        "top_page_impression_losses": [compact(item) for item in top_page_impression_losses],
        "top_page_click_gains": [compact(item) for item in top_page_click_gains],
        "top_query_click_losses": [compact(item) for item in top_query_click_losses],
        "top_query_impression_losses": [compact(item) for item in top_query_impression_losses],
        "top_pair_click_losses": [compact_pair(item) for item in top_pair_click_losses],
        "top_pair_click_gains": [compact_pair(item) for item in top_pair_click_gains],
        "top_pair_impression_losses": [compact_pair(item) for item in top_pair_impression_losses],
        "ranking_losses": [compact(item) for item in ranking_losses[:15]],
        "cannibalization": cannibalization[:15],
        "winner_switches": switches[:20],
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
