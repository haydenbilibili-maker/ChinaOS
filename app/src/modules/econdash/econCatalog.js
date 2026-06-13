// ============================================================================
// 经济驾驶舱 · 蓝图「共享宏观骨架」10 带指标目录（纯数据 / 纯函数 / 零 React）
// ----------------------------------------------------------------------------
// 用途：
//   · 给「共享宏观骨架」页面提供一份可检索、可挂实时读数的指标目录骨架。
//   · 每带（band）= 一个观察维度；每行（row）= 一个具体指标的元信息。
//   · row.key 若与 econData.KEY_INDICATORS 的 id 对齐，则组件可挂上实时读数。
// 口径声明（最高优先级，全程贯彻）：
//   · 本文件仅为「公开统计口径的指标编目」——记录指标名/数据源机构/频率/图型，
//     不含任何具体读数，不杜撰伪精确官方数字。
//   · lens 三类：叙=叙事侧、域=区域/地方侧、双=两侧兼具，为编目视角标定，非官方分类。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；基准日用常量 CATALOG_ASOF。
// ============================================================================

/** 目录基准快照日（以官方发布为准） */
export const CATALOG_ASOF = '2026-06-11';

/**
 * @typedef {('叙'|'域'|'双')} Lens 编目视角：叙事 / 区域 / 双侧
 */

/**
 * @typedef {Object} CatalogRow
 * @property {string}  name   指标名
 * @property {string}  [note] 释义备注（≤22 字，可选）
 * @property {string}  src    数据源机构
 * @property {string}  freq   发布频率（月 / 季 / 月累计 / 日 等）
 * @property {string}  chart  图型（折线 / 柱 / 堆叠柱 / 双轴 / 多线 / 热力 / 瀑布 / 进度 / 地图排名 / 柱+折 …）
 * @property {Lens}    lens   编目视角（叙 / 域 / 双）
 * @property {string}  [key]  对应 econData.KEY_INDICATORS 的 id（可挂实时读数则填）
 */

/**
 * @typedef {Object} MacroBand
 * @property {string}  cn       两位编号 '01'..'10'
 * @property {string}  h        带名
 * @property {string}  [star]   置顶 ★ 标注（可选）
 * @property {('region'|'narr')} [accent] 强调色（区域核心 / 叙事核心，可选）
 * @property {CatalogRow[]} rows 指标行（每带 ≥4 行）
 */

