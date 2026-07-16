#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Patch SJW-00..27 signatures + create SJW-28..32 Round 7."""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
WORLD = ROOT / "app/public/shijian-world"
from scripts.lib.sjw_sig_shared import SIG_CSS, wrap_section
from scripts.lib import sjw_sig_engines as E

def ND(name, tag, body):
    return {"name": name, "tag": tag, "body": body}

CAT = json.loads((ROOT / "scripts/lib/sjw_sig_catalog.json").read_text())
LAYOUTS = E.LAYOUTS

def build_svg(layout, nodes):
    nodes_t = [tuple(n) for n in nodes]
    if layout in LAYOUTS:
        return LAYOUTS[layout](nodes_t)
    return E.layout_dispatch(layout, nodes_t)

def legend_for(nodes):
    COL = E.COL
    seen, html = [], []
    labels = {"o":"财政/数据","c":"精英/结构","v":"张力/军事","p":"合法性/正文","l":"次级/划界"}
    for n in nodes:
        c = n[3]
        if c in seen: continue
        seen.append(c)
        html.append(f'<span><i style="background:{COL[c]}"></i>{labels[c]}</span>')
    return "".join(html)

def section_html(vid: int):
    cat = CAT[str(vid)]
    nodes = cat["nodes"]
    svg = build_svg(cat["layout"], nodes)
    node_data = {n[0]: ND(n[1] + (" · " + n[2] if n[2] else ""), n[4], n[5]) for n in nodes}
    edges = cat["edges"]
    if cat["layout"] not in LAYOUTS:
        edges = {}
        for i, n in enumerate(nodes):
            es = []
            if i: es.append(f"e{i}")
            if i + 1 < len(nodes): es.append(f"e{i+1}")
            edges[n[0]] = es or ["e1"]
    guide = cat["guide"] + " 点击节点 drill-down；Esc 清除。"
    return wrap_section(
        f"SJW-{vid:02d}", cat["title"], cat["motif"], svg,
        f"<b>导读：</b>{guide}", legend_for(nodes), node_data, edges
    ), cat

def inject_css(html: str) -> str:
    if "SJW signature premium interactivity" in html:
        html = re.sub(
            r"/\* === SJW signature premium interactivity === \*/.*?/\* === /SJW signature premium === \*/\n",
            "", html, flags=re.S)
    if "</style>" not in html:
        raise RuntimeError("no style")
    return html.replace("</style>", SIG_CSS + "\n</style>", 1)

def replace_sig(html: str, section: str) -> str:
    html = re.sub(
        r"<script>\s*\(function\(\)\{\s*var stage=document\.getElementById\('sjw-sig-stage'\);.*?</script>\s*",
        "", html, flags=re.S)
    m = re.search(r'<section class="sjw-sec" id="sec-sig"[^>]*>.*?</section>', html, flags=re.S)
    if not m:
        raise RuntimeError("sec-sig missing")
    return html[: m.start()] + section + html[m.end() :]

def patch(vid: int) -> str:
    path = WORLD / f"SJW-{vid:02d}.html"
    html = inject_css(path.read_text(encoding="utf-8"))
    sec, cat = section_html(vid)
    path.write_text(replace_sig(html, sec), encoding="utf-8")
    return f"SJW-{vid:02d}\t{cat['motif']}\tnodes={len(cat['nodes'])}\t{cat['layout']}"

