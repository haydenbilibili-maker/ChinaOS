// ============================================================================
// 军事力量公开情报库 · OSINT 整理 · 2026-06
// ----------------------------------------------------------------------------
// 数值均标注 asOf / estimate；不含涉密坐标与未公开编制细节。
// 来源：国防白皮书、SIPRI、IISS Military Balance、DoD 中国军力报告、CSIS 等。
// ============================================================================

export const MILITARY_INTEL_META = {
  id: 'military-intel-2026-06',
  asOf: '2026-06-11',
  label: '军事力量公开情报 · 2026-06',
  sources: [
    '《新时代的中国国防》白皮书（2019）',
    'SIPRI 军费数据库',
    'IISS Military Balance 2025',
    '美国国防部《中国军事与安全发展报告》',
    'CSIS / 公开卫星影像标注',
  ],
  disclaimer:
    '本模块为公开资料整理与估算示意，非官方发布，不代表任何政府或军方立场；基地坐标为公开报道/开源地图量级，非精确军事情报。',
};

export const STRATEGY_MILESTONES = [
  { year: '2027', title: '建军百年', desc: '机械化信息化智能化融合，具备捍卫主权与统一的战略能力。' },
  { year: '2035', title: '国防现代化', desc: '基本实现国防和军队现代化，理论/组织/人员/装备全面升级。' },
  { year: '2049', title: '世界一流', desc: '全面建成世界一流军队，支撑民族复兴战略高度。' },
];

export const OVERVIEW_STATS = [
  { value: '~200万', label: '现役总兵力', note: '白皮书口径 · 2019', accent: null },
  { value: '350+', label: '主要水面战斗舰艇', note: 'IISS 估算 · 2024', accent: '#22d3ee' },
  { value: '1,300+', label: '作战飞机', note: 'DoD 报告 · 2024', accent: null },
  { value: '350+', label: '核弹头估算', note: 'SIPRI · 2025 区间', accent: '#c41e3a' },
  { value: '$236B', label: '国防预算 2024', note: 'SIPRI · 现价美元', accent: '#e8a317' },
  { value: '~1.2%', label: '占 GDP', note: '官方公布 · 2024', accent: null },
];

export const BUDGET_TREND = {
  asOf: '2024',
  unit: 'B$（SIPRI 现价美元 · 示意）',
  years: ['2014', '2016', '2018', '2020', '2022', '2024'],
  values: [131, 146, 168, 178, 200, 236],
};

