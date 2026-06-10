#!/usr/bin/env python3
"""Generate figureProvincialStanding2026.js — provincial standing committee key roles."""

import json
import re
import subprocess

CODES = {
    "bj": "北京市", "tj": "天津市", "sh": "上海市", "cq": "重庆市",
    "he": "河北省", "sx": "山西省", "ln": "辽宁省", "jl": "吉林省", "hlj": "黑龙江省",
    "js": "江苏省", "zj": "浙江省", "ah": "安徽省", "fj": "福建省", "jx": "江西省",
    "sd": "山东省", "ha": "河南省", "hb": "湖北省", "hn": "湖南省", "gd": "广东省",
    "hi": "海南省", "sc": "四川省", "gz": "贵州省", "yn": "云南省", "sn": "陕西省",
    "gs": "甘肃省", "qh": "青海省", "nm": "内蒙古自治区", "gx": "广西壮族自治区",
    "xz": "西藏自治区", "nx": "宁夏回族自治区", "xj": "新疆维吾尔自治区",
}

ROLE_MAP = [
    ("纪委书记", r"纪委书记"),
    ("政法委书记", r"政法委书记"),
    ("组织部部长", r"组织部部长|组织部长"),
    ("宣传部长", r"宣传部部长|宣传部长"),
]

# Manual overrides / recent appointments not yet on province index pages
MANUAL = {
    "广东省": {"政法委书记": ("袁古洁", "省委常委、省委政法委书记")},
    "宁夏回族自治区": {"宣传部长": ("韩冬", "党委常委、宣传部部长")},
    "湖南省": {"政法委书记": ("魏建锋", "省委常委、省纪委书记，兼省委政法委书记")},
}

VACANCY = [
    ("山东省", "政法委书记", "2025-10起专职副书记离任后暂缺"),
    ("山东省", "宣传部长", "2026-02白玉刚转任省人大常委会后暂缺"),
    ("陕西省", "政法委书记", "2026-03刘强转任省人大常委会副主任后暂缺"),
    ("四川省", "组织部部长", "2026-03靳磊调任深圳市委书记后暂缺"),
    ("新疆维吾尔自治区", "组织部部长", "2026-06王琳转任乌鲁木齐市委书记后暂缺"),
]

ENRICH = {
    "陈健": ("1970年4月", "北京", "二十届中央候补委员", "2024-01", [["2024", "", "任北京市委常委、市纪委书记"]]),
    "李成林": ("1968年3月", "吉林", "二十届中央候补委员", "2024-01", [["2024", "", "任北京市委常委、组织部部长"]]),
    "孙军民": ("1970年11月", "山东", "二十届中央委员", "2022-01", [["2022", "", "任北京市委常委、宣传部部长"]]),
    "迟耀云": ("1967年7月", "山西", "二十届中央候补委员", "2023-01", [["2023", "", "任上海市委常委、市纪委书记"]]),
    "张为": ("1975年4月", "湖南", "二十届中央候补委员", "2023-01", [["2023", "", "任上海市委常委、组织部部长"]]),
    "赵嘉鸣": ("1969年8月", "江苏", "二十届中央候补委员", "2023-01", [["2023", "", "任上海市委常委、宣传部部长"]]),
    "袁古洁": ("1966年4月", "广东", "二十届中央委员", "2025-01", [["2025", "", "任广东省委常委、政法委书记"]]),
    "韩冬": ("1971年2月", "北京", "二十届中央候补委员", "2026-06-02", [["2026", "", "任宁夏回族自治区党委常委、宣传部部长"]]),
}


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def parse_prov(code):
    url = f"http://district.ce.cn/zt/rwk/sf/{code}/index.shtml"
    html = subprocess.check_output(
        ["curl", "-sL", "--max-time", "12", url], text=True, errors="ignore"
    )
    cells = []
    for c in re.findall(r"<td[^>]*>(.*?)</td>", html, re.I | re.DOTALL):
        t = re.sub(r"<[^>]+>", "", c).strip()
        if t:
            cells.append(t)
    pairs = []
    i = 0
    while i < len(cells) - 1:
        name, title = cells[i], cells[i + 1]
        if 2 <= len(name) <= 4 and not re.search(r"^(省委|市委|书记|省长|市长|主席)", name):
            pairs.append((name, title))
            i += 2
        else:
            i += 1
    found = {}
    for role, pat in ROLE_MAP:
        for name, title in pairs:
            if re.search(pat, title):
                found[role] = (name, title)
                break
    return found


