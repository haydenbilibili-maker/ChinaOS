#!/usr/bin/env python3
"""Generate batch-2 policy corpus markdown from docSeed (70+ new entries)."""

from __future__ import annotations

import re
from pathlib import Path

from corpus_common import ROOT, expand_highlight, parse_doc_seed, policy_doc

POLICIES = ROOT / "app" / "public" / "policy-corpus" / "policies"

# Priority types for expansion (higher = sooner)
TYPE_PRIORITY = {
    "政府工作报告": 10,
    "中央经济工作会议": 9,
    "五年规划": 9,
    "中央全会决定": 8,
    "国务院文件": 7,
    "部委政策": 6,
    "法律法规": 5,
    "区域战略": 4,
    "地方法规": 3,
}

# Extra expanded sections for flagship docs (beyond auto-gen)
EXTRA: dict[str, list[tuple[str, list[str]]]] = {
    "gwr-2018": [
        ("一、2017年工作回顾", [
            "过去五年，经济社会发展取得历史性成就、发生历史性变革。国内生产总值从54万亿元增加到82.7万亿元，年均增长7.1%，占世界经济比重从11.4%提高到15%左右。",
            "经济结构出现重大变革，消费贡献率由54.9%提高到58.8%，服务业比重从45.3%上升到51.6%，成为经济增长主动力。",
        ]),
        ("二、2018年总体要求", [
            "综合研判国内外形势，我国发展面临的机遇和挑战都有新的变化。我国仍处于重要战略机遇期，拥有足够的韧性、巨大的潜力和不断迸发的创新活力。",
            "做好今年政府工作，要在以习近平同志为核心的党中央坚强领导下，以马克思列宁主义、毛泽东思想、邓小平理论、「三个代表」重要思想、科学发展观、习近平新时代中国特色社会主义思想为指导。",
        ]),
    ],
    "gwr-2019": [
        ("一、2018年工作回顾", [
            "过去一年，面对错综复杂的国际环境和艰巨繁重的国内改革发展稳定任务，以习近平同志为核心的党中央统揽全局、沉着应对，团结带领全国各族人民砥砺奋进，完成全年经济社会发展主要目标任务。",
        ]),
        ("二、2019年重点任务", [
            "继续创新和完善宏观调控，确保经济运行在合理区间。实施更大规模的减税降费，全年减轻企业税收和社保缴费负担近2万亿元。",
            "激发市场主体活力，着力优化营商环境。以简审批优服务便利投资兴业，深化「放管服」改革，降低制度性交易成本。",
        ]),
    ],
    "gwr-2020": [
        ("一、2019年和近年工作", [
            "在较短时间内有效控制疫情，在全国范围统筹调配人员、物资，有效保障基本生活，迅速恢复生产和生活秩序，最大限度保护了人民生命安全和身体健康。",
        ]),
        ("二、2020年特殊部署", [
            "没有提出全年经济增速具体目标，主要因为全球疫情和经贸形势不确定性很大，我国发展面临一些难以预料的影响因素。这是特殊时期的特殊举措。",
            "优先稳就业保民生，坚决打赢脱贫攻坚战，努力实现全面建成小康社会目标任务。",
            "发行1万亿元抗疫特别国债，赤字率按3.6%以上安排，规模比去年增加1万亿元。",
        ]),
    ],
    "gwy-rural-2024": [
        ("总体要求", [
            "学习运用「千万工程」经验，有力有效推进乡村全面振兴，以确保国家粮食安全、确保不发生规模性返贫为底线，以提升乡村产业发展水平、提升乡村建设水平、提升乡村治理水平为重点。",
        ]),
        ("重点任务", [
            "**粮食安全**：抓好粮食和重要农产品生产，稳定粮食播种面积，推动大面积单产提升。",
            "**产业融合**：促进农村一二三产业融合发展，推动农产品加工业优化升级，发展农村电商和乡村旅游。",
            "**和美乡村**：持续改善农村人居环境，加强农村基础设施和公共服务体系建设。",
        ]),
    ],
    "gwy-fertility-2024": [
        ("政策框架", [
            "加快完善生育支持政策体系，推动建设生育友好型社会，以生育、养育、教育成本降低和公共服务供给扩大为主线，系统部署生育休假、生育保险、托育服务、住房教育支持等一揽子措施。",
        ]),
    ],
    "gwy-pension-2024": [
        ("银发经济部署", [
            "发展银发经济是积极应对人口老龄化的重要举措，以增进老年人福祉为目标，培育智慧健康养老、康复辅助器具、抗衰老产业等新业态，推进公共设施与家庭适老化改造。",
        ]),
    ],
    "gwy-open-2024": [
        ("高水平开放", [
            "以高水平开放推动服务贸易高质量发展，扩大服务业对外开放试点，发展数字贸易、绿色贸易，优化跨境服务贸易负面清单管理，建设国家服务贸易创新发展示范区。",
        ]),
    ],
    "ndrc-fyp15-2026": [
        ("「十五五」前期研究", [
            "「十五五」时期是基本实现社会主义现代化夯实基础、全面发力的关键时期。前期研究聚焦现代化产业体系、科技自立自强、扩大内需战略基点、共同富裕与统筹发展和安全。",
            "预计形成约束性指标与预期性指标组合，涵盖经济增长、全要素生产率、研发强度、单位GDP能耗、粮食与能源安全等维度。",
        ]),
    ],
}


