import csv
import json
from datetime import date, timedelta
from pathlib import Path

import httplib2
from google.auth.exceptions import RefreshError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_httplib2 import AuthorizedHttp
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


CLIENT_SECRET = Path(r"C:\Users\jiank\Downloads\gsc-api\client_secret.json")
TOKEN_FILE = Path(r"C:\Users\jiank\AppData\Local\zoxide-gsc-token.json")
OUTPUT_DIR = Path(r"C:\antigravity\zoxide\.seo\runs\2026-09-24\source\api")
PROPERTY = "sc-domain:zoxide.org"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


def get_credentials():
    credentials = None
    if TOKEN_FILE.exists():
        credentials = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if credentials and credentials.expired and credentials.refresh_token:
        try:
            credentials.refresh(Request())
        except RefreshError:
            credentials = None

    if not credentials or not credentials.valid:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
        credentials = flow.run_local_server(port=0, open_browser=True)

    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(credentials.to_json(), encoding="utf-8")
    return credentials


def build_service(credentials):
    proxy = httplib2.ProxyInfo(
        proxy_type=httplib2.socks.PROXY_TYPE_HTTP,
        proxy_host="127.0.0.1",
        proxy_port=10808,
    )
    authorized_http = AuthorizedHttp(
        credentials,
        http=httplib2.Http(proxy_info=proxy, timeout=90),
    )
    return build("searchconsole", "v1", http=authorized_http, cache_discovery=False)


def find_latest_final_date(service):
    today = date.today()
    response = service.searchanalytics().query(
        siteUrl=PROPERTY,
        body={
            "startDate": (today - timedelta(days=14)).isoformat(),
            "endDate": (today - timedelta(days=1)).isoformat(),
            "dimensions": ["date"],
            "type": "web",
            "dataState": "final",
            "rowLimit": 1000,
        },
    ).execute()
    dates = [date.fromisoformat(row["keys"][0]) for row in response.get("rows", [])]
    if not dates:
        raise RuntimeError("GSC API did not return a final date in the last 14 days")
    return max(dates)


def window_dates(end_date):
    recent_start = end_date - timedelta(days=27)
    previous_end = recent_start - timedelta(days=1)
    previous_start = previous_end - timedelta(days=27)
    return {
        "recent_28d": (recent_start, end_date),
        "previous_28d": (previous_start, previous_end),
    }


def fetch_query_page(service, start_date, end_date):
    rows = []
    start_row = 0
    row_limit = 25000
    while True:
        response = service.searchanalytics().query(
            siteUrl=PROPERTY,
            body={
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
                "dimensions": ["query", "page"],
                "type": "web",
                "dataState": "final",
                "aggregationType": "auto",
                "rowLimit": row_limit,
                "startRow": start_row,
            },
        ).execute()
        batch = response.get("rows", [])
        rows.extend(batch)
        if len(batch) < row_limit:
            break
        start_row += row_limit
    return rows


def fetch_totals(service, start_date, end_date):
    response = service.searchanalytics().query(
        siteUrl=PROPERTY,
        body={
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "type": "web",
            "dataState": "final",
            "rowLimit": 1,
        },
    ).execute()
    rows = response.get("rows", [])
    return rows[0] if rows else {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0}


def write_query_page_csv(path, rows, start_date, end_date):
    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            ["query", "page", "clicks", "impressions", "ctr", "position", "start_date", "end_date"]
        )
        for row in rows:
            query, page = row["keys"]
            writer.writerow(
                [
                    query,
                    page,
                    row["clicks"],
                    row["impressions"],
                    row["ctr"],
                    row["position"],
                    start_date.isoformat(),
                    end_date.isoformat(),
                ]
            )


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    credentials = get_credentials()
    service = build_service(credentials)

    sites = service.sites().list().execute().get("siteEntry", [])
    access = next((site for site in sites if site.get("siteUrl") == PROPERTY), None)
    if not access:
        raise RuntimeError(f"Authorized account cannot access {PROPERTY}")

    latest_final_date = find_latest_final_date(service)
    windows = window_dates(latest_final_date)
    manifest = {
        "property": PROPERTY,
        "permission_level": access.get("permissionLevel"),
        "search_type": "web",
        "data_state": "final",
        "latest_final_date": latest_final_date.isoformat(),
        "windows": {},
    }

    for name, (start_date, end_date) in windows.items():
        rows = fetch_query_page(service, start_date, end_date)
        totals = fetch_totals(service, start_date, end_date)
        output_file = OUTPUT_DIR / f"{name}-query-page.csv"
        write_query_page_csv(output_file, rows, start_date, end_date)
        manifest["windows"][name] = {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "query_page_rows": len(rows),
            "totals": {
                "clicks": totals.get("clicks", 0),
                "impressions": totals.get("impressions", 0),
                "ctr": totals.get("ctr", 0),
                "position": totals.get("position", 0),
            },
            "file": str(output_file),
        }
        print(f"{name}: {start_date} to {end_date}, {len(rows)} Query x Page rows")

    manifest_file = OUTPUT_DIR / "manifest.json"
    manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"latest final date: {latest_final_date}")
    print(f"manifest: {manifest_file}")


if __name__ == "__main__":
    main()