/** 五大军种 + 武警 + 联勤/信息支援 */
export const SERVICES = {
  army: {
    title: '陆军 (PLAA)',
    tag: '规模第一',
    stat: '~85万 · 合成旅80+',
    desc: '世界规模最大的地面部队。持续推进合成化改革，由师团制向旅营制转型，强调全域机动与立体攻防。',
    mission: '保卫陆地疆土，维护主权安全，参与国际维和与人道救援。',
    equip: '99A主战坦克、04A步战车、PCL-181车载榴弹炮、直-20、远程火箭炮。',
    hierarchy: ['战区陆军', '集团军', '合成旅/合成营', '营连排'],
  },
  navy: {
    title: '海军 (PLAN)',
    tag: '走向深蓝',
    stat: '350+艘 · 航母3',
    desc: '从近海防御型向远海防卫型转变。三大舰队快速换装，航母战斗群建设为核心。',
    mission: '近海防御、远海防卫，维护海上交通线与海外利益。',
    equip: '辽宁舰/山东舰/福建舰，055型万吨大驱，052D，075两栖攻击舰，094/093核潜艇。',
    hierarchy: ['海军总部', '三大舰队', '支队/大队', '舰艇编队'],
  },
  air: {
    title: '空军 (PLAAF)',
    tag: '跨代升级',
    stat: '1,300+架 · 歼-20 200+',
    desc: '建设空天一体、攻防兼备的强大空军。由国土防空向攻势防空转变，五代机数量快速增长。',
    mission: '国土防空、空中进攻、战略投送、支援陆海作战。',
    equip: '歼-20、运-20、轰-6K/N、空警-500、红旗-9。',
    hierarchy: ['空军总部', '战区空军/基地', '航空兵旅', '飞行大队'],
  },
  rocket: {
    title: '火箭军 (PLARF)',
    tag: '战略威慑',
    stat: '350+枚 · MIRV',
    desc: '战略威慑核心力量。核常兼备、射程衔接，具备对陆上要点与海上移动目标的精确打击能力。',
    mission: '遏制核威胁，遂行核反击与常规导弹精确打击。',
    equip: '东风-17(高超)、东风-21D/26、东风-41(洲际)、东风-100(巡航)。',
    hierarchy: ['火箭军总部', '基地/旅', '导弹营', '发射单元'],
  },
  ssf: {
    title: '信息支援部队 (ISSF)',
    tag: '信息主导',
    stat: '2024 组建 · 全域',
    desc: '2024年4月由战略支援部队调整组建，统管太空、网络、电子对抗、心理战等新型作战力量。',
    mission: '战场环境/信息通信保障、信息攻防、战略预警。',
    equip: '北斗导航、电子侦察卫星、网络攻防平台、频谱管控系统。',
    hierarchy: ['信息支援部队', '基地/中心', '旅团级单位'],
  },
  jls: {
    title: '联勤保障部队 (JLSF)',
    tag: '一体化后勤',
    stat: '五大战区联勤',
    desc: '2016年军改组建，实行联合保障、联合投送，支撑战区主战。',
    mission: '物资供应、运输投送、卫勤保障、维修保障、供应保障。',
    equip: '综合补给舰、运油船、大型运输机、野战医院、弹药库。',
    hierarchy: ['联勤保障部队', '战区联勤保障中心', '联勤保障旅', '仓库/场站'],
  },
  capf: {
    title: '武警 (CAPF)',
    tag: '内卫维稳',
    stat: '~50万 · 估算',
    desc: '担负执勤、处突、反恐、海上维权、抢险救援等任务，归中央军委领导指挥。',
    mission: '维护国家安全和社会稳定，保卫重要目标，处置突发事件。',
    equip: '轻型装甲车、直升机、防暴装备、海警舰艇（海警局）。',
    hierarchy: ['武警总部', '总队/支队', '大队/中队'],
  },
};

export const PERSONNEL = {
  asOf: '2019-07',
  source: '《新时代的中国国防》白皮书',
  activeDuty: { value: 2000000, label: '~200万', note: '现役总兵力（不含武警）' },
  reserve: { value: 500000, label: '~50万', note: '预备役（估算区间）' },
  militia: { label: '民兵体系', note: '基层国防动员，人数随任务动态调整' },
  civilianStaff: {
    asOf: '2023-03',
    label: '文职人员',
    total: '~30万',
    note: '2018年起统一面向社会公开招考；从事管理、专业技术与技能岗位',
    categories: [
      { name: '管理岗', share: 25, desc: '机关与基层管理' },
      { name: '专业技术岗', share: 55, desc: '科研、医疗、工程、情报分析等' },
      { name: '技能岗', share: 20, desc: '装备维修、后勤技能等' },
    ],
  },
  recruitment: {
    asOf: '2024',
    annual: '~45万',
    note: '年度征兵规模公开报道区间；大学生比例持续上升',
    focus: ['理工类专业', '舰载机/无人机操作', '网络与电子对抗', '高原边防'],
  },
  rankStructure: {
    asOf: '2025-06',
    note: '将官总数公开估算；校尉军官为编制示意非精确',
    general: [
      { rank: '上将', count: '~38', note: '含军委、战区、军种主官' },
      { rank: '中将', count: '~120', note: 'IISS/开源名录估算' },
      { rank: '少将', count: '~500+', note: '非官方全集，现役约数百' },
    ],
    field: [
      { rank: '大校/上校', share: 18, label: '团级主官、机关处长' },
      { rank: '中校/少校', share: 42, label: '营连主官、参谋' },
      { rank: '尉官', share: 28, label: '排连基层' },
      { rank: '士官/士兵', share: 12, label: '技术骨干与义务兵' },
    ],
  },
  serviceShare: [
    { name: '陆军', value: 42, color: '#c41e3a' },
    { name: '海军', value: 12, color: '#22d3ee' },
    { name: '空军', value: 15, color: '#8b5cf6' },
    { name: '火箭军', value: 8, color: '#e8a317' },
    { name: '信息支援/联勤/其他', value: 23, color: '#64748b' },
  ],
};

