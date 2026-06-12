// ============================================================================
// 科技图谱 · 深化数据层（纯数据 + 纯函数 · 零 React · 零随机 · 零当前时间）
// ----------------------------------------------------------------------------
// 供 techtree/Page.jsx 消费：供应链链条 / 卡脖子清单 / 公开里程碑 / 中美记分牌
// / 攻关推演模型 simTech / 推演报告 buildTechReport。
// 全部数值为「公开信息梳理 + 示意标定」——示意标定 · 非预测 · 非投资建议。
// ============================================================================

import { DOMAINS, TIER_LABEL } from './domains.js';

export const TECH_AS_OF = '2026-06-11';

const DOMAIN_BY_K = Object.fromEntries(DOMAINS.map((d) => [d.k, d]));
const round1 = (v) => Math.round(v * 10) / 10;

// ============================================================================
// 一、供应链链条（每域 5 节点 · 按上游→下游排列）
// node ≤6 字 · auto 0-100 自主度示意 · note ≤20 字断点注记
// 非 lead 域至少含一个 auto<45 的断点节点
// ============================================================================
export const CHAIN_OF = {
  ai: [
    { node: '算力芯片', auto: 30, note: '高端训练 GPU 受管制约束' },
    { node: '训练框架', auto: 72, note: '国产框架生态基本成形' },
    { node: '基础模型', auto: 82, note: '开源模型并跑第一梯队' },
    { node: '行业应用', auto: 88, note: '场景纵深为全球最大' },
    { node: '端侧部署', auto: 76, note: '端侧芯片与推理优化补位' },
  ],
  semi: [
    { node: 'EDA/IP', auto: 25, note: '全流程工具链依赖海外' },
    { node: '设备材料', auto: 18, note: 'EUV 与高端胶气为最深断点' },
    { node: '制造', auto: 40, note: '成熟制程筑底·先进受限' },
    { node: '封测', auto: 78, note: '先进封装为换道支点' },
    { node: '应用', auto: 85, note: '全球最大需求市场托底' },
  ],
  quantum: [
    { node: '低温制冷', auto: 28, note: '稀释制冷机依赖进口' },
    { node: '量子芯片', auto: 68, note: '超导/光量子路线并进' },
    { node: '测控系统', auto: 52, note: '高保真控制电子学待补' },
    { node: '整机集成', auto: 74, note: '原型机迭代节奏稳定' },
    { node: '应用服务', auto: 85, note: '量子通信工程化领先' },
  ],
  fusion: [
    { node: '超导带材', auto: 58, note: '规模化产能与成本爬坡' },
    { node: '壁材部件', auto: 40, note: '耐辐照第一壁待长期验证' },
    { node: '磁体系统', auto: 80, note: '大型磁体自主制造成熟' },
    { node: '装置集成', auto: 88, note: '托卡马克工程全球前列' },
    { node: '示范运行', auto: 72, note: '商业化路径仍在十年外' },
  ],
  space: [
    { node: '宇航器件', auto: 42, note: '部分抗辐照器件待替代' },
    { node: '动力系统', auto: 70, note: '可复用发动机迭代中' },
    { node: '箭体总装', auto: 92, note: '型谱完整·批产能力强' },
    { node: '发射测控', auto: 94, note: '高密度发射体系自主' },
    { node: '星座应用', auto: 78, note: '低轨星座批产降本竞速' },
  ],
  biotech: [
    { node: '科研仪器', auto: 25, note: '质谱电镜等高端依赖进口' },
    { node: '酶与试剂', auto: 38, note: '关键酶与高端试剂受制' },
    { node: '工艺放大', auto: 68, note: '发酵与放大产能占优' },
    { node: '临床转化', auto: 70, note: '审评提速·管线密度高' },
    { node: '规模生产', auto: 86, note: '原料药与代工全球份额' },
  ],
  material: [
    { node: '设计仿真', auto: 32, note: '材料计算软件依赖海外' },
    { node: '前驱原料', auto: 62, note: '稀土与基础原料占优' },
    { node: '制备工艺', auto: 64, note: '中端成熟·高端爬坡' },
    { node: '认证检测', auto: 42, note: '高端认证周期长壁垒高' },
    { node: '批量应用', auto: 78, note: '下游产业牵引替代加速' },
  ],
  robot: [
    { node: '专用芯片', auto: 35, note: '机器人 SoC 与算力受限' },
    { node: '核心部件', auto: 55, note: '减速器电机国产化过半' },
    { node: '本体制造', auto: 86, note: '本体产能全球最大' },
    { node: '具身模型', auto: 74, note: '具身大模型与数据竞速' },
    { node: '场景应用', auto: 90, note: '工厂与服务场景纵深' },
  ],
  comm: [
    { node: '射频器件', auto: 58, note: '高端射频前端仍是短板' },
    { node: '基带芯片', auto: 76, note: '设备侧芯片基本自给' },
    { node: '设备整机', auto: 95, note: '全球份额与成本优势' },
    { node: '组网运营', auto: 96, note: '最大规模商用网络' },
    { node: '行业应用', auto: 90, note: '5G-A 场景渗透加深' },
  ],
  energy: [
    { node: '矿源材料', auto: 68, note: '锂钴海外占比高·加工自主' },
    { node: '电芯制造', auto: 96, note: '产能与成本全球统治级' },
    { node: '系统集成', auto: 95, note: '储能与整车集成成熟' },
    { node: '并网消纳', auto: 90, note: '特高压与调度体系自主' },
    { node: '终端出海', auto: 85, note: '出海面临关税与本地化' },
  ],
  bci: [
    { node: '柔性电极', auto: 35, note: '高密度长期植入待突破' },
    { node: '信号芯片', auto: 32, note: '低功耗采集芯片受制' },
    { node: '解码算法', auto: 62, note: '算法与 AI 协同追赶快' },
    { node: '临床验证', auto: 48, note: '植入临床例数差距大' },
    { node: '康复应用', auto: 58, note: '非侵入消费级先行' },
  ],
  mfg: [
    { node: '工业软件', auto: 33, note: 'CAD/CAE 内核依赖海外' },
    { node: '数控系统', auto: 42, note: '五轴高端系统攻坚中' },
    { node: '基础部件', auto: 46, note: '高端轴承丝杠精度差距' },
    { node: '整机装备', auto: 72, note: '中端机床全球份额最大' },
    { node: '产线集成', auto: 84, note: '系统集成与改造能力强' },
  ],
};

