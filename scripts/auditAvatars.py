#!/usr/bin/env python3
"""Audit and clean avatarOverrides.js — remove unverified / non-person entries.

Usage:
  python3 scripts/auditAvatars.py              # local heuristics only (fast)
  python3 scripts/auditAvatars.py --verify-online --limit 80  # online verify curated

Outputs cleaned app/src/lib/db/avatarOverrides.js and audit report to stdout.
"""
from __future__ import annotations

import argparse
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB_DIR = ROOT / "app/src/lib/db"
OUT = DB_DIR / "avatarOverrides.js"

INSTITUTION_RE = re.compile(
    r"(大学|学院|研究院|研究所|研究中心|实验室|学校|公司|集团|委员会|基金会|博物馆|图书馆|医院|科学院$|中心$)"
)
DISAMBIG_RE = re.compile(r"消歧义|disambiguation", re.I)
BAD_URL_RE = [
    re.compile(p, re.I) for p in [
        r"landscape", r"scenery", r"building", r"architecture", r"anime", r"cartoon",
        r"logo", r"emblem", r"flag", r"\.svg(?:\?|$)",
        r"风景", r"建筑", r"卡通", r"动漫",
    ]
]
BAD_FILE_RE = BAD_URL_RE[:]
UA = "china2OS-avatar-audit/1.0 (research; local batch)"


def fetch_json(url: str, delay: float = 0.6) -> dict | None:
    time.sleep(delay)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  ! API: {e}")
        return None


def is_bad_url(url: str) -> bool:
    return any(r.search(url) for r in BAD_URL_RE)


def wiki_title_matches_person(wiki_title: str, person_name: str, name_en: str = "") -> bool:
    title = (wiki_title or "").strip()
    name = (person_name or "").strip()
    if not title or not name:
        return False
    if INSTITUTION_RE.search(title):
        return False
    base = re.sub(r"\s*\([^)]*\)\s*$", "", title).strip()
    if name_en:
        en = name_en.strip().lower()
        t = title.lower()
        if t == en or base.lower() == en:
            return True
        parts = en.split()
        if len(parts) >= 2 and all(p in t for p in parts):
            return True
    if re.search(r"[\u4e00-\u9fff]", name):
        if name in title or base in name:
            return True
        if len(name) >= 2 and name[0] in base and len(base) <= len(name) + 8:
            return True
        return False
    return name.lower() in title.lower() or base.lower() in name.lower()


def is_institution_name(name: str) -> bool:
    return bool(INSTITUTION_RE.search((name or "").strip()))


def parse_overrides_js() -> tuple[dict, dict, dict]:
    text = OUT.read_text(encoding="utf-8")
    stats_m = re.search(r"AVATAR_OVERRIDE_STATS\s*=\s*(\{[^;]+\})", text)
    stats = json.loads(stats_m.group(1)) if stats_m else {}

    def parse_map(var_name: str) -> dict:
        m = re.search(rf"export const {var_name}\s*=\s*\{{", text)
        if not m:
            return {}
        start = m.end()
        depth, i = 1, start
        while i < len(text) and depth:
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
            i += 1
        block = text[start : i - 1]
        result: dict = {}
        entry_re = re.compile(
            r"^\s*(?P<key>\"(?:\\.|[^\"])*\")\s*:\s*\{(?P<body>[^}]*)\}\s*,?\s*$",
            re.M,
        )
        for em in entry_re.finditer(block):
            key = json.loads(em.group("key"))
            body = em.group("body")
            ov: dict = {}
            for km in re.finditer(r"(\w+):\s*(\"(?:\\.|[^\"])*\")", body):
                ov[km.group(1)] = json.loads(km.group(2))
            result[key] = ov
        return result

    return parse_map("AVATAR_OVERRIDES_BY_ID"), parse_map("AVATAR_OVERRIDES_BY_NAME"), stats


def parse_figure_names() -> dict[str, str]:
    """id -> name from figure seed files (helper calls + object literals)."""
    names: dict[str, str] = {}
    id_re = re.compile(r"\bid:\s*['\"]([^'\"]+)['\"]")
    name_re = re.compile(r"\bname:\s*['\"]([^'\"]+)['\"]")
    helper_re = re.compile(
        r"(?:^|\n)\s*(?:B|T|O|H|R|A|C|U|F|fig|withProvenance)\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]",
    )
    extra_files = [
        "talentBulkExpansion2026.js", "militaryIntel2026.js",
    ]
    paths = sorted(DB_DIR.glob("figure*.js")) + [DB_DIR / f for f in extra_files if (DB_DIR / f).exists()]
    for path in paths:
        text = path.read_text(encoding="utf-8")
        for m in helper_re.finditer(text):
            fid, name = m.group(1), m.group(2)
            if 2 <= len(name) <= 24:
                names[fid] = name
        for block in re.finditer(
            r"\{[^{}]*\bid:\s*['\"][^'\"]+['\"][^{}]*\bname:\s*['\"][^'\"]+['\"][^{}]*\}",
            text, re.DOTALL,
        ):
            chunk = block.group(0)
            id_m, name_m = id_re.search(chunk), name_re.search(chunk)
            if id_m and name_m:
                names[id_m.group(1)] = name_m.group(1)
    return names


