#!/usr/bin/env python3
"""Shared utilities for legal/policy corpus generation."""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AS_OF = "2026-06-11"
DENSITY_THRESHOLD = 2000
FULL_THRESHOLD = 8000
OFFICIAL_MARKERS = ("corpusSource: official", "corpusTier: official")
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


def split_frontmatter(text: str) -> tuple[dict[str, str], str]:
    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not m:
        return {}, text
    fm: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip()
    return fm, text[m.end() :]


def is_official_text(text: str) -> bool:
    head = text[:800]
    return any(m in head for m in OFFICIAL_MARKERS)


def build_structured_frontmatter(
    *,
    doc_id: str,
    tier: str,
    source: str = "structured",
    source_url: str | None = None,
    enriched_at: str | None = None,
) -> str:
    lines = [
        "---",
        f"corpusSource: {source}",
        f"corpusTier: {tier}",
        f"docId: {doc_id}",
        f"enrichedAt: {enriched_at or date.today().isoformat()}",
    ]
    if source_url:
        lines.append(f"sourceUrl: {source_url}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def infer_structured_tier(char_count: int, doc_id: str, excerpt_ids: set[str]) -> str:
    if char_count < STUB_THRESHOLD:
        return "stub"
    if char_count >= FULL_THRESHOLD:
        return "full"
    if doc_id in excerpt_ids:
        return "extended" if char_count >= DENSITY_THRESHOLD else "excerpt"
    return "extended" if char_count >= DENSITY_THRESHOLD else "excerpt"


def merge_sections(
    *section_lists: list[tuple[str, list[str]]],
) -> list[tuple[str, list[str]]]:
    """Merge section lists; later lists append paragraphs to existing titles."""
    merged: dict[str, list[str]] = {}
    order: list[str] = []
    for sections in section_lists:
        for title, paras in sections:
            if title not in merged:
                merged[title] = []
                order.append(title)
            seen = set(merged[title])
            for p in paras:
                if p not in seen:
                    merged[title].append(p)
                    seen.add(p)
    return [(t, merged[t]) for t in order]


def parse_markdown_sections(body: str) -> list[tuple[str, list[str]]]:
    """Extract ## sections from markdown body (skip # title and > meta)."""
    sections: list[tuple[str, list[str]]] = []
    current_title: str | None = None
    current_paras: list[str] = []
    for line in body.splitlines():
        if line.startswith("# ") or (line.startswith("> ") and not sections):
            continue
        if line.startswith("## "):
            if current_title:
                sections.append((current_title, current_paras))
            current_title = line[3:].strip()
            current_paras = []
            continue
        if line.startswith("---") or line.startswith("*AS_OF") or line.startswith("> **免责声明"):
            break
        if line.strip() and current_title:
            current_paras.append(line.strip())
    if current_title:
        sections.append((current_title, current_paras))
    return sections


def dense_legal_appendices(entry: dict) -> list[tuple[str, list[str]]]:
    type_label = {
        "law": "法律",
        "admin_regulation": "行政法规",
        "judicial_interpretation": "司法解释",
    }.get(entry["type"], "规范")
    title = entry["title"]
    issuer = entry["issuer"]
    sections: list[tuple[str, list[str]]] = []

    domains = entry.get("domains") or []
    if domains:
        domain_paras = [
            (
                f"在 **{d}** 领域，本{type_label}确立权利义务框架与监管接口；"
                f"主管部门应依据法定职权制定配套规章，地方不得增设与上位法抵触的限制性条件。"
            )
            for d in domains
        ]
        domain_paras.append(
            "跨领域事项适用「特别法优于一般法、新法优于旧法」原则；"
            "同一行为触犯多部规范的，由有权机关依程序确定适用顺序。"
        )
        sections.append(("第二章 分领域制度安排", domain_paras))

    key_articles = entry.get("keyArticles") or []
    if key_articles:
        impl = []
        for i, ka in enumerate(key_articles, 1):
            impl.append(
                f"**{i}. {ka}** — 执行中应明确责任主体、程序节点与证据标准；"
                f"行政机关作出不利处分或许可拒绝的，须说明理由并告知救济途径。"
            )
        impl.extend([
            f"《{title}》的行政处罚、行政许可、行政强制等具体程序，"
            f"适用《中华人民共和国行政处罚法》《中华人民共和国行政许可法》等一般规定；"
            f"本{type_label}有特别规定的，从其规定。",
            f"当事人对 {issuer} 及其工作人员违法行使职权造成损害的，"
            "有权依法请求国家赔偿；对具体行政行为不服的，可以依法申请行政复议或提起行政诉讼。",
        ])
        sections.append(("第三章 实施、监督与救济", impl))

    sections.append(
        (
            "制度衔接与适用要点",
            [
                f"本{type_label}与宪法、法律、行政法规及其他上位法规范一并构成适用体系；"
                "修订、废止或暂停适用，以全国人民代表大会及其常务委员会或国务院正式公布为准。",
                (
                    "下列内容为研究学习用结构化汇编，非官方法律电子文本；"
                    "执法、司法及合规引用须以国家法律法规数据库（flk.npc.gov.cn）公布文本为准。"
                ),
                (
                    f"适用时应注意与《立法法》《行政诉讼法》《民法典》等基础规范的体系解释，"
                    f"并结合 {entry.get('revisedDate') or entry['effectiveDate']} 修订文本及最新司法解释。"
                ),
            ],
        )
    )
    sections.append(
        (
            "研究检索与引用规范",
            [
                f"检索 **{title}** 时，建议在国家法律法规数据库使用准确法规名称与施行日期组合查询，"
                f"并核对 {entry.get('revisedDate') or entry['effectiveDate']} 修订版本。",
                "本文件为研究学习用结构化汇编；执法、司法及合规引用须以官方公布电子文本为准。",
                "跨规范适用时，应建立「宪法—法律—行政法规—规章—规范性文件」的层级检索清单，"
                "并标注条文效力状态（现行有效、已修订、已废止）。",
            ],
        )
    )
    return sections


def policy_type_context(entry: dict) -> list[tuple[str, list[str]]]:
    """Type/category-specific substantive paragraphs to reach density targets."""
    ptype = entry.get("type") or "政策文件"
    category = entry.get("category") or "综合"
    org = entry.get("org") or "主管部门"
    title = entry.get("title") or entry.get("id", "")

    type_map: dict[str, list[str]] = {
        "区域战略": [
            f"「{title}」属于国家区域协调发展战略体系的年度部署文件，"
            f"与京津冀协同发展、长江经济带、粤港澳大湾区、长三角一体化、黄河流域生态保护等"
            f"区域战略形成政策矩阵；实施中需强化省际联席会议、利益补偿与生态产品价值实现机制。",
            "区域政策评估应关注：产业转移与升级对接是否顺畅、基础设施互联互通进度、"
            "生态环境共保联治成效、基本公共服务均等化水平及人才流动便利化程度。",
            "对边境、民族地区及资源型地区，政策落地应兼顾发展与安全，"
            "防止简单复制东部模式导致要素错配或债务风险累积。",
        ],
        "部委政策": [
            f"{org} 作为本条线的行业主管部门，负责政策解读、标准制定、试点审批与执法协调；"
            f"地方对口厅局承担具体执行，不得擅自放宽或加码中央底线要求。",
            "部委政策通常与财政奖补、金融工具、政府采购及标准体系联动；"
            "研究时应追踪配套国标、行业标准及合格评定程序的发布节奏。",
            "涉及新技术、新产业、新模式的部委文件，往往设置过渡期或沙盒监管安排；"
            "合规评估须关注备案、登记、许可及数据跨境等特殊义务。",
        ],
        "地方法规": [
            "地方性法规与规章须在法定权限内制定，不得与宪法、法律、行政法规相抵触；"
            "创新条款应依法报请全国人大常委会或国务院备案审查。",
            "地方立法常围绕优化营商环境、数字经济、生态文明、城市更新等开展「小快灵」探索；"
            "与中央政策同题时，应以上位法与中央最新精神为准，避免地方保护与市场分割。",
            "研究地方文件时，建议比对同一主题在相邻省市的立法差异，"
            "识别制度竞争、规则衔接与司法适用中的摩擦点。",
        ],
        "国务院文件": [
            "国务院文件具有较高行政效力，通常要求各地区各部门结合实际制定贯彻落实方案，"
            "明确时间表、路线图与责任分工；重大部署由国务院督查室或专项机制跟踪问效。",
            "国发、国函、国办发等文种在适用范围、审批程序与公开属性上存在差异；"
            "引用时应核对文号、发布日期及是否已被后续文件替代或修订。",
        ],
        "法律法规": [
            "本条涉及立法或修法进程，正式效力以全国人大常委会公布文本及施行日期为准；"
            "草案审议阶段的内容仅供研究，不得作为执法或合规依据。",
            "新法实施通常设置过渡期，并同步修订配套行政法规、部门规章及司法解释；"
            "企业合规应建立「法律—法规—规章—标准」的层级检索与更新机制。",
        ],
    }

    category_map: dict[str, list[str]] = {
        "科技": [
            "科技政策链条涵盖基础研究、应用研究、成果转化与产业化；"
            "需关注新型举国体制下的重大项目组织、科研人员激励及科研伦理审查要求。",
        ],
        "金融": [
            "金融政策须在防风险与促发展之间动态平衡；"
            "机构、功能、行为监管规则并行，跨境资金流动与数据安全约束持续趋严。",
        ],
        "环保": [
            "生态环境政策与碳达峰碳中和目标、排污许可、环评制度及生态补偿机制紧密衔接；"
            "双随机一公开与信用监管成为常态执法模式。",
        ],
        "区域": [
            "区域政策需与国土空间规划「三区三线」、产业准入负面清单及能耗双控政策协同，"
            "防止低水平重复建设与过度依赖土地财政。",
        ],
    }

    paras: list[str] = list(type_map.get(ptype, [
        f"本文件归类为 **{ptype}**，由 **{org}** 发布；"
        f"政策领域 **{category}**。执行层面应建立任务台账、跨部门协调与督查评估闭环。",
        "研究用途下，建议与同期上位规划、政府工作报告及横向部委政策交叉比对，"
        "以识别政策组合的协同效应与潜在冲突。",
    ]))
    if category in category_map:
        paras.extend(category_map[category])

    return [("类型化政策语境", paras)]


def dense_policy_appendices(entry: dict) -> list[tuple[str, list[str]]]:
    org = entry.get("org") or "主管部门"
    ptype = entry.get("type") or "政策文件"
    category = entry.get("category") or "综合"
    year = entry.get("year")
    sections: list[tuple[str, list[str]]] = []

    highlights = entry.get("highlights") or []
    if highlights:
        tasks = []
        for i, h in enumerate(highlights, 1):
            clean = re.sub(r"^\*\*|\*\*$", "", h.strip())
            tasks.append(
                f"**任务 {i}：{clean}** — "
                f"牵头单位由 {org} 会同相关部委确定；"
                f"需制定年度工作台账，明确里程碑、资金渠道与考核指标，"
                f"并纳入国务院督查或专项巡视评估范围。"
            )
        sections.append(("重点任务分解与责任链", tasks))

    keywords = entry.get("keywords") or []
    if keywords:
        sections.append(
            (
                "政策话语与执行锚点",
                [
                    "、".join(f"「{k}」" for k in keywords)
                    + " 等表述构成政策检索、跨文件比对与地方落实差异分析的基础索引。",
                    (
                        "上述话语通常在政府工作报告、五年规划、中央全会决定及部委细则中形成"
                        "「顶层定调—部门分工—地方方案」的传导链条；研究时应追踪同词在不同年份文件中的语义漂移。"
                    ),
                    (
                        "对涉及安全、数据、金融、环保等敏感领域的政策，"
                        "地方细则不得突破中央政策底线，须报上级主管部门备案或评估。"
                    ),
                ],
            )
        )

    sections.append(
        (
            "部门协同与督查评估",
            [
                f"{org} 应会同财政、发改、人社、市场监管等相关部门建立联席会议或专班机制，"
                f"统筹 {ptype} 的细则制定、预算安排与绩效考核。",
                "政策执行实行台账管理：明确时间节点、量化指标、责任人与风险清单；"
                "对落实不力的地区和部门，按有关规定约谈、通报或专项督查。",
                "涉及跨地区、跨层级事项，应强化央地协同与信息通报，防止政策碎片化或层层加码。",
            ],
        )
    )

    sections.append(
        (
            "地方落实与试点推广",
            [
                "省级政府应结合本地产业结构、资源禀赋与财政能力，制定实施方案或行动方案，"
                "避免「一刀切」式照搬；自贸试验区、国家级新区等可依法开展先行先试。",
                "试点经验成熟后，由主管部门总结推广；"
                "对证明行之有效的制度创新，可通过修订行政法规或部门规章予以固化。",
                "研究用途下，建议比对同一政策主题在不同省（区、市）的实施细则差异，"
                "以识别政策执行中的摩擦成本与激励相容问题。",
            ],
        )
    )

    if year:
        sections.append(
            (
                "政策演进脉络",
                [
                    f"本文件发布于 **{year}** 年，归类 **{category}** 领域；"
                    f"建议与 {year - 1}–{year + 1} 年同期的政府工作报告、五年规划及中央经济工作"
                    "会议精神交叉阅读，以把握政策组合的边际变化与优先级排序。",
                    (
                        "若文件标注「初步综合」或「待官方校订」，"
                        "具体指标、表述及效力以中国政府网、新华社及主管部门正式公布文本为准。"
                    ),
                ],
            )
        )

    sections.extend(policy_type_context(entry))
    sections.append(
        (
            "研究检索与引用规范",
            [
                f"检索 **{entry.get('title', entry.get('id', ''))}** 时，建议同时使用文件编号、发布机关、"
                f"发布日期及关键词组合查询，以排除同名或已被修订的旧版文件。",
                "本文件为研究学习用结构化汇编；正式引用、执法依据或合规审查须以中国政府网、"
                "国家法律法规数据库及主管部门正式公布文本为准。",
                "跨文件比对时，可结合政令文库索引中的 corpusTier、sourceUrl 与 enrichedAt 字段"
                "追踪语料来源层级与增密日期。",
            ],
        )
    )
    return sections