// ============================================================================
// 二、卡脖子清单（与 DOMAINS.neck 文意一致地逐条拆分）
// item ≤12 字 · severity 3 重度（真正硬卡点）/ 2 中度 / 1 轻度 · alt ≤18 字
// 全库 severity=3 条目控制在 5-10 条
// ============================================================================
export const NECK_ITEMS = {
  ai: [
    { item: '高端训练 GPU', severity: 3, alt: '国产算力集群+系统级优化' },
    { item: 'HBM 高带宽内存', severity: 2, alt: '国产 HBM 产线爬坡' },
    { item: '先进制程供给', severity: 2, alt: 'Chiplet+成熟制程压榨' },
  ],
  semi: [
    { item: 'EUV 光刻机', severity: 3, alt: '多重曝光+先进封装绕行' },
    { item: '高端 EDA 全流程', severity: 3, alt: '国产点工具拼接成链' },
    { item: '高端光刻胶', severity: 2, alt: '国产中端替代逐级验证' },
    { item: '电子特气提纯', severity: 1, alt: '国产化率持续提升' },
  ],
  quantum: [
    { item: '稀释制冷机', severity: 3, alt: '国产 mK 级样机迭代' },
    { item: '高保真测控电子学', severity: 2, alt: '自研测控一体机替代' },
  ],
  fusion: [
    { item: '高温超导带材产能', severity: 2, alt: '多家产线扩产摊薄成本' },
    { item: '耐辐照第一壁材料', severity: 2, alt: '钨基材料+长周期验证' },
  ],
  space: [
    { item: '宇航级抗辐照器件', severity: 2, alt: '国产化替代+冗余设计' },
    { item: '可复用发动机寿命', severity: 2, alt: '高频回收试验快速迭代' },
  ],
  biotech: [
    { item: '高端科研仪器', severity: 3, alt: '国产质谱电镜进口替代' },
    { item: '关键酶与试剂', severity: 2, alt: '国产酶库与底盘自建' },
    { item: '生信基础工具', severity: 1, alt: '开源生态+自研数据库' },
  ],
  material: [
    { item: '航空高温合金', severity: 2, alt: '国产牌号+适航验证推进' },
    { item: '材料计算软件', severity: 2, alt: 'AI for Science 换道' },
    { item: '高端认证体系', severity: 1, alt: '国内标准与互认推进' },
  ],
  robot: [
    { item: '高精度减速器', severity: 2, alt: '谐波/RV 国产份额上升' },
    { item: '机器人专用 SoC', severity: 2, alt: '通用芯片+域控方案过渡' },
    { item: '力矩电机', severity: 1, alt: '国产电机批量装机' },
  ],
  comm: [
    { item: '高端射频前端', severity: 2, alt: '国产滤波器 PA 替代' },
    { item: '部分核心芯片', severity: 2, alt: '自研芯片+多源备份' },
  ],
  energy: [
    { item: '高端电力电子器件', severity: 2, alt: 'SiC 产线国产化推进' },
    { item: '部分高端电池设备', severity: 1, alt: '设备国产化率已超八成' },
  ],
  bci: [
    { item: '高密度柔性电极', severity: 3, alt: '材料与工艺联合攻关' },
    { item: '神经信号专用芯片', severity: 2, alt: '低功耗采集芯片自研' },
    { item: '临床数据积累', severity: 2, alt: '多中心临床加速入组' },
  ],
  mfg: [
    { item: '五轴高端数控系统', severity: 2, alt: '国产系统批量验证迭代' },
    { item: '高端轴承丝杠', severity: 2, alt: '材料热处理工艺攻关' },
    { item: '工业软件内核', severity: 2, alt: '自研内核+开源路线' },
  ],
};

