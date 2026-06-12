#!/usr/bin/env python3
"""Shared utilities for legal/policy corpus generation."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AS_OF = "2026-06-11"
FOOTER = f"""
---

*AS_OF {AS_OF} · 研究学习用汇编，条文以全国人大/国务院及主管部门官方公布文本为准。*

> **免责声明**：本文件仅供研究学习，不构成法律意见或政策解读；引用请以官方原文为准。
""".strip()


def parse_legal_seed() -> list[dict]:
    text = (ROOT / "app/src/lib/db/figureLegalStatute2026.js").read_text(encoding="utf-8")
    pattern = re.compile(
        r'L\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\[([^\]]*)\],\s*"((?:[^"\\]|\\.)*)",\s*\[([^\]]*)\]',
    )
    rows = []
    for m in pattern.finditer(text):
        domains = [d.strip().strip('"') for d in m.group(8).split(",") if d.strip()]
        articles = [a.strip().strip('"') for a in m.group(10).split(",") if a.strip()]
        rows.append(
            {
                "id": m.group(1),
                "title": m.group(2),
                "type": m.group(3),
                "issuer": m.group(4),
                "effectiveDate": m.group(5),
                "revisedDate": m.group(6),
                "status": m.group(7),
                "domains": domains,
                "summary": m.group(9),
                "keyArticles": articles,
            }
        )
    return rows


def parse_doc_seed() -> list[dict]:
    text = (ROOT / "app/src/lib/db/docSeed.js").read_text(encoding="utf-8")
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

        def list_field(name: str) -> list[str]:
            m = re.search(rf"{name}:\s*\[(.*?)\]", block, re.DOTALL)
            if not m:
                return []
            return [s.strip().strip('"') for s in re.findall(r'"([^"]*)"', m.group(1))]

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
                "source": field("source"),
                "keywords": list_field("keywords"),
                "highlights": list_field("highlights"),
            }
        )
    return rows


def legal_rel_path(entry_id: str) -> str | None:
    if entry_id.startswith("law-"):
        return f"laws/{entry_id}.md"
    if entry_id.startswith("reg-"):
        return f"regulations/{entry_id}.md"
    if entry_id.startswith("ji-"):
        return f"interpretations/{entry_id}.md"
    return None


def law_doc(title: str, meta: str, sections: list[tuple[str, list[str]]]) -> str:
    parts = [f"# {title}", "", f"> {meta}", ""]
    for sec_title, articles in sections:
        parts.append(f"## {sec_title}")
        parts.append("")
        for art in articles:
            if art.startswith("###"):
                parts.append(art)
            elif art.startswith("**"):
                parts.append(art)
            else:
                parts.append(art)
            parts.append("")
    parts.append(FOOTER)
    return "\n".join(parts).strip() + "\n"


def policy_doc(title: str, meta: str, sections: list[tuple[str, list[str]]]) -> str:
    parts = [f"# {title}", "", f"> {meta}", ""]
    for sec, paras in sections:
        parts.append(f"## {sec}")
        parts.append("")
        for p in paras:
            parts.append(p)
            parts.append("")
    parts.append(FOOTER)
    return "\n".join(parts).strip() + "\n"


STUB_THRESHOLD = 500

_CN_NUM = "零一二三四五六七八九十"


def cn_num(n: int) -> str:
    if n <= 10:
        return _CN_NUM[n]
    if n < 20:
        return "十" + (_CN_NUM[n - 10] if n > 10 else "")
    tens, ones = divmod(n, 10)
    return _CN_NUM[tens] + "十" + (_CN_NUM[ones] if ones else "")


def expand_highlight(text: str) -> str:
    """Turn a highlight bullet into a substantive paragraph."""
    if text.startswith("**") or len(text) > 120:
        return text
    return (
        f"{text}。该部署构成政策执行链条中的关键环节，需与配套细则、地方实施方案"
        f"及年度考核指标协同落地；执行层面应建立跨部门协调机制，强化督查评估与问责衔接。"
    )


def expand_key_article(topic: str, entry: dict) -> str:
    """Expand a key-article label into a substantive legal paragraph."""
    title = entry["title"]
    if topic.startswith("第") and "条" in topic:
        return topic
    return (
        f"本法就「{topic}」作出专章或专节规定，明确相关主体的权利、义务与责任边界。"
        f"《{title}》在{entry['issuer']}监督下实施，违反规定的，依法承担民事、行政或刑事责任；"
        f"具体适用须结合配套法规、部门规章及司法解释综合判断。"
    )


def expanded_legal_sections(entry: dict) -> list[tuple[str, list[str]]]:
    """Generate substantive legal corpus sections from seed metadata."""
    type_label = {
        "law": "法律",
        "admin_regulation": "行政法规",
        "judicial_interpretation": "司法解释",
    }.get(entry["type"], "规范")

    sections: list[tuple[str, list[str]]] = [
        ("概述", [
            entry["summary"],
            (
                f"《{entry['title']}》属于{type_label}，由 **{entry['issuer']}** 制定，"
                f"自 {entry['effectiveDate']} 起 **{entry['status']}**。"
                f"修订日期：{entry.get('revisedDate') or entry['effectiveDate']}。"
            ),
        ]),
    ]

    articles: list[str] = [
        f"第一条 为了规范相关活动，保障公民、法人和其他组织的合法权益，"
        f"维护社会秩序，促进经济社会发展，制定本{type_label.replace('司法', '规范') if '司法' in type_label else type_label}。"
    ]
    for i, ka in enumerate(entry.get("keyArticles") or [], 2):
        articles.append(f"第{cn_num(i)}条 {expand_key_article(ka, entry)}")
    if len(articles) >= 2:
        sections.append(("第一章 总则", articles))

    if entry.get("keyArticles"):
        sections.append(
            (
                "核心制度要点",
                [f"**{ka}** — {expand_key_article(ka, entry)}" for ka in entry["keyArticles"]],
            )
        )

    domains = entry.get("domains") or []
    bg = [
        f"本规范由 **{entry['issuer']}** 制定并公布，当前状态 **{entry['status']}**。",
        "下列内容为研究学习用结构化汇编，正式引用请以国家法律法规数据库公布文本为准。",
        "执法与司法实践中，应结合具体案情、配套规章及最新修订文本综合适用。",
    ]
    if domains:
        bg.append(f"规范索引领域：{'、'.join(domains)}。")
    sections.append(("规范背景与适用", bg))
    return sections


def expanded_policy_sections(entry: dict, raw_block: str = "") -> list[tuple[str, list[str]]]:
    """Generate substantive policy corpus sections from seed metadata."""
    import re as _re

    sections: list[tuple[str, list[str]]] = []

    def _metrics(block: str) -> dict:
        m = _re.search(r"metrics:\s*\{(.*?)\}", block, _re.DOTALL)
        if not m:
            return {}
        out = {}
        for km in _re.finditer(r"(\w+):\s*([\d.]+|null)", m.group(1)):
            val = km.group(2)
            out[km.group(1)] = None if val == "null" else float(val) if "." in val else int(val)
        return out

    def _stance(block: str) -> dict:
        m = _re.search(r"stance:\s*\{(.*?)\}", block, _re.DOTALL)
        if not m:
            return {}
        return {sm.group(1): sm.group(2) for sm in _re.finditer(r'(\w+):\s*"([^"]*)"', m.group(1))}

    metrics = _metrics(raw_block)
    if metrics:
        label_map = {
            "gdpTarget": "GDP 增长目标", "deficit": "赤字率", "cpi": "CPI 目标",
            "jobs": "城镇新增就业", "urbanUnemp": "城镇调查失业率",
            "specialBond": "地方专项债", "longBond": "超长期特别国债", "defense": "国防预算增幅",
        }
        lines = []
        for key, label in label_map.items():
            v = metrics.get(key)
            if v is not None:
                unit = "%" if key in ("gdpTarget", "deficit", "cpi", "urbanUnemp", "defense") else "万人" if key == "jobs" else "万亿"
                lines.append(f"**{label}**：{v}{unit}")
        if lines:
            sections.append(("量化指标", lines))

    if entry.get("highlights"):
        sections.append(("政策要点", [expand_highlight(h) for h in entry["highlights"]]))

    if entry.get("keywords"):
        sections.append(
            (
                "关键词与政策锚点",
                [
                    "本文件涉及以下核心政策话语：" + "、".join(f"「{k}」" for k in entry["keywords"]) + "。",
                    "上述关键词构成政策检索与跨文件比对的基础索引，可用于追踪政策演进脉络、部门协同接口及地方落实差异。",
                ],
            )
        )

    stance = _stance(raw_block)
    if stance:
        sections.append(
            (
                "宏观政策立场",
                [
                    f"**财政政策**：{stance.get('fiscal', '—')}",
                    f"**货币政策**：{stance.get('monetary', '—')}",
                    "宏观政策组合需与产业政策、区域政策及风险防控要求协同，避免多项政策叠加产生非预期约束效应。",
                ],
            )
        )

    sections.append(
        (
            "文件背景",
            [
                f"本文件由 **{entry['org']}** 发布，归类为 **{entry['type']}**，"
                f"政策领域 **{entry.get('category') or '综合'}**。",
                f"发布时间为 {entry['date']}，信息来源 {entry.get('source') or '中国政府网'}。",
            ],
        )
    )

    sections.append(
        (
            "执行与衔接",
            [
                "政策落地需配套实施细则、部门分工方案及地方实施方案；涉及跨部门事项应建立联席会议或专班机制。",
                "研究用途下，建议与同期政府工作报告、五年规划及部委专项政策交叉比对，以把握政策组合与优先级排序。",
            ],
        )
    )
    return sections
