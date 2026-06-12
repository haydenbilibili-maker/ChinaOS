#!/usr/bin/env python3
"""Fetch verbatim official legal/policy text into local corpus markdown files.

Primary source: 国家法律法规数据库 (flk.npc.gov.cn)
  - search: POST /law-search/search/list
  - detail: GET  /law-search/search/flfgDetails?bbbs=...
  - download: GET /law-search/download/mobile?format=docx&bbbs=...

Policy fallback: 中国政府网 (gov.cn) HTML pages where configured.

Preserves corpus file IDs (paths) used by legalStatuteSeed / docSeed linkage.
"""

from __future__ import annotations

import argparse
import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from dataclasses import dataclass
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE_DIR = ROOT / "scripts" / ".cache" / "official-corpus"
LEGAL_CORPUS = ROOT / "app" / "public" / "legal-corpus"
POLICY_CORPUS = ROOT / "app" / "public" / "policy-corpus" / "policies"

NPC_BASE = "https://flk.npc.gov.cn"
NPC_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; china2OS-corpus/1.0)",
    "Referer": f"{NPC_BASE}/",
    "Accept": "application/json",
}

LEGAL_ALIASES = {"law-pipl": "laws/law-personal-info.md"}
RATE_SEC = 1.0

CHAPTER_RE = re.compile(r"^第[一二三四五六七八九十百千零〇\d]+章")
SECTION_RE = re.compile(r"^第[一二三四五六七八九十百千零〇\d]+节")
PART_RE = re.compile(r"^第[一二三四五六七八九十百千零〇\d]+编")
ARTICLE_RE = re.compile(r"^(第[一二三四五六七八九十百千零〇\d]+条)(.*)$")
HTML_TAG_RE = re.compile(r"<[^>]+>")


@dataclass
class FetchResult:
    doc_id: str
    ok: bool
    chars: int = 0
    source_url: str = ""
    message: str = ""
    path: str = ""


@dataclass
class LegalTarget:
    doc_id: str
    search_title: str
    rel_path: str | None = None
    title_must: str | None = None
    title_exclude: str | None = None
    bbbs: str | None = None


@dataclass
class PolicyTarget:
    doc_id: str
    title: str
    source_url: str
    rel_path: str | None = None


LEGAL_TARGETS: list[LegalTarget] = [
    LegalTarget("law-constitution", "中华人民共和国宪法", title_must="2018年修正文本"),
    LegalTarget(
        "law-civil-code",
        "中华人民共和国民法典",
        title_must="中华人民共和国民法典",
        title_exclude="决定",
    ),
    LegalTarget("law-criminal", "中华人民共和国刑法", title_must="中华人民共和国刑法"),
    LegalTarget("law-legislation", "中华人民共和国立法法"),
    LegalTarget(
        "law-company",
        "中华人民共和国公司法",
        title_must="中华人民共和国公司法",
        title_exclude="国务院",
    ),
    LegalTarget("law-admin-litigation", "中华人民共和国行政诉讼法"),
    LegalTarget("law-criminal-procedure", "中华人民共和国刑事诉讼法"),
    LegalTarget("law-securities", "中华人民共和国证券法"),
    LegalTarget("law-hk-security", "中华人民共和国香港特别行政区维护国家安全法"),
    LegalTarget("law-anti-monopoly", "中华人民共和国反垄断法"),
    LegalTarget("law-patent", "中华人民共和国专利法"),
    LegalTarget("law-copyright", "中华人民共和国著作权法"),
    LegalTarget("law-trademark", "中华人民共和国商标法"),
    LegalTarget("law-air", "中华人民共和国大气污染防治法"),
    LegalTarget("law-enterprise-bankruptcy", "中华人民共和国企业破产法"),
]

POLICY_TARGETS: list[PolicyTarget] = [
    PolicyTarget(
        "law-private-2025",
        "中华人民共和国民营经济促进法",
        f"{NPC_BASE}/detail.html",
    ),
    PolicyTarget(
        "gwr-2024",
        "政府工作报告",
        "https://www.gov.cn/zhuanti/2024qglh/",
    ),
    PolicyTarget(
        "gwr-2025",
        "政府工作报告",
        "https://www.gov.cn/zhuanti/2025qglh/",
    ),
]


def legal_rel_path(entry_id: str) -> str | None:
    if entry_id in LEGAL_ALIASES:
        return LEGAL_ALIASES[entry_id]
    if entry_id.startswith("law-"):
        return f"laws/{entry_id}.md"
    if entry_id.startswith("reg-"):
        return f"regulations/{entry_id}.md"
    if entry_id.startswith("ji-"):
        return f"interpretations/{entry_id}.md"
    return None


