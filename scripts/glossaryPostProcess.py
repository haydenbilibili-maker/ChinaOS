"""Glossary deduplication and definition enrichment for genGlossarySeed.py."""
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_MD = ROOT / "中国深度调研系列_索引与恢复指令.md"

CAT_LABEL = {
    "politics": "政治体制",
    "econ": "经济理论",
    "module": "模块专有",
    "gy": "GY系列",
    "research": "调研术语",
    "legal": "法律政策",
    "military": "军事战略",
    "society": "社会文化",
    "tech": "技术概念",
}

PRIORITY_CATS = ("research", "gy", "econ", "politics")

PLACEHOLDER_PATTERNS = (
    r"模块「.+」副题关键词",
    r"中国深度调研系列索引关键词",
    r"^China OS 模块「",
    r"talent 模块：",
    r"政令文库 · 法律分类",
    r"^全国人大",
    r"^国务院制定",
    r"^最高法院",
    r"^党内制度性规范",
)

CATEGORY_ANGLE = {
    "politics": "从权力物理学视角，{term}刻画央地博弈、激励结构与制度穿透力的耦合关系。",
    "econ": "从成本—收益框架看，{term}连接宏观约束、要素配置与增长路径的权衡节点。",
    "gy": "在国运/GY推演谱系中，{term}作为可观测变量或结构隐喻，参与情景分支与尾部风险评估。",
    "research": "该术语服务于穿透宏观叙事、解析制度底层代码的分析传统，强调物理与财政约束。",
    "military": "地缘与安全维度上，{term}纳入成本收益比与能力—意图匹配的战略计算。",
    "tech": "技术与产业维度上，{term}关联自主可控、换道超车与算力/能源等硬约束。",
    "society": "社会韧性维度上，{term}描述压力传导、缓冲机制与治理技术的交互。",
    "legal": "法治与政策文本维度上，{term}界定规范层级与合规边界。",
    "module": "China OS 模块语料中的操作化标签，便于跨模块检索与交叉引用。",
}

ENRICHMENT_MIN = 60
ENRICH_THRESHOLD = 80


def normalize_term(term: str) -> str:
    t = re.sub(r"\s+", "", (term or "").strip())
    if t.isascii():
        return t.lower()
    return t


def is_placeholder(defn: str) -> bool:
    if not defn:
        return True
    return any(re.search(p, defn) for p in PLACEHOLDER_PATTERNS)


def entry_richness(e: dict) -> tuple:
    score = len(e.get("definition", ""))
    score += len(e.get("aliases", [])) * 5
    score += len(e.get("related", [])) * 3
    score += len(e.get("context", [])) * 12
    src = e.get("source", "")
    eid = e.get("id", "")
    if "深度调研系列" in src and "索引" not in src:
        score += 80
    if "GY-" in src or "GY系列" in src:
        score += 70
    if "博弈论" in src or "经济学" in src or "塔勒布" in src:
        score += 60
    if eid and not eid.startswith("mod-"):
        score += 25
    if "副题关键词" in e.get("definition", ""):
        score -= 40
    if "索引关键词" in e.get("definition", ""):
        score -= 30
    if eid.startswith("mod-") and "-term-" in eid:
        score -= 50
    return (score, len(e.get("definition", "")))


def _merge_context(a: list, b: list) -> list:
    seen: set[str] = set()
    out = []
    for c in a + b:
        key = c.get("moduleId") if isinstance(c, dict) else str(c)
        if key in seen:
            continue
        seen.add(key)
        out.append(c)
    return out


def _pick_canonical_id(group: list[dict]) -> str:
    for e in group:
        eid = e.get("id", "")
        if eid and not eid.startswith("mod-") and not eid.startswith("idx-"):
            return eid
    for e in group:
        eid = e.get("id", "")
        if eid and not eid.startswith("mod-"):
            return eid
    return group[0]["id"]


