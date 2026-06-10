#!/usr/bin/env python3
"""Generate figureMilitary2026.js — PLA active flag officers (少将及以上).

Sources (embedded + optional live fetch):
  - Wikipedia navbox: Template:中华人民共和国现役上将 / 现役中将
  - 中华人民共和国现役正战区级以上将领列表 (CMC supplement)
  - 公开晋衔报道汇总（澎湃新闻等，2016–2018 批次少将）
  - 2025–2026 公开报道现役少将岗位补录

Note: 现役少将无官方集中名录；少将条为公开报道可核实子集，晋升或退役后需增量更新。
"""

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app/src/lib/db/figureMilitary2026.js"
CACHE = Path(__file__).resolve().parent / ".cache" / "mil_wiki.json"

# Embedded wikitext (snapshot 2026-06, zh.wikipedia) — avoids API rate limits
WIKI_SHANG = r"""{{Navbox
|name = 中华人民共和国现役上将
|group1 = [[:Category:中国人民解放军上将|<span style="color:yellow;">陆军上将</span>]]
|list1 = * [[徐起零]]（中央军委联合参谋部副参谋长）
* [[吴亚男 (陆军)|吴亚男]]（南部战区司令员）
* [[汪海江]]（西部战区司令员）
* [[黄铭]]（北部战区司令员）
* [[郑璇]]（北部战区政治委员）
* [[徐德清]]（中部战区政治委员）
* [[陈辉 (上将)|陈辉]]（陆军政治委员）
* [[杨学军]]（中央军委战略规划委员会专职委员）
* [[凌焕新]]（军事科学院政治委员）
* [[肖天亮]]（国防大学校长）
|group2 = [[:Category:中国人民解放军海军上将|<span style="color:yellow;">海军上将</span>]]
|list2 = * [[董军 (海军)|董军]]（国防部部长）
|group3 = [[:Category:中国人民解放军空军上将|<span style="color:yellow;">空军上将</span>]]
|list3 = * [[许学强 (空军)|许学强]]（中央军委装备发展部部长）
* [[杨志斌]]（东部战区司令员）
* [[韩胜延]]（中部战区司令员）
* [[常丁求]]（空军司令员）
* [[郭普校]]（空军政治委员）
|group4 = [[:Category:中国人民解放军火箭军上将|<span style="color:yellow;">火箭军上将</span>]]
|list4 = * [[张升民]]（中央军委副主席、军委纪委书记、监委主任）
}}"""

WIKI_ZHONG = r"""{{Navbox
|name = 中华人民共和国现役中将
|group1 = [[:Category:中国人民解放军中将|<span style="color:yellow;">陆军中将</span>]]
|list1 = {{div col|3}}
军委联合参谋部副参谋长：[[祝传生]]<br/>
军委纪律检查委员会副书记：[[张帆 (海军)|张帆]]<br/>
军委联合作战指挥中心副主任：[[郑守东]]<br/>
战区副司令员：[[彭京堂]]<br/>
战区参谋长：[[张践]]<br/>
战区政治工作部主任：[[梁平 (中将)|梁平]]<br/>
陆军副司令员：[[吴爱民]]、[[付文化]]<br/>
陆军副政委：[[郑堰坡]]<br/>
陆军参谋长：[[蔡志军]]<br/>
陆军纪委书记：[[张曙光 (解放军)|张曙光]]<br/>
新疆军区司令员：[[文东 (中将)|文东]]<br/>
{{div col end}}
|group2 = [[:Category:中国人民解放军海军中将|<span style="color:yellow;">海军中将</span>]]
|list2 = {{div col|3}}
军委国防动员部部长：[[张立克 (中将)|张立克]]<br/>
军委政治工作部副主任：[[熊照元]]<br/>
战区副司令员：[[王显峰]]、[[魏文徽]]<br/>
战区参谋长：[[姜国平]]<br/>
战区政治工作部主任：[[李东友]]<br/>
海军副司令员：[[马立新 (1966年)|马立新]]<br/>
海军参谋长：[[张峥]]<br/>
海军政治工作部主任：[[胡瑜海]]<br/>
海军纪委书记：[[陈洪珂]]<br/>
战区海军政委：[[梅文]]<br/>
国防大学政委：[[夏志和]]<br/>
{{div col end}}
|group3 = [[:Category:中国人民解放军空军中将|<span style="color:yellow;">空军中将</span>]]
|list3 = {{div col|3}}
军委政治工作部副主任：[[陈德民]]、[[王成男]]<br/>
军委后勤保障部部长：[[陈炽 (空军)|陈炽]]<br/>
军委训练管理部部长：[[刘镝]]<br/>
军委科学技术委员会主任：[[徐为进]]<br/>
军委联合作战指挥中心副主任：[[董立]]<br/>
战区副司令员：[[文俊飞]]、[[孙向东]]、[[王洪勋]]<br/>
空军副司令员：[[王刚 (空军)|王刚]]<br/>
空军副政委：[[纪多]]<br/>
空军参谋长：[[尹伟]]<br/>
空军纪委书记：[[史洪干]]<br/>
战区空军司令员：[[刘文起 (解放军)|刘文起]]<br/>
战区空军政委：[[徐立谦]]、[[商亚恒]]<br/>
[[周俊强]]<br/>
{{div col end}}
|group4 = [[:Category:中国人民解放军火箭军中将|<span style="color:yellow;">火箭军中将</span>]]
|list4 = {{div col|3}}
战区政治工作部主任：[[张继春]]、[[张韶颖]]<br/>
火箭军副司令员：[[陈光军]]、[[朱晓松]]<br/>
火箭军副政委：[[丁兴农]]<br/>
火箭军参谋长：[[雷凯 (空军)|雷凯]]<br/>
火箭军政治工作部主任：[[周晶炯]]<br/>
{{div col end}}
|group5 = [[:Category:中国人民武装警察部队中将|<span style="color:yellow;">武警中将</span>]]
|list5 = {{div col|3}}
武警副司令员：[[朱文祥]]<br/>
武警副政委：[[王洪斌]]、[[朱国标]]<br/>
武警参谋长：[[趙東方]]<br/>
武警政治工作部主任：[[董文辉]]<br/>
武警纪委书记：[[赵永远]]<br/>
{{div col end}}
}}"""