/** @type {MacroBand[]} 蓝图「共享宏观骨架」10 带指标目录 */
export const MACRO_BANDS = [
  // —— 01 增长总量 ——
  {
    cn: '01',
    h: '增长总量',
    rows: [
      { name: '实际 GDP 同比 / 环比', note: '总量增速，环比看动能', src: 'NBS', freq: '季', chart: '柱+折', lens: '双' },
      { name: '名义 GDP', note: '含价格因素，反映平减', src: 'NBS', freq: '季', chart: '折线', lens: '叙' },
      { name: '规上工业增加值', note: '供给端景气主线', src: 'NBS', freq: '月', chart: '柱+折', lens: '双', key: 'iva' },
      { name: '服务业生产指数', note: '第三产业月度高频', src: 'NBS', freq: '月', chart: '折线', lens: '叙' },
    ],
  },
  // —— 02 需求·三驾马车 ——
  {
    cn: '02',
    h: '需求·三驾马车',
    rows: [
      { name: '固定资产投资', note: '必拆制造业·基建·地产', src: 'NBS', freq: '月累计', chart: '堆叠柱', lens: '双', key: 'fai' },
      { name: '社会消费品零售', note: '拆可选/必选/餐饮', src: 'NBS', freq: '月', chart: '柱+折', lens: '双', key: 'retail' },
      { name: '进出口', note: '美元口径 vs 人民币背离', src: '海关总署', freq: '月', chart: '双轴', lens: '叙', key: 'export' },
      { name: '贸易结构', note: '对美·东盟·一带一路', src: '海关总署', freq: '月', chart: '堆叠柱', lens: '叙' },
    ],
  },
  // —— 03 价格与通缩 ——
  {
    cn: '03',
    h: '价格与通缩',
    rows: [
      { name: '核心 CPI', note: '剔除食品能源的真需求', src: 'NBS', freq: '月', chart: '折线零轴', lens: '叙', key: 'cpi' },
      { name: 'PPI', note: '生产资料/生活资料分拆', src: 'NBS', freq: '月', chart: '折线零轴', lens: '叙', key: 'ppi' },
      { name: 'GDP 平减指数', note: '最广义价格水平', src: 'NBS', freq: '季', chart: '折线零轴', lens: '叙' },
      { name: '70 城房价', note: '新房 + 二手并列', src: 'NBS', freq: '月', chart: '热力', lens: '双' },
    ],
  },
  // —— 04 货币金融 ——
  {
    cn: '04',
    h: '货币金融',
    rows: [
      { name: 'M1 / M2 剪刀差', note: '新口径，资金活化度', src: 'PBOC', freq: '月', chart: '双轴', lens: '叙', key: 'm2' },
      { name: '社融存量 / 增量', note: '居民/企业中长贷分拆', src: 'PBOC', freq: '月', chart: '柱+折', lens: '双', key: 'afre' },
      { name: '新增居民中长期贷款', note: '地产信心探针', src: 'PBOC', freq: '月', chart: '柱', lens: '双' },
      { name: '利率体系', note: 'LPR·逆回购·DR007·票据', src: 'PBOC', freq: '日', chart: '多线', lens: '叙' },
      { name: '月末票据贴现利率', note: '跳水 = 信贷凑数', src: '上海票交所', freq: '日', chart: '折线', lens: '叙' },
    ],
  },
  // —— 05 房地产 ——
  {
    cn: '05',
    h: '房地产',
    rows: [
      { name: '商品房销售面积 / 金额', note: '量价齐看', src: 'NBS', freq: '月累计', chart: '双轴', lens: '双' },
      { name: '房地产开发投资', note: '深度拖累固投', src: 'NBS', freq: '月累计', chart: '柱+折', lens: '双' },
      { name: '房企到位资金', note: '行业现金流命门', src: 'NBS', freq: '月累计', chart: '堆叠柱', lens: '双' },
      { name: '土地出让收入', note: '直通地方财政', src: '财政部', freq: '月', chart: '柱+折', lens: '域' },
      { name: '新开工/施工/竣工', note: '重点看新开工', src: 'NBS', freq: '月累计', chart: '多线', lens: '双' },
    ],
  },
  // —— 06 财政与地方债（★区域核心）——
  {
    cn: '06',
    h: '财政与地方债',
    star: '★区域核心',
    accent: 'region',
    rows: [
      { name: '一般公共预算收支', note: '财政自给率', src: '财政部', freq: '月累计', chart: '双轴', lens: '域' },
      { name: '政府性基金收入', note: '土地依赖度', src: '财政部', freq: '月累计', chart: '柱+折', lens: '域' },
      { name: '专项债发行进度', note: '逆周期落地节奏', src: '财政部', freq: '月', chart: '进度', lens: '域' },
      { name: '城投债净融资', note: '隐性债务温度计', src: 'Wind 公开口径', freq: '月', chart: '柱', lens: '域' },
      { name: '地方政府债务率', note: '分省分化', src: '财政部', freq: '季', chart: '地图排名', lens: '域' },
    ],
  },
  // —— 07 就业与居民 ——
  {
    cn: '07',
    h: '就业与居民',
    rows: [
      { name: '城镇调查失业率', note: '总量就业基准线', src: 'NBS', freq: '月', chart: '折线', lens: '双', key: 'urban_unemp' },
      { name: '青年失业率', note: '16-24 岁新口径', src: 'NBS', freq: '月', chart: '折线', lens: '叙' },
      { name: '人均可支配收入', note: '名义 vs 实际', src: 'NBS', freq: '季', chart: '双轴', lens: '双' },
      { name: '居民储蓄率', note: '超额储蓄信号', src: 'PBOC', freq: '季', chart: '柱+折', lens: '叙' },
      { name: '消费者信心指数', note: '长期低位徘徊', src: 'NBS', freq: '月', chart: '折线', lens: '叙' },
    ],
  },
  // —— 08 景气与高频先行 ——
  {
    cn: '08',
    h: '景气与高频先行',
    rows: [
      { name: '官方 PMI', note: '荣枯线 50', src: 'NBS', freq: '月', chart: '折线零轴', lens: '双', key: 'pmi_mfg' },
      { name: '财新 PMI', note: '中小外向，常背离官方', src: '财新/标普', freq: '月', chart: '折线零轴', lens: '叙' },
      { name: '全社会用电量', note: '克强指数类硬指标', src: '中电联', freq: '月', chart: '柱+折', lens: '双' },
      { name: '铁路货运量', note: '重工业实物量', src: '国铁集团', freq: '月', chart: '柱+折', lens: '双' },
      { name: '高频替代', note: '30 城成交/票房/拥堵/港口', src: '公开高频口径', freq: '日', chart: '多线', lens: '双' },
    ],
  },
  // —— 09 对外部门 ——
  {
    cn: '09',
    h: '对外部门',
    rows: [
      { name: '人民币汇率', note: 'CNY·CNH·CFETS 篮子', src: 'PBOC/CFETS', freq: '日', chart: '多线', lens: '叙' },
      { name: '官方外汇储备', note: '对外缓冲垫', src: 'SAFE', freq: '月', chart: '折线', lens: '叙' },
      { name: 'FDI 实际使用外资', note: '近期负值需警惕', src: '商务部', freq: '月累计', chart: '柱+折', lens: '双' },
      { name: '跨境资本流动', note: 'BOP·结售汇', src: 'SAFE', freq: '月', chart: '双轴', lens: '叙' },
    ],
  },
  // —— 10 结构与长波前瞻（★叙事核心）——
  {
    cn: '10',
    h: '结构与长波前瞻',
    star: '★叙事核心',
    accent: 'narr',
    rows: [
      { name: 'R&D 支出占 GDP', note: '创新投入强度', src: 'NBS/科技部', freq: '季', chart: '折线', lens: '叙' },
      { name: '高技术产业投资 / 增加值', note: '新旧动能转换', src: 'NBS', freq: '月', chart: '柱+折', lens: '叙' },
      { name: '新三样产量 / 出口', note: '车·锂电·光伏', src: 'NBS/海关总署', freq: '月', chart: '堆叠柱', lens: '叙' },
      { name: '机器人/算力/集成电路', note: '硬科技产能爬坡', src: 'NBS/工信部', freq: '月', chart: '多线', lens: '叙' },
      { name: '全要素生产率 TFP', note: '学术测算，非官方发布', src: '学术测算', freq: '季', chart: '折线', lens: '叙' },
    ],
  },
];

