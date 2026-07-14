#!/usr/bin/env python3
"""Global freshness audit: stale as_of, COVID-era copy, pre-2024 news seeds.

Run from repo root:
  python3 scripts/globalFreshnessAudit.py
  python3 scripts/globalFreshnessAudit.py --json reports/freshness-audit.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = date(2026, 7, 14)
BASELINE_STR = "2026-07-14"
BASELINE_MONTH = "2026-07"

SCAN_DIRS = [
    ROOT / "app/src",
    ROOT / "app/public/policy-corpus",
    ROOT / "app/public/legal-corpus",
    ROOT / "scripts",
]

SKIP_PARTS = {".git", "node_modules", "dist", ".cache", "__pycache__"}

AS_OF_PATTERNS = [
    re.compile(r"(?:asOf|as_of|AS_OF|AS_OF_BASELINE)\s*[:=]\s*['\"]([^'\"]+)['\"]"),
    re.compile(r"基准日\s*[:：]?\s*['\"]?(\d{4}-\d{2}(?:-\d{2})?)"),
    re.compile(r"数据截至\s*<[^>]+>\s*\{?AS_OF\}?\s*['\"]?(\d{4}-\d{2}(?:-\d{2})?)"),
    re.compile(r"AS_OF\s+(\d{4}-\d{2}(?:-\d{2})?)"),
]

# Historical publication / source dates — not global baseline drift.
SOURCE_AS_OF_RE = re.compile(r"sourceAsOf\s*[:=]\s*['\"]([^'\"]+)['\"]")
HISTORICAL_AS_OF_LINE_RE = re.compile(r"historical-as-of|\[史料\]|source-date|史料口径")

PANDEMIC_RE = re.compile(r"新冠|疫情封控|动态清零|核酸检测|方舱医院|封城|抢菜|健康码|行程码")
NEWS_DATE_RE = re.compile(r"publishedAt:\s*['\"](\d{4}-\d{2}-\d{2})['\"]")
PLACEHOLDER_DATE_RE = re.compile(r"['\"]?(1970-01-01|2000-01-01|2099-12-31)['\"]?")
STALE_YEAR_RE = re.compile(r"\b(202[0-3])\b")

META_AS_OF_OK = {BASELINE_STR, BASELINE_MONTH, "2026-06-11", "2026-06", "2026-07-13"}

# Regex / filter definition lines and verbatim policy corpus are not stale UI copy.
PANDEMIC_DEF_RE = re.compile(r"(?:PANDEMIC_RE|STALE_PANDEMIC_RE)\s*=")
PLACEHOLDER_DEF_RE = re.compile(r"PLACEHOLDER_DATE_RE\s*=")
POLICY_CORPUS_PART = "app/public/policy-corpus"


def parse_date(s: str) -> date | None:
    s = (s or "").strip()
    if not s:
        return None
    m = re.match(r"(\d{4})-(\d{2})(?:-(\d{2}))?", s)
    if not m:
        return None
    y, mo = int(m.group(1)), int(m.group(2))
    d = int(m.group(3)) if m.group(3) else 1
    try:
        return date(y, mo, d)
    except ValueError:
        return None


def iter_files() -> list[Path]:
    out: list[Path] = []
    for base in SCAN_DIRS:
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if not p.is_file():
                continue
            if any(part in SKIP_PARTS for part in p.parts):
                continue
            if p.suffix.lower() in {".js", ".jsx", ".py", ".md", ".json", ".html"}:
                out.append(p)
    return sorted(out)


def audit_file(path: Path) -> dict:
    rel = str(path.relative_to(ROOT))
    text = path.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    findings: list[dict] = []

    for i, line in enumerate(lines, 1):
        ctx = "\n".join(lines[max(0, i - 3) : min(len(lines), i + 1)])
        is_historical_ctx = (
            HISTORICAL_AS_OF_LINE_RE.search(line) is not None
            or HISTORICAL_AS_OF_LINE_RE.search(ctx) is not None
            or SOURCE_AS_OF_RE.search(line) is not None
        )

        for pat in AS_OF_PATTERNS:
            for m in pat.finditer(line):
                val = m.group(1)
                if val in META_AS_OF_OK:
                    continue
                if "示意" in val or "估算" in val or "IISS" in val or "SIPRI" in val:
                    continue
                if is_historical_ctx:
                    continue
                d = parse_date(val)
                if d and d < date(2026, 1, 1):
                    findings.append({
                        "kind": "stale_as_of",
                        "line": i,
                        "value": val,
                        "snippet": line.strip()[:120],
                    })

        if (
            PANDEMIC_RE.search(line)
            and "STALE_PANDEMIC" not in line
            and "疫情/封控" not in line
            and not PANDEMIC_DEF_RE.search(line)
            and POLICY_CORPUS_PART not in rel
        ):
            if path.name != "newsFeed.js" or "seed" in line.lower():
                findings.append({
                    "kind": "pandemic_copy",
                    "line": i,
                    "snippet": line.strip()[:120],
                })

        for m in NEWS_DATE_RE.finditer(line):
            d = parse_date(m.group(1))
            if d and d < date(2024, 1, 1):
                findings.append({
                    "kind": "stale_news_seed",
                    "line": i,
                    "value": m.group(1),
                    "snippet": line.strip()[:120],
                })

        if PLACEHOLDER_DATE_RE.search(line) and not PLACEHOLDER_DEF_RE.search(line):
            findings.append({
                "kind": "placeholder_date",
                "line": i,
                "snippet": line.strip()[:120],
            })

    return {"file": rel, "findings": findings}


def audit_news_feed() -> dict:
    """Accept literal AS_OF_NEWS date or import alias: AS_OF_NEWS = AS_OF_BASELINE."""
    nf = ROOT / "app/src/modules/dashboard/newsFeed.js"
    if not nf.is_file():
        return {"error": "newsFeed.js missing"}
    text = nf.read_text(encoding="utf-8")
    seeds = NEWS_DATE_RE.findall(text)
    stale = [d for d in seeds if parse_date(d) and parse_date(d) < date(2024, 1, 1)]
    has_filter = "NEWS_MAX_AGE_DAYS" in text and "filterTimelyNews" in text
    has_pandemic = "STALE_PANDEMIC_RE" in text
    literal_ok = f"AS_OF_NEWS = '{BASELINE_STR}'" in text or f'AS_OF_NEWS = "{BASELINE_STR}"' in text
    alias_ok = (
        "AS_OF_NEWS = AS_OF_BASELINE" in text
        and "asOfBaseline" in text
        and BASELINE_STR in (ROOT / "app/src/lib/config/asOfBaseline.js").read_text(encoding="utf-8")
    )
    as_of_status = BASELINE_STR if (literal_ok or alias_ok) else "mismatch"
    return {
        "seed_count": len(seeds),
        "stale_pre_2024": stale,
        "has_60_day_filter": has_filter,
        "has_pandemic_filter": has_pandemic,
        "as_of_constant": as_of_status,
    }


def audit_baseline_config() -> dict:
    cfg = ROOT / "app/src/lib/config/asOfBaseline.js"
    ok = cfg.is_file() and BASELINE_STR in cfg.read_text(encoding="utf-8")
    return {"config_exists": ok, "expected": BASELINE_STR}


def main() -> int:
    ap = argparse.ArgumentParser(description="Global freshness audit")
    ap.add_argument("--json", type=Path, help="Write JSON report")
    args = ap.parse_args()

    file_reports = [audit_file(p) for p in iter_files()]
    flagged = [r for r in file_reports if r["findings"]]

    by_kind: dict[str, int] = {}
    for r in flagged:
        for f in r["findings"]:
            by_kind[f["kind"]] = by_kind.get(f["kind"], 0) + 1

    report = {
        "baseline": BASELINE_STR,
        "files_scanned": len(file_reports),
        "files_flagged": len(flagged),
        "findings_by_kind": by_kind,
        "baseline_config": audit_baseline_config(),
        "news_feed": audit_news_feed(),
        "top_flagged": sorted(
            [{"file": r["file"], "count": len(r["findings"]), "kinds": list({f["kind"] for f in r["findings"]})}
             for r in flagged],
            key=lambda x: x["count"],
            reverse=True,
        )[:25],
        "details": flagged[:80],
    }

    print(f"// global freshness audit · baseline {BASELINE_STR}")
    print(f"// scanned {report['files_scanned']} files · flagged {report['files_flagged']}")
    print(f"// findings: {by_kind}")
    print(f"// news feed: seeds={report['news_feed'].get('seed_count')} stale_pre_2024={len(report['news_feed'].get('stale_pre_2024', []))} filter60d={report['news_feed'].get('has_60_day_filter')}")
    if flagged:
        print("\n## top flagged")
        for item in report["top_flagged"][:12]:
            print(f"  {item['file']}: {item['count']} ({', '.join(item['kinds'])})")

    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nWrote {args.json}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