# CMC / 战区级以上补录（维基导航模板未列或需与晋衔仪式交叉核实）
MANUAL_SHANG = [
    ("张又侠", "中央军委副主席", "陆军", "中央军委"),
    ("刘振立", "中央军委委员", "陆军", "中央军委"),
    ("景建峰", "东部战区政治委员", "空军", "东部战区"),
    ("李凤彪", "西部战区政治委员", "陆军", "西部战区"),
]

# 2016「八一」晋衔 · 陆军32 + 海军11 + 空军/火箭军/武警（澎湃新闻/搜狐军事公开名单）
PROMO_2016 = {
    "陆军": "毕见平、王文立、汪志斌、羊敏君、李斌、陶方元、刘本成、胡世军、赖文毅、孙明、南小冈、王良福、宋协峰、冷少杰、唐兴华、张凡迪、李志忠、吴建栋、郑守东、苏荣、李西楼、彭刚、胡建林、孙桂歆、杨振国、李穆涛、许永祥、苏群星、杨建昊、刘鲁生、李平、都基焱",
    "海军": "刘子柱、秦威、梁旭、徐立谦、赵纪成、李吉祥、严正明、王宇、柳恩涛、卢明章",
    "空军": "陈学猛、孙建忠、陈怀民、刘殿荣、陈加明、王建平、孙和国、李兵、韩胜延、宋文青",
    "火箭军": "周亚宁、王剑、张龙、李军、程坚、李福乾、刘光斌、曹东平",
    "武警": "施小琳、徐建华、齐建明、郑旭东、徐建华",
}

# 2018-06 晋衔 · 四军种53名少将（澎湃新闻）
PROMO_2018 = {
    "火箭军": "袁德华、周荣、张韶颖、刘惟云、樊具贤、孙乐、戴学志、王国庆",
    "陆军": "吴学军、王京、申文、边瑞峰、杨占武、王孝永、顾中、刘日明、田越、王信民、朱兵、娄纯泗、张勇、姜秀生、杨正根、裴晓昌、张建国、马宝川、杨忠、王志安、庞龙、张邦宁、马晓军、万明杰、项丰顺",
    "海军": "王显峰、张弓、李新科、杨懿、叱东学、喻文兵、陈万军、姚青生、金振中",
    "空军": "李国平、刘强、姜鹏、刘镝、宋进国、邱火林、陈炽、杨光福、吴德伟、雷迅、陈东",
}

# 2025–2026 公开报道 · 现役少将岗位（看中国网/新华社等）
RECENT_SHAO = [
    ("邱杨", "军委办公厅主任（代理）", "陆军", "中央军委办公厅"),
]

