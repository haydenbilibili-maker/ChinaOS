# -*- coding: utf-8 -*-
"""Unique SJW signature geometries by motif family. No shared vertical-axis clone."""
from __future__ import annotations

def N(nid, x, y, w, h, title, sub, stroke="var(--sjw-ochre)"):
    cx, cy = x + w / 2, y + h / 2
    return (
        f'<g class="sjw-sig-node" data-id="{nid}" id="sjw-n-{nid}" tabindex="0" role="button" aria-label="{title}">'
        f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="5" fill="var(--sjw-ink-800)" stroke="{stroke}" stroke-width="1.6"/>'
        f'<text x="{cx:.0f}" y="{cy-5:.0f}" text-anchor="middle" fill="{stroke}" font-size="12">{title}</text>'
        f'<text x="{cx:.0f}" y="{cy+11:.0f}" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">{sub}</text>'
        f'</g>'
    )

def E(eid, d, stroke="var(--sjw-line)", sw=2, dash=""):
    ds = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path class="sjw-sig-edge" data-edge="{eid}" d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}"{ds}/>'

def L(x, y, text, fill="var(--sjw-paper-300)", size=10):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-family="ui-monospace,monospace">{text}</text>'

def ND(name, tag, body):
    return {"name": name, "tag": tag, "body": body}

def pack(motif, title, guide, legend, svg, nodes, edges):
    return {"motif": motif, "title": title, "guide": guide, "legend": legend, "svg": svg, "nodes": nodes, "edges": edges}

O, C, V, P, LN = "var(--sjw-ochre)", "var(--sjw-celadon)", "var(--sjw-vermil)", "var(--sjw-paper-100)", "var(--sjw-line)"

SIGS: dict[int, dict] = {}

SIGS[0] = pack(
    "双轨弧线汇综合层", "世界线扩张弧 · 三综合锚",
    "弧线编码 Round 扩张，下方三块为满员综合矩阵；点击节点查看职责边界。",
    f'<span><i style="background:{O}"></i>扩张轮次</span><span><i style="background:{C}"></i>综合矩阵</span><span><i style="background:{V}"></i>焦点</span>',
    "".join([
        E("arc1", "M70 120 Q250 50 430 120", O, 2), E("arc2", "M430 120 Q610 190 750 110", C, 2),
        L(360, 70, "Round 扩张弧", P, 12),
        N("r1", 50, 140, 90, 54, "R1", "01–04", O), N("r2", 160, 95, 90, 54, "R2", "05–08", O),
        N("r3", 290, 140, 90, 54, "R3", "09–13", C), N("r4", 420, 175, 90, 54, "R4", "14–18", C),
        N("r5", 550, 130, 90, 54, "R5", "19–23", V), N("r6", 680, 95, 90, 54, "R6", "24–27", V),
        N("m13", 90, 280, 180, 70, "SJW-13", "霸权交接", O), N("m17", 320, 280, 180, 70, "SJW-17", "去殖民区域", C),
        N("m23", 550, 280, 180, 70, "SJW-23", "发展型谱系", P),
        E("feed1", "M135 194 V280", LN, 1.5, "4 3"), E("feed2", "M410 229 V280", LN, 1.5, "4 3"), E("feed3", "M595 184 V280", V, 1.5),
    ]),
    {k: ND(*v) for k, v in {
        "r1": ("Round 1", "MVP", "崛起/大战/苏联/文明；四步法与五轴模板冻结。"),
        "r2": ("Round 2", "扩充", "社运/地缘/英美/冷战核划界。"),
        "r3": ("Round 3", "综合层起", "衰变对照 + 霸权矩阵 SJW-13。"),
        "r4": ("Round 4", "主线收口", "大分流/日本/货币/区域/能源。"),
        "r5": ("Round 5", "深化", "大革命/德国/石油/改革/发展型矩阵。"),
        "r6": ("Round 6", "析出单案", "韩/拉美/欧元/台对照。"),
        "m13": ("SJW-13", "综合", "成员01/07/11；信用锚迁移规律。"),
        "m17": ("SJW-17", "综合", "三河道对照；拉美→25。"),
        "m23": ("SJW-23", "综合", "日韩新中台；禁儒家常数。"),
    }.items()},
    {"r1":["arc1","feed1"],"r2":["arc1"],"r3":["arc1","arc2","feed2"],"r4":["arc2"],"r5":["arc2","feed3"],"r6":["arc2","feed3"],"m13":["feed1"],"m17":["feed2"],"m23":["feed3"]},
)