/**
 * 图型 → 字形（用于无图占位/索引图例）；缺失回退 '·'。
 * @type {Record<string,string>}
 */
export const CHART_GLYPH = {
  折线: '∿',
  柱: '▮',
  堆叠柱: '▤',
  双轴: '⇅',
  多线: '≋',
  热力: '▦',
  瀑布: '⊞',
  进度: '▰',
  地图排名: '◰',
  '柱+折': '▮∿',
  折线零轴: '∿₀',
  月累计: 'Σ',
};

/**
 * 取图型对应字形，缺失回退 '·'。
 * @param {string} chart
 * @returns {string}
 */
export function chartGlyph(chart) {
  return (chart && CHART_GLYPH[chart]) || '·';
}

/**
 * 目录统计：带数 / 行数 / 三视角计数 / 可挂实时读数行数。
 * @param {MacroBand[]} bands
 * @returns {{bandCount:number, rowCount:number, lensCount:{叙:number,域:number,双:number}, liveCount:number}}
 */
export function bandStats(bands) {
  const list = Array.isArray(bands) ? bands : [];
  const lensCount = { 叙: 0, 域: 0, 双: 0 };
  let rowCount = 0;
  let liveCount = 0;
  for (const band of list) {
    const rows = Array.isArray(band?.rows) ? band.rows : [];
    for (const row of rows) {
      rowCount += 1;
      if (row?.lens === '叙' || row?.lens === '域' || row?.lens === '双') {
        lensCount[row.lens] += 1;
      }
      if (row?.key) liveCount += 1;
    }
  }
  return { bandCount: list.length, rowCount, lensCount, liveCount };
}

/**
 * 目录过滤：按视角（lens）+ 关键词（q）筛选行，剔除空带。
 *   · lens 为 '全部' 或 falsy → 不按视角过滤。
 *   · q 模糊匹配 name / note / src（不区分大小写），falsy → 不按关键词过滤。
 * @param {MacroBand[]} bands
 * @param {{lens?:string, q?:string}} [opts]
 * @returns {MacroBand[]} 过滤后的带（每带 rows 已筛，空带剔除）
 */
export function catalogFilter(bands, opts = {}) {
  const list = Array.isArray(bands) ? bands : [];
  const lens = opts.lens;
  const useLens = lens && lens !== '全部';
  const q = typeof opts.q === 'string' ? opts.q.trim().toLowerCase() : '';

  const matchRow = (row) => {
    if (!row) return false;
    if (useLens && row.lens !== lens) return false;
    if (q) {
      const hay = `${row.name || ''} ${row.note || ''} ${row.src || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const out = [];
  for (const band of list) {
    const rows = Array.isArray(band?.rows) ? band.rows : [];
    const kept = rows.filter(matchRow);
    if (kept.length) out.push({ ...band, rows: kept });
  }
  return out;
}
