// ============================================================================
// 汉东省治理推演 · 数据与引擎层（handongData.js）
// ----------------------------------------------------------------------------
// 定位：省域剧情化危机推演的纯数据/纯函数层 —— 不含任何 React/视图代码。
// 复用：六域与五工具沿用国家级沙盒 crisisData.js 的 CRISIS_DOMAINS / TOOLS，
//       在省域语境下读作：科技→科技产业、社会→社会民生、外交→外部环境、
//       能源→能源资源、金融→金融财政；diplomacy 工具读作「上级协调」。
// 模型：raw = impact × intensity + 省情脆弱度修正；
//       relief = Σ 工具投放比例 × mitigation × 班子胜任度乘数；
//       net = raw − relief；score = 六域净冲击均值与最痛域 0.5/0.5 混合 → 三档判定。
// 声明：汉东省、京州/吕州/林城及全部官员均为虚构，致敬经典政治叙事，
//       与任何真实地区、机构、人物无关。全部系数为示意标定，非预测。
// ============================================================================

import { CRISIS_DOMAINS, TOOLS } from '../sandbox/crisisData.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

export { CRISIS_DOMAINS, TOOLS };

export const HD_AS_OF = AS_OF_BASELINE;

// 六域在汉东语境下的读法（序同 CRISIS_DOMAINS，数组本体不变）。
export const HD_DOMAIN_LABELS = ['科技产业', '经济', '社会民生', '外部环境', '能源资源', '金融财政'];

// ----------------------------------------------------------------------------
// 省情资源禀赋类型。
// mods：对六域冲击的省情修正（-12..+12，负值=该域更抗压，正值=更脆弱）。
// 设计逻辑：禀赋既是缓冲垫也是病灶 —— 能源省扛断供但财政单一；
//           沿海省科技/经济韧但外部暴露；老工业基地能源自给但债务沉疴。
// ----------------------------------------------------------------------------
export const RESOURCE_TYPES = [
  {
    id: 'energy', label: '能源矿产型',
    desc: '煤炭/矿产富集，能源冲击有天然缓冲；但产业单一、财政高度依赖资源价格。',
    //     科技  经济  社会  外部  能源  金融
    mods: [6, 4, 3, 0, -10, 5],
  },
  {
    id: 'agri', label: '农业大省',
    desc: '粮食基本盘稳，社会民生底线厚；但产业附加值低，科技与财政底子薄。',
    mods: [5, 5, -6, -2, -3, 3],
  },
  {
    id: 'coastal', label: '沿海开放型',
    desc: '外向型经济+科创集聚，科技/经济韧性强；但外部环境与能源进口暴露度高。',
    mods: [-8, -5, 2, 8, 4, 1],
  },
  {
    id: 'rust', label: '老工业基地',
    desc: '重工业与能源自给底子在；但设备老化、下岗包袱与历史债务三座大山。',
    mods: [5, 7, 6, -3, -6, 8],
  },
];

export const CAPITALS = ['京州', '吕州', '林城'];

// ----------------------------------------------------------------------------
// 六岗班子。weight 合计 1.00；need 为该岗位对六域能力的期望画像（0-100），
// 供前端做「人岗匹配度」展示。
// ----------------------------------------------------------------------------
export const POSTS = [
  { id: 'secretary', label: '省委书记', weight: 0.24, need: [50, 60, 70, 60, 45, 55] }, // 均衡，偏组织/风险
  { id: 'governor', label: '省长', weight: 0.24, need: [55, 80, 60, 50, 55, 65] }, // 偏经济/治理
  { id: 'deputy', label: '常务副省长', weight: 0.14, need: [65, 75, 45, 35, 55, 60] }, // 经济/产业
  { id: 'organize', label: '组织部长', weight: 0.10, need: [35, 45, 60, 30, 25, 35] }, // 组织
  { id: 'law', label: '政法委书记', weight: 0.16, need: [25, 40, 85, 40, 30, 45] }, // 风险/社会
  { id: 'propaganda', label: '宣传部长', weight: 0.12, need: [35, 30, 75, 60, 20, 30] }, // 理论/社会
];

