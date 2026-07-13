# China OS 视觉路线图 · Round 2–3 追踪

> 设计系统收敛计划 · 2026-07  
> Round 2 已完成；Round 3 数据可视化质感统一已交付；Round 4 待办保留为 backlog。

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

## 成功指标

| 指标 | 目标 | Round 2 | Round 3 |
|------|------|---------|---------|
| observatory 局部色变量 | ≤5（仅布局） | ✅ | — |
| 新组件跨模块使用 | ≥3 模块 | ✅ | ✅ OsSparkline · StatTrend |
| econdash 硬编码 `#27324a` | 0 | ✅ | ✅ |
| home 模块 `const AX` | 0 | — | ✅ econdash 全清 |
| `StatGrid` 模块数 | ≥15 | 3 | ✅ 23+ |
| `npm run build` / vitest | 通过 | 待 CI | 待 CI |

## Round 4 预览（未开始）

- stylelint `color-no-hex` 警告级规则（模块 CSS 白名单除外）
- GY 全量迁移 `GySliceShell`
- 各 `talent/*Section.jsx` 内联 `DistBars` 批量替换为 `DistBar`
- `signal-panel` / `cushion-monitor` / `personal-review` 局部 `--brass` 去重

## 相关文件

| 区域 | 路径 |
|------|------|
| 全局令牌 | `app/src/index.css` |
| 共享 UI | `app/src/app/ui.jsx` |
| 图表助手 | `app/src/modules/shared/chartHelpers.js` |
| 可视化引擎 | `app/src/lib/viz/EChart.jsx` · `OsGauge` · `OsSparkline` · `StatTrend` |
| GY 令牌 | `app/src/modules/shared/gy/tokens.css` |
| GY 外壳 | `app/src/modules/shared/gy/GySliceShell.jsx` |
| 遗留清单 | `docs/LEGACY_PATTERNS.md` |
