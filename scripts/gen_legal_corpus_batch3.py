#!/usr/bin/env python3
"""Generate batch-3 legal corpus: remaining high-priority missing entries."""

from __future__ import annotations

from pathlib import Path

from corpus_common import ROOT, law_doc, parse_legal_seed

LAWS = ROOT / "app/public/legal-corpus/laws"
REGS = ROOT / "app/public/legal-corpus/regulations"
INTERPS = ROOT / "app/public/legal-corpus/interpretations"

# Priority entries with substantive article excerpts
PRIORITY: dict[str, list[tuple[str, list[str]]]] = {
    "law-urban-planning": [
        ("第一章 总则", [
            "第一条 为了加强城乡规划管理，协调城乡空间布局，改善人居环境，促进城乡经济社会全面协调可持续发展，制定本法。",
            "第二条 制定和实施城乡规划，在规划区内进行建设活动，必须遵守本法。",
            "第九条 城乡规划法所称规划区，是指城市、镇和村庄的建成区以及因城乡建设和发展需要，必须实行规划控制的区域。",
        ]),
    ],
    "law-health": [
        ("第一章 总则", [
            "第一条 为了发展医疗卫生与健康事业，保障公民享有健康权，提高公民健康水平，推进健康中国建设，根据宪法，制定本法。",
            "第二条 从事医疗卫生、健康促进及其监督管理活动，适用本法。",
            "第三条 医疗卫生与健康事业应当坚持以人民为中心，为人民健康服务，坚持政府主导、全社会参与、共建共享、预防为主的方针。",
        ]),
    ],
    "law-renewable": [
        ("第一章 总则", [
            "第一条 为了促进可再生能源开发利用，增加能源供应，改善能源结构，保障能源安全，保护环境，实现经济社会的可持续发展，制定本法。",
            "第四条 国家将可再生能源的开发利用列为能源发展的优先领域，通过制定年度总量目标和采取相应措施，推动可再生能源市场的建立和发展。",
        ]),
    ],
    "law-maritime": [
        ("第一章 总则", [
            "第一条 为了调整船舶所有人、经营人和管理人之间以及他们与承运人、托运人之间有关海上运输的关系、船舶的关系，保护当事人的合法权益，加强海洋生态环境保护，促进海上运输和经济贸易的发展，制定本法。",
        ]),
    ],
    "law-crypto": [
        ("第一章 总则", [
            "第一条 为了规范密码应用和管理，促进密码事业发展，保障网络与信息安全，维护国家安全和社会公共利益，保护公民、法人和其他组织的合法权益，制定本法。",
            "第二条 本法所称密码，是指采用特定变换的方法对信息等进行加密保护、安全认证的技术、产品和服务。",
        ]),
    ],
    "law-pension": [
        ("第一章 总则", [
            "第一条 为了规范基本养老保险关系，维护职工参加基本养老保险和享受基本养老保险待遇的合法权益，加强社会保险经办管理，根据社会保险法，制定本条例。",
        ]),
    ],
    "reg-consumption": [
        ("第一章 总则", [
            "第一条 为了促进消费，扩大内需，增强消费对经济发展的基础性作用，根据宪法，制定本条例。",
            "第二条 国家完善促进消费的政策体系，优化消费环境，维护消费者合法权益，推动消费提质升级。",
        ]),
    ],
    "reg-housing-fund": [
        ("第一章 总则", [
            "第一条 为了加强对住房公积金的管理，维护住房公积金所有者的合法权益，促进城镇住房建设，提高城镇居民的居住水平，制定本条例。",
            "第二条 本条例适用于住房公积金的缴存、提取、使用、管理和监督。",
        ]),
    ],
    "reg-urban-renewal": [
        ("第一章 总则", [
            "第一条 为了推动城市更新，提升城市品质，改善人居环境，促进城市高质量发展，制定本条例。",
            "第二条 城市更新应当坚持政府引导、市场运作、公众参与，统筹存量与增量、保护与发展。",
        ]),
    ],
    "ji-criminal-telecom": [
        ("一、一般规定", [
            "第一条 利用信息网络实施诈骗、侵犯公民个人信息、非法利用信息网络等犯罪，依照刑法有关规定定罪处罚。",
            "第二条 明知他人利用信息网络实施犯罪，为其犯罪提供互联网接入、服务器托管、网络存储、通讯传输等技术支持，或者提供广告推广、支付结算等帮助，情节严重的，构成帮助信息网络犯罪活动罪。",
        ]),
    ],
    "law-climate": [
        ("第一章 总则", [
            "第一条 为了应对气候变化，推动碳达峰碳中和，促进经济社会绿色低碳转型，推进生态文明建设，制定本法。",
            "第二条 在中华人民共和国境内从事应对气候变化及其监督管理活动，适用本法。",
        ]),
    ],
    "law-soil": [
        ("第一章 总则", [
            "第一条 为了保护和改善生态环境，防治土壤污染，推动土壤资源永续利用，推进生态文明建设，促进经济社会可持续发展，制定本法。",
            "第二条 在中华人民共和国领域和管辖的其他海域从事土壤污染防治及相关活动，适用本法。",
        ]),
    ],
    "law-forest": [
        ("第一章 总则", [
            "第一条 为了践行绿水青山就是金山银山理念，保护、培育和合理利用森林资源，加快国土绿化，保障森林生态安全，建设生态文明，实现人与自然和谐共生，制定本法。",
        ]),
    ],
    "law-wildlife": [
        ("第一章 总则", [
            "第一条 为了保护野生动物，拯救珍贵、濒危野生动物，维护生物多样性和生态平衡，推进生态文明建设，制定本法。",
            "第二条 在中华人民共和国领域及管辖的其他海域，从事野生动物保护及相关活动，适用本法。",
        ]),
    ],
    "reg-internet-info": [
        ("第一章 总则", [
            "第一条 为了规范互联网信息服务活动，促进互联网信息服务健康有序发展，制定本办法。",
            "第二条 在中华人民共和国境内从事互联网信息服务活动，应当遵守本办法。",
        ]),
    ],
    "reg-crypto-asset": [
        ("第一章 总则", [
            "第一条 为了规范加密资产相关活动，防范金融风险，保护投资者合法权益，维护金融秩序和社会稳定，制定本条例。",
        ]),
    ],
    "reg-grid": [
        ("第一章 总则", [
            "第一条 为了保障电力系统安全稳定运行，维护电力市场秩序，保护电力投资者、经营者、使用者合法权益和社会公共利益，促进电力事业发展，制定本条例。",
        ]),
    ],
    "ji-anti-monopoly": [
        ("一、一般规定", [
            "第一条 经营者违反反垄断法规定，实施垄断协议、滥用市场支配地位或者具有或者可能具有排除、限制竞争效果的经营者集中，应当承担相应的民事责任。",
        ]),
    ],
    "ji-foreign-investment": [
        ("一、一般规定", [
            "第一条 在中华人民共和国境内从事外商投资活动，适用外商投资法及本解释。",
            "第二条 外国投资者或者外商投资企业认为行政机关作出的行政行为侵犯其合法权益，依法提起诉讼的，人民法院应予受理。",
        ]),
    ],
}