// ----------------------------------------------------------------------------
// 干部库：14 名完全原创虚构官员。dims 序同六域（0-95，刻意保留鲜明长短板）。
// ----------------------------------------------------------------------------
export const OFFICIALS = [
  {
    id: 'zhouyanqiu', name: '周砚秋', age: 58, archetype: '组织老手', color: '#8b5cf6',
    dims: [38, 55, 72, 58, 42, 48], merit: 50,
    bio: '组织系统三十年，阅人无数，最擅在风暴中稳住干部队伍，对新产业隔行如隔山。',
  },
  {
    id: 'zhengtieya', name: '郑铁崖', age: 56, archetype: '政法铁腕', color: '#c41e3a',
    dims: [30, 42, 88, 40, 35, 38], merit: 50,
    bio: '刑警出身一路办案上来，群体事件现场敢站第一排，看金融报表则两眼一黑。',
  },
  {
    id: 'linwanzhou', name: '林晚舟', age: 52, archetype: '金融专才', color: '#22d3ee',
    dims: [48, 68, 35, 45, 30, 90], merit: 50,
    bio: '从交易所到地方金融局，拆过两单交叉违约，信奉「债务问题在表外」，不善接访。',
  },
  {
    id: 'gucanglan', name: '顾沧澜', age: 54, archetype: '改革闯将', color: '#e8a317',
    dims: [72, 85, 42, 50, 40, 58], merit: 50,
    bio: '开发区起家，敢给政策敢拍板，GDP 战绩赫赫，留下的维稳隐患也不止一处。',
  },
  {
    id: 'hansongling', name: '韩松龄', age: 60, archetype: '稳健守成', color: '#94a3b8',
    dims: [45, 58, 62, 52, 55, 55], merit: 50,
    bio: '四平八稳的老班长，没有短板也没有杀手锏，复杂局面里是定盘星而非破局者。',
  },
  {
    id: 'qinjiuchou', name: '秦九畴', age: 49, archetype: '技术官僚', color: '#6366f1',
    dims: [88, 62, 35, 30, 52, 45], merit: 50,
    bio: '工科博士转岗，主抓产业链图谱与攻关专项，跟院士谈笑风生，跟上访户相对无言。',
  },
  {
    id: 'suhuaijin', name: '苏怀瑾', age: 55, archetype: '学者型', color: '#10b981',
    dims: [62, 55, 48, 75, 30, 52], merit: 50,
    bio: '智库出身的笔杆子，善对上沟通、对外阐释，方案漂亮，落地常需旁人托底。',
  },
  {
    id: 'machengjun', name: '马承钧', age: 53, archetype: '基层实干', color: '#f59e0b',
    dims: [35, 52, 78, 32, 60, 30], merit: 50,
    bio: '乡镇党委书记干到地级市主官，防汛保供睡过堤坝，资本市场对他是另一个星球。',
  },
  {
    id: 'duanyune', name: '段云鹗', age: 51, archetype: '动员强手', color: '#ef4444',
    dims: [28, 40, 92, 38, 48, 32], merit: 50,
    bio: '应急系统淬炼出的现场指挥，转移十万人不乱阵脚，案头经济工作非其所长。',
  },
  {
    id: 'weishutong', name: '卫疏桐', age: 50, archetype: '外联能手', color: '#14b8a6',
    dims: [42, 50, 45, 88, 35, 55], merit: 50,
    bio: '驻外商务参赞历练，外资圈与部委两头熟，争取政策窗口的本事省内无出其右。',
  },
  {
    id: 'tangjiming', name: '唐既明', age: 47, archetype: '改革闯将', color: '#a855f7',
    dims: [78, 72, 38, 42, 58, 50], merit: 50,
    bio: '最年轻的厅级干部，押注新能源赛道再造了一个园区，锋芒太露，树敌不少。',
  },
  {
    id: 'shichangying', name: '史长缨', age: 57, archetype: '基层实干', color: '#78716c',
    dims: [40, 48, 55, 35, 85, 42], merit: 50,
    bio: '矿区出身的老能源，井下口令比文件熟，保供战役的压舱石，新经济话题插不上嘴。',
  },
  {
    id: 'wenxubai', name: '温叙白', age: 48, archetype: '学者型', color: '#0ea5e9',
    dims: [45, 42, 70, 62, 28, 40], merit: 50,
    bio: '党校理论骨干转岗宣传线，舆情研判与议题设置见功力，硬仗现场经验偏薄。',
  },
  {
    id: 'peiyuanxiu', name: '裴远岫', age: 59, archetype: '稳健守成', color: '#84cc16',
    dims: [38, 60, 50, 44, 45, 74], merit: 50,
    bio: '财政厅长任上熬过三轮化债，算账极精、出手极慎，错过机会也从不踩雷。',
  },
];

