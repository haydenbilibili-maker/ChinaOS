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
  { id: 'institutions', label: '制度与改革', desc: '权力 · 治理 · 法治', accent: '#e8a317' },
  { id: 'depthtopics', label: '深度专题', desc: '已迁移', accent: '#10b981' },
  { id: 'techtopics', label: '科技专题', desc: '科技树 · 深挖', accent: '#22d3ee' },
  { id: 'society', label: '社会与民生', desc: '人口 · 医保 · 住房', accent: '#f0abfc' },
  { id: 'industry', label: '产业与制造', desc: '能源 · 算力 · 链', accent: '#fb923c' },
  { id: 'finance', label: '货币金融', desc: '人民币 · 债务', accent: '#d4af37' },
  { id: 'region', label: '区域与全球化', desc: '板块 · 海洋 · 资源', accent: '#8b5cf6' },
  { id: 'security', label: '安全与国防', desc: '军事 · 台海 · 大安全', accent: '#c41e3a' },
  { id: 'sim', label: '推演与训练', desc: '沙盒 · 内参', accent: '#d4af37' },
  { id: 'foundation', label: '数据与系统', desc: '底座', accent: '#64748b' },
];

export const MODULES = [
  {
    id: 'cognition', path: '/cognition', group: 'cognition',
    title: '康波周期', subtitle: '康德拉季耶夫长波', icon: 'Waves',
    component: lazy(() => import('../modules/cognition/Page.jsx')),
  },
  {
    id: 'powerphysics', path: '/powerphysics', group: 'cognition',
    title: '权力物理学', subtitle: '力场 · 确定性 · 统治成本', icon: 'Magnet',
    component: lazy(() => import('../modules/powerphysics/Page.jsx')),
  },
  {
    id: 'dissipative', path: '/dissipative', group: 'cognition',
    title: '耗散结构与熵', subtitle: '普里高津 · 负熵流 · 自组织', icon: 'Wind',
    component: lazy(() => import('../modules/dissipative/Page.jsx')),
  },
  {
    id: 'pathdependence', path: '/pathdependence', group: 'cognition',
    title: '路径依赖', subtitle: '报酬递增 · QWERTY · 锁定与换道', icon: 'GitFork',
    component: lazy(() => import('../modules/pathdependence/Page.jsx')),
  },
  {
    id: 'realism', path: '/realism', group: 'cognition',
    title: '现实主义', subtitle: '米尔斯海默 · 大国政治', icon: 'Swords',
    component: lazy(() => import('../modules/realism/Page.jsx')),
  },
  {
    id: 'middleincometrap', path: '/middleincometrap', group: 'cognition',
    title: '中等收入陷阱', subtitle: '韩国跨越 · 拉美停滞 · 中国窗口', icon: 'TrendingUp',
    component: lazy(() => import('../modules/middleincometrap/Page.jsx')),
  },
  {
    id: 'thucydides', path: '/thucydides', group: 'cognition',
    title: '修昔底德陷阱', subtitle: '艾利森 · 守成vs崛起', icon: 'GitFork',
    component: lazy(() => import('../modules/thucydides/Page.jsx')),
  },
  {
    id: 'gametheory', path: '/gametheory', group: 'cognition',
    title: '博弈论', subtitle: '纳什均衡 · 重复博弈 · 以牙还牙', icon: 'Dices',
    component: lazy(() => import('../modules/gametheory/Page.jsx')),
  },
  {
    id: 'antifragile', path: '/antifragile', group: 'cognition',
    title: '反脆弱', subtitle: '塔勒布 · 凸性 · 从波动获益', icon: 'TrendingUp',
    component: lazy(() => import('../modules/antifragile/Page.jsx')),
  },
  {
    id: 'constructivism', path: '/constructivism', group: 'cognition',
    title: '建构主义', subtitle: '温特 · 无政府是国家造就的', icon: 'Network',
    component: lazy(() => import('../modules/constructivism/Page.jsx')),
  },
  {
    id: 'ideology', path: '/ideology', group: 'cognition',
    title: '意识形态理论', subtitle: '自由/马克思/社达', icon: 'Scale3d',
    component: lazy(() => import('../modules/ideology/Page.jsx')),
  },
  {
    id: 'deterrence', path: '/deterrence', group: 'cognition',
    title: '威慑战略', subtitle: '谢林 · 可信承诺 · 边缘政策', icon: 'ShieldAlert',
    component: lazy(() => import('../modules/deterrence/Page.jsx')),
  },
  {
    id: 'principalagent', path: '/principalagent', group: 'cognition',
    title: '委托代理', subtitle: '信息不对称 · 激励相容', icon: 'GitBranchPlus',
    component: lazy(() => import('../modules/principalagent/Page.jsx')),
  },
  {
    id: 'commons', path: '/commons', group: 'cognition',
    title: '公地悲剧', subtitle: '集体行动 · 搭便车 · 自治', icon: 'Trees',
    component: lazy(() => import('../modules/commons/Page.jsx')),
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
    id: 'quantum', path: '/quantum', group: 'techtopics',
    title: '量子信息', subtitle: '计算 · 通信 · 测量', icon: 'Atom',
    component: lazy(() => import('../modules/quantum/Page.jsx')),
  },
  {
    id: 'semiconductor', path: '/semiconductor', group: 'techtopics',
    title: '半导体', subtitle: '芯片主权 · 大基金', icon: 'CircuitBoard',
    component: lazy(() => import('../modules/semiconductor/Page.jsx')),
  },
  {
    id: 'aiplus', path: '/aiplus', group: 'techtopics',
    title: '人工智能+', subtitle: '智算 · 行业大模型', icon: 'BrainCog',
    component: lazy(() => import('../modules/aiplus/Page.jsx')),
  },
  {
    id: 'basicResearch', path: '/basic-research', group: 'techtopics',
    title: '基础研究', subtitle: '国家实验室 · 评价改革', icon: 'FlaskConical',
    component: lazy(() => import('../modules/basicResearch/Page.jsx')),
  },
  {
    id: 'powerlogic', path: '/powerlogic', group: 'institutions',
    title: '权力逻辑', subtitle: '儒表法里 · 数字利维坦', icon: 'Cpu',
    component: lazy(() => import('../modules/powerlogic/Page.jsx')),
  },
  {
    id: 'reform', path: '/reform', group: 'institutions',
    title: '改革开放', subtitle: '现实主义算法演进', icon: 'GitFork',
    component: lazy(() => import('../modules/reform/Page.jsx')),
  },
  {
    id: 'governance', path: '/governance', group: 'institutions',
    title: '治理现代化', subtitle: '网格 · 数字政府', icon: 'Network',
    component: lazy(() => import('../modules/governance/Page.jsx')),
  },
  {
    id: 'govsystem', path: '/govsystem', group: 'institutions',
    title: '政府体系', subtitle: '压力型 · 执行算法', icon: 'Workflow',
    component: lazy(() => import('../modules/govsystem/Page.jsx')),
  },
  {
    id: 'soe', path: '/soe', group: 'institutions',
    title: '国有资本', subtitle: '战略底座 · 链主', icon: 'Building',
    component: lazy(() => import('../modules/soe/Page.jsx')),
  },
  {
    id: 'ruleoflaw', path: '/ruleoflaw', group: 'institutions',
    title: '法治建设', subtitle: '智慧法院 · 涉外法治', icon: 'Scale',
    component: lazy(() => import('../modules/ruleoflaw/Page.jsx')),
  },
  { id: 'demographic', path: '/demographic', group: 'society', title: '人口结构', subtitle: '负增长 · 抚养比', icon: 'Users', component: lazy(() => import('../modules/demographic/Page.jsx')) },
  { id: 'gig', path: '/gig', group: 'society', title: '零工经济', subtitle: '蓄水池 · 算法治理', icon: 'Bike', component: lazy(() => import('../modules/gig/Page.jsx')) },
  { id: 'healthcare', path: '/healthcare', group: 'society', title: '医疗医保', subtitle: 'DRG · 集采', icon: 'Stethoscope', component: lazy(() => import('../modules/healthcare/Page.jsx')) },
  { id: 'socialgov', path: '/socialgov', group: 'society', title: '基层治理', subtitle: '网格 · 综治', icon: 'LayoutGrid', component: lazy(() => import('../modules/socialgov/Page.jsx')) },
  { id: 'housing', path: '/housing', group: 'society', title: '住房地产', subtitle: '周期 · 保障房', icon: 'Home', component: lazy(() => import('../modules/housing/Page.jsx')) },
  { id: 'education', path: '/education', group: 'society', title: '教育', subtitle: '普职分流 · 人才', icon: 'GraduationCap', component: lazy(() => import('../modules/education/Page.jsx')) },
  { id: 'manufacturing', path: '/manufacturing', group: 'industry', title: '制造业', subtitle: '规模 · GVC 位势', icon: 'Factory', component: lazy(() => import('../modules/manufacturing/Page.jsx')) },
  { id: 'robotics', path: '/robotics', group: 'industry', title: '机器人', subtitle: '密度 · 人形', icon: 'Bot', component: lazy(() => import('../modules/robotics/Page.jsx')) },
  { id: 'materials', path: '/materials', group: 'industry', title: '关键材料', subtitle: '卡脖子 · 替代', icon: 'Gem', component: lazy(() => import('../modules/materials/Page.jsx')) },
  { id: 'energy', path: '/energy', group: 'industry', title: '能源', subtitle: '压舱石 · 转型', icon: 'Zap', component: lazy(() => import('../modules/energy/Page.jsx')) },
  { id: 'nuclear', path: '/nuclear', group: 'industry', title: '核电', subtitle: '华龙 · 四代堆', icon: 'Radiation', component: lazy(() => import('../modules/nuclear/Page.jsx')) },
  { id: 'hydrogen', path: '/hydrogen', group: 'industry', title: '氢能', subtitle: '绿氢 · 全链条', icon: 'Droplets', component: lazy(() => import('../modules/hydrogen/Page.jsx')) },
  { id: 'smartgrid', path: '/smartgrid', group: 'industry', title: '智能电网', subtitle: '特高压 · 储能', icon: 'PlugZap', component: lazy(() => import('../modules/smartgrid/Page.jsx')) },
  { id: 'computing', path: '/computing', group: 'industry', title: '算力设施', subtitle: '东数西算', icon: 'Server', component: lazy(() => import('../modules/computing/Page.jsx')) },
  { id: 'logistics', path: '/logistics', group: 'industry', title: '物流', subtitle: '多式联运 · 降本', icon: 'Truck', component: lazy(() => import('../modules/logistics/Page.jsx')) },
  { id: 'supplychain', path: '/supplychain', group: 'industry', title: '供应链', subtitle: '备份 · 韧性', icon: 'Link2', component: lazy(() => import('../modules/supplychain/Page.jsx')) },
  { id: 'infrastructure', path: '/infrastructure', group: 'industry', title: '基础设施', subtitle: '新老基建 · 专项债', icon: 'Construction', component: lazy(() => import('../modules/infrastructure/Page.jsx')) },
  { id: 'megaprojects', path: '/megaprojects', group: 'industry', title: '超级工程', subtitle: '多维 ROI · 国家账本', icon: 'Hammer', component: lazy(() => import('../modules/megaprojects/Page.jsx')) },
  { id: 'space', path: '/space', group: 'industry', title: '航天', subtitle: '北斗 · 商业航天', icon: 'Satellite', component: lazy(() => import('../modules/space/Page.jsx')) },
  { id: 'medequipment', path: '/medequipment', group: 'industry', title: '医疗装备', subtitle: '影像 · 进口替代', icon: 'HeartPulse', component: lazy(() => import('../modules/medequipment/Page.jsx')) },
  { id: 'tourism', path: '/tourism', group: 'industry', title: '文旅消费', subtitle: '入境游 · 区域品牌', icon: 'Luggage', component: lazy(() => import('../modules/tourism/Page.jsx')) },
  { id: 'finance', path: '/finance-system', group: 'finance', title: '金融系统', subtitle: '系统性风险 · 审慎', icon: 'Landmark', component: lazy(() => import('../modules/finance/Page.jsx')) },
  { id: 'financeRmb', path: '/rmb', group: 'finance', title: '人民币国际化', subtitle: 'CIPS · e-CNY', icon: 'CircleDollarSign', component: lazy(() => import('../modules/financeRmb/Page.jsx')) },
  { id: 'fdi', path: '/fdi', group: 'finance', title: '跨境投资', subtitle: '负面清单 · 双向', icon: 'ArrowLeftRight', component: lazy(() => import('../modules/fdi/Page.jsx')) },
  { id: 'greenfinance', path: '/green-finance', group: 'finance', title: '绿色金融', subtitle: '绿债 · 碳定价', icon: 'Leaf', component: lazy(() => import('../modules/greenfinance/Page.jsx')) },
  { id: 'debtHeatmap', path: '/debt', group: 'finance', title: '地方债务', subtitle: '省际热力 · 含地图', icon: 'Flame', component: lazy(() => import('../modules/debtHeatmap/Page.jsx')) },
  { id: 'benchmark', path: '/benchmark', group: 'region', title: '国际对标', subtitle: '中美日德印', icon: 'BarChart3', component: lazy(() => import('../modules/benchmark/Page.jsx')) },
  { id: 'rural', path: '/rural', group: 'region', title: '乡村振兴', subtitle: '县域 · 土地制度', icon: 'Tractor', component: lazy(() => import('../modules/rural/Page.jsx')) },
  { id: 'regional', path: '/regional', group: 'region', title: '区域协调', subtitle: '四大板块 · 转移支付', icon: 'Map', component: lazy(() => import('../modules/regional/Page.jsx')) },
  { id: 'marine', path: '/marine', group: 'region', title: '海洋经济', subtitle: '海权 · 造船', icon: 'Anchor', component: lazy(() => import('../modules/marine/Page.jsx')) },
  { id: 'polar', path: '/polar', group: 'region', title: '极地战略', subtitle: '航道 · 科考', icon: 'Snowflake', component: lazy(() => import('../modules/polar/Page.jsx')) },
  { id: 'resources', path: '/resources', group: 'region', title: '海外资源', subtitle: '权益矿 · 航道安全', icon: 'Pickaxe', component: lazy(() => import('../modules/resources/Page.jsx')) },
  { id: 'offshore', path: '/offshore', group: 'region', title: '港澳离岸', subtitle: '普通法窗口 · RMB', icon: 'Banknote', component: lazy(() => import('../modules/offshore/Page.jsx')) },
  { id: 'industrysoftware', path: '/industry-software', group: 'techtopics', title: '工业软件', subtitle: 'CAD/CAE · 信创', icon: 'Code2', component: lazy(() => import('../modules/industrysoftware/Page.jsx')) },
  { id: 'tech', path: '/tech-policy', group: 'techtopics', title: '创新体系', subtitle: 'R&D · 高企', icon: 'Lightbulb', component: lazy(() => import('../modules/tech/Page.jsx')) },
  { id: 'npf', path: '/npf', group: 'techtopics', title: '新质生产力', subtitle: '未来产业 · TFP', icon: 'Rocket', component: lazy(() => import('../modules/npf/Page.jsx')) },
  { id: 'bio', path: '/bio', group: 'techtopics', title: '生物医药', subtitle: '创新药 · 生物安全', icon: 'Dna', component: lazy(() => import('../modules/bio/Page.jsx')) },
  { id: 'neural', path: '/neural', group: 'techtopics', title: '脑机接口', subtitle: '神经数据主权', icon: 'Brain', component: lazy(() => import('../modules/neural/Page.jsx')) },
  {
    id: 'military', path: '/military', group: 'security',
    title: '军事力量', subtitle: '五大军种 · 战略威慑', icon: 'Shield',
    component: lazy(() => import('../modules/military/Page.jsx')),
  },
  {
    id: 'straits', path: '/straits', group: 'security',
    title: '台海局势', subtitle: '地缘重力 · 硅盾', icon: 'Crosshair',
    component: lazy(() => import('../modules/straits/Page.jsx')),
  },
  {
    id: 'omnisecurity', path: '/omnisecurity', group: 'security',
    title: '大安全观', subtitle: '粮食 · 能源 · 网络', icon: 'ShieldCheck',
    component: lazy(() => import('../modules/omnisecurity/Page.jsx')),
  },
  {
    id: 'redweb', path: '/redweb', group: 'security',
    title: '红网 · 结构分析', subtitle: '权贵网络框架', icon: 'Network',
    component: lazy(() => import('../modules/redweb/Page.jsx')),
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
    id: 'talent', path: '/talent', group: 'sim',
    title: '人才库', subtitle: '省部级公开履历检索', icon: 'UsersRound',
    component: lazy(() => import('../modules/talent/Page.jsx')),
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
