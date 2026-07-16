#!/usr/bin/env python3
"""Patch all SJW HTML volumes with viz CSS/motion + extra SVG sections."""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "app/public/shijian-world"

VIZ_CSS = r'''
/* === SJW viz premium (Round 6+) === */
@keyframes sjw-fade-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes sjw-pulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes sjw-dash{to{stroke-dashoffset:0}}
@keyframes sjw-node-in{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
.sjw-reveal-stagger > header,
.sjw-reveal-stagger > .sjw-zhupi,
.sjw-reveal-stagger > .sjw-sec,
.sjw-reveal-stagger > footer{
  animation:sjw-fade-in .4s cubic-bezier(.22,.61,.36,1) both;
}
.sjw-reveal-stagger > *:nth-child(1){animation-delay:.04s}
.sjw-reveal-stagger > *:nth-child(2){animation-delay:.08s}
.sjw-reveal-stagger > *:nth-child(3){animation-delay:.12s}
.sjw-reveal-stagger > *:nth-child(4){animation-delay:.16s}
.sjw-reveal-stagger > *:nth-child(5){animation-delay:.2s}
.sjw-reveal-stagger > *:nth-child(6){animation-delay:.24s}
.sjw-reveal-stagger > *:nth-child(7){animation-delay:.28s}
.sjw-reveal-stagger > *:nth-child(8){animation-delay:.32s}
.sjw-reveal-stagger > *:nth-child(9){animation-delay:.36s}
.sjw-reveal-stagger > *:nth-child(10){animation-delay:.4s}
.sjw-reveal-stagger > *:nth-child(11){animation-delay:.44s}
.sjw-reveal-stagger > *:nth-child(12){animation-delay:.48s}
.sjw-card{transition:border-color .2s,transform .2s,box-shadow .2s}
.sjw-card:hover,.sjw-card:focus-visible{
  border-color:var(--sjw-ochre);
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(0,0,0,.35);
  outline:none;
}
.sjw-stage svg .sjw-draw{
  stroke-dasharray:420;
  stroke-dashoffset:420;
  animation:sjw-dash 1.4s ease forwards;
}
.sjw-stage svg .sjw-draw-d2{animation-delay:.25s}
.sjw-stage svg .sjw-draw-d3{animation-delay:.5s}
.sjw-stage svg .sjw-node{
  transform-box:fill-box;transform-origin:center;
  animation:sjw-node-in .5s ease both;
}
.sjw-stage svg .sjw-node:nth-of-type(1){animation-delay:.1s}
.sjw-stage svg .sjw-node:nth-of-type(2){animation-delay:.18s}
.sjw-stage svg .sjw-node:nth-of-type(3){animation-delay:.26s}
.sjw-stage svg .sjw-node:nth-of-type(4){animation-delay:.34s}
.sjw-stage svg .sjw-node:nth-of-type(5){animation-delay:.42s}
.sjw-stage svg .sjw-pulse{animation:sjw-pulse 2.4s ease-in-out infinite}
.sjw-heat td.sjw-h{font-family:var(--sjw-mono);font-size:11px;text-align:center;font-weight:600}
.sjw-heat td.sjw-h0{background:color-mix(in srgb,var(--sjw-ink-900) 80%,transparent);color:var(--sjw-paper-300)}
.sjw-heat td.sjw-h1{background:color-mix(in srgb,var(--sjw-celadon) 22%,var(--sjw-ink-800));color:var(--sjw-paper-100)}
.sjw-heat td.sjw-h2{background:color-mix(in srgb,var(--sjw-ochre) 28%,var(--sjw-ink-800));color:var(--sjw-paper-100)}
.sjw-heat td.sjw-h3{background:color-mix(in srgb,var(--sjw-vermil) 32%,var(--sjw-ink-800));color:var(--sjw-paper-100)}
.sjw-filter{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}
.sjw-filter button{
  font-family:var(--sjw-mono);font-size:11px;letter-spacing:.08em;
  color:var(--sjw-paper-300);background:var(--sjw-ink-800);
  border:1px solid var(--sjw-line);border-radius:var(--sjw-radius);
  padding:6px 12px;cursor:pointer;
}
.sjw-filter button.is-on,.sjw-filter button:hover,.sjw-filter button:focus-visible{
  border-color:var(--sjw-ochre);color:var(--sjw-ochre);outline:none;
}
.sjw-cards[data-filter] .sjw-card[data-type]{transition:opacity .2s,transform .2s}
.sjw-cards.is-filtering .sjw-card:not(.is-shown){opacity:.28;pointer-events:none;transform:scale(.98)}
.sjw-viz-cap{font-size:13px;color:var(--sjw-paper-300);margin-top:10px;max-width:76ch;line-height:1.65}
.sjw-viz-cap b{color:var(--sjw-paper-100);font-weight:600}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .sjw-card,.sjw-chip{transition:none}
  .sjw-reveal-stagger > *{animation:none!important}
  .sjw-stage svg .sjw-draw,.sjw-stage svg .sjw-node,.sjw-stage svg .sjw-pulse{animation:none!important}
  .sjw-stage svg .sjw-draw{stroke-dasharray:none;stroke-dashoffset:0}
  .sjw-card:hover{transform:none;box-shadow:none}
}
'''

