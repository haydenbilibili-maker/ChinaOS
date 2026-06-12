# China OS · 中国深度调研 Intelligence Atlas

**China OS**（china2OS）是一个面向中国政治、经济、科技与社会议题的**结构化调研与可视化平台**。项目将「中国深度调研系列」的学理框架、公开数据与专题报告，整合为可交互的 Web 应用——以模块注册表驱动导航，以 ECharts 与 IndexedDB 承载图表与本地数据，支持从宏观看板到专题推演的多层次阅读路径。

> 治大国如烹小鲜 —— 穿透宏观叙事，解析权力运作与制度演进的底层逻辑。

---

## 核心功能模块

应用按 **13 个功能分组**、**100+ 专题模块** 组织，主要能力概览如下：

| 分组 | 代表模块 | 说明 |
|------|----------|------|
| **看板** | 中枢看板、神州实况、神州活图 | 全局总揽、公开慢直播、省级分层地图与时间轴对比 |
| **认知内核** | 康波周期、权力物理、博弈理论、修昔底德陷阱… | 思想工具与理论模型库 |
| **内容透镜** | 深度透视、文明透视、外交博弈、科技图谱、国运时间轴 | 四大支柱与多维专题入口 |
| **制度与改革** | 权力逻辑、治理现代化、法治建设、统一大市场… | 权力 · 治理 · 法治 |
| **产业 / 科技 / 社会 / 金融 / 区域 / 安全** | 算力设施、新质生产力、人口结构、全球资产脉搏、台海局势… | 分域深度专题 |
| **推演与训练** | 治国沙盒、领袖统治、人才精英库、政令文库、汉东治理沙盘… | 情景推演、人物图谱、政策文本挖掘 |
| **数据与系统** | 数据底座、全局监测台 | 世界银行 / 国家统计局 / IMF 等多源数据骨架 |

**重点模块速览：**

- **中枢看板** — 模块直达、实时指标、新闻与行情聚合大屏
- **人才精英库** — 结构化人力资本图谱（政要、机构、智库、资本逻辑等）
- **政令文库** — 政策文件与法律条文语料，支持检索与文本挖掘
- **领袖统治** — 公开口径下的权力结构、决策机制与多维可视化
- **治国沙盒** — 人才配置、政策组合与虚构省份治理推演
- **全球资产脉搏** — 股市、债市、汇市与大宗商品实时脉搏
- **神州活图 / 神州实况** — 省级活地图、公开慢直播与枢纽实况

完整模块列表见 [`app/src/app/registry.js`](app/src/app/registry.js)。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite 5 |
| 路由 | React Router 6（HashRouter，兼容静态托管） |
| 样式 | Tailwind CSS 3 + 玻璃拟态暗色设计令牌 |
| 可视化 | ECharts 5（统一封装于 `lib/viz/EChart.jsx`） |
| 图标 | Lucide React |
| 流媒体 | hls.js（神州实况 HLS 慢直播） |
| 本地存储 | IndexedDB（`china-os-db`：datasets / rows / figures / docs） |
| 数据脚本 | Python 3（语料生成、Seed 构建、世界银行目录等） |

---

## 本地开发

```bash
cd app
npm install
npm run dev
```

开发服务器默认运行于 **http://localhost:5173**（Vite 默认端口）。若需固定端口 5180，可执行：

```bash
npm run dev -- --port 5180 --strictPort
```

## 构建与预览

```bash
cd app
npm run build      # 产物输出至 app/dist/
npm run preview    # 本地预览生产构建
```

`vite.config.js` 中 `base: './'`，可部署至任意静态子路径，与遗留 HTML 报告共存。

---

## 数据与语料

### IndexedDB 本地库

浏览器端持久化，无需后端。核心 Store：

- `datasets` / `rows` — 结构化数据集与行级记录
- `figures` — 政治人物与精英简历
- `docs` — 文档元数据

Seed 数据位于 `app/src/lib/db/`（如 `figureSeed.js`、`antiCorruptionSeed.js`、`thinkTankSeed.js` 等），首次访问相关模块时写入本地库。

### 静态语料库

| 路径 | 内容 |
|------|------|
| `app/public/legal-corpus/` | 法律法规与司法解释（约 180+ 篇，`manifest.json` 索引） |
| `app/public/policy-corpus/` | 政府工作报告、部委政策、地方文件（约 240+ 篇） |
| `app/public/geo/` | 地图 GeoJSON（如 `world.json`） |
| `data/` | 世界银行目录、API 导出等原始数据 |

### Python 脚本

`scripts/` 目录提供语料与 Seed 的生成、审计与扩展工具，例如：

- `build_legal_corpus.py` / `build_policy_corpus.py` — 语料库构建
- `genAntiCorruptionSeed.py` / `genAcademicianSeed.py` — 人才与机构 Seed
- `build_world_bank_seed.py` — 世界银行数据种子
- `audit_corpus.py` — 语料质量审计

---

## 项目结构

```
china2OS/
├── README.md                 # 本文件
├── app/                      # ★ 主应用（React + Vite）
│   ├── src/
│   │   ├── app/              # Shell、registry.js 模块注册表、共享 UI
│   │   ├── modules/          # 各专题模块（每模块 Page.jsx + 懒加载）
│   │   └── lib/              # 数据层、可视化、语料、市场行情等
│   ├── public/               # 静态资源与语料库
│   └── dist/                 # 构建产物
├── scripts/                  # Python 数据与语料脚本
├── data/                     # 外部数据快照
├── docs/                     # 补充文档
├── tabs/                     # 迁移期 HTML 专题源
├── energy-module/            # 能源模块独立实验
├── china.html                # 遗留总览页（迁移参照）
├── power-logic.html          # 遗留专题报告
├── straits.html / military.html
└── 中国深度调研系列_索引与恢复指令.md   # 系列索引与术语规范
```

**新增模块（即插即用）：**

1. 创建 `app/src/modules/<id>/Page.jsx`
2. 在 `app/src/app/registry.js` 的 `MODULES` 中注册一项
3. 导航、路由、面包屑与代码分割自动生效

详见 [`app/README.md`](app/README.md)。

---

## 免责声明

本项目内容基于**公开信息梳理**与**学理分析框架**，旨在提供结构化认知工具与可视化阅读体验：

- **非官方发布**，不代表任何政府、机构或个人的立场
- **非投资建议**，不构成对证券、汇率或任何资产的买卖建议
- **非政治评价**，不对具体人物、政策或事件作价值判断
- **非预测工具**，图表与推演均为示意性分析，不保证准确性与时效性

使用者应自行核实信息来源，并遵守所在地法律法规。项目作者不对因使用本项目内容而产生的任何后果承担责任。

---

## 许可证

私有项目。未经授权请勿复制、分发或商用。