def merge_entries(primary: dict, secondary: dict) -> dict:
    merged = dict(primary)
    aliases: set[str] = set(primary.get("aliases") or [])
    if secondary["term"] != primary["term"]:
        aliases.add(secondary["term"])
    aliases.update(secondary.get("aliases") or [])
    aliases.discard(primary["term"])
    merged["aliases"] = sorted(aliases)

    related: list[str] = []
    seen_r: set[str] = set()
    for r in (primary.get("related") or []) + (secondary.get("related") or []):
        if r and r not in seen_r and r != primary["term"]:
            seen_r.add(r)
            related.append(r)
    merged["related"] = related

    merged["context"] = _merge_context(primary.get("context") or [], secondary.get("context") or [])

    p_def = primary.get("definition", "")
    s_def = secondary.get("definition", "")
    if len(s_def) > len(p_def) and not is_placeholder(s_def):
        merged["definition"] = s_def
        merged["source"] = secondary.get("source") or primary.get("source", "")
    elif is_placeholder(p_def) and not is_placeholder(s_def):
        merged["definition"] = s_def
        merged["source"] = secondary.get("source") or primary.get("source", "")

    src_p = primary.get("source", "")
    src_s = secondary.get("source", "")
    if src_s and src_s not in src_p and "副题关键词" not in src_s:
        merged["source"] = src_p if src_p else src_s
        if src_p and src_s != src_p:
            merged["source"] = f"{src_p}；{src_s}" if len(src_p) + len(src_s) < 120 else src_p

    if entry_richness(secondary)[0] > entry_richness(primary)[0]:
        cat = primary.get("category")
        if secondary.get("category") in PRIORITY_CATS or cat in ("module",):
            merged["category"] = secondary.get("category") or cat

    return merged


def dedupe_glossary(entries: list[dict]) -> tuple[list[dict], dict]:
    before = len(entries)
    parent = list(range(len(entries)))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a: int, b: int) -> None:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    norm_to_idx: dict[str, int] = {}
    alias_links = 0
    for i, e in enumerate(entries):
        keys = {normalize_term(e["term"])}
        keys.update(normalize_term(a) for a in (e.get("aliases") or []))
        for k in keys:
            if not k:
                continue
            if k in norm_to_idx:
                union(i, norm_to_idx[k])
                alias_links += 1
            else:
                norm_to_idx[k] = i

    groups: dict[int, list[dict]] = defaultdict(list)
    for i in range(len(entries)):
        groups[find(i)].append(entries[i])

    merged: list[dict] = []
    merged_groups = 0
    for group in groups.values():
        if len(group) == 1:
            merged.append(group[0])
            continue
        merged_groups += 1
        group.sort(key=entry_richness, reverse=True)
        result = group[0]
        for other in group[1:]:
            result = merge_entries(result, other)
        result["id"] = _pick_canonical_id(group)
        merged.append(result)

    after = len(merged)
    stats = {
        "before": before,
        "after": after,
        "removed": before - after,
        "merged_groups": merged_groups,
        "alias_links": alias_links,
    }
    return merged, stats


def parse_index_keyword_context() -> dict[str, dict]:
    if not INDEX_MD.exists():
        return {}
    text = INDEX_MD.read_text(encoding="utf-8")
    ctx: dict[str, dict] = {}
    current: dict = {}
    for line in text.splitlines():
        m = re.match(r"### \[(.+)\]", line)
        if m:
            current = {"report": m.group(1)}
            continue
        m = re.match(r"- \*\*核心标题\*\*[：:]\s*(.+)", line)
        if m:
            current["title"] = m.group(1).strip()
            continue
        m = re.match(r"- \*\*逻辑锚点\*\*[：:]\s*(.+)", line)
        if m:
            current["anchor"] = m.group(1).strip()
            continue
        m = re.match(r"- \*\*关键词\*\*[：:]\s*(.+)", line)
        if m:
            block = current.copy()
            for part in re.split(r"[、，,；;·]", m.group(1)):
                raw = part.strip()
                raw = re.sub(r"（[^）)]*）", "", raw)
                raw = re.sub(r"\([^)]*\)", "", raw).strip()
                if len(raw) < 2 or raw.startswith("→"):
                    continue
                ctx[normalize_term(raw)] = block
                if len(raw) <= 20:
                    ctx[normalize_term(raw.split("/")[0])] = block
    return ctx


def _context_labels(entry: dict) -> list[str]:
    labels = []
    for c in entry.get("context") or []:
        if isinstance(c, dict):
            lbl = c.get("label") or c.get("moduleId") or ""
            if lbl and lbl not in labels:
                labels.append(lbl)
        elif c:
            labels.append(str(c))
    return labels[:4]


