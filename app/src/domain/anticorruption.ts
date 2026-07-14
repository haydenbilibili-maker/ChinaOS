/**
 * ChinaOS 模块 07 v2.0 · 反腐结构观测
 * ---------------------------------------------------------------------------
 * ⚠ 第一设计不变量（不可被「优化」掉）：
 *    本模块不数人头，只数租金面。
 *
 * 核心方程：腐败密度 = 租金面 × 监督缺口
 * v2.0 关键升级：把方程从「解释工具」升级为「预测工具」——
 * 逐部门计算密度并排序，用 2012—2026 的十四年案卷做回测。
 */

import { AS_OF_BASELINE } from '../lib/config/asOfBaseline.js';

/** 被明确设计排除的字段 —— 守卫测试的身份证 */
export const FORBIDDEN_MODULE_FIELDS = ['officials', 'purgeCount', 'faction'] as const;

export type RentSource = 'cadre_appointment' | 'project_contracting' | 'business_regulation';
export type FactorTrend = 'expanding' | 'flat' | 'shrinking';
export type CureStatus = 'red' | 'amber' | 'green';

export interface Factor {
  level: number;
  trend: FactorTrend;
  evidence: string[];
}

export interface CorruptionEquation {
  rentSurface: Factor;
  monitoringGap: Factor;
}

export interface Rent {
  source: RentSource;
  officialTerm: string;
  powerForm: string;
  whyValuable: string;
  surfaceSize: number;
  trend: string;
  trendColor: string;
  arrow: string;
  note: string;
}

export interface StructuralCure {
  name: string;
  status: CureStatus;
  statusLabel: string;
  isQualitativeSignal: boolean;
  note: string;
}

export interface SectorDensity {
  name: string;
  rent: number;
  gap: number;
  rentWhy: string;
  gapWhy: string;
  evid: string;
  density: number;
  epicenter?: boolean;
  warn?: boolean;
  note?: string;
}

export interface PhaseEvolution {
  num: string;
  name: string;
  yr: string;
  core: string;
  body: string;
  marks: string;
}

export interface TabooLadderStep {
  yr: string;
  broke: string;
  zone: string;
  case: string;
}

export const ANTICORRUPTION_ROUTE = '/modules/anticorruption';
export const ANTICORRUPTION_AS_OF = AS_OF_BASELINE;
export const ANTICORRUPTION_VERSION = 'v2.0';

export const MODULE_DISCIPLINE =
  '标志性案件在此<strong>仅作为「结构标本」</strong>使用——' +
  '<strong>每一个窝案的位置都不是随机的：它精确标出了租金面最大、监督缺口最深的地方。</strong>' +
  '所有读数只来自官方通报措辞与公开政策文本，<strong>不含任何高层人事推测、派系归属或匿名爆料</strong>。' +
  '那类叙事不可证伪，因而不是分析工具，是安慰剂。';

export const CORRUPTION_DENSITY_EQUATION = '腐败密度 = 租金面 × 监督缺口';

/** 部门腐败密度 · 归一化结构比较刻度（0–100），用于排序而非精确度量 */
export const SECTOR_DENSITY: SectorDensity[] = [
  {
    name: '军队 · 军工',
    rent: 96,
    gap: 98,
    rentWhy: '巨额采购预算 + 装备定价不透明',
    gapWhy: '国家机密屏蔽一切外部监督，系统封闭',
    evid: '火箭军窝案 · 装备发展部 · 国防部长 · 两任军委副主席 · 多家军工集团掌门',
    density: 94,
    epicenter: true,
  },
  {
    name: '金融系统',
    rent: 92,
    gap: 72,
    rentWhy: '信贷分配权——决定谁拿到廉价资本',
    gapWhy: '专业壁垒高，外部难以监督',
    evid: '2023 年后金融系统持续整肃 · 监管机构本身亦被查',
    density: 66,
    note: '⚠ 它是「金融抑制」的执行层——储户被压低的利息，正是在这里被分配掉的',
  },
  {
    name: '基建 · 土地',
    rent: 94,
    gap: 60,
    rentWhy: '土地财政 + 工程承揽（定标/监理/规划）',
    gapWhy: '地方保护，跨部门合谋',
    evid: '地方诸侯窝案长期高发 · 「工程承揽」是通报高频词',
    density: 56,
    warn: true,
    note: '⚠ 20 万亿城市更新正在铺开一个全新的工程承揽场',
  },
  {
    name: '能源 · 资源',
    rent: 88,
    gap: 66,
    rentWhy: '垄断性资源的开采权与定价权',
    gapWhy: '央企体系内部循环',
    evid: '石油系统窝案 · 煤炭领域反腐',
    density: 58,
  },
  {
    name: '政法系统',
    rent: 80,
    gap: 84,
    rentWhy: '司法裁量权 = 自由与财产的定价权',
    gapWhy: '自己监督自己，无独立司法',
    evid: '政法系统整肃 · 首次打破「刑不上常委」即出自此系统',
    density: 67,
  },
  {
    name: '医药 · 卫生',
    rent: 74,
    gap: 55,
    rentWhy: '药品入院、集采、准入审批',
    gapWhy: '专业壁垒 + 利益链隐蔽',
    evid: '2023 年医药领域集中整治',
    density: 41,
  },
  {
    name: '一般行政',
    rent: 38,
    gap: 44,
    rentWhy: '审批、检查、处罚的自由裁量',
    gapWhy: '相对可见，群众可感知',
    evid: '「吃拿卡要」高发但单笔金额小 —— 密度低，但面广',
    density: 17,
  },
].sort((a, b) => b.density - a.density);

