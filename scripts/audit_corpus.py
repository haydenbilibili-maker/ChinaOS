#!/usr/bin/env python3
"""Audit legal/policy corpus: missing corpusFile, orphans, stubs, ID mismatches."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from corpus_common import legal_rel_path, parse_doc_seed, parse_legal_seed

ROOT = Path(__file__).resolve().parents[1]
STUB_THRESHOLD = 500

# seed id -> on-disk relative path (filename mismatches)
LEGAL_ID_ALIASES: dict[str, str] = {
    "law-pipl": "laws/law-personal-info.md",
}


def resolve_legal_file(entry_id: str, corpus_dir: Path) -> str | None:
    rel = LEGAL_ID_ALIASES.get(entry_id) or legal_rel_path(entry_id)
    if rel and (corpus_dir / rel).is_file():
        return rel
    return None


def file_chars(corpus_dir: Path, rel: str) -> int:
    return len((corpus_dir / rel).read_text(encoding="utf-8"))


def audit_legal() -> dict:
    seed = parse_legal_seed()
    manifest = json.loads((ROOT / "app/public/legal-corpus/manifest.json").read_text(encoding="utf-8"))
    corpus_dir = ROOT / "app/public/legal-corpus"

    seed_ids = {r["id"] for r in seed}
    missing: list[str] = []
    stubs: list[tuple[str, str, int]] = []
    mismatches: list[tuple[str, str]] = []
    has_file: list[str] = []

    for r in seed:
        eid = r["id"]
        entry = manifest["entries"].get(eid, {})
        cf = entry.get("corpusFile")
        disk_rel = resolve_legal_file(eid, corpus_dir)

        if disk_rel and not cf:
            mismatches.append((eid, disk_rel))
        if cf:
            has_file.append(eid)
            sz = file_chars(corpus_dir, cf)
            if sz < STUB_THRESHOLD:
                stubs.append((eid, cf, sz))
        elif not disk_rel:
            missing.append(eid)

    orphans: list[tuple[str, str, int]] = []
    for md in corpus_dir.rglob("*.md"):
        rel = str(md.relative_to(corpus_dir))
        stem = md.stem
        if stem not in seed_ids:
            # check alias reverse
            aliased = any(v.endswith(f"{stem}.md") for v in LEGAL_ID_ALIASES.values())
            if not aliased:
                orphans.append((stem, rel, len(md.read_text(encoding="utf-8"))))

    return {
        "seed_total": len(seed),
        "manifest_corpus": manifest.get("corpusCount"),
        "manifest_total": manifest.get("totalEntries"),
        "missing": missing,
        "has_file": has_file,
        "stubs": stubs,
        "orphans": orphans,
        "mismatches": mismatches,
    }


def audit_policy() -> dict:
    seed = parse_doc_seed()
    manifest = json.loads((ROOT / "app/public/policy-corpus/manifest.json").read_text(encoding="utf-8"))
    corpus_dir = ROOT / "app/public/policy-corpus"

    seed_ids = {r["id"] for r in seed}
    missing: list[str] = []
    stubs: list[tuple[str, str, int]] = []
    has_file: list[str] = []

    for r in seed:
        eid = r["id"]
        entry = manifest["entries"].get(eid, {})
        cf = entry.get("corpusFile")
        if cf:
            has_file.append(eid)
            sz = file_chars(corpus_dir, cf)
            if sz < STUB_THRESHOLD:
                stubs.append((eid, cf, sz))
        else:
            rel = f"policies/{eid}.md"
            if (corpus_dir / rel).is_file():
                missing.append(f"{eid} (file on disk, not in manifest)")
            else:
                missing.append(eid)

    orphans: list[tuple[str, str]] = []
    for md in (corpus_dir / "policies").glob("*.md"):
        if md.stem not in seed_ids:
            orphans.append((md.stem, f"policies/{md.stem}.md"))

    return {
        "seed_total": len(seed),
        "manifest_corpus": manifest.get("corpusCount"),
        "manifest_total": manifest.get("totalEntries"),
        "missing": missing,
        "has_file": has_file,
        "stubs": stubs,
        "orphans": orphans,
    }


def print_report(legal: dict, policy: dict) -> None:
    print("=" * 60)
    print("CORPUS AUDIT REPORT")
    print("=" * 60)
    print()
    print("## LEGAL")
    print(f"  Seed entries:     {legal['seed_total']}")
    print(f"  Manifest corpus:  {legal['manifest_corpus']}/{legal['manifest_total']}")
    print(f"  Missing corpusFile: {len(legal['missing'])}")
    print(f"  ID mismatches (file exists, no manifest): {len(legal['mismatches'])}")
    print(f"  Stubs (<{STUB_THRESHOLD} chars): {len(legal['stubs'])}")
    print(f"  Orphan files:     {len(legal['orphans'])}")
    if legal["mismatches"]:
        print("  Mismatches:")
        for eid, rel in legal["mismatches"]:
            print(f"    - {eid} -> {rel}")
    if legal["orphans"]:
        print("  Orphans:")
        for stem, rel, sz in legal["orphans"][:10]:
            print(f"    - {stem} ({rel}, {sz} chars)")
    if legal["missing"]:
        print(f"  Missing IDs ({len(legal['missing'])}):")
        for x in legal["missing"]:
            print(f"    - {x}")

    print()
    print("## POLICY")
    print(f"  Seed entries:     {policy['seed_total']}")
    print(f"  Manifest corpus:  {policy['manifest_corpus']}/{policy['manifest_total']}")
    print(f"  Missing corpusFile: {len(policy['missing'])}")
    print(f"  Stubs (<{STUB_THRESHOLD} chars): {len(policy['stubs'])}")
    print(f"  Orphan files:     {len(policy['orphans'])}")
    if policy["missing"]:
        print(f"  Missing IDs ({len(policy['missing'])}):")
        for x in policy["missing"][:30]:
            print(f"    - {x}")
        if len(policy["missing"]) > 30:
            print(f"    ... and {len(policy['missing']) - 30} more")


def main() -> int:
    legal = audit_legal()
    policy = audit_policy()
    print_report(legal, policy)
    return 0


if __name__ == "__main__":
    sys.exit(main())
