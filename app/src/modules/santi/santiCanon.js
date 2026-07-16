/**
 * 三体透镜 · 概念母本（R1 光谱 · R2 文明博弈 · R3 国家/治理编排）
 * 字段契约对齐 docs/santi 架构方案 §4.4
 * 禁止裸类比：每张 full 卡必须有 criticalDiffs
 */

export const DIMS = [
  { key: 'C', label: '文明博弈', short: 'C' },
  { key: 'N', label: '国家竞争', short: 'N' },
  { key: 'G', label: '社会治理', short: 'G' },
  { key: 'S', label: '自我探索', short: 'S' },
];

export const WORKS = [
  { key: 'threebody', label: '《三体》三部曲' },
  { key: 'wandering', label: '《流浪地球》' },
  { key: 'supernova', label: '《超新星纪元》' },
];

/** @typedef {'full'|'index'} Maturity */

/**
 * @type {Array<{
 *   id: string, title: string, work: string, workKey: string, oneLiner: string,
 *   preconditions: string[], dims: string[],
 *   similarMechanisms: Array<{ text: string, to?: string }>,
 *   criticalDiffs: string[],
 *   ledger: { realized: string, open: string, caution: string },
 *   sourcesNote: string, uncertainty?: boolean, maturity?: Maturity,
 *   crossLinks?: string[], indexNote?: string
 * }>}
 */
