// 红网 · 结构分析 · 数据层
// ----------------------------------------------------------------------------
// 把「红色巨网」作为党—国控制网络的结构现象建模：层级（L0–L6）、控制节点、
// 控制/反馈关系、控制机制与嵌入度。所有数值为公开资料示意（OSINT），用于
// 揭示权力运作的底层拓扑，非对具体个人/机构的事实指认。
// AS_OF 2026-06-11
// ============================================================================

export const AS_OF = '2026-06-11';

// 控制机制（6 维）—— SelectorBar 切换、雷达轴、节点 means 映射共用
export const MECHANISMS = [
  { key: 'renshi', label: '人事任免', accent: '#c41e3a', short: '人事', desc: '党管干部：中组部与各级党委掌握任免、考核、轮岗与「双重管理」，是控制网最硬的脊柱。人事权决定一切其他权力的归属。' },
  { key: 'caiquan', label: '财权', accent: '#e8a317', short: '财权', desc: '国资委、央行/金融委、财政体系掌控预算、信贷与资本配置。财权是控制流的「血液」，决定节点能否存活与扩张。' },
  { key: 'xinxi', label: '信息', accent: '#22d3ee', short: '信息', desc: '宣传部—网信办—平台构成议程设置与语义防火墙：决定什么可见、什么沉默，控制叙事即控制认知坐标系。' },
  { key: 'zuzhi', label: '组织嵌入', accent: '#10b981', short: '组织', desc: '「支部建在连上」的工业—社会版：党组/党委嵌入国企、高校、社会组织乃至民企，实现毛细血管级的组织覆盖。' },
  { key: 'jilv', label: '纪律', accent: '#8b5cf6', short: '纪律', desc: '纪委—监委—巡视构成周期性「系统杀毒」：以反腐与巡视清洗山头主义、回收离心的节点，维持网络的拓扑刚性。' },
  { key: 'cyber', label: '赛博反馈', accent: '#f472b6', short: '赛博', desc: '网格化 + 数据中台 + 舆情系统构成自下而上的赛博反馈回路：基层信号实时回流内核，使控制从静态层级转为动态闭环。' },
];

// 网络层级 L0–L6（内核 → 离岸窗口）
export const LAYERS = [
  { id: 'L0', key: 'core', label: 'L0 党中央内核', accent: '#c41e3a', desc: '政治局—常委—中办：最终决策与人事仲裁的奇点，所有控制流的源头与反馈的汇点。' },
  { id: 'L1', key: 'organ', label: 'L1 党组/党委嵌入', accent: '#e8a317', desc: '组织部、纪委、政法委、统战部：把内核意志翻译为可执行的人事、纪律与组织指令。' },
  { id: 'L2', key: 'capital', label: 'L2 国企金融', accent: '#f59e0b', desc: '国资委、央行/金融委、央企党组：掌控经济命脉与资本闸门，是财权的物理载体。' },
  { id: 'L3', key: 'media', label: 'L3 媒体宣传', accent: '#22d3ee', desc: '宣传部、网信办、媒体集团/平台：议程设置与语义防火墙，控制信息的可见性与流向。' },
  { id: 'L4', key: 'social', label: 'L4 社会组织/群团', accent: '#10b981', desc: '工青妇、行业协会、高校：把社会动员纳入组织框架，承接「最后一公里」前的社会界面。' },
  { id: 'L5', key: 'grid', label: 'L5 基层网格', accent: '#60a5fa', desc: '社区党支部、网格员、综治中心：毛细血管级触达，是赛博反馈回路的数据采集端。' },
  { id: 'L6', key: 'offshore', label: 'L6 海外统战/离岸', accent: '#a78bfa', desc: '海外党组织、侨团、离岸窗口：把控制网延伸至域外，承接统战与离岸资本/信息接口。' },
];

export const layerIndex = (key) => LAYERS.findIndex((l) => l.key === key);

