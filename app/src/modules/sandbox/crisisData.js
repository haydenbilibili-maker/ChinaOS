// ============================================================================
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';
// 治国沙盒 · 危机数据/算法层（crisisData.js）
// ----------------------------------------------------------------------------
// 定位：国家级危机情景引擎的纯数据与纯函数层 —— 不含任何 React/视图代码。
// 模型：实际冲击 = 基准系数 impact[i] × 烈度 intensity(0-100)；
//       政策缓解 = Σ 工具投放比例 × 该工具对各域的最大削减量 mitigation；
//       六域固定：科技/经济/社会/外交/能源/金融（序同 CRISIS_DOMAINS）。
// 性质：思想实验 / 压力测试框架，非预测；全部系数为示意标定，
//       数值刻画的是工具-危机之间的相对逻辑差，而非任何精确测算。
// 基准：AS_OF 2026-07-14。
// ============================================================================

export const AS_OF = AS_OF_BASELINE;

export const CRISIS_DOMAINS = ['科技', '经济', '社会', '外交', '能源', '金融'];

// 五大政策工具：每项满投 100 点时，对六域冲击的最大削减量见各危机 mitigation。
export const TOOLS = [
  { id: 'fiscal',    label: '财政刺激', color: '#e8a317', desc: '专项债/转移支付/减税——买时间、稳需求' },
  { id: 'monetary',  label: '货币宽松', color: '#22d3ee', desc: '降准降息/再贷款/流动性投放——稳金融、压融资成本' },
  { id: 'industry',  label: '产业自主', color: '#8b5cf6', desc: '攻关专项/替代采购/链主扶持——补短板、降依赖' },
  { id: 'diplomacy', label: '外交斡旋', color: '#10b981', desc: '多边协调/第三方通道/对等反制——降外压、保通道' },
  { id: 'mobilize',  label: '社会动员', color: '#c41e3a', desc: '宣传引导/基层网格/保供体系——稳预期、保底线' },
];

