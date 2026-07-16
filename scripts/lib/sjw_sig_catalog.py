# -*- coding: utf-8 -*-
"""Catalog of unique signature motifs + node copy for SJW-00..32."""

# layout types (unique geometry engines in applicator):
# hub_arc, triple_arc, alliance_tri, tower_fracture, dual_lens,
# fork_tree, doctrine_funnel, baton_relay, mad_stairs, orbit_decay,
# river_fork, helix_industry, concert_table, anchor_chain, bifurcate_y,
# two_stage_break, money_links, region_rivers, carbon_wedge, revolt_spiral,
# catchup_knot, oil_triangle, dual_track, canopy_trunks,
# siphon_export, isi_debt, emu_gap, island_terrace,
# india_dual, sea_tigers, africa_rent, un_order, tech_standards

CAT = {}

def _e(n, motif, layout, title, guide, nodes, edges):
    """nodes: list of (id, title, sub, color_key, tag, body)"""
    CAT[n] = {
        "motif": motif, "layout": layout, "title": title, "guide": guide,
        "nodes": nodes, "edges": edges,
    }

CK = {"o": "var(--sjw-ochre)", "c": "var(--sjw-celadon)", "v": "var(--sjw-vermil)", "p": "var(--sjw-paper-100)", "l": "var(--sjw-line)"}

_e(0, "双轨弧线汇综合层", "hub_arc", "世界线扩张弧 · 三综合锚",
   "弧线编码 Round 扩张；下方三综合矩阵为满员收束锚点。",
   [
     ("r1","R1","01–04","o","MVP","崛起/大战/苏联/文明；四步法冻结。"),
     ("r2","R2","05–08","o","扩充","社运/地缘/英美/核划界。"),
     ("r3","R3","09–13","c","综合起","衰变+霸权矩阵。"),
     ("r4","R4","14–18","c","收口","大分流/日本/货币/能源。"),
     ("r5","R5","19–23","v","深化","大革命/德国/石油/发展型矩阵。"),
     ("r6","R6","24–27","v","析出","韩/拉美/欧元/台。"),
     ("m13","SJW-13","霸权交接","o","综合","成员01/07/11。"),
     ("m17","SJW-17","去殖民区域","c","综合","三河道；拉美→25。"),
     ("m23","SJW-23","发展型谱系","p","综合","日韩新中台；禁儒家常数。"),
   ],
   {"r1":["arc1","feed1"],"r2":["arc1"],"r3":["arc1","arc2","feed2"],"r4":["arc2"],"r5":["arc2","feed3"],"r6":["arc2","feed3"],"m13":["feed1"],"m17":["feed2"],"m23":["feed3"]})

_e(1, "三弧叠合崛起窗口", "triple_arc", "财政·海权·制度 三弧窗口",
   "三弧叠合为相对优势窗口；关闭后路径锁定。",
   [
     ("finance","财政—信用","公债/银行","o","轴一","近代崛起引燃件。"),
     ("institution","制度学习","议会/官僚","c","轴二","吸收窗口的组织条件。"),
     ("naval","军事—海权","航运投射","v","轴四","护航强制商业秩序。"),
     ("window","崛起窗口","叠合区","p","核心","三弧短暂叠合。"),
     ("nl","荷兰","17c","o","案例","联省财政+航运。"),
     ("uk","英国","工海权","c","案例","银行+工业+海权。"),
     ("us","美国","规模信用","v","案例","大陆市场+美元。"),
     ("lock","路径锁定","窗口后","l","关闭","追赶者面对新相对价格。"),
   ],
   {"finance":["arcF","toW1"],"institution":["arcI","toW2"],"naval":["arcM","toW3"],"window":["toW1","toW2","toW3"],"nl":["arcF"],"uk":["arcI"],"us":["arcM"],"lock":["arcM"]})

_e(2, "联盟死结→总体战", "alliance_tri", "同盟锁死 · 总体战 · 凡尔赛回弹",
   "三角死结升级局部危机；战后惩罚再播种。",
   [
     ("entente","协约锁","法俄英","c","联盟","刚性承诺压缩回旋。"),
     ("central","同盟锁","德奥","o","联盟","对称刚性。"),
     ("spark","萨拉热窝","1914","v","扳机","义务链升级。"),
     ("total","总体战","动员透支","o","财政/基座","工业动员改写契约。"),
     ("versailles","凡尔赛","惩罚结构","p","秩序","修正主义动能。"),
     ("rearm","再武装","1930s","v","窗口","危机合流。"),
     ("nuclear","核门槛","→08","l","差异","升级函数改写。"),
   ],
   {"entente":["tri1","tri3"],"central":["tri2","tri3"],"spark":["tri1","tri2","tri3","up1"],"total":["up1","up2"],"versailles":["up1","up3"],"rearm":["up2"],"nuclear":["up3"]})

_e(3, "动员塔→多轴碎裂", "tower_fracture", "指令动员塔 · 超强 · 共振解体",
   "上升为动员塔峰；解体是多轴碎裂非单因。",
   [
     ("base","基座动员","强制工业","o","轴五","产能抬升代价极高。"),
     ("party","党—国家","干部循环","c","轴二","任命替代市场。"),
     ("peak","超强对峙","1945–","p","相位","军备锁定资源。"),
     ("fiscal","军费挤占","财政轴","o","轴一","透支侵蚀改革。"),
     ("legit","叙事折旧","合法性","p","轴三","双轨磨损。"),
     ("elite","精英僵化","循环失败","c","轴二","信息失真。"),
     ("national","民族裂隙","联邦轴","v","联邦","退出选项。"),
     ("break","1991解体","多轴共振","v","终点","同时越阈。"),
   ],
   {"base":["up1"],"party":["up1","up2"],"peak":["up2","up3","ray1","ray2"],"fiscal":["ray1"],"elite":["ray2"],"legit":["ray3"],"national":["ray4"],"break":["up3","ray1","ray2","ray3","ray4"]})

_e(4, "双透镜边界闸", "dual_lens", "比较史学 × 三体思想实验闸",
   "史鉴台账与思想实验中隔命名边界闸。",
   [
     ("hist","比较史学","兴衰台账","c","透镜","可证伪台账。"),
     ("mech","机制台账","四步法","o","史鉴","可与中华线对照。"),
     ("gate","命名边界闸","史鉴≠三体","v","铁律","动力学不合并。"),
     ("santi","三体透镜","思想实验","o","可深链","禁直接处方。"),
     ("det","威慑工具箱","谢林划界","p","划界","模拟器≠编年。"),
     ("warn","禁止项","黑暗森林","v","质量门","不得写成史常数。"),
   ],
   {"hist":["h1"],"mech":["h2"],"gate":["h1","h2","s1","s2","w"],"santi":["s1"],"det":["s2"],"warn":["w"]})

print("catalog stub written part1")