def parse_gwr_metrics(block: str) -> dict:
    m = re.search(r"metrics:\s*\{(.*?)\}", block, re.DOTALL)
    if not m:
        return {}
    metrics = {}
    for km in re.finditer(r"(\w+):\s*([\d.]+|null)", m.group(1)):
        val = km.group(2)
        metrics[km.group(1)] = None if val == "null" else float(val) if "." in val else int(val)
    return metrics


def parse_gwr_stance(block: str) -> dict:
    m = re.search(r"stance:\s*\{(.*?)\}", block, re.DOTALL)
    if not m:
        return {}
    return {sm.group(1): sm.group(2) for sm in re.finditer(r'(\w+):\s*"([^"]*)"', m.group(1))}


def build_sections(entry: dict, raw_block: str = "") -> list[tuple[str, list[str]]]:
    eid = entry["id"]
    if eid in EXTRA:
        return EXTRA[eid]

    sections: list[tuple[str, list[str]]] = []

    if entry["highlights"]:
        expanded = [expand_highlight(h) for h in entry["highlights"]]
        sections.append(("政策要点", expanded))

    if entry["keywords"]:
        sections.append(
            ("关键词与政策锚点", [
                "本文件涉及以下核心政策话语与逻辑锚点：" + "、".join(f"「{k}」" for k in entry["keywords"]) + "。",
                "上述关键词构成政策检索与跨文件比对的基础索引，可用于追踪政策演进脉络与部门协同接口。",
            ])
        )

    metrics = parse_gwr_metrics(raw_block)
    stance = parse_gwr_stance(raw_block)
    if metrics:
        lines = []
        label_map = {
            "gdpTarget": "GDP 增长目标",
            "deficit": "赤字率",
            "cpi": "CPI 目标",
            "jobs": "城镇新增就业",
            "urbanUnemp": "城镇调查失业率",
            "specialBond": "地方专项债",
            "longBond": "超长期特别国债",
            "defense": "国防预算增幅",
        }
        for key, label in label_map.items():
            v = metrics.get(key)
            if v is not None:
                unit = "%" if key in ("gdpTarget", "deficit", "cpi", "urbanUnemp", "defense") else "万人" if key == "jobs" else "万亿"
                lines.append(f"**{label}**：{v}{unit}")
        if lines:
            sections.insert(0, ("量化指标", lines))

    if stance:
        sections.append(
            ("宏观政策立场", [
                f"**财政政策**：{stance.get('fiscal', '—')}",
                f"**货币政策**：{stance.get('monetary', '—')}",
            ])
        )

    sections.append(
        ("文件背景", [
            f"本文件由 **{entry['org']}** 发布，归类为 **{entry['type']}**，政策领域 **{entry.get('category') or '综合'}**。",
            f"发布时间为 {entry['date']}，信息来源 {entry.get('source') or '中国政府网'}。",
        ])
    )

    return sections


def load_raw_blocks() -> dict[str, str]:
    text = (ROOT / "app/src/lib/db/docSeed.js").read_text(encoding="utf-8")
    blocks = re.split(r"\{\s*\n\s*id:\s*\"", text)
    out: dict[str, str] = {}
    for block in blocks[1:]:
        id_m = re.match(r'([^"]+)"', block)
        if id_m:
            out[id_m.group(1)] = block
    return out


def write_batch2(target: int = 70) -> int:
    entries = parse_doc_seed()
    raw_blocks = load_raw_blocks()
    existing = {p.stem for p in POLICIES.glob("*.md")}

    candidates = [e for e in entries if e["id"] not in existing]
    candidates.sort(
        key=lambda e: (
            -(e["year"] or 0),
            -TYPE_PRIORITY.get(e["type"], 0),
            e["id"],
        )
    )

    count = 0
    for entry in candidates[:target]:
        eid = entry["id"]
        meta = f"{entry['date']} · {entry['org']} · {entry['type']} · AS_OF 2026-07-14"
        sections = build_sections(entry, raw_blocks.get(eid, ""))
        content = policy_doc(entry["title"], meta, sections)
        path = POLICIES / f"{eid}.md"
        path.write_text(content, encoding="utf-8")
        print(f"  wrote policies/{eid}.md ({len(content)} chars)")
        count += 1
    return count


if __name__ == "__main__":
    n = write_batch2()
    print(f"Policy batch-2: {n} new files")
