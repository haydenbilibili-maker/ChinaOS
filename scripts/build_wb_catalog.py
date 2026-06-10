#!/usr/bin/env python3
"""从世界银行 API CSV 构建 JSON 目录索引，支持中国、香港、澳门。"""
import csv
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
OUT_PATH = os.path.join(DATA_DIR, 'wb_catalog.json')

# 数据源配置：文件名 -> (国家代码, 显示名)
CSV_SOURCES = [
    ('wb_api_chn.csv', 'CHN', '中国'),
    ('wb_api_hkg.csv', 'HKG', '中国香港特别行政区'),
    ('wb_api_mac.csv', 'MAC', '中国澳门特别行政区'),
]

# 关键指标代码（GDP、人口、贸易等）
KEY_INDICATORS = [
    'NY.GDP.MKTP.KD.ZG',   # GDP growth
    'NY.GDP.MKTP.CD',      # GDP
    'SP.POP.TOTL',         # 人口总数
    'SP.RUR.TOTL.ZS',      # 农村人口占比
    'SP.POP.GROW',         # 人口增长
    'BX.KLT.DINV.CD.WD',   # 外商直接投资
    'BX.GSR.GNFS.CD',      # 货物和服务出口
    'TM.VAL.MRCH.CD.WT',   # 商品进口
    'TX.VAL.TECH.CD',      # 高科技出口
    'SL.UEM.TOTL.NE.ZS',   # 失业率
    'SP.DYN.TFRT.IN',      # 总生育率
    'SP.POP.65UP.TO',      # 65岁以上人口
]

def parse_csv(filepath):
    """解析单个 CSV 文件，返回目录列表。"""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
    header = None
    data_start = 0
    for i, row in enumerate(rows):
        if len(row) > 4:
            c0 = (row[0] or '').strip().strip('"')
            c2 = (row[2] or '').strip().strip('"')
            if c0 == 'Country Name' and c2 == 'Indicator Name':
                header = [h.strip().strip('"') for h in row]
                data_start = i + 1
                break
    if not header:
        return []
    catalog = []
    for row in rows[data_start:]:
        if len(row) < 5:
            continue
        country, code, ind_name, ind_code = row[0], row[1], row[2], row[3]
        values = row[4:]
        latest = None
        latest_year = None
        for i in range(len(values) - 1, -1, -1):
            if i < len(header) - 4:
                y = header[4 + i]
                v = values[i].strip() if i < len(values) else ''
                if v and v != '':
                    try:
                        latest = float(v)
                        latest_year = y
                        break
                    except:
                        latest = v
                        latest_year = y
                        break
        catalog.append({
            'country': country,
            'countryCode': code,
            'indicatorName': ind_name,
            'indicatorCode': ind_code,
            'latestValue': latest,
            'latestYear': latest_year,
            'yearCount': len([v for v in values if v and v.strip()])
        })
    return catalog

def main():
    catalog = []
    countries = {}
    by_code = {}
    for filename, code, name in CSV_SOURCES:
        filepath = os.path.join(DATA_DIR, filename)
        items = parse_csv(filepath)
        countries[code] = {'name': name, 'count': len(items)}
        for item in items:
            catalog.append(item)
            ic = item['indicatorCode']
            if ic not in by_code:
                by_code[ic] = {}
            by_code[ic][code] = item

    # keyIndicators: 保持向后兼容，以 CHN 为主
    key_indicators = {}
    for k in KEY_INDICATORS:
        if k in by_code:
            key_indicators[k] = by_code[k].get('CHN') or list(by_code[k].values())[0]

    # keyIndicatorsGBA: 粤港澳三地对比 (CHN/HKG/MAC)
    key_indicators_gba = {}
    for k in KEY_INDICATORS:
        if k in by_code:
            key_indicators_gba[k] = by_code[k]

    output = {
        'source': '世界发展指标 (World Development Indicators)',
        'lastUpdated': '2026-01-28',
        'countries': countries,
        'totalIndicators': len(catalog),
        'catalog': catalog,
        'keyIndicators': key_indicators,
        'keyIndicatorsGBA': key_indicators_gba,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f'Generated {OUT_PATH} with {len(catalog)} indicators (CHN: {countries.get("CHN",{}).get("count",0)}, HKG: {countries.get("HKG",{}).get("count",0)}, MAC: {countries.get("MAC",{}).get("count",0)})')

if __name__ == '__main__':
    main()
