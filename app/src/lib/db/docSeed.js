// ============================================================================
// 政策文件库 · 种子数据（政府工作报告 / 五年规划 / 中央经济工作会议）
// ----------------------------------------------------------------------------
// 内容为公开发布文件的「结构化要点综合」——关键量化目标 + 政策定调 + 标志性提法。
// 仅收录公开、广泛报道的事实性要点，不复制文件全文；数值以官方正式发布为准。
// 近年（尤其 2026）部分为初步/示意，待官方定稿校订。
// ============================================================================

export const DOC_TYPES = ['政府工作报告', '中央经济工作会议', '五年规划'];

// 政府工作报告 · 量化指标元信息（用于趋势与比对）
export const GWR_METRICS = [
  { key: 'gdpTarget', label: 'GDP 增长目标', unit: '%', good: 'up' },
  { key: 'deficit', label: '赤字率', unit: '%', good: 'flat' },
  { key: 'cpi', label: 'CPI 目标', unit: '%', good: 'flat' },
  { key: 'jobs', label: '城镇新增就业', unit: '万人', good: 'up' },
  { key: 'urbanUnemp', label: '城镇调查失业率', unit: '%', good: 'down' },
  { key: 'specialBond', label: '地方专项债', unit: '万亿', good: 'up' },
  { key: 'longBond', label: '超长期特别国债', unit: '万亿', good: 'up' },
  { key: 'defense', label: '国防预算增幅', unit: '%', good: 'flat' },
];

const gwr = (year, o) => ({ id: `gwr-${year}`, type: '政府工作报告', year, org: '国务院', date: `${year}-03`, source: '中国政府网', asOf: '2026-06', ...o });