export const CANON = [
  {
    id: 'ST-01',
    title: '宇宙社会学公理',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '生存是文明第一需要；文明持续增长而宇宙物质总量有限——在此前提下导出猜疑链与技术爆炸。',
    preconditions: ['生存优先于其他价值', '资源在可观测尺度上有限', '文明无法先验确认对方善意'],
    dims: ['C'],
    similarMechanisms: [
      { text: '国际关系现实主义的无政府假定：无超主权仲裁者时，自助与相对收益敏感。', to: '/realism' },
      { text: '安全困境：防御措施被解读为进攻准备，螺旋升级。', to: '/thucydides' },
    ],
    criticalDiffs: [
      '公理是思想实验前提，非实证社会科学定律；现实存在沟通、制度、多边约束与经济相互依赖。',
      '人类国家共享生物基底与可验证历史；小说中的「文明」可跨物种、跨尺度，信息不对称更极端。',
    ],
    ledger: {
      realized: '作为「极端无政府」对照透镜，可澄清安全困境的边界条件',
      open: '多极核禁忌与深度相互依赖是否系统性削弱猜疑链',
      caution: '勿把公理当政策处方或「证明」某国必然先发',
    },
    sourcesNote: '《三体》· 叶文洁向三体世界陈述的宇宙社会学两条公理（机制概括，非原文照录）',
    crossLinks: ['realism', 'thucydides', 'gametheory'],
  },
  {
    id: 'ST-02',
    title: '黑暗森林',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '在猜疑链与技术爆炸叠加下，暴露坐标近似被清除；策略倾向先发制人的沉默与隐蔽。',
    preconditions: ['公理成立', '技术代差可在短窗口内翻转', '无法可靠验证对方意图'],
    dims: ['C', 'N'],
    similarMechanisms: [
      { text: '军备竞赛与先发优势叙事：窗口期焦虑驱动前置打击想象。', to: '/deterrence' },
      { text: '猜疑链与囚徒困境结构相近：合作需可信沟通与重复博弈。', to: '/gametheory' },
    ],
    criticalDiffs: [
      '主权国家体系有外交、核禁忌、同盟与经济相互依赖；「清除」成本与小说极端设定不可平移。',
      '现实接触多为渐进、可否认、可谈判；坐标暴露≠立即灭绝级打击。',
    ],
    ledger: {
      realized: '把「沉默/暴露」做成可讨论的策略原型坐标系',
      open: '深空探测与 SETI 政策是否需「黑暗森林」式风险框架',
      caution: '禁止用黑暗森林直接套裁台海或双边关系结论',
    },
    sourcesNote: '《三体II·黑暗森林》· 罗辑对宇宙社会学的策略推论（机制层）',
    crossLinks: ['deterrence', 'gametheory', 'straits'],
  },
  {
    id: 'ST-03',
    title: '技术爆炸',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '后发文明可在短历史窗口内跃迁技术代差，改写既有博弈均衡。',
    preconditions: ['基础科学路径可加速收敛', '吸收与迭代不受绝对锁死'],
    dims: ['C', 'N'],
    similarMechanisms: [
      { text: '后发追赶与跨越式发展叙事：产业政策压缩学习曲线。', to: '/npf' },
      { text: '关键技术节点突破改变军事与经贸议价权。', to: '/techtree' },
    ],
    criticalDiffs: [
      '现实技术扩散受资本、人才、供应链、标准与制度摩擦约束，罕有「瞬时代差」。',
      '爆炸隐喻强调非线性；现实多为局部领域 generational gap，而非全谱碾压。',
    ],
    ledger: {
      realized: '解释「为何窗口期焦虑」比解释「必然爆炸」更有用',
      open: 'AI/半导体等局部跃迁是否足以改写战略均衡',
      caution: '勿把小说时间尺度直接映射到五年规划口号',
    },
    sourcesNote: '《三体》系列对技术代差与文明竞争的设定概括',
    crossLinks: ['techtree', 'npf', 'semiconductor'],
  },
  {
    id: 'ST-04',
    title: '智子锁死',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '用超技术手段冻结对手基础物理前沿，使其「看得见、做不出」。',
    preconditions: ['可干预对手科研基础设施或信息环境', '锁死成本低于正面对抗'],
    dims: ['N', 'G'],
    similarMechanisms: [
      { text: '出口管制、实体清单与标准锁定的组合拳。', to: '/semiconductor' },
      { text: '人才断流、仪器禁运与开源生态切割。', to: '/techtree' },
    ],
    criticalDiffs: [
      '现实对应是政策与供应链组合，而非字面微观粒子干预；可逆性与泄露路径不同。',
      '锁死往往不完整：平行路径、第三方转口与基础研究冗余仍存在。',
    ],
    ledger: {
      realized: '「看得见做不出」成为讨论技术遏制的可用隐喻',
      open: '管制强度与反制创新的均衡点',
      caution: '勿把隐喻坐实为某次未公开科技阴谋',
    },
    sourcesNote: '《三体》· 智子对地球基础物理的压制设定（机制概括）',
    crossLinks: ['semiconductor', 'techtree', 'npf'],
  },
  {
    id: 'ST-05',
    title: '面壁者 / 破壁者',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '在全透明监视下，以不可观测的战略欺骗保留威慑与突袭空间；对手专职识破。',
    preconditions: ['战略意图高度可观测', '欺骗本身成为稀缺资源'],
    dims: ['N', 'G', 'S'],
    similarMechanisms: [
      { text: '情报对抗与战略模糊：保留选项价值。', to: '/deterrence' },
      { text: '委托代理下的信息不对称：代理人隐瞒真实偏好。', to: '/principalagent' },
    ],
    criticalDiffs: [
      '现实情报对抗受法律、舆论、官僚与联盟约束；「一人隐瞒全世界」不可直接类比。',
      '破壁是专职对手；现实中识破能力分散在多机构与公开分析层。',
    ],
    ledger: {
      realized: '把「透明时代如何保留战略欺骗」问题化',
      open: '数字监控与开源情报是否系统性削弱面壁空间',
      caution: '禁止用面壁情节臆造现实权力内幕',
    },
    sourcesNote: '《三体II·黑暗森林》· 面壁计划设定（机制层，情节最小上下文）',
    crossLinks: ['deterrence', 'principalagent', 'powerlogic'],
  },
  {
    id: 'ST-06',
    title: '威慑纪元 / 执剑人',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '相互摧毁能力下，把按钮交给可信执行者；威慑稳态依赖心理与制度设计。',
    preconditions: ['双方具备相互摧毁能力', '执行者可信度被对方纳入计算'],
    dims: ['C', 'N', 'S'],
    similarMechanisms: [
      { text: '可信承诺、二次打击与指挥控制链。', to: '/deterrence' },
      { text: '边缘政策与 MAD 稳态的制度条件。', to: '/gametheory' },
    ],
    criticalDiffs: [
      '小说执剑人是极端人格化；现实是指挥链、法理授权、多重校验与文官控制。',
      '人格特质可讨论，但不得替代制度分析或暗示某现实人物即执剑人。',
    ],
    ledger: {
      realized: '与威慑战略模块形成显式对照入口',
      open: '自动化指挥与 AI 辅助决策如何改写「执剑」可信度',
      caution: '慎用人格化叙事解释国家核政策',
    },
    sourcesNote: '《三体III·死神永生》· 威慑纪元与执剑人设定（机制概括）',
    crossLinks: ['deterrence', 'gametheory', 'military'],
  },
  {
    id: 'ST-07',
    title: '水滴',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '以绝对技术代差实现单向透明的摧毁工具，使数量优势与勇气失效。',
    preconditions: ['材料/物理代差接近绝对', '对手无法有效反制'],
    dims: ['C', 'N'],
    similarMechanisms: [
      { text: '局部领域世代差武器或平台对旧体系的降维压制。', to: '/military' },
      { text: '非对称技术突然改变海空拒止成本结构。', to: '/straits' },
    ],
    criticalDiffs: [
      '现实罕有绝对代差；更常见是局部优势与反制螺旋。',
      '「数量无效」在小说中成立；现实仍受后勤、政治与升级风险约束。',
    ],
    ledger: {
      realized: '提醒「勇气叙事」不能替代技术代差核算',
      open: '高超、无人与定向能等是否构成局部「水滴感」',
      caution: '禁止猎奇化军事同人细节替代机制分析',
    },
    sourcesNote: '《三体II·黑暗森林》· 水滴探测体设定（机制层）',
    crossLinks: ['military', 'straits', 'techtree'],
  },
  {
    id: 'ST-08',
    title: '降维打击',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '改变对手所处的规则空间或生态位，使既有优势在新坐标下归零。',
    preconditions: ['可改写对手赖以取胜的规则/维度', '改写成本低于正面对抗'],
    dims: ['C', 'N'],
    similarMechanisms: [
      { text: '标准战、规则战与议程设置：改变博弈收益矩阵本身。', to: '/diplomacy' },
      { text: '生态位挤压：用新平台使旧优势资产搁浅。', to: '/gametheory' },
    ],
    criticalDiffs: [
      '隐喻可用于标准与规则；禁止字面物理降维臆造或当作科学事实。',
      '现实规则战可逆、可谈判、受多边机构约束；小说装置近乎不可逆。',
    ],
    ledger: {
      realized: '「改规则比拼实力」成为可对照话术',
      open: '数字标准与金融基础设施是否构成可持续降维工具',
      caution: '二向箔等极端意象仅作附录，避免猎奇堆设定',
    },
    sourcesNote: '《三体III·死神永生》· 降维相关设定的机制抽象（含二向箔意象）',
    crossLinks: ['diplomacy', 'gametheory', 'offshore'],
  },
  {
    id: 'ST-09',
    title: '思想钢印',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '在认知底层植入不可证伪的信念，锁定群体行为边界与可选策略集。',
    preconditions: ['信念可在关键决策层固化', '证伪通道被切断或污名化'],
    dims: ['G', 'S'],
    similarMechanisms: [
      { text: '宣传、教育与算法推荐对认知边界的塑造。', to: '/powerlogic' },
      { text: '语义防火墙与舆情闭环压缩可讨论空间。', to: '/digitalGiantWeb' },
    ],
    criticalDiffs: [
      '现实不存在「物理钢印」；信息源多元、可逆性与异议渠道仍是关键差异。',
      '钢印是一次性底层写入；现实认知操控是概率性、可衰减的。',
    ],
    ledger: {
      realized: '把「不可讨论前提」显式标出，便于与权力逻辑对照',
      open: '推荐算法是否逼近「准钢印」效应',
      caution: '禁止用钢印情节断言某群体已被物理洗脑',
    },
    sourcesNote: '《三体II·黑暗森林》· 思想钢印设定（机制概括）',
    crossLinks: ['powerlogic', 'digitalGiantWeb', 'yishixingtai'],
  },
  {
    id: 'ST-10',
    title: '阶梯计划',
    work: '《三体》',
    workKey: 'threebody',
    oneLiner: '用极低概率、极高杠杆的非常规方案对冲文明级尾部风险。',
    preconditions: ['常规路径预期失败', '存在可承受的极端赌注窗口'],
    dims: ['C', 'N', 'S'],
    similarMechanisms: [
      { text: '战略期权与黑天鹅对冲：小概率高影响备选方案。', to: '/antifragile' },
      { text: '超级工程与非常规技术路线的政治可行性核算。', to: '/megaprojects' },
    ],
    criticalDiffs: [
      '现实战略受预算、问责、联盟与国内政治约束；「赌国运」须放入成本收益框。',
      '小说允许文明存续级赌注；现实决策者通常优化可辩护的中间方案。',
    ],
    ledger: {
      realized: '把尾部风险对冲从口号变成可讨论的方案谱系',
      open: '哪些技术路线属于真实期权而非叙事安慰剂',
      caution: '勿美化不计成本的孤注一掷',
    },
    sourcesNote: '《三体II·黑暗森林》· 阶梯计划设定（机制层）',
    crossLinks: ['antifragile', 'megaprojects', 'sandbox'],
  },
  {
    id: 'ST-20',
    title: '太阳危机',
    work: '《流浪地球》',
    workKey: 'wandering',
    oneLiner: '生存环境突发不可逆恶化，倒逼文明级迁移或改造决策。',
    preconditions: ['危机被广泛认知为不可逆', '时间窗口可被社会动员感知'],
    dims: ['C', 'G'],
    similarMechanisms: [
      { text: '气候与能源转型中的长尾风险叙事。', to: '/energy' },
      { text: '大安全观下的系统性生存冗余。', to: '/omnisecurity' },
    ],
    criticalDiffs: [
      '现实气候/能源危机多为渐进+不确定，非单一末日倒计时；决策窗口更碎、更政治化。',
      '小说危机物理上明确；现实科学争议、贴现率与代际分配主导争论。',
    ],
    ledger: {
      realized: '对照「渐进危机」与「倒计时危机」的动员逻辑差异',
      open: '临界点叙事是否改善还是扭曲政策贴现',
      caution: '勿用末日倒计时简化复杂气候政策权衡',
    },
    sourcesNote: '《流浪地球》（小说）· 太阳危机设定概括',
    crossLinks: ['energy', 'omnisecurity', 'ecology'],
  },
  {
    id: 'ST-22',
    title: '行星发动机 / 领航员',
    work: '《流浪地球》',
    workKey: 'wandering',
    oneLiner: '超大规模工程与极少数关键岗位，对系统存续形成不成比例的杠杆。',
    preconditions: ['系统高度耦合', '关键节点失败不可替代'],
    dims: ['N', 'G', 'S'],
    similarMechanisms: [
      { text: '超级工程与国家能力账本：规模动员与失败冗余。', to: '/megaprojects' },
      { text: '治国沙盒中的关键岗位配置与情景压力测试。', to: '/sandbox' },
    ],
    criticalDiffs: [
      '现实工程有失败冗余、科层备份与保险机制，非单一英雄岗位。',
      '领航员伦理是文学装置；现实关键岗位嵌入制度与问责链。',
    ],
    ledger: {
      realized: '突出「关键岗位杠杆」与系统冗余的对照',
      open: '数字化关键基础设施是否提高单点失败敏感度',
      caution: '避免英雄史观替代制度能力分析',
    },
    sourcesNote: '《流浪地球》· 行星发动机与领航相关设定（机制概括）',
    crossLinks: ['megaprojects', 'sandbox', 'infrastructure'],
  },
  {
    id: 'ST-23',
    title: '绝对主义集体动员',
    work: '《流浪地球》',
    workKey: 'wandering',
    oneLiner: '存续目标压倒个体权利与短期福利的动员体制——仅作机制对照，禁止口号化。',
    preconditions: ['生存目标被定义为压倒性', '异议成本极高', '动员可持续性被假定'],
    dims: ['G', 'S'],
    similarMechanisms: [
      { text: '战时动员与压力型体制的极限形态（仅机制对照）。', to: '/powerlogic' },
      { text: '沙盒中的动员疲劳、合法性损耗与国家能力边界。', to: '/sandbox' },
    ],
    criticalDiffs: [
      '小说是物理存续二分；现实多为风险分配、程序正义与可持续合法性权衡——不可平移为「应该如何治理」。',
      '强制成本栏：动员抬高短期执行力，同时消耗信任库存、代际公平与纠错通道；美化或妖魔化任一现实制度均不合格。',
    ],
    ledger: {
      realized: '把「动员收益 vs 合法性/疲劳成本」做成可对照台账字段（受控深描）',
      open: '动员疲劳曲线与合法性损耗如何在公开指标中近似观测',
      caution: '高敏感：仅机制对照，禁止口号化、煽情与阴谋论臆造',
    },
    sourcesNote: '《流浪地球》相关动员设定 · Round 3 受控深描（机制层，非制度辩护）',
    maturity: 'full',
    costNote:
      '动员成本栏：执行力↑ · 异议与纠错通道↓ · 疲劳与信任损耗累积 · 退出成本上升。任何现实映射必须同时写出收益与成本，缺一不成立。',
    crossLinks: ['powerlogic', 'sandbox', 'yishixingtai'],
  },
  {
    id: 'ST-30',
    title: '儿童政权',
    work: '《超新星纪元》',
    workKey: 'supernova',
    oneLiner: '成年世代突然退出后，规则与心智未成熟群体接管国家机器。',
    preconditions: ['过渡制度缺失', '专业官僚缓冲被抽空'],
    dims: ['G', 'S'],
    similarMechanisms: [
      { text: '代际权力、财富与叙事权的非平滑转移想象。', to: '/demographic' },
      { text: '数字原住民执政与制度学习曲线问题。', to: '/education' },
    ],
    criticalDiffs: [
      '现实有过渡制度、专业官僚与法律缓冲；小说是真空实验。',
      '聚焦「制度缓冲缺失」机制，避免年龄歧视或煽情道德评判。',
    ],
    ledger: {
      realized: '把代际交接从情绪话题拉回制度缓冲问题',
      open: '数字原住民执政是否改变合法性叙事结构',
      caution: '禁止「一代不如一代」式道德裁决',
    },
    sourcesNote: '《超新星纪元》· 儿童政权设定（机制概括）',
    crossLinks: ['demographic', 'education', 'governance'],
  },
];

