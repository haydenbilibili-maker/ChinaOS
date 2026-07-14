#!/usr/bin/env python3
"""Batch-resolve avatar metadata/URLs for talent seed figures.

Outputs: app/src/lib/db/avatarOverrides.js

Modes:
  python3 scripts/enrichAvatars.py              # meta (wikiTitle) + optional URL fetch
  python3 scripts/enrichAvatars.py --fetch-urls # also resolve avatarUrl (slow, rate-limited)
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

FIGURE_FILES = [
    "figureAntiCorruption2026.js",
    "figureDissident2026.js",
    "figureTaiwanPolitical2026.js",
    "figureHigherEducation2026.js",
    "figureThinkTank2026.js",
    "figureResearchInstitute2026.js",
    "figureAcademician2026.js",
    "figureCulturalElite2026.js",
    "figureBusinessElite2026.js",
    "figureOverseasTalent2026.js",
    "talentBulkExpansion2026.js",
    "figureExpansion2026.js",
    "figureCentral2026.js",
    "figureCentralExtended2026.js",
    "figureProvincial2026.js",
    "figureProvincialExtended2026.js",
    "figureProvincialStanding2026.js",
    "figureMunicipal2026.js",
    "figurePrefectureCity2026.js",
    "figureOrg2026.js",
    "figureOrgTier22026.js",
    "figureMilitary2026.js",
    "militaryIntel2026.js",
]

CURATED: dict[str, dict] = {
    "习近平": {"wikiTitle": "习近平", "wikiLang": "zh"},
    "李强": {"wikiTitle": "李强 (1959年)", "wikiLang": "zh"},
    "赵乐际": {"wikiTitle": "赵乐际", "wikiLang": "zh"},
    "王沪宁": {"wikiTitle": "王沪宁", "wikiLang": "zh"},
    "蔡奇": {"wikiTitle": "蔡奇", "wikiLang": "zh"},
    "丁薛祥": {"wikiTitle": "丁薛祥", "wikiLang": "zh"},
    "李希": {"wikiTitle": "李希", "wikiLang": "zh"},
    "马英九": {"wikiTitle": "马英九", "wikiLang": "zh"},
    "赖清德": {"wikiTitle": "赖清德", "wikiLang": "zh"},
    "蔡英文": {"wikiTitle": "蔡英文", "wikiLang": "zh"},
    "朱立伦": {"wikiTitle": "朱立伦", "wikiLang": "zh"},
    "柯文哲": {"wikiTitle": "柯文哲", "wikiLang": "zh"},
    "马云": {"wikiTitle": "马云", "wikiLang": "zh"},
    "马化腾": {"wikiTitle": "马化腾", "wikiLang": "zh"},
    "任正非": {"wikiTitle": "任正非", "wikiLang": "zh"},
    "雷军": {"wikiTitle": "雷军", "wikiLang": "zh"},
    "李彦宏": {"wikiTitle": "李彦宏", "wikiLang": "zh"},
    "张一鸣": {"wikiTitle": "张一鸣", "wikiLang": "zh"},
    "王兴": {"wikiTitle": "王兴 (企业家)", "wikiLang": "zh"},
    "刘强东": {"wikiTitle": "刘强东", "wikiLang": "zh"},
    "黄仁勋": {"nameEn": "Jensen Huang", "wikiTitle": "Jensen Huang", "wikiLang": "en"},
    "苏姿丰": {"nameEn": "Lisa Su", "wikiTitle": "Lisa Su", "wikiLang": "en"},
    "姚期智": {"nameEn": "Andrew Yao", "wikiTitle": "Andrew Yao", "wikiLang": "en"},
    "李飞飞": {"nameEn": "Fei-Fei Li", "wikiTitle": "Fei-Fei Li", "wikiLang": "en"},
    "李安": {"nameEn": "Ang Lee", "wikiTitle": "Ang Lee", "wikiLang": "en"},
    "莫言": {"wikiTitle": "莫言", "wikiLang": "zh"},
    "余华": {"wikiTitle": "余华", "wikiLang": "zh"},
    "刘慈欣": {"wikiTitle": "刘慈欣", "wikiLang": "zh"},
    "屠呦呦": {"wikiTitle": "屠呦呦", "wikiLang": "zh"},
    "袁隆平": {"wikiTitle": "袁隆平", "wikiLang": "zh"},
    "钟南山": {"wikiTitle": "钟南山", "wikiLang": "zh"},
    "张艺谋": {"wikiTitle": "张艺谋", "wikiLang": "zh"},
    "成龙": {"wikiTitle": "成龙", "wikiLang": "zh"},
    "周杰伦": {"wikiTitle": "周杰伦", "wikiLang": "zh"},
    "刘亦菲": {"wikiTitle": "刘亦菲", "wikiLang": "zh"},
    "刘翔": {"wikiTitle": "刘翔", "wikiLang": "zh"},
    "李娜": {"wikiTitle": "李娜 (网球)", "wikiLang": "zh"},
    "姚明": {"wikiTitle": "姚明", "wikiLang": "zh"},
    "郎平": {"wikiTitle": "郎平", "wikiLang": "zh"},
    "施一公": {"wikiTitle": "施一公", "wikiLang": "zh"},
    "饶毅": {"wikiTitle": "饶毅", "wikiLang": "zh"},
    "丘成桐": {"wikiTitle": "丘成桐", "wikiLang": "zh"},
    "刘晓波": {"wikiTitle": "刘晓波", "wikiLang": "zh"},
    "王丹": {"wikiTitle": "王丹 (1969年)", "wikiLang": "zh"},
    "魏京生": {"wikiTitle": "魏京生", "wikiLang": "zh"},
    "达赖喇嘛": {"wikiTitle": "第十四世达赖喇嘛", "wikiLang": "zh"},
}

INSTITUTION_RE = re.compile(
    r"(大学|学院|研究院|研究所|研究中心|实验室|学校|公司|集团|委员会|基金会|博物馆|图书馆|医院|科学院$|中心$)"
)

UA = "china2OS-avatar-enrich/1.1 (research; local batch)"


def is_chinese_name(name: str) -> bool:
    return bool(name) and not re.search(r"[A-Za-z]", name)


def is_anonymized(name: str) -> bool:
    """Skip military/placeholder entries that have no public wiki photo."""
    return bool(re.search(r"某|某某|（.*）", name)) or name.endswith("基地")


def fetch_json(url: str, delay: float, retries: int = 4) -> dict | None:
    for attempt in range(retries):
        time.sleep(delay * (1.5 ** attempt))
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            err = str(e)
            if "429" in err and attempt < retries - 1:
                time.sleep(2 ** (attempt + 2))
                continue
            if attempt == retries - 1:
                print(f"  ! {err}")
    return None


def wiki_thumb(title: str, lang: str, delay: float) -> str | None:
    params = urllib.parse.urlencode({
        "action": "query", "titles": title, "prop": "pageimages",
        "piprop": "thumbnail", "pithumbsize": "320", "format": "json",
    })
    data = fetch_json(f"https://{lang}.wikipedia.org/w/api.php?{params}", delay)
    if not data:
        return None
    for page in data.get("query", {}).get("pages", {}).values():
        if page.get("missing") is not None:
            continue
        return page.get("thumbnail", {}).get("source")
    return None


def parse_figures() -> list[dict]:
    figures: dict[str, dict] = {}
    id_re = re.compile(r"\bid:\s*['\"]([^'\"]+)['\"]")
    name_re = re.compile(r"\bname:\s*['\"]([^'\"]+)['\"]")
    name_en_re = re.compile(r"\bnameEn:\s*['\"]([^'\"]+)['\"]")

    for fname in FIGURE_FILES:
        path = DB_DIR / fname
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for block in re.finditer(
            r"\{[^{}]*\bid:\s*['\"][^'\"]+['\"][^{}]*\bname:\s*['\"][^'\"]+['\"][^{}]*\}",
            text, re.DOTALL,
        ):
            chunk = block.group(0)
            id_m, name_m = id_re.search(chunk), name_re.search(chunk)
            if not id_m or not name_m:
                continue
            fid, name = id_m.group(1), name_m.group(1)
            if len(name) < 2 or len(name) > 24:
                continue
            en_m = name_en_re.search(chunk)
            figures[fid] = {"id": fid, "name": name, "nameEn": en_m.group(1) if en_m else ""}
        for m in re.finditer(
            r"(?:^|\n)\s*(?:B|T|O|H|R|A|C|U|fig|withProvenance)\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]",
            text,
        ):
            fid, name = m.group(1), m.group(2)
            if len(name) < 2 or len(name) > 24:
                continue
            figures.setdefault(fid, {"id": fid, "name": name, "nameEn": ""})
    return list(figures.values())


def is_institution(name: str) -> bool:
    return bool(INSTITUTION_RE.search((name or "").strip()))


def meta_for(entry: dict) -> dict:
    name = entry["name"]
    if is_anonymized(name) or is_institution(name):
        return {}
    if name in CURATED:
        return {**CURATED[name], "source": "curated"}
    name_en = entry.get("nameEn") or ""
    if name_en:
        return {"nameEn": name_en, "wikiTitle": name_en, "wikiLang": "en", "source": "nameEn"}
    if is_chinese_name(name):
        return {"wikiTitle": name, "wikiLang": "zh", "source": "zh-default"}
    return {}


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def write_output(by_id: dict, by_name: dict, stats: dict):
    lines = [
        "// ============================================================================",
        "// 人才头像 · 离线覆盖表（Wikipedia / Wikidata 批量解析）",
        "// 生成：scripts/enrichAvatars.py — 勿手改，重新运行脚本更新",
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fetch-urls", action="store_true", help="also fetch avatarUrl (slow)")
    ap.add_argument("--url-limit", type=int, default=120, help="max URL fetches when --fetch-urls")
    ap.add_argument("--min-delay", type=float, default=0.85, help="base delay between API calls")
    args = ap.parse_args()

    figures = parse_figures()
    print(f"Parsed {len(figures)} unique figure ids")

    by_id: dict[str, dict] = {}
    by_name: dict[str, dict] = {}
    url_resolved = 0
    url_attempted = 0

    for entry in figures:
        meta = meta_for(entry)
        if not meta:
            continue
        by_id[entry["id"]] = meta
        by_name[entry["name"]] = meta

    if args.fetch_urls:
        priority = sorted(
            figures,
            key=lambda f: (0 if f["name"] in CURATED else 1, f["name"]),
        )
        for entry in priority:
            if url_attempted >= args.url_limit:
                break
            meta = by_id.get(entry["id"], {})
            if meta.get("avatarUrl"):
                continue
            url_attempted += 1
            title = meta.get("wikiTitle") or entry["name"]
            lang = meta.get("wikiLang") or "zh"
            print(f"[url {url_attempted}/{args.url_limit}] {entry['name']}…", end=" ", flush=True)
            url = wiki_thumb(title, lang, args.min_delay)
            if url:
                meta = {**meta, "avatarUrl": url, "source": meta.get("source", "meta") + "+url"}
                by_id[entry["id"]] = meta
                by_name[entry["name"]] = meta
                url_resolved += 1
                print("OK")
            else:
                print("miss")

    with_url = sum(1 for v in by_id.values() if v.get("avatarUrl"))
    stats = {
        "generatedAt": time.strftime("%Y-%m-%d"),
        "parsed": len(figures),
        "metaEntries": len(by_id),
        "withAvatarUrl": with_url,
        "urlAttempted": url_attempted,
        "urlResolved": url_resolved,
    }
    write_output(by_id, by_name, stats)
    print(f"\nWrote {OUT} — {len(by_id)} meta entries, {with_url} with avatarUrl")


if __name__ == "__main__":
    main()
