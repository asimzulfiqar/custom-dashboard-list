#!/usr/bin/env python3
"""
Dump InfluxDB 1.x Schema and Sample Data to JSON and Markdown/Text.

Features:
- Connects using standard library (no pip dependencies required) or influxdb client.
- Dumps databases, measurements, retention policies, tag keys, field keys,
  sample tag values, and sample data points.
- Saves structured JSON and an easy-to-read Markdown summary report.

Usage:
  python dump_influxdb_schema.py --host localhost --port 8086 --database my_database
  python dump_influxdb_schema.py --help
"""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
import ssl
from typing import Any, Dict, List, Optional


def query_influxdb_http(
    host: str,
    port: int,
    query: str,
    database: Optional[str] = None,
    username: Optional[str] = None,
    password: Optional[str] = None,
    use_ssl: bool = False,
    verify_ssl: bool = True,
    timeout: int = 30,
) -> Dict[str, Any]:
    """Execute an InfluxQL query against InfluxDB 1.x HTTP API."""
    scheme = "https" if use_ssl else "http"
    params = {"q": query}
    if database:
        params["db"] = database
    if username:
        params["u"] = username
    if password:
        params["p"] = password

    url = f"{scheme}://{host}:{port}/query?{urllib.parse.urlencode(params)}"

    context = None
    if use_ssl and not verify_ssl:
        context = ssl._create_unverified_context()

    req = urllib.request.Request(url, headers={"User-Agent": "InfluxSchemaDumper/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=context) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code} querying InfluxDB: {error_body}")
    except Exception as e:
        raise RuntimeError(f"Failed to connect to InfluxDB ({scheme}://{host}:{port}): {e}")


def parse_series_result(query_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Helper to extract series list from InfluxDB JSON response."""
    results = query_response.get("results", [])
    if not results:
        return []
    first_res = results[0]
    if "error" in first_res:
        raise RuntimeError(f"InfluxDB Query Error: {first_res['error']}")
    return first_res.get("series", [])


def dump_schema(
    host: str,
    port: int,
    target_database: Optional[str] = None,
    username: Optional[str] = None,
    password: Optional[str] = None,
    use_ssl: bool = False,
    verify_ssl: bool = True,
    sample_limit: int = 3,
) -> Dict[str, Any]:
    """Inspect and extract full schema."""
    print(f"[*] Connecting to InfluxDB at {host}:{port} (SSL: {use_ssl})...")

    # 1. Show databases
    db_resp = query_influxdb_http(host, port, "SHOW DATABASES", username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
    db_series = parse_series_result(db_resp)

    databases = []
    if db_series and "values" in db_series[0]:
        databases = [row[0] for row in db_series[0]["values"] if row and row[0] not in ("_internal",)]

    if target_database:
        databases = [target_database]

    print(f"[+] Found {len(databases)} database(s) to inspect: {', '.join(databases)}")

    full_schema: Dict[str, Any] = {
        "host": host,
        "port": port,
        "databases": {},
    }

    for db in databases:
        print(f"\n[+] Inspecting database: '{db}'...")
        db_info: Dict[str, Any] = {
            "retention_policies": [],
            "measurements": {},
        }

        # Retention policies
        try:
            rp_resp = query_influxdb_http(host, port, f'SHOW RETENTION POLICIES ON "{db}"', database=db, username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
            rp_series = parse_series_result(rp_resp)
            if rp_series and "values" in rp_series[0]:
                cols = rp_series[0].get("columns", [])
                for row in rp_series[0]["values"]:
                    db_info["retention_policies"].append(dict(zip(cols, row)))
        except Exception as e:
            print(f"    [-] Warning fetching retention policies: {e}")

        # Measurements
        m_resp = query_influxdb_http(host, port, "SHOW MEASUREMENTS", database=db, username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
        m_series = parse_series_result(m_resp)

        measurements = []
        if m_series and "values" in m_series[0]:
            measurements = [row[0] for row in m_series[0]["values"]]

        print(f"    [*] Found {len(measurements)} measurement(s): {', '.join(measurements)}")

        for m in measurements:
            m_info: Dict[str, Any] = {
                "tag_keys": [],
                "tag_values_sample": {},
                "field_keys": [],
                "sample_points": [],
            }

            # Tag keys
            try:
                tk_resp = query_influxdb_http(host, port, f'SHOW TAG KEYS FROM "{m}"', database=db, username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
                tk_series = parse_series_result(tk_resp)
                if tk_series and "values" in tk_series[0]:
                    m_info["tag_keys"] = [row[0] for row in tk_series[0]["values"]]
            except Exception as e:
                print(f"        [-] Error fetching tag keys for '{m}': {e}")

            # Sample tag values (limit 10 per tag key)
            for tag_key in m_info["tag_keys"][:8]:  # inspect up to 8 tag keys
                try:
                    tv_resp = query_influxdb_http(host, port, f'SHOW TAG VALUES FROM "{m}" WITH KEY = "{tag_key}" LIMIT 10', database=db, username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
                    tv_series = parse_series_result(tv_resp)
                    if tv_series and "values" in tv_series[0]:
                        m_info["tag_values_sample"][tag_key] = [row[1] for row in tv_series[0]["values"]]
                except Exception:
                    pass

            # Field keys
            try:
                fk_resp = query_influxdb_http(host, port, f'SHOW FIELD KEYS FROM "{m}"', database=db, username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
                fk_series = parse_series_result(fk_resp)
                if fk_series and "values" in fk_series[0]:
                    # row is [fieldKey, fieldType]
                    m_info["field_keys"] = [{"field": row[0], "type": row[1]} for row in fk_series[0]["values"]]
            except Exception as e:
                print(f"        [-] Error fetching field keys for '{m}': {e}")

            # Sample points
            try:
                sp_resp = query_influxdb_http(host, port, f'SELECT * FROM "{m}" ORDER BY time DESC LIMIT {sample_limit}', database=db, username=username, password=password, use_ssl=use_ssl, verify_ssl=verify_ssl)
                sp_series = parse_series_result(sp_resp)
                if sp_series and "values" in sp_series[0]:
                    cols = sp_series[0].get("columns", [])
                    for row in sp_series[0]["values"]:
                        m_info["sample_points"].append(dict(zip(cols, row)))
            except Exception as e:
                print(f"        [-] Error fetching sample points for '{m}': {e}")

            db_info["measurements"][m] = m_info

        full_schema["databases"][db] = db_info

    return full_schema


def generate_markdown_summary(schema: Dict[str, Any]) -> str:
    """Generate human-readable markdown summary."""
    lines = ["# InfluxDB 1.x Schema Summary Report\n"]
    lines.append(f"**Host**: `{schema.get('host')}:{schema.get('port')}`\n")

    for db_name, db_data in schema.get("databases", {}).items():
        lines.append(f"## Database: `{db_name}`\n")

        rps = db_data.get("retention_policies", [])
        if rps:
            lines.append("### Retention Policies")
            lines.append("| Name | Duration | Shard Group Duration | Replica | Default |")
            lines.append("| :--- | :--- | :--- | :--- | :--- |")
            for rp in rps:
                lines.append(f"| `{rp.get('name')}` | {rp.get('duration')} | {rp.get('shardGroupDuration')} | {rp.get('replicaN')} | {rp.get('default')} |")
            lines.append("")

        measurements = db_data.get("measurements", {})
        lines.append(f"### Measurements ({len(measurements)})\n")

        for m_name, m_data in measurements.items():
            lines.append(f"#### 📊 Measurement: `{m_name}`\n")

            # Tag keys table
            tag_keys = m_data.get("tag_keys", [])
            tag_samples = m_data.get("tag_values_sample", {})
            lines.append("**Tag Keys (Indexed Metadata):**")
            if tag_keys:
                for tk in tag_keys:
                    samples = tag_samples.get(tk, [])
                    sample_str = ", ".join([f"`{s}`" for s in samples[:5]]) if samples else "*none*"
                    lines.append(f"- **`{tk}`**: Sample values: {sample_str}")
            else:
                lines.append("- *(No tags)*")
            lines.append("")

            # Field keys table
            field_keys = m_data.get("field_keys", [])
            lines.append("**Field Keys (Values / Metrics):**")
            if field_keys:
                lines.append("| Field Key | Data Type |")
                lines.append("| :--- | :--- |")
                for fk in field_keys:
                    lines.append(f"| `{fk.get('field')}` | `{fk.get('type')}` |")
            else:
                lines.append("- *(No fields)*")
            lines.append("")

            # Sample point
            sample_points = m_data.get("sample_points", [])
            if sample_points:
                lines.append("**Latest Sample Record:**")
                lines.append("```json")
                lines.append(json.dumps(sample_points[0], indent=2))
                lines.append("```\n")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Extract and dump InfluxDB 1.x schema.")
    parser.add_argument("--host", default="localhost", help="InfluxDB host (default: localhost)")
    parser.add_argument("--port", type=int, default=8086, help="InfluxDB port (default: 8086)")
    parser.add_argument("--database", "-d", help="Specific database name (optional)")
    parser.add_argument("--username", "-u", help="InfluxDB username (optional)")
    parser.add_argument("--password", "-p", help="InfluxDB password (optional)")
    parser.add_argument("--ssl", action="store_true", help="Use HTTPS")
    parser.add_argument("--insecure", action="store_true", help="Skip SSL certificate verification")
    parser.add_argument("--out-json", default="influx_schema.json", help="Output JSON path (default: influx_schema.json)")
    parser.add_argument("--out-md", default="influx_schema_summary.md", help="Output Markdown path (default: influx_schema_summary.md)")
    parser.add_argument("--samples", type=int, default=3, help="Number of sample records per measurement (default: 3)")

    args = parser.parse_args()

    try:
        schema = dump_schema(
            host=args.host,
            port=args.port,
            target_database=args.database,
            username=args.username,
            password=args.password,
            use_ssl=args.ssl,
            verify_ssl=not args.insecure,
            sample_limit=args.samples,
        )

        # Save JSON
        with open(args.out_json, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2, ensure_ascii=False)
        print(f"\n[✓] Schema JSON saved to: {os.path.abspath(args.out_json)}")

        # Save Markdown
        md_summary = generate_markdown_summary(schema)
        with open(args.out_md, "w", encoding="utf-8") as f:
            f.write(md_summary)
        print(f"[✓] Schema Markdown report saved to: {os.path.abspath(args.out_md)}")

    except Exception as e:
        print(f"\n[!] Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