// ----------------------------------------------------------------------------
// 六大危机情景。
// mitigation：工具满投 100 点时对六域冲击的最大削减量(0-60 整数)，域序同 CRISIS_DOMAINS。
// talentKeywords：用于在干部库 raw/career/org/title 字段中检索匹配的履历关键词。
// ----------------------------------------------------------------------------
export const CRISES = {
  chipBan: {
    label: '芯片全面禁运', color: '#8b5cf6',
    intro: '先进制程、设备与 EDA 全面断供，半导体链被迫整体国产替代的极限压力测试。',
    chain: ['先进制程与设备/EDA 断供', 'AI/车规高端芯片缺口放大', '整机与智能终端出口受挫', '替代投资与大基金井喷', '成熟制程产能过剩风险'],
    impact: [0.95, 0.6, 0.3, 0.7, 0.15, 0.4],
    toolbox: [
      ['成熟制程极限堆叠', '28nm + Chiplet 先稳住车规/工控/家电基本盘'],
      ['卡点揭榜挂帅', '设备/材料/EDA 逐项立军令状，大基金三期定向投放'],
      ['存量囤备+第三地转口', '拉长断供生效时间窗，为替代争取窗口期'],
      ['稀土/镓锗对等反制', '以上游材料筹码换设备许可的谈判空间'],
    ],
    talentNeed: '需要供应链作战型 + 科技攻坚型干部前置：懂晶圆厂建设周期、敢拍板百亿级设备订单的复合操盘手。',
    watch: ['半导体设备进口额同比', '关键环节国产化率（刻蚀/光刻胶）', '代工厂对陆出货许可变动'],
    // 产业自主是唯一能直击科技域的工具；货币宽松对断供本身近乎无效，只能稳金融侧。
    mitigation: {
      fiscal:    [15, 25, 12, 2, 4, 10],
      monetary:  [4, 18, 5, 0, 2, 30],
      industry:  [45, 20, 6, 10, 6, 8],
      diplomacy: [18, 12, 3, 38, 5, 10],
      mobilize:  [8, 8, 18, 3, 4, 4],
    },
    talentKeywords: ['工信', '半导体', '集成电路', '电子', '科技', '工业', '产业链'],
  },
  strait: {
    label: '台海高烈度对峙', color: '#c41e3a',
    intro: '演训升级为持续性海空封控对峙，航运保险、外资风险偏好与金融溢价同时重估。',
    chain: ['海空封控演训常态化', '航运改道+战争险费率飙升', '外资避险撤出与供应链转单', '金融市场风险溢价重估', '战时经济动员预案激活'],
    impact: [0.55, 0.75, 0.6, 0.95, 0.7, 0.85],
    toolbox: [
      ['灰区节奏控制', '封控烈度分级可逆，保留降级台阶避免误判螺旋'],
      ['金融防波堤', '汇率干预+离岸流动性安排+关键企业外债置换'],
      ['能源粮食战略囤备', '90 天以上进口中断承受力为底线目标'],
      ['法律战+外宣战', '封控的国内法/国际法叙事先行，分化对手联盟'],
    ],
    talentNeed: '需要军地协同型 + 金融维稳型干部双前置：东南沿海主官须有动员体系与外资安抚的双重操作能力。',
    watch: ['台海周边战争险费率', '海峡 AIS 航迹密度异动', '离岸人民币隐含波动率'],
    // 外交斡旋管控对峙烈度本身，社会动员稳后方与保供；财政货币只能对冲次生冲击。
    mitigation: {
      fiscal:    [5, 20, 14, 2, 8, 10],
      monetary:  [2, 16, 4, 2, 4, 38],
      industry:  [20, 10, 4, 2, 12, 4],
      diplomacy: [8, 16, 6, 45, 14, 18],
      mobilize:  [4, 10, 35, 6, 16, 6],
    },
    talentKeywords: ['军', '国防', '外交', '台', '安全', '应急'],
  },
  housing: {
    label: '房企连环违约', color: '#e8a317',
    intro: '头部房企交叉违约引爆信用收缩，土地财政与居民资产负债表同时承压。',
    chain: ['头部房企交叉违约', '保交楼压力+预售资金冻结', '土地出让金骤降冲击地方财政', '居民资产缩水压制消费', '城投与中小银行风险传染'],
    impact: [0.1, 0.8, 0.7, 0.15, 0.1, 0.85],
    toolbox: [
      ['保交楼国家队接管', '项目层面封闭运作，切断「烂尾→断供」社会传导'],
      ['白名单融资滴灌', '区分项目风险与集团风险，避免误伤在建优质盘'],
      ['收储转保障房', '央行再贷款收购存量，托底价格同时补保障短板'],
      ['地方化债组合拳', '置换债+央地共担，防止土地财政缺口击穿三保'],
    ],
    talentNeed: '需要金融处置型 + 社会稳控型干部组合：既能拆弹债务重组，又能在业主维权一线管理预期。',
    watch: ['70 城房价环比下行扩散度', '土地出让金同比', 'AA 城投利差走阔'],
    // 内生债务危机：财政+货币双主力拆弹；外交几乎无处发力，动员负责业主预期与维稳。
    mitigation: {
      fiscal:    [3, 32, 24, 2, 2, 26],
      monetary:  [2, 26, 10, 0, 1, 40],
      industry:  [5, 10, 4, 0, 2, 3],
      diplomacy: [0, 3, 1, 8, 1, 4],
      mobilize:  [0, 6, 30, 1, 1, 6],
    },
    talentKeywords: ['住建', '房', '土地', '财政', '金融'],
  },
  grain: {
    label: '粮食歉收+大豆断供', color: '#10b981',
    intro: '极端气候致主产区歉收，叠加大豆进口断供，饲料—肉价—CPI 链条全面承压。',
    chain: ['主产区极端气候歉收', '大豆/玉米进口通道收紧', '饲料成本推升肉蛋价格', 'CPI 食品项抬升挤压低收入群体', '储备投放与应急配给预案启动'],
    impact: [0.05, 0.45, 0.8, 0.5, 0.2, 0.25],
    toolbox: [
      ['中央储备梯次投放', '稻麦储备充裕是底牌，节奏比规模更重要'],
      ['进口多元化急转', '巴西/阿根廷/俄罗斯多源替代+国际粮商长协锁价'],
      ['豆粕减量替代', '低蛋白日粮+合成生物饲料蛋白的应急放量'],
      ['最低收购价+种粮直补加码', '保住下一季播种面积的政治底线'],
    ],
    talentNeed: '需要农业系统型 + 应急保供型干部前置：主产省主官的粮食安全党政同责在此情景下一票否决。',
    watch: ['主产省墒情与积温距平', 'CBOT 大豆价格+到岸升贴水', '能繁母猪存栏环比'],
    // 社会动员（储备投放/保供配给）扛社会域大头，外交斡旋打通多元进口替代通道。
    mitigation: {
      fiscal:    [1, 16, 20, 2, 3, 6],
      monetary:  [0, 8, 4, 0, 1, 10],
      industry:  [4, 8, 8, 1, 3, 2],
      diplomacy: [1, 14, 12, 32, 6, 6],
      mobilize:  [1, 12, 42, 4, 6, 5],
    },
    talentKeywords: ['农', '粮', '供销', '水利', '应急'],
  },
  finance: {
    label: '外部金融冲击', color: '#22d3ee',
    intro: '美元流动性危机或金融制裁升级，资本外流、汇率与外储三线同时承压。',
    chain: ['美元流动性收紧/制裁升级', '资本外流+人民币贬值压力', '外储消耗与离岸市场失锚', '进口成本抬升输入通胀', '国内信用被动收缩'],
    impact: [0.2, 0.65, 0.35, 0.6, 0.45, 0.95],
    toolbox: [
      ['资本流动宏观审慎', '远购风险准备金/逆周期因子分级加码，不搞硬管制'],
      ['本币结算扩围', 'CIPS+货币互换网络对冲 SWIFT 依赖的极限场景'],
      ['外储结构防御化', '黄金与多元资产占比提升，降低美债敞口集中度'],
      ['离岸流动性反击', '央票发行+离岸池调控，提高做空人民币成本'],
    ],
    talentNeed: '需要国际金融实战型干部前置：央行/外管/主权基金履历，经历过 2015 汇改一役者优先。',
    watch: ['离岸-在岸汇差(CNH-CNY)', '外储月度变动与估值剥离', '中美十年期利差'],
    // 货币工具直接对冲金融域震中，财政托内需；外交（互换网络/制裁谈判）削外压。
    mitigation: {
      fiscal:    [4, 25, 16, 2, 5, 15],
      monetary:  [3, 24, 7, 2, 4, 46],
      industry:  [10, 6, 2, 1, 8, 3],
      diplomacy: [4, 10, 3, 36, 8, 16],
      mobilize:  [1, 6, 16, 3, 5, 6],
    },
    talentKeywords: ['金融', '银行', '证监', '人民银行', '财政', '外汇'],
  },
  pandemic: {
    label: '公共卫生危机复发', color: '#fb923c',
    intro: '新发呼吸道病原体快速过峰，考验常态化监测、医疗冗余与社会预期管理。',
    chain: ['新发病原体跨区传播', '医疗资源挤兑风险显形', '服务业与线下消费骤冷', '防控与开放的预期反复摇摆', '财政补贴与公卫体系紧急扩容'],
    impact: [0.15, 0.55, 0.9, 0.3, 0.1, 0.35],
    toolbox: [
      ['哨点监测前置', '多点触发预警，把发现窗口从周压缩到天'],
      ['分级诊疗硬隔离', '基层首诊+重症集中，守住 ICU 床位不挤兑'],
      ['精准防控工具箱', '以最小社会成本换传播速降，杜绝层层加码回潮'],
      ['预期管理一个口径', '权威信息单一出口，对冲恐慌性囤积与谣言'],
    ],
    talentNeed: '需要公共卫生专业型 + 城市运行保障型干部组合：疾控体系出身的副省长配置成为刚需。',
    watch: ['哨点医院病原阳性率', '发热门诊就诊量周环比', '重症床位占用率'],
    // 社会动员（网格/分级诊疗/预期管理）是震中解法，财政兜补贴与公卫扩容。
    mitigation: {
      fiscal:    [3, 26, 22, 2, 2, 12],
      monetary:  [1, 14, 5, 0, 1, 16],
      industry:  [10, 6, 9, 1, 2, 2],
      diplomacy: [3, 6, 4, 22, 2, 4],
      mobilize:  [4, 12, 46, 4, 4, 6],
    },
    talentKeywords: ['卫生', '疾控', '医', '应急', '民政'],
  },
};