def verify_wiki_online(title: str, lang: str, person_name: str, name_en: str, delay: float) -> tuple[bool, str | None]:
    if not wiki_title_matches_person(title, person_name, name_en):
        return False, None
    params = urllib.parse.urlencode({
        "action": "query", "titles": title, "prop": "pageimages|pageprops|categories",
        "piprop": "thumbnail|name", "pithumbsize": "320", "cllimit": "15", "format": "json",
    })
    data = fetch_json(f"https://{lang}.wikipedia.org/w/api.php?{params}", delay)
    if not data:
        return False, None
    page = next(iter(data.get("query", {}).get("pages", {}).values()), {})
    if page.get("missing") is not None:
        return False, None
    if page.get("pageprops", {}).get("disambiguation") is not None:
        return False, None
    if DISAMBIG_RE.search(page.get("title", "")):
        return False, None
    for cat in page.get("categories", []):
        if DISAMBIG_RE.search(cat.get("title", "")):
            return False, None
    thumb = page.get("thumbnail", {}).get("source")
    fname = page.get("pageimage") or page.get("thumbnail", {}).get("name") or ""
    if not thumb or is_bad_url(thumb):
        return False, None
    if fname and any(r.search(fname) for r in BAD_FILE_RE):
        return False, None
    return True, thumb


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def write_output(by_id: dict, by_name: dict, stats: dict):
    lines = [
        "// ============================================================================",
        "// 人才头像 · 离线覆盖表（经 auditAvatars.py 核验清理）",
        "// 生成：scripts/enrichAvatars.py + scripts/auditAvatars.py — 勿手改",
        "// ============================================================================",
        "",
        f"export const AVATAR_OVERRIDE_STATS = {json.dumps(stats, ensure_ascii=False)};",
        "",
        "/** @type {Record<string, { avatarUrl?: string, wikiTitle?: string, wikiLang?: string, nameEn?: string, source?: string, verifyTier?: string }>} */",
        "export const AVATAR_OVERRIDES_BY_ID = {",
    ]
    for fid, ov in sorted(by_id.items()):
        parts = []
        for k in ("avatarUrl", "wikiTitle", "wikiLang", "nameEn", "source", "verifyTier"):
            if ov.get(k):
                parts.append(f"{k}: {js_str(ov[k])}")
        if parts:
            lines.append(f"  {js_str(fid)}: {{ {', '.join(parts)} }},")
    lines.append("};")
    lines.append("")
    lines.append("/** @type {Record<string, { avatarUrl?: string, wikiTitle?: string, wikiLang?: string, nameEn?: string, source?: string, verifyTier?: string }>} */")
    lines.append("export const AVATAR_OVERRIDES_BY_NAME = {")
    for name, ov in sorted(by_name.items()):
        parts = []
        for k in ("avatarUrl", "wikiTitle", "wikiLang", "nameEn", "source", "verifyTier"):
            if ov.get(k):
                parts.append(f"{k}: {js_str(ov[k])}")
        if parts:
            lines.append(f"  {js_str(name)}: {{ {', '.join(parts)} }},")
    lines.append("};")
    lines.append("")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def audit_entry(fid: str, ov: dict, person_name: str, args) -> tuple[dict | None, str]:
    """Returns (cleaned_entry_or_None, reason)."""
    name = person_name or fid
    name_en = ov.get("nameEn", "")

    if is_institution_name(name):
        return None, "institution_name"

    wiki = ov.get("wikiTitle", "")
    if wiki and is_institution_name(wiki):
        ov = {k: v for k, v in ov.items() if k not in ("wikiTitle", "wikiLang", "avatarUrl")}
        if not ov:
            return None, "institution_wiki"
        return ov, "stripped_institution_wiki"

    if wiki and not wiki_title_matches_person(wiki, name, name_en):
        ov = {k: v for k, v in ov.items() if k not in ("wikiTitle", "wikiLang", "avatarUrl")}
        if not ov:
            return None, "wiki_mismatch"
        return ov, "wiki_mismatch"

    url = ov.get("avatarUrl", "")
    if url and is_bad_url(url):
        ov = {k: v for k, v in ov.items() if k != "avatarUrl"}
        ov.pop("verifyTier", None)
        return (ov if ov else None), "bad_avatar_url"

    if ov.get("verifyTier") == "verified_portrait" and url and not is_bad_url(url):
        return ov, "verified_static"

    if args.verify_online and ov.get("source") == "curated" and wiki:
        ok, verified_url = verify_wiki_online(wiki, ov.get("wikiLang", "zh"), name, name_en, args.min_delay)
        if ok and verified_url:
            return {
                **ov,
                "avatarUrl": verified_url,
                "verifyTier": "verified_portrait",
                "source": "curated",
            }, "verified_online"
        ov = {k: v for k, v in ov.items() if k not in ("avatarUrl", "verifyTier")}
        return (ov if ov else None), "online_reject"

  # curated keeps wiki hint for runtime verified fetch; zh-default is metadata only
    if ov.get("source") == "curated" and wiki:
        return ov, "curated_pending"

    if ov.get("source") == "zh-default":
        # metadata hint only — no runtime fetch without verification
        return {k: v for k, v in ov.items() if k != "avatarUrl"}, "zh_hint"

    return ov, "kept"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify-online", action="store_true", help="online verify curated entries")
    ap.add_argument("--limit", type=int, default=80, help="max online verifications")
    ap.add_argument("--min-delay", type=float, default=0.75)
    args = ap.parse_args()

    if not OUT.exists():
        print(f"Missing {OUT} — run enrichAvatars.py first")
        return 1

    by_id, by_name, _old_stats = parse_overrides_js()
    id_to_name = parse_figure_names()

    stats = {
        "auditedAt": time.strftime("%Y-%m-%d"),
        "inputIdEntries": len(by_id),
        "inputNameEntries": len(by_name),
        "verified": 0,
        "curatedPending": 0,
        "zhHint": 0,
        "removed": 0,
        "stripped": 0,
        "badUrl": 0,
        "wikiMismatch": 0,
        "institution": 0,
        "onlineVerified": 0,
        "onlineRejected": 0,
        "outputIdEntries": 0,
        "withVerifiedPortrait": 0,
    }

    name_for_id = dict(id_to_name)
    for fid, ov in by_id.items():
        if fid not in name_for_id:
            for name, nov in by_name.items():
                if nov is ov or nov == ov:
                    name_for_id[fid] = name
                    break

    clean_id: dict = {}
    online_count = 0

    for fid, ov in sorted(by_id.items()):
        person_name = name_for_id.get(fid, "")
        if args.verify_online and ov.get("source") == "curated" and online_count >= args.limit:
            args.verify_online = False  # noqa: PLW2901 — stop after limit

        if args.verify_online and ov.get("source") == "curated":
            online_count += 1

        cleaned, reason = audit_entry(fid, dict(ov), person_name, args)
        if cleaned is None:
            stats["removed"] += 1
            if "institution" in reason:
                stats["institution"] += 1
            elif reason == "wiki_mismatch":
                stats["wikiMismatch"] += 1
            continue
        if reason != "kept" and reason != "verified_static" and reason != "curated_pending" and reason != "zh_hint":
            stats["stripped"] += 1
        if reason == "bad_avatar_url":
            stats["badUrl"] += 1
        if reason == "wiki_mismatch":
            stats["wikiMismatch"] += 1
        if reason == "verified_online":
            stats["onlineVerified"] += 1
        if reason == "online_reject":
            stats["onlineRejected"] += 1
        if reason == "verified_static" or reason == "verified_online":
            stats["verified"] += 1
        if reason == "curated_pending":
            stats["curatedPending"] += 1
        if reason == "zh_hint":
            stats["zhHint"] += 1
        if cleaned.get("verifyTier") == "verified_portrait":
            stats["withVerifiedPortrait"] += 1
        clean_id[fid] = cleaned

    clean_name: dict = {}
    for name, ov in by_name.items():
        fid_match = next((fid for fid, n in id_to_name.items() if n == name), None)
        if fid_match and fid_match in clean_id:
            clean_name[name] = clean_id[fid_match]
        elif not is_institution_name(name):
            cleaned, reason = audit_entry(name, dict(ov), name, args)
            if cleaned:
                clean_name[name] = cleaned

    stats["outputIdEntries"] = len(clean_id)
    stats["outputNameEntries"] = len(clean_name)
    write_output(clean_id, clean_name, stats)

    print("\n=== Avatar Audit Report ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print(f"\nWrote {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
