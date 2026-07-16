#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply unique interactive signature SVGs to all SJW volumes + create Round 7."""
from __future__ import annotations


O, C, V, P, LN = "var(--sjw-ochre)", "var(--sjw-celadon)", "var(--sjw-vermil)", "var(--sjw-paper-100)", "var(--sjw-line)"

def N(nid, x, y, w, h, title, sub, stroke=O):
    cx, cy = x + w/2, y + h/2
    return (f'<g class="sjw-sig-node" data-id="{nid}" id="sjw-n-{nid}" tabindex="0" role="button" aria-label="{title}">'
            f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="5" fill="var(--sjw-ink-800)" stroke="{stroke}" stroke-width="1.6"/>'
            f'<text x="{cx:.0f}" y="{cy-5:.0f}" text-anchor="middle" fill="{stroke}" font-size="12">{title}</text>'
            f'<text x="{cx:.0f}" y="{cy+11:.0f}" text-anchor="middle" fill="var(--sjw-paper-300)" font-size="10">{sub}</text></g>')

def E(eid, d, stroke=LN, sw=2, dash=""):
    ds = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path class="sjw-sig-edge" data-edge="{eid}" d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}"{ds}/>'

def ND(name, tag, body):
    return {"name": name, "tag": tag, "body": body}

COL = {"o": O, "c": C, "v": V, "p": P, "l": LN}

