#!/usr/bin/env python3
"""Generate batch-3 policy corpus: remaining flagship / regional / 十五五 entries."""

from __future__ import annotations

import re
from pathlib import Path

from corpus_common import ROOT, expand_highlight, parse_doc_seed, policy_doc

POLICIES = ROOT / "app/public/policy-corpus/policies"

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

# Flagship docs with expanded sections beyond auto-gen
EXTRA: dict[str, list[tuple[str, list[str]]]] = {
    "gwr-2018": [
        ("一、过去五年成就", [
            "国内生产总值从54万亿元增加到82.7万亿元，年均增长7.1%，对世界经济增长贡献率超过30%。",
            "经济结构出现重大变革，消费贡献率由54.9%提高到58.8%，服务业比重从45.3%上升到51.6%。",
        ]),
        ("二、2018年工作部署", [
            "综合研判国内外形势，我国发展面临的机遇和挑战都有新的变化，仍处于重要战略机遇期。",
            "坚持以供给侧结构性改革为主线，统筹推进稳增长、促改革、调结构、惠民生、防风险各项工作。",
        ]),
    ],
    "gwr-2019": [
        ("一、2018年回顾", [
            "面对错综复杂的国际环境和艰巨繁重的国内改革发展稳定任务，完成全年经济社会发展主要目标任务，国内生产总值增长6.6%，总量突破90万亿元。",
        ]),
        ("二、2019年重点任务", [
            "实施更大规模减税降费，全年减轻企业税收和社保缴费负担近2万亿元。",
            "深化「放管服」改革，着力优化营商环境，激发市场主体活力。",
        ]),
    ],
    "gwr-2020": [
        ("一、疫情防控与复苏", [
            "在较短时间内有效控制疫情，统筹疫情防控和经济社会发展，最大限度保护人民生命安全和身体健康。",
        ]),
        ("二、2020年特殊部署", [
            "没有提出全年经济增速具体目标，主要因全球疫情和经贸形势不确定性很大。",
            "发行1万亿元抗疫特别国债，赤字率按3.6%以上安排，优先稳就业保民生，坚决打赢脱贫攻坚战。",
        ]),
    ],
    "cewc-2021": [
        ("会议定调", [
            "我国经济韧性强，长期向好的基本面不会改变。坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局，全面深化改革开放。",
        ]),
    ],
    "cewc-2022": [
        ("会议定调", [
            "坚持稳中求进工作总基调，更好统筹疫情防控和经济社会发展，更好统筹发展和安全，突出做好稳增长、稳就业、稳物价工作。",
        ]),
    ],
    "fyp-13": [
        ("规划概要", [
            "「十三五」时期是全面建成小康社会决胜阶段。规划提出创新、协调、绿色、开放、共享五大发展理念，设定GDP年均增长6.5%以上等约束性指标。",
        ]),
    ],
    "region-gba-2024": [
        ("大湾区建设", [
            "推进粤港澳大湾区建设，深化「一国两制」实践，促进要素便捷流动，建设国际一流湾区和世界级城市群。",
            "强化科技创新合作，建设综合性国家科学中心，推动横琴、前海、南沙等重大合作平台建设。",
        ]),
    ],
    "region-yrd-2024": [
        ("长三角一体化", [
            "深入推进长三角一体化发展，打造全国发展强劲活跃增长极，建设现代化经济体系，推进更高水平改革开放。",
        ]),
    ],
    "region-jjj-2024": [
        ("京津冀协同", [
            "推动京津冀协同发展走深走实，疏解北京非首都功能，高标准高质量推进雄安新区建设，促进三地产业协同与交通一体化。",
        ]),
    ],
    "region-xiongan-2024": [
        ("雄安新区", [
            "高标准高质量推进雄安新区建设，打造贯彻落实新发展理念的创新发展示范区，构建现代化城市治理体系。",
        ]),
    ],
    "region-hainan-2024": [
        ("海南自贸港", [
            "加快推进海南自由贸易港建设，以制度集成创新为核心，扩大对外开放，打造引领我国新时代对外开放的重要门户。",
        ]),
    ],
    "ndrc-fyp15-2026": [
        ("「十五五」前期", [
            "「十五五」时期是基本实现社会主义现代化夯实基础、全面发力的关键时期，前期研究聚焦现代化产业体系、科技自立自强、扩大内需与统筹发展和安全。",
        ]),
    ],
}