VIZ_JS = r'''
<script>
(function(){
  /* SJW viz: type filter (Hub) + optional node pulse on focus */
  var root=document.getElementById('sjw-top');
  if(!root)return;
  var filter=root.querySelector('[data-sjw-filter]');
  var cards=root.querySelector('[data-sjw-cards]');
  if(filter&&cards){
    filter.addEventListener('click',function(e){
      var btn=e.target.closest('button[data-type]');
      if(!btn)return;
      var t=btn.getAttribute('data-type');
      filter.querySelectorAll('button').forEach(function(b){b.classList.toggle('is-on',b===btn)});
      if(t==='all'){
        cards.classList.remove('is-filtering');
        cards.querySelectorAll('.sjw-card').forEach(function(c){c.classList.add('is-shown')});
        return;
      }
      cards.classList.add('is-filtering');
      cards.querySelectorAll('.sjw-card').forEach(function(c){
        var ok=(c.getAttribute('data-type')||'').split(/\s+/).indexOf(t)>=0;
        c.classList.toggle('is-shown',ok);
      });
    });
  }
})();
</script>
'''

# Extra viz blocks keyed by volume number (custom for P0; generic template for others)
def timeline_svg(vid: str, nodes: list[tuple[str, str]], title: str) -> str:
    """nodes: list of (label, sub)"""
    n = len(nodes)
    w = 820
    pad = 60
    span = w - 2 * pad
    parts = [
        f'<section class="sjw-sec" id="sec-viz-tl">'
        f'<div class="sjw-sec-h"><span class="num">Viz · 时间轴</span><h2>{title}</h2></div>'
        f'<div class="sjw-stage"><svg viewBox="0 0 820 220" role="img" aria-label="{title}">'
        f'<rect width="820" height="220" fill="var(--sjw-ink-900)"/>'
        f'<text x="24" y="28" fill="var(--sjw-ochre)" font-size="11" font-family="ui-monospace,monospace">{vid} · 机制时间轴</text>'
        f'<line class="sjw-draw" x1="{pad}" y1="110" x2="{w-pad}" y2="110" stroke="var(--sjw-line)" stroke-width="2"/>'
    ]
    for i, (lab, sub) in enumerate(nodes):
        x = pad + (span * i / max(n - 1, 1))
        color = ["var(--sjw-ochre)", "var(--sjw-celadon)", "var(--sjw-vermil)", "var(--sjw-paper-100)", "var(--sjw-ochre)"][i % 5]
        parts.append(
            f'<g class="sjw-node">'
            f'<circle class="sjw-pulse" cx="{x:.0f}" cy="110" r="8" fill="{color}" opacity=".9"/>'
            f'<text x="{x:.0f}" y="78" text-anchor="middle" fill="{color}" font-size="11">{lab}</text>'
            f'<text x="{x:.0f}" y="150" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">{sub}</text>'
            f'</g>'
        )
    parts.append('</svg></div>')
    parts.append(f'<p class="sjw-viz-cap">时间轴只编码<strong>机制节点</strong>，不作国别赛马；节点间距示意先后，非精确日历比例。</p></section>')
    return "".join(parts)


def axes_bars_svg(vid: str, scores: list[tuple[str, int]], title: str) -> str:
    """scores 0-3 intensity for five axes"""
    labels = scores
    parts = [
        f'<section class="sjw-sec" id="sec-viz-axes">'
        f'<div class="sjw-sec-h"><span class="num">Viz · 五轴强度</span><h2>{title}</h2></div>'
        f'<div class="sjw-stage"><svg viewBox="0 0 820 260" role="img" aria-label="{title}">'
        f'<rect width="820" height="260" fill="var(--sjw-ink-900)"/>'
        f'<text x="24" y="28" fill="var(--sjw-ochre)" font-size="11" font-family="ui-monospace,monospace">{vid} · 五轴示意（非评分榜）</text>'
    ]
    colors = ["var(--sjw-ochre)", "var(--sjw-celadon)", "var(--sjw-paper-100)", "var(--sjw-vermil)", "var(--sjw-paper-300)"]
    for i, (lab, sc) in enumerate(labels):
        y = 55 + i * 38
        w = 80 + sc * 140
        parts.append(
            f'<text x="24" y="{y+14}" fill="{colors[i]}" font-size="12">{lab}</text>'
            f'<rect x="140" y="{y}" width="560" height="22" rx="3" fill="var(--sjw-ink-800)" stroke="var(--sjw-line)"/>'
            f'<rect class="sjw-node" x="140" y="{y}" width="{w}" height="22" rx="3" fill="{colors[i]}" opacity=".75"/>'
            f'<text x="{140+w+8}" y="{y+15}" fill="var(--sjw-paper-300)" font-size="10">L{sc}</text>'
        )
    parts.append('</svg></div>')
    parts.append('<p class="sjw-viz-cap">五轴条为<strong>本卷主导张力的相对强度示意</strong>（L0–L3），禁止读作跨国可比打分。</p></section>')
    return "".join(parts)