SIGS[1] = pack(
    "三弧叠合崛起窗口", "财政·海权·制度 三弧窗口",
    "三弧叠合处为相对优势窗口；关闭后路径锁定。禁止读成文化宿命。",
    f'<span><i style="background:{O}"></i>财政</span><span><i style="background:{C}"></i>制度</span><span><i style="background:{V}"></i>海权</span>',
    "".join([
        E("arcF","M120 280 A220 110 0 0 1 520 280",O,2.5), E("arcI","M180 300 A200 120 0 0 1 580 260",C,2.5), E("arcM","M220 250 A210 100 0 0 1 640 290",V,2.5),
        N("finance",70,200,110,56,"财政—信用","公债/银行",O), N("institution",340,70,120,56,"制度学习","议会/官僚",C),
        N("naval",620,200,120,56,"军事—海权","航运投射",V), N("window",360,210,100,60,"崛起窗口","叠合区",P),
        N("nl",70,320,100,50,"荷兰","17c",O), N("uk",250,330,100,50,"英国","工海权",C), N("us",430,330,100,50,"美国","规模信用",V), N("lock",610,330,120,50,"路径锁定","窗口后",LN),
        E("toW1","M180 228 L360 230",O,1.5,"3 2"), E("toW2","M400 126 L410 210",C,1.5,"3 2"), E("toW3","M620 228 L460 230",V,1.5,"3 2"),
    ]),
    {k:ND(*v) for k,v in {"finance":("财政—信用弧","轴一","公债与央行信用是近代崛起引燃件。"),"institution":("制度学习弧","轴二","组织能力决定窗口吸收效率。"),"naval":("军事—海权弧","轴四","护航把商业网变成可强制秩序。"),"window":("崛起窗口","叠合","三弧短暂叠合；关闭后难原样复制。"),"nl":("荷兰行","案例","联省财政+航运据点。"),"uk":("英国行","案例","银行+工业+海权。"),"us":("美国行","案例","大陆市场+美元+两洋。"),"lock":("路径锁定","关闭后","追赶者面对不同相对价格。")}.items()},
    {"finance":["arcF","toW1"],"institution":["arcI","toW2"],"naval":["arcM","toW3"],"window":["toW1","toW2","toW3"],"nl":["arcF"],"uk":["arcI"],"us":["arcM"],"lock":["arcM"]},
)

SIGS[2] = pack(
    "联盟死结→总体战熔炉", "同盟锁死 · 总体战 · 凡尔赛回弹",
    "三角死结把局部危机升级为体系战争；战后惩罚结构再播种。",
    f'<span><i style="background:{V}"></i>死结</span><span><i style="background:{O}"></i>透支</span><span><i style="background:{C}"></i>秩序</span>',
    "".join([
        E("tri1","M410 90 L210 210",V,2), E("tri2","M410 90 L610 210",V,2), E("tri3","M210 210 L610 210",V,2),
        N("entente",120,70,140,56,"协约锁","法俄英",C), N("central",560,70,140,56,"同盟锁","德奥",O),
        N("spark",350,175,120,56,"萨拉热窝","扳机 1914",V), N("total",160,260,170,56,"总体战","动员透支",O),
        N("versailles",490,260,170,56,"凡尔赛","惩罚结构",P), N("rearm",280,350,160,56,"再武装","1930s",V), N("nuclear",540,350,140,56,"核门槛","→SJW-08",LN),
        E("up1","M410 231 V260",O,2), E("up2","M245 316 L360 350",V,1.5,"4 2"), E("up3","M575 316 L610 350",LN,1.5,"4 2"),
    ]),
    {k:ND(*v) for k,v in {"entente":("协约锁","联盟","刚性承诺压缩外交回旋。"),"central":("同盟锁","联盟","对称刚性形成死结。"),"spark":("萨拉热窝","1914","局部事件经义务链升级。"),"total":("总体战","财政/基座","工业动员改写社会契约。"),"versailles":("凡尔赛","秩序","惩罚安排埋修正主义动能。"),"rearm":("再武装窗口","1930s","危机与修正主义合流。"),"nuclear":("核门槛","临界差异","升级函数改写见 SJW-08。")}.items()},
    {"entente":["tri1","tri3"],"central":["tri2","tri3"],"spark":["tri1","tri2","tri3","up1"],"total":["up1","up2"],"versailles":["up1","up3"],"rearm":["up2"],"nuclear":["up3"]},
)