def http_json(method: str, url: str, payload: dict | None = None, headers: dict | None = None) -> dict:
    hdrs = dict(headers or NPC_HEADERS)
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        hdrs.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, method=method, headers=hdrs)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_bytes(url: str, headers: dict | None = None) -> bytes:
    hdrs = dict(headers or NPC_HEADERS)
    hdrs.setdefault("User-Agent", NPC_HEADERS["User-Agent"])
    req = urllib.request.Request(url, headers=hdrs)
    opener = urllib.request.build_opener(urllib.request.HTTPRedirectHandler)
    with opener.open(req, timeout=120) as resp:
        return resp.read()


def npc_search(title: str) -> list[dict]:
    payload = {
        "searchRange": 1,
        "sxrq": [],
        "gbrq": [],
        "searchType": 1,
        "sxx": [3],
        "gbrqYear": [],
        "flfgCodeId": [],
        "zdjgCodeId": [],
        "searchContent": title,
        "page": 1,
        "size": 20,
    }
    data = http_json("POST", f"{NPC_BASE}/law-search/search/list", payload)
    rows = data.get("rows") or []
    for row in rows:
        row["title_plain"] = HTML_TAG_RE.sub("", row.get("title") or "")
    return rows


def pick_row(rows: list[dict], target: LegalTarget) -> dict | None:
    if target.bbbs:
        for row in rows:
            if row.get("bbbs") == target.bbbs:
                return row
    for row in rows:
        t = row.get("title_plain") or ""
        if target.title_must and target.title_must not in t:
            continue
        if target.title_exclude and target.title_exclude in t:
            continue
        if target.search_title in t or t.startswith(target.search_title):
            return row
    return rows[0] if rows else None


def npc_detail(bbbs: str) -> dict:
    qs = urllib.parse.urlencode({"bbbs": bbbs})
    return http_json("GET", f"{NPC_BASE}/law-search/search/flfgDetails?{qs}")


def download_docx(bbbs: str, cache_key: str) -> bytes:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"{cache_key}.docx"
    if cache_path.is_file():
        return cache_path.read_bytes()
    qs = urllib.parse.urlencode({"format": "docx", "bbbs": bbbs, "fileId": ""})
    raw = http_bytes(f"{NPC_BASE}/law-search/download/mobile?{qs}")
    cache_path.write_bytes(raw)
    return raw


def docx_to_text(data: bytes) -> str:
    zf = zipfile.ZipFile(io.BytesIO(data))
    root = ET.fromstring(zf.read("word/document.xml"))
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    lines: list[str] = []
    for para in root.findall(".//w:p", ns):
        parts = [t.text for t in para.findall(".//w:t", ns) if t.text]
        line = "".join(parts).strip()
        if line:
            lines.append(line)
    return "\n".join(lines)


def split_article_line(line: str) -> tuple[str, str] | None:
    m = ARTICLE_RE.match(line)
    if not m:
        return None
    body = (m.group(2) or "").strip()
    body = body.lstrip("　 ").strip()
    return m.group(1), body


def text_to_markdown(title: str, meta_line: str, body: str) -> str:
    out: list[str] = [f"# {title}", ""]
    if meta_line:
        out.append(f"> {meta_line}")
        out.append("")

    skip_title = title.strip()
    in_toc = False
    toc_done = False
    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line == skip_title:
            continue
        if line in ("目　　录", "目录"):
            in_toc = True
            out.extend(["## 目录", ""])
            continue
        if in_toc and not toc_done:
            if PART_RE.match(line) or CHAPTER_RE.match(line) or line in ("序　　言", "序言"):
                in_toc = False
                toc_done = True
            else:
                out.append(f"- {line}")
                continue
        if line in ("序　　言", "序言"):
            out.extend(["## 序言", ""])
            continue
        if PART_RE.match(line) or CHAPTER_RE.match(line):
            out.extend(["", f"## {line}", ""])
            continue
        if SECTION_RE.match(line):
            out.extend(["", f"### {line}", ""])
            continue
        art = split_article_line(line)
        if art:
            label, text = art
            out.append(f"### {label}")
            out.append("")
            if text:
                out.append(text)
                out.append("")
            continue
        if line.startswith("（") and out and out[-1] != "":
            out.append(line)
            out.append("")
            continue
        out.append(line)
        out.append("")

    while out and out[-1] == "":
        out.pop()
    return "\n".join(out) + "\n"


