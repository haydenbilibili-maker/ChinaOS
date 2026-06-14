// ============================================================================
// 经济驾驶舱 · 区域经济压力下钻（纯数据 / 纯函数，零 React / 零随机 / 零当前时间）
// ----------------------------------------------------------------------------
// 口径声明（最高优先级，全程贯彻）：
//   · 全国数据掩盖区域分化；本文件把投资环境约束下钻到省级，呈现财政自给、
//     土地依赖、城投债务、人口外流、工业景气、用电高频六个压力维度。
//   · value 为「公开口径近似 + 示意标定」的 0–100 承压分（已按 worse 方向归一为
//     「越高越承压」），raw 为对应原值文本（公开口径近似）；不杜撰伪精确官方数字。
//   · stress 四档（低 / 中度 / 高压 / 严重）为示意分级，非官方评级、非投资建议、非预测。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；基准日用常量 REGION_ASOF。
// ============================================================================

/** 区域压力快照基准日（所有数据对齐此日；以官方发布为准） */
export const REGION_ASOF = '2026-06-11';

// ---------------------------------------------------------------------------
// 1. 六个压力维度定义
//    worse:'high' → 值越大越承压（土地依赖、城投债务率、人口净流出）；
//    worse:'low'  → 值越小越承压（财政自给率、规上工业利润、用电量增速）。
//    注意：REGIONS[*].metrics[*].value 已统一归一为「越高越承压」的 0–100 压力分，
//    worse 字段供 UI 解释原值方向与做容错回退，不参与二次反转。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} RegionMetricDef
 * @property {string} id
 * @property {string} label
 * @property {string} desc   维度释义（≤20 字）
 * @property {('high'|'low')} worse 原值哪个方向更承压
 */

/** @type {RegionMetricDef[]} 六个压力维度（id / 标签 / 释义 / 承压方向） */
export const REGION_METRICS = [
  { id: 'fiscalSelf', label: '财政自给率', desc: '一般预算收入÷支出', worse: 'low' },
  { id: 'landDep', label: '土地财政依赖度', desc: '基金收入÷综合财力', worse: 'high' },
  { id: 'cityInvest', label: '城投债务率', desc: '付息÷综合财力', worse: 'high' },
  { id: 'popOutflow', label: '常住人口净流出', desc: '公安·普查口径', worse: 'high' },
  { id: 'indProfit', label: '规上工业利润', desc: '工业景气冷暖', worse: 'low' },
  { id: 'powerUse', label: '用电量增速', desc: '中电联高频代理', worse: 'low' },
];

/** 维度 id → 定义，便于查表 */
export const REGION_METRIC_BY_ID = REGION_METRICS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {});

// ---------------------------------------------------------------------------
// 2. 省域压力数据（31 省级行政区 + 全国基准）
//    value：0–100 承压分，已归一为「越高越承压」；raw：原值文本（公开口径近似）；
//    stress：低 / 中度 / 高压 / 严重（示意分级）；src：数据来源口径；note：≤一句备注。
//    mapName：DataV 省份全称（用于中国地图着色，必须与 DataV 边界 name 一致）。
//    总体格局（公开口径近似 + 示意）：东部沿海财政自给强、人口净流入、工业景气；
//    东北财政弱、人口严重外流、城投高压；中西部人口大省外出务工 + 债务上升；
//    资源型省份（山西/陕西/内蒙）景气随大宗波动而分化。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} RegionMetricCell
 * @property {number} value  0–100 承压分（越高越承压）
 * @property {string} raw    原值文本（公开口径近似）
 * @property {('低'|'中度'|'高压'|'严重')} stress 示意分级
 * @property {string} src    数据来源口径
 * @property {string} note   备注（≤一句）
 */

/**
 * @typedef {Object} Region
 * @property {string} id
 * @property {string} name
 * @property {string} mapName   DataV 省份全称（地图着色键；全国基准为空串，不进地图）
 * @property {('东北'|'华北'|'华东'|'华南'|'华中'|'西南'|'西北'|'全国')} group
 * @property {Object.<string, RegionMetricCell>} metrics 六维压力（键为 metric id）
 * @property {string} headline 区域研判（≤26 字）
 */