export const SEVERITY_LABEL = { 3: '重度', 2: '中度', 1: '轻度' };

// ============================================================================
// 三、公开口径里程碑（每域 3 条 · 2019-2026 · 表述克制 · 广为公开的节点）
// ============================================================================
export const MILESTONES = {
  ai: [
    { year: 2023, event: '多家机构发布中文基础大模型' },
    { year: 2024, event: '开源大模型生态加速成形' },
    { year: 2025, event: '国产开源推理模型获全球关注' },
  ],
  semi: [
    { year: 2019, event: '集成电路大基金二期设立' },
    { year: 2022, event: '美方出台先进制程出口管制' },
    { year: 2023, event: '国产先进制程手机芯片面世' },
  ],
  quantum: [
    { year: 2020, event: '九章光量子计算原型机问世' },
    { year: 2021, event: '祖冲之二号超导原型机发布' },
    { year: 2024, event: '国产量子计算机开放云服务' },
  ],
  fusion: [
    { year: 2021, event: 'EAST 实现千秒级等离子体运行' },
    { year: 2022, event: 'HL-2M 等离子体电流破百万安培' },
    { year: 2024, event: '紧凑型聚变实验装置开工建设' },
  ],
  space: [
    { year: 2020, event: '嫦娥五号月球采样返回' },
    { year: 2021, event: '天问一号成功着陆火星' },
    { year: 2024, event: '嫦娥六号月背采样返回' },
  ],
  biotech: [
    { year: 2020, event: '新冠灭活疫苗附条件上市' },
    { year: 2021, event: '二氧化碳人工合成淀粉发表' },
    { year: 2023, event: '国产 mRNA 疫苗获紧急使用' },
  ],
  material: [
    { year: 2021, event: '万吨级碳纤维生产基地投产' },
    { year: 2022, event: 'C919 取证带动国产材料验证' },
    { year: 2023, event: '碳化硅衬底产能快速扩张' },
  ],
  robot: [
    { year: 2021, event: '工业机器人装机量全球占比过半' },
    { year: 2023, event: '人形机器人发展指导意见发布' },
    { year: 2025, event: '多款国产人形机器人量产交付' },
  ],
  comm: [
    { year: 2019, event: '5G 商用牌照正式发放' },
    { year: 2021, event: '6G 推进组发布白皮书' },
    { year: 2024, event: '5G-A 启动规模商用' },
  ],
  energy: [
    { year: 2020, event: '双碳目标正式提出' },
    { year: 2022, event: '动力电池全球装机份额过半' },
    { year: 2024, event: '风光装机提前达成规划目标' },
  ],
  bci: [
    { year: 2021, event: '脑科学重大科技项目启动' },
    { year: 2024, event: '微创植入式脑机接口开展临床' },
    { year: 2025, event: '脑机接口产业创新意见出台' },
  ],
  mfg: [
    { year: 2021, event: '国产五轴机床进入批量应用' },
    { year: 2023, event: '工业母机攻关列入国家部署' },
    { year: 2024, event: '增材制造在航空领域放量' },
  ],
};

