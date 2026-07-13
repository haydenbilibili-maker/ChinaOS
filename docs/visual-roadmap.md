# China OS 视觉路线图 · Round 2 追踪

> 设计系统收敛计划 · 2026-07  
> Round 2 已完成项见下方勾选；Round 3–4 待办保留为 backlog。

## Round 2 交付清单

- [x] **令牌桥接** — `observatory.css` / `governanceVerdict.css` 语义色映射至 `:root`；`gy/tokens.css` 补充 GY→全局语义注释与 `--gy-brass` / `--gy-celadon`
- [x] **组件库扩展** — `ui.jsx`：`Badge` · `SourceBadge` · `DistBar` · `EmptyState` · `LoadingSkeleton`
- [x] **econdash 色值清理** — 移除 `AX` / `PALETTE`；图表轴/网格改用 `chartHelpers.js`
- [x] **看板 MacroH1Strip** — 改用 `StatGrid` + `os-stat-card`
- [x] **GySliceShell 原型** — `shared/gy/GySliceShell.jsx`；`qingnian` 模块试点
- [x] **Shell 抛光** — `os-group-block` 悬停统一；搜索/主题按钮 `focus-visible` 一致
- [x] **遗留模式文档** — 见 [`LEGACY_PATTERNS.md`](./LEGACY_PATTERNS.md)

## 成功指标（Round 2）

| 指标 | 目标 | 状态 |
|------|------|------|
| observatory 局部色变量 | ≤5（仅布局） | ✅ `--ink` ×3 + `--hair` ×2 |
| 新组件跨模块使用 | ≥3 模块 | ✅ econdash · talent · dashboard · qingnian |
| econdash 硬编码 `#27324a` | 0 | ✅ |
| `npm run build` | 通过 | 待 CI 验证 |

## Round 3 预览（未开始）

- 各模块 `DistBars` 本地副本批量替换为 `DistBar`
- `signal-panel` / `cushion-monitor` / `personal-review` 局部 `--brass` 去重
- `foundation/EconDataTab` 与 `benchmark` 图表色统一至 `CHART_SERIES_PALETTE`

## Round 4 预览（未开始）

- stylelint `color-no-hex` 警告级规则（模块 CSS 白名单除外）
- GY 全量迁移 `GySliceShell`
- 图表主题 token 与 EChart 全局 `textStyle` 联动审计

## 相关文件

| 区域 | 路径 |
|------|------|
| 全局令牌 | `app/src/index.css` |
| 共享 UI | `app/src/app/ui.jsx` |
| 图表助手 | `app/src/modules/shared/chartHelpers.js` |
| GY 令牌 | `app/src/modules/shared/gy/tokens.css` |
| GY 外壳 | `app/src/modules/shared/gy/GySliceShell.jsx` |
| 遗留清单 | `docs/LEGACY_PATTERNS.md` |