def dual_map_svg(vid: str, left: str, right: str, title: str) -> str:
    return (
        f'<section class="sjw-sec" id="sec-viz-map">'
        f'<div class="sjw-sec-h"><span class="num">Viz · 映射闸</span><h2>{title}</h2></div>'
        f'<div class="sjw-stage"><svg viewBox="0 0 820 240" role="img" aria-label="{title}">'
        f'<rect width="820" height="240" fill="var(--sjw-ink-900)"/>'
        f'<text x="24" y="28" fill="var(--sjw-ochre)" font-size="11" font-family="ui-monospace,monospace">{vid} · 相似机制 / 关键差异</text>'
        f'<rect class="sjw-node" x="40" y="60" width="320" height="130" rx="6" fill="var(--sjw-ink-800)" stroke="var(--sjw-celadon)" stroke-width="2"/>'
        f'<text x="200" y="100" text-anchor="middle" fill="var(--sjw-celadon)" font-size="13">相似机制</text>'
        f'<text x="200" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="12">{left}</text>'
        f'<path class="sjw-draw" d="M380 125 H440" stroke="var(--sjw-line)" stroke-width="2"/>'
        f'<rect class="sjw-node" x="460" y="60" width="320" height="130" rx="6" fill="var(--sjw-ink-800)" stroke="var(--sjw-vermil)" stroke-width="2"/>'
        f'<text x="620" y="100" text-anchor="middle" fill="var(--sjw-vermil)" font-size="13">关键差异</text>'
        f'<text x="620" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="12">{right}</text>'
        f'</svg></div>'
        f'<p class="sjw-viz-cap">映射闸强制双栏并陈：缺<strong>关键差异</strong>的古今/中西类比一律不成立。</p></section>'
    )


