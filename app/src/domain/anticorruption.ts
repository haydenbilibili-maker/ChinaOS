/**
 * ChinaOS 模块 07 · 反腐结构观测
 * ---------------------------------------------------------------------------
 * ⚠ 第一设计不变量（不可被「优化」掉）：
 *    本模块不数人头，只数租金面。
 *
 * 核心方程：腐败规模 = 租金面 × 监督缺口
 * 反腐运动两个因子都不打——它打的是租金的「兑现」，不是「供给」。
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

export const ANTICORRUPTION_ROUTE = '/modules/anticorruption';
export const ANTICORRUPTION_AS_OF = AS_OF_BASELINE;

export const MODULE_DISCIPLINE =
  '本模块不数人头，只数租金面。它拒绝成为「落马官员计数器」——人事追踪不可证伪、无预测力，且会把结构分析降级为宫廷剧消费。' +
  '所有读数只来自官方通报措辞与公开政策文本，不含任何高层人事推测。' +
  '在中国的政治语法里，通报措辞是高度程式化、可解码的——它比任何小道消息都可靠。';

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

export const EQUATION_FACTORS = {
  rentSurface: {
    label: '因子一 · 租金面（有多少值钱的东西由权力分配）',
    display: '扩大中',
    arrow: '↑',
    color: 'var(--red)',
    detail:
      '20 万亿城市更新正在铺开一个<strong>全新的工程承揽场</strong>。国家在资源配置中的份额未减反增。',
  },
  monitoringGap: {
    label: '因子二 · 监督缺口（外部约束缺失的程度）',
    display: '未变',
    arrow: '—',
    color: 'var(--red)',
    detail:
      '财产公示、独立司法、新闻监督——<strong>三项治本工具，一项未启动。</strong>内部监督（纪委/巡视/监委）替代外部监督。',
  },
} as const;

export const EQUATION_IMPLICATION = {
  headline: '反腐运动，两个因子一个都不打。',
  body:
    '它打的是租金的<strong>兑现</strong>，不是租金的<strong>供给</strong>。' +
    '抓多少人、级别多高，都不改变这个乘积——<strong>因为它清除的是「已经变现的人」，而不是「可供变现的面」。</strong>' +
    '这就是为什么它在结构上<strong>必须是永远进行时</strong>：只要租金面还在、监督缺口还在，新的变现者就会源源不断地长出来。',
  footnote:
    '<strong>官方其实心知肚明。</strong>布鲁金斯学会的李成观察到：决策层似乎接受了一党体制下以权谋私的必然性，' +
    '所以腐败并不能根除，而是需要不懈地<strong>「压制」</strong>。' +
    '<strong>「压制」而非「根除」——这四个字，是整件事最诚实的表述。</strong>' +
    '它承认：这不是一场可以打赢的战争，而是一台必须永远运转的机器。',
};

/** 三个租金源 —— 直接取自官方通报措辞 */
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
      '讨论了几十年，始终没有落地。<strong>它是反腐里的「房产税」</strong>——所有人都知道它是治本之策，所有人都知道它推不动。<strong>它一旦启动，才是真正的质变信号。</strong>',
  },
  {
    name: '租金面在缩小吗？',
    status: 'red',
    statusLabel: '反在扩大',
    isQualitativeSignal: false,
    note:
      '国家在资源配置中的份额是升是降？<strong>20 万亿城市更新是在扩大租金面。</strong>如果一边反腐、一边扩面——<strong>那就是在治标。</strong>要真正削减腐败规模，唯一的办法是让市场而非权力配置资源。<strong>而那，又是权力让渡。</strong>',
  },
  {
    name: '容错机制真正落地？',
    status: 'amber',
    statusLabel: '已识别·未见效',
    isQualitativeSignal: false,
    note:
      '官方近年反复提「三个区分开来」、鼓励担当作为——<strong>这说明高层清楚地意识到了「官员躺平」这个副作用。</strong>但这个机制能不能真正让官员敢拍板，<strong>是反腐能否与发展兼容的关键。</strong>',
  },
];

export const STRUCTURAL_TENSIONS = [
  {
    id: 'arms-race',
    title: '张力一 · 反腐与刺激，正在军备竞赛',
    paragraphs: [
      '这套体制解决经济问题的本能是<strong>「上项目」</strong>——因为这是它最擅长、最舒适的路。<strong>而「上项目」恰恰是腐败最肥沃的土壤。</strong>于是它必须用越来越强的反腐力度，去对冲自己越来越大的租金面。',
      '<strong>反腐在追赶，刺激在制造。</strong>这是一场结构性的军备竞赛，不是一场可以结束的战役。',
    ],
    loop:
      '经济下行 → 上项目救急（20万亿） → <strong>租金面扩大</strong><br>' +
      '→ 新寻租点涌现 → 反腐加码 → 官员不敢拍板<br>' +
      '→ 项目执行迟滞 → 经济更弱 → <strong>再上项目</strong> ⟳',
  },
  {
    id: 'bureaucratic-paralysis',
    title: '张力二 · 官员也在躺平',
    paragraphs: [
      '高压反腐 + 违规定义宽泛且可终身追溯 = <strong>官员的最优策略是「不作为」。</strong>做事可能出错，出错可能被追责；不做事，不会出错。<strong>理性人会选择「不出事」。</strong>',
      '而「不出事」的行为表现是：不担责、不创新、不拍板、<strong>新官不理旧账</strong>——<strong>这正是第三章诊断「投资不过山海关」时列出的那些症状。</strong>',
    ],
    loop:
      '<strong>年轻人退出的方式，叫躺平。</strong><br>' +
      '<strong>官员退出的方式，叫「多做多错，不如不做」。</strong><br>' +
      '— 同一种机制：当风险远大于回报，理性人退出 —',
  },
] as const;