SIGS[3] = pack(
    "动员塔峰→多轴碎裂", "指令动员塔 · 超强 · 共振解体",
    "上升为动员型工业化塔峰；解体是多轴碎裂而非单因倒塌。",
    f'<span><i style="background:{O}"></i>汲取</span><span><i style="background:{V}"></i>碎裂</span><span><i style="background:{C}"></i>精英</span>',
    "".join([
        N("base",310,340,200,50,"基座动员","强制工业化",O),
        N("party",330,260,160,50,"党—国家","干部循环",C),
        N("peak",350,160,120,56,"超强对峙","1945–",P),
        N("fiscal",80,200,130,56,"军费挤占","财政轴",O),
        N("legit",80,280,130,56,"叙事折旧","合法性",P),
        N("elite",610,200,130,56,"精英僵化","循环失败",C),
        N("national",610,280,130,56,"民族裂隙","联邦轴",V),
        N("break",350,70,120,50,"1991 解体","多轴共振",V),
        E("up1","M410 340 V310",O,2), E("up2","M410 260 V216",C,2), E("up3","M410 160 V120",V,2),
        E("ray1","M350 188 L210 228",V,1.5), E("ray2","M470 188 L610 228",V,1.5),
        E("ray3","M350 286 L210 308",V,1.5,"4 2"), E("ray4","M470 286 L610 308",V,1.5,"4 2"),
    ]),
    {k:ND(*v) for k,v in {"base":("基座动员","轴五","强制工业化抬升产能，代价极高。"),"party":("党—国家","轴二","干部任命替代市场配置。"),"peak":("超强对峙","相位","两极军备竞赛锁定资源。"),"fiscal":("军费挤占","轴一","财政透支侵蚀改革空间。"),"legit":("叙事折旧","轴三","绩效与意识形态双轨磨损。"),"elite":("精英僵化","轴二","循环失败放大信息失真。"),"national":("民族裂隙","联邦","加盟共和国退出选项。"),"break":("1991 解体","共振","多轴同时越阈，非单因。")}.items()},
    {"base":["up1"],"party":["up1","up2"],"peak":["up2","up3","ray1","ray2"],"fiscal":["ray1"],"elite":["ray2"],"legit":["ray3"],"national":["ray4"],"break":["up3","ray1","ray2","ray3","ray4"]},
)

SIGS[4] = pack(
    "双透镜边界闸", "比较史学透镜 × 三体思想实验闸",
    "左史鉴机制台账、右思想实验；中部边界闸禁止动力学命名合并。",
    f'<span><i style="background:{C}"></i>史鉴</span><span><i style="background:{V}"></i>边界</span><span><i style="background:{O}"></i>三体透镜</span>',
    "".join([
        N("hist",60,120,220,100,"比较史学","兴衰台账",C),
        N("mech",60,250,220,100,"机制台账","四步法产物",O),
        N("gate",310,170,200,120,"命名边界闸","史鉴≠三体",V),
        N("santi",540,120,220,100,"三体透镜","思想实验",O),
        N("det",540,250,220,100,"威慑工具箱","谢林·划界",P),
        N("warn",250,340,320,50,"禁止导出黑暗森林为世界史规律","",V),
        E("h1","M280 170 H310",C,2), E("h2","M280 300 H310",O,2),
        E("s1","M510 170 H540",O,2), E("s2","M510 300 H540",P,2),
        E("w","M410 290 V340",V,1.5,"4 2"),
    ]),
    {k:ND(*v) for k,v in {"hist":("比较史学","透镜","文明兴衰用可证伪台账，不作玄学判词。"),"mech":("机制台账","史鉴","四步法产物可与中华线对照。"),"gate":("命名边界闸","铁律","史鉴=历史机制；三体=思想实验。"),"santi":("三体透镜","可深链","猜疑链可对照，禁直接处方。"),"det":("威慑工具箱","划界","谢林模拟器≠冷战编年。"),"warn":("禁止项","质量门","黑暗森林不得写成世界史常数。")}.items()},
    {"hist":["h1"],"mech":["h2"],"gate":["h1","h2","s1","s2","w"],"santi":["s1"],"det":["s2"],"warn":["w"]},
)

