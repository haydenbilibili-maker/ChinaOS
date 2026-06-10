#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
乱码扫描器 · China OS

用途：
  1) 扫描 HTML 文件中的「连续 ??? 乱码」与常见 UTF-8/GBK 串改特征，
     按文件 + 行号 + 严重度产出清单。
  2) 可作为提交前门禁（--gate），发现新增乱码即以非零码退出，
     阻止把乱码写进仓库。

用法：
  python3 scripts/scan_mojibake.py                 # 扫描全部 *.html，打印报告
  python3 scripts/scan_mojibake.py china.html      # 只扫指定文件
  python3 scripts/scan_mojibake.py --json out.json # 额外导出 JSON 清单
  python3 scripts/scan_mojibake.py --gate          # 门禁模式：有乱码则 exit 1

判定规则（保守，避免误伤）：
  - 连续 3 个及以上 '?'（U+003F）视为乱码（正常文案极少出现 ???）。
  - U+FFFD（）替换字符：编码丢失的确凿信号。
  - 典型 GBK→UTF-8 误读残留：'锛'、'鍦'、'鐨'、'鎴' 等高位串改字符。
统计「可见区」命中：粗略判断该行是否在标签可见文本/属性文案内，
辅助区分 H2（用户可见乱码，需优先修）与普通命中。
"""
import sys
import os
import re
import json
import glob

# 连续问号：3+ 个，跨越可能夹杂的空白
RE_QMARK = re.compile(r"\?{3,}")
# Unicode 替换字符
RE_FFFD = re.compile("�")
# 注：曾尝试用「冷僻 CJK 区段」识别 GBK→UTF-8 串改残字，但常用字
# （介/种/分/构/控）落在同区段易误伤，已弃用。当前只保留两个零误报
# 的确凿信号：连续 ??? 与 U+FFFD。如需补充，应针对「2+ 连续冷僻字」
# 的具体码点白名单单独建表。

VISIBLE_HINT = re.compile(r">[^<]*$|=[\"'][^\"']*$|label|title|placeholder|>[^<]")


def severity(line: str, kinds: set) -> str:
    """H2=可见区乱码（优先），H_FFFD=编码丢失，H_LOW=其它命中。"""
    if "fffd" in kinds:
        return "FFFD-编码丢失"
    # 命中在可见文本/文案属性附近 → 视为用户可见
    if VISIBLE_HINT.search(line):
        return "H2-可见区"
    return "H3-非可见/注释"


def scan_file(path: str):
    hits = []
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            for ln, line in enumerate(f, 1):
                kinds = set()
                if RE_QMARK.search(line):
                    kinds.add("qmark")
                if RE_FFFD.search(line):
                    kinds.add("fffd")
                if not kinds:
                    continue
                sev = severity(line, kinds)
                snippet = line.strip()
                if len(snippet) > 120:
                    snippet = snippet[:117] + "..."
                hits.append({
                    "file": path,
                    "line": ln,
                    "kinds": sorted(kinds),
                    "severity": sev,
                    "snippet": snippet,
                })
    except Exception as e:
        print(f"  [跳过] {path}: {e}", file=sys.stderr)
    return hits


def main():
    argv = sys.argv[1:]
    gate = "--gate" in argv
    json_out = None
    if "--json" in argv:
        i = argv.index("--json")
        json_out = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    argv = [a for a in argv if not a.startswith("--")]

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if argv:
        targets = argv
    else:
        targets = sorted(glob.glob(os.path.join(root, "*.html")))

    all_hits = []
    for t in targets:
        all_hits.extend(scan_file(t))

    # 按文件聚合统计
    by_file = {}
    by_sev = {}
    for h in all_hits:
        by_file.setdefault(h["file"], 0)
        by_file[h["file"]] += 1
        by_sev.setdefault(h["severity"], 0)
        by_sev[h["severity"]] += 1

    print("=" * 64)
    print("乱码扫描报告 · China OS")
    print("=" * 64)
    print(f"扫描文件数：{len(targets)}    命中行总数：{len(all_hits)}\n")

    if by_sev:
        print("按严重度：")
        for sev in sorted(by_sev):
            print(f"  {sev:<16} {by_sev[sev]:>5} 行")
        print()

    if by_file:
        print("按文件（命中行数降序）：")
        for fp, cnt in sorted(by_file.items(), key=lambda x: -x[1]):
            print(f"  {cnt:>5}  {os.path.relpath(fp, root)}")
        print()

    # H2 可见区命中明细（最该先修的）
    h2 = [h for h in all_hits if h["severity"].startswith("H2")]
    if h2:
        print(f"H2 可见区乱码明细（前 30 / 共 {len(h2)}）：")
        for h in h2[:30]:
            rel = os.path.relpath(h["file"], root)
            print(f"  {rel}:{h['line']}  {h['snippet']}")
        print()

    if json_out:
        with open(json_out, "w", encoding="utf-8") as f:
            json.dump(all_hits, f, ensure_ascii=False, indent=2)
        print(f"JSON 清单已写入：{json_out}")

    if gate:
        # 门禁：只拦「新增」乱码。基线文件记录每文件允许的存量命中数；
        # 当前数 > 基线则失败；当前数 < 基线则自动下调基线（修复即固化）。
        base_path = os.path.join(root, "mojibake_baseline.json")
        cur = {}
        for h in all_hits:
            rel = os.path.relpath(h["file"], root)
            cur[rel] = cur.get(rel, 0) + 1

        # 首次运行无基线：播种存量并放行（grandfather 现有乱码）
        if not os.path.exists(base_path):
            json.dump(dict(cur), open(base_path, "w", encoding="utf-8"),
                      ensure_ascii=False, indent=2, sort_keys=True)
            total = sum(cur.values())
            print(f"[门禁] 首次播种基线：{total} 行存量已记录，后续只拦新增。")
            return

        try:
            baseline = json.load(open(base_path, encoding="utf-8"))
        except Exception:
            baseline = {}

        regressed = []
        improved = []
        for rel, n in cur.items():
            allowed = baseline.get(rel, 0)
            if n > allowed:
                regressed.append((rel, allowed, n))
            elif n < allowed:
                improved.append((rel, allowed, n))

        if regressed:
            print("\n[门禁失败] 检测到新增乱码：", file=sys.stderr)
            for rel, allowed, n in regressed:
                print(f"  {rel}: 基线 {allowed} → 现 {n} (+{n - allowed})", file=sys.stderr)
            print("请修复后再提交；若确属误报，调整 scan 规则或基线。", file=sys.stderr)
            sys.exit(1)

        # 修复使命中下降：自动收紧基线，防止回潮
        if improved or set(cur) != set(baseline):
            newbase = dict(cur)
            json.dump(newbase, open(base_path, "w", encoding="utf-8"),
                      ensure_ascii=False, indent=2, sort_keys=True)
            for rel, allowed, n in improved:
                print(f"[门禁] {rel} 乱码下降 {allowed}→{n}，基线已收紧。")
        print("[门禁通过] 无新增乱码。")


if __name__ == "__main__":
    main()
