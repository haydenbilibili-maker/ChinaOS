# China OS 项目文档库

## 目录结构

```
china/
├── china.html          # 主应用入口
├── index.html          # 备用入口
├── data/               # 本地数据库
│   ├── wb_api_chn.csv  # 世界银行中国指标原始数据 (1513 指标)
│   └── wb_catalog.json # 指标目录索引 (供前端加载)
├── scripts/            # 构建脚本
│   └── build_wb_catalog.py  # 从 CSV 生成 JSON 目录
├── docs/               # 项目文档
│   └── README.md       # 本文件
└── China_OS_PRD_v2.0.md
```

## 世界银行数据 (WB)

- **来源**: 世界发展指标 (World Development Indicators)
- **国家**: 中国 (CHN)
- **更新日期**: 2026-01-28
- **指标数量**: 1513 个
- **年份范围**: 1960–2024

### 关键指标示例

| 指标代码 | 名称 | 最新值 (2024) |
|---------|------|---------------|
| NY.GDP.MKTP.KD.ZG | GDP 增长率 | 4.98% |
| NY.GDP.MKTP.CD | GDP（现价美元） | 18.7 万亿 |
| SP.POP.TOTL | 人口总数 | 14.09 亿 |
| BX.KLT.DINV.CD.WD | 外商直接投资净流入 | 185 亿美元 |
| BX.GSR.GNFS.CD | 货物和服务出口 | 3.79 万亿美元 |

### 更新目录

```bash
cd china
python3 scripts/build_wb_catalog.py
```

## 本地运行

由于浏览器安全策略，`fetch()` 加载本地 JSON 需通过 HTTP 服务访问：

```bash
cd china
python3 -m http.server 8000
# 访问 http://localhost:8000/china.html
```