// 控制节点：role 职能 / means 控制手段(机制 key) / cases 典型机制 / value 控制强度示意
export const NODES = [
  { id: 'core', name: '党中央内核', layer: 'core', value: 100, means: ['renshi', 'caiquan', 'xinxi', 'zuzhi', 'jilv', 'cyber'], role: '政治局/常委—中办：最终决策、人事仲裁、议程定调。', cases: '顶层设计与「集中统一领导」入章程，党的领导写入国企/高校公司章程。' },
  { id: 'orgdept', name: '组织部', layer: 'organ', value: 92, means: ['renshi', 'zuzhi'], role: '党管干部的执行机关：任免、考核、轮岗、干部档案。', cases: '中管干部「上提一级」管理、央企领导人事任免与交流轮岗。' },
  { id: 'cdi', name: '纪委/监委', layer: 'organ', value: 88, means: ['jilv'], role: '纪律检查与监察：巡视、立案、留置，回收离心节点。', cases: '巡视全覆盖、派驻纪检组、监察体制改革「全面覆盖公职人员」。' },
  { id: 'propaganda', name: '宣传部', layer: 'organ', value: 80, means: ['xinxi', 'zuzhi'], role: '意识形态与议程设置：口径、审查、舆论导向。', cases: '统一新闻口径、主旋律调度、意识形态责任制。' },
  { id: 'plac', name: '政法委', layer: 'organ', value: 78, means: ['jilv', 'zuzhi'], role: '协调公检法司：维稳、综治、政法队伍管理。', cases: '综治网格化、平安建设考核、政法队伍教育整顿。' },
  { id: 'ufwd', name: '统战部', layer: 'organ', value: 70, means: ['zuzhi', 'xinxi'], role: '统一战线：民主党派、宗教、新阶层、海外侨界。', cases: '党外人士安排、新经济新阶层统战、海外联谊。' },
  { id: 'sasac', name: '国资委', layer: 'capital', value: 84, means: ['caiquan', 'renshi'], role: '出资人代表：央企考核、资本运营、董事会管理。', cases: '央企「一利五率」考核、国有资本投资运营公司试点。' },
  { id: 'pboc', name: '央行/金融委', layer: 'capital', value: 82, means: ['caiquan'], role: '货币与金融监管：信贷闸门、系统性风险、资本流向。', cases: '宏观审慎、金融机构党的领导、平台金融整改。' },
  { id: 'soeparty', name: '央企党组', layer: 'capital', value: 76, means: ['zuzhi', 'renshi', 'caiquan'], role: '把方向管大局：「双向进入、交叉任职」嵌入治理。', cases: '党组前置研究讨论重大事项写入公司章程。' },
  { id: 'cac', name: '网信办', layer: 'media', value: 80, means: ['xinxi', 'cyber'], role: '网络空间治理：内容审核、数据出境、平台合规。', cases: '语义防火墙、算法备案、数据安全审查、清朗行动。' },
  { id: 'platform', name: '媒体集团/平台', layer: 'media', value: 66, means: ['xinxi', 'cyber'], role: '内容生产与分发终端：主流媒体 + 商业平台。', cases: '特殊管理股、编委会党管、热搜/推荐算法调控。' },
  { id: 'massorg', name: '群团(工青妇)', layer: 'social', value: 58, means: ['zuzhi'], role: '群众组织：把社会群体纳入组织化动员框架。', cases: '群团改革「去机关化」、覆盖新就业群体。' },
  { id: 'ngo', name: '社会组织/协会', layer: 'social', value: 52, means: ['zuzhi'], role: '行业协会与社会团体：业务主管 + 党建覆盖。', cases: '社会组织党建全覆盖、脱钩与「双重管理」。' },
  { id: 'univ', name: '高校党委', layer: 'social', value: 64, means: ['zuzhi', 'renshi', 'xinxi'], role: '党委领导下的校长负责制：人事、意识形态、招生。', cases: '高校党委领导核心地位、思政课与意识形态阵地。' },
  { id: 'grid', name: '基层网格/支部', layer: 'grid', value: 60, means: ['zuzhi', 'cyber'], role: '社区/楼栋党支部 + 网格员：触达与数据采集。', cases: '党建引领基层治理、网格化 + 综治中心 + 数据中台。' },
  { id: 'overseas', name: '海外党组织/侨团', layer: 'offshore', value: 48, means: ['zuzhi', 'xinxi'], role: '域外统战与离岸接口：侨社、商会、离岸窗口。', cases: '海外党建、侨团联谊、离岸资本/信息接口。' },
];