// 各档常用来源口径文案（避免散落 + 保持口径一致）
const SRC = {
  fiscalSelf: '财政厅一般公共预算',
  landDep: '政府性基金口径',
  cityInvest: '城投存续债·公开口径',
  popOutflow: '公安·七普及人口抽样',
  indProfit: '规上工业·统计局',
  powerUse: '中电联·高频',
};

// 小工具：按 value 推 stress 档（仅用于减少手写错位，可被显式 stress 覆盖）。
function lvl(v) {
  if (v >= 75) return '严重';
  if (v >= 60) return '高压';
  if (v >= 42) return '中度';
  return '低';
}
// 单元格构造器：cell(value, raw, note) → 自动配 src/stress（stress 可覆盖）
function mk(id) {
  return (value, raw, note, stress) => ({
    value,
    raw,
    stress: stress || lvl(value),
    src: SRC[id],
    note,
  });
}
const F = mk('fiscalSelf');
const L = mk('landDep');
const C = mk('cityInvest');
const P = mk('popOutflow');
const I = mk('indProfit');
const W = mk('powerUse');

/** @type {Region[]} 省域压力数据（31 省级行政区 + 全国基准） */
export const REGIONS = [
  // ===== 东北 =====
  {
    id: 'liaoning', name: '辽宁', mapName: '辽宁省', group: '东北',
    headline: '老工业基底厚但财政与人口双承压',
    metrics: {
      fiscalSelf: F(68, '约 52%', '收入对转移支付依赖较深。'),
      landDep: L(42, '约 18%', '土地依赖本就不高、且仍在下行。'),
      cityInvest: C(78, '付息占比偏高', '弱区县城投付息压力突出。'),
      popOutflow: P(82, '常住连年净减', '青壮年外流叠加深度老龄化。'),
      indProfit: I(58, '利润分化', '石化装备稳、传统重工偏弱。'),
      powerUse: W(60, '增速低于全国', '工业用电温和、动能偏弱。'),
    },
  },
  {
    id: 'jilin', name: '吉林', mapName: '吉林省', group: '东北',
    headline: '汽车独大、财政自给弱、人口外流剧',
    metrics: {
      fiscalSelf: F(75, '约 42%', '自给率低、刚性支出靠转移支付。'),
      landDep: L(38, '约 15%', '土地财政体量小且下滑。'),
      cityInvest: C(80, '付息率高压', '债务率在东北居前。'),
      popOutflow: P(85, '常住净减明显', '外流幅度位列全国前列。'),
      indProfit: I(62, '一车独大', '利润高度系于汽车产业链。'),
      powerUse: W(64, '增速偏低', '高频用电反映动能不足。'),
    },
  },
  {
    id: 'heilongjiang', name: '黑龙江', mapName: '黑龙江省', group: '东北',
    headline: '资源与农业大省、外流与债务双高',
    metrics: {
      fiscalSelf: F(78, '约 38%', '自给率为东北最低一档。'),
      landDep: L(35, '约 13%', '土地依赖最弱、卖地空间有限。'),
      cityInvest: C(76, '付息压力大', '弱资质平台再融资偏紧。'),
      popOutflow: P(88, '常住净减居前', '人口流出强度全国领先。'),
      indProfit: I(55, '能源粮食稳', '油气与农产加工提供底盘。'),
      powerUse: W(58, '增速温和', '用电增速贴近东北均值。'),
    },
  },
  // ===== 华北 =====
  {
    id: 'beijing', name: '北京', mapName: '北京市', group: '华北',
    headline: '首都财力雄厚、土地依赖低、人口调控',
    metrics: {
      fiscalSelf: F(18, '约 80%+', '自给率全国第一档、净上缴。'),
      landDep: L(40, '约 22%', '土地财政体量大但占比受控。'),
      cityInvest: C(24, '付息率低', '平台资质优、再融资顺畅。'),
      popOutflow: P(35, '常住主动调控', '疏解非首都功能、人口微减。'),
      indProfit: I(26, '高端服务主导', '工业占比低、利润相对稳。'),
      powerUse: W(28, '增速稳健', '用电以服务与数据中心为主。'),
    },
  },
  {
    id: 'tianjin', name: '天津', mapName: '天津市', group: '华北',
    headline: '老牌直辖市、转型期财政与人口承压',
    metrics: {
      fiscalSelf: F(48, '约 62%', '自给率中游、近年承压回升。'),
      landDep: L(50, '约 30%', '滨海新区土地财政体量大。'),
      cityInvest: C(72, '付息率偏高', '历史平台债务化解仍在途。'),
      popOutflow: P(52, '常住小幅波动', '吸引力弱于京沪、人口外溢。'),
      indProfit: I(48, '石化装备为主', '传统重化偏多、景气分化。'),
      powerUse: W(46, '增速中游', '用电增速贴近全国。'),
    },
  },
  {
    id: 'hebei', name: '河北', mapName: '河北省', group: '华北',
    headline: '环京钢铁大省、去产能下景气分化',
    metrics: {
      fiscalSelf: F(60, '约 55%', '自给率中游、人均财力偏薄。'),
      landDep: L(52, '约 33%', '土地财政随地产下行承压。'),
      cityInvest: C(58, '付息率中游', '弱区县平台债务需关注。'),
      popOutflow: P(56, '人口外溢京津', '环京人口向京津通勤外流。'),
      indProfit: I(60, '钢铁去产能', '传统重化利润随大宗波动。'),
      powerUse: W(50, '增速中游', '工业用电随去产能波动。'),
    },
  },
  {
    id: 'shanxi', name: '山西', mapName: '山西省', group: '华北',
    headline: '煤炭大省、财政与景气随煤价周期',
    metrics: {
      fiscalSelf: F(54, '约 58%', '财政与煤价高度绑定、波动大。'),
      landDep: L(40, '约 20%', '土地依赖低、卖地空间有限。'),
      cityInvest: C(56, '付息率中游', '平台债务随煤价改善缓释。'),
      popOutflow: P(58, '人口缓慢外流', '青壮年向省外与省会集聚。'),
      indProfit: I(52, '煤炭独大', '利润随煤价周期大起大落。'),
      powerUse: W(44, '增速中游', '高耗能用电随煤化工波动。'),
    },
  },
  {
    id: 'neimenggu', name: '内蒙古', mapName: '内蒙古自治区', group: '华北',
    headline: '能源资源富集、煤电稳但人口稀疏',
    metrics: {
      fiscalSelf: F(50, '约 60%', '资源景气改善带动财政回升。'),
      landDep: L(36, '约 16%', '地广人稀、土地财政体量小。'),
      cityInvest: C(58, '付息率中游', '历史平台债务化解推进中。'),
      popOutflow: P(54, '人口缓慢外流', '总量小、青壮年向外迁出。'),
      indProfit: I(40, '煤电与新能源', '能源景气支撑工业利润。'),
      powerUse: W(30, '增速领先', '电力外送与新能源拉动用电。'),
    },
  },
  // ===== 华东 =====
  {
    id: 'shanghai', name: '上海', mapName: '上海市', group: '华东',
    headline: '金融贸易中心、财力强、人口超大体量',
    metrics: {
      fiscalSelf: F(16, '约 82%+', '自给率全国最高一档、净上缴。'),
      landDep: L(46, '约 28%', '土地财政体量大但占比可控。'),
      cityInvest: C(22, '付息率低', '平台资质优、融资成本低。'),
      popOutflow: P(28, '常住高位调控', '严控人口规模、净流入趋缓。'),
      indProfit: I(24, '高端制造服务', '汽车电子与金融支撑景气。'),
      powerUse: W(26, '增速稳健', '用电以服务与高端制造为主。'),
    },
  },
  {
    id: 'jiangsu', name: '江苏', mapName: '江苏省', group: '华东',
    headline: '制造强省、财政稳健但城投存量大',
    metrics: {
      fiscalSelf: F(24, '约 76%', '自给率全国前列、产业厚实。'),
      landDep: L(56, '约 35%', '土地财政体量居前、随地产降温。'),
      cityInvest: C(48, '付息率中游', '城投存量大、苏北区县需关注。'),
      popOutflow: P(20, '常住净流入', '制造业吸纳省外人口。'),
      indProfit: I(26, '利润景气', '电子装备与新材料支撑。'),
      powerUse: W(24, '增速领先', '工业用电高位稳增。'),
    },
  },
  {
    id: 'zhejiang', name: '浙江', mapName: '浙江省', group: '华东',
    headline: '民营活、财政稳、人口持续净流入',
    metrics: {
      fiscalSelf: F(20, '约 80%', '自给率与广东并列第一档。'),
      landDep: L(52, '约 33%', '土地依赖偏高、随地产降温。'),
      cityInvest: C(35, '付息率温和', '债务规模大但现金流较好。'),
      popOutflow: P(15, '常住净流入', '吸纳省外人口能力强。'),
      indProfit: I(26, '利润景气', '民营制造与外贸提供弹性。'),
      powerUse: W(24, '增速领先', '高频用电反映动能旺盛。'),
    },
  },
  {
    id: 'anhui', name: '安徽', mapName: '安徽省', group: '华东',
    headline: '承接产业转移、新能源链拉动景气回升',
    metrics: {
      fiscalSelf: F(56, '约 56%', '自给率中游、追赶长三角。'),
      landDep: L(54, '约 34%', '合肥都市圈土地财政体量大。'),
      cityInvest: C(60, '付息率偏高', '弱区县平台债务需关注。'),
      popOutflow: P(48, '外流收窄', '产业回流减缓人口净流出。'),
      indProfit: I(38, '新能源拉动', '汽车光伏链支撑工业利润。'),
      powerUse: W(34, '增速领先', '新兴产业拉动用电较快。'),
    },
  },
  {
    id: 'fujian', name: '福建', mapName: '福建省', group: '华东',
    headline: '民营外贸活、财政稳健、人口净流入',
    metrics: {
      fiscalSelf: F(30, '约 72%', '自给率较高、民营经济厚实。'),
      landDep: L(50, '约 31%', '土地财政体量中等、随地产降温。'),
      cityInvest: C(38, '付息率温和', '平台债务整体可控。'),
      popOutflow: P(26, '常住净流入', '沿海产业带吸纳外省人口。'),
      indProfit: I(30, '利润较稳', '电子机械与轻工支撑景气。'),
      powerUse: W(30, '增速稳健', '用电增速高于全国。'),
    },
  },
  {
    id: 'jiangxi', name: '江西', mapName: '江西省', group: '华东',
    headline: '中部承接转移、财政与债务渐承压',
    metrics: {
      fiscalSelf: F(62, '约 52%', '自给率偏弱、人均财力薄。'),
      landDep: L(56, '约 35%', '土地财政随地产下行承压。'),
      cityInvest: C(64, '付息率偏高', '弱区县平台债务率偏高。'),
      popOutflow: P(58, '净流出省', '青壮年向长三角珠三角外流。'),
      indProfit: I(46, '有色与电子', '锂电铜业支撑、传统偏弱。'),
      powerUse: W(42, '增速中游', '用电增速贴近全国。'),
    },
  },
  {
    id: 'shandong', name: '山东', mapName: '山东省', group: '华东',
    headline: '工业大省、新旧动能转换中景气分化',
    metrics: {
      fiscalSelf: F(40, '约 66%', '自给率较高、产业体量大。'),
      landDep: L(52, '约 33%', '土地财政体量居前、随地产降温。'),
      cityInvest: C(50, '付息率中游', '区县城投存量需逐项甄别。'),
      popOutflow: P(44, '人口微外流', '青壮年向京沪与省会集聚。'),
      indProfit: I(44, '动能转换', '化工装备稳、传统重化偏弱。'),
      powerUse: W(40, '增速中游', '高耗能用电随转型波动。'),
    },
  },
  // ===== 华中 =====
  {
    id: 'henan', name: '河南', mapName: '河南省', group: '华中',
    headline: '人口第一大省、外出务工与债务承压',
    metrics: {
      fiscalSelf: F(64, '约 50%', '人口基数大、人均财力偏薄。'),
      landDep: L(58, '约 36%', '土地财政随地产下行承压。'),
      cityInvest: C(70, '付息率高压', '弱区县平台债务率偏高。'),
      popOutflow: P(62, '净流出大省', '常年外出务工净流出。'),
      indProfit: I(50, '利润分化', '装备与食品稳、传统产业偏弱。'),
      powerUse: W(48, '增速中游', '用电增速贴近全国均值。'),
    },
  },
  {
    id: 'hubei', name: '湖北', mapName: '湖北省', group: '华中',
    headline: '中部枢纽、汽车光电子支撑、债务上升',
    metrics: {
      fiscalSelf: F(54, '约 58%', '自给率中游、武汉极化明显。'),
      landDep: L(56, '约 35%', '武汉都市圈土地财政体量大。'),
      cityInvest: C(64, '付息率偏高', '区县城投债务率上升。'),
      popOutflow: P(46, '外流收窄', '武汉虹吸减缓全省外流。'),
      indProfit: I(40, '汽车光电子', '光谷与汽车链支撑工业利润。'),
      powerUse: W(38, '增速稳健', '新兴产业拉动用电较快。'),
    },
  },
  {
    id: 'hunan', name: '湖南', mapName: '湖南省', group: '华中',
    headline: '工程机械大省、人口外流与债务并存',
    metrics: {
      fiscalSelf: F(60, '约 53%', '自给率偏弱、转移支付仍重要。'),
      landDep: L(56, '约 35%', '长株潭土地财政体量大。'),
      cityInvest: C(66, '付息率偏高', '弱区县城投隐性债务受关注。'),
      popOutflow: P(56, '净流出省', '青壮年向珠三角长三角外流。'),
      indProfit: I(44, '工程机械', '装备制造支撑、地产链拖累。'),
      powerUse: W(44, '增速中游', '用电增速贴近全国。'),
    },
  },
  // ===== 华南 =====
  {
    id: 'guangdong', name: '广东', mapName: '广东省', group: '华南',
    headline: '第一经济大省、自给强但内部分化',
    metrics: {
      fiscalSelf: F(22, '约 78%', '自给率全国领先、净上缴大省。'),
      landDep: L(48, '约 30%', '珠三角土地财政体量仍大。'),
      cityInvest: C(30, '付息率可控', '主体资质整体较优。'),
      popOutflow: P(12, '常住净流入', '常年人口第一净流入省。'),
      indProfit: I(28, '利润较稳', '电子与新能源链支撑景气。'),
      powerUse: W(25, '增速稳健', '用电增速高于全国。'),
    },
  },
  {
    id: 'guangxi', name: '广西', mapName: '广西壮族自治区', group: '华南',
    headline: '沿边沿海、财政偏弱、债务化解承压',
    metrics: {
      fiscalSelf: F(70, '约 46%', '自给率偏低、转移支付依赖深。'),
      landDep: L(50, '约 30%', '土地财政随地产下行承压。'),
      cityInvest: C(74, '付息率高压', '弱资质平台债务化解承压。'),
      popOutflow: P(60, '净流出省', '青壮年向珠三角外出务工。'),
      indProfit: I(56, '利润偏弱', '糖业有色稳、传统工业偏弱。'),
      powerUse: W(50, '增速中游', '用电增速贴近全国。'),
    },
  },
  {
    id: 'hainan', name: '海南', mapName: '海南省', group: '华南',
    headline: '自贸港政策红利、体量小、地产依赖高',
    metrics: {
      fiscalSelf: F(66, '约 48%', '自给率偏低、依赖中央支持。'),
      landDep: L(64, '约 40%', '经济对房地产与土地依赖偏高。'),
      cityInvest: C(54, '付息率中游', '平台债务规模小但需关注。'),
      popOutflow: P(34, '人口净流入', '自贸港吸引人口与候鸟流入。'),
      indProfit: I(58, '工业基础薄', '工业占比低、利润体量小。'),
      powerUse: W(40, '增速较快', '旅游与新基建拉动用电。'),
    },
  },
  // ===== 西南 =====
  {
    id: 'sichuan', name: '四川', mapName: '四川省', group: '西南',
    headline: '人口大省、内需有支撑、债务渐承压',
    metrics: {
      fiscalSelf: F(60, '约 55%', '自给率中游、转移支付仍重要。'),
      landDep: L(55, '约 35%', '成都都市圈土地财政体量大。'),
      cityInvest: C(66, '付息率偏高', '区县城投隐性债务受关注。'),
      popOutflow: P(40, '近年回流', '总量大、省内向成都集聚。'),
      indProfit: I(45, '利润中性', '电子信息与白酒支撑。'),
      powerUse: W(38, '增速稳健', '水电富集、用电稳增。'),
    },
  },
  {
    id: 'chongqing', name: '重庆', mapName: '重庆市', group: '西南',
    headline: '西部直辖市、汽车电子链、债务存量大',
    metrics: {
      fiscalSelf: F(52, '约 60%', '自给率中游、区县财力分化。'),
      landDep: L(58, '约 36%', '土地财政体量大、随地产降温。'),
      cityInvest: C(68, '付息率偏高', '城投存量大、需逐项甄别。'),
      popOutflow: P(38, '人口微流入', '产业回流带动人口企稳。'),
      indProfit: I(42, '汽车电子', '智能网联汽车链支撑利润。'),
      powerUse: W(40, '增速稳健', '工业用电随产业升级回暖。'),
    },
  },
  {
    id: 'guizhou', name: '贵州', mapName: '贵州省', group: '西南',
    headline: '后发追赶、债务率高、化债压力突出',
    metrics: {
      fiscalSelf: F(76, '约 40%', '自给率全国靠后、依赖转移支付。'),
      landDep: L(54, '约 34%', '土地财政随地产下行承压。'),
      cityInvest: C(85, '付息率严重', '城投债务率位列全国前列。'),
      popOutflow: P(54, '净流出省', '青壮年外出务工净流出。'),
      indProfit: I(54, '利润偏弱', '白酒独强、其他工业偏弱。'),
      powerUse: W(46, '增速中游', '大数据与电力外送拉动用电。'),
    },
  },
  {
    id: 'yunnan', name: '云南', mapName: '云南省', group: '西南',
    headline: '沿边资源省、财政偏弱、化债任务重',
    metrics: {
      fiscalSelf: F(72, '约 44%', '自给率偏低、依赖转移支付。'),
      landDep: L(52, '约 33%', '土地财政随地产下行承压。'),
      cityInvest: C(78, '付息率高压', '平台债务化解任务繁重。'),
      popOutflow: P(50, '人口微外流', '边疆人口外流相对温和。'),
      indProfit: I(56, '利润偏弱', '烟草有色稳、传统工业偏弱。'),
      powerUse: W(40, '增速中游', '绿电富集、电力外送拉动。'),
    },
  },
  {
    id: 'xizang', name: '西藏', mapName: '西藏自治区', group: '西南',
    headline: '高原边疆、财政高度依赖中央转移支付',
    metrics: {
      fiscalSelf: F(80, '约 10%', '自给率全国最低、几乎靠转移支付。'),
      landDep: L(30, '约 12%', '地广人稀、土地财政体量极小。'),
      cityInvest: C(48, '付息率中游', '债务体量小、绝对规模有限。'),
      popOutflow: P(30, '人口净流入', '援藏与基建带来人口流入。'),
      indProfit: I(60, '工业基础弱', '工业占比极低、利润体量小。'),
      powerUse: W(34, '增速较快', '清洁能源与基建拉动用电。'),
    },
  },
  // ===== 西北 =====
  {
    id: 'shaanxi', name: '陕西', mapName: '陕西省', group: '西北',
    headline: '能源科教大省、景气随能源与硬科技',
    metrics: {
      fiscalSelf: F(50, '约 60%', '资源景气改善带动财政回升。'),
      landDep: L(50, '约 30%', '西安都市圈土地财政体量大。'),
      cityInvest: C(60, '付息率偏高', '区县平台债务需逐项甄别。'),
      popOutflow: P(48, '人口微外流', '向西安集聚、全省微外流。'),
      indProfit: I(40, '能源与硬科技', '煤化工与半导体支撑利润。'),
      powerUse: W(38, '增速稳健', '能源与制造拉动用电。'),
    },
  },
  {
    id: 'gansu', name: '甘肃', mapName: '甘肃省', group: '西北',
    headline: '西北财政弱省、人口外流、化债承压',
    metrics: {
      fiscalSelf: F(78, '约 38%', '自给率全国靠后、依赖转移支付。'),
      landDep: L(44, '约 24%', '土地财政体量小、卖地空间有限。'),
      cityInvest: C(72, '付息率高压', '弱资质平台再融资偏紧。'),
      popOutflow: P(62, '净流出省', '青壮年外流、人口持续净减。'),
      indProfit: I(58, '利润偏弱', '石化有色稳、传统工业偏弱。'),
      powerUse: W(44, '增速中游', '新能源外送拉动部分用电。'),
    },
  },
  {
    id: 'qinghai', name: '青海', mapName: '青海省', group: '西北',
    headline: '高原资源省、财政高度依赖中央支持',
    metrics: {
      fiscalSelf: F(80, '约 20%', '自给率极低、几乎靠转移支付。'),
      landDep: L(34, '约 14%', '地广人稀、土地财政体量极小。'),
      cityInvest: C(66, '付息率偏高', '债务体量小但相对财力偏高。'),
      popOutflow: P(46, '人口微外流', '总量小、青壮年缓慢外流。'),
      indProfit: I(58, '盐湖与新能源', '锂盐与绿电支撑、基础薄。'),
      powerUse: W(36, '增速较快', '光伏与盐湖化工拉动用电。'),
    },
  },
  {
    id: 'ningxia', name: '宁夏', mapName: '宁夏回族自治区', group: '西北',
    headline: '小省体量、能源化工为主、财政偏弱',
    metrics: {
      fiscalSelf: F(70, '约 46%', '自给率偏低、依赖转移支付。'),
      landDep: L(40, '约 20%', '土地财政体量小、卖地空间有限。'),
      cityInvest: C(62, '付息率偏高', '平台债务规模小但相对偏高。'),
      popOutflow: P(44, '人口微外流', '总量小、缓慢净流出。'),
      indProfit: I(48, '能源化工', '煤化工与新能源支撑利润。'),
      powerUse: W(34, '增速较快', '高耗能与电力外送拉动用电。'),
    },
  },
  {
    id: 'xinjiang', name: '新疆', mapName: '新疆维吾尔自治区', group: '西北',
    headline: '能源与棉花大区、基建拉动、人口流入',
    metrics: {
      fiscalSelf: F(68, '约 48%', '自给率偏低、依赖中央支持。'),
      landDep: L(38, '约 18%', '地广人稀、土地财政体量小。'),
      cityInvest: C(58, '付息率中游', '债务化解随能源景气缓释。'),
      popOutflow: P(36, '人口净流入', '产业援疆与就业带来人口流入。'),
      indProfit: I(42, '能源棉花', '油气煤化工与棉纺支撑利润。'),
      powerUse: W(30, '增速领先', '能源开发与外送强力拉动用电。'),
    },
  },
  // ===== 全国基准（参照系，不进地图着色） =====
  {
    id: 'national', name: '全国基准', mapName: '', group: '全国',
    headline: '全国均值作锚、掩盖了省际两极分化',
    metrics: {
      fiscalSelf: F(50, '约 60%', '东西部自给率差距悬殊。', '中度'),
      landDep: L(50, '约 32%', '土地财政整体下行通道中。', '中度'),
      cityInvest: C(50, '付息率中位', '区域分化大、尾部风险集中。', '中度'),
      popOutflow: P(50, '总量微增见顶', '净增量趋零、区域此消彼长。', '中度'),
      indProfit: I(50, '利润弱复苏', '高技术领涨、传统行业承压。', '中度'),
      powerUse: W(50, '增速约+6%', '用电回暖、区域冷热不均。', '中度'),
    },
  },
];