def make_new(vid, title, subtitle, zhupi, ledger, rows, maps, sources, chips):
    head = (WORLD / "SJW-24.html").read_text(encoding="utf-8")
    head = head[: head.index("</head>") + 7]
    head = re.sub(r"<title>.*?</title>", f"<title>SJW-{vid:02d} · {title}</title>", head, count=1)
    head = re.sub(r'<meta name="description" content=".*?"/>',
                  f'<meta name="description" content="史鉴·世界：{title}。"/>', head, count=1)
    # strip old sig css duplicates by inject fresh
    head = inject_css(head)
    sec, cat = section_html(vid)
    chip_html = "\n      ".join(f'<a class="sjw-chip" href="{h}">{l}</a>' for h, l in chips)
    ledger_html = "".join(f'<article><div class="f">{k}</div><p>{v}</p></article>' for k, v in ledger)
    trs = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>" for row in rows)
    map_html = "".join(
        f'<div class="sjw-dual"><article class="sim"><div class="k">相似机制</div><h3>{a}</h3><p>{b}</p></article>'
        f'<article class="diff"><div class="k">关键差异</div><h3>{c}</h3><p>{d}</p></article></div>'
        for a, b, c, d in maps)
    body = f'''
<body>
<div class="sjw-wrap sjw-reveal-stagger" id="sjw-top">
<header class="sjw-mast">
  <div>
    <div class="badge">SJW-{vid:02d} · 史鉴·世界 · 机制深描</div>
    <h1>{title}<em>{subtitle}</em></h1>
    <div class="sjw-chips">
      <a class="sjw-chip" href="./SJW-00.html">SJW-00 总索引</a>
      {chip_html}
      <a class="sjw-chip" href="/modules/shijian">史鉴·中华</a>
    </div>
  </div>
  <div class="sjw-meta">AS_OF <b>2026-07-16</b><br/>版本 <b>v0.7</b> · Round 7<br/>令牌 <b>--sjw-*</b></div>
</header>
<p class="sjw-zhupi">{zhupi}</p>
{sec}
<section class="sjw-sec" id="sec-ledger">
  <div class="sjw-sec-h"><span class="num">02 · 史鉴台账</span><h2>七字段</h2></div>
  <div class="sjw-ledger">{ledger_html}</div>
</section>
<section class="sjw-sec" id="sec-axes">
  <div class="sjw-sec-h"><span class="num">03 · 窗口台账</span><h2>机制节点</h2></div>
  <div class="sjw-table-wrap"><table class="sjw-table"><thead><tr><th>窗口</th><th>机制</th><th>可核验锚点</th><th>备注</th></tr></thead><tbody>{trs}</tbody></table></div>
</section>
<section class="sjw-sec" id="sec-map">
  <div class="sjw-sec-h"><span class="num">04 · 映射</span><h2>相似机制 · 关键差异</h2></div>
  {map_html}
</section>
<section class="sjw-sec" id="sec-src">
  <div class="sjw-sec-h"><span class="num">05 · 出处</span><h2>研究入口</h2></div>
  <p class="sjw-note">{sources}</p>
</section>
<footer class="sjw-foot">
  <span>ChinaOS · 史鉴·世界 SJW-{vid:02d} · v0.7 · AS_OF 2026-07-16</span>
  <span></span>
  <span><a href="#sjw-top">↑ 顶</a> · <a href="./SJW-00.html">返回 SJW-00</a> · <a href="/modules/shijian">史鉴·中华</a></span>
</footer>
</div>
</body></html>
'''
    (WORLD / f"SJW-{vid:02d}.html").write_text(head + body, encoding="utf-8")
    return f"NEW SJW-{vid:02d}\t{cat['motif']}\tnodes={len(cat['nodes'])}"