# Volume-specific content packs
PACKS: dict[int, dict] = {
    1: {
        "tl": [("荷", "信用港"), ("英", "工业海权"), ("美", "规模信用"), ("日", "学习移植"), ("苏", "动员汲取")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 3)],
        "map": ("相对力量窗口叠合", "海权信用 ≠ 赋役科举"),
    },
    2: {
        "tl": [("同盟锁死", "1914"), ("总体战", "1914–18"), ("凡尔赛", "1919"), ("再战", "1939"), ("核门槛", "1945")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 2)],
        "map": ("联盟升级螺旋", "核天花板改写一战式升级"),
    },
    3: {
        "tl": [("动员工业", "1928–"), ("超强对峙", "1945–"), ("滞胀透支", "1970s"), ("改革震荡", "1985–"), ("解体", "1991")],
        "axes": [("财政", 3), ("精英", 3), ("合法性", 2), ("军事", 3), ("基座", 2)],
        "map": ("多轴共振崩解", "党国联邦 ≠ 帝制郡县"),
    },
    4: {
        "tl": [("比较史学", "兴衰透镜"), ("机制台账", "史鉴层"), ("思想实验", "三体边界"), ("划界闸", "命名不合并")],
        "axes": [("财政", 1), ("精英", 2), ("合法性", 3), ("军事", 2), ("基座", 2)],
        "map": ("文明博弈可对照", "史鉴≠黑暗森林公理"),
    },
    5: {
        "tl": [("公社", "1871"), ("第二国际", "分叉前"), ("列宁主义", "政权化"), ("社民", "议会道"), ("后冷战", "遗产")],
        "axes": [("财政", 2), ("精英", 3), ("合法性", 3), ("军事", 2), ("基座", 1)],
        "map": ("动员叙事谱系", "运动≠国家五轴终点"),
    },
    6: {
        "tl": [("马汉", "海权"), ("麦金德", "心脏地带"), ("斯皮克曼", "边缘地带"), ("政策转化", "学说→战略")],
        "axes": [("财政", 1), ("精英", 2), ("合法性", 1), ("军事", 3), ("基座", 1)],
        "map": ("地理约束可对照", "学说≠时评地图"),
    },
    7: {
        "tl": [("英镑峰", "金/信用"), ("大战加速", "交接窗"), ("美元锚", "布雷顿"), ("浮动后再平衡", "广场")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 2)],
        "map": ("同谱系合作转移", "≠修昔底德宿命常数"),
    },
    8: {
        "tl": [("冷战开启", "1947≈"), ("古巴", "1962"), ("缓和军控", "1970s"), ("第二冷战", "1980s"), ("后冷战", "未决")],
        "axes": [("财政", 2), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 2)],
        "map": ("MAD 天花板", "编年台账 ≠ 谢林模拟器"),
    },
    9: {
        "tl": [("奥斯曼", "复合衰变"), ("波斯", "改革摆动"), ("莫卧儿", "财政军事"), ("对照 SJ-07", "关键差异")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 1)],
        "map": ("多力共振", "复合帝国 ≠ 郡县大一统"),
        "heat": True,
    },
    10: {
        "tl": [("主权浪潮", "去殖民"), ("发展型", "出口纪律"), ("资源依附", "租金"), ("中等收入", "陷阱窗")],
        "axes": [("财政", 2), ("精英", 3), ("合法性", 2), ("军事", 1), ("基座", 2)],
        "map": ("三河道分叉", "禁写成普世药方"),
    },
    11: {
        "tl": [("煤铁蒸汽", "英峰"), ("信用扩张", "资本市场"), ("帝国市场", "窗口"), ("碳基锁定", "→SJW-18")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 1), ("军事", 2), ("基座", 3)],
        "map": ("技术—财政耦合", "英峰窗口 ≠ 普世起飞"),
    },
    12: {
        "tl": [("维也纳", "1815"), ("正统均势", "会议外交"), ("革命冲击", "→SJW-19"), ("体系松动", "民族浪潮")],
        "axes": [("财政", 1), ("精英", 3), ("合法性", 3), ("军事", 2), ("基座", 1)],
        "map": ("多主权协商容器", "≠朝贡单中心"),
    },
    13: {
        "tl": [("荷→英", "信用港"), ("英→美", "同盟交接"), ("工业基座", "SJW-11"), ("货币锚", "SJW-16")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 3)],
        "map": ("信用锚迁移规律", "同谱系 ≠ 大陆挑战者"),
        "heat": True,
    },
    14: {
        "tl": [("并置起点", "加州学派"), ("煤—美洲", "分叉"), ("大分流", "叙事争"), ("对照 SJ-21", "关键差异")],
        "axes": [("财政", 2), ("精英", 2), ("合法性", 1), ("军事", 1), ("基座", 3)],
        "map": ("欧亚并置可讨论", "分流时刻口径〔存疑〕"),
    },
    15: {
        "tl": [("明治重建", "国家能力"), ("战败断裂", "1945"), ("MITI 学习", "高度成长"), ("广场后", "金融化")],
        "axes": [("财政", 3), ("精英", 3), ("合法性", 2), ("军事", 1), ("基座", 3)],
        "map": ("出口学习纪律", "安全伞条件不可裸移植"),
    },
    16: {
        "tl": [("布雷顿", "1944"), ("金窗关", "1971"), ("广场", "1985"), ("欧元实验", "→SJW-26")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 2), ("基座", 1)],
        "map": ("承诺超过汲取则锚崩", "储备货币 ≠ 农本铸币"),
    },
    17: {
        "tl": [("东亚河道", "出口纪律"), ("拉美河道", "ISI/债"), ("非洲河道", "能力切割"), ("综合闸", "禁常数")],
        "axes": [("财政", 2), ("精英", 2), ("合法性", 2), ("军事", 1), ("基座", 2)],
        "map": ("区域分叉规律", "殖民切割 ≠ 郡县长时段"),
        "heat": True,
    },
    18: {
        "tl": [("碳基起飞", "工业"), ("石油地缘", "→SJW-21"), ("气候上限", "基座约束"), ("压舱石划界", "/energy")],
        "axes": [("财政", 2), ("精英", 1), ("合法性", 1), ("军事", 2), ("基座", 3)],
        "map": ("能源基座机制史", "≠当代压舱石工具箱"),
    },
    19: {
        "tl": [("革命动员", "1789"), ("恐怖/战争", "1790s"), ("拿破仑", "大陆体系"), ("维也纳回摆", "→SJW-12")],
        "axes": [("财政", 2), ("精英", 2), ("合法性", 3), ("军事", 3), ("基座", 1)],
        "map": ("人民主权动员", "革命输出 ≠ 宇宙社会学"),
    },
    20: {
        "tl": [("统一", "1871"), ("工业追赶", "德峰"), ("联盟死结", "大战前"), ("对照英美", "关键差异")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 3), ("军事", 3), ("基座", 3)],
        "map": ("大陆挑战者窗口", "≠英美合作交接模板"),
    },
    21: {
        "tl": [("油井租金", "资源"), ("海峡咽喉", "地缘"), ("石油美元", "货币"), ("能源基座", "SJW-18")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 3), ("基座", 3)],
        "map": ("油井—海峡—租金", "史鉴落地 ≠ /energy 工具箱"),
    },
    22: {
        "tl": [("开放试点", "窗口"), ("双轨价格", "过渡"), ("WTO 嵌入", "外部项"), ("对照东亚", "谱系异质")],
        "axes": [("财政", 3), ("精英", 3), ("合法性", 2), ("军事", 2), ("基座", 3)],
        "map": ("超大规模转型学习", "世界线外卷 ≠ SJ 正文重写"),
    },
    23: {
        "tl": [("日本", "SJW-15"), ("韩国", "SJW-24"), ("新加坡", "城市国"), ("台湾", "SJW-27"), ("中国", "SJW-22")],
        "axes": [("财政", 3), ("精英", 3), ("合法性", 2), ("军事", 2), ("基座", 3)],
        "map": ("出口学习共享", "禁儒家东亚常数"),
        "heat": True,
    },
    24: {
        "tl": [("威权汲取", "1960s"), ("HCI", "1970s"), ("民主化", "1987"), ("IMF", "1997")],
        "axes": [("财政", 3), ("精英", 3), ("合法性", 2), ("军事", 2), ("基座", 3)],
        "map": ("出口绩效约束财阀", "前线国家 ≠ 占领重建日本"),
    },
    25: {
        "tl": [("ISI 保护", "1950s–"), ("石油美元贷", "1970s"), ("墨违约", "1982"), ("失去的十年", "1980s")],
        "axes": [("财政", 3), ("精英", 2), ("合法性", 2), ("军事", 1), ("基座", 1)],
        "map": ("保护可开学习窗", "弱出口纪律 + 商品周期"),
    },
    26: {
        "tl": [("EMS", "1979"), ("ERM 危机", "1992"), ("马约", "1992"), ("欧元", "1999"), ("欧债", "2010s")],
        "axes": [("财政", 3), ("精英", 3), ("合法性", 2), ("军事", 1), ("基座", 2)],
        "map": ("承诺装置进口可信度", "多主权央行 ≠ 美元霸权锚"),
    },
    27: {
        "tl": [("土改", "分配稳定"), ("EPZ", "出口加工"), ("园区升级", "代工"), ("芯片节点", "全球链")],
        "axes": [("财政", 2), ("精英", 2), ("合法性", 2), ("军事", 2), ("基座", 3)],
        "map": ("SME+代工升级", "岛域规模 ≠ 日韩财阀/系列"),
    },
}