// ----------------------------------------------------------------------------
// 六个汉东剧情情景（致敬式原创，不复述任何作品剧情）。
// impact：基准冲击系数（×烈度 0-100）；need：应对该情景的六域能力需求画像；
// mitigation：工具满投 100 点时对六域的最大削减量（0-60，序同六域）；
// acts：四幕剧情推演 —— 起（事发）/承（发酵升级）/转（处置博弈）/合（制度复盘）。
// ----------------------------------------------------------------------------
export const HD_SCENARIOS = [
  {
    id: 'windfactory', label: '服装厂股权纠纷与群体事件', color: '#c41e3a',
    intro: '老牌服装厂股权遭质押拍卖，职工持股会与新买家对峙，拆迁线与金融线同时引信。',
    acts: [
      '凌晨拆迁通知贴上厂门，职工持股会连夜聚集护厂，对峙在围墙两侧悄然成形。',
      '质押链条曝光：过桥贷利滚利吞掉股权，短视频点燃舆情，外地声援者涌入厂区。',
      '一次失控冲突逼出省级介入：冻结拍卖、审计质押链，主官到厂门接访拆引信。',
      '股权确权与职工安置并轨落地，过桥贷监管补洞，群体事件复盘写入警示案例库。',
    ],
    impact: [0.05, 0.45, 0.95, 0.1, 0.05, 0.6],
    need: [10, 55, 95, 20, 10, 70],
    // 群体事件：社会动员是主战工具；货币侧负责拆质押平仓连环雷；产业工具仅能救厂不能救场。
    mitigation: {
      fiscal:    [2, 22, 30, 2, 2, 18],
      monetary:  [0, 12, 8, 0, 0, 38],
      industry:  [8, 18, 10, 0, 2, 6],
      diplomacy: [2, 8, 14, 18, 2, 16],
      mobilize:  [0, 6, 42, 4, 2, 4],
    },
    watch: ['厂区周边聚集人数与时段分布', '股权拍卖程序异议数量', '涉事短视频传播热度曲线'],
  },
  {
    id: 'brightpeak', label: '重点工程招投标窝案', color: '#8b5cf6',
    intro: '光明峰工程招投标串案牵出多名厅处级干部，项目停摆与干部观望情绪同步扩散。',
    acts: [
      '中标价异常偏低引来匿名举报，纪委初核发现评标专家名单早被人提前圈定。',
      '窝案沿资金链上溯，三家围标公司背后浮出同一实控人，项目全线停工待查。',
      '「边查边建」与「一停到底」激烈交锋，上级督导组进驻定调，合规标段获切割。',
      '招投标平台重构、评标全程留痕，涉案标段重招，问责与容错边界同步厘清。',
    ],
    impact: [0.25, 0.55, 0.5, 0.1, 0.1, 0.45],
    need: [30, 65, 60, 25, 10, 55],
    // 窝案场景：动员/强力手段缓解弱（震慑反而加剧观望），上级协调（定调+授权）是关键解。
    mitigation: {
      fiscal:    [4, 20, 10, 0, 2, 12],
      monetary:  [2, 10, 2, 0, 0, 16],
      industry:  [14, 16, 4, 0, 4, 4],
      diplomacy: [6, 18, 22, 12, 2, 18],
      mobilize:  [2, 4, 12, 2, 0, 2],
    },
    watch: ['停工标段复工率', '涉案干部留置与主动投案节奏', '重点工程审计问题金额'],
  },
  {
    id: 'jzdebt', label: '京州城投债务暴雷', color: '#e8a317',
    intro: '省会城投非标逾期触发交叉违约，区域融资成本跳升，土地财政缺口全面现形。',
    acts: [
      '一笔信托计划到期未兑，城投评级遭下调，区域债券一级发行当日流标。',
      '交叉违约条款连环触发，银行抽贷与理财赎回共振，在建市政项目欠薪停工。',
      '省级协调机制接管：资产盘点、展期谈判与「保刚兑还是保重组」的艰难抉择。',
      '展期+置换+资产处置三线并行，平台整合压减数量，举债终身追责写入纪要。',
    ],
    impact: [0.1, 0.8, 0.5, 0.15, 0.1, 0.95],
    need: [15, 85, 55, 25, 10, 95],
    // 债务场景：财政（置换/兜底）+货币（流动性接续）双主力；上级协调争取额度；动员只兜欠薪维稳。
    mitigation: {
      fiscal:    [2, 30, 18, 2, 2, 34],
      monetary:  [0, 22, 6, 0, 0, 44],
      industry:  [6, 12, 4, 0, 2, 4],
      diplomacy: [0, 10, 4, 16, 0, 20],
      mobilize:  [0, 4, 24, 2, 0, 6],
    },
    watch: ['区域城投利差与一级流标率', '土地出让金同比', '在建项目欠薪信访量'],
  },
  {
    id: 'lvmine', label: '吕州矿难与舆情风暴', color: '#78716c',
    intro: '吕州煤矿透水事故数十人被困，瞒报疑云叠加全网直播，救援与舆情双线作战。',
    acts: [
      '夜班透水警报延迟两小时上报，井下数十人失联，家属在矿门口架起直播。',
      '「迟报两小时」截图全网刷屏，停产整顿令波及全市煤矿，电煤库存告急。',
      '救援窗口与信息节奏博弈：每日两场发布会对冲谣言，钻孔昼夜打通生命线。',
      '幸存者升井，责任从矿主到监管逐级认定，安全技改与产能置换并案推进。',
    ],
    impact: [0.1, 0.35, 0.9, 0.2, 0.7, 0.25],
    need: [25, 40, 90, 30, 75, 30],
    // 矿难场景：动员（救援/家属/保供）扛大头，产业（安全技改+产能置换）解能源域，货币几乎无处发力。
    mitigation: {
      fiscal:    [2, 14, 22, 0, 10, 8],
      monetary:  [0, 6, 2, 0, 2, 12],
      industry:  [16, 12, 6, 0, 28, 4],
      diplomacy: [2, 4, 8, 18, 10, 4],
      mobilize:  [2, 6, 40, 6, 14, 2],
    },
    watch: ['井下生命探测信号', '停产整顿矿井复产率', '电煤库存可用天数'],
  },
  {
    id: 'linpollute', label: '林城开发区环保危机', color: '#10b981',
    intro: '林城开发区地下水超标被督察组点名，园区支柱产业面临关停与搬迁的抉择。',
    acts: [
      '村民联名信附第三方检测报告直达督察组，水源地重金属超标坐实。',
      '点名通报当晚园区龙头股价闪崩，外资客户启动供应链审查，订单转移四起。',
      '「一刀切关停」与「分类整治」激烈交锋，省里立军令状换来治理时间表。',
      '管网溯源改造、企业分级处置、生态赔偿基金落地，绿色认证重建园区信用。',
    ],
    impact: [0.4, 0.5, 0.6, 0.35, 0.45, 0.3],
    need: [50, 55, 65, 40, 50, 35],
    // 环保场景：产业工具（治污技改/搬迁升级）是治本主力；上级协调换整改时间表；财政出赔偿与治理资金。
    mitigation: {
      fiscal:    [8, 16, 18, 2, 8, 10],
      monetary:  [2, 10, 2, 0, 2, 14],
      industry:  [26, 20, 6, 4, 18, 6],
      diplomacy: [4, 8, 6, 22, 4, 6],
      mobilize:  [2, 6, 26, 6, 4, 2],
    },
    watch: ['水源地复测达标率', '园区企业关停与复产清单', '外资客户审查与订单转移动向'],
  },
  {
    id: 'typhoon', label: '沿海台风巨灾与重建', color: '#22d3ee',
    intro: '超强台风正面登陆，风暴潮叠加天文大潮，电网、港口与农田同时受创。',
    acts: [
      '台风路径突变提前十二小时锁定登陆点，百万人转移命令在深夜下达。',
      '风暴潮漫堤，主城区电网瘫痪，港口集装箱倾倒，通信孤岛逐片出现。',
      '抢通「电网—通信—道路」生死序列之争，跨省救援与物资调度昼夜接力。',
      '重建按韧性标准升级海堤与管网，巨灾保险与财政分担机制写入省级预案。',
    ],
    impact: [0.15, 0.6, 0.85, 0.2, 0.65, 0.4],
    need: [25, 60, 90, 30, 70, 45],
    // 巨灾场景：动员（转移/抢险）与财政（救灾/重建）双主力；上级协调引跨省驰援；产业管抢修恢复。
    mitigation: {
      fiscal:    [4, 24, 28, 2, 12, 16],
      monetary:  [0, 10, 4, 0, 2, 18],
      industry:  [12, 14, 6, 0, 22, 4],
      diplomacy: [2, 6, 6, 20, 8, 6],
      mobilize:  [2, 8, 44, 4, 12, 4],
    },
    watch: ['电网负荷恢复率', '港口吞吐恢复进度', '安置点在册人数与归家率'],
  },
];

