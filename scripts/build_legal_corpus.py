#!/usr/bin/env python3
"""Regenerate legal-corpus/manifest.json from seed + on-disk markdown files."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORPUS_DIR = ROOT / "app" / "public" / "legal-corpus"
SEED_FILE = ROOT / "app" / "src" / "lib" / "db" / "figureLegalStatute2026.js"
STUB_THRESHOLD = 500
OFFICIAL_MARKERS = ("corpusSource: official", "corpusTier: official")

# seed id -> relative path when filename differs from id
ID_ALIASES: dict[str, str] = {
    "law-pipl": "laws/law-personal-info.md",
}

# id -> relative path under legal-corpus/
CORPUS_FILES: dict[str, str] = {
    # 法典/基本法节选
    "law-constitution": "laws/law-constitution.md",
    "law-civil-code": "laws/law-civil-code.md",
    "law-criminal": "laws/law-criminal.md",
    "law-legislation": "laws/law-legislation.md",
    "law-company": "laws/law-company.md",
    # 数据与安全
    "law-data-security": "laws/law-data-security.md",
    "law-pipl": "laws/law-personal-info.md",
    "law-cybersecurity": "laws/law-cybersecurity.md",
    "law-anti-foreign-sanctions": "laws/law-anti-foreign-sanctions.md",
    "law-nat-security": "laws/law-nat-security.md",
    "law-counter-espionage": "laws/law-counter-espionage.md",
    "law-counter-terrorism": "laws/law-counter-terrorism.md",
    "law-state-secrets": "laws/law-state-secrets.md",
    "law-hk-security": "laws/law-hk-security.md",
    # 行政
    "law-admin-procedure": "laws/law-admin-procedure.md",
    "law-admin-review": "laws/law-admin-review.md",
    "law-admin-litigation": "laws/law-admin-litigation.md",
    "law-admin-licensing": "laws/law-admin-licensing.md",
    "law-admin-coercion": "laws/law-admin-coercion.md",
    "law-emergency": "laws/law-emergency.md",
    # 民商经济
    "law-foreign-investment": "laws/law-foreign-investment.md",
    "law-ecommerce": "laws/law-ecommerce.md",
    "law-securities": "laws/law-securities.md",
    "law-anti-monopoly": "laws/law-anti-monopoly.md",
    "law-unfair-competition": "laws/law-unfair-competition.md",
    "law-enterprise-bankruptcy": "laws/law-enterprise-bankruptcy.md",
    "law-commercial-bank": "laws/law-commercial-bank.md",
    "law-central-bank": "laws/law-central-bank.md",
    "law-budget": "laws/law-budget.md",
    "law-tax-collection": "laws/law-tax-collection.md",
    "law-corporate-income-tax": "laws/law-corporate-income-tax.md",
    "law-vat": "laws/law-vat.md",
    # 知识产权
    "law-patent": "laws/law-patent.md",
    "law-copyright": "laws/law-copyright.md",
    "law-trademark": "laws/law-trademark.md",
    # 劳动社会
    "law-labor": "laws/law-labor.md",
    "law-labor-contract": "laws/law-labor-contract.md",
    "law-social-insurance": "laws/law-social-insurance.md",
    "law-consumer": "laws/law-consumer.md",
    "law-food-safety": "laws/law-food-safety.md",
    "law-education": "laws/law-education.md",
    # 环境能源
    "law-env-protection": "laws/law-env-protection.md",
    "law-energy": "laws/law-energy.md",
    "law-air": "laws/law-air.md",
    "law-land-admin": "laws/law-land-admin.md",
    # 刑事诉讼
    "law-criminal-procedure": "laws/law-criminal-procedure.md",
    # 国安国防
    "law-supervision-comm": "laws/law-supervision-comm.md",
    "law-national-defense": "laws/law-national-defense.md",
    # 科技 AI
    "law-ai-governance": "laws/law-ai-governance.md",
    # 行政法规 / 条例
    "reg-export-control": "regulations/reg-export-control.md",
    "reg-safety-production": "regulations/reg-safety-production.md",
    "reg-wetland": "regulations/reg-wetland.md",
    "reg-yangtze": "regulations/reg-yangtze.md",
    "reg-yellow-river": "regulations/reg-yellow-river.md",
    "reg-black-soil": "regulations/reg-black-soil.md",
    "reg-nuclear-safety": "regulations/reg-nuclear-safety.md",
    "reg-aml": "regulations/reg-aml.md",
    "reg-market-reg": "regulations/reg-market-reg.md",
    "reg-fair-competition": "regulations/reg-fair-competition.md",
    "reg-cyber-data": "regulations/reg-cyber-data.md",
    "reg-key-cii": "regulations/reg-key-cii.md",
    "reg-medical-insurance": "regulations/reg-medical-insurance.md",
    "reg-pollution-permit": "regulations/reg-pollution-permit.md",
    "reg-eco-compensation": "regulations/reg-eco-compensation.md",
    "reg-foreign-investment": "regulations/reg-foreign-investment.md",
    "reg-budget-impl": "regulations/reg-budget-impl.md",
}

EXCERPT_IDS = {
    "law-constitution",
    "law-civil-code",
    "law-criminal",
    "law-legislation",
    "law-company",
    "law-securities",
    "law-hk-security",
    "law-anti-monopoly",
    "law-patent",
    "law-copyright",
    "law-trademark",
    "law-air",
    "law-enterprise-bankruptcy",
}


def parse_seed() -> list[dict]:
    text = SEED_FILE.read_text(encoding="utf-8")
    pattern = re.compile(
        r'L\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"'
    )
    rows = []
    for m in pattern.finditer(text):
        rows.append(
            {
                "id": m.group(1),
                "title": m.group(2),
                "type": m.group(3),
                "issuer": m.group(4),
                "effectiveDate": m.group(5),
                "revisedDate": m.group(6),
                "status": m.group(7),
            }
        )
    return rows


def file_char_count(rel_path: str) -> int:
    try:
        return len((CORPUS_DIR / rel_path).read_text(encoding="utf-8"))
    except OSError:
        return 0


def read_frontmatter_tier(rel_path: str) -> str | None:
    try:
        head = (CORPUS_DIR / rel_path).read_text(encoding="utf-8")[:600]
    except OSError:
        return None
    m = re.search(r"corpusTier:\s*(\S+)", head)
    return m.group(1) if m else None


def is_official_corpus(rel_path: str) -> bool:
    try:
        head = (CORPUS_DIR / rel_path).read_text(encoding="utf-8")[:800]
    except OSError:
        return False
    return any(m in head for m in OFFICIAL_MARKERS)


def corpus_tier(entry_id: str, rel_path: str | None) -> str | None:
    if not rel_path:
        return None
    chars = file_char_count(rel_path)
    if chars < STUB_THRESHOLD:
        return "stub"
    fm_tier = read_frontmatter_tier(rel_path)
    if is_official_corpus(rel_path):
        return fm_tier or "official"
    if fm_tier in ("official", "full", "extended", "excerpt", "stub"):
        return fm_tier
    if entry_id in EXCERPT_IDS:
        return "excerpt"
    if entry_id.startswith("ji-"):
        return "extended"
    return "full" if chars >= 8000 else "extended"


def resolve_corpus_file(entry_id: str) -> str | None:
    """Map entry id to on-disk markdown (explicit map + alias + convention)."""
    rel = ID_ALIASES.get(entry_id) or CORPUS_FILES.get(entry_id)
    if not rel:
        if entry_id.startswith("law-"):
            rel = f"laws/{entry_id}.md"
        elif entry_id.startswith("reg-"):
            rel = f"regulations/{entry_id}.md"
        elif entry_id.startswith("ji-"):
            rel = f"interpretations/{entry_id}.md"
        else:
            return None
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

    manifest = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "baseUrl": "/legal-corpus",
        "totalEntries": len(entries),
        "corpusCount": sum(1 for e in entries.values() if e.get("corpusFile")),
        "entries": entries,
    }
    return manifest


def main() -> None:
    CORPUS_DIR.mkdir(parents=True, exist_ok=True)
    (CORPUS_DIR / "laws").mkdir(exist_ok=True)
    (CORPUS_DIR / "regulations").mkdir(exist_ok=True)
    (CORPUS_DIR / "interpretations").mkdir(exist_ok=True)

    manifest = build_manifest()
    out = CORPUS_DIR / "manifest.json"
    out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out} — {manifest['corpusCount']}/{manifest['totalEntries']} with corpus files")


if __name__ == "__main__":
    main()