// ============================================================================
// 四、中美六维记分牌（示意标定 · 方向符合公开共识）
// dim 六维 · cn/us 0-100 · note ≤16 字
// ============================================================================
export const SCORECARD = [
  { dim: '论文产出', cn: 88, us: 80, note: '总量领先·顶刊占比上升' },
  { dim: '专利布局', cn: 85, us: 78, note: '数量优势·海外布局偏弱' },
  { dim: '顶尖人才', cn: 55, us: 92, note: '存量差距大·回流加速' },
  { dim: '风险资本', cn: 45, us: 95, note: '硬科技早期资本不足' },
  { dim: '产业产能', cn: 95, us: 62, note: '全链条产能统治级' },
  { dim: '算力基建', cn: 70, us: 96, note: '总量追赶·高端芯片受限' },
];

// ============================================================================
// 五、攻关推演模型 simTech —— 确定性差分模型（零随机）
// ----------------------------------------------------------------------------
// 机理：
//   起点      = DOMAINS[k].auto（2026 基准自主度）
//   年度势能  base = (trl/9)*1.6 + rd*0.045 + talent*0.03 + open*0.025
//              —— 成熟度牵引 + 研发投入 + 人才引进 + 开放合作（开放引进最快）
//   增益      GAIN = 2.0 —— 把投入势能换算为年度自主度增量的工程化转化系数，
//              标定锚点：semi(rd80,talent70,open30) 的突破年落在 2031-2034。
//   收敛阻尼  ×(1 - auto/130) —— 自主度越高，剩余环节越硬，增长越慢。
//   管制冲击  locked：2027/2030 两次，hit = 3 + open*0.06
//              （开放度越高、引进依赖越深，断供时被反噬越重）；
//              chase：仅 2030 一次、力度减半；lead：无冲击。
//              冲击吃掉当年增量（存量能力不消失，轨迹不倒退、可被打平）。
//   夹取      auto ∈ [起点-10, 97]（97 为「永远补不完最后一环」的天花板）。
// ============================================================================
export function simTech({ k, rd, talent, open } = {}) {
  const d = DOMAIN_BY_K[k];
  if (!d) throw new Error(`simTech: 未知领域 key "${k}"`);

  // 杠杆归一：缺省 50，显式 0 保留为 0，夹取 [0,100]
  const lever = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50;
  };
  const RD = lever(rd);
  const TA = lever(talent);
  const OP = lever(open);

  const base = (d.trl / 9) * 1.6 + RD * 0.045 + TA * 0.03 + OP * 0.025;
  const GAIN = 2.0;

  const start = d.auto;
  const lo = start - 10;
  const hi = 97;

  const shocks = [];
  const path = [{ year: 2026, auto: round1(start) }];
  let auto = start;

  for (let year = 2027; year <= 2035; year++) {
    const growth = Math.max(0, GAIN * base * (1 - auto / 130));
    let next = auto + growth;

    let hit = 0;
    let label = '';
    if (d.tier === 'locked' && (year === 2027 || year === 2030)) {
      hit = 3 + OP * 0.06;
      label = year === 2027 ? '出口管制升级' : '断供面扩大';
    } else if (d.tier === 'chase' && year === 2030) {
      hit = (3 + OP * 0.06) / 2;
      label = '技术供应链摩擦';
    }
    if (hit > 0) {
      shocks.push({ year, label, hit: round1(hit) });
      next -= hit;
      if (next < auto) next = auto; // 冲击至多吃掉当年进度，不击穿存量
    }

    auto = Math.max(lo, Math.min(hi, next));
    path.push({ year, auto: round1(auto) });
  }

  const bt = path.find((p) => p.auto >= 85);
  const breakthrough = bt ? bt.year : null;

  let note;
  if (d.tier === 'locked') {
    note = OP >= 60
      ? '以开放换速度，以速度换脆弱——引进越深，断供越痛，自主链才是底仓。'
      : '低开放慢爬坡：冲击伤害有限，但代差收敛以十年计，时间是最贵的成本。';
  } else if (d.tier === 'chase') {
    note = RD >= 60
      ? '高强度投入下并跑可转领跑，2030 年前后的供应链摩擦是必经的压力测试。'
      : '并跑位置不进则退——投入强度决定是收敛代差，还是被重新拉开。';
  } else {
    note = '领先位置的真问题不是追赶者，而是需求与利润能否养得起下一代技术。';
  }

  return { path, breakthrough, shocks, note };
}