export const METHOD_STEPS = [
  {
    key: 'extract',
    title: '概念提纯',
    en: 'Extract',
    body: '去掉情节与人物，留下可陈述的机制命题（一句话 + 前提条件）。',
  },
  {
    key: 'abstract',
    title: '机制抽象',
    en: 'Abstract',
    body: '标明主体、信息结构、成本函数与均衡形态——可用简单因果链，不作伪数学炫耀。',
  },
  {
    key: 'mirror',
    title: '现实对照',
    en: 'Mirror',
    body: '强制双栏：相似机制（何种结构产生相近激励）与关键差异（尺度、制度、技术、伦理、可逆性）。',
  },
  {
    key: 'ledger',
    title: '台账判定',
    en: 'Ledger',
    body: '对该透镜的解释力做显式判定：已兑现 · 未决 · 慎用（过度外推已被指出）。',
  },
];

export const MODULE_META = {
  id: 'santi',
  title: '三体总论',
  subtitle: '文明透镜 · 机制映射 · 思想实验',
  version: '0.3.0-r3',
  asOf: '2026-07',
};

/**
 * 图 A 象限 → 光谱卡 id（点选联动）
 * q1 先发沉默 · q2 可控威慑 · q3 重复博弈 · q4 脆弱均衡
 */
export const QUAD_TO_CARDS = {
  q1: ['ST-02', 'ST-03'],
  q2: ['ST-06', 'ST-03'],
  q3: ['ST-01'],
  q4: ['ST-01', 'ST-02'],
};

