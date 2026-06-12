#!/usr/bin/env python3
"""Regenerate policy-corpus/manifest.json from docSeed + on-disk markdown files."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORPUS_DIR = ROOT / "app" / "public" / "policy-corpus"
SEED_FILE = ROOT / "app" / "src" / "lib" / "db" / "docSeed.js"
STUB_THRESHOLD = 500
OFFICIAL_MARKERS = ("corpusSource: official", "corpusTier: official")

# id -> relative path under policy-corpus/
CORPUS_FILES: dict[str, str] = {
    "gwr-2024": "policies/gwr-2024.md",
    "gwr-2025": "policies/gwr-2025.md",
    "gwr-2023": "policies/gwr-2023.md",
    "gwr-2022": "policies/gwr-2022.md",
    "gwr-2021": "policies/gwr-2021.md",
    "gwr-2026": "policies/gwr-2026.md",
    "plenum-20-3": "policies/plenum-20-3.md",
    "plenum-20-4": "policies/plenum-20-4.md",
    "plenum-19-5": "policies/plenum-19-5.md",
    "plenum-20-2": "policies/plenum-20-2.md",
    "fyp-14": "policies/fyp-14.md",
    "fyp-15": "policies/fyp-15.md",
    "cewc-2024": "policies/cewc-2024.md",
    "cewc-2025": "policies/cewc-2025.md",
    "cewc-2023": "policies/cewc-2023.md",
    "gwy-ai-2024": "policies/gwy-ai-2024.md",
    "csrc-stabilize-2024": "policies/csrc-stabilize-2024.md",
    "gwy-capital-2024": "policies/gwy-capital-2024.md",
    "gwy-market-2024": "policies/gwy-market-2024.md",
    "ndrc-fyp15-2026": "policies/ndrc-fyp15-2026.md",
    "ndrc-consume-2026": "policies/ndrc-consume-2026.md",
    "law-private-2025": "policies/law-private-2025.md",
    "gwy-digital-2023": "policies/gwy-digital-2023.md",
    "gwy-future-2024": "policies/gwy-future-2024.md",
    "gwy-consume-2024": "policies/gwy-consume-2024.md",
    "gwy-carbon-2024": "policies/gwy-carbon-2024.md",
    "miit-ai-2025": "policies/miit-ai-2025.md",
    "cac-ai-2024": "policies/cac-ai-2024.md",
    "pboc-2025": "policies/pboc-2025.md",
    "gwy-data-2024": "policies/gwy-data-2024.md",
    "gwy-lowalt-2024": "policies/gwy-lowalt-2024.md",
    "gwy-semicon-2024": "policies/gwy-semicon-2024.md",
}

EXCERPT_IDS = {
    "gwr-2026",
    "plenum-20-4",
    "fyp-15",
    "cewc-2025",
    "ndrc-fyp15-2026",
    "ndrc-consume-2026",
    "law-private-2025",
}

EXTENDED_IDS = {
    "gwr-2024",
    "gwr-2025",
    "gwr-2023",
    "gwr-2022",
    "gwr-2021",
    "plenum-20-3",
    "cewc-2024",
    "cewc-2023",
    "csrc-stabilize-2024",
}


def parse_seed() -> list[dict]:
    text = SEED_FILE.read_text(encoding="utf-8")
    blocks = re.split(r"\{\s*\n\s*id:\s*\"", text)
    rows: list[dict] = []
    for block in blocks[1:]:
        id_m = re.match(r'([^"]+)"', block)
        if not id_m:
            continue
        eid = id_m.group(1)

        def field(name: str, default: str = "") -> str:
            m = re.search(rf'{name}:\s*"([^"]*)"', block)
            return m.group(1) if m else default

        year_m = re.search(r"year:\s*(\d+)", block)
        rows.append(
            {
                "id": eid,
                "title": field("title", eid),
                "type": field("type", "政策文件"),
                "org": field("org"),
                "date": field("date"),
                "year": int(year_m.group(1)) if year_m else None,
                "category": field("category"),
            }
        )
    return rows


def file_char_count(rel_path: str) -> int:
    try:
        return len((CORPUS_DIR / rel_path).read_text(encoding="utf-8"))
    except OSError:
        return 0


def is_official_corpus(rel_path: str) -> bool:
    try:
        head = (CORPUS_DIR / rel_path).read_text(encoding="utf-8")[:800]
    except OSError:
        return False
    return any(m in head for m in OFFICIAL_MARKERS)


def corpus_tier(entry_id: str, rel_path: str | None) -> str | None:
    if not rel_path:
        return None
    if file_char_count(rel_path) < STUB_THRESHOLD:
        return "stub"
    if is_official_corpus(rel_path):
        return "full"
    if entry_id in EXCERPT_IDS:
        return "excerpt"
    if entry_id in EXTENDED_IDS:
        return "extended"
    return "full"


def resolve_corpus_file(entry_id: str) -> str | None:
    rel = CORPUS_FILES.get(entry_id) or f"policies/{entry_id}.md"
    full = CORPUS_DIR / rel
    return rel if full.is_file() else None


def build_manifest() -> dict:
    rows = parse_seed()
    entries: dict[str, dict] = {}
    for row in rows:
        eid = row["id"]
        rel = resolve_corpus_file(eid)
        if CORPUS_FILES.get(eid) and not rel:
            print(f"WARN: missing corpus file for {eid}: {CORPUS_FILES[eid]}")
        entry = {
            **row,
            "corpusFile": rel,
            "corpusTier": corpus_tier(eid, rel),
        }
        entries[eid] = entry

    # include corpus-only entries not in seed
    for md in (CORPUS_DIR / "policies").glob("*.md"):
        eid = md.stem
        if eid not in entries:
            rel = f"policies/{eid}.md"
            entries[eid] = {
                "id": eid,
                "title": eid,
                "type": "政策文件",
                "corpusFile": rel,
                "corpusTier": corpus_tier(eid, rel),
            }

    manifest = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "baseUrl": "/policy-corpus",
        "totalEntries": len(entries),
        "corpusCount": sum(1 for e in entries.values() if e.get("corpusFile")),
        "entries": entries,
    }
    return manifest


def main() -> None:
    CORPUS_DIR.mkdir(parents=True, exist_ok=True)
    (CORPUS_DIR / "policies").mkdir(exist_ok=True)

    manifest = build_manifest()
    out = CORPUS_DIR / "manifest.json"
    out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out} — {manifest['corpusCount']}/{manifest['totalEntries']} with corpus files")


if __name__ == "__main__":
    main()