def build_frontmatter(
    *,
    doc_id: str,
    source_url: str,
    fetched_at: str,
    bbbs: str | None = None,
    extra: dict | None = None,
) -> str:
    lines = [
        "---",
        f"corpusSource: official",
        f"corpusTier: official",
        f"docId: {doc_id}",
        f"sourceUrl: {source_url}",
        f"fetchedAt: {fetched_at}",
    ]
    if bbbs:
        lines.append(f"bbbs: {bbbs}")
    if extra:
        for k, v in extra.items():
            lines.append(f"{k}: {v}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def write_legal_markdown(
    path: Path,
    *,
    doc_id: str,
    title: str,
    meta_line: str,
    body_text: str,
    source_url: str,
    bbbs: str,
) -> int:
    fetched_at = date.today().isoformat()
    md_body = text_to_markdown(title, meta_line, body_text)
    fm = build_frontmatter(
        doc_id=doc_id,
        source_url=source_url,
        fetched_at=fetched_at,
        bbbs=bbbs,
    )
    footer = (
        "\n---\n\n"
        f"*来源：[国家法律法规数据库]({source_url}) · 抓取日期 {fetched_at} · "
        "官方法律电子文本。*\n\n"
        "> **免责声明**：本文件仅供研究学习，不构成法律意见；引用请以官方公布文本为准。\n"
    )
    content = fm + md_body + footer
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return len(content)


def fetch_legal(target: LegalTarget, *, use_cache: bool = True) -> FetchResult:
    rel = target.rel_path or legal_rel_path(target.doc_id)
    if not rel:
        return FetchResult(target.doc_id, False, message="无法解析 corpus 路径")

    out_path = LEGAL_CORPUS / rel
    try:
        rows = npc_search(target.search_title)
        time.sleep(RATE_SEC)
        row = pick_row(rows, target)
        if not row:
            return FetchResult(target.doc_id, False, message="搜索无结果", path=rel)

        bbbs = row["bbbs"]
        title_plain = row.get("title_plain") or target.search_title
        source_url = f"{NPC_BASE}/detail.html?{bbbs}"

        if not use_cache:
            cache_file = CACHE_DIR / f"{target.doc_id}.docx"
            if cache_file.is_file():
                cache_file.unlink()

        docx = download_docx(bbbs, target.doc_id)
        time.sleep(RATE_SEC)
        text = docx_to_text(docx)
        if len(text) < 500:
            return FetchResult(target.doc_id, False, message="下载文本过短", path=rel)

        meta_bits = []
        if row.get("gbrq"):
            meta_bits.append(row["gbrq"])
        if row.get("zdjgName"):
            meta_bits.append(row["zdjgName"])
        if row.get("sxrq"):
            meta_bits.append(f"施行 {row['sxrq']}")
        meta_line = " · ".join(meta_bits)

        display_title = target.search_title
        if "修正案" in title_plain and "宪法" in title_plain:
            display_title = title_plain

        chars = write_legal_markdown(
            out_path,
            doc_id=target.doc_id,
            title=display_title,
            meta_line=meta_line,
            body_text=text,
            source_url=source_url,
            bbbs=bbbs,
        )
        return FetchResult(target.doc_id, True, chars=chars, source_url=source_url, path=rel)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError, KeyError) as exc:
        return FetchResult(target.doc_id, False, message=str(exc), path=rel)


def _html_paragraphs(chunk: str) -> list[str]:
    chunk = re.sub(r"<script[^>]*>.*?</script>", "", chunk, flags=re.S | re.I)
    chunk = re.sub(r"<style[^>]*>.*?</style>", "", chunk, flags=re.S | re.I)
    lines: list[str] = []
    for p in re.findall(r"<p[^>]*>(.*?)</p>", chunk, re.S | re.I):
        t = HTML_TAG_RE.sub("", p)
        t = re.sub(r"\s+", " ", t).strip()
        if t:
            lines.append(t)
    return lines


def extract_govcn_html(html: str) -> str:
    patterns = (
        r'<div[^>]*class="pages_content"[^>]*>(.*?)</div>\s*<div[^>]*class="editor',
        r'<div[^>]*class="[^"]*TRS_Editor[^"]*"[^>]*>(.*?)</div>\s*</div>',
        r'<div[^>]*class="article"[^>]*>(.*)',
        r'<div[^>]*id="UCAP-CONTENT"[^>]*>(.*?)</div>',
    )
    for pattern in patterns:
        m = re.search(pattern, html, re.S | re.I)
        if not m:
            continue
        chunk = m.group(1)
        if "class=\"article\"" in pattern:
            for stop in ("<div class=\"footer", "<div class=\"foot", "<div id=\"footer"):
                stop_at = chunk.lower().find(stop)
                if stop_at > 0:
                    chunk = chunk[:stop_at]
                    break
        lines = _html_paragraphs(chunk)
        if len("".join(lines)) >= 500:
            return "\n\n".join(lines)
    return ""


def policy_rel_path(target: PolicyTarget) -> str:
    if target.rel_path:
        return target.rel_path.removeprefix("policies/")
    return f"{target.doc_id}.md"


