#!/usr/bin/env python3
"""Expand stub corpus files (<500 chars) to substantive structured markdown."""

from __future__ import annotations

import re
import sys
from pathlib import Path

from corpus_common import (
    ROOT,
    STUB_THRESHOLD,
    expand_key_article,
    expanded_legal_sections,
    expanded_policy_sections,
    law_doc,
    legal_rel_path,
    parse_doc_seed,
    parse_legal_seed,
    policy_doc,
)

# Reuse hand-crafted excerpts from prior batches
from gen_legal_corpus_batch2 import CONTENT as LEGAL_BATCH2
from gen_legal_corpus_batch3 import PRIORITY as LEGAL_BATCH3
from gen_policy_corpus_batch2 import EXTRA as POLICY_EXTRA2
from gen_policy_corpus_batch3 import EXTRA as POLICY_EXTRA3

LEGAL_CORPUS = ROOT / "app/public/legal-corpus"
POLICY_CORPUS = ROOT / "app/public/policy-corpus/policies"

LEGAL_ALIASES = {"law-pipl": "laws/law-personal-info.md"}
LEGAL_HANDCRAFTED = {**LEGAL_BATCH2, **LEGAL_BATCH3}
POLICY_HANDCRAFTED = {**POLICY_EXTRA2, **POLICY_EXTRA3}


def resolve_legal_path(eid: str) -> Path | None:
    rel = LEGAL_ALIASES.get(eid) or legal_rel_path(eid)
    if not rel:
        return None
    return LEGAL_CORPUS / rel


def is_stub(path: Path) -> bool:
    if not path.is_file():
        return False
    return len(path.read_text(encoding="utf-8")) < STUB_THRESHOLD


def load_raw_policy_blocks() -> dict[str, str]:
    text = (ROOT / "app/src/lib/db/docSeed.js").read_text(encoding="utf-8")
    blocks = re.split(r"\{\s*\n\s*id:\s*\"", text)
    out: dict[str, str] = {}
    for block in blocks[1:]:
        id_m = re.match(r'([^"]+)"', block)
        if id_m:
            out[id_m.group(1)] = block
    return out


def build_legal_sections(entry: dict) -> list[tuple[str, list[str]]]:
    eid = entry["id"]
    auto = expanded_legal_sections(entry)
    if eid not in LEGAL_HANDCRAFTED:
        return auto

    hand = LEGAL_HANDCRAFTED[eid]
    hand_titles = {s[0] for s in hand}
    # 概述 + 手工条文 + 自动生成的其余章节（去重）
    merged: list[tuple[str, list[str]]] = [auto[0], *hand]
    if entry.get("keyArticles"):
        merged.append(
            ("重点条款索引", [f"**{a}** — {expand_key_article(a, entry)}" for a in entry["keyArticles"]])
        )
    for sec in auto[1:]:
        if sec[0] not in hand_titles and sec[0] != "重点条款索引":
            merged.append(sec)
    return merged


def build_policy_sections(entry: dict, raw_block: str) -> list[tuple[str, list[str]]]:
    eid = entry["id"]
    auto = expanded_policy_sections(entry, raw_block)
    if eid not in POLICY_HANDCRAFTED:
        return auto

    hand = POLICY_HANDCRAFTED[eid]
    hand_titles = {s[0] for s in hand}
    merged = [*hand]
    for sec in auto:
        if sec[0] not in hand_titles:
            merged.append(sec)
    return merged


def expand_legal(force: bool = False) -> list[tuple[str, int, int]]:
    seed = {e["id"]: e for e in parse_legal_seed()}
    results: list[tuple[str, int, int]] = []

    for eid, entry in seed.items():
        path = resolve_legal_path(eid)
        if not path:
            continue
        if not path.is_file():
            continue
        old_len = len(path.read_text(encoding="utf-8"))
        if not force and old_len >= STUB_THRESHOLD:
            continue

        meta = f"{entry['revisedDate']} · {entry['issuer']} · {entry['status']}"
        content = law_doc(entry["title"], meta, build_legal_sections(entry))
        path.write_text(content, encoding="utf-8")
        results.append((eid, old_len, len(content)))
    return results


def expand_policy(force: bool = False) -> list[tuple[str, int, int]]:
    seed = {e["id"]: e for e in parse_doc_seed()}
    raw_blocks = load_raw_policy_blocks()
    results: list[tuple[str, int, int]] = []

    for eid, entry in seed.items():
        path = POLICY_CORPUS / f"{eid}.md"
        if not path.is_file():
            continue
        old_len = len(path.read_text(encoding="utf-8"))
        if not force and old_len >= STUB_THRESHOLD:
            continue

        meta = f"{entry['date']} · {entry['org']} · {entry['type']}"
        content = policy_doc(
            entry["title"], meta, build_policy_sections(entry, raw_blocks.get(eid, ""))
        )
        path.write_text(content, encoding="utf-8")
        results.append((eid, old_len, len(content)))
    return results


def main() -> int:
    force = "--force" in sys.argv
    legal = expand_legal(force=force)
    policy = expand_policy(force=force)

    print(f"Expanded {len(legal)} legal stubs, {len(policy)} policy stubs")
    for eid, old, new in legal[:8]:
        print(f"  legal {eid}: {old} -> {new}")
    if len(legal) > 8:
        print(f"  ... and {len(legal) - 8} more legal")
    for eid, old, new in policy[:8]:
        print(f"  policy {eid}: {old} -> {new}")
    if len(policy) > 8:
        print(f"  ... and {len(policy) - 8} more policy")
    return 0


if __name__ == "__main__":
    sys.exit(main())
