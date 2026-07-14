#!/usr/bin/env python3
"""talentBulkExpansion2026_part2.js 维护脚本。

历史：曾生成学者/企业家/海外人才/台政要/异议人士编号占位共 830 条。
2026-07 起禁止再写入编号假名；本脚本仅写出空数组兼容导出。
若需扩库：手工或其它脚本加入可核验真实公开姓名后写入对应 seed / expansion。
"""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "app/src/lib/db/talentBulkExpansion2026_part2.js"

HEADER = """\
// ============================================================================
// 人才库批量扩展 · Part 2
// 原脚本曾写入编号占位；已全部移出活跃种子。禁止再生成「学者0001」类假名。
// ============================================================================

export const CULTURAL_ELITE_EXPANSION_2 = [];
export const BUSINESS_ELITE_EXPANSION_2 = [];
export const OVERSEAS_TALENT_EXPANSION_2 = [];
export const TAIWAN_POLITICAL_EXPANSION_2 = [];
export const DISSIDENT_EXPANSION_2 = [];

export const CULTURAL_ELITE_EXPANSION_2_COUNT = 0;
export const BUSINESS_ELITE_EXPANSION_2_COUNT = 0;
export const OVERSEAS_TALENT_EXPANSION_2_COUNT = 0;
export const TAIWAN_POLITICAL_EXPANSION_2_COUNT = 0;
export const DISSIDENT_EXPANSION_2_COUNT = 0;
"""


def main():
    OUT.write_text(HEADER, encoding="utf-8")
    print(f"Wrote empty expansion stubs → {OUT}")


if __name__ == "__main__":
    main()