# 职务补正（维基链接消歧义括号干扰解析时使用）
TITLE_OVERRIDES = {
    "吴亚男": "南部战区司令员",
    "董军": "国防部部长",
    "许学强": "中央军委装备发展部部长",
    "陈辉": "陆军政治委员",
    "周俊强": "空军副司令员",
}

RANK_WORDS = {"上将", "中将", "少将", "陆军", "海军", "空军", "火箭军", "武警"}
PROMOTED_OR_REMOVED = {
    "郑守东", "张践", "王显峰", "张韶颖", "刘镝", "陈炽", "徐立谦", "韩胜延",
    "何卫东", "李尚福", "苗华", "王春宁", "何宏军", "林向阳", "秦树桐", "袁华智",
}

SKIP_IN_MILITARY = set()  # 政治库已载且军事库不重复收录（仍保留将官军衔维度时可注释）


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def clean_branch(raw):
    raw = re.sub(r"<[^>]+>", "", raw)
    for b in ("陆军", "海军", "空军", "火箭军", "武警", "战略支援", "联勤保障"):
        if b in raw:
            return b
    return "解放军"


def extract_title_after_link(part):
    rest = re.sub(r"\[\[[^\]]+\]\]", "", part).strip()
    m = re.search(r"[（(]([^）)]+)[）)]", rest)
    if not m:
        return ""
    title = m.group(1).strip()
    return "" if title in RANK_WORDS else title


def normalize_role(name, role, branch):
    role = TITLE_OVERRIDES.get(name) or role
    if role in RANK_WORDS or role == branch:
        role = TITLE_OVERRIDES.get(name, "")
    return role or branch


