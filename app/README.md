# China OS 主应用壳 · `app/`（阶段三工程地基）

React + Vite + Tailwind 的主应用，承接框架图四层结构，让新模块「即插即用」。
`china.html` 作为迁移期的遗留参照保留；专题逐个迁入后退役。

## 运行

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 app/dist/
```

## 架构

```
app/src/
├── main.jsx              # 入口（HashRouter，兼容任意静态托管）
├── App.jsx              # 路由：由注册表自动生成，新增模块无需改这里
├── index.css           # 设计令牌（权力红/钢灰/赛博青 · 暗色科技感）
├── app/
│   ├── registry.js     # ★ 279 模块注册表（单一数据源）：导航/路由/面包屑皆由此生成
│   ├── moduleIcons.js  # 注册表图标白名单，避免动态图标查找污染首屏
│   ├── Shell.jsx       # 壳布局：分组侧边导航 + 面包屑 + <Outlet/>
│   └── ui.jsx          # 共享 UI 原子（PageHeader/Card/Stat/Grid/Placeholder）
├── lib/
│   ├── viz/EChart.jsx  # ★ 可视化引擎核心：ECharts 统一封装（resize/dispose/暗色主题）
│   └── data/DataBus.js # ★ 数据层骨架：带缓存的多源接入（WB/NBS/IMF）
└── modules/            # 每个模块一个文件夹，含 Page.jsx，按路由懒加载（独立 chunk）
    ├── cognition/      # 认知内核 · 思想工具与理论模型库（康波周期等）
    ├── depth/          # 深度透视 · 7 维（迁移期外链 china.html）
    ├── civilization/   # 文明透视 · 12 卷
    ├── diplomacy/      # ★ 外交博弈（新一级模块）· 中美/区域/能源航道 + 雷达/条形图
    ├── techtree/       # ★ 科技树（新一级模块）· AI/核聚变/太空/军事 + TRL 图
    ├── shijian/        # 史鉴·中华壳（SJ-00~57 单文件 iframe）
    ├── shijian-world/  # 史鉴·世界壳（SJW-00~32）
    ├── santi/          # 三体思想实验透镜（R0–R4）
    ├── econdash/       # 经济大盘八 Tab（含世行/促消费/H1）
    ├── sandbox/        # 治国沙盒 · 区域治理人才配置 + 推演
    └── foundation/     # 数据与系统底座 + DataBus 示例
```

## 加一个新模块（即插即用）

1. 新建 `src/modules/<id>/Page.jsx`，用 `ui.jsx` 的原子 + `EChart` 写页面。
2. 在 `src/app/registry.js` 的 `MODULES` 里加一项（`group` 选四层之一，`component` 用 `lazy()`）。
3. 完成——导航、路由、面包屑、代码分割自动生效。

## 与框架图的对应

注册表现有 19 个一级分组；`cognition` / `lens` / `sim` / `foundation` 仍是框架主轴，
并扩展制度、产业、社会、史鉴双线、治理结构等领域分组。实际定义以 `registry.js` 为准。

## 验证门禁

在仓库根目录运行 `npm run check`：依次检查 registry/路由/交叉链接、UI 契约、
史鉴中华与世界共 91 个单文件卷，以及现有 Vitest 测试。

## 迁移路线（后续）

- 把 `china.html` 的内容型专题逐个迁入 `modules/depth/*`（tabs/*.html 已是干净源，便于搬运）。
- DataBus 接 `worldBank()` 实拉，替换各模块的示意数据。
- 可视化引擎补地图（ECharts geo / 中国地图）与交互动画组件。
- 验收：首屏 < 3s、单模块可独立开发测试（已满足代码分割）。
