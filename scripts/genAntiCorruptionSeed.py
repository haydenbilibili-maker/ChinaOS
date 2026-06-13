#!/usr/bin/env python3
"""Generate app/src/lib/db/figureAntiCorruption2026.js from anticorruption_data.py"""
from pathlib import Path
from anticorruption_data import CASES

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app/src/lib/db/figureAntiCorruption2026.js"

HEADER = """// ============================================================================
// 反腐名单 · 历年落马/被查/双开案例（公开报道）· 2012–2026
// ----------------------------------------------------------------------------
// 口径：中央纪委国家监委、新华社、人民网等公开发布信息；
// 不含未官宣传闻；厅局级仅收录具有全国性影响的知名案例。
// 生成：scripts/genAntiCorruptionSeed.py · 数据边界见 ANTI_CORRUPTION_META.notes
// ============================================================================

import { AS_OF } from './figureCommon.js';

export const ANTI_CORRUPTION_META = {
  id: 'political_anticorruption-2026-06',
  asOf: AS_OF,
  label: '反腐名单 · 历年汇总 · 2012–2026（337案）',
  sources: ['中央纪委国家监委网站', '新华社', '人民网', '央视网', '中国新闻网'],
  scope: '副省部级及以上为主，含全国性影响典型案例；按官宣日期归年',
  notes: '非穷尽名录；同一人物多阶段通报合并为首次「落马/被查」记录；司法细节以司法机关公开信息为准；研究用途，不代表官方立场。',
};

function yearBucket(date) {
  const y = +String(date).slice(0, 4);
  if (y >= 2022) return '二十大后';
  if (y >= 2017) return '十九大后';
  if (y >= 2012) return '十八大以来';
  return '十八大前';
}

/** @param {string} name @param {string} level @param {string} formerRole @param {string} org @param {string} province @param {string} sector @param {string} date @param {string} category @param {string} status @param {string} source @param {string} [notes] @param {string} [caseType] */
function C(name, level, formerRole, org, province, sector, date, category, status, source, notes = '', caseType = '') {
  return {
    name, level, formerRole, org, province, sector,
    announcementDate: date,
    year: String(date).slice(0, 4),
    yearBucket: yearBucket(date),
    category, status, source, notes, caseType,
  };
}

export const ANTI_CORRUPTION_2026 = [
"""


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def dedupe(cases):
    seen = {}
    for c in cases:
        name = c[0]
        if name not in seen:
            seen[name] = c
        else:
            prev = seen[name]
            if c[6] < prev[6]:
                seen[name] = c
            elif c[6] == prev[6] and sum(1 for x in c if x) > sum(1 for x in prev if x):
                seen[name] = c
    return sorted(seen.values(), key=lambda x: x[6])


def fmt_case(c):
    name, level, role, org, prov, sector, date, cat, status, source = c[:10]
    notes = c[10] if len(c) > 10 else ""
    case_type = c[11] if len(c) > 11 else ""
    parts = [
        f"'{esc(name)}'", f"'{esc(level)}'", f"'{esc(role)}'", f"'{esc(org)}'",
        f"'{esc(prov)}'", f"'{esc(sector)}'", f"'{date}'", f"'{esc(cat)}'",
        f"'{esc(status)}'", f"'{esc(source)}'",
    ]
    if notes:
        parts.append(f"'{esc(notes)}'")
    if case_type:
        if not notes:
            parts.append("''")
        parts.append(f"'{esc(case_type)}'")
    return f"  C({', '.join(parts)}),"


def main():
    # 保留原始条目（含重复），去重由 antiCorruptionSeed.js buildAntiCorruptionSeed 负责
    cases = sorted(CASES, key=lambda x: x[6])
    unique = dedupe(CASES)
    lines = [HEADER]
    cur_year = None
    for c in cases:
        y = c[6][:4]
        if y != cur_year:
            cur_year = y
            lines.append(f"  // —— {y} ——")
        lines.append(fmt_case(c))
    lines.append("];")
    lines.append("")
    lines.append(f"export const ANTI_CORRUPTION_RAW_COUNT = ANTI_CORRUPTION_2026.length;")
    lines.append(f"export const ANTI_CORRUPTION_UNIQUE_COUNT = {len(unique)};")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote raw {len(cases)} / unique {len(unique)} (dupes {len(cases)-len(unique)}) → {OUT}")


if __name__ == "__main__":
    main()
