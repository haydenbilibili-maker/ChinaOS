#!/usr/bin/env python3
"""从本地世界银行 WDI CSV（data/wb_api_*.csv）提取精选指标，生成本地数据集种子。

输出：app/src/lib/db/worldBankSeed.js
- 仅取本地 CSV 中的公开 WDI 数值（不联网），实现「从本地数据中取数」。
- 覆盖中国（CHN）及对比地区中国香港（HKG）、中国澳门（MAC）。
"""
import csv
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
DATA_DIR = os.path.join(ROOT, 'data')
OUT_PATH = os.path.join(ROOT, 'app', 'src', 'lib', 'db', 'worldBankSeed.js')

CSV_SOURCES = [
    ('wb_api_chn.csv', 'CHN', '中国'),
    ('wb_api_hkg.csv', 'HKG', '中国香港'),
    ('wb_api_mac.csv', 'MAC', '中国澳门'),
]

# 精选指标：code -> (中文名, 单位, 取整位数, accent 颜色)
INDICATORS = [
    ('NY.GDP.MKTP.CD',    'GDP（现价美元）',        '美元',      0,  '#c41e3a'),
    ('NY.GDP.PCAP.CD',    '人均 GDP（现价美元）',    '美元',      0,  '#22d3ee'),
    ('NY.GDP.MKTP.KD.ZG', 'GDP 增长率',             '%',        2,  '#e8a317'),
    ('NY.GNP.PCAP.CD',    '人均 GNI（图集法）',      '美元',      0,  '#10b981'),
    ('SP.POP.TOTL',       '总人口',                 '人',        0,  '#8b5cf6'),
    ('SP.URB.TOTL.IN.ZS', '城镇人口占比',           '%',        2,  '#fb923c'),
    ('SP.DYN.LE00.IN',    '预期寿命',               '岁',        2,  '#06b6d4'),
    ('SP.DYN.TFRT.IN',    '总和生育率',             '胎/妇女',   3,  '#f472b6'),
    ('NE.GDI.TOTL.ZS',    '资本形成总额占 GDP',     '%',        2,  '#84cc16'),
    ('NE.TRD.GNFS.ZS',    '贸易额占 GDP',           '%',        2,  '#eab308'),
    ('EN.GHG.CO2.MT.CE.AR5', 'CO₂ 排放总量（不含 LULUCF）', '百万吨',   1,  '#64748b'),
]

YEAR_MIN, YEAR_MAX = 2000, 2024


def parse_csv(filepath):
    if not os.path.exists(filepath):
        return None, {}
    with open(filepath, 'r', encoding='utf-8') as f:
        rows = list(csv.reader(f))
    header = None
    data_start = 0
    for i, row in enumerate(rows):
        if len(row) > 4 and (row[0] or '').strip() == 'Country Name' and (row[2] or '').strip() == 'Indicator Name':
            header = [h.strip() for h in row]
            data_start = i + 1
            break
    if not header:
        return None, {}
    years = header[4:]
    by_code = {}
    for row in rows[data_start:]:
        if len(row) < 5:
            continue
        by_code[row[3]] = row[4:]
    return years, by_code


