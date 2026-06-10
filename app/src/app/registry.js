import { lazy } from 'react';

// ============================================================================
// 模块注册表 · China OS 单一数据源
// ----------------------------------------------------------------------------
// 新增一个模块 = 在 MODULES 里加一项（含 group / 路由 / 懒加载组件）。
// Shell 的导航、路由、面包屑全部由此生成，新模块「即插即用」、无需改框架。
// 分组对应框架图四层：cognition 认知内核 / lens 内容透镜 / sim 推演训练 / foundation 底座
// ============================================================================

export const GROUPS = [
  { id: 'cognition', label: '认知内核', desc: '思想工具 · 理论模型', accent: '#c41e3a' },
  { id: 'lens', label: '内容透镜', desc: '四大支柱', accent: '#22d3ee' },
  { id: 'sim', label: '推演与训练', desc: '沙盒 · 内参', accent: '#d4af37' },
  { id: 'foundation', label: '数据与系统', desc: '底座', accent: '#64748b' },
];

export const MODULES = [
  {
    id: 'cognition',
    path: '/cognition',
    group: 'cognition',
    title: '认知内核',
    subtitle: '思想工具 · 理论模型库',
    icon: 'BrainCircuit',
    component: lazy(() => import('../modules/cognition/Page.jsx')),
  },
  {
    id: 'depth',
    path: '/depth',
    group: 'lens',
    title: '深度透视',
    subtitle: '7 维 · 90+ 专题',
    icon: 'Layers',
    component: lazy(() => import('../modules/depth/Page.jsx')),
  },
  {
    id: 'foodSecurity',
    path: '/food-security',
    group: 'lens',
    title: '粮食安全',
    subtitle: '大国粮仓 · 迁移样板',
    icon: 'Wheat',
    component: lazy(() => import('../modules/foodSecurity/Page.jsx')),
  },
  {
    id: 'civilization',
    path: '/civilization',
    group: 'lens',
    title: '文明透视',
    subtitle: '12 卷源代码',
    icon: 'ScrollText',
    component: lazy(() => import('../modules/civilization/Page.jsx')),
  },
  {
    id: 'diplomacy',
    path: '/diplomacy',
    group: 'lens',
    title: '外交博弈',
    subtitle: '中美 · 区域 · 能源航道',
    icon: 'Globe2',
    component: lazy(() => import('../modules/diplomacy/Page.jsx')),
  },
  {
    id: 'techtree',
    path: '/techtree',
    group: 'lens',
    title: '科技树',
    subtitle: 'AI · 核聚变 · 太空 · 军事',
    icon: 'GitBranch',
    component: lazy(() => import('../modules/techtree/Page.jsx')),
  },
  {
    id: 'sandbox',
    path: '/sandbox',
    group: 'sim',
    title: '治国沙盒',
    subtitle: '人才配置 · 情景推演',
    icon: 'Boxes',
    component: lazy(() => import('../modules/sandbox/Page.jsx')),
  },
  {
    id: 'foundation',
    path: '/foundation',
    group: 'foundation',
    title: '数据与系统底座',
    subtitle: '世行 · 统计局 · IMF',
    icon: 'Database',
    component: lazy(() => import('../modules/foundation/Page.jsx')),
  },
];

export const modulesByGroup = (groupId) => MODULES.filter((m) => m.group === groupId);
export const moduleById = (id) => MODULES.find((m) => m.id === id);
export const DEFAULT_MODULE = MODULES[0];
