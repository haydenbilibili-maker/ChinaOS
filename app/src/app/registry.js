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
  { id: 'depthtopics', label: '深度专题', desc: '已迁移', accent: '#10b981' },
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
    id: 'foodSecurity', path: '/food-security', group: 'depthtopics',
    title: '粮食安全', subtitle: '大国粮仓 · 含地图', icon: 'Wheat',
    component: lazy(() => import('../modules/foodSecurity/Page.jsx')),
  },
  {
    id: 'urban', path: '/urban', group: 'depthtopics',
    title: '新型城镇化', subtitle: '市民化 · 城市群 · 含地图', icon: 'Building2',
    component: lazy(() => import('../modules/urban/Page.jsx')),
  },
  {
    id: 'ecology', path: '/ecology', group: 'depthtopics',
    title: '生态文明', subtitle: '双碳 · GEP · 碳市场', icon: 'Leaf',
    component: lazy(() => import('../modules/ecology/Page.jsx')),
  },
  {
    id: 'automotive', path: '/automotive', group: 'depthtopics',
    title: '汽车主权', subtitle: '新能源 · 换道超车', icon: 'Car',
    component: lazy(() => import('../modules/automotive/Page.jsx')),
  },
  {
    id: 'dataElement', path: '/data-element', group: 'depthtopics',
    title: '数据要素', subtitle: '确权 · 入表 · 东数西算', icon: 'Binary',
    component: lazy(() => import('../modules/dataElement/Page.jsx')),
  },
  {
    id: 'digital', path: '/digital', group: 'depthtopics',
    title: '数字经济', subtitle: '数实融合 · 平台', icon: 'Cpu',
    component: lazy(() => import('../modules/digital/Page.jsx')),
  },
  {
    id: 'bri', path: '/bri', group: 'depthtopics',
    title: '一带一路', subtitle: '六廊六路 · 中欧班列', icon: 'Route',
    component: lazy(() => import('../modules/bri/Page.jsx')),
  },
  {
    id: 'foreignTrade', path: '/foreign-trade', group: 'depthtopics',
    title: '对外贸易', subtitle: '新三样 · RCEP', icon: 'Ship',
    component: lazy(() => import('../modules/foreignTrade/Page.jsx')),
  },
  {
    id: 'civilAviation', path: '/civil-aviation', group: 'depthtopics',
    title: '民航与大飞机', subtitle: 'C919 · 低空经济', icon: 'Plane',
    component: lazy(() => import('../modules/civilAviation/Page.jsx')),
  },
  {
    id: 'culture', path: '/culture', group: 'depthtopics',
    title: '文化软实力', subtitle: '国潮 · 短剧出海', icon: 'Sparkles',
    component: lazy(() => import('../modules/culture/Page.jsx')),
  },
  {
    id: 'private', path: '/private', group: 'depthtopics',
    title: '民营经济', subtitle: '56789 · 公平竞争', icon: 'Briefcase',
    component: lazy(() => import('../modules/private/Page.jsx')),
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