# Priority IDs not covered by batch-2
PRIORITY_IDS = [
    "gwr-2018", "gwr-2019", "gwr-2020",
    "cewc-2021", "cewc-2022", "fyp-13", "plenum-19-4",
    "region-gba-2024", "region-yrd-2024", "region-jjj-2024", "region-ne-2024",
    "region-xiongan-2024", "region-hainan-2024", "region-chengdu-2024",
    "region-belt-2024", "region-yangtze-2024", "region-yellow-2024",
    "gwy-nev-2023",
    "miit-chip-2024", "ndrc-compute-2024", "most-quantum-2024", "miit-robot-2024",
    "pboc-five-2024", "nfra-2024", "ndrc-energy-2024", "miit-auto-2024",
    "moe-edu-2024", "nhc-health-2024", "mohrss-employ-2024",
    "mofcom-negative-2024", "safe-fdi-2024", "shanghai-ftz-2024",
    "nea-power-2024", "ndrc-data-elem-2024", "most-space-2024",
    "policy-antitrust-2024", "policy-ip-2024", "policy-esg-2024",
    "local-sh-chip-2024", "local-gd-hk-2024", "local-bj-2024",
]


def load_raw_blocks() -> dict[str, str]:
    text = (ROOT / "app/src/lib/db/docSeed.js").read_text(encoding="utf-8")
    blocks = re.split(r"\{\s*\n\s*id:\s*\"", text)
    out: dict[str, str] = {}
    for block in blocks[1:]:
        id_m = re.match(r'([^"]+)"', block)
        if id_m:
            out[id_m.group(1)] = block
    return out


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
        sections.append(("政策要点", [expand_highlight(h) for h in entry["highlights"]]))

    if entry["keywords"]:
        sections.append(
            ("关键词与政策锚点", [
                "核心政策话语：" + "、".join(f"「{k}」" for k in entry["keywords"]) + "。",
            ])
        )

    metrics = parse_gwr_metrics(raw_block)
    if metrics:
        lines = []
        label_map = {
            "gdpTarget": "GDP 增长目标", "deficit": "赤字率", "cpi": "CPI 目标",
            "jobs": "城镇新增就业", "urbanUnemp": "城镇调查失业率",
        }
        for key, label in label_map.items():
            v = metrics.get(key)
            if v is not None:
                unit = "%" if key in ("gdpTarget", "deficit", "cpi", "urbanUnemp") else "万人"
                lines.append(f"**{label}**：{v}{unit}")
        if lines:
            sections.insert(0, ("量化指标", lines))

    stance = parse_gwr_stance(raw_block)
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
            f"发布时间为 {entry['date']}。",
        ])
    )
    return sections


def write_batch3(target: int = 70) -> int:
    entries = {e["id"]: e for e in parse_doc_seed()}
    raw_blocks = load_raw_blocks()
    existing = {p.stem for p in POLICIES.glob("*.md")}

    candidates: list[str] = []
    seen: set[str] = set()
    for eid in PRIORITY_IDS:
        if eid not in existing and eid in entries:
            candidates.append(eid)
            seen.add(eid)

    rest = [
        e for e in entries
        if e not in existing and e not in seen
    ]
    rest.sort(
        key=lambda eid: (
            -(entries[eid]["year"] or 0),
            -TYPE_PRIORITY.get(entries[eid]["type"], 0),
            eid,
        )
    )
    candidates.extend(rest)

    count = 0
    for eid in candidates[:target]:
        entry = entries[eid]
        meta = f"{entry['date']} · {entry['org']} · {entry['type']}"
        sections = build_sections(entry, raw_blocks.get(eid, ""))
        content = policy_doc(entry["title"], meta, sections)
        path = POLICIES / f"{eid}.md"
        path.write_text(content, encoding="utf-8")
        print(f"  wrote policies/{eid}.md ({len(content)} chars)")
        count += 1
    return count


if __name__ == "__main__":
    n = write_batch3(target=70)
    print(f"Policy batch-3: {n} new files")