export const DENSITY_BACKTEST = {
  headline: '方程测中了震中。',
  body:
    '<b>军队 / 军工在两个因子上同时拿到最高分</b>——巨额采购预算（租金面极大）× 国家机密屏蔽一切外部监督（监督缺口极大）。' +
    '<b>方程预测：这里的腐败密度必然是全系统最高的。</b><br><br>' +
    '而事实是：火箭军窝案、装备发展部、国防部长、两任军委副主席、多家军工集团掌门人——' +
    '<b>近十四年最密集、级别最高的整肃，恰恰全部发生在这里。</b><br><br>' +
    '<b>这不是巧合，这是结构的必然。</b>把最多的钱，交给最不受监督的地方，' +
    '<b>你不需要知道任何人的名字，就能预测那里会出事。</b>',
};

export const PHASE_EVOLUTION: PhaseEvolution[] = [
  {
    num: 'PHASE 01',
    name: '运动 · 破禁忌',
    yr: '2012 — 2017',
    core: '先证明「没有铁帽子王」。',
    body:
      '以打破既有保护规则为首要任务。<b>关键不是抓了多少人，而是证明了「有些人不能碰」这条潜规则不再成立。</b>此阶段仍高度依赖运动式高压，制度工具尚未成型。',
    marks: '标志 · <b>周永康</b>（打破「刑不上常委」）· <b>徐才厚 / 郭伯雄</b>（军队）· <b>孙政才</b>（2017，首名在任政治局委员）',
  },
  {
    num: 'PHASE 02',
    name: '建机器 · 制度化',
    yr: '2016 — 2018',
    core: '把运动，变成一台常设机器。',
    body:
      '2016 年 11 月北京、山西、浙江三地试点；2018 年 2 月底全国省市县三级监察委组建完成；<b>2018 年 3 月 20 日《监察法》通过，国家监委挂牌。</b><br><b>最关键的变化：覆盖面从「党员」扩展到「所有行使公权力的公职人员」。</b>纪委监委合署办公，反腐力量从分散走向集中统一。',
    marks:
      '结构含义 · <b>这是最被低估的阶段。</b>它承认了一件事：腐败不能根除，只能「压制」——<b>而压制需要的不是运动，是一台永远运转的机器。</b>',
  },
  {
    num: 'PHASE 03',
    name: '系统整肃 · 打窝案',
    yr: '2022 — 至今',
    core: '从「打个人」，到「打系统」。',
    body:
      '目标从个别高官转向<b>整建制的系统</b>：军队装备、军工集团、金融、医药。<b>窝案化是这一阶段的定义特征</b>——因为腐败本就是系统性的，只打个人无法清除。<br>二十大周期内<b>三名在任政治局委员被处理</b>，为文革后首次；政治局缩至 21 人，1999 年以来最小。',
    marks:
      '结构含义 · <b>窝案的分布，恰恰验证了密度方程</b>——它们全部聚集在租金面 × 监督缺口最高的那几个部门。',
  },
];