def _related_phrase(entry: dict) -> str:
    rel = [r for r in (entry.get("related") or []) if r and r != entry["term"]]
    if not rel:
        return ""
    return f"关联概念包括{'、'.join(rel[:5])}。"


def _module_context_phrase(entry: dict) -> str:
    labels = _context_labels(entry)
    if not labels:
        return ""
    if len(labels) == 1:
        return f"在 China OS「{labels[0]}」模块中作为分析锚点出现。"
    return f"交叉见于 China OS 模块：{'、'.join(labels)}。"


def is_protected_curated(entry: dict, protected_terms: set[str]) -> bool:
    term = entry["term"]
    if term in protected_terms:
        return True
    src = entry.get("source", "")
    protected_markers = (
        "深度调研系列 ·",
        "GY-0",
        "GY系列",
        "博弈论",
        "经济学",
        "塔勒布",
        "哈丁",
        "谢林",
        "艾利森",
        "普里高津",
        "China OS · 设计系统",
        "China OS · 监测台",
        "半导体产业",
        "能源转型",
        "宏观经济学",
        "机制设计",
        "路径依赖理论",
        "发展经济学",
        "国际关系理论",
        "温特 ·",
    )
    if any(m in src for m in protected_markers):
        return True
    defn = entry.get("definition", "")
    if len(defn) >= 45 and not is_placeholder(defn):
        return True
    return False


def _enrich_index_keyword(entry: dict, idx_ctx: dict) -> str:
    term = entry["term"]
    block = idx_ctx.get(normalize_term(term), {})
    title = block.get("title") or "中国深度调研系列"
    parts = [
        f"「{term}」为深度调研索引核心术语，叙事脉络见《{title}》。",
    ]
    if block.get("anchor"):
        parts.append(f"逻辑锚点：{block['anchor']}")
    mod_p = _module_context_phrase(entry)
    if mod_p:
        parts.append(mod_p)
    rel_p = _related_phrase(entry)
    if rel_p:
        parts.append(rel_p)
    parts.append(CATEGORY_ANGLE.get(entry.get("category", "research"), CATEGORY_ANGLE["research"]))
    return "".join(parts)


def _enrich_module_subtitle(entry: dict) -> str:
    term = entry["term"]
    labels = _context_labels(entry)
    mod = labels[0] if labels else "相关模块"
    parts = [
        f"「{term}」为 China OS 模块「{mod}」副题中的结构化关键词，"
        f"用于在该专题内快速定位概念簇与交叉引用。",
        f"其语义从属于「{mod}」的整体分析框架，不宜脱离模块语境单独解读。",
    ]
    rel_p = _related_phrase(entry)
    if rel_p:
        parts.append(rel_p)
    angle = CATEGORY_ANGLE.get(entry.get("category", "module"), "")
    if angle:
        parts.append(angle.format(term=term) if "{term}" in angle else angle)
    return "".join(parts)


def _enrich_module_main(entry: dict) -> str:
    term = entry["term"]
    defn = entry.get("definition", "")
    subtitle = ""
    m = re.search(r"China OS 模块「(.+?)」：(.+?)。?$", defn)
    if m:
        term, subtitle = m.group(1), m.group(2)
    parts = [
        f"China OS 功能模块「{term}」",
    ]
    if subtitle:
        parts.append(f"聚焦{subtitle}。")
    else:
        parts.append("承载专题数据、图表与推演界面。")
    parts.append("模块词条用于全局搜索与术语词典的交叉导航，便于从概念跳转至可操作面板。")
    mod_p = _module_context_phrase(entry)
    if mod_p and term not in mod_p:
        parts.append(mod_p)
    rel_p = _related_phrase(entry)
    if rel_p:
        parts.append(rel_p)
    return "".join(parts)


def _enrich_legal_talent(entry: dict) -> str:
    term = entry["term"]
    cat = entry.get("category", "legal")
    defn = entry.get("definition", "")
    if cat == "legal":
        return (
            f"「{term}」为中国法律规范层级分类之一：{defn.rstrip('。')}。"
            f"政令文库按此层级组织政策与法条语料，支持跨文本检索与合规边界对照。"
            f"{_module_context_phrase(entry)}"
        )
    return (
        f"「{term}」为人才精英库（talent）子域标签：{defn.rstrip('。')}。"
        f"该分类用于结构化检索政要、学者、资本逻辑与海外精英等人物图谱。"
        f"{_related_phrase(entry)}"
    )