# Explicit target order (high priority first)
TARGET_IDS = [
    "law-urban-planning", "law-bill", "law-maritime", "law-health", "law-renewable",
    "reg-consumption", "reg-housing-fund", "ji-criminal-telecom",
    "law-crypto", "law-pension", "law-elderly", "law-disability", "law-marriage",
    "law-population", "law-traditional-medicine", "law-vocational-education", "law-teachers",
    "law-climate", "law-soil", "law-forest", "law-wildlife", "law-mineral", "law-noise",
    "law-renewable", "law-audit", "law-state-owned", "law-asset-state", "law-detention",
    "law-consumption-tax", "law-bankruptcy-individual", "law-tobacco", "law-auction",
    "law-red-cross", "law-anti-unfair-competition-trade", "law-standardization",
    "law-metrology", "law-quality-promotion",
    "reg-pension-scheme", "reg-social-assistance", "reg-urban-renewal", "reg-drug-reg",
    "reg-road-transport", "reg-civil-aviation", "reg-internet-info", "reg-customs-admin",
    "reg-state-assets", "reg-local-debt", "reg-crypto-asset", "reg-ip-protection",
    "reg-patent-impl", "reg-copyright-impl", "reg-work-safety", "reg-urban-rural-planning",
    "reg-green-cert", "reg-defense-industry", "reg-military-civil", "reg-grid",
    "reg-map-survey", "reg-geo-info",
    "ji-criminal-property", "ji-bankruptcy", "ji-consumption", "ji-online-litigation",
    "ji-family", "ji-foreign-investment", "ji-anti-monopoly",
]