// 全国基准来源口径修正（与省级财政厅口径区分；不破坏字段契约，仅改 src 文案）
(() => {
  const nat = REGIONS.find((r) => r.id === 'national');
  if (!nat) return;
  const natSrc = {
    fiscalSelf: '财政部·全国汇总',
    landDep: '政府性基金·全国',
    cityInvest: '城投存续债·全国',
    popOutflow: '统计局·人口口径',
    indProfit: '规上工业·统计局',
    powerUse: '中电联·高频',
  };
  for (const k of Object.keys(natSrc)) {
    if (nat.metrics[k]) nat.metrics[k].src = natSrc[k];
  }
})();

/** 区域 id → 区域对象，便于查表 */
export const REGION_BY_ID = REGIONS.reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {});

// ---------------------------------------------------------------------------
// 3. 纯函数：单区域综合盘点
// ---------------------------------------------------------------------------

const STRESS_ORDER = ['低', '中度', '高压', '严重'];
/** 高压档位（高压 / 严重）判定 */
function isRed(stress) {
  return stress === '高压' || stress === '严重';
}

/**
 * 综合单区域六维承压分，给出均值、等级、红档计数与一句研判。
 * @param {Region} region
 * @returns {{avg:number, level:('稳健'|'承压'|'高压'), redCount:number, text:string}}
 */