HEAT_TABLES = {
    9: (
        "三帝国五轴热力（示意）",
        ["财政", "精英", "合法性", "军事", "基座"],
        [
            ("奥斯曼", [3, 2, 2, 3, 1]),
            ("卡扎尔/巴列维前史", [2, 2, 2, 2, 1]),
            ("莫卧儿晚期", [3, 2, 1, 3, 1]),
        ],
    ),
    13: (
        "霸权交接五轴热力（示意）",
        ["财政", "精英", "合法性", "军事", "基座"],
        [
            ("荷→英", [3, 2, 2, 3, 2]),
            ("英→美", [3, 2, 2, 3, 3]),
            ("德挑战窗", [3, 2, 3, 3, 3]),
        ],
    ),
    17: (
        "区域河道张力热力（示意）",
        ["出口纪律", "资源租金", "外债敏感", "国家能力", "外部安全伞"],
        [
            ("东亚", [3, 1, 2, 3, 3]),
            ("拉美", [1, 2, 3, 2, 0]),
            ("非洲(多样)", [1, 3, 2, 1, 1]),
        ],
    ),
    23: (
        "发展型谱系热力（示意）",
        ["产业政策", "绩效纪律", "财阀/集团", "安全伞", "规模条件"],
        [
            ("日本", [3, 3, 2, 3, 2]),
            ("韩国", [3, 3, 3, 3, 2]),
            ("新加坡", [2, 3, 1, 2, 0]),
            ("台湾", [2, 3, 1, 3, 1]),
            ("中国", [3, 2, 1, 0, 3]),
        ],
    ),
}


def heat_section(vid: str, title: str, cols: list[str], rows: list[tuple[str, list[int]]]) -> str:
    th = "".join(f"<th>{c}</th>" for c in ["行"] + cols)
    body = []
    for name, vals in rows:
        tds = "".join(f'<td class="sjw-h sjw-h{v}">L{v}</td>' for v in vals)
        body.append(f"<tr><td>{name}</td>{tds}</tr>")
    return (
        f'<section class="sjw-sec" id="sec-viz-heat">'
        f'<div class="sjw-sec-h"><span class="num">Viz · 热力矩阵</span><h2>{title}</h2></div>'
        f'<div class="sjw-table-wrap"><table class="sjw-table sjw-heat"><thead><tr>{th}</tr></thead>'
        f'<tbody>{"".join(body)}</tbody></table></div>'
        f'<p class="sjw-viz-cap">热力为<strong>机制张力等级示意</strong>（L0–L3），禁止读作 GDP/军力排行；国别内部差异被压缩。</p></section>'
    )