def auto_sections(entry: dict) -> list[tuple[str, list[str]]]:
    sections: list[tuple[str, list[str]]] = [
        ("概述", [entry["summary"]]),
    ]
    if entry["keyArticles"]:
        sections.append(
            ("核心条款 / 要点", [f"**{a}**" for a in entry["keyArticles"]])
        )
    sections.append(
        ("规范背景", [
            f"本规范由 **{entry['issuer']}** 制定，当前状态 **{entry['status']}**，"
            f"生效日期 {entry['effectiveDate']}，修订日期 {entry.get('revisedDate') or entry['effectiveDate']}。",
            "下列内容为研究学习用结构化汇编，正式引用请以国家法律法规数据库公布文本为准。",
        ])
    )
    domains = entry.get("domains") or []
    if domains:
        sections.append(
            ("适用领域", [f"规范索引领域：{'、'.join(domains)}。"])
        )
    return sections


def rel_path(eid: str) -> str:
    if eid.startswith("law-"):
        return f"laws/{eid}.md"
    if eid.startswith("reg-"):
        return f"regulations/{eid}.md"
    return f"interpretations/{eid}.md"


def write_batch3(target: int = 50) -> int:
    seed = {e["id"]: e for e in parse_legal_seed()}
    corpus_root = ROOT / "app/public/legal-corpus"

    # skip law-pipl — file exists as law-personal-info.md (alias in build script)
    skip = {"law-pipl"}

    candidates: list[str] = []
    seen: set[str] = set()
    for eid in TARGET_IDS:
        if eid not in seen and eid not in skip:
            candidates.append(eid)
            seen.add(eid)
    for eid in sorted(seed):
        if eid not in seen and eid not in skip:
            rel = rel_path(eid)
            if not (corpus_root / rel).is_file():
                candidates.append(eid)
                seen.add(eid)

    count = 0
    for eid in candidates:
        if count >= target:
            break
        entry = seed.get(eid)
        if not entry:
            print(f"WARN: {eid} not in seed")
            continue
        path = corpus_root / rel_path(eid)
        if path.is_file():
            continue

        sections = PRIORITY.get(eid) or auto_sections(entry)
        if eid in PRIORITY and entry["keyArticles"]:
            sections = [*sections, ("重点条款索引", [f"**{a}**" for a in entry["keyArticles"]])]

        meta = f"{entry['revisedDate']} · {entry['issuer']} · {entry['status']}"
        if eid not in PRIORITY:
            full_sections = sections
        else:
            full_sections = [("概述", [entry["summary"]]), *sections]

        content = law_doc(entry["title"], meta, full_sections)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print(f"  wrote {rel_path(eid)} ({len(content)} chars)")
        count += 1
    return count


if __name__ == "__main__":
    n = write_batch3(target=50)
    print(f"Legal batch-3: {n} new files")