// ----------------------------------------------------------------------------
// 核心算法：冲击-缓解-判定
// alloc = { fiscal:0-100, monetary:..., ... }，Σ ≤ 100（资源总池约束由调用方保证）。
// raw[i]    = round(impact[i] × intensity)
// relief[i] = Σ_tool alloc[tool]/100 × mitigation[tool][i]
// net[i]    = max(0, round(raw[i] − relief[i]))
// score     = round(mean(net))；verdict 三档判读。
// ----------------------------------------------------------------------------
export function mitigatedImpact(crisis, intensity, alloc = {}) {
  const raw = crisis.impact.map((c) => Math.round(c * intensity));
  const reliefExact = CRISIS_DOMAINS.map((_, i) =>
    TOOLS.reduce((sum, t) => {
      const row = (crisis.mitigation && crisis.mitigation[t.id]) || [];
      return sum + ((alloc[t.id] || 0) / 100) * (row[i] || 0);
    }, 0)
  );
  const net = raw.map((r, i) => Math.max(0, Math.round(r - reliefExact[i])));
  const relief = reliefExact.map((v) => Math.round(v));
  const score = Math.round(net.reduce((a, b) => a + b, 0) / net.length);
  const verdict = score < 30
    ? ['可吸收', '#10b981', '冲击在系统冗余与政策缓冲内被消化，常规治理节奏可以维持，但缓解依赖的政策资源不可撤火。']
    : score < 60
      ? ['承压管理', '#e8a317', '系统承压但未失稳：政策工具在跑、缺口在收窄，须盯紧次生传导，任何一域失守都会改写判定。']
      : ['系统性应激', '#c41e3a', '冲击超出常规吸收能力，进入非常规应对状态：动员储备工具、接受局部损失、以保核心功能为唯一目标。'];
  return { raw, relief, net, score, verdict };
}

