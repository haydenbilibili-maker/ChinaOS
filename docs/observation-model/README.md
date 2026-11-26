# 复杂网络观测模型

把 2012–2026 年的中国建模为以总书记为枢纽的星型—层级网络（四条权力管道 × 四个人事圈层），并把它落成一个可持续更新的观测模型：带阈值的指标、逐人节点表、情景概率与贝叶斯更新规则、事件编码协议和历史回测。数据截至 2026-11-26。

## 文件

| 路径 | 内容 |
| --- | --- |
| `docs/observation-model/复杂网络观测模型.md` | 完整模型文档（第 0–19 节：方法、个人与晋升、权力巩固、军队、反腐、党政、经济、社会、外交、用人网络、元老、模型本体、推演、充分性自评、指标字典、节点表、更新规则、回测、来源） |
| `data/observation-model/*.csv` | 数据导出：indicators、politburo、cmc、plenums、scenarios、econ、property_trend、events |
| `app/src/modules/observationModel/model.seed.js` | 应用读取的数据种子（单一数据源，与 CSV 同步） |
| `app/src/modules/observationModel/modelLogic.js` | 出席率、精英稳定性汇总、贝叶斯更新等纯函数 |
| `app/src/modules/observationModel/Page.jsx` | 应用页面：治理结构 → 复杂网络观测模型（`/modules/observation-model`） |

## 信源等级

- A：已核对官方通报或权威一手来源
- B：公开履历或权威媒体，未逐一复核
- C：模型推断（情景概率、圈层划分），不是事实陈述

## 更新流程

1. 每周：扫描中纪委、国防部、新华社任免，在 `EVENTS` 顶部追加一条，按第 17.4 节编码。
2. 每月：更新 `INDICATORS` 中 E、M4、X2 等指标的当前值与状态；有新信号时按 `L_SIGNALS` 的似然值重算 `SCENARIOS`。
3. 每次全会、两会、中央经济工作会议后：复核 `POLITBURO`、`CMC`、`PLENUMS`。
4. 改动 `model.seed.js` 后同步导出 `data/observation-model/*.csv`，运行 `npm run check`。

## 关联

- Claude 文档版（可批注）：https://claude.ai/artifact/Ko7oZYEgWbG82eBjmdcFcg
- Claude 看板版：https://claude.ai/artifact/13CGz7u4UgPzLLkaj95xtn
- 应用内关联模块：观象台、宏观再平衡信号灯、三力监测仪、反腐结构观测、领袖统治、人才精英库、总理权限半径

## 更新记录

- **2026-11-26 · v2**
  - 数据：陈吉宁（政治局委员、上海市委书记）11 月 24 日被立案审查调查（信源 B：新华社通报，经媒体转述核对）。政治局原委员被查 3→4/24，接班候选池 10→9。
  - 情景：领导层维度改为由 `L_UPDATES` 逐次计算，五中全会后 75.4%，陈吉宁被查后“连任不明确接班”升至 85.0%。
  - 页面：改为观测驾驶舱。新增可交互权力网络（2022 / 2026 快照对照、节点详情）、情景概率轨迹与多信号假设推演、指标看板与事件时间轴联动。