/**
 * 文明博弈因果主链 + 降维/锁死旁支（Round 2）
 * role: main | branch
 */
export const CIV_CHAIN = [
  {
    id: 'ST-01',
    role: 'main',
    edge: '前提',
    edgeTo: 'ST-02',
    abstract: '两条公理压缩信息不对称与资源竞争，导出猜疑链与技术爆炸的逻辑空间。',
  },
  {
    id: 'ST-02',
    role: 'main',
    edge: '导出策略',
    edgeTo: 'ST-03',
    abstract: '在猜疑链成立时，暴露坐标近似被清除；最优策略倾向沉默与先发期权。',
  },
  {
    id: 'ST-03',
    role: 'main',
    edge: null,
    edgeTo: null,
    abstract: '后发文明可在短窗口内跃迁代差，使「等待验证善意」的成本急剧上升。',
  },
  {
    id: 'ST-04',
    role: 'branch',
    branchOf: 'ST-03',
    branchLabel: '锁死旁支',
    abstract: '用超技术手段冻结对手基础前沿——「看得见、做不出」，打断技术爆炸路径。',
  },
  {
    id: 'ST-07',
    role: 'branch',
    branchOf: 'ST-03',
    branchLabel: '降维旁支',
    abstract: '绝对技术代差下的单向摧毁工具，使数量与勇气失效——局部 generational gap 的极端意象。',
  },
];

