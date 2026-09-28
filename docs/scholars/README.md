# 中国学者专栏 · 信息架构（IA）

> 版本 v2.0 · 2026-09-28 · 10 位学者（黄奇帆 + 9 位新增）· 名册与选人理由见 [roster.md](./roster.md)

## 1. 定位

以「一人一看板」整理中国经济学、社会学、国际关系学者与学者型官员的公开著作、讲话与署名文章，并与本站经济大盘、住房地产、地方债务、人口结构、中日比较等模块的数据对照，检验其判断与现实的吻合度。底线是**可追溯出处**：每条内容标注场合、日期与媒体/著作，区分原话与转述。总览页提供「思想光谱」议题 × 学者对照矩阵。

## 2. 路由与注册

| 路由 | registry id | navOrder | 说明 |
| --- | --- | --- | --- |
| `/scholars` | `scholars` | 0 | 专栏总览 · 名册 · 思想光谱矩阵（`?issue=` 深链议题） |
| `/scholars/huang-qifan` | `scholarHuangQifan` | 1 | 黄奇帆 |
| `/scholars/lin-yifu` | `scholarLinYifu` | 2 | 林毅夫 |
| `/scholars/zhou-qiren` | `scholarZhouQiren` | 3 | 周其仁 |
| `/scholars/wen-tiejun` | `scholarWenTiejun` | 4 | 温铁军 |
| `/scholars/he-xuefeng` | `scholarHeXuefeng` | 5 | 贺雪峰 |
| `/scholars/yu-yongding` | `scholarYuYongding` | 6 | 余永定 |
| `/scholars/cai-fang` | `scholarCaiFang` | 7 | 蔡昉 |
| `/scholars/zhou-li-an` | `scholarZhouLian` | 8 | 周黎安 |
| `/scholars/yan-xuetong` | `scholarYanXuetong` | 9 | 阎学通 |
| `/scholars/xiang-biao` | `scholarXiangBiao` | 10 | 项飙 |

- 组 `scholars`（学者专栏，位于「推演与训练」之前）。图标：`GraduationCap`（专栏）、`UserRound`（个人看板）。
- 横链：`moduleCrossLinks.js` 中每位学者一个键，并在经济大盘、住房地产、地方债务、人口结构、乡村振兴、外交博弈、中日比较等模块追加学者入口。
- 首屏 bundle：每位学者的 `Page.jsx` 由 registry `lazy()` 按路由加载，完整 `data.js` 只进入其路由 chunk；总览页只汇入轻量的 `stances.js`。

## 3. 目录结构

```
app/src/modules/scholars/
├── schema.js            通用数据契约 · 核验分级 · 台账状态 · SCHOLARS 名册 · STANCE_ISSUES · SCHOLAR_TABS
├── ScholarKit.jsx       共享展示件：QuoteCard / ClaimList / LedgerBoard / DataTable / 徽标
├── ScholarBoard.jsx     通用五 Tab 看板（传入某学者 data.js 命名空间）
├── scholarCharts.js     通用 ECharts option：议题热力 / 履历甘特 / 著作时间线 / 口径偏离 / 框架图谱
├── stancesIndex.js      汇总各学者 stances.js（思想光谱矩阵）
├── Page.jsx             专栏总览
└── <dir>/               每位学者一个目录（huangQifan / linYifu / zhouQiren / …）
    ├── data.js          数据真源
    ├── stances.js       思想光谱条目（七议题，无可核验表态则不写）
    └── Page.jsx         三行：<ScholarBoard data={D} />
scripts/check-scholars.mjs   数据契约门禁（已纳入 npm run check）
```

## 4. 看板统一结构（五 Tab，`?tab=` 可深链）

1. **总览**：统计卡 · 人物速写 · 思想框架图谱 · 履历甘特 · 年份×领域热力 · 代表性原话卡。
2. **分领域观点**（`?theme=`）：按该学者专长设 5–7 个领域，逐条列出原话/转述，并给出本站对照模块入口。
3. **预判检验台账**：已兑现 / 已失败 / 未决三列 +（可选）数字口径偏离图表。
4. **著作与讲话文库**：著作时间线与清单（ISBN、核验级）、讲话文库（可按领域筛选）。
5. **争议与出处**：争议双栏并陈、存疑/不收录/更正清单、核验统计。

## 5. 数据契约（摘要，详见 `schema.js` 与 `huangQifan/data.js`）

- `BOARD`：`order, subtitle, span, careerTitle, defaultTheme, moduleId, sourceNote`（看板壳配置）。
- `CAREER_GROUPS`：`{ key: { label, color } }`；`CAREER[i].group` 引用其 key，起止为小数年。
- `CORPUS` 条目：`id, date, form, venue, source, url?, verified, themes[]`。
- `CLAIMS` 条目：由 `RAW_CLAIMS` 引用 `CORPUS` 生成，得到 `text, type(原话|转述), date, venue, source, url, verified`。
- `FEATURED`（原话 id）、`THEME_LINKS`（领域 → 本站路由）、`THEME_INTRO`。
- `LEDGER` 条目：`claim, type, date, venue, status(done|failed|open), check, dataSrc`；`NUMERIC_CHECKS` 可为空数组。
- `STANCES`（stances.js）：`{ issueId: { stance, type, quote?, date, venue, source, url?, verified } }`。
- `verified` 四级：`primary`（主办方/官方/署名/著作）· `media`（主流媒体报道）· `reprint`（整理稿转载）· `doubt`（存疑）。

## 6. 核验规则（硬约束）

1. 原话须逐字取自可追溯出处（场合 + 日期 + 媒体/著作），不得构造或改写为直接引语。
2. 概括性内容一律标「转述」，不加引号。
3. 网传未核实内容标〔存疑〕或不收录；托名「最新演讲」拼接稿一律不收录。
4. 数字标口径与出处；整理稿中的数字降为「转载」级别，不作为本人立场定论。
5. 台账只收可检验的前瞻性表述；窗口未到期或无可比数据者归「未决」，不做虚假收束。
6. 思想光谱矩阵每格须有出处；无可核验表态则留空，不推测。
7. 对在世人物保持客观中立，不作人身评价。

## 7. 扩展新学者（步骤）

1. 在 `schema.js` 的 `SCHOLARS` 中新增条目（`id/name/status/route/archetype/roles/fields/corpus/accent`）。
2. 新建 `modules/scholars/<dir>/data.js`（按第 5 节契约，照抄黄奇帆的派生代码）、`stances.js`、三行 `Page.jsx`。
3. 在 `stancesIndex.js` 汇入其 `STANCES`。
4. 在 `registry.js` 注册 `/scholars/<slug>`（group `scholars`，icon `UserRound`，navOrder 递增），在 `moduleCrossLinks.js` 增加键与相关模块横链。
5. 在 `docs/scholars/` 增补 `<slug>-sources.md` 出处清单并更新 `roster.md`。
6. `node scripts/check-scholars.mjs <dir>`、`npm run check` 与 `npm run build` 通过后上线。