// ============================================================================
// 引擎函数（全部确定性纯函数）
// ============================================================================

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * 省情脆弱度修正：cfg = { pop(万), gdpPc(万元), industry:[一产,二产,三产]%, resource(id), capital }
 * 返回 [6] 修正值（-15..+15，负=更抗压）。全部确定性公式：
 *  1) 人口规模 → 社会域：人口越大，民生盘子越大、群体事件放大器越强。
 *     以 4000 万为中性点，每 ±500 万 ∓/± 1 点，限 [-6, +8]。
 *  2) 人均 GDP → 经济/金融域：家底越厚越韧。以 6.5 万元为中性点。
 *  3) 产业结构：二产占比高 → 科技域韧（制造能力在手）、能源域脆（耗能基数大）；
 *     三产占比高 → 金融域敏感（资产价格传导快）；一产占比高 → 社会域韧（吃饭问题托底）。
 *  4) 资源禀赋 mods 直接叠加。
 *  5) 省会城市效应：京州=首位度高（社会治理压力+金融集聚），
 *     吕州=矿业腹地（能源韧/科技弱），林城=科创园区（科技韧/外部暴露）。
 */
export function computeBaseline(cfg) {
  const mods = [0, 0, 0, 0, 0, 0];
  const [pri, sec, ter] = cfg.industry;

  // 1) 人口 → 社会域
  mods[2] += clamp(Math.round((cfg.pop - 4000) / 500), -6, 8);

  // 2) 人均 GDP → 经济 / 金融域（低于中性点 6.5 万元则更脆弱）
  mods[1] += clamp(Math.round((6.5 - cfg.gdpPc) * 2), -8, 8);
  mods[5] += clamp(Math.round((6.5 - cfg.gdpPc) * 1.5), -6, 6);

  // 3) 产业结构
  mods[0] += clamp(Math.round((40 - sec) * 0.3), -6, 6);   // 二产高 → 科技韧
  mods[4] += clamp(Math.round((sec - 40) * 0.25), -6, 6);  // 二产高 → 能源脆
  mods[5] += clamp(Math.round((ter - 45) * 0.2), -5, 5);   // 三产高 → 金融敏感
  mods[2] += clamp(Math.round((pri - 8) * -0.25), -4, 4);  // 一产高 → 社会韧

  // 4) 资源禀赋
  const res = RESOURCE_TYPES.find((r) => r.id === cfg.resource);
  if (res) res.mods.forEach((m, i) => { mods[i] += m; });

  // 5) 省会效应
  const CAP_MODS = {
    京州: [0, -1, 2, 0, 0, 1],
    吕州: [1, 0, 0, 0, -2, 0],
    林城: [-2, 0, 0, 1, 1, 0],
  };
  (CAP_MODS[cfg.capital] || [0, 0, 0, 0, 0, 0]).forEach((m, i) => { mods[i] += m; });

  return mods.map((m) => clamp(Math.round(m), -15, 15));
}

