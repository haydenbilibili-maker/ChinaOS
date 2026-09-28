# 中国学者专栏 · 信息架构（IA）

> 版本 v1.0 · 2026-09-28 · 首位学者：黄奇帆

## 1. 定位

以「一人一看板」整理中国经济学者与学者型官员的公开著作、讲话与署名文章，并与本站经济大盘、住房地产、地方债务、中日比较等模块的数据对照，检验其判断与现实的吻合度。底线是**可追溯出处**：每条内容标注场合、日期与媒体/著作，区分原话与转述。

## 2. 路由与注册

| 路由 | registry id | 组 | 说明 |
| --- | --- | --- | --- |
| `/scholars` | `scholars` | `scholars`（学者专栏） | 专栏总览 · 名册卡片 |
| `/scholars/huang-qifan` | `scholarHuangQifan` | `scholars` | 黄奇帆观点看板 |

- 新建独立顶层组 `scholars`（位于「推演与训练」之前）：侧栏子分组仅在史鉴组渲染，放入 `sim` 组语义不符。
- 图标：`GraduationCap`（专栏）、`UserRound`（个人看板），均已在 `moduleIcons.js` 注册。
- 横链：`moduleCrossLinks.js` 新增 `scholars`、`scholarHuangQifan`、`debtHeatmap` 键，并在 `econdash`、`housing`、`japanLostDecades` 追加黄奇帆链接。

## 3. 目录结构

```
app/src/modules/scholars/
├── schema.js            通用数据契约 · 核验分级 · 台账状态 · SCHOLARS 名册 · SCHOLAR_TABS
├── ScholarKit.jsx       共享展示件：QuoteCard / ClaimList / LedgerBoard / DataTable / 徽标
├── Page.jsx             专栏总览
└── huangQifan/
    ├── data.js          数据真源（PROFILE / CAREER / BOOKS / CORPUS / CLAIMS / LEDGER / NUMERIC_CHECKS / FRAMEWORK / CONTROVERSIES / DOUBTFUL）
    ├── charts.js        ECharts option：议题热力 / 履历甘特 / 著作时间线 / 口径偏离 / 框架图谱
    └── Page.jsx         五 Tab 看板
```

## 4. 看板统一结构（五 Tab，`?tab=` 可深链）

1. **总览**：统计卡 · 人物速写 · 思想框架图谱 · 履历甘特 · 年份×领域热力 · 代表性原话卡。
2. **分领域观点**（`?theme=`）：七领域（宏观、金融、土地房地产、产业开放、贸易、数字、社会民生）逐条列出原话/转述，并给出本站对照模块入口。
3. **预判检验台账**：已兑现 / 已失败 / 未决三列 + 数字口径偏离图表。
4. **著作与讲话文库**：著作时间线与清单（ISBN、核验级）、讲话文库（可按领域筛选）。
5. **争议与出处**：争议双栏并陈、存疑/不收录/更正清单、核验统计。

## 5. 数据契约（摘要，详见 `schema.js`）

- `CORPUS` 条目：`id, date, form, venue, source, url?, verified, themes[]`。
- `CLAIMS` 条目：由 `RAW_CLAIMS` 引用 `CORPUS` 生成，得到 `text, type(原话|转述), date, venue, source, url, verified`。
- `LEDGER` 条目：`claim, type, date, venue, status(done|failed|open), check, dataSrc`。
- `verified` 四级：`primary`（主办方/官方/署名/著作）· `media`（主流媒体报道）· `reprint`（整理稿转载）· `doubt`（存疑）。

## 6. 核验规则（硬约束）

1. 原话须逐字取自可追溯出处（场合 + 日期 + 媒体/著作），不得构造或改写为直接引语。
2. 概括性内容一律标「转述」，不加引号。
3. 网传未核实内容标〔存疑〕或不收录；托名「最新演讲」拼接稿一律不收录。
4. 数字标口径与出处；整理稿中的数字降为「转载」级别，不作为本人立场定论。
5. 台账只收可检验的前瞻性表述；窗口未到期或无可比数据者归「未决」，不做虚假收束。
6. 对在世人物保持客观中立，不作人身评价。

## 7. 扩展新学者（步骤）

1. 在 `schema.js` 的 `SCHOLARS` 中把一个 `planned` 席位改为 `live`，填写 `id/name/route/roles/fields/corpus`。
2. 新建 `modules/scholars/<slug>/data.js`，按第 5 节契约导出数据；`charts.js` 可直接复制黄奇帆版本（仅依赖数据形状）。
3. `Page.jsx` 复用 `SCHOLAR_TABS` 与 `ScholarKit`；缺失维度可隐藏对应 Tab。
4. 在 `registry.js` 注册 `/scholars/<slug>`（group `scholars`），在 `moduleCrossLinks.js` 增加键。
5. 在 `docs/scholars/` 增补该学者的出处清单；`npm run check` 与 `npm run build` 通过后上线。