/**
 * 文明博弈台账样例（Round 2 · 非单卡 ledger，跨概念主题）
 * status: realized | in_progress | open
 */
export const CIV_LEDGERS = [
  {
    id: 'CL-01',
    title: '威慑稳定性',
    status: 'realized',
    statusLabel: '已兑现',
    thesis: '相互摧毁能力下，稳态依赖「可信承诺」而非人格化执剑；三体透镜可澄清人格化叙事的边界。',
    similarMechanisms: [
      { text: '核威慑与相互确保摧毁：第二次打击能力支撑禁忌。', to: '/deterrence' },
      { text: '可信承诺与边缘政策：重复博弈中的声誉与红线。', to: '/gametheory' },
    ],
    criticalDiffs: [
      '小说执剑人是极端人格化单点；现实是指挥链、法理授权与多重校验。',
      '现实威慑嵌入同盟、经济相互依赖与国内政治约束，非真空二人博弈。',
    ],
    linkedCards: ['ST-06', 'ST-02'],
  },
  {
    id: 'CL-02',
    title: '猜疑链治理',
    status: 'in_progress',
    statusLabel: '进行中',
    thesis: '降低误判的制度与沟通渠道可压低猜疑链强度——但无法用「信任教育」单独消解结构激励。',
    similarMechanisms: [
      { text: '安全困境：防御被解读为进攻准备，螺旋升级。', to: '/thucydides' },
      { text: '热线、军演通报、核查机制：压缩信息不对称。', to: '/diplomacy' },
    ],
    criticalDiffs: [
      '修昔底德叙事强调权力转移窗口；三体透镜强调极端信息不可验证——适用边界不同。',
      '现实有第三方、多边制度与商业纽带；小说设定接近零沟通、零仲裁。',
    ],
    linkedCards: ['ST-01', 'ST-02'],
  },
  {
    id: 'CL-03',
    title: '技术扩散速度',
    status: 'open',
    statusLabel: '未决',
    thesis: '局部领域 generational gap 是否足以改写战略均衡，仍属开放经验问题；「技术爆炸」是窗口焦虑透镜，非预测公式。',
    similarMechanisms: [
      { text: '后发追赶与关键节点突破改变议价权。', to: '/techtree' },
      { text: '出口管制与标准锁定试图打断扩散路径。', to: '/semiconductor' },
    ],
    criticalDiffs: [
      '现实扩散受资本、人才、供应链与制度摩擦约束，罕有瞬时代差。',
      '智子式「绝对锁死」不存在；管制往往不完整，平行路径与转口仍在。',
    ],
    linkedCards: ['ST-03', 'ST-04', 'ST-07'],
  },
];