export const GWR_DOCS = [
  gwr(2018, {
    title: '2018 年政府工作报告', date: '2018-03',
    metrics: { gdpTarget: 6.5, deficit: 2.6, cpi: 3, jobs: 1100, urbanUnemp: 5.5, specialBond: 1.35, longBond: null, defense: 8.1 },
    stance: { fiscal: '积极财政（赤字率下调、调结构）', monetary: '稳健中性' },
    keywords: ['高质量发展', '三大攻坚战', '防范化解重大风险', '放管服', '供给侧结构性改革'],
    highlights: ['首次系统提出「高质量发展」为根本要求', '打好防范化解重大风险、精准脱贫、污染防治三大攻坚战', '赤字率由 3% 下调至 2.6%，去杠杆基调'],
  }),
  gwr(2019, {
    title: '2019 年政府工作报告', date: '2019-03',
    metrics: { gdpTarget: 6.25, deficit: 2.8, cpi: 3, jobs: 1100, urbanUnemp: 5.5, specialBond: 2.15, longBond: null, defense: 7.5 },
    stance: { fiscal: '积极财政加力提效（更大规模减税降费）', monetary: '稳健松紧适度' },
    keywords: ['六稳', '更大规模减税降费', '就业优先政策', '放管服', '民营经济'],
    highlights: ['GDP 目标首次设区间 6%–6.5%', '减税降费近 2 万亿元，制造业增值税率 16%→13%', '就业优先政策置于宏观政策层面'],
  }),
  gwr(2020, {
    title: '2020 年政府工作报告', date: '2020-05',
    metrics: { gdpTarget: null, deficit: 3.6, cpi: 3.5, jobs: 900, urbanUnemp: 6, specialBond: 3.75, longBond: 1.0, defense: 6.6 },
    stance: { fiscal: '更积极有为（抗疫特别国债）', monetary: '更灵活适度' },
    keywords: ['六保', '留得青山赢得未来', '抗疫特别国债', '直达资金机制', '保市场主体'],
    highlights: ['疫情下罕见不设 GDP 增速具体目标', '首提「六保」(保居民就业等)', '发行 1 万亿抗疫特别国债 + 赤字率破 3.6%', '财政资金「一竿子插到底」直达基层'],
  }),
  gwr(2021, {
    title: '2021 年政府工作报告', date: '2021-03',
    metrics: { gdpTarget: 6, deficit: 3.2, cpi: 3, jobs: 1100, urbanUnemp: 5.5, specialBond: 3.65, longBond: null, defense: 6.8 },
    stance: { fiscal: '提质增效、更可持续', monetary: '稳健灵活精准、合理适度' },
    keywords: ['碳达峰碳中和', '十四五开局', '种子和耕地', '科技自立自强', '不急转弯'],
    highlights: ['「碳达峰、碳中和」首次写入政府工作报告', 'GDP 目标 6% 以上，留弹性', '宏观政策「不急转弯」，保持连续性'],
  }),
  gwr(2022, {
    title: '2022 年政府工作报告', date: '2022-03',
    metrics: { gdpTarget: 5.5, deficit: 2.8, cpi: 3, jobs: 1100, urbanUnemp: 5.5, specialBond: 3.65, longBond: null, defense: 7.1 },
    stance: { fiscal: '提升效能、更注重精准可持续（大规模留抵退税）', monetary: '灵活适度' },
    keywords: ['稳字当头稳中求进', '留抵退税', '能耗双控优化', '专精特新', '平台经济规范健康发展'],
    highlights: ['「稳字当头、稳中求进」总基调', '增值税留抵退税约 1.5 万亿元', 'GDP 目标 5.5% 左右为近年高位但实现承压'],
  }),
  gwr(2023, {
    title: '2023 年政府工作报告', date: '2023-03',
    metrics: { gdpTarget: 5, deficit: 3.0, cpi: 3, jobs: 1200, urbanUnemp: 5.5, specialBond: 3.8, longBond: null, defense: 7.2 },
    stance: { fiscal: '加力提效', monetary: '精准有力' },
    keywords: ['着力扩大国内需求', '两个毫不动摇', '提振市场信心', '现代化产业体系', '平台经济'],
    highlights: ['把恢复和扩大消费摆在优先位置', '重申「两个毫不动摇」、提振民营信心', '换届年报告，GDP 目标回到 5% 左右'],
  }),
  gwr(2024, {
    title: '2024 年政府工作报告', date: '2024-03',
    metrics: { gdpTarget: 5, deficit: 3.0, cpi: 3, jobs: 1200, urbanUnemp: 5.5, specialBond: 3.9, longBond: 1.0, defense: 7.2 },
    stance: { fiscal: '适度加力、提质增效（连续发行超长期特别国债）', monetary: '灵活适度、精准有效' },
    keywords: ['新质生产力', '大规模设备更新', '消费品以旧换新', '人工智能+', '未来产业'],
    highlights: ['「新质生产力」首次写入政府工作报告并居首要任务', '从 2024 起连续几年发行超长期特别国债（首发 1 万亿）', '部署「人工智能+」行动、大规模设备更新与以旧换新'],
  }),
  gwr(2025, {
    title: '2025 年政府工作报告', date: '2025-03',
    metrics: { gdpTarget: 5, deficit: 4.0, cpi: 2, jobs: 1200, urbanUnemp: 5.5, specialBond: 4.4, longBond: 1.3, defense: 7.2 },
    stance: { fiscal: '更加积极（赤字率升至 4% 左右）', monetary: '适度宽松（14 年来定调转向）' },
    keywords: ['提振消费', '人工智能+', '适度宽松', '稳楼市稳股市', '全方位扩大内需', '民营经济促进法'],
    highlights: ['「大力提振消费」列为首要任务', '赤字率由 3% 提高到 4% 左右，财政力度显著加码', '货币政策定调由「稳健」转为「适度宽松」(自 2011 年来首次)', 'CPI 目标由 3% 下调至 2% 左右，正视低通胀'],
  }),
  gwr(2026, {
    title: '2026 年政府工作报告（初步 · 待校订）', date: '2026-03',
    metrics: { gdpTarget: 5, deficit: 4.0, cpi: 2, jobs: 1200, urbanUnemp: 5.5, specialBond: 4.5, longBond: 1.5, defense: 7.0 },
    stance: { fiscal: '更加积极（延续扩张）', monetary: '适度宽松' },
    keywords: ['十五五开局', '提振消费', '新质生产力', '反内卷', '统筹发展与安全', '高水平开放'],
    highlights: ['「十五五」规划开局之年的施政部署', '延续积极财政 + 适度宽松货币组合', '注：本条为公开信息初步综合，具体以官方正式发布为准'],
  }),
];