def _enrich_gy(entry: dict) -> str:
    term = entry["term"]
    defn = entry.get("definition", "")
    parts = [
        f"「{term}」属 GY 国运推演系列术语。{defn.rstrip('。')}。",
        "在国运情景分支中，该标签连接硬信号观测、变量耦合与尾部风险评估。",
    ]
    rel_p = _related_phrase(entry)
    if rel_p:
        parts.append(rel_p)
    parts.append(CATEGORY_ANGLE["gy"].format(term=term))
    return "".join(parts)


def _enrich_generic(entry: dict) -> str:
    term = entry["term"]
    defn = entry.get("definition", "").rstrip("。")
    cat = entry.get("category", "research")
    cat_label = CAT_LABEL.get(cat, cat)
    parts = [f"「{term}」（{cat_label}）：{defn}。" if defn else f"「{term}」归类为{cat_label}术语。"]
    mod_p = _module_context_phrase(entry)
    if mod_p:
        parts.append(mod_p)
    rel_p = _related_phrase(entry)
    if rel_p:
        parts.append(rel_p)
    angle = CATEGORY_ANGLE.get(cat, "")
    if angle:
        parts.append(angle.format(term=term) if "{term}" in angle else angle)
    return "".join(parts)


def _pad_if_short(text: str, term: str, cat: str) -> str:
    if len(text) >= ENRICHMENT_MIN:
        return text
    pad = (
        f"在 China OS 分析框架中，「{term}」用于连接{CAT_LABEL.get(cat, cat)}维度的"
        f"制度成本、物理约束与战略权衡，避免脱离上下文作感性化解读。"
    )
    return text + pad


def enrich_single(entry: dict, idx_ctx: dict, protected_terms: set[str]) -> str:
    defn = entry.get("definition", "")
    if is_protected_curated(entry, protected_terms):
        return defn
    if len(defn) >= ENRICH_THRESHOLD and not is_placeholder(defn):
        return defn

    term = entry["term"]
    cat = entry.get("category", "research")

    if re.search(r"索引关键词", defn):
        text = _enrich_index_keyword(entry, idx_ctx)
    elif re.search(r"副题关键词", defn):
        text = _enrich_module_subtitle(entry)
    elif defn.startswith("China OS 模块「"):
        text = _enrich_module_main(entry)
    elif cat == "gy":
        text = _enrich_gy(entry)
    elif cat in ("legal", "module") and ("talent 模块" in defn or "法律" in defn or "法规" in defn):
        text = _enrich_legal_talent(entry)
    elif cat in PRIORITY_CATS or is_placeholder(defn) or len(defn) < ENRICH_THRESHOLD:
        text = _enrich_generic(entry)
    else:
        return defn

    return _pad_if_short(text, term, cat)


def enrich_glossary_definitions(
    entries: list[dict],
    protected_terms: set[str] | None = None,
) -> tuple[list[dict], dict]:
    idx_ctx = parse_index_keyword_context()
    protected = protected_terms or set()
    lengths_before = [len(e.get("definition", "")) for e in entries]
    enriched_count = 0
    padded_count = 0
    skipped_protected = 0

    out: list[dict] = []
    for e in entries:
        ne = dict(e)
        old = e.get("definition", "")
        if is_protected_curated(e, protected):
            skipped_protected += 1
            out.append(ne)
            continue
        new = enrich_single(e, idx_ctx, protected)
        if new != old:
            enriched_count += 1
        if len(new) < ENRICHMENT_MIN and len(old) < ENRICHMENT_MIN:
            new = _pad_if_short(new, e["term"], e.get("category", "research"))
            padded_count += 1
        ne["definition"] = new
        out.append(ne)

    lengths_after = [len(e.get("definition", "")) for e in out]
    under_min = sum(1 for L in lengths_after if L < ENRICHMENT_MIN)
    stats = {
        "enriched": enriched_count,
        "skipped_protected": skipped_protected,
        "padded": padded_count,
        "avg_before": sum(lengths_before) / max(len(lengths_before), 1),
        "avg_after": sum(lengths_after) / max(len(lengths_after), 1),
        "under_min": under_min,
        "total": len(out),
    }
    return out, stats
