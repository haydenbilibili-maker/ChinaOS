#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
china.html 内容解耦构建器 · China OS · 阶段二

把「内容型」专题 Tab 的 HTML 从巨石 china.html 中外移到 tabs/<slug>.html，
单一数据源在 tabs/，china.html 内保留一个**生成的** TAB_PARTIALS 块，
使 getXxxHTML() 仍同步返回字符串（file:// 与 http 均可运行，行为不变）。

子命令：
  explode  一次性：抽出目标函数体 → tabs/<slug>.html，并把函数改写为
           `return TAB_PARTIALS['slug']`，同时注入 TAB_PARTIALS 生成块。
  build    （默认）从 tabs/*.html 重新生成 china.html 内的 TAB_PARTIALS 块。
           幂等；这是「改完 tabs/ 后」要跑的命令。
  check    校验：build 后 china.html 是否有变化；有变化则 exit 1（供 CI/钩子）。

用法：
  python3 scripts/build_china.py explode
  python3 scripts/build_china.py            # = build
  python3 scripts/build_china.py check
"""
import sys
import os
import re
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHINA = os.path.join(ROOT, "china.html")
TABS_DIR = os.path.join(ROOT, "tabs")

# 函数名 → tabs/ 文件 slug。仅限「纯静态、可达」的内容型 Tab。
# （死代码 getGuochaoHTML / getDiplomacyHTML 不在此列，另行清理。）
TARGETS = {
    "getEcologyHTML": "ecology",
    "getAutomotiveHTML": "automotive",
    "getCultureHTML": "culture",
    "getDataElementHTML": "dataElement",
    "getBRIHTML": "bri",
    "getForeignTradeHTML": "foreignTrade",
    "getDigitalHTML": "digital",
    "getUrbanHTML": "urban",
    "getCivilAviationHTML": "civilAviation",
    "getPrivateHTML": "private",
    "getFoodSecurityHTML": "foodSecurity",
}

BEGIN = "        // ===== TAB_PARTIALS:BEGIN — 生成块，请勿手改；内容源在 tabs/*.html，改后跑 python3 scripts/build_china.py ====="
END = "        // ===== TAB_PARTIALS:END ====="
ANCHOR = "        // --- HTML Generators ---"

DEFRE = re.compile(r"^\s*function ([A-Za-z0-9_]+)\s*\(")


def find_func(lines, name):
    """返回 (start_idx, end_idx) 含两端，基于大括号配平。找不到返回 None。"""
    for i, l in enumerate(lines):
        m = DEFRE.match(l)
        if m and m.group(1) == name:
            depth = 0
            started = False
            for j in range(i, len(lines)):
                depth += lines[j].count("{") - lines[j].count("}")
                if "{" in lines[j]:
                    started = True
                if started and depth == 0:
                    return i, j
    return None


def extract_template(lines, s, e):
    """从函数体 lines[s..e] 中取出 return `...` 内的内容（不含两端反引号行）。"""
    open_i = None
    for k in range(s, e + 1):
        if "return `" in lines[k]:
            open_i = k
            break
    if open_i is None:
        raise ValueError("未找到 return ` 起始")
    close_i = None
    for k in range(open_i + 1, e + 1):
        if lines[k].lstrip().startswith("`"):  # 形如  `;
            close_i = k
            break
    if close_i is None:
        raise ValueError("未找到 ` 收尾")
    return "\n".join(lines[open_i + 1:close_i])


def render_partials_block(partials: dict) -> str:
    out = [BEGIN, "        const TAB_PARTIALS = {"]
    for slug in sorted(partials):
        # ensure_ascii=False 保留中文可读；json 保证转义安全（引号/反斜杠/换行）
        out.append("            " + json.dumps(slug, ensure_ascii=False) + ": "
                   + json.dumps(partials[slug], ensure_ascii=False) + ",")
    out.append("        };")
    out.append(END)
    return "\n".join(out)


def read_tabs() -> dict:
    partials = {}
    for name, slug in TARGETS.items():
        p = os.path.join(TABS_DIR, slug + ".html")
        if not os.path.exists(p):
            raise FileNotFoundError(f"缺少内容文件：{p}（先跑 explode）")
        partials[slug] = open(p, encoding="utf-8").read()
    return partials


def replace_block(text: str, block: str) -> str:
    """用 block 替换现有 BEGIN..END；若不存在则插入到 ANCHOR 之前。"""
    if BEGIN in text and END in text:
        pre = text[:text.index(BEGIN)]
        post = text[text.index(END) + len(END):]
        return pre + block + post
    if ANCHOR in text:
        return text.replace(ANCHOR, block + "\n\n" + ANCHOR, 1)
    raise RuntimeError("找不到 TAB_PARTIALS 标记，也找不到锚点 ANCHOR")


def cmd_explode():
    os.makedirs(TABS_DIR, exist_ok=True)
    text = open(CHINA, encoding="utf-8").read()
    lines = text.split("\n")
    # 自底向上替换，避免行号位移
    plans = []
    for name, slug in TARGETS.items():
        r = find_func(lines, name)
        if not r:
            print(f"  [跳过] 未找到 {name}")
            continue
        s, e = r
        content = extract_template(lines, s, e)
        plans.append((s, e, name, slug, content))
    plans.sort(key=lambda x: -x[0])

    partials = {}
    for s, e, name, slug, content in plans:
        with open(os.path.join(TABS_DIR, slug + ".html"), "w", encoding="utf-8") as f:
            f.write(content)
        partials[slug] = content
        indent = re.match(r"\s*", lines[s]).group(0)
        thin = f"{indent}function {name}() {{ return TAB_PARTIALS['{slug}']; }}"
        lines[s:e + 1] = [thin]
        print(f"  外移 {name} → tabs/{slug}.html（{content.count(chr(10))+1} 行）")

    text = "\n".join(lines)
    text = replace_block(text, render_partials_block(partials))
    open(CHINA, "w", encoding="utf-8").write(text)
    print(f"\n完成：{len(partials)} 个 Tab 已外移，TAB_PARTIALS 块已注入。")


def cmd_build(check=False):
    partials = read_tabs()
    text = open(CHINA, encoding="utf-8").read()
    new = replace_block(text, render_partials_block(partials))
    if check:
        if new != text:
            print("[check 失败] china.html 与 tabs/ 不同步，请运行 build。", file=sys.stderr)
            sys.exit(1)
        print("[check 通过] china.html 与 tabs/ 同步。")
        return
    if new == text:
        print("无变化：china.html 已与 tabs/ 同步。")
        return
    open(CHINA, "w", encoding="utf-8").write(new)
    print(f"已重建 TAB_PARTIALS 块（{len(partials)} 个 Tab）。")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "explode":
        cmd_explode()
    elif cmd == "check":
        cmd_build(check=True)
    elif cmd == "build":
        cmd_build()
    else:
        print(__doc__)
        sys.exit(2)


if __name__ == "__main__":
    main()