def fetch_policy_npc(target: PolicyTarget) -> FetchResult:
    rel = policy_rel_path(target)
    out_path = POLICY_CORPUS / rel
    lt = LegalTarget(target.doc_id, target.title, title_must=target.title)
    try:
        rows = npc_search(lt.search_title)
        time.sleep(RATE_SEC)
        row = pick_row(rows, lt)
        if not row:
            return FetchResult(target.doc_id, False, message="搜索无结果", path=f"policies/{rel}")
        bbbs = row["bbbs"]
        source_url = f"{NPC_BASE}/detail.html?{bbbs}"
        docx = download_docx(bbbs, f"policy-{target.doc_id}")
        time.sleep(RATE_SEC)
        text = docx_to_text(docx)
        if len(text) < 500:
            return FetchResult(target.doc_id, False, message="下载文本过短", path=f"policies/{rel}")
        meta_bits = [row.get("gbrq", ""), row.get("zdjgName", ""), row.get("sxrq", "")]
        meta_line = " · ".join(x for x in meta_bits if x)
        chars = write_legal_markdown(
            out_path,
            doc_id=target.doc_id,
            title=target.title,
            meta_line=meta_line,
            body_text=text,
            source_url=source_url,
            bbbs=bbbs,
        )
        return FetchResult(target.doc_id, True, chars=chars, source_url=source_url, path=f"policies/{rel}")
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError, KeyError) as exc:
        return FetchResult(target.doc_id, False, message=str(exc), path=f"policies/{rel}")


def fetch_policy_govcn(target: PolicyTarget) -> FetchResult:
    rel = policy_rel_path(target)
    out_path = POLICY_CORPUS / rel
    try:
        html = http_bytes(target.source_url, headers={"User-Agent": NPC_HEADERS["User-Agent"]}).decode(
            "utf-8", "ignore"
        )
        text = extract_govcn_html(html)
        if len(text) < 500:
            return FetchResult(target.doc_id, False, message="gov.cn 页面无正文或 URL 失效", path=rel)

        fetched_at = date.today().isoformat()
        fm = build_frontmatter(doc_id=target.doc_id, source_url=target.source_url, fetched_at=fetched_at)
        body = f"# {target.title}\n\n> {target.source_url}\n\n"
        for para in text.split("\n\n"):
            para = para.strip()
            if not para:
                continue
            if re.match(r"^[一二三四五六七八九十]+、", para):
                body += f"\n## {para}\n"
            else:
                body += f"\n{para}\n"
        footer = (
            "\n---\n\n"
            f"*来源：[中国政府网]({target.source_url}) · 抓取日期 {fetched_at} · 官方发布文本。*\n"
        )
        content = fm + body + footer
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(content, encoding="utf-8")
        return FetchResult(
            target.doc_id, True, chars=len(content), source_url=target.source_url, path=f"policies/{rel}"
        )
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return FetchResult(target.doc_id, False, message=str(exc), path=rel)


def fetch_policy(target: PolicyTarget) -> FetchResult:
    if target.doc_id.startswith("law-") or "法" in target.title:
        return fetch_policy_npc(target)
    return fetch_policy_govcn(target)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Fetch official corpus text into app/public/*-corpus/")
    p.add_argument("--legal-only", action="store_true")
    p.add_argument("--policy-only", action="store_true")
    p.add_argument("--no-cache", action="store_true", help="Ignore cached docx files")
    p.add_argument("--ids", nargs="*", help="Subset of doc ids to fetch")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    use_cache = not args.no_cache
    id_filter = set(args.ids) if args.ids else None

    results: list[FetchResult] = []

    if not args.policy_only:
        for target in LEGAL_TARGETS:
            if id_filter and target.doc_id not in id_filter:
                continue
            print(f"legal {target.doc_id} ...", flush=True)
            results.append(fetch_legal(target, use_cache=use_cache))

    if not args.legal_only:
        for target in POLICY_TARGETS:
            if id_filter and target.doc_id not in id_filter:
                continue
            print(f"policy {target.doc_id} ...", flush=True)
            results.append(fetch_policy(target))

    ok = [r for r in results if r.ok]
    fail = [r for r in results if not r.ok]

    print("\n=== 成功 ===")
    for r in ok:
        print(f"  {r.doc_id}: {r.chars:,} chars · {r.path} · {r.source_url}")

    print("\n=== 失败 / 阻断 ===")
    for r in fail:
        print(f"  {r.doc_id}: {r.message} · {r.path}")

    print(f"\n合计: {len(ok)} 成功, {len(fail)} 失败")
    return 0 if not fail else 1


if __name__ == "__main__":
    sys.exit(main())