// 中央经济工作会议（每年 12 月召开，为次年定调）
const cewc = (year, o) => ({ id: `cewc-${year}`, type: '中央经济工作会议', year, org: '中共中央 / 国务院', date: `${year}-12`, source: '新华社', asOf: '2026-06', forYear: year + 1, ...o });
export const CEWC_DOCS = [
  cewc(2021, {
    title: '2021 年中央经济工作会议（定调 2022）',
    stance: { fiscal: '积极、提升效能', monetary: '稳健、灵活适度' },
    tasks: ['宏观政策稳健有效', '微观政策激发活力', '结构政策畅通循环', '科技政策扎实落地', '改革开放政策激活动力', '区域政策增强发展平衡性', '社会政策兜住底线'],
    keywords: ['稳字当头稳中求进', '三重压力（需求收缩/供给冲击/预期转弱）', '政策发力适当靠前', '正确认识和把握'],
    highlights: ['首次明确「需求收缩、供给冲击、预期转弱」三重压力', '要求政策发力适当靠前'],
  }),
  cewc(2022, {
    title: '2022 年中央经济工作会议（定调 2023）',
    stance: { fiscal: '加力提效', monetary: '精准有力' },
    tasks: ['着力扩大国内需求', '加快建设现代化产业体系', '切实落实两个毫不动摇', '更大力度吸引和利用外资', '有效防范化解重大经济金融风险'],
    keywords: ['着力扩大国内需求', '两个毫不动摇', '大力提振市场信心', '从战略全局出发'],
    highlights: ['把扩大内需放在突出位置', '罕见专段回应、提振民营经济与企业家信心'],
  }),
  cewc(2023, {
    title: '2023 年中央经济工作会议（定调 2024）',
    stance: { fiscal: '适度加力、提质增效', monetary: '灵活适度、精准有效' },
    tasks: ['以科技创新引领现代化产业体系', '着力扩大国内需求', '深化重点领域改革', '扩大高水平对外开放', '持续有效防范化解重点领域风险'],
    keywords: ['以进促稳、先立后破', '新质生产力', '稳中求进', '多出有利于稳预期稳增长的政策'],
    highlights: ['提出「以进促稳、先立后破」方法论', '科技创新引领产业升级列为首要任务', '「新质生产力」进入中央定调'],
  }),
  cewc(2024, {
    title: '2024 年中央经济工作会议（定调 2025）',
    stance: { fiscal: '更加积极', monetary: '适度宽松（14 年来首次转向）' },
    tasks: ['大力提振消费、全方位扩大内需', '以科技创新引领新质生产力', '发挥经济体制改革牵引作用', '扩大高水平对外开放', '稳住楼市股市、防范化解风险'],
    keywords: ['全方位扩大内需', '适度宽松', '稳住楼市股市', '超常规逆周期调节', '提振消费'],
    highlights: ['货币政策表述由「稳健」改为「适度宽松」，14 年来首次', '财政定调「更加积极」，提出「超常规逆周期调节」', '「大力提振消费」跃居首位、明确「稳住楼市股市」'],
  }),
  cewc(2025, {
    title: '2025 年中央经济工作会议（定调 2026 · 初步）',
    stance: { fiscal: '更加积极', monetary: '适度宽松' },
    tasks: ['提振消费扩大内需', '建设现代化产业体系 / 反内卷', '科技自立自强', '统筹发展与安全', '高水平对外开放'],
    keywords: ['十五五开局', '提振消费', '反内卷（综合整治内卷式竞争）', '统筹发展与安全'],
    highlights: ['为「十五五」开局之年定调（初步综合，以正式公报为准）', '延续积极财政 + 适度宽松货币', '预计延续「反内卷」「提振消费」主线'],
  }),
];

// 五年规划
const fyp = (id, year, o) => ({ id, type: '五年规划', year, org: '全国人大', source: '新华社', asOf: '2026-06', ...o });
export const FYP_DOCS = [
  fyp('fyp-13', 2016, {
    title: '国民经济和社会发展第十三个五年规划（2016–2020）', period: '2016–2020', date: '2016-03',
    metrics: { gdpAnnual: 6.5, rdIntensity: 2.5, urbanization: 60, newJobs: 5000 },
    keywords: ['全面建成小康社会', '创新协调绿色开放共享', '供给侧结构性改革', '脱贫攻坚', '中国制造2025'],
    highlights: ['以全面建成小康社会为总目标，GDP 与城乡居民收入比 2010 翻一番', '确立「创新、协调、绿色、开放、共享」五大发展理念', '现行标准下农村贫困人口实现脱贫'],
  }),
  fyp('fyp-14', 2021, {
    title: '国民经济和社会发展第十四个五年规划和 2035 远景目标（2021–2025）', period: '2021–2025', date: '2021-03',
    metrics: { gdpAnnual: null, rdIntensity: 7, urbanization: 65, newJobs: 5500 },
    keywords: ['构建新发展格局', '双循环', '科技自立自强', '高质量发展', '2035 远景', '全过程人民民主'],
    highlights: ['以推动高质量发展为主题，加快构建「双循环」新发展格局', '把科技自立自强作为国家发展的战略支撑，R&D 经费年均增 >7%', '不设五年 GDP 总量目标，首提 2035 年远景（人均 GDP 达中等发达国家水平）'],
  }),
  fyp('fyp-15', 2026, {
    title: '第十五个五年规划（2026–2030 · 初步）', period: '2026–2030', date: '2026-03',
    metrics: { gdpAnnual: null, rdIntensity: null, urbanization: null, newJobs: null },
    keywords: ['十五五', '现代化产业体系', '科技自立自强', '扩大内需', '共同富裕', '统筹发展与安全', '高水平开放'],
    highlights: ['「十五五」承上启下、迈向 2035 基本实现现代化的关键五年', '预计聚焦现代化产业体系、科技自立自强、扩内需、共同富裕与安全', '注：建议/纲要为初步综合，具体指标以官方正式发布为准'],
  }),
];

export const DOC_SEED = [...GWR_DOCS, ...CEWC_DOCS, ...FYP_DOCS];

export const DOC_CATALOG_META = {
  id: 'policy-docs-2026-06',
  label: '政策文件库 · 公开要点',
  asOf: '2026-06',
  sources: ['中国政府网', '新华社', '全国人大'],
  total: DOC_SEED.length,
  breakdown: { 政府工作报告: GWR_DOCS.length, 中央经济工作会议: CEWC_DOCS.length, 五年规划: FYP_DOCS.length },
  notes: '结构化要点综合，不含文件全文；数值以官方正式发布为准，近年部分为初步/示意',
};