/**
 * 与修昔底德 / 博弈论的显式划界（Round 2）
 */
export const LENS_BOUNDARIES = [
  {
    id: 'santi',
    label: '三体透镜',
    oneLiner: '极端思想实验：把猜疑链与技术爆炸推到极限，压成可对照台账。',
    appliesWhen: '需要澄清「若沟通与仲裁接近为零」时的策略空间与误用边界。',
    notFor: '直接开政策处方，或用情节坐实现实未公开权力斗争。',
    to: null,
  },
  {
    id: 'thucydides',
    label: '修昔底德叙事',
    oneLiner: '权力转移窗口下的结构性摩擦与战争风险叙事。',
    appliesWhen: '讨论崛起国—守成国实力对比、窗口焦虑与可规避路径。',
    notFor: '跨物种/跨尺度文明接触，或「暴露即清除」的宇宙社会学推论。',
    diffVsSanti: '修昔底德谈的是人类国家体系内的实力转移；三体透镜谈的是极端信息不对称下的接触策略。',
    to: '/thucydides',
  },
  {
    id: 'gametheory',
    label: '经典博弈论工具箱',
    oneLiner: '形式化激励结构：囚徒困境、重复博弈、边缘策略与均衡求解。',
    appliesWhen: '需要可计算的策略互动模型、以牙还牙与可信承诺机制设计。',
    notFor: '替代经验史与制度细节；也不等于黑暗森林「先发沉默」的规范结论。',
    diffVsSanti: '博弈论提供通用工具；三体透镜提供极端边界条件与叙事压缩——可对照，不合并。',
    to: '/gametheory',
  },
];

/**
 * 图 C · 威慑执剑剖面节点（抽象承诺链，非人物立绘）
 * 点选 → 联动光谱卡
 */
export const SWORD_NODES = [
  {
    id: 'cap',
    label: '相互摧毁能力',
    sub: '物理底座',
    tip: '双方具备不可接受损伤能力——威慑的物质前提。联动 ST-06 · ST-07。',
    cards: ['ST-06', 'ST-07'],
    x: 0.12,
    y: 0.55,
  },
  {
    id: 'detect',
    label: '探测与校验',
    sub: '信息层',
    tip: '能否确认对方能力与意图，决定边缘空间。联动 ST-05 · ST-04。',
    cards: ['ST-05', 'ST-04'],
    x: 0.32,
    y: 0.32,
  },
  {
    id: 'auth',
    label: '授权与指挥链',
    sub: '制度层',
    tip: '谁有权按下、如何校验——现实威慑的法理核心。联动 ST-06。',
    cards: ['ST-06'],
    x: 0.52,
    y: 0.28,
  },
  {
    id: 'sword',
    label: '执剑节点',
    sub: '执行层',
    tip: '小说人格化执剑；现实是多重校验下的执行席位。联动 ST-06 · ST-05。',
    cards: ['ST-06', 'ST-05'],
    x: 0.72,
    y: 0.48,
  },
  {
    id: 'epoch',
    label: '威慑纪元稳态',
    sub: '均衡输出',
    tip: '能力×决心×可信度的暂时均衡；脆弱于代差与破壁。联动 ST-06 · ST-07 · ST-04。',
    cards: ['ST-06', 'ST-07', 'ST-04'],
    x: 0.88,
    y: 0.62,
  },
];

/**
 * 国家竞争因果链（Round 3）
 * ST-04 锁死 → ST-05 面壁 → ST-06 执剑 → ST-07 水滴
 */