export const FAIRNESS_PANEL = {
  title: '必须给的公道话：反腐不是表演',
  lead: '只讲结构张力，会变成一篇犬儒主义的稿子。所以必须把另一面摆足——而且这三条都是真实的。',
  cards: [
    {
      title: '代价高昂，不像工具',
      body:
        '纯粹的「政治工具」论解释不了为什么要付出如此高的成本——<strong>政治局缩至 1999 年以来最小规模</strong>，军队高层大面积震荡。' +
        '这个代价对政权稳定与外部形象的损害是实打实的。<strong>若只是权斗，成本效益完全不划算。</strong>',
    },
    {
      title: '它确实改变了一些东西',
      body:
        '公款吃喝、楼堂馆所、三公经费这些<strong>「看得见的腐败」确实被大幅压制</strong>。基层办事体验在很多地方是改善的。<strong>这不是虚构的。</strong>',
    },
    {
      title: '「不查」的代价可能更大',
      body:
        '放任军工、装备、金融系统的系统性腐败蔓延，<strong>侵蚀的是国家能力本身——包括真实的国防能力。</strong>从这个角度，反腐是一次昂贵但必要的止损。',
    },
  ],
  debate:
    '<strong>关于「廉政工具 vs 政治工具」，学界有分歧，而且这个分歧是诚实的。</strong>' +
    '一派认为腐败的定义具有不确定性，反腐容易成为政治工具多过廉政工具；' +
    '另一派认为这体现了清除军队与国防系统腐败的决心。<br>' +
    '<strong>本模块的判断：这是一个伪二选一。</strong>' +
    '在一个租金面巨大、几乎无人完全干净的体制里，<strong>「选择性执法」是一个数学必然</strong>——' +
    '因为执法能力有限，而违规普遍。当「几乎人人有问题」遇上「只能查一部分人」，' +
    '<strong>那么「查谁」这个选择本身，就自动带上了政治属性。</strong>' +
    '这不是谁的主观恶意，<strong>这是结构的必然产物</strong>——你可以同时是真诚的反腐，和事实上的权力重组。',
};

export const FIFTH_COPY_VERDICT = {
  paragraphs: [
    '<strong>再平衡为什么做不了？</strong>因为它要求体制把攥在手里的资源和支配权，让渡给分散的家庭。<strong>——这是权力让渡。</strong>',
    '<strong>东北的营商环境为什么改不了？</strong>因为它要求地方政府放弃对存量企业的汲取冲动。<strong>——这也是权力让渡。</strong>',
    '<strong>腐败为什么根治不了？</strong>因为治本之策——独立司法、财产公示、新闻监督——每一样都要求权力接受外部约束。<strong>——这仍然是权力让渡。</strong>',
  ],
  kick:
    '马兴瑞的通报里写着：他把「干部选拔、工程承揽、企业经营」变现了。<br>' +
    '但这三样之所以能变现，是因为<strong>它们本来就掌握在权力手里，而不是在市场手里。</strong><br><br>' +
    '<strong>所以这仍然是同一道题：不是这个人不行——是这套结构，把太多值钱的东西，' +
    '交到了一个没人能监督的地方。而它奖励掌管这些东西的人去做的第一件事，' +
    '从来不是把它们还回去。</strong>',
};

export const THREE_FORCES_LINKAGE_RATIONALE =
  '反腐高压削弱官僚体系执行经济改革的意愿与能力——' +
  '这是理解「明明知道药方却推不动」的另一个角度：' +
  '不只是不愿，也可能是这台机器的执行力正处在它自己制造的寒冬里。';

export const MODULE_FOOTER_NOTE =
  '本模块不改变「信号灯」读数（反腐属另一条战线），但为「三力监测仪」的<strong>内部危机</strong>维提供读数：' +
  '它揭示体制正在同时进行两场消耗极大的手术——经济上的（换引擎、修表、抗逆全球化）与政治上的（队伍整肃），<strong>而两者互相干扰</strong>：' +
  '反腐的高压会削弱官僚体系执行经济改革的意愿与能力。' +
  '这是理解「为什么明明知道药方却推不动」的另一个角度——<strong>不只是不愿，也可能是这台机器的执行力，正处在它自己制造的寒冬里。</strong>';

export const MATERIAL_BOUNDARY =
  '全部读数基于新华社通报、国务院文件等公开政策文本，及可具名引用的学术观点。' +
  '<strong>不含任何匿名信源、内幕爆料或高层人事推测</strong>——那类叙事不可证伪，因而不是分析工具。' +
  '本模块为结构性分析工具，非投资建议，亦不构成对任何个人的判断。';

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
    equation: CORRUPTION_EQUATION,
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