// 控制/反馈关系：kind = control(控制流·向下) / feedback(反馈回流·向上) / resource(资源) / info(信息)
export const EDGES = [
  { source: 'core', target: 'orgdept', kind: 'control', mech: 'renshi', value: 10 },
  { source: 'core', target: 'cdi', kind: 'control', mech: 'jilv', value: 9 },
  { source: 'core', target: 'propaganda', kind: 'control', mech: 'xinxi', value: 8 },
  { source: 'core', target: 'plac', kind: 'control', mech: 'jilv', value: 7 },
  { source: 'core', target: 'ufwd', kind: 'control', mech: 'zuzhi', value: 6 },
  { source: 'core', target: 'sasac', kind: 'control', mech: 'caiquan', value: 8 },
  { source: 'core', target: 'pboc', kind: 'control', mech: 'caiquan', value: 8 },
  { source: 'orgdept', target: 'soeparty', kind: 'control', mech: 'renshi', value: 7 },
  { source: 'orgdept', target: 'univ', kind: 'control', mech: 'renshi', value: 6 },
  { source: 'orgdept', target: 'grid', kind: 'control', mech: 'zuzhi', value: 5 },
  { source: 'sasac', target: 'soeparty', kind: 'resource', mech: 'caiquan', value: 7 },
  { source: 'pboc', target: 'soeparty', kind: 'resource', mech: 'caiquan', value: 6 },
  { source: 'propaganda', target: 'cac', kind: 'control', mech: 'xinxi', value: 7 },
  { source: 'propaganda', target: 'platform', kind: 'control', mech: 'xinxi', value: 6 },
  { source: 'cac', target: 'platform', kind: 'control', mech: 'cyber', value: 6 },
  { source: 'cac', target: 'grid', kind: 'info', mech: 'cyber', value: 5 },
  { source: 'plac', target: 'grid', kind: 'control', mech: 'zuzhi', value: 6 },
  { source: 'ufwd', target: 'overseas', kind: 'control', mech: 'zuzhi', value: 5 },
  { source: 'ufwd', target: 'ngo', kind: 'control', mech: 'zuzhi', value: 4 },
  { source: 'massorg', target: 'ngo', kind: 'control', mech: 'zuzhi', value: 4 },
  { source: 'massorg', target: 'grid', kind: 'control', mech: 'zuzhi', value: 4 },
  { source: 'cdi', target: 'sasac', kind: 'feedback', mech: 'jilv', value: 5 },
  { source: 'cdi', target: 'soeparty', kind: 'feedback', mech: 'jilv', value: 5 },
  { source: 'cdi', target: 'univ', kind: 'feedback', mech: 'jilv', value: 4 },
  { source: 'grid', target: 'core', kind: 'feedback', mech: 'cyber', value: 6 },
  { source: 'platform', target: 'cac', kind: 'feedback', mech: 'cyber', value: 5 },
  { source: 'overseas', target: 'ufwd', kind: 'feedback', mech: 'xinxi', value: 4 },
];

export const EDGE_KIND = {
  control: { label: '控制流', color: '#c41e3a', curve: 0.12 },
  resource: { label: '资源流', color: '#e8a317', curve: 0.16 },
  info: { label: '信息流', color: '#22d3ee', curve: 0.2 },
  feedback: { label: '反馈回流', color: '#f472b6', curve: 0.3 },
};

// 各层控制画像（雷达）：6 机制维度的强度示意，揭示不同层的控制「指纹」
export const LAYER_RADAR = [
  { key: 'core', name: 'L0 内核', color: '#c41e3a', values: [98, 90, 88, 85, 92, 80] },
  { key: 'capital', name: 'L2 国企金融', color: '#f59e0b', values: [78, 95, 50, 80, 70, 45] },
  { key: 'media', name: 'L3 媒体宣传', color: '#22d3ee', values: [60, 45, 96, 65, 55, 88] },
  { key: 'grid', name: 'L5 基层网格', color: '#60a5fa', values: [40, 30, 55, 88, 50, 90] },
];

// 党组织嵌入度矩阵（热力图）：主体类型 × 嵌入维度，覆盖率示意 %
export const EMBED_ROWS = ['国企', '高校', '事业单位', '社会组织', '民企', '外企'];
export const EMBED_COLS = ['党组织覆盖', '党委实质决策', '群团组建', '纪检派驻'];
export const EMBED_MATRIX = [
  // [国企]     [高校]     [事业]     [社会组织] [民企]     [外企]
  [99, 95, 92, 88], // 国企
  [98, 90, 85, 70], // 高校
  [97, 80, 88, 60], // 事业单位
  [85, 50, 70, 30], // 社会组织
  [70, 28, 55, 15], // 民企
  [48, 12, 30, 8],  // 外企
];

// 控制网演进阶段（时间线 + markArea 联动）
export const STAGES = [
  { period: '1949–1978', title: '建政奠基', accent: '#c41e3a', intensity: 70, desc: '单位制 + 政社合一 + 计划经济：通过单位、人民公社与档案制度实现总体性控制，组织嵌入达到极致，但信息与财权高度行政化、缺乏赛博维度。' },
  { period: '1978–2012', title: '改革松动', accent: '#e8a317', intensity: 45, desc: '市场化与单位制解体使控制网局部「失焦」：人财物随市场分散，民企与社会组织出现组织真空，山头主义与地方诸侯化抬头，网络刚性下降。' },
  { period: '2012–2020', title: '十八大后强化', accent: '#8b5cf6', intensity: 78, desc: '反腐 + 巡视全覆盖 + 党的领导入章程：以纪律机制回收离心节点，党组前置嵌入企业治理，重建网络拓扑刚性，控制权重新向内核集中。' },
  { period: '2020–2026', title: '数字化网格', accent: '#22d3ee', intensity: 92, desc: '网格化 + 数据中台 + 平台监管 + 语义防火墙：控制从静态层级升级为赛博反馈闭环，基层信号实时回流内核，控制密度与响应速度达到历史峰值。' },
];