export const MISSILE_SPECTRUM = {
  srbm: { title: '近程弹道导弹 (SRBM)', variants: 'DF-11/15/16', range: '600 – 1,000 km', width: 10, desc: '精确打击周边高价值目标（机场、港口、指挥中心），数量庞大、精度高。', target: '覆盖第一岛链内目标，重点针对台湾岛及周边海域。' },
  mrbm: { title: '中程/反舰弹道导弹 (MRBM)', variants: 'DF-21D 航母杀手', range: '1,500 – 2,500 km', width: 25, desc: '「反介入/区域拒止」(A2/AD) 核心武器，DF-21D 具备打击海上移动目标能力。', target: '覆盖第一至第二岛链海域，含日本、菲律宾及南海。' },
  irbm: { title: '中远程弹道导弹 (IRBM)', variants: 'DF-26 关岛快递', range: '3,000 – 4,000 km', width: 40, desc: '核常兼备、快速反应，DF-26 可打击第二岛链关键节点。', target: '覆盖关岛安德森基地及印度洋北部，威慑第二岛链。' },
  icbm: { title: '洲际弹道导弹 (ICBM)', variants: 'DF-31AG/41', range: '12,000 – 15,000 km', width: 100, desc: '战略核威慑基石。固体燃料，机动/井基部署，具备多弹头分导 (MIRV)。', target: '覆盖全球大部，确保二次核打击能力。' },
};

export const EQUIPMENT_CATALOG = [
  {
    domain: '海军',
    accent: '#22d3ee',
    items: [
      { name: '003型福建舰', type: '航母', status: '海试/服役', qty: '1', note: '电磁弹射 · CSIS 2025' },
      { name: '002型山东舰', type: '航母', status: '现役', qty: '1', note: '国产首艘航母' },
      { name: '001型辽宁舰', type: '航母', status: '现役', qty: '1', note: '改装自瓦良格' },
      { name: '055型', type: '驱逐舰', status: '现役', qty: '8+', note: '万吨大驱 · 112垂发' },
      { name: '052D/DL', type: '驱逐舰', status: '现役', qty: '25+', note: '中华神盾' },
      { name: '075型', type: '两栖攻击舰', status: '现役', qty: '3', note: '海南/广西/安徽' },
      { name: '094/096', type: '战略核潜艇', status: '现役/研制', qty: '6+', note: 'JL-2/JL-3 载体' },
      { name: '039A/B', type: '常规潜艇', status: '现役', qty: '20+', note: 'AIP 常规动力' },
    ],
  },
  {
    domain: '空军',
    accent: '#8b5cf6',
    items: [
      { name: '歼-20', type: '第五代战斗机', status: '现役', qty: '200+', note: 'DoD 2024 估算' },
      { name: '歼-16', type: '多用途战斗机', status: '现役', qty: '300+', note: '对地/对海/空优' },
      { name: '歼-10C', type: '第四代战斗机', status: '现役', qty: '250+', note: '主力制空' },
      { name: '运-20', type: '战略运输机', status: '现役', qty: '50+', note: '战略投送核心' },
      { name: '轰-6K/N', type: '战略轰炸机', status: '现役', qty: '100+', note: '远程精确打击' },
      { name: '空警-500', type: '预警机', status: '现役', qty: '30+', note: '有源相控阵' },
      { name: '直-20', type: '通用直升机', status: '现役', qty: '100+', note: '突击/运输/反潜' },
    ],
  },
  {
    domain: '陆军',
    accent: '#c41e3a',
    items: [
      { name: '99A', type: '主战坦克', status: '现役', qty: '600+', note: '第三代主战坦克' },
      { name: '04A', type: '步兵战车', status: '现役', qty: '1,000+', note: '机械化步兵核心' },
      { name: 'PCL-181', type: '车载榴弹炮', status: '现役', qty: '200+', note: '155mm 卡车炮' },
      { name: 'PHL-191', type: '远程火箭炮', status: '现役', qty: '100+', note: '370mm 模块化' },
      { name: '直-10', type: '武装直升机', status: '现役', qty: '150+', note: '陆航突击' },
      { name: '红旗-17', type: '野战防空', status: '现役', qty: '—', note: '伴随防空' },
    ],
  },
  {
    domain: '火箭军',
    accent: '#e8a317',
    items: [
      { name: '东风-41', type: '洲际弹道导弹', status: '现役', qty: '—', note: 'MIRV · 公路机动' },
      { name: '东风-31AG', type: '洲际弹道导弹', status: '现役', qty: '—', note: '公路机动' },
      { name: '东风-26', type: '中远程弹道导弹', status: '现役', qty: '—', note: '核常兼备 · 反舰' },
      { name: '东风-21D', type: '反舰弹道导弹', status: '现役', qty: '—', note: 'A2/AD 标志' },
      { name: '东风-17', type: '高超音速', status: '现役', qty: '—', note: '乘波体 HGV' },
      { name: '长剑-10', type: '巡航导弹', status: '现役', qty: '—', note: '对陆精确打击' },
    ],
  },
];