/**
 * 班子胜任度：assign = { postId: officialId | null }
 * dims[i] = Σ 岗位权重 × 任职官员 dims[i]（空岗按 40 计 —— 群龙无首的折价）。
 * mult[i] = 0.7 + dims[i]/100 × 0.6 → [0.7, 1.27]，作用于政策缓解效率。
 */
export function teamCompetence(assign, officials) {
  const dims = [0, 0, 0, 0, 0, 0];
  POSTS.forEach((post) => {
    const off = officials.find((o) => o.id === assign[post.id]);
    for (let i = 0; i < 6; i++) dims[i] += post.weight * (off ? off.dims[i] : 40);
  });
  const rounded = dims.map((d) => Math.round(d));
  return { dims: rounded, mult: rounded.map((d) => 0.7 + (d / 100) * 0.6) };
}

/**
 * 推演引擎：{ scenario(HD_SCENARIOS 元素), intensity(0-100),
 *            alloc({toolId:0-100}), baselineMods([6]), mult([6]) }
 * → { raw, relief, net, score, verdict: [label, color, note] }
 */
export function hdEngine({ scenario, intensity, alloc, baselineMods, mult }) {
  const raw = scenario.impact.map((c, i) =>
    clamp(Math.round(c * intensity + baselineMods[i]), 0, 100));

  const relief = raw.map((_, i) => {
    let r = 0;
    TOOLS.forEach((t) => {
      r += ((alloc[t.id] || 0) / 100) * scenario.mitigation[t.id][i] * mult[i];
    });
    return r;
  });

  const net = raw.map((v, i) => Math.max(0, Math.round(v - relief[i])));
  // 均值会把单域灾难平均掉（社会民生净 81、其余五域安然 → 均值仅 29），
  // 混入最痛域对半计权：塌方无法被其他领域的岁月静好稀释。
  const mean = net.reduce((a, b) => a + b, 0) / 6;
  const score = Math.round(mean * 0.5 + Math.max(...net) * 0.5);

  let verdict;
  if (score < 30) {
    verdict = ['平稳化解', '#10b981', '冲击被吸收在省域闭环内，未上升为全国性议题，班子打法可入案例库。'];
  } else if (score < 60) {
    verdict = ['承压过关', '#e8a317', '底线守住但代价不小，部分领域留下后遗症，整改清单将伴随整个任期。'];
  } else {
    verdict = ['治理失分', '#c41e3a', '处置节奏全面落后于事态，上级督导介入，班子调整已在酝酿之中。'];
  }

  return { raw, relief, net, score, verdict };
}