export const TABOO_LADDER: TabooLadderStep[] = [
  {
    yr: '2014',
    broke: '刑不上常委',
    zone: '此前被普遍认为：<b>担任或曾任政治局常委者不受刑事追究。</b>此案之后，这条潜规则不再成立。',
    case: '周永康（十七届政治局常委）',
  },
  {
    yr: '2014—15',
    broke: '军队高层免疫',
    zone: '军委副主席（已退）被查。<b>军队不再是自成体系的免疫区。</b>',
    case: '徐才厚 · 郭伯雄',
  },
  {
    yr: '2017',
    broke: '在任政治局委员',
    zone: '首次对<b>在任</b>政治局委员立案。<b>「在任」不再是保护。</b>',
    case: '孙政才',
  },
  {
    yr: '2025',
    broke: '在任军委副主席',
    zone: '现役最高军职之一被处理。<b>军队核心层的保护失效。</b>',
    case: '何卫东',
  },
  {
    yr: '2026',
    broke: '军委第一副主席',
    zone: '军队序列的最高保护也被打破。',
    case: '张又侠',
  },
  {
    yr: '2026',
    broke: '敏感边疆封疆大吏',
    zone:
      '此前有一条不成文的观察：<b>新疆等高度敏感地区的主政者，仕途虽有起伏但不遭彻底清算。</b>此案打破了它。',
    case: '马兴瑞（在任政治局委员）',
  },
];

export const TABOO_SHRINK_BAR = [
  { label: '2012', width: 14, color: 'var(--green)' },
  { label: '2014', width: 20, color: 'var(--celadon)' },
  { label: '2017', width: 20, color: 'var(--amber)' },
  { label: '2025', width: 23, color: '#c2764a' },
  { label: '2026 · 无安全区', width: 23, color: 'var(--red)' },
];

export const THRESHOLD_MECHANISM = {
  title: '它解决了「选择性执法」的合法性难题',
  quote: '通报原句：「且在党的十八大后不收敛、不收手，性质极其严重，影响极其恶劣。」',
  paragraphs: [
    '这句话几乎出现在每一份高级别通报里。它看起来是修辞，<b>其实是一个制度装置。</b>',
    '<b>它把十八大（2012 年 11 月）设为一条人为划定的分界线：</b>线之前的问题，从宽；<b>线之后仍不收手的，从重。</b>',
    '为什么需要这条线？<b>因为在一个租金面巨大的体制里，「几乎人人有问题」是一个事实。</b>而执法能力是有限的——<b>这意味着「选择性执法」不是一个道德选择，是一个数学必然。</b>',
  ],
  footnote:
    '<b>而这条线的功能，正是为这种必然的选择性，提供一个非任意的标准。</b><br>' +
    '它把一个「人人有份、无法执行」的普遍罪，<b>转化成了一个「可甄别、可执行」的特定罪</b>——' +
    '不是"你贪过没有"（那样谁都跑不掉），而是<b>"警钟敲响之后，你收手了没有"</b>。<br>' +
    '<b>这是一次隐性的、未宣布的特赦线设计。它极其精巧，而且它是这台机器能持续运转十四年的关键。</b>',
};

export const COST_CURVE = {
  title: '反腐的经济代价，写在同一个方程的另一侧',
  paragraphs: [
    '禁忌递降的另一面，是<b>不确定性的单调上升</b>。当连最高层级都不再有结构性的安全区，这个信号会沿着整个官僚体系向下传导。',
    '一个厅局级、处级干部的理性反应是什么？<b>更保守、更不担责、更不出头。</b>',
    '<b>做事可能出错，出错可能被终身追责；不做事，不会出错。理性人会选择「不出事」。</b>而「不出事」的行为表现是：不担责、不创新、不拍板、<b>新官不理旧账</b>——<b>这正是第三章诊断「投资不过山海关」时列出的那些症状。</b>',
  ],
  loop:
    '<b>年轻人退出的方式，叫躺平。</b><br>' +
    '<b>官员退出的方式，叫「多做多错，不如不做」。</b><br>' +
    '—— 同一种机制：当风险远大于回报，理性人退出 ——<br><br>' +
    '<b>而这正是最沉重的代价：</b>反腐在净化队伍的同时，也在<b>冻结</b>队伍。<br>' +
    '<b>而一个被冻结的官僚体系，恰恰是「最小可行改革序列」最需要的执行器。</b>',
};

export const CORRUPTION_EQUATION: CorruptionEquation = {
  rentSurface: {
    level: 85,
    trend: 'expanding',
    evidence: [
      '20 万亿城市更新正在铺开一个全新的工程承揽场',
      '国家在资源配置中的份额未减反增',
    ],
  },
  monitoringGap: {
    level: 72,
    trend: 'flat',
    evidence: [
      '财产公示、独立司法、新闻监督——三项治本工具，一项未启动',
      '内部监督（纪委/巡视/监委）替代外部监督',
    ],
  },
};