def main():
    reps = []
    for vid in range(0, 28):
        reps.append(patch(vid))
    # Round 7 content
    reps.append(make_new(28, "印度独立后发展路径", "民主共和 × 计划许可 × 1991 改革窗 · ↔ SJW-10/17",
        "民主约束下的计划—许可体制与 1991 危机触发自由化。强制与东亚威权窗口关键差异。",
        [("① 一句话拐点","印度在民主共和框架下长期以计划与许可管制配置资源，1991 国际收支危机触发改革窗口——工具受选举与联邦约束，异于东亚威权发展型。"),
         ("② 结构切片","尼赫鲁计划 · License Raj · 公营重工业 · 绿色革命 · 1991 外汇危机改革 · 联合政府约束。"),
         ("③ 相位","1947 独立→计划高峰→许可硬化→1991 改革→联盟政治摆动。增长率〔存疑〕。"),
         ("④ 五轴归因","财政：计划投资+赤字；精英：官僚许可+工商游说；合法性：民主民族+绩效；军事：边境安全非同盟前线型；基座：人口与人力资本分层。"),
         ("⑤ 史家交锋","发展型派 · 许可寻租批判 · 民主稳定派 · 改革不彻底派——并陈。"),
         ("⑥ 成败三列","已兑现：民主框架下工业化与服务业窗口；已失败：许可替代绩效纪律；未决：改革可逆性——开放。")],
        [("独立建国","民主共和+联邦","1947","可核验"),("License Raj","配额许可","1950s–80s 常用","评价〔存疑〕"),("1991改革","危机触发自由化","1991","可核验"),("绿色革命","粮基座","1960s–","幅度〔存疑〕")],
        [("国家能力打开产业窗口","与东亚同构。","民主否决与联邦约束","工具耐久低于威权窗（↔15/24）。"),
         ("危机触发相对价格改写","外汇危机打开改革可行集。","无同盟安全伞型嵌入","不结盟使外部条件异于韩日。")],
        "Bhagwati/Panagariya · License Raj 研究 · 对照 SJW-10/17/23 · 增长〔存疑〕。",
        [("./SJW-10.html","SJW-10 发展型"),("./SJW-17.html","SJW-17 矩阵"),("./SJW-23.html","SJW-23 谱系")]))
    reps.append(make_new(29, "东南亚「四小虎」发展型对照", "新·马·泰·印尼扇面 · ↔ SJW-15/24",
        "四小虎为对照扇面：城市国家枢纽、资源—工业、政变周期、群岛规模——共享出口窗口但根条件各异。",
        [("① 一句话拐点","冷战市场窗口下走出出口导向，组织形态从城市国家到资源群岛不等，不可压成日韩财阀复制品。"),
         ("② 结构切片","转口/FDI · 资源租金 · 农业加工 · 威权插曲 · 1997 危机 · 民主化分叉。"),
         ("③ 相位","ISI 插曲→出口导向→1997→改革分叉。国别分期〔存疑〕。"),
         ("④ 五轴","财政：贸易税/资源/FDI；精英：官僚—家族资本；合法性：增长+稳定；军事：政变风险；基座：人口教育分层。"),
         ("⑤ 史家交锋","飞雁模式 · 依赖论余绪 · 威权增长说 · 制度质量说——并陈。"),
         ("⑥ 成败三列","已兑现：部分跨越低收入；已失败：短资替代审慎监管（1997）；未决：中等收入升级——开放。")],
        [("出口导向","FDI+加工","1960s–80s","国别不一"),("1997危机","短资+汇率","1997–98","区域"),("新加坡枢纽","转口/金融","长时段","不可外推"),("资源工业","油棕锡油","马印","权重〔存疑〕")],
        [("出口窗口加速学习","与日韩同构。","城市国/资源国/政变周期","不可与财阀或超大规模裸比。"),
         ("危机改写金融监管","1997 暴露短债脆弱。","政治周期异质","泰/印尼漂移异于韩。")],
        "东亚奇迹辩论 · 1997 文献 · 对照 SJW-15/24/17 · 排名禁止。",
        [("./SJW-15.html","SJW-15 日本"),("./SJW-24.html","SJW-24 韩国"),("./SJW-17.html","SJW-17")]))
    reps.append(make_new(30, "非洲后殖民资源—主权张力", "边界切割 × 租金 × 国家能力 · 机制史",
        "机制史：殖民边界、资源租金与税收能力张力。禁止时评/文明贬损；国别多样只提炼机制。",
        [("① 一句话拐点","法理主权往往先于有效税收能力，租金易得削弱学习纪律，冲突与债务周期改写可行集。"),
         ("② 结构切片","任意边界 · 初级产品 · 矿油租金 · 援助/债条件性 · 军政交替。"),
         ("③ 相位","独立浪潮→租金国家化→结构调整→债务缓解尝试→资源新周期。年代〔存疑〕。"),
         ("④ 五轴","财政：贸易税+租金+援助；精英：恩庇；合法性：解放叙事折旧；军事：政变/内战；基座：年轻人口与基建缺口。"),
         ("⑤ 史家交锋","掠夺性国家 · 能力建设 · 资源诅咒 · 外部剥削说——并陈。"),
         ("⑥ 成败三列","已兑现：部分能力与民主插曲；已失败：租金永久替代税收国；未决：资源治理稳态——开放。")],
        [("独立浪潮","法理主权","1960s 高峰","国别不一"),("资源租金","矿油财政","长时段","份额〔存疑〕"),("结构调整","条件性","1980s–","评价争"),("冲突陷阱","租金争夺","多案","非全非无")],
        [("法理主权≠税收国家","与拉美部分同构。","边界切割+族群镶嵌","边界外生性更强（↔17）。"),
         ("租金削弱学习纪律","与石油国部分同构（↔21）。","援助条件性","异于东亚同盟市场嵌入。")],
        "Herbst · Collier · 资源诅咒文献 · 对照 SJW-17/10/21 · 数字〔存疑〕。",
        [("./SJW-17.html","SJW-17"),("./SJW-10.html","SJW-10"),("./SJW-21.html","SJW-21")]))
    reps.append(make_new(31, "联合国体系与战后国际组织秩序", "宪章 · 安理会 · 冷战瘫痪 · 功能机构",
        "自大战结束秩序实验延伸：宪章包装主权平等，否决权锁定大国特权；冷战瘫痪安全功能，专门机构平行运转。",
        [("① 一句话拐点","1945 宪章秩序写入主权平等叙事与安理会否决特权；冷战使安全功能间歇瘫痪，技术—发展机构成平行治理层。"),
         ("② 结构切片","旧金山宪章 · 五常 · 大会 · 托管遗产 · 专门机构 · 维和演化。"),
         ("③ 相位","战时同盟→宪章→冷战否决战→非殖→后冷战干预争议。"),
         ("④ 五轴","财政：会费政治；精英：外交官僚；合法性：平等 vs 特权张力；军事：集体安全名实；基座：功能技术标准。"),
         ("⑤ 史家交锋","制度理想主义 · 否决权批判 · 世界政府怀疑 · 全球南方改革诉求——并陈。"),
         ("⑥ 成败三列","已兑现：非殖与功能合作平台；已失败：自动制止大国战争；未决：安理会改革——开放。")],
        [("宪章","平等叙事+否决","1945","可核验"),("冷战瘫痪","否决战","1947–89","程度〔存疑〕"),("维和","同意原则","1950s–","演变中"),("专门机构","功能治理","长时段","技术标准")],
        [("多边容器约束冲突","与维也纳同构（↔12）。","否决权锁定特权","含正式大国特权，异于王朝协调。"),
         ("核时代改写热战概率","与 SJW-08 交叉。","组织≠谢林工具箱","本卷编年；威慑另算。")],
        "宪章文本 · UN 史 · 对照 SJW-02/08/12 · 改革〔存疑〕不作预测。",
        [("./SJW-02.html","SJW-02"),("./SJW-08.html","SJW-08"),("./SJW-12.html","SJW-12")]))
    reps.append(make_new(32, "数字/科技霸权与标准竞争", "标准 · 算力 · 联盟管制 · 当代短卷",
        "当代机制短卷：标准与算力节点改写相对优势。强制关键差异（≠煤铁工业）；存疑纪律；非政策鼓动。",
        [("① 一句话拐点","相对优势日益取决于接口标准、先进算力制造与技术联盟管制，知识品路径锁定异于煤铁帝国市场——可比学习+强制，不可比蒸汽史诗。"),
         ("② 结构切片","协议/标准组织 · 晶圆节点 · 出口管制 · 平台市场 · 数据安全叙事。"),
         ("③ 相位","开放互联→平台集中→供应链安全化→多极标准竞争〔进行中，存疑〕。"),
         ("④ 五轴","财政：补贴与采购；精英：技术官僚+平台资本；合法性：创新/安全叙事；军事：两用技术；基座：STEM 与电力。"),
         ("⑤ 史家交锋","技术民族主义 · 相互依赖派 · 标准公益派——并陈。"),
         ("⑥ 成败三列","已兑现：标准能锁定生态；已失败：单极标准永久支配〔未成立〕；未决：多极并存——开放。")],
        [("标准锁定","接口/协议","长时段","多样"),("算力节点","先进制造","当代","市占〔存疑〕"),("出口管制","联盟协调","2010s–","范围争"),("关键差异闸","≠SJW-11","强制","知识品≠煤铁")],
        [("学习+强制改写相对价格","与工业崛起同构。","知识品与网络效应","锁定异于煤铁规模（↔11）。"),
         ("安全叙事捆绑技术","与冷战科技竞争部分同构。","全球价值链互嵌","脱钩成本〔存疑〕，禁时评口号。")],
        "标准经济学 · 半导体供应链 · 对照 SJW-11/08/16 · 市占/预测〔存疑〕禁止。",
        [("./SJW-11.html","SJW-11"),("./SJW-08.html","SJW-08"),("./SJW-16.html","SJW-16")]))
    out = ROOT / "scripts/lib/sjw_sig_report.tsv"
    out.write_text("\n".join(reps) + "\n")
    print("\n".join(reps))
    print("DONE", len(reps))

if __name__ == "__main__":
    main()