def ensure_css(html: str) -> str:
    if "SJW viz premium" in html:
        # refresh CSS block
        html = re.sub(
            r"/\* === SJW viz premium.*?(?=@media \(max-width:900px\)|html\[data-theme|/media \(prefers-reduced-motion:reduce\)\{html\{scroll-behavior)",
            "",
            html,
            count=1,
            flags=re.S,
        )
        # simpler: remove old viz css if present between markers
        html = re.sub(r"\n/\* === SJW viz premium \(Round 6\+\) === \*/.*?/\* === /SJW viz premium === \*/\n", "\n", html, flags=re.S)
    # Replace thin reduced-motion rule and inject before last </style>
    marker = "/* === SJW viz premium (Round 6+) === */"
    block = VIZ_CSS + "\n/* === /SJW viz premium === */\n"
    if marker in html:
        html = re.sub(
            r"/\* === SJW viz premium \(Round 6\+\) === \*/.*?/\* === /SJW viz premium === \*/\n",
            block,
            html,
            count=1,
            flags=re.S,
        )
    else:
        # remove old short prefers-reduced that only touches card/chip if we're adding fuller one in VIZ_CSS
        html = html.replace(
            "@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.sjw-card,.sjw-chip{transition:none}}\n",
            "",
        )
        html = html.replace("</style>", block + "</style>", 1)
    return html


def ensure_wrap_class(html: str) -> str:
    html = html.replace('class="sjw-wrap" id="sjw-top"', 'class="sjw-wrap sjw-reveal-stagger" id="sjw-top"', 1)
    html = html.replace('class="sjw-wrap sjw-reveal-stagger sjw-reveal-stagger"', 'class="sjw-wrap sjw-reveal-stagger"')
    return html


def ensure_sig_anim(html: str) -> str:
    """Add sjw-draw / sjw-node / sjw-pulse classes to first signature svg lightly."""
    # Add class to first path/line/rect in first svg if not already patched
    if "sjw-draw" in html and html.count("sjw-draw") > 2:
        return html
    def patch_svg(m):
        svg = m.group(0)
        if "sjw-draw" in svg:
            return svg
        svg = re.sub(r"<path ", '<path class="sjw-draw" ', svg, count=2)
        svg = re.sub(r"<line ", '<line class="sjw-draw" ', svg, count=1)
        svg = re.sub(r"<rect ([^>]*stroke=)", r'<rect class="sjw-node" \1', svg, count=4)
        svg = re.sub(r"<circle ", '<circle class="sjw-pulse" ', svg, count=2)
        return svg
    return re.sub(r"<svg\b.*?</svg>", patch_svg, html, count=1, flags=re.S)


def strip_old_extra_viz(html: str) -> str:
    html = re.sub(r'<section class="sjw-sec" id="sec-viz-tl">.*?</section>\s*', "", html, flags=re.S)
    html = re.sub(r'<section class="sjw-sec" id="sec-viz-axes">.*?</section>\s*', "", html, flags=re.S)
    html = re.sub(r'<section class="sjw-sec" id="sec-viz-map">.*?</section>\s*', "", html, flags=re.S)
    html = re.sub(r'<section class="sjw-sec" id="sec-viz-heat">.*?</section>\s*', "", html, flags=re.S)
    html = re.sub(r'<section class="sjw-sec" id="sec-viz-hub-.*?</section>\s*', "", html, flags=re.S)
    return html


def inject_before_footer(html: str, block: str) -> str:
    # insert before last <footer
    idx = html.rfind("<footer")
    if idx < 0:
        return html + block
    return html[:idx] + block + "\n" + html[idx:]


def ensure_viz_js(html: str) -> str:
    if "data-sjw-filter" in html or "SJW viz: type filter" in html:
        html = re.sub(r"<script>\s*\(function\(\)\{\s*/\* SJW viz: type filter.*?</script>\s*", "", html, flags=re.S)
    if "</body>" in html:
        html = html.replace("</body>", VIZ_JS + "\n</body>", 1)
    return html


def build_extra(n: int) -> str:
    pack = PACKS[n]
    vid = f"SJW-{n:02d}"
    parts = [
        timeline_svg(vid, pack["tl"], "机制节点时间轴"),
        axes_bars_svg(vid, pack["axes"], "帝国/文明五轴张力"),
        dual_map_svg(vid, pack["map"][0], pack["map"][1], "映射双闸示意"),
    ]
    if pack.get("heat") and n in HEAT_TABLES:
        title, cols, rows = HEAT_TABLES[n]
        parts.append(heat_section(vid, title, cols, rows))
    return "\n".join(parts)