/**
 * 政绩增减：score → [主官Δ, 班子Δ]
 */
export function meritDelta(score) {
  if (score < 30) return [8, 5];
  if (score < 60) return [3, 1];
  return [-7, -4];
}

/**
 * 任免判定：merit → [结论, 颜色]
 */
export function promotionJudge(merit) {
  if (merit >= 70) return ['拟提拔', '#10b981'];
  if (merit >= 50) return ['留任', '#22d3ee'];
  if (merit >= 38) return ['诫勉', '#e8a317'];
  return ['调整', '#c41e3a'];
}

/**
 * 治理报告（Markdown）。
 * ctx = { scenario, intensity, cfg, assign, alloc, officials, result(hdEngine 返回值) }
 */
export function hdReport(ctx) {
  const { scenario, intensity, cfg, assign, alloc, officials, result } = ctx;
  const res = RESOURCE_TYPES.find((r) => r.id === cfg.resource);
  const lines = [];

  lines.push(`# 汉东省治理推演报告 · ${scenario.label}`);
  lines.push('');
  lines.push(`> 推演基准 ${HD_AS_OF} · 冲击烈度 ${intensity}/100`);
  lines.push('');

  lines.push('## 省情配置摘要');
  lines.push(`- 常住人口：${cfg.pop} 万 ｜ 人均 GDP：${cfg.gdpPc} 万元`);
  lines.push(`- 三产结构：一产 ${cfg.industry[0]}% / 二产 ${cfg.industry[1]}% / 三产 ${cfg.industry[2]}%`);
  lines.push(`- 资源禀赋：${res ? res.label : cfg.resource} ｜ 省会：${cfg.capital}`);
  lines.push('');

  lines.push('## 班子名单');
  POSTS.forEach((post) => {
    const off = officials.find((o) => o.id === assign[post.id]);
    lines.push(`- ${post.label}：${off ? `${off.name}（${off.archetype}·${off.age} 岁）` : '空缺'}`);
  });
  lines.push('');

  lines.push('## 六域冲击推演（raw → net）');
  HD_DOMAIN_LABELS.forEach((label, i) => {
    lines.push(`- ${label}：${result.raw[i]} → **${result.net[i]}**（削减 ${Math.round(result.relief[i])}）`);
  });
  lines.push('');

  lines.push('## 政策配置');
  TOOLS.forEach((t) => {
    const label = t.id === 'diplomacy' ? '上级协调' : t.label;
    lines.push(`- ${label}：${alloc[t.id] || 0} 点`);
  });
  lines.push('');

  lines.push('## 判定');
  lines.push(`- 综合净冲击 **${result.score}** → **${result.verdict[0]}**`);
  lines.push(`- ${result.verdict[2]}`);
  lines.push('');

  lines.push('## 任免建议');
  officials.forEach((o) => {
    const judge = promotionJudge(o.merit);
    lines.push(`- ${o.name}（政绩 ${o.merit}）：${judge[0]}`);
  });
  lines.push('');

  lines.push('---');
  lines.push('*虚构省份推演，致敬经典政治叙事，与任何真实地区/人物无关。*');

  return lines.join('\n');
}