export const NAVY_BAR = {
  asOf: '2024',
  categories: ['075型两栖', '航母', '055型大驱', '052D驱逐舰'],
  values: [3, 3, 8, 25],
};

export const AIR_PIE = {
  asOf: '2024',
  note: '四/五代机占比 · DoD 估算示意',
  data: [
    { value: 55, name: '四/五代机', color: '#c41e3a' },
    { value: 45, name: '三代及以下', color: '#27324a' },
  ],
};

/** TRL 1-9 技术成熟度标注 */
export const TECH_DOMAINS = [
  {
    id: 'ai',
    title: '军事人工智能',
    trl: 7,
    trlLabel: '系统原型在作战环境演示',
    status: '列装试验',
    desc: '目标识别、辅助决策、无人机集群、电子战信号分析；强调「人在回路」。',
    programs: ['智能化作战实验', '无人僚机协同', '战场态势融合'],
    source: 'DoD 2024 / 航天科工公开材料',
  },
  {
    id: 'hypersonic',
    title: '高超音速武器',
    trl: 8,
    trlLabel: '系统完成试验并合格',
    status: '已列装',
    desc: '东风-17 乘波体已公开阅兵；吸气式高超 YJ-XX 在研；美国称已具备初始作战能力。',
    programs: ['DF-17 HGV', '高超音速巡航导弹（研制）'],
    source: 'CSIS / DoD 2024',
  },
  {
    id: 'quantum',
    title: '量子通信与传感',
    trl: 6,
    trlLabel: '相关环境原型演示',
    status: '试验部署',
    desc: '「墨子号」卫星量子密钥分发；量子雷达、重力探测在实验室与试验网阶段。',
    programs: ['量子保密通信网', '量子导航/传感研究'],
    source: '科技部 / 公开论文',
  },
  {
    id: 'space',
    title: '航天军工与反太空',
    trl: 8,
    trlLabel: '系统完成试验并合格',
    status: '在轨运行',
    desc: '北斗三号全球组网；高分/遥感星座；反卫星与在轨服务能力持续增强。',
    programs: ['北斗-3', '可重复使用运载器', '在轨服务试验'],
    source: '国家航天局 / IISS',
  },
  {
    id: 'chips',
    title: '军工芯片自主',
    trl: 5,
    trlLabel: '相关环境验证',
    status: '攻关期',
    desc: '28nm 及以上军用/工业级国产化率提升；7nm 以下仍依赖外部供应链，「算力主权」受制。',
    programs: ['信创替代', 'FPGA/ASIC 自主', '先进封装'],
    source: '工信部 / 行业研报 · 估算',
  },
  {
    id: 'ew',
    title: '电子战与网电一体',
    trl: 7,
    trlLabel: '系统原型在作战环境演示',
    status: '列装升级',
    desc: '随信息支援部队组建，电磁频谱管控、网电协同攻击与防护能力整合。',
    programs: ['综合电子战系统', '网络攻防平台'],
    source: '新华社 2024-04 / DoD',
  },
];

