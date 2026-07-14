#!/usr/bin/env python3
"""
审计人才库政要职务真实性风险面。

扫描 app/src/lib/db 下 figure*/talentBulk* 种子文本，标记：
1) 标题匹配 /省长|书记|部长|市长|主席/ 的条目
2) 同一排他性职务（如「吉林省+省长」）多人碰撞
3) 合成假名残留 / 示意性补录措辞
4) 已知纠偏锚点（周明理不得为吉林省省长；胡玉亭应为吉林省省长）

用法（仓库根目录）:
  python3 scripts/audit_talent_titles.py
  python3 scripts/audit_talent_titles.py --json reports/talent-title-audit.json

公开任免口径，以官方最新公告为准；本脚本只做静态启发式，不编造任命。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "app" / "src" / "lib" / "db"

TITLE_ROLE_RE = re.compile(
    r"(省长|自治区主席|省委书记|党委书记|市委书记|部长|市长|主席)"
)
# 粗提取对象字面量片段（足够覆盖种子写法）
ENTRY_RE = re.compile(
    r"(?:fig\(|C\(|V\(|D\(|S\(|M\(|N\()\s*\{([^}]{20,1200})\}",
    re.DOTALL,
)
NAME_RE = re.compile(r"name:\s*['\"]([^'\"]+)['\"]")
ROLE_RE = re.compile(r"role:\s*['\"]([^'\"]+)['\"]")
PROV_RE = re.compile(r"province:\s*['\"]([^'\"]+)['\"]")
TITLE_F_RE = re.compile(r"title:\s*['\"]([^'\"]+)['\"]")
STATUS_RE = re.compile(r"status:\s*['\"]([^'\"]+)['\"]")
ID_RE = re.compile(r"\bid:\s*['\"]([^'\"]+)['\"]")

SYNTHETIC_NAME_RE = re.compile(r"^(海外人才|异议人士|学者|企业家|台政要)\d{3,}$")
PLACEHOLDER_HINT_RE = re.compile(r"示意性补录|公开报道口径示意|placeholder", re.I)

# 排他职务归一
PROV_NORM = re.compile(r"(维吾尔|壮族|回族|自治区|特别行政区|省|市)$")


def normalize_province(p: str) -> str:
    p = (p or "").strip()
    for _ in range(3):
        p2 = PROV_NORM.sub("", p)
        if p2 == p:
            break
        p = p2
    return p or ""


def office_key(prov: str, role: str, title: str, status: str) -> str | None:
    if status == "former":
        return None
    blob = f"{title} {role}"
    if re.search(r"^原|原市委|原省委|原省长|原市长|暂缺", blob):
        return None
    pn = normalize_province(prov)
    if not pn or pn == "中央":
        return None
    if re.search(r"省委书记|党委书记", blob) and "副书记" not in blob and "市委书记" not in blob:
        return f"party-secretary:{pn}"
    if re.search(r"副省长|副市长|常务副|副主席", blob):
        return None
    if "自治区主席" in blob or role == "自治区主席":
        return f"chief:{pn}"
    if role == "省长" or re.search(r"省长", title):
        return f"chief:{pn}"
    if (role == "市长" or "市长" in title) and pn in ("北京", "天津", "上海", "重庆"):
        return f"chief:{pn}"
    return None


def scan_file(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    rel = str(path.relative_to(ROOT))
    rows = []

    # 数组元组写法：['吉林省', '胡玉亭', '省长', ...]（排除履历 ['2024','','任…']）
    for m in re.finditer(
        r"\[\s*['\"]([^'\"]+)['\"]\s*,\s*(?:['\"]([^'\"]+)['\"]|null)\s*,\s*['\"]([^'\"]*(?:省长|书记|市长|主席|部长)[^'\"]*)['\"]",
        text,
    ):
        prov, name, role_or_title = m.group(1), m.group(2) or "", m.group(3)
        if not name or name in ("null",) or "暂缺" in role_or_title:
            continue
        # 履历行以四位年份开头；人名不应为纯数字年份
        if re.fullmatch(r"(19|20)\d{2}", prov) or re.fullmatch(r"(19|20)\d{2}", name):
            continue
        if not re.search(r"(省|市|自治区|中央|部|委)", prov) and len(prov) < 2:
            continue
        # 行政区或机构位：须像地名/机构，而非「任xx」叙述
        if prov.startswith("任"):
            continue
        rows.append(
            {
                "file": rel,
                "id": "",
                "name": name,
                "province": prov,
                "role": role_or_title,
                "title": role_or_title,
                "status": "",
                "source": "tuple",
            }
        )

    for m in ENTRY_RE.finditer(text):
        body = m.group(1)
        name_m = NAME_RE.search(body)
        if not name_m:
            continue
        name = name_m.group(1)
        role = (ROLE_RE.search(body) or [None, ""])[1]
        title = (TITLE_F_RE.search(body) or [None, ""])[1]
        prov = (PROV_RE.search(body) or [None, ""])[1]
        status = (STATUS_RE.search(body) or [None, ""])[1]
        fid = (ID_RE.search(body) or [None, ""])[1]
        blob = f"{role} {title}"
        if not TITLE_ROLE_RE.search(blob) and not TITLE_ROLE_RE.search(name):
            continue
        rows.append(
            {
                "file": rel,
                "id": fid,
                "name": name,
                "province": prov,
                "role": role,
                "title": title,
                "status": status,
                "source": "object",
            }
        )
    return rows


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", type=Path, default=None)
    args = ap.parse_args()

    files = sorted(
        list(DB.glob("figure*.js"))
        + list(DB.glob("talentBulk*.js"))
        + list(DB.glob("*Seed.js"))
    )
    all_rows: list[dict] = []
    for f in files:
        all_rows.extend(scan_file(f))

    # 过滤到高关注职务
    focus = [
        r
        for r in all_rows
        if TITLE_ROLE_RE.search(f"{r['role']} {r['title']}") or TITLE_ROLE_RE.search(r["name"])
    ]

    office_map: dict[str, list[dict]] = defaultdict(list)
    for r in focus:
        k = office_key(r["province"], r["role"], r["title"], r["status"])
        if k:
            office_map[k].append(r)

    collisions = {k: v for k, v in office_map.items() if len(v) > 1}

    synthetic = [r for r in focus if SYNTHETIC_NAME_RE.match(r["name"])]
    placeholder_files = []
    for f in files:
        txt = f.read_text(encoding="utf-8")
        if PLACEHOLDER_HINT_RE.search(txt):
            placeholder_files.append(str(f.relative_to(ROOT)))

    # 锚点核查
    zhou = [r for r in focus if r["name"] == "周明理"]
    hu = [r for r in focus if r["name"] == "胡玉亭"]
    jilin_governor = office_map.get("chief:吉林", [])

    anchors = {
        "周明理": {
            "entries": zhou,
            "ok": all(
                ("原" in (r["role"] + r["title"]) or r["status"] == "former")
                and "吉林" not in r["role"] + r["title"]
                for r in zhou
            )
            if zhou
            else False,
        },
        "胡玉亭": {
            "entries": hu,
            "ok": any("省长" in (r["role"] + r["title"]) and "吉林" in r["province"] for r in hu),
        },
        "吉林省长单一性": {
            "holders": [{"name": r["name"], "file": r["file"], "title": r["title"] or r["role"]} for r in jilin_governor],
            "ok": len({r["name"] for r in jilin_governor}) == 1 and any(r["name"] == "胡玉亭" for r in jilin_governor),
        },
    }

    report = {
        "asOfHint": "2026-07",
        "disclaimer": "公开任免口径，以官方最新公告为准；本审计为静态启发式，不构成任职证明。",
        "filesScanned": len(files),
        "titleRoleHits": len(focus),
        "uniqueOfficeCollisions": {
            k: [{"name": x["name"], "file": x["file"], "role": x["role"], "title": x["title"]} for x in v]
            for k, v in sorted(collisions.items())
        },
        "collisionCount": len(collisions),
        "syntheticNameHits": synthetic,
        "placeholderHintFiles": placeholder_files,
        "anchors": anchors,
        "sampleFocus": focus[:80],
    }

    # 控制台摘要
    print("=== 人才库职务审计 ===")
    print(f"扫描文件: {len(files)} · 职务命中: {len(focus)} · 排他职务碰撞: {len(collisions)}")
    print(f"周明理纠偏: {'PASS' if anchors['周明理']['ok'] else 'FAIL'} · 条数 {len(zhou)}")
    print(f"胡玉亭省长: {'PASS' if anchors['胡玉亭']['ok'] else 'FAIL'}")
    print(f"吉林省长单一: {'PASS' if anchors['吉林省长单一性']['ok'] else 'FAIL'} · {anchors['吉林省长单一性']['holders']}")
    if collisions:
        print("\n碰撞明细:")
        for k, v in sorted(collisions.items()):
            names = ", ".join(f"{x['name']}@{x['file']}" for x in v)
            print(f"  {k}: {names}")
    if synthetic:
        print(f"\n合成假名残留: {len(synthetic)}")
    print("\n免责声明: 公开任免口径，以官方最新公告为准。")

    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Wrote {args.json}")

    failed = not (
        anchors["周明理"]["ok"] and anchors["胡玉亭"]["ok"] and anchors["吉林省长单一性"]["ok"]
    )
    # 省级书记/省长碰撞视为失败；部委「部长」多人属正常，已不进 office_key
    hard = [k for k in collisions if k.startswith(("chief:", "party-secretary:"))]
    if hard:
        failed = True
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