export const STATE_CHAIN = [
  {
    id: 'ST-04',
    role: 'main',
    edge: '压制前沿',
    edgeTo: 'ST-05',
    abstract: '冻结对手基础前沿——「看得见、做不出」，改写技术爆炸路径。',
  },
  {
    id: 'ST-05',
    role: 'main',
    edge: '保留欺骗',
    edgeTo: 'ST-06',
    abstract: '全透明监视下，战略欺骗成为稀缺资源；破壁专职识破。',
  },
  {
    id: 'ST-06',
    role: 'main',
    edge: '稳态执剑',
    edgeTo: 'ST-07',
    abstract: '相互摧毁下把按钮交给可信执行者；稳态依赖制度与心理。',
  },
  {
    id: 'ST-07',
    role: 'main',
    edge: null,
    edgeTo: null,
    abstract: '绝对代差工具使数量与勇气失效——不对称降维的极端意象。',
  },
];

/**
 * 国家层台账（Round 3 · 强制双栏）
 */
export const STATE_LEDGERS = [
  {
    id: 'NL-01',
    title: '技术封锁 / 锁死',
    status: 'in_progress',
    statusLabel: '进行中',
    thesis: '出口管制与标准锁定可逼近「看得见做不出」；完整智子式锁死不存在，平行路径与转口始终在。',
    similarMechanisms: [
      { text: '实体清单、设备禁运与人才断流的组合拳。', to: '/semiconductor' },
      { text: '科技树关键节点被切断后的追赶成本上升。', to: '/techtree' },
    ],
    criticalDiffs: [
      '现实是政策与供应链组合，非字面微观干预；可逆性、泄露与第三方转口路径不同。',
      '锁死往往不完整：基础研究冗余与替代路线仍可缓慢绕行。',
    ],
    linkedCards: ['ST-04', 'ST-03'],
  },
  {
    id: 'NL-02',
    title: '战略模糊与面壁',
    status: 'realized',
    statusLabel: '已兑现',
    thesis: '透明时代保留选项价值依赖信息不对称；「一人隐瞒全世界」不可类比，但战略模糊仍是国家层常见工具。',
    similarMechanisms: [
      { text: '威慑中的战略模糊与二次打击可信度设计。', to: '/deterrence' },
      { text: '情报对抗与开源情报压缩面壁空间。', to: '/military' },
    ],
    criticalDiffs: [
      '现实受法律、舆论、官僚与联盟约束；小说面壁是极端单点欺骗。',
      '破壁能力分散在多机构与公开分析层，非单一专职对手。',
    ],
    linkedCards: ['ST-05', 'ST-06'],
  },
  {
    id: 'NL-03',
    title: '不对称降维打击',
    status: 'open',
    statusLabel: '未决',
    thesis: '局部 generational gap 可改变拒止成本；「绝对水滴」罕见——勇气叙事不能替代代差核算，亦不能外推为战场剧本。',
    similarMechanisms: [
      { text: '局部领域世代差平台对旧体系的压制。', to: '/military' },
      { text: '非对称技术改变海空拒止成本结构（仅机制层）。', to: '/straits' },
    ],
    criticalDiffs: [
      '现实罕有绝对代差；更常见是优势—反制螺旋与升级风险。',
      '禁止用小说情节套裁台海或任何具体战场推演。',
    ],
    linkedCards: ['ST-07', 'ST-08'],
  },
  {
    id: 'NL-04',
    title: '威慑可信度',
    status: 'realized',
    statusLabel: '已兑现',
    thesis: '威慑稳态 = 能力 × 决心 × 可信度；三体透镜澄清人格化执剑的边界，交叉威慑战略模块。',
    similarMechanisms: [
      { text: '相互确保摧毁、指挥控制与文官控制。', to: '/deterrence' },
      { text: '边缘政策与红线声誉的重复博弈条件。', to: '/gametheory' },
    ],
    criticalDiffs: [
      '小说执剑人是极端人格化单点；现实是指挥链、法理授权与多重校验。',
      '不得暗示任何现实人物即「执剑人」。',
    ],
    linkedCards: ['ST-06', 'ST-05'],
  },
];

/** 国家竞争深链（划界一句） */
export const STATE_XLINKS = [
  {
    to: '/deterrence',
    label: '威慑战略',
    note: '执剑人 ↔ 可信承诺与指挥链——人格化 vs 法理链。',
  },
  {
    to: '/straits',
    label: '台海局势',
    note: '仅机制层对照水滴/拒止意象，禁止情节套裁战场。',
  },
  {
    to: '/military',
    label: '军事力量',
    note: '代差与能力底座可对照；≠ 同人战术复盘。',
  },
];