export const THEATERS = [
  {
    id: 'east',
    name: '东部战区',
    hq: '南京',
    hqCoord: [118.78, 32.06],
    color: '#c41e3a',
    focus: '台海方向 · 第一岛链突破',
    commander: '林向阳（上将 · 2024 公开报道）',
    provinces: ['江苏', '浙江', '安徽', '福建', '江西', '上海'],
    fleet: '东部战区海军（原东海舰队）',
    armyGroups: ['第71集团军（无锡）', '第72集团军（湖州）', '第73集团军（厦门）'],
    note: '对台应急作战与东南方向联合演训核心方向',
  },
  {
    id: 'south',
    name: '南部战区',
    hq: '广州',
    hqCoord: [113.26, 23.13],
    color: '#e8a317',
    focus: '南海维权 · 中南半岛方向',
    commander: '吴亚男（上将 · 公开报道）',
    provinces: ['湖南', '广东', '广西', '海南', '云南', '贵州'],
    fleet: '南部战区海军（原南海舰队）',
    armyGroups: ['第74集团军（惠州）', '第75集团军（昆明）'],
    note: '南海岛礁建设与远海训练频次最高战区之一',
  },
  {
    id: 'west',
    name: '西部战区',
    hq: '成都',
    hqCoord: [104.07, 30.67],
    color: '#8b5cf6',
    focus: '中印边境 · 中亚方向',
    commander: '汪海江（上将 · 公开报道）',
    provinces: ['四川', '重庆', '西藏', '新疆', '青海', '甘肃', '宁夏'],
    fleet: '—（陆空为主）',
    armyGroups: ['第76集团军（西宁）', '第77集团军（成都）', '新疆/西藏军区（副战区）'],
    note: '高原作战与边境管控，联合作战实验平台',
  },
  {
    id: 'north',
    name: '北部战区',
    hq: '沈阳',
    hqCoord: [123.43, 41.80],
    color: '#22d3ee',
    focus: '朝鲜半岛 · 对俄方向',
    commander: '李桥铭（上将 · 公开报道）',
    provinces: ['黑龙江', '吉林', '辽宁', '山东', '内蒙古'],
    fleet: '北部战区海军（原北海舰队）',
    armyGroups: ['第78集团军（哈尔滨）', '第79集团军（锦州）', '第80集团军（淄博）'],
    note: '寒区作战与渤海黄海防务',
  },
  {
    id: 'central',
    name: '中部战区',
    hq: '北京',
    hqCoord: [116.40, 39.90],
    color: '#10b981',
    focus: '首都防卫 · 战略预备',
    commander: '徐德清（上将 · 公开报道）',
    provinces: ['北京', '天津', '河北', '山西', '河南', '湖北', '陕西'],
    fleet: '—（战略预备队）',
    armyGroups: ['第81集团军（张家口）', '第82集团军（保定）', '第83集团军（新乡）'],
    note: '军委直管战略预备与首都圈联合防空',
  },
];

/** 省份 → 战区（用于地图着色） */
export const PROVINCE_THEATER = (() => {
  const m = {};
  THEATERS.forEach((t) => {
    t.provinces.forEach((p) => { m[p] = t.id; });
  });
  return m;
})();

export const LOGISTICS = {
  asOf: '2024',
  structure: [
    { level: '联勤保障部队（军委）', role: '统管全军联合保障建设', location: '武汉（总部驻地 · 公开报道）' },
    { level: '战区联勤保障中心', role: '战区联合保障指挥', location: '五大战区各一' },
    { level: '联勤保障旅', role: '仓储、运输、维修、卫勤', location: '重点方向前沿' },
    { level: '军港/机场/场站', role: '装卸载与中转', location: '战略通道节点' },
  ],
  hubs: [
    { name: '武汉联勤保障基地', type: '总部/仓储', region: '中部', note: '2016 军改后联勤主体' },
    { name: '西宁联勤保障中心', type: '高原保障', region: '西部', note: '高原边防物资投送' },
    { name: '无锡联勤保障中心', type: '综合保障', region: '东部', note: '东南方向储备' },
    { name: '桂林联勤保障中心', type: '南部保障', region: '南部', note: '华南方向' },
    { name: '沈阳联勤保障中心', type: '寒区保障', region: '北部', note: '东北方向' },
  ],
  transport: {
    strategicAirlift: { label: '战略空运', capacity: '运-20 机队 50+ 架', note: '跨区投送能力持续提升' },
    sealift: { label: '战略海运', capacity: '民用滚装船队 + 海军补给舰', note: '岛链外投送仍为主要短板' },
    rail: { label: '铁路机动', capacity: '全军铁路输送体系', note: '导弹/装甲部队跨区机动' },
    pipeline: { label: '管线补给', capacity: '西南/西北管线网', note: '高原边境持续保障' },
  },
};