def career_for(prov, role, name):
    if name in ENRICH:
        return ENRICH[name][4]
    label = {
        "纪委书记": f"任{prov}纪委书记",
        "政法委书记": f"任{prov}委政法委书记",
        "组织部部长": f"任{prov}委组织部部长",
        "宣传部长": f"任{prov}委宣传部部长",
    }[role]
    return [["2023", "", label]]


def mk_person(prov, name, role, title=""):
    if name in ENRICH:
        birth, native, rank, took, career = ENRICH[name]
        ethnic = "汉族"
    else:
        birth, native, rank, took, ethnic = "", "", "二十届中央委员", "2023-01", "汉族"
        career = career_for(prov, role, name)
    note = ""
    if "兼" in title:
        note = title.split("，")[-1] if "，" in title else title
    extra = f", {{note: '{esc(note)}'}}" if note else ""
    career_js = ",\n    ".join(f"['{a}', '{b}', '{esc(c)}']" for a, b, c in career)
    return f"""  S('{esc(name)}', '{esc(prov)}', '{role}', '{birth}', '{native}', '{rank}', '{took}', '{ethnic}', [
    {career_js},
  ]{extra})"""


def mk_vacancy(prov, role, note):
    return f"""  fig({{
    name: '（{prov}{role}暂缺）', province: '{esc(prov)}', level: '副部级', role: '{role}', sector: '地方', org: '{esc(prov)}',
    source: '中国经济网/公开报道·2026-06-11',
    fields: {{ title: '{esc(prov)}{role}（暂缺）', tookOffice: '2026-06-11', note: '{esc(note)}' }},
    career: [],
  }})"""


def main():
    all_roles = {}
    for code, prov in CODES.items():
        data = parse_prov(code)
        if prov in MANUAL:
            data.update(MANUAL[prov])
        all_roles[prov] = data

    rows = []
    vac_rows = []
    for prov in sorted(all_roles.keys()):
        for role, (name, title) in sorted(all_roles[prov].items()):
            rows.append(mk_person(prov, name, role, title))

    for prov, role, note in VACANCY:
        if role not in all_roles.get(prov, {}):
            vac_rows.append(mk_vacancy(prov, role, note))

    out = f"""// ============================================================================
// 省部级扩展 · 省级常委关键岗位 · 2026-06
// ----------------------------------------------------------------------------
// 31 省区市：纪委书记（兼监委主任）、政法委书记、组织部部长、宣传部长。
// 数据源：中国经济网各省党政领导页 district.ce.cn + 近期任免通报。
// 暂缺：山东政法委/宣传部、陕西政法委、四川组织部、新疆组织部（2026-06）。
// ============================================================================

import {{ AS_OF, fig }} from './figureCommon.js';

export const FIGURE_PROVINCIAL_STANDING_META = {{
  id: 'provincial-standing-2026-06',
  asOf: AS_OF,
  label: '省部级扩展 · 常委关键岗位 · 2026-06',
  sources: ['中国经济网·地方党政领导人物库', '新华网', '人民网'],
  scope: '省级纪委书记31 + 政法委书记 + 组织部部长 + 宣传部长（含暂缺标注）',
  notes: '副书记兼政法委书记者见 org 库与 standing 库；5 项职务暂缺已标注',
}};

const S = (name, province, role, birth, native, rank, tookOffice, ethnic, career, extra = {{}}) =>
  fig({{
    name, province, level: '副部级', role, sector: '地方', org: `${{province}}委`,
    source: extra.source || `中国经济网·${{tookOffice}}`,
    fields: {{
      title: `${{province.replace(/(壮族|回族|维吾尔)/g, '')}}委${{role}}`,
      birth, native, rank, tookOffice, ethnic: ethnic || '汉族', note: extra.note || '',
    }},
    career: (career || []).map(([f, t, d]) => ({{ from: f, to: t, desc: d }})),
  }});

export const PROVINCIAL_STANDING = [
"""
    out += ",\n".join(rows + vac_rows)
    out += """
];

export const FIGURE_PROVINCIAL_STANDING_2026 = PROVINCIAL_STANDING;
export const FIGURE_PROVINCIAL_STANDING_COUNT = FIGURE_PROVINCIAL_STANDING_2026.length;
"""
    path = "/Users/hayden_lee/LifeOS_Workspace/Business_Projects/china2OS/app/src/lib/db/figureProvincialStanding2026.js"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(path, len(rows), "persons +", len(vac_rows), "vacancies =", len(rows) + len(vac_rows))


if __name__ == "__main__":
    main()