/**
 * 社会治理编排节点（Round 3）
 */
export const GOV_CHAIN = [
  {
    id: 'ST-09',
    role: 'main',
    edge: '锁定认知',
    edgeTo: 'ST-30',
    abstract: '不可证伪信念压缩可选策略集——认知边界即治理边界。',
  },
  {
    id: 'ST-30',
    role: 'main',
    edge: '代际真空',
    edgeTo: 'ST-20',
    abstract: '制度缓冲被抽空时，未成熟规则接管国家机器——聚焦缓冲缺失。',
  },
  {
    id: 'ST-20',
    role: 'main',
    edge: '危机动员',
    edgeTo: 'ST-22',
    abstract: '生存环境恶化倒逼文明级决策；现实多为渐进+不确定。',
  },
  {
    id: 'ST-22',
    role: 'main',
    edge: '工程杠杆',
    edgeTo: 'ST-23',
    abstract: '超大规模工程与关键岗位对系统存续的不成比例杠杆。',
  },
  {
    id: 'ST-23',
    role: 'main',
    edge: null,
    edgeTo: null,
    abstract: '存续目标压倒短期福利的动员极限——强制成本栏，受控深描。',
    sensitive: true,
  },
];

/**
 * 治理台账（Round 3 · 强制双栏；ST-23 相关含成本意识）
 */
export const GOV_LEDGERS = [
  {
    id: 'GL-01',
    title: '代际权力交接',
    status: 'in_progress',
    statusLabel: '进行中',
    thesis: '权力、财富与叙事权的非平滑转移是结构问题；「儿童政权」透镜用于标出制度缓冲缺失，而非年龄道德评判。',
    similarMechanisms: [
      { text: '人口结构变迁下的代际资源与话语权再配置。', to: '/demographic' },
      { text: '教育与精英再生产影响执政学习曲线。', to: '/education' },
    ],
    criticalDiffs: [
      '现实有过渡制度、专业官僚与法律缓冲；小说是真空实验。',
      '禁止「一代不如一代」式道德裁决或煽情年龄叙事。',
    ],
    linkedCards: ['ST-30', 'ST-22'],
  },
  {
    id: 'GL-02',
    title: '集体动员成本',
    status: 'realized',
    statusLabel: '已兑现',
    thesis: '极端动员可抬高短期执行力，同时消耗信任、纠错通道与代际公平——收益与成本必须同栏出现。',
    similarMechanisms: [
      { text: '压力型体制与战时动员的极限形态（仅机制）。', to: '/powerlogic' },
      { text: '沙盒情景中的动员疲劳与国家能力边界。', to: '/sandbox' },
    ],
    criticalDiffs: [
      '小说是物理存续二分；现实是风险分配与程序正义的持续权衡。',
      '禁止美化或妖魔化任何现实制度；缺成本栏即不合格。',
    ],
    costNote: '执行力↑ · 异议/纠错↓ · 疲劳与信任损耗↑ · 退出成本↑',
    linkedCards: ['ST-23', 'ST-20', 'ST-22'],
  },
  {
    id: 'GL-03',
    title: '认知操控边界',
    status: 'open',
    statusLabel: '未决',
    thesis: '宣传、教育与算法可压缩可讨论空间；「物理钢印」不存在——可逆性与多元信息源是关键差异，亦是未决经验问题。',
    similarMechanisms: [
      { text: '语义防火墙与舆情闭环对认知边界的塑造。', to: '/powerlogic' },
      { text: '数字巨网中的推荐与注意力锁定。', to: '/digital-giant-web' },
    ],
    criticalDiffs: [
      '现实认知操控是概率性、可衰减的；钢印是一次性底层写入。',
      '禁止断言某群体已被「物理洗脑」或坐实未公开操控阴谋。',
    ],
    linkedCards: ['ST-09'],
  },
];

/** 社会治理深链（划界一句） */
export const GOV_XLINKS = [
  {
    to: '/powerlogic',
    label: '权力逻辑',
    note: '思想钢印 ↔ 语义锁定——可逆性是关键差异。',
  },
  {
    to: '/demographic',
    label: '人口结构',
    note: '代际交接对照制度缓冲，禁止年龄歧视表述。',
  },
  {
    to: '/sandbox',
    label: '治国沙盒',
    note: '动员杠杆 ↔ 情景压力测试；含疲劳与合法性成本。',
  },
];

/** 按 id 取概念卡 */
export function getCard(id, list = CANON) {
  return list.find((c) => c.id === id) || null;
}

/** 全量 full 卡数量（不含 index） */
export function countFullCards(list = CANON) {
  return list.filter((c) => c.maturity !== 'index').length;
}