export function regionStressTally(region) {
  if (!region || typeof region !== 'object' || !region.metrics) {
    return { avg: 0, level: '稳健', redCount: 0, text: '无有效区域数据，无法研判。' };
  }
  const cells = REGION_METRICS
    .map((m) => region.metrics[m.id])
    .filter((c) => c && typeof c.value === 'number' && Number.isFinite(c.value));

  if (cells.length === 0) {
    return { avg: 0, level: '稳健', redCount: 0, text: '六维数据缺失，无法研判。' };
  }

  const sum = cells.reduce((s, c) => s + Math.max(0, Math.min(100, c.value)), 0);
  const avg = Math.round(sum / cells.length);
  const redCount = cells.filter((c) => isRed(c.stress)).length;

  // 等级：综合分 + 红档计数共同决定（红档≥2 或均值高即上调）
  let level;
  if (avg >= 70 || redCount >= 3) level = '高压';
  else if (avg >= 45 || redCount >= 2) level = '承压';
  else level = '稳健';

  const name = region.name || '该区域';
  let text;
  if (level === '高压') {
    text = `${name}多维亮红，财政自给、债务与人口约束叠加，投资环境承压显著。`;
  } else if (level === '承压') {
    text = `${name}承压维度集中，结构性约束已现，需逐项甄别可投与回避领域。`;
  } else {
    text = `${name}各维度整体可控，财政与人口基本面提供较稳的投资环境。`;
  }
  return { avg, level, redCount, text };
}

