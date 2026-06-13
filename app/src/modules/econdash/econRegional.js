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
// 2. 省域压力数据（东北三省 + 沿海强省 + 中西部 + 全国基准）
//    value：0–100 承压分，已归一为「越高越承压」；raw：原值文本（公开口径近似）；
//    stress：低 / 中度 / 高压 / 严重（示意分级）；src：数据来源口径；note：≤一句备注。
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
 * @property {('东北'|'沿海'|'中西部'|'全国')} group
 * @property {Object.<string, RegionMetricCell>} metrics 六维压力（键为 metric id）
 * @property {string} headline 区域研判（≤26 字）
 */

/** @type {Region[]} 省域压力数据（≥7 个，含东北三省 + 全国基准） */
export const REGIONS = [
  // —— 东北：财政偏弱、土地依赖下行、城投高压、人口严重外流、工业分化、用电低速 ——
  {
    id: 'liaoning',
    name: '辽宁',
    group: '东北',
    headline: '老工业基底厚但财政与人口双承压',
    metrics: {
      fiscalSelf: { value: 68, raw: '约 52%', stress: '高压', src: '财政厅一般公共预算', note: '收入对转移支付依赖较深。' },
      landDep: { value: 42, raw: '约 18%', stress: '中度', src: '政府性基金口径', note: '土地依赖本就不高、且仍在下行。' },
      cityInvest: { value: 78, raw: '付息占比偏高', stress: '高压', src: '城投存续债·公开口径', note: '弱区县城投付息压力突出。' },
      popOutflow: { value: 82, raw: '常住连年净减', stress: '严重', src: '公安·七普及人口抽样', note: '青壮年外流叠加深度老龄化。' },
      indProfit: { value: 58, raw: '利润分化', stress: '中度', src: '规上工业·统计局', note: '石化装备稳、传统重工偏弱。' },
      powerUse: { value: 60, raw: '增速低于全国', stress: '中度', src: '中电联·高频', note: '工业用电温和、动能偏弱。' },
    },
  },
  {
    id: 'jilin',
    name: '吉林',
    group: '东北',
    headline: '汽车独大、财政自给弱、人口外流剧',
    metrics: {
      fiscalSelf: { value: 75, raw: '约 42%', stress: '高压', src: '财政厅一般公共预算', note: '自给率低、刚性支出靠转移支付。' },
      landDep: { value: 38, raw: '约 15%', stress: '中度', src: '政府性基金口径', note: '土地财政体量小且下滑。' },
      cityInvest: { value: 80, raw: '付息率高压', stress: '高压', src: '城投存续债·公开口径', note: '债务率在东北居前。' },
      popOutflow: { value: 85, raw: '常住净减明显', stress: '严重', src: '公安·七普及人口抽样', note: '外流幅度位列全国前列。' },
      indProfit: { value: 62, raw: '一车独大', stress: '中度', src: '规上工业·统计局', note: '利润高度系于汽车产业链。' },
      powerUse: { value: 64, raw: '增速偏低', stress: '中度', src: '中电联·高频', note: '高频用电反映动能不足。' },
    },
  },
  {
    id: 'heilongjiang',
    name: '黑龙江',
    group: '东北',
    headline: '资源与农业大省、外流与债务双高',
    metrics: {
      fiscalSelf: { value: 78, raw: '约 38%', stress: '高压', src: '财政厅一般公共预算', note: '自给率为东北最低一档。' },
      landDep: { value: 35, raw: '约 13%', stress: '低', src: '政府性基金口径', note: '土地依赖最弱、卖地空间有限。' },
      cityInvest: { value: 76, raw: '付息压力大', stress: '高压', src: '城投存续债·公开口径', note: '弱资质平台再融资偏紧。' },
      popOutflow: { value: 88, raw: '常住净减居前', stress: '严重', src: '公安·七普及人口抽样', note: '人口流出强度全国领先。' },
      indProfit: { value: 55, raw: '能源粮食稳', stress: '中度', src: '规上工业·统计局', note: '油气与农产加工提供底盘。' },
      powerUse: { value: 58, raw: '增速温和', stress: '中度', src: '中电联·高频', note: '用电增速贴近东北均值。' },
    },
  },
  // —— 沿海强省：财政自给强、债务可控、人口净流入、工业景气、用电稳增 ——
  {
    id: 'guangdong',
    name: '广东',
    group: '沿海',
    headline: '第一经济大省、自给强但内部分化',
    metrics: {
      fiscalSelf: { value: 22, raw: '约 78%', stress: '低', src: '财政厅一般公共预算', note: '自给率全国领先、净上缴大省。' },
      landDep: { value: 48, raw: '约 30%', stress: '中度', src: '政府性基金口径', note: '珠三角土地财政体量仍大。' },
      cityInvest: { value: 30, raw: '付息率可控', stress: '低', src: '城投存续债·公开口径', note: '主体资质整体较优。' },
      popOutflow: { value: 12, raw: '常住净流入', stress: '低', src: '公安·七普及人口抽样', note: '常年人口第一净流入省。' },
      indProfit: { value: 28, raw: '利润较稳', stress: '低', src: '规上工业·统计局', note: '电子与新能源链支撑景气。' },
      powerUse: { value: 25, raw: '增速稳健', stress: '低', src: '中电联·高频', note: '用电增速高于全国。' },
    },
  },
  {
    id: 'zhejiang',
    name: '浙江',
    group: '沿海',
    headline: '民营活、财政稳、人口持续净流入',
    metrics: {
      fiscalSelf: { value: 20, raw: '约 80%', stress: '低', src: '财政厅一般公共预算', note: '自给率与广东并列第一档。' },
      landDep: { value: 52, raw: '约 33%', stress: '中度', src: '政府性基金口径', note: '土地依赖偏高、随地产降温。' },
      cityInvest: { value: 35, raw: '付息率温和', stress: '低', src: '城投存续债·公开口径', note: '债务规模大但现金流较好。' },
      popOutflow: { value: 15, raw: '常住净流入', stress: '低', src: '公安·七普及人口抽样', note: '吸纳省外人口能力强。' },
      indProfit: { value: 26, raw: '利润景气', stress: '低', src: '规上工业·统计局', note: '民营制造与外贸提供弹性。' },
      powerUse: { value: 24, raw: '增速领先', stress: '低', src: '中电联·高频', note: '高频用电反映动能旺盛。' },
    },
  },
  // —— 中西部：人口大省、增速可观但财政与债务压力上升 ——
  {
    id: 'sichuan',
    name: '四川',
    group: '中西部',
    headline: '人口大省、内需有支撑、债务渐承压',
    metrics: {
      fiscalSelf: { value: 60, raw: '约 55%', stress: '中度', src: '财政厅一般公共预算', note: '自给率中游、转移支付仍重要。' },
      landDep: { value: 55, raw: '约 35%', stress: '中度', src: '政府性基金口径', note: '成都都市圈土地财政体量大。' },
      cityInvest: { value: 66, raw: '付息率偏高', stress: '高压', src: '城投存续债·公开口径', note: '区县城投隐性债务受关注。' },
      popOutflow: { value: 40, raw: '近年回流', stress: '中度', src: '公安·七普及人口抽样', note: '总量大、省内向成都集聚。' },
      indProfit: { value: 45, raw: '利润中性', stress: '中度', src: '规上工业·统计局', note: '电子信息与白酒支撑。' },
      powerUse: { value: 38, raw: '增速稳健', stress: '中度', src: '中电联·高频', note: '水电富集、用电稳增。' },
    },
  },
  {
    id: 'henan',
    name: '河南',
    group: '中西部',
    headline: '人口第一大省、外出务工与债务承压',
    metrics: {
      fiscalSelf: { value: 64, raw: '约 50%', stress: '高压', src: '财政厅一般公共预算', note: '人口基数大、人均财力偏薄。' },
      landDep: { value: 58, raw: '约 36%', stress: '中度', src: '政府性基金口径', note: '土地财政随地产下行承压。' },
      cityInvest: { value: 70, raw: '付息率高压', stress: '高压', src: '城投存续债·公开口径', note: '弱区县平台债务率偏高。' },
      popOutflow: { value: 62, raw: '净流出大省', stress: '高压', src: '公安·七普及人口抽样', note: '常年外出务工净流出。' },
      indProfit: { value: 50, raw: '利润分化', stress: '中度', src: '规上工业·统计局', note: '装备与食品稳、传统产业偏弱。' },
      powerUse: { value: 48, raw: '增速中游', stress: '中度', src: '中电联·高频', note: '用电增速贴近全国均值。' },
    },
  },
  // —— 全国基准（参照系，所有维度居中或略偏，承压分作锚） ——
  {
    id: 'national',
    name: '全国基准',
    group: '全国',
    headline: '全国均值作锚、掩盖了省际两极分化',
    metrics: {
      fiscalSelf: { value: 50, raw: '约 60%', stress: '中度', src: '财政部·全国汇总', note: '东西部自给率差距悬殊。' },
      landDep: { value: 50, raw: '约 32%', stress: '中度', src: '政府性基金·全国', note: '土地财政整体下行通道中。' },
      cityInvest: { value: 50, raw: '付息率中位', stress: '中度', src: '城投存续债·全国', note: '区域分化大、尾部风险集中。' },
      popOutflow: { value: 50, raw: '总量微增见顶', stress: '中度', src: '统计局·人口口径', note: '净增量趋零、区域此消彼长。' },
      indProfit: { value: 50, raw: '利润弱复苏', stress: '中度', src: '规上工业·统计局', note: '高技术领涨、传统行业承压。' },
      powerUse: { value: 50, raw: '增速约+6%', stress: '中度', src: '中电联·高频', note: '用电回暖、区域冷热不均。' },
    },
  },
];

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

// 维度档位排序导出（供 UI 着色阈值复用，避免魔法字符串散落）
export { STRESS_ORDER };