def main():
    seed_rows = []
    countries = []
    for filename, code, name in CSV_SOURCES:
        years, by_code = parse_csv(os.path.join(DATA_DIR, filename))
        if not years:
            continue
        countries.append({'code': code, 'name': name})
        for ind_code, cn_name, unit, ndigits, _accent in INDICATORS:
            series = by_code.get(ind_code)
            if not series:
                continue
            for yi, yr in enumerate(years):
                try:
                    year = int(yr)
                except ValueError:
                    continue
                if year < YEAR_MIN or year > YEAR_MAX:
                    continue
                raw = series[yi] if yi < len(series) else ''
                raw = (raw or '').strip()
                if raw == '':
                    continue
                try:
                    val = float(raw)
                except ValueError:
                    continue
                val = round(val, ndigits)
                if ndigits == 0:
                    val = int(val)
                seed_rows.append({
                    'indicatorCode': ind_code,
                    'indicator': cn_name,
                    'unit': unit,
                    'country': name,
                    'countryCode': code,
                    'year': year,
                    'value': val,
                })

    indicators_meta = [
        {'code': c, 'name': n, 'unit': u, 'accent': a}
        for (c, n, u, _d, a) in INDICATORS
    ]

    payload_rows = json.dumps(seed_rows, ensure_ascii=False, separators=(',', ':'))
    payload_inds = json.dumps(indicators_meta, ensure_ascii=False)
    payload_countries = json.dumps(countries, ensure_ascii=False)

    out = f'''// ============================================================================
// 世界银行 WDI · 本地数据集种子（China OS 数据底座 · 本地取数）
// ----------------------------------------------------------------------------
// 数据自 data/wb_api_*.csv（世界发展指标 WDI 公开数据）离线抽取，已固化为静态种子，
// 不联网即可在 IndexedDB 本地库展示。由 scripts/build_world_bank_seed.py 生成，勿手改。
//   schema: indicatorCode / indicator / unit / country / countryCode / year / value
// ============================================================================

export const WORLD_BANK_DATASET_ID = 'worldbank-wdi';

export const WORLD_BANK_COLUMNS = ['indicatorCode', 'indicator', 'unit', 'country', 'countryCode', 'year', 'value'];

// 指标目录（含中文名、单位、配色）
export const WORLD_BANK_INDICATORS = {payload_inds};

// 国家 / 地区
export const WORLD_BANK_COUNTRIES = {payload_countries};

// WDI 明细行（长表：每行一个 指标×国家×年份 观测值）
export const WORLD_BANK_ROWS = {payload_rows};

const _years = WORLD_BANK_ROWS.map((r) => r.year);

export const WORLD_BANK_META = {{
  id: WORLD_BANK_DATASET_ID,
  label: '世界银行 WDI · 核心发展指标',
  category: '世界银行',
  source: '世界银行 世界发展指标（WDI）· 本地 CSV 离线快照',
  sources: ['World Bank · World Development Indicators (WDI)'],
  asOf: '2026-07-14',
  disclaimer: '公开数据示意：数值取自世界银行 WDI 公开数据本地快照（data/wb_api_*.csv），仅供研究参考，使用前请核对官方口径。',
  scope: '中国 / 中国香港 / 中国澳门 · {YEAR_MIN}–{YEAR_MAX}',
  indicatorCount: WORLD_BANK_INDICATORS.length,
  countryCount: WORLD_BANK_COUNTRIES.length,
  yearMin: _years.length ? Math.min(..._years) : {YEAR_MIN},
  yearMax: _years.length ? Math.max(..._years) : {YEAR_MAX},
  count: WORLD_BANK_ROWS.length,
}};

export function buildWorldBankSeed() {{
  return {{
    id: WORLD_BANK_DATASET_ID,
    name: WORLD_BANK_META.label,
    category: WORLD_BANK_META.category,
    source: WORLD_BANK_META.source,
    note: `${{WORLD_BANK_META.scope}}。${{WORLD_BANK_META.disclaimer}}`,
    columns: WORLD_BANK_COLUMNS,
    rows: WORLD_BANK_ROWS,
  }};
}}

export const WORLD_BANK_SEED_PKG = buildWorldBankSeed();

export const WORLD_BANK_COUNT = {{
  total: WORLD_BANK_ROWS.length,
  indicators: WORLD_BANK_INDICATORS.length,
  countries: WORLD_BANK_COUNTRIES.length,
}};
'''
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        f.write(out)
    print(f'Generated {OUT_PATH}: {len(seed_rows)} rows, {len(indicators_meta)} indicators, {len(countries)} countries')


if __name__ == '__main__':
    main()