def patch_hub(html: str) -> str:
    """Special Hub upgrades: timeline of rounds + type filter on cards + topic graph."""
    html = strip_old_extra_viz(html)
    # Tag cards with data-type
    type_map = {
        "SJW-01": "matrix", "SJW-02": "case", "SJW-03": "case", "SJW-04": "theory",
        "SJW-05": "matrix", "SJW-06": "case", "SJW-07": "case", "SJW-08": "case",
        "SJW-09": "matrix", "SJW-10": "case", "SJW-11": "case", "SJW-12": "case", "SJW-13": "matrix",
        "SJW-14": "case", "SJW-15": "case", "SJW-16": "case", "SJW-17": "matrix", "SJW-18": "case",
        "SJW-19": "case", "SJW-20": "case", "SJW-21": "case", "SJW-22": "case", "SJW-23": "matrix",
        "SJW-24": "case", "SJW-25": "case", "SJW-26": "case", "SJW-27": "case",
    }
    for sid, t in type_map.items():
        html = re.sub(
            rf'<a class="sjw-card" href="\./{sid}\.html"',
            f'<a class="sjw-card" data-type="{t}" href="./{sid}.html"',
            html,
        )
    # Add filter UI after intro or before first round section - inject after zhupi
    if 'data-sjw-filter' not in html:
        filter_ui = '''
<section class="sjw-sec" id="sec-viz-hub-filter">
  <div class="sjw-sec-h"><span class="num">02b · 图谱筛选</span><h2>按类型浏览专题</h2></div>
  <div class="sjw-filter" data-sjw-filter role="toolbar" aria-label="专题类型筛选">
    <button type="button" class="is-on" data-type="all" tabindex="0">全部</button>
    <button type="button" data-type="matrix" tabindex="0">综合矩阵</button>
    <button type="button" data-type="case" tabindex="0">机制深描</button>
    <button type="button" data-type="theory" tabindex="0">总论/边界</button>
  </div>
  <p class="sjw-viz-cap">筛选只改变卡片可见性，不改写台账字段；矩阵卷提炼规律，深描卷展开单案机制。</p>
</section>
'''
        html = html.replace(
            '</section>\n\n<section class="sjw-sec" id="sec-topics"',
            '</section>\n' + filter_ui + '\n<section class="sjw-sec" id="sec-topics"',
            1,
        )
    # Mark card grids for filtering - add data-sjw-cards to each sjw-cards
    html = html.replace('class="sjw-cards"', 'class="sjw-cards" data-sjw-cards', 6)

    hub_viz = '''
<section class="sjw-sec" id="sec-viz-hub-graph">
  <div class="sjw-sec-h"><span class="num">Viz · 专题图谱</span><h2>Round 弧线与综合层锚点</h2></div>
  <div class="sjw-stage">
    <svg viewBox="0 0 820 340" role="img" aria-labelledby="hubg-t hubg-d">
      <title id="hubg-t">史鉴世界专题图谱：六轮弧线与三综合层</title>
      <desc id="hubg-d">六段弧线表示 Round 1–6，下方三节点为霸权/去殖民/发展型综合矩阵。</desc>
      <rect width="820" height="340" fill="var(--sjw-ink-900)"/>
      <text x="24" y="28" fill="var(--sjw-ochre)" font-size="11" font-family="ui-monospace,monospace">SJW-00 · 专题图谱 · 27 卷</text>
      <path class="sjw-draw" d="M60 80 Q200 40 340 80" fill="none" stroke="var(--sjw-ochre)" stroke-width="2"/>
      <path class="sjw-draw sjw-draw-d2" d="M340 80 Q480 120 620 80" fill="none" stroke="var(--sjw-celadon)" stroke-width="2"/>
      <path class="sjw-draw sjw-draw-d3" d="M620 80 Q720 50 760 90" fill="none" stroke="var(--sjw-vermil)" stroke-width="2"/>
      <g class="sjw-node"><circle cx="60" cy="80" r="10" fill="var(--sjw-ochre)"/><text x="60" y="110" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">R1</text></g>
      <g class="sjw-node"><circle cx="200" cy="55" r="10" fill="var(--sjw-ochre)"/><text x="200" y="40" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">R2</text></g>
      <g class="sjw-node"><circle cx="340" cy="80" r="10" fill="var(--sjw-celadon)"/><text x="340" y="110" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">R3</text></g>
      <g class="sjw-node"><circle cx="480" cy="105" r="10" fill="var(--sjw-celadon)"/><text x="480" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">R4</text></g>
      <g class="sjw-node"><circle cx="620" cy="80" r="10" fill="var(--sjw-vermil)"/><text x="620" y="110" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">R5</text></g>
      <g class="sjw-node"><circle class="sjw-pulse" cx="760" cy="90" r="12" fill="var(--sjw-vermil)"/><text x="760" y="120" text-anchor="middle" fill="var(--sjw-ochre)" font-size="10">R6</text></g>
      <text x="410" y="160" text-anchor="middle" fill="var(--sjw-paper-100)" font-size="13">综合层锚点（满员收束）</text>
      <rect class="sjw-node" x="70" y="180" width="200" height="70" rx="6" fill="var(--sjw-ink-800)" stroke="var(--sjw-ochre)"/>
      <text x="170" y="210" text-anchor="middle" fill="var(--sjw-ochre)" font-size="13">SJW-13 霸权交接</text>
      <text x="170" y="232" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">成员 01/07/11</text>
      <rect class="sjw-node" x="310" y="180" width="200" height="70" rx="6" fill="var(--sjw-ink-800)" stroke="var(--sjw-celadon)"/>
      <text x="410" y="210" text-anchor="middle" fill="var(--sjw-celadon)" font-size="13">SJW-17 去殖民区域</text>
      <text x="410" y="232" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">+ SJW-25 拉美深描</text>
      <rect class="sjw-node" x="550" y="180" width="200" height="70" rx="6" fill="var(--sjw-ink-800)" stroke="var(--sjw-paper-100)"/>
      <text x="650" y="210" text-anchor="middle" fill="var(--sjw-paper-100)" font-size="13">SJW-23 发展型谱系</text>
      <text x="650" y="232" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">+24韩 / +27台</text>
      <text x="410" y="300" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="11">弧线=扩张轮次 · 方块=综合矩阵 · 脉冲=本轮维护焦点</text>
    </svg>
  </div>
  <p class="sjw-viz-cap">图谱把六轮扩张与三张综合矩阵并置：深描卷喂给矩阵，矩阵再析出新单案——<b>回流台账</b>而非目录堆砌。</p>
</section>

<section class="sjw-sec" id="sec-viz-hub-tl">
  <div class="sjw-sec-h"><span class="num">Viz · 编年脊</span><h2>世界线主题时间脊（示意）</h2></div>
  <div class="sjw-stage">
    <svg viewBox="0 0 820 200" role="img" aria-label="世界线主题时间脊">
      <rect width="820" height="200" fill="var(--sjw-ink-900)"/>
      <text x="24" y="28" fill="var(--sjw-ochre)" font-size="11" font-family="ui-monospace,monospace">SJW-00 · 主题时间脊 · 非精确比例</text>
      <line class="sjw-draw" x1="40" y1="100" x2="780" y2="100" stroke="var(--sjw-line)" stroke-width="2"/>
      <g class="sjw-node"><circle cx="80" cy="100" r="7" fill="var(--sjw-ochre)"/><text x="80" y="75" text-anchor="middle" fill="var(--sjw-ochre)" font-size="10">工业</text><text x="80" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">11</text></g>
      <g class="sjw-node"><circle cx="180" cy="100" r="7" fill="var(--sjw-celadon)"/><text x="180" y="75" text-anchor="middle" fill="var(--sjw-celadon)" font-size="10">维也纳</text><text x="180" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">12/19</text></g>
      <g class="sjw-node"><circle cx="300" cy="100" r="7" fill="var(--sjw-vermil)"/><text x="300" y="75" text-anchor="middle" fill="var(--sjw-vermil)" font-size="10">大战</text><text x="300" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">02/20</text></g>
      <g class="sjw-node"><circle cx="420" cy="100" r="7" fill="var(--sjw-paper-100)"/><text x="420" y="75" text-anchor="middle" fill="var(--sjw-paper-100)" font-size="10">冷战核</text><text x="420" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">08/03</text></g>
      <g class="sjw-node"><circle cx="540" cy="100" r="7" fill="var(--sjw-ochre)"/><text x="540" y="75" text-anchor="middle" fill="var(--sjw-ochre)" font-size="10">货币锚</text><text x="540" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">16/26</text></g>
      <g class="sjw-node"><circle cx="660" cy="100" r="7" fill="var(--sjw-celadon)"/><text x="660" y="75" text-anchor="middle" fill="var(--sjw-celadon)" font-size="10">发展型</text><text x="660" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">15/23–27</text></g>
      <g class="sjw-node"><circle class="sjw-pulse" cx="760" cy="100" r="8" fill="var(--sjw-vermil)"/><text x="760" y="75" text-anchor="middle" fill="var(--sjw-vermil)" font-size="10">能源</text><text x="760" y="130" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="9">18/21</text></g>
    </svg>
  </div>
  <p class="sjw-viz-cap">编年脊帮助跨卷跳转：同一主题可落在不同 Round；点击下方卡片进入深描，而非在 Hub 内复述正文。</p>
</section>
'''
    html = inject_before_footer(html, hub_viz)
    html = ensure_viz_js(html)
    return html


def patch_file(path: Path) -> str:
    m = re.search(r"SJW-(\d+)", path.name)
    if not m:
        return "skip"
    n = int(m.group(1))
    html = path.read_text(encoding="utf-8")
    html = ensure_css(html)
    html = ensure_wrap_class(html)
    html = ensure_sig_anim(html)
    html = strip_old_extra_viz(html)

    if n == 0:
        html = patch_hub(html)
    else:
        html = inject_before_footer(html, build_extra(n))
        # light T2 version bump note for 01/08
        if n in (1, 8):
            html = re.sub(
                r"(版本 <b>)v0\.[0-9](</b>)",
                r"\1v0.6-t2\2",
                html,
                count=1,
            )

    # enhance signature stage path classes already done
    path.write_text(html, encoding="utf-8")
    svgs = html.count("<svg")
    return f"SJW-{n:02d} svgs={svgs}"


def main():
    results = []
    for path in sorted(ROOT.glob("SJW-*.html")):
        results.append(patch_file(path))
    print("\n".join(results))


if __name__ == "__main__":
    main()