// 巡视/反腐强度趋势（与 anticorruption 模块可交叉）：立案/巡视覆盖示意指数
export const INSPECTION_YEARS = ['2012', '2014', '2016', '2018', '2020', '2022', '2024', '2026'];
export const INSPECTION_VALUES = [38, 62, 78, 85, 80, 88, 95, 99];

// —— 图表构造器 ——

// 网络关系图：force 布局，category 按层着色，mechKey 高亮使用该机制的节点
export function buildGraphOption(mechKey, selectedId) {
  const categories = LAYERS.map((l) => ({ name: l.label, itemStyle: { color: l.accent } }));
  const nodes = NODES.map((n) => {
    const li = layerIndex(n.layer);
    const active = !mechKey || n.means.includes(mechKey);
    const isSel = selectedId === n.id;
    return {
      id: n.id,
      name: n.name,
      category: li,
      symbolSize: 16 + n.value * 0.34,
      value: n.value,
      itemStyle: {
        color: LAYERS[li]?.accent,
        opacity: active ? 1 : 0.18,
        borderColor: isSel ? '#fff' : 'transparent',
        borderWidth: isSel ? 2.5 : 0,
        shadowBlur: isSel ? 18 : 0,
        shadowColor: LAYERS[li]?.accent,
      },
      label: { show: true, fontSize: 10, color: active ? '#e8f4f8' : '#516074' },
    };
  });
  const links = EDGES.map((e) => {
    const k = EDGE_KIND[e.kind];
    const active = !mechKey || e.mech === mechKey;
    return {
      source: e.source,
      target: e.target,
      value: e.value,
      lineStyle: { color: k.color, curveness: k.curve, width: active ? 1 + e.value * 0.2 : 0.6, opacity: active ? 0.85 : 0.12 },
    };
  });
  return {
    tooltip: { trigger: 'item', formatter: (p) => (p.dataType === 'edge' ? '' : `${p.data.name} · 强度 ${p.data.value}`) },
    legend: [{ data: categories.map((c) => c.name), textStyle: { color: '#93a1b5', fontSize: 10 }, type: 'scroll', bottom: 0, icon: 'circle' }],
    series: [{
      type: 'graph', layout: 'force', roam: true, draggable: true,
      categories,
      data: nodes, links,
      force: { repulsion: 320, edgeLength: [60, 140], gravity: 0.12 },
      edgeSymbol: ['none', 'arrow'], edgeSymbolSize: 7,
      emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
      lineStyle: { opacity: 0.85 },
    }],
  };
}

// Sankey 控制流：自上而下（控制+资源+信息）+ 反馈回流回内核
// ECharts Sankey 要求有向无环（DAG）：feedback 边会让网络出现回路（如 cac↔platform、
// 核心↔基层），直接渲染会抛 "Sankey is a DAG, the original data has cycle!" 并使整页崩溃。
// 解决：把反馈边导向各自的「↺反馈」镜像汇点（名称唯一、不指回上游），既保留反馈语义又消除环。
export function buildSankeyOption() {
  const nameOf = (id) => NODES.find((n) => n.id === id)?.name;
  const FB = ' ↺反馈';
  const data = NODES.map((n) => ({ name: n.name, itemStyle: { color: LAYERS[layerIndex(n.layer)]?.accent } }));
  const feedbackSinks = new Map();
  const links = EDGES.map((e) => {
    const src = nameOf(e.source);
    let tgt = nameOf(e.target);
    if (e.kind === 'feedback') {
      tgt = `${tgt}${FB}`;
      if (!feedbackSinks.has(e.target)) {
        const tn = NODES.find((n) => n.id === e.target);
        feedbackSinks.set(e.target, { name: tgt, itemStyle: { color: LAYERS[layerIndex(tn.layer)]?.accent } });
      }
    }
    return { source: src, target: tgt, value: e.value, lineStyle: { color: EDGE_KIND[e.kind].color, opacity: 0.4 } };
  });
  data.push(...feedbackSinks.values());
  return {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey', left: 8, right: 110, top: 10, bottom: 10,
      data, links,
      nodeWidth: 12, nodeGap: 8,
      emphasis: { focus: 'adjacency' },
      label: { color: '#93a1b5', fontSize: 10 },
      lineStyle: { color: 'gradient', curveness: 0.5 },
    }],
  };
}