def parse_navbox(wt, default_rank):
    entries = []
    branch = ""
    current_list = None
    for line in wt.split("\n"):
        gm = re.match(r"\|group\d+\s*=\s*(.+)", line)
        if gm:
            branch = clean_branch(
                re.sub(
                    r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]",
                    lambda m: m.group(2) or m.group(1),
                    gm.group(1),
                )
            )
        lm = re.match(r"\|list\d+\s*=\s*(.*)", line)
        if lm:
            current_list = lm.group(1)
        elif current_list is not None and line.startswith("|"):
            current_list = None
        if current_list is None:
            continue
        chunk = (lm.group(1) if lm else line).replace("{{div col|3}}", "").replace("{{div col end}}", "")
        for part in re.split(r"(?<=\* )|(?=<br\s*/>)", chunk):
            part = part.lstrip("* ").strip()
            if not part:
                continue
            rm = re.match(r"([^：:]+)[：:](.+)", part)
            if rm:
                role, rest = rm.group(1).strip(), rm.group(2)
                for n, disp in re.findall(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", rest):
                    name = (disp or n).split("(")[0].strip()
                    if re.match(r"^[一-龥·]{2,4}$", name):
                        entries.append(
                            {"name": name, "role": role, "branch": branch, "rank": default_rank, "org": role}
                        )
            else:
                names = re.findall(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", part)
                title = extract_title_after_link(part)
                for n, disp in names:
                    name = (disp or n).split("(")[0].strip()
                    if re.match(r"^[一-龥·]{2,4}$", name):
                        role = normalize_role(name, title, branch)
                        entries.append(
                            {
                                "name": name,
                                "role": role,
                                "branch": branch,
                                "rank": default_rank,
                                "org": org_for_role(role, branch),
                            }
                        )
    return entries


def org_for_role(role, branch):
    for key in ("中央军委", "战区", "陆军", "海军", "空军", "火箭军", "武警", "国防大学", "军事科学院", "新疆军区", "西藏军区"):
        if key in role:
            return role.split("（")[0].split("兼")[0][:24] or key
    return branch or "解放军"


def merge_person(store, p):
    name = p["name"]
    rank = p["rank"]
    if name in PROMOTED_OR_REMOVED and rank == "少将":
        return
    if name in SKIP_IN_MILITARY:
        return
    key = (name, rank)
    prev = store.get(key)
    if not prev or len(p.get("role", "")) > len(prev.get("role", "")):
        store[key] = p


def collect_all():
    store = {}
    for e in parse_navbox(WIKI_SHANG, "上将"):
        e["role"] = normalize_role(e["name"], e["role"], e["branch"])
        e["org"] = org_for_role(e["role"], e["branch"])
        e["source"] = "维基百科·中华人民共和国现役上将导航模板"
        merge_person(store, e)
    for e in parse_navbox(WIKI_ZHONG, "中将"):
        e["role"] = normalize_role(e["name"], e["role"], e["branch"])
        e["org"] = org_for_role(e["role"], e["branch"])
        e["source"] = "维基百科·中华人民共和国现役中将导航模板"
        merge_person(store, e)
    for name, role, branch, org in MANUAL_SHANG:
        merge_person(
            store,
            {
                "name": name,
                "role": role,
                "branch": branch,
                "rank": "上将",
                "org": org,
                "source": "维基百科·现役正战区级以上将领列表/新华社晋衔报道",
            },
        )
    for branch, names in {**PROMO_2016, **PROMO_2018}.items():
        for name in re.split(r"[、,，\s]+", names):
            name = name.strip()
            if not re.match(r"^[一-龥]{2,4}$", name):
                continue
            merge_person(
                store,
                {
                    "name": name,
                    "role": "少将",
                    "branch": branch.replace("武警", "武警"),
                    "rank": "少将",
                    "org": branch,
                    "source": "澎湃新闻·公开晋衔仪式报道（2016/2018）",
                },
            )
    for name, role, branch, org in RECENT_SHAO:
        merge_person(
            store,
            {
                "name": name,
                "role": role,
                "branch": branch,
                "rank": "少将",
                "org": org,
                "source": "公开报道·2025-2026",
            },
        )
    rank_val = {"上将": 3, "中将": 2, "少将": 1}
    by_name = {}
    for p in store.values():
        if p["name"] in PROMOTED_OR_REMOVED and p["rank"] == "少将":
            continue
        r = rank_val[p["rank"]]
        prev = by_name.get(p["name"])
        if not prev or rank_val[prev["rank"]] < r:
            by_name[p["name"]] = p
    return sorted(
        by_name.values(),
        key=lambda x: ({"上将": 0, "中将": 1, "少将": 2}[x["rank"]], x["name"]),
    )


def mk_row(p):
    role = esc(p["role"] or p["rank"])
    org = esc(p.get("org") or p["branch"])
    branch = esc(p["branch"])
    source = esc(p["source"])
    return f"""  M('{esc(p["name"])}', '{p["rank"]}', '{role}', '{org}', '{branch}', '{source}')"""


def main():
    people = collect_all()
    shang = sum(1 for p in people if p["rank"] == "上将")
    zhong = sum(1 for p in people if p["rank"] == "中将")
    shao = sum(1 for p in people if p["rank"] == "少将")
    rows = ",\n".join(mk_row(p) for p in people)
    out = f"""// ============================================================================
// 军事人才库 · 解放军/武警现役将官（少将及以上）· 2026-06
// ----------------------------------------------------------------------------
// 上将/中将：维基百科现役导航模板 + 战区级以上补录；
// 少将：公开晋衔仪式报道（2016/2018）+ 2025-2026 岗位报道（非官方全集）。
// 注：现役少将无集中官方名录；已晋升中将/上将者自少将层剔除；去职者不录。
// 生成：scripts/genMilitarySeed.py
// ============================================================================

import {{ AS_OF, fig }} from './figureCommon.js';

export const FIGURE_MILITARY_META = {{
  id: 'military-2026-06',
  asOf: AS_OF,
  label: '军事人才库 · 将官（少将及以上）· 2026-06',
  sources: ['维基百科·现役上将/中将导航模板', '维基百科·现役正战区级以上将领列表', '澎湃新闻·晋衔报道', '新华社', '中国政府网'],
  scope: '现役上将 {shang} + 中将 {zhong} + 少将公开子集 {shao}（少将非穷尽，见 notes）',
  notes: '少将条为公开报道可核实子集（非官方全集，现役少将约数百人）；张升民/董军等在中央库有党政职务条，本库保留军衔维度；习近平军委主席见省级库',
}};

const M = (name, level, role, org, branch, source) =>
  fig({{
    name,
    province: '中央军委',
    level,
    role,
    sector: '军队',
    org,
    source,
    fields: {{
      title: role,
      milRank: level,
      milBranch: branch,
      institution: org,
      tookOffice: AS_OF,
    }},
    career: [{{ from: '2026', to: '', desc: `现役${{level}} · ${{role}}` }}],
  }});

export const FIGURE_MILITARY_2026 = [
{rows}
];

export const FIGURE_MILITARY_COUNT = FIGURE_MILITARY_2026.length;
"""
    OUT.write_text(out, encoding="utf-8")
    print(OUT, f"total={len(people)}", f"上将={shang}", f"中将={zhong}", f"少将={shao}")


if __name__ == "__main__":
    main()