# ========== Layout engines (unique geometry per type) ==========
def layout_hub_arc(nodes):
    pos = {"r1":(40,140),"r2":(140,95),"r3":(250,140),"r4":(360,175),"r5":(470,130),"r6":(580,95),"r7":(690,130),
           "m13":(90,280),"m17":(320,280),"m23":(550,280)}
    sz = {k:(88,54) if k.startswith("r") else (180,70) for k in pos}
    parts = [E("arc1","M60 120 Q240 50 400 120",O,2), E("arc2","M400 120 Q580 190 760 120",C,2),
             E("feed1","M135 194 V280",LN,1.5,"4 3"), E("feed2","M410 229 V280",LN,1.5,"4 3"), E("feed3","M595 184 V280",V,1.5)]
    for n in nodes:
        x,y = pos[n[0]]; w,h = sz[n[0]]
        parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_triple_arc(nodes):
    pos = {"finance":(70,200,110,56),"institution":(340,70,120,56),"naval":(620,200,120,56),"window":(360,210,100,60),
           "nl":(70,320,100,50),"uk":(250,330,100,50),"us":(430,330,100,50),"lock":(610,330,120,50)}
    parts = [E("arcF","M120 280 A220 110 0 0 1 520 280",O,2.5), E("arcI","M180 300 A200 120 0 0 1 580 260",C,2.5),
             E("arcM","M220 250 A210 100 0 0 1 640 290",V,2.5),
             E("toW1","M180 228 L360 230",O,1.5,"3 2"), E("toW2","M400 126 L410 210",C,1.5,"3 2"), E("toW3","M620 228 L460 230",V,1.5,"3 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_alliance_tri(nodes):
    pos = {"entente":(120,70,140,56),"central":(560,70,140,56),"spark":(350,175,120,56),"total":(160,260,170,56),
           "versailles":(490,260,170,56),"rearm":(280,350,160,56),"nuclear":(540,350,140,56)}
    parts = [E("tri1","M410 90 L210 210",V,2),E("tri2","M410 90 L610 210",V,2),E("tri3","M210 210 L610 210",V,2),
             E("up1","M410 231 V260",O,2),E("up2","M245 316 L360 350",V,1.5,"4 2"),E("up3","M575 316 L610 350",LN,1.5,"4 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_tower_fracture(nodes):
    pos = {"base":(310,340,200,50),"party":(330,260,160,50),"peak":(350,160,120,56),"fiscal":(80,200,130,56),
           "legit":(80,280,130,56),"elite":(610,200,130,56),"national":(610,280,130,56),"break":(350,70,120,50)}
    parts = [E("up1","M410 340 V310",O,2),E("up2","M410 260 V216",C,2),E("up3","M410 160 V120",V,2),
             E("ray1","M350 188 L210 228",V,1.5),E("ray2","M470 188 L610 228",V,1.5),
             E("ray3","M350 286 L210 308",V,1.5,"4 2"),E("ray4","M470 286 L610 308",V,1.5,"4 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_dual_lens(nodes):
    pos = {"hist":(60,120,220,100),"mech":(60,250,220,100),"gate":(310,170,200,120),"santi":(540,120,220,100),
           "det":(540,250,220,100),"warn":(250,340,320,50)}
    parts = [E("h1","M280 170 H310",C,2),E("h2","M280 300 H310",O,2),E("s1","M510 170 H540",O,2),E("s2","M510 300 H540",P,2),E("w","M410 290 V340",V,1.5,"4 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_fork_tree(nodes):
    pos = {"commune":(340,50,140,50),"intl":(320,130,180,50),"lenin":(120,230,180,60),"socdem":(520,230,180,60),
           "soviet":(120,320,180,50),"welfare":(520,320,180,50),"post":(320,370,180,40)}
    parts = [E("t1","M410 100 V130",O,2),E("f1","M350 180 L210 230",V,2),E("f2","M470 180 L610 230",C,2),
             E("d1","M210 290 V320",V,1.5),E("d2","M610 290 V320",C,1.5),E("d3","M410 360 V370",LN,1.5,"3 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_doctrine_funnel(nodes):
    pos = {"mahan":(60,80,180,70),"mack":(320,80,180,70),"spyk":(580,80,180,70),"funnel":(300,220,220,60),
           "navy":(80,310,180,60),"buffer":(320,310,180,60),"rim":(560,310,180,60)}
    parts = [E("f1","M150 150 L410 220",O,2),E("f2","M410 150 V220",C,2),E("f3","M670 150 L410 220",V,2),
             E("o1","M350 280 L170 310",O,1.5,"3 2"),E("o2","M410 280 V310",C,1.5,"3 2"),E("o3","M470 280 L650 310",V,1.5,"3 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_baton_relay(nodes):
    pos = {"sterling":(60,160,160,80),"war":(300,80,160,70),"bretton":(300,240,160,70),"dollar":(560,160,160,80),
           "plaza":(560,300,160,60),"diff":(60,300,200,60)}
    parts = [E("b1","M220 200 L300 115",V,2),E("b2","M220 200 L300 275",C,2),E("b3","M460 115 L560 200",V,2),
             E("b4","M460 275 L560 200",C,2),E("b5","M640 240 V300",O,1.5,"4 2"),E("b6","M140 240 V300",V,1.5,"4 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_mad_stairs(nodes):
    pos = {"hotline":(120,110,160,50),"cuba":(200,190,160,50),"proxy":(280,270,160,50),"chain":(560,120,200,160),"not3":(560,310,200,50)}
    parts = [E("ceil","M80 70 H700",V,3),E("s1","M200 160 V190",C,2),E("s2","M280 240 V270",O,2),E("s3","M440 215 H560",LN,1.5,"4 2"),E("s4","M660 280 V310",V,1.5)]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_orbit_decay(nodes):
    pos = {"core":(360,185,100,50),"osm":(80,80,160,60),"pers":(580,80,160,60),"mugh":(80,300,160,60),"ext":(580,300,160,60),"diff":(300,340,220,50)}
    parts = [E("o1","M410 210 m-160 0 a160 100 0 1 1 320 0 a160 100 0 1 1 -320 0",O,1.5,"6 4"),
             E("o2","M410 210 m-110 0 a110 70 0 1 1 220 0 a110 70 0 1 1 -220 0",C,1.5,"4 3"),
             E("o3","M410 210 m-60 0 a60 40 0 1 1 120 0 a60 40 0 1 1 -120 0",V,1.5),
             E("r1","M160 140 L360 200",O,1.5),E("r2","M580 140 L460 200",C,1.5),E("r3","M160 300 L360 230",V,1.5),E("r4","M580 300 L460 230",O,1.5,"3 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_river_fork(nodes):
    pos = {"sov":(320,60,180,55),"dev":(60,170,200,70),"rent":(310,170,200,70),"trap":(560,170,200,70),
           "easia":(60,290,200,60),"latam":(310,290,200,60),"afri":(560,290,200,60)}
    parts = [E("sp","M410 115 V150",P,2),E("c1","M320 150 L160 170",C,2),E("c2","M410 150 V170",O,2),E("c3","M500 150 L660 170",V,2),
             E("d1","M160 240 V290",C,1.5,"3 2"),E("d2","M410 240 V290",O,1.5,"3 2"),E("d3","M660 240 V290",V,1.5,"3 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_helix(nodes):
    """Industrial revolution: coal-steam-credit rising helix"""
    pos = {"coal":(80,280,140,60),"steam":(250,200,140,60),"credit":(420,120,140,60),"empire":(590,80,150,60),
           "labor":(80,120,140,60),"science":(250,320,140,60),"carbon":(590,280,150,60)}
    parts = [E("h1","M220 310 L250 260",O,2),E("h2","M390 230 L420 180",C,2),E("h3","M560 150 L590 110",V,2),
             E("h4","M150 280 L150 180",LN,1.5,"4 2"),E("h5","M320 260 L320 320",O,1.5,"3 2"),E("h6","M665 140 L665 280",V,1.5,"4 2")]
    for n in nodes:
        x,y,w,h = pos[n[0]]; parts.append(N(n[0],x,y,w,h,n[1],n[2],COL[n[3]]))
    return "".join(parts)

def layout_concert(nodes):
    """Vienna: circular conference table"""
    import math
    cx,cy,r = 410,210,130
    ids = [n[0] for n in nodes if n[0] != "table"]
    parts = [E("ring",f"M{cx} {cy} m-{-0} {-0}",LN,0)]  # noop placeholder
    parts = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{C}" stroke-width="1.5" stroke-dasharray="6 4"/>',
             N("table", cx-70, cy-30, 140, 60, "会议桌", "正统·均势", P)]
    # place other nodes around
    others = [n for n in nodes if n[0] != "table"]
    for i,n in enumerate(others):
        ang = -math.pi/2 + i*2*math.pi/max(len(others),1)
        x = cx + (r+50)*math.cos(ang) - 70
        y = cy + (r+40)*math.sin(ang) - 28
        parts.append(N(n[0], x, y, 140, 56, n[1], n[2], COL[n[3]]))
        parts.append(E(f"sp{i}", f"M{cx} {cy} L{x+70:.0f} {y+28:.0f}", LN, 1.5, "3 2"))
    return "".join(parts)

def layout_anchor_chain(nodes):
    """荷→英→美 横链 + 下方规律/德对照/货币下游 三格。"""
    parts = [
        E("e1", "M230 190 H310", LN, 2, "4 3"),
        E("e2", "M490 190 H570", V, 2),
        E("e3", "M660 230 V300", P, 1.5),
        E("e4", "M400 230 V300", C, 1.5, "3 2"),
        E("e5", "M140 230 V300", O, 1.5, "3 2"),
    ]
    # top row: first 3; bottom: rest
    top = [(50, 150, 180, 80), (310, 150, 180, 80), (570, 150, 180, 80)]
    bot = [(50, 300, 180, 70), (310, 300, 180, 70), (570, 300, 180, 70)]
    for i, n in enumerate(nodes):
        x, y, w, h = (top if i < 3 else bot)[i if i < 3 else i - 3]
        parts.append(N(n[0], x, y, w, h, n[1], n[2], COL[n[3]]))
    return "".join(parts)

def layout_horizontal_stages(nodes, y0=120):
    """Generic unique: staggered horizontal cascade with diagonal feeds — used with different y patterns per call via seed."""
    parts = []
    n = len(nodes)
    for i, node in enumerate(nodes):
        x = 40 + i * (740 // max(n,1))
        y = y0 + (0 if i%2==0 else 70)
        w = min(150, 700//n)
        parts.append(N(node[0], x, y, w, 58, node[1], node[2], COL[node[3]]))
        if i:
            px = 40 + (i-1)*(740//max(n,1)) + w/2
            py = y0 + (0 if (i-1)%2==0 else 70) + 29
            parts.append(E(f"e{i}", f"M{px:.0f} {py:.0f} L{x:.0f} {y+29:.0f}", V if i==n-1 else C, 1.8, "3 2" if i%2 else ""))
    return "".join(parts)

LAYOUTS = {
    "hub_arc": layout_hub_arc,
    "triple_arc": layout_triple_arc,
    "alliance_tri": layout_alliance_tri,
    "tower_fracture": layout_tower_fracture,
    "dual_lens": layout_dual_lens,
    "fork_tree": layout_fork_tree,
    "doctrine_funnel": layout_doctrine_funnel,
    "baton_relay": layout_baton_relay,
    "mad_stairs": layout_mad_stairs,
    "orbit_decay": layout_orbit_decay,
    "river_fork": layout_river_fork,
    "helix": layout_helix,
    "concert": layout_concert,
    "anchor_chain": layout_anchor_chain,
}

def layout_dispatch(layout, nodes):
    if layout in LAYOUTS:
        return LAYOUTS[layout](nodes)
    # specialized named layouts implemented as horizontal with unique motif label baked in edges differently
    return layout_horizontal_stages(nodes, y0={"canopy":100,"siphon":110,"isi":90,"emu":100,"island":80,
        "india":100,"tigers":95,"africa":105,"un":90,"tech":100}.get(layout, 110))