// ----------------------------------------------------------------------------
// 双危机非线性耦合：构造一个可直接喂给 mitigatedImpact 的伪危机对象。
// combined[i] = min(100, round((A.impact[i] + B.impact[i]) × intensity × 0.72))
//   —— 0.72 为耦合系数：叠加冲击低于线性相加（部分链条重叠），
//      但救援资源互相挤占、工具边际效力下降（mitigation 整体 ×0.85 折损）。
// ----------------------------------------------------------------------------
export function compositeImpact(crisisA, crisisB, intensity) {
  const A = crisisA, B = crisisB;
  const combined = CRISIS_DOMAINS.map((_, i) =>
    Math.min(100, Math.round((A.impact[i] + B.impact[i]) * intensity * 0.72))
  );
  // 归一回系数形态（impact × intensity ≈ combined）；intensity=0 时退化为理论系数。
  const impact = intensity > 0
    ? combined.map((v) => v / intensity)
    : CRISIS_DOMAINS.map((_, i) => Math.min(1, (A.impact[i] + B.impact[i]) * 0.72));
  const mitigation = {};
  TOOLS.forEach((t) => {
    const ra = (A.mitigation && A.mitigation[t.id]) || [];
    const rb = (B.mitigation && B.mitigation[t.id]) || [];
    mitigation[t.id] = CRISIS_DOMAINS.map((_, i) =>
      Math.round(((ra[i] || 0) + (rb[i] || 0)) / 2 * 0.85)
    );
  });
  return {
    label: `${A.label} × ${B.label}`,
    color: '#ef4444',
    intro: `复合情景：${A.label}与${B.label}同时爆发的非线性耦合——冲击叠加按 0.72 耦合系数折算（链条部分重叠），但救援资源互相挤占，政策工具对每条战线的边际效力同步衰减。`,
    chain: [A.chain[0], B.chain[0], '跨域共振：救援资源互相挤占', '政策工具边际效力下降'],
    impact,
    toolbox: [...A.toolbox.slice(0, 2), ...B.toolbox.slice(0, 2)],
    talentNeed: '复合指挥型：需同时驾驭两条危机链的统筹操盘手——单线专才在此情景下无法闭环，跨系统调度权限与拍板速度是第一约束。',
    watch: [...A.watch.slice(0, 2), ...B.watch.slice(0, 2)],
    mitigation,
    talentKeywords: Array.from(new Set([...(A.talentKeywords || []), ...(B.talentKeywords || [])])),
  };
}

// ----------------------------------------------------------------------------
// 推演报告生成：纯字符串拼装，输出 Markdown。
// team: [{ name, title, match }] 形态（字段缺省时尽量降级显示）。
// ----------------------------------------------------------------------------
export function buildCrisisReport({ crisisLabel, intensity, alloc = {}, raw, net, score, verdict, team }) {
  const lines = [];
  lines.push(`# 沙盘推演报告 · ${crisisLabel}`);
  lines.push(`基准 AS_OF ${AS_OF}`);
  lines.push('');
  lines.push(`## 冲击评估（烈度 ${intensity}）`);
  CRISIS_DOMAINS.forEach((d, i) => {
    const r = raw[i], n = net[i];
    lines.push(`- ${d}：${r} → ${n}（缓解 ${Math.max(0, r - n)}）`);
  });
  lines.push('');
  lines.push('## 政策配置');
  const used = TOOLS.filter((t) => (alloc[t.id] || 0) > 0);
  if (used.length) {
    used.forEach((t) => lines.push(`- ${t.label}：${alloc[t.id]} 点`));
  } else {
    lines.push('- 未投放政策资源（裸跑压力测试）');
  }
  lines.push('');
  lines.push('## 判定');
  lines.push(`${score} · ${verdict[0]} · ${verdict[2]}`);
  if (team && team.length) {
    lines.push('');
    lines.push('## 应对小组');
    team.forEach((m) => {
      const name = m.name || m.姓名 || '—';
      const title = m.title || m.post || m.org || '—';
      const match = m.match != null ? m.match : (m.score != null ? m.score : 0);
      lines.push(`- ${name} · ${title} · 匹配度${match}`);
    });
  }
  lines.push('');
  lines.push('> 思想实验/压力测试框架，非预测；系数为示意标定。');
  return lines.join('\n');
}