/** 三个租金源 —— 指数计算与守卫测试保留 */
export const RENT_SOURCES: Rent[] = [
  {
    source: 'cadre_appointment',
    officialTerm: '干部选拔任用',
    powerForm: '给谁位子',
    whyValuable:
      '位子由上级给，<strong>不是由市场或选票给</strong>。于是「提拔」本身成为可交易品——通报明确指其「在干部选拔任用工作中为他人谋取利益」。',
    surfaceSize: 78,
    trend: '持平',
    trendColor: 'var(--amber)',
    arrow: '→',
    note: '考核指挥棒未换（仍以 GDP/投资为主），提拔的裁量权高度集中。',
  },
  {
    source: 'project_contracting',
    officialTerm: '工程承揽',
    powerForm: '给谁项目',
    whyValuable:
      '项目由政府批，<strong>不是由资本自主配置</strong>。<strong>这是当前扩张最快的租金面</strong>——20 万亿城市更新正在铺开一个全新的工程承揽场：谁定标、谁监理、谁批规划，每一环都是新寻租点。',
    surfaceSize: 92,
    trend: '快速扩大',
    trendColor: 'var(--red)',
    arrow: '↑↑',
    note: '⚠ 最危险的一项：一边打击工程承揽寻租，一边制造 20 万亿新工程。',
  },
  {
    source: 'business_regulation',
    officialTerm: '企业经营',
    powerForm: '给谁批文',
    whyValuable:
      '企业的生死由监管定，<strong>不是由消费者定</strong>。牌照、准入、检查、处罚——每一项自由裁量权都是一个租金点。',
    surfaceSize: 70,
    trend: '略降',
    trendColor: 'var(--green)',
    arrow: '↓',
    note: '「整治乱收费乱罚款乱检查乱查封」等措辞显示高层已识别此病灶。',
  },
];

export const STRUCTURAL_CURES: StructuralCure[] = [
  {
    name: '官员财产公示制度',
    status: 'red',
    statusLabel: '未启动',
    isQualitativeSignal: true,
    note:
      '讨论了几十年，始终没有落地。<strong>它是反腐里的「房产税」</strong>——所有人都知道它是治本之策，所有人都知道它推不动。<strong>它一旦启动，才是真正的质变信号。</strong>它直接攻击第二个因子（监督缺口），而这正是十四年来唯一没被触碰的那个。',
  },
  {
    name: '租金面在缩小吗？',
    status: 'red',
    statusLabel: '反在扩大',
    isQualitativeSignal: false,
    note:
      '国家在资源配置中的份额是升是降？<strong>20 万亿城市更新是在扩大租金面。</strong>一边反腐、一边扩面——<strong>那就是在治标。</strong>要真正削减腐败规模，唯一的办法是让市场而非权力配置资源。<strong>而那，又是权力让渡。</strong>',
  },
  {
    name: '容错机制真正落地？',
    status: 'amber',
    statusLabel: '已识别·未见效',
    isQualitativeSignal: false,
    note:
      '官方近年反复提「三个区分开来」、鼓励担当作为——<strong>这说明高层清楚地意识到了「官员躺平」这个副作用。</strong>但这个机制能不能真正让官员敢拍板，<strong>是反腐能否与发展兼容的关键。也是这台机器最大的未解难题。</strong>',
  },
];

export const FAIRNESS_PANEL = {
  title: '必须给的公道话：这台机器不是表演',
  lead: '只讲结构张力，会变成一篇犬儒主义的稿子——而且会失去准确性。这三条都是真实的。',
  cards: [
    {
      title: '代价高昂，不像纯工具',
      body:
        '政治局缩至 <strong>1999 年以来最小规模</strong>，军队高层大面积震荡。' +
        '这对政权稳定与外部形象的损害是实打实的。<strong>若只是权斗，成本效益完全不划算。</strong>',
    },
    {
      title: '它真的建成了一台机器',
      body:
        '2016 年三地试点 → 2018 年监察法 + 国家监委。' +
        '<strong>覆盖面从「党员」扩展到「所有行使公权力的公职人员」</strong>。' +
        '这是一次真实的、深刻的制度建设，<strong>不是运动。</strong>',
    },
    {
      title: '「不查」的代价可能更大',
      body:
        '放任军工、装备、金融的系统性腐败蔓延，' +
        '<strong>侵蚀的是国家能力本身——包括真实的国防能力。</strong>' +
        '从这个角度，这是一次昂贵但必要的止损。',
    },
  ],
  debate:
    '<strong>关于「廉政工具 vs 政治工具」，学界有分歧，而且这个分歧是诚实的。</strong>' +
    '一派认为腐败的定义具有不确定性，反腐容易成为政治工具多过廉政工具；' +
    '另一派认为这体现了清除军队与国防系统腐败的真实决心。<br>' +
    '<strong>本模块的判断：这是一个伪二选一。</strong>' +
    '在租金面巨大、几乎无人完全干净的体制里，<strong>选择性执法是数学必然</strong>。' +
    '当「几乎人人有问题」遇上「只能查一部分人」，<strong>那么「查谁」这个选择本身，就自动带上了政治属性。</strong>' +
    '<strong>这不是主观恶意，是结构的必然产物——你可以同时是真诚的反腐，和事实上的权力重组。这两件事在这套结构里，本就无法分离。</strong>',
};

