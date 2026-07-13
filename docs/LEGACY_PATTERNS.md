# 遗留 UI 模式清单 · LEGACY_PATTERNS

> 供 Round 3–4 清理追踪。新模块/新页面**不应**再引入下列反模式。

## 硬编码图表色（anti-pattern）

```js
// ❌ 勿用
const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };
const PALETTE = ['#c41e3a', '#22d3ee', ...];

// ✅ 改用
import { AXIS, LABEL, GRID_LINE, LEGEND, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';
```

**仍含 `AX` / `#27324a` 的文件（待 Round 5 或专题清理）：**

- ~~各 `econdash` Section~~ ✅ Round 3
- ~~各 `talent/*Section.jsx` 内联 `DistBars`~~ ✅ Round 4 → `DistBar`
- ~~`handong` · `wargame` · `macro` · `me` · `ruleoflaw` · `talent/Page` `const AX`~~ ✅ Round 4
- `app/src/modules/renqun-tupu/atlasViz.js`（图谱 viz 专用）
- `app/src/modules/gametheory/Page.jsx`（系列色残留，非轴常量）
- 少量 industry 模块 `#27324a` 作系列/category 色（非 `const AX`）

## 模块内重复设计令牌（anti-pattern）

```css
/* ❌ 勿在模块 CSS 重定义全局已有令牌 */
.my-module {
  --brass: #b18a52;
  --celadon: #79a496;
}

/* ✅ 直接使用 :root 或 GY tokens.css 桥接 */
color: var(--brass);
color: var(--gy-celadon);
```

**仍局部定义 `--brass` / `--celadon` 的模块 CSS：**

- ~~`signal-panel/signal-panel.css`~~ ✅ Final Polish
- ~~`cushion-monitor/cushion-monitor.css`~~ ✅ Final Polish
- ~~`personal-review/personal-review.css`~~ ✅ Final Polish
- ~~`three-forces/three-forces.css`~~ ✅ Final Polish
- ~~`huangfeizhai/huangfeizhai.css`~~ ✅ Final Polish（`--brass` 继承 `:root`）

## 内联 DistBars 组件（anti-pattern）

```jsx
// ❌ 各 Section 复制粘贴
function DistBars({ data, color, ... }) { ... }

// ✅ 统一
import { DistBar } from '../../app/ui.jsx';
```

**主副本：** `talent/Page.jsx` 已迁移；11 个 Section ✅ Round 4 批量替换为 `DistBar`。

## 页头/页脚不统一（GY 模块）

```jsx
// ❌ 手写 PageHeader + 无 ModuleFooter
// ✅ GY 切片
import GySliceShell from '../shared/gy/GySliceShell.jsx';
```

**已试点：** `qingnian`  
**已全量：** GY-03–58 共 56 切片（`GySliceShell`）  
**例外：** `renqun-tupu`（GY-00 母索引，含 Section 扩展，手写 `ModuleFooter`）

## 数据源徽章（anti-pattern）

```jsx
// ❌ 内联绿/琥珀 hex
<span style={{ color: live ? '#10b981' : '#e8a317' }} />

// ✅
import { SourceBadge } from '../../app/ui.jsx';
<SourceBadge live={live} asOf={asOf} />
```

## Lint 建议（Round 4）

若引入 stylelint，建议 warn 级规则：

```json
{
  "rules": {
    "color-no-hex": [true, { "severity": "warning" }],
    "declaration-property-value-disallowed-list": {
      "/^--/": ["/^#[0-9a-f]{3,8}$/i"],
      "severity": "warning"
    }
  }
}
```

白名单：`observatory.css` 布局渐变、`tokens.css` GY 专属 `--qing` / `--dai` 等书体美学色。

## 检查命令

```bash
# 硬编码图表轴色
rg "#27324a" app/src/modules --glob "*.{jsx,js,ts,tsx}"

# 模块内 AX 常量
rg "const AX = " app/src/modules

# 局部 brass 重定义
rg "--brass:\s*#" app/src/modules
```

## Round 2 已消除

- [x] `econdash/Page.jsx` — `AX` / `PALETTE` / `#27324a`
- [x] `observatory.css` — 局部 `--brass` / `--celadon` / `--red` / `--amber` / `--green`
- [x] `governanceVerdict.css` — 局部语义色重定义
- [x] `dashboard` `MacroH1Strip` — 自定义 grid 卡 → `StatGrid` + `Stat`
