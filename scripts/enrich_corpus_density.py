#!/usr/bin/env python3
"""Batch-enrich legal/policy corpus files below density threshold.

Targets excerpt/stub-tier entries (<2000 chars by default), adds structured
frontmatter, merges handcrafted + auto-generated + dense appendix sections.
Skips official-tier files unless --force-official.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from corpus_common import (
    AS_OF,
    DENSITY_THRESHOLD,
    FOOTER,
    ROOT,
    build_structured_frontmatter,
    dense_legal_appendices,
    dense_policy_appendices,
    expand_key_article,
    expanded_legal_sections,
    expanded_policy_sections,
    infer_structured_tier,
    is_official_text,
    law_doc,
    legal_rel_path,
    merge_sections,
    parse_doc_seed,
    parse_legal_seed,
    parse_markdown_sections,
    policy_doc,
    split_frontmatter,
)

from expand_corpus_stubs import (
    LEGAL_ALIASES,
    LEGAL_HANDCRAFTED,
    POLICY_HANDCRAFTED,
    build_legal_sections,
    build_policy_sections,
    load_raw_policy_blocks,
)
from gen_policy_corpus_content import FILES as POLICY_CONTENT_FILES

LEGAL_CORPUS = ROOT / "app/public/legal-corpus"
POLICY_CORPUS = ROOT / "app/public/policy-corpus/policies"

LEGAL_EXCERPT_IDS = {
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

POLICY_EXCERPT_IDS = {
    "gwr-2026",
    "plenum-20-4",
    "fyp-15",
    "cewc-2025",
    "ndrc-fyp15-2026",
    "ndrc-consume-2026",
    "law-private-2025",
}

PRIORITY_POLICY_IDS = {
    "gwr-2024",
    "gwr-2025",
    "gwr-2026",
    "gwr-2023",
    "fyp-14",
    "fyp-15",
    "plenum-20-3",
    "plenum-20-4",
    "plenum-19-5",
    "cewc-2024",
    "cewc-2025",
    "ndrc-fyp15-2026",
}


def resolve_legal_path(eid: str) -> Path | None:
    rel = LEGAL_ALIASES.get(eid) or legal_rel_path(eid)
    if not rel:
        return None
    return LEGAL_CORPUS / rel


def should_enrich(text: str, *, force: bool, force_official: bool, threshold: int) -> bool:
    if is_official_text(text) and not force_official:
        return False
    if force:
        return True
    return len(text) < threshold


def policy_content_sections(eid: str) -> list[tuple[str, list[str]]]:
    fname = f"{eid}.md"
    raw = POLICY_CONTENT_FILES.get(fname)
    if not raw:
        return []
    _, body = split_frontmatter(raw)
    return parse_markdown_sections(body)


def build_dense_legal_sections(entry: dict) -> list[tuple[str, list[str]]]:
    auto = expanded_legal_sections(entry)
    hand = build_legal_sections(entry)
    dense = dense_legal_appendices(entry)
    merged = merge_sections(auto, hand, dense)
    eid = entry["id"]
    if eid in LEGAL_HANDCRAFTED and entry.get("keyArticles"):
        merged = merge_sections(
            merged,
            [("重点条款索引", [f"**{a}** — {expand_key_article(a, entry)}" for a in entry["keyArticles"]])],
        )
    return merged


def build_dense_policy_sections(entry: dict, raw_block: str) -> list[tuple[str, list[str]]]:
    eid = entry["id"]
    layers: list[list[tuple[str, list[str]]]] = []

    if eid in PRIORITY_POLICY_IDS:
        layers.append(policy_content_sections(eid))
    if eid in POLICY_HANDCRAFTED:
        layers.append(POLICY_HANDCRAFTED[eid])
    layers.append(build_policy_sections(entry, raw_block))
    layers.append(dense_policy_appendices(entry))

    return merge_sections(*layers)


def enrich_legal(
    *,
    threshold: int,
    force: bool,
    force_official: bool,
    id_filter: set[str] | None,
) -> list[tuple[str, int, int, str]]:
    seed = {e["id"]: e for e in parse_legal_seed()}
    results: list[tuple[str, int, int, str]] = []

    for eid, entry in seed.items():
        if id_filter and eid not in id_filter:
            continue
        path = resolve_legal_path(eid)
        if not path or not path.is_file():
            continue

        old_text = path.read_text(encoding="utf-8")
        if not should_enrich(old_text, force=force, force_official=force_official, threshold=threshold):
            continue

        fm, _ = split_frontmatter(old_text)
        source_url = fm.get("sourceUrl")

        meta = f"{entry['revisedDate']} · {entry['issuer']} · {entry['status']}"
        body = law_doc(entry["title"], meta, build_dense_legal_sections(entry))
        tier = infer_structured_tier(len(body), eid, LEGAL_EXCERPT_IDS)
        front = build_structured_frontmatter(
            doc_id=eid,
            tier=tier,
            source="structured",
            source_url=source_url,
        )
        content = front + body
        path.write_text(content, encoding="utf-8")
        results.append((eid, len(old_text), len(content), tier))

    return results


def enrich_policy(
    *,
    threshold: int,
    force: bool,
    force_official: bool,
    id_filter: set[str] | None,
) -> list[tuple[str, int, int, str]]:
    seed = {e["id"]: e for e in parse_doc_seed()}
    raw_blocks = load_raw_policy_blocks()
    results: list[tuple[str, int, int, str]] = []

    for eid, entry in seed.items():
        if id_filter and eid not in id_filter:
            continue
        path = POLICY_CORPUS / f"{eid}.md"
        if not path.is_file():
            continue

        old_text = path.read_text(encoding="utf-8")
        if not should_enrich(old_text, force=force, force_official=force_official, threshold=threshold):
            continue

        fm, _ = split_frontmatter(old_text)
        source_url = fm.get("sourceUrl") or entry.get("source")

        meta = f"{entry['date']} · {entry['org']} · {entry['type']}"
        body = policy_doc(
            entry["title"],
            meta,
            build_dense_policy_sections(entry, raw_blocks.get(eid, "")),
        )
        tier = infer_structured_tier(len(body), eid, POLICY_EXCERPT_IDS)
        front = build_structured_frontmatter(
            doc_id=eid,
            tier=tier,
            source="structured",
            source_url=source_url if source_url and source_url.startswith("http") else None,
        )
        content = front + body
        path.write_text(content, encoding="utf-8")
        results.append((eid, len(old_text), len(content), tier))

    return results


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Enrich corpus density for thin markdown files")
    p.add_argument("--threshold", type=int, default=DENSITY_THRESHOLD, help="Char threshold (default 2000)")
    p.add_argument("--force", action="store_true", help="Re-enrich all non-official files")
    p.add_argument("--force-official", action="store_true", help="Also re-enrich official-tier files")
    p.add_argument("--legal-only", action="store_true")
    p.add_argument("--policy-only", action="store_true")
    p.add_argument("--ids", nargs="*", help="Subset of doc ids")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    id_filter = set(args.ids) if args.ids else None

    legal: list[tuple[str, int, int, str]] = []
    policy: list[tuple[str, int, int, str]] = []

    opts = {
        "threshold": args.threshold,
        "force": args.force,
        "force_official": args.force_official,
        "id_filter": id_filter,
    }

    if not args.policy_only:
        legal = enrich_legal(**opts)
    if not args.legal_only:
        policy = enrich_policy(**opts)

    print(f"Enriched {len(legal)} legal, {len(policy)} policy (threshold={args.threshold}, AS_OF={AS_OF})")

    for label, rows in ("legal", legal), ("policy", policy):
        if not rows:
            continue
        print(f"\n## {label.upper()} upgrades (sample)")
        for eid, old, new, tier in sorted(rows, key=lambda x: x[2] - x[1], reverse=True)[:12]:
            print(f"  {eid}: {old:,} -> {new:,} [{tier}]")
        if len(rows) > 12:
            print(f"  ... and {len(rows) - 12} more")

    return 0


if __name__ == "__main__":
    sys.exit(main())