export const FIFTH_COPY_VERDICT = {
  paragraphs: [
    '<strong>再平衡为什么做不了？</strong>它要求体制把攥在手里的资源和支配权，让渡给分散的家庭。<strong>——权力让渡。</strong>',
    '<strong>东北的营商环境为什么改不了？</strong>它要求地方政府放弃对存量企业的汲取冲动。<strong>——权力让渡。</strong>',
    '<strong>腐败为什么根治不了？</strong>治本之策——独立司法、财产公示、新闻监督——每一样都要求权力接受外部约束。<strong>——仍然是权力让渡。</strong>',
  ],
  kick:
    '十四年，一台机器被真正建成，四百万人次被查处，禁忌一条条被打破。<br>' +
    '<strong>但那个乘积没有变——因为租金面没有缩小，监督缺口没有填上。</strong><br><br>' +
    '<strong>所以这仍然是同一道题：不是这个人不行——是这套结构，把太多值钱的东西，' +
    '交到了一个没人能监督的地方。而它奖励掌管这些东西的人去做的第一件事，' +
    '从来不是把它们还回去。</strong>',
};

export const THREE_FORCES_LINKAGE_RATIONALE =
  '反腐高压削弱官僚体系执行经济改革的意愿与能力——' +
  '这是理解「明明知道药方却推不动」的另一个角度：' +
  '不只是不愿，也可能是这台机器的执行力正处在它自己制造的寒冬里。';

export const MODULE_FOOTER_NOTE =
  '本模块不改变「信号灯」的再平衡读数（反腐属另一条战线），' +
  '但为「三力监测仪」的<strong>内部危机</strong>维供给读数：体制正在同时进行两场消耗极大的手术——' +
  '经济上的（换引擎、修表、抗逆全球化）与政治上的（队伍整肃），<strong>而两者互相干扰。</strong>' +
  '这是理解「为什么明明知道药方却推不动」的另一个角度：<strong>不只是不愿，也可能是这台机器的执行力，' +
  '正处在它自己制造的寒冬里。</strong>';

export const MATERIAL_BOUNDARY =
  '全部读数基于新华社通报、中纪委国家监委公开信息、国务院文件等公开政策文本，' +
  '及可具名引用的学术观点。密度评分为<strong>归一化的结构比较刻度</strong>，用于排序而非精确度量。' +
  '<strong>不含任何匿名信源、内幕爆料或人事推测。</strong>本模块为结构性分析工具，' +
  '不构成对任何个人的判断，亦非投资建议。';

/** 密度刻度着色 */
export function densityColor(d: number): string {
  if (d >= 90) return 'var(--red)';
  if (d >= 65) return 'var(--amber)';
  return 'var(--green)';
}

/** 官场躺平指数 · 向三力「内部危机」维供给读数（0–100） */
export function bureaucraticParalysisIndex(): number {
  const rentAvg = RENT_SOURCES.reduce((a, r) => a + r.surfaceSize, 0) / RENT_SOURCES.length;
  const curesRed = STRUCTURAL_CURES.filter((c) => c.status === 'red').length;
  return Math.round(Math.min(100, rentAvg * 0.55 + curesRed * 12 + 18));
}

/** 模块数据 schema —— 守卫测试用，不得包含 FORBIDDEN 字段 */
export function getModuleSchema(): Record<string, unknown> {
  return {
    asOf: ANTICORRUPTION_AS_OF,
    version: ANTICORRUPTION_VERSION,
    equation: CORRUPTION_DENSITY_EQUATION,
    sectorDensity: SECTOR_DENSITY.map(({ name, rent, gap, density }) => ({
      name,
      rent,
      gap,
      density,
    })),
    rentSources: RENT_SOURCES.map(({ source, officialTerm, surfaceSize, trend }) => ({
      source,
      officialTerm,
      surfaceSize,
      trend,
    })),
    structuralCures: STRUCTURAL_CURES.map(({ name, status, statusLabel }) => ({
      name,
      status,
      statusLabel,
    })),
    bureaucraticParalysisIndex: bureaucraticParalysisIndex(),
  };
}
