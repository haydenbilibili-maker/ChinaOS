# China OS 视觉路线图 · Round 2–5 追踪

> 设计系统收敛计划 · 2026-07  
> Round 2–4 已完成；Round 5 动效编排与页面过渡已交付。

## Round 2 交付清单

- [x] **令牌桥接** — `observatory.css` / `governanceVerdict.css` 语义色映射至 `:root`；`gy/tokens.css` 补充 GY→全局语义注释与 `--gy-brass` / `--gy-celadon`
- [x] **组件库扩展** — `ui.jsx`：`Badge` · `SourceBadge` · `DistBar` · `EmptyState` · `LoadingSkeleton`
- [x] **econdash 色值清理** — 移除 `AX` / `PALETTE`；图表轴/网格改用 `chartHelpers.js`
- [x] **看板 MacroH1Strip** — 改用 `StatGrid` + `os-stat-card`
- [x] **GySliceShell 原型** — `shared/gy/GySliceShell.jsx`；`qingnian` 模块试点
- [x] **Shell 抛光** — `os-group-block` 悬停统一；搜索/主题按钮 `focus-visible` 一致
- [x] **遗留模式文档** — 见 [`LEGACY_PATTERNS.md`](./LEGACY_PATTERNS.md)

## Round 3 交付清单（数据可视化质感统一）

- [x] **EChart.jsx** — `variant`（`default` | `compact` | `dashboard`）；统一 `animationDuration` + `prefers-reduced-motion` 降级
- [x] **CHART_SERIES_PALETTE** — `CHART_SERIES_COLORS` 语义序（power-red → cyber-cyan → fire-gold）；tooltip 联动 `--chart-tooltip-*` CSS 令牌
- [x] **home + econdash 图表色** — `SectionRegional` · `SectionCycle` · `SectionCompare` · `EconDataTab` · `benchmark` 移除模块级 `AX` / `PALETTE`
- [x] **viz 组件** — `OsGauge` · `OsSparkline` · `StatTrend`（`lib/viz/` + `ui.jsx` 再导出）
- [x] **Stat 升级** — `trend` / `trendValue` / `sub`；`os-stat-card` shimmer 默认启用
- [x] **StatGrid 扩展** — ≥23 模块采用 `StatGrid`（home 组 · talent · military · infrastructure 等）
- [x] **LiveChinaMap** — `lcm-map-shell` + `--chart-tooltip-*` 对齐地图 tooltip / drawer

## Round 4 交付清单（模块视觉对齐清扫）

- [x] **GY 全量 GySliceShell** — GY-03–58 共 56 切片 + `qingnian` 试点；`renqun-tupu`（GY-00）保留手写结构（含 Section 扩展）
- [x] **talent DistBar 统一** — 11 个 `*Section.jsx` 内联 `DistBars` → `ui.DistBar`
- [x] **ModuleFooter 补全** — heshan×4 · signalPanel · cushionMonitor · personalReview · attribution · threeForces · premierRadius · chronicle · huangfeizhai · legalStatutes · governanceHub · signalDashboard
- [x] **const AX 清零** — handong · wargame · macro · me（+6 Section）· ruleoflaw · talent
- [x] **图表轴色批量清理** — 117 文件 `#27324a` / `#93a1b5` → `AXIS` / `LABEL` token（`chartHelpers.js` 源定义保留）
- [x] **GySliceShell CSS** — `tokens.css` 补充 `.gy-slice-shell` / `.gy-slice-app`
- [x] **审计脚本** — `scripts/r4-checklist.mjs` + `r4-gy-migrate.mjs` 等 codemod 留存

## 成功指标

| 指标 | 目标 | Round 2 | Round 3 | Round 4 |
|------|------|---------|---------|---------|
| observatory 局部色变量 | ≤5（仅布局） | ✅ | — | ✅ |
| 新组件跨模块使用 | ≥3 模块 | ✅ | ✅ | ✅ DistBar 11+ |
| econdash 硬编码 `#27324a` | 0 | ✅ | ✅ | ✅ |
| home 模块 `const AX` | 0 | — | ✅ | ✅ 全站模块级 AX=0 |
| `StatGrid` 模块数 | ≥15 | 3 | ✅ 23+ | ✅ 维持 |
| GY GySliceShell 采用率 | 56/56 切片 | — | 1 试点 | ✅ 56/56 |
| checklist 全项通过 | ≥90% 模块 | — | — | ✅ 91.7%（177/193） |
| `npm run build` / vitest | 通过 | 待 CI | 待 CI | ✅ | ✅ R5 |

## Round 5 交付清单（动效编排与页面过渡）

- [x] **Shell 路由过渡** — `<Outlet>` 外包 `os-page-enter`（opacity + translateY 8px · 220ms `--ease-ink`）；主内容区 `scrollTo(0)` 与入场动画解耦
- [x] **区块错落入场** — 看板 `dash-screen-grid` 全量 `os-section-stagger`；观象台链路卡 `os-reveal`；home 组 live-feeds / econdash 通缩仪表栅格补齐 stagger
- [x] **治理链动效统一** — signalPanel · threeForces · cushionMonitor · attribution · premierRadius · observatory · governanceVerdict：统一 `--ease-ink` + `--duration-fast/slow`；verdict / signal 卡 mount 入场
- [x] **微交互** — `TabBar` pill 滑块指示器（CSS transform）；`os-filter-chip` 激活边框过渡；`os-btn` active `scale(0.98)` 已验证
- [x] **prefers-reduced-motion** — 扩展覆盖 `os-page-enter` · stagger/reveal 子项 · ticker/marquee · lcm 卫星图层动画 · ob-hero sheen 循环
- [x] **约束** — 未重引入神州粒子 120ms pulse；无新增 framer-motion；路由 enter ≤ 220ms

## Round 6 预览（技术债）

- stylelint `color-no-hex` 警告级规则（模块 CSS 白名单除外）
- `renqun-tupu/atlasViz.js` · `gametheory` 等残余 `#27324a`（系列色/非轴语义）
- `signal-panel` / `cushion-monitor` / `personal-review` 局部 `--brass` 去重
- industry 组 `StatGrid` 渐进补齐（当前 6/8 项通过为主）

## 相关文件

| 区域 | 路径 |
|------|------|
| 全局令牌 | `app/src/index.css` |
| 共享 UI | `app/src/app/ui.jsx` |
| 图表助手 | `app/src/modules/shared/chartHelpers.js` |
| 可视化引擎 | `app/src/lib/viz/EChart.jsx` · `OsGauge` · `OsSparkline` · `StatTrend` |
| GY 令牌 | `app/src/modules/shared/gy/tokens.css` |
| GY 外壳 | `app/src/modules/shared/gy/GySliceShell.jsx` |
| Round 4 脚本 | `scripts/r4-*.mjs` |
| 遗留清单 | `docs/LEGACY_PATTERNS.md` |
