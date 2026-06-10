# China OS 主应用壳 · `app/`（阶段三工程地基）

React + Vite + Tailwind 的主应用，承接框架图四层结构，让新模块「即插即用」。
`china.html` 作为迁移期的遗留参照保留；专题逐个迁入后退役。

## 运行

```bash
cd app
npm install
npm run dev      # http://localhost:5180
npm run build    # 产物在 app/dist/
```

## 架构

```
app/src/
├── main.jsx              # 入口（HashRouter，兼容任意静态托管）
├── App.jsx              # 路由：由注册表自动生成，新增模块无需改这里
├── index.css           # 设计令牌（权力红/钢灰/赛博青 · 暗色科技感）
├── app/
│   ├── registry.js     # ★ 模块注册表（单一数据源）：导航/路由/面包屑皆由此生成
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
    ├── sandbox/        # 治国沙盒 · 区域治理人才配置 + 推演（占位）
    └── foundation/     # 数据与系统底座 + DataBus 示例
```

## 加一个新模块（即插即用）

1. 新建 `src/modules/<id>/Page.jsx`，用 `ui.jsx` 的原子 + `EChart` 写页面。
2. 在 `src/app/registry.js` 的 `MODULES` 里加一项（`group` 选四层之一，`component` 用 `lazy()`）。
3. 完成——导航、路由、面包屑、代码分割自动生效。

## 与框架图的对应

注册表的 `group` 字段对应框架四层：`cognition`（认知内核）/ `lens`（内容透镜）/
`sim`（推演与训练）/ `foundation`（底座）。

## 迁移路线（后续）

- 把 `china.html` 的内容型专题逐个迁入 `modules/depth/*`（tabs/*.html 已是干净源，便于搬运）。
- DataBus 接 `worldBank()` 实拉，替换各模块的示意数据。
- 可视化引擎补地图（ECharts geo / 中国地图）与交互动画组件。
- 验收：首屏 < 3s、单模块可独立开发测试（已满足代码分割）。