// ---------------------------------------------------------------------------
// 4. 纯函数：多区域对比结构（便于雷达 / 对比渲染）
// ---------------------------------------------------------------------------

/**
 * 按维度聚合多区域承压分，输出 {metricId: {regionId: value}}。
 * 缺失维度回退为 0（容错，不抛错）。
 * @param {string[]} ids 区域 id 列表
 * @returns {Object.<string, Object.<string, number>>}
 */
export function compareRegions(ids) {
  const list = Array.isArray(ids) ? ids.filter(Boolean) : [];
  const out = {};
  for (const m of REGION_METRICS) {
    out[m.id] = {};
    for (const rid of list) {
      const region = REGION_BY_ID[rid];
      const cell = region && region.metrics ? region.metrics[m.id] : null;
      const v = cell && typeof cell.value === 'number' && Number.isFinite(cell.value)
        ? Math.max(0, Math.min(100, cell.value))
        : 0;
      out[m.id][rid] = v;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 5. 地图着色支持（中国地图 choropleth）
//    全国基准（mapName 为空）不进地图；composite 用 regionStressTally.avg 综合承压。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} RegionMapMetricDef
 * @property {string} key       指标键（'composite' 或六维 metric id）
 * @property {string} label     切换按钮短标签
 * @property {string} valueName tooltip 数值名
 * @property {number} max       visualMap 上限（恒 100）
 */

/** @type {RegionMapMetricDef[]} 地图可切换指标：综合承压 composite + 六维 */
export const REGION_MAP_METRICS = [
  { key: 'composite', label: '综合承压', valueName: '综合承压分', max: 100 },
  ...REGION_METRICS.map((m) => ({
    key: m.id, label: m.label, valueName: `${m.label}承压分`, max: 100,
  })),
];

/**
 * 生成中国地图着色数据：全部省级行政区在指定维度的承压值。
 * 全国基准（mapName 为空）不纳入；越高越承压（visualMap 越深红→金）。
 * @param {string} metricId 'composite'（综合承压，取 regionStressTally.avg）或六维 metric id
 * @returns {{name:string, value:number, regionId:string}[]} name 为 DataV 省份全称
 */
export function regionMapData(metricId) {
  const id = metricId || 'composite';
  const out = [];
  for (const r of REGIONS) {
    if (!r.mapName) continue; // 全国基准不进地图
    let value;
    if (id === 'composite') {
      value = regionStressTally(r).avg;
    } else {
      const cell = r.metrics ? r.metrics[id] : null;
      value = cell && typeof cell.value === 'number' && Number.isFinite(cell.value)
        ? Math.round(Math.max(0, Math.min(100, cell.value)))
        : 0;
    }
    out.push({ name: r.mapName, value, regionId: r.id });
  }
  return out;
}

// 维度档位排序导出（供 UI 着色阈值复用，避免魔法字符串散落）
export { STRESS_ORDER };