/** 公开报道/开源标注的基地 · 坐标为城市/设施公开参考点 · 非精确军事情报 */
export const MILITARY_BASES = [
  { id: 'b1', name: '青岛海军基地', type: '海军', branch: '北部战区海军', coord: [120.38, 36.07], region: '山东', source: '公开报道/开源地图', note: '航母母港之一' },
  { id: 'b2', name: '三亚榆林海军基地', type: '海军', branch: '南部战区海军', coord: [109.52, 18.23], region: '海南', source: 'CSIS 卫星分析', note: '核潜艇/航母保障' },
  { id: 'b3', name: '舟山某军港', type: '海军', branch: '东部战区海军', coord: [122.20, 30.02], region: '浙江', source: '公开报道', note: '东海舰队主力驻泊' },
  { id: 'b4', name: '湛江海军基地', type: '海军', branch: '南部战区海军', coord: [110.40, 21.20], region: '广东', source: '公开报道', note: '南海舰队' },
  { id: 'b5', name: '大连造船/军港', type: '海军', branch: '北部战区海军', coord: [121.62, 38.92], region: '辽宁', source: '公开报道', note: '航母建造与试验' },
  { id: 'a1', name: '空某基地（东部）', type: '空军', branch: '东部战区空军', coord: [119.30, 26.08], region: '福建', source: '公开报道', note: '东南方向前沿机场群' },
  { id: 'a2', name: '空某基地（南部）', type: '空军', branch: '南部战区空军', coord: [110.35, 20.02], region: '广东', source: '公开报道', note: '华南防空与对海' },
  { id: 'a3', name: '空某基地（西部）', type: '空军', branch: '西部战区空军', coord: [103.62, 36.06], region: '甘肃', source: '公开报道', note: '训练与试验' },
  { id: 'a4', name: '鼎新试验训练基地', type: '空军', branch: '西部战区空军', coord: [99.52, 40.40], region: '甘肃', source: '维基/公开报道', note: '红蓝对抗训练' },
  { id: 'r1', name: '火箭军某基地（华北）', type: '火箭军', branch: '火箭军', coord: [113.65, 34.76], region: '河南', source: '开源估算 · 非精确', note: '机动发射单元驻训' },
  { id: 'r2', name: '火箭军某基地（西北）', type: '火箭军', branch: '火箭军', coord: [105.00, 37.50], region: '宁夏', source: '开源估算 · 非精确', note: '沙漠机动训练区' },
  { id: 'l1', name: '吉布提保障基地', type: '海外', branch: '联勤/海军', coord: [43.15, 11.59], region: '吉布提', source: '国防部 2017 公告', note: '首个海外保障基地' },
  { id: 'l2', name: '柬埔寨云壤海军基地', type: '海外', branch: '海军', coord: [103.52, 10.62], region: '柬埔寨', source: '公开报道 · 2024', note: '补给与休整（中方参与建设）' },
  { id: 'g1', name: '西沙永兴岛', type: '岛礁', branch: '南部战区', coord: [112.33, 16.83], region: '海南', source: '公开报道', note: '机场/港口/雷达' },
  { id: 'g2', name: '南沙永暑礁', type: '岛礁', branch: '南部战区', coord: [112.97, 9.55], region: '海南', source: '公开报道', note: '综合保障枢纽' },
];

export const BASE_TYPE_COLORS = {
  海军: '#22d3ee',
  空军: '#8b5cf6',
  火箭军: '#e8a317',
  海外: '#10b981',
  岛礁: '#c41e3a',
};