// ============================================================================
// 六、攻关推演报告（Markdown · 尾注口径声明）
// domain: DOMAINS 条目（或其 k）；levers: {rd,talent,open}；sim: simTech 结果
// ============================================================================
export function buildTechReport({ domain, levers = {}, sim }) {
  const d = typeof domain === 'string' ? DOMAIN_BY_K[domain] : domain;
  if (!d || !sim || !Array.isArray(sim.path)) {
    throw new Error('buildTechReport: 需要 domain 与 simTech 结果');
  }
  const at = (y) => {
    const p = sim.path.find((x) => x.year === y);
    return p ? p.auto : null;
  };
  const lv = (v) => (Number.isFinite(Number(v)) ? Number(v) : 50);

  const L = [];
  L.push(`# ${d.name} 攻关推演报告`);
  L.push('');
  L.push(`基准日 ${TECH_AS_OF} · 梯队：${TIER_LABEL[d.tier]} · TRL ${d.trl} · 起点自主度 ${d.auto}%`);
  L.push('');
  L.push('## 投入组合');
  L.push(`- 研发投入强度：${lv(levers.rd)} / 100`);
  L.push(`- 人才引进力度：${lv(levers.talent)} / 100`);
  L.push(`- 开放合作度：${lv(levers.open)} / 100`);
  L.push('');
  L.push('## 十年轨迹关键点');
  L.push(`- 2026 起点：自主度 ${at(2026)}%`);
  L.push(`- 2030 中段：自主度 ${at(2030)}%`);
  L.push(`- 2035 终局：自主度 ${at(2035)}%`);
  L.push(
    sim.breakthrough
      ? `- 突破节点：${sim.breakthrough} 年自主度首次达到 85%（示意阈值）`
      : '- 突破节点：十年窗口内未达 85% 阈值——投入组合不足以收敛代差'
  );
  L.push('');
  L.push('## 冲击事件');
  if (sim.shocks.length === 0) {
    L.push('- 无外部冲击设定（领先梯队示意口径）');
  } else {
    sim.shocks.forEach((s) => {
      L.push(`- ${s.year} 年 ${s.label}：当年进度被吃掉约 ${s.hit} 个点`);
    });
  }
  L.push('');
  L.push(`> ${sim.note}`);
  L.push('');
  L.push('## 卡脖子清单');
  (NECK_ITEMS[d.k] || []).forEach((n) => {
    L.push(`- [${SEVERITY_LABEL[n.severity]}] ${n.item} —— 替代路线：${n.alt}`);
  });
  L.push('');
  L.push('---');
  L.push('示意标定 · 非预测 · 非投资建议');
  return L.join('\n');
}
