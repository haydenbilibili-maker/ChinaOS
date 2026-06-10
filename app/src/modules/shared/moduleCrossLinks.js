/** 各模块横向互链 · 单一数据源 */
const MAP = {
  soe: [
    { to: '/civilization', label: '文明透视 · 卷十二「盐铁逻辑」', note: '国有资本是盐铁官营在工业文明维度的重装实现。' },
    { to: '/private', label: '民营经济 · 国进民退边界', note: '命脉国有 vs 市场竞争的物理分界线。' },
    { to: '/reform', label: '改革开放 · 混改与抓大放小', note: '国企从普遍存量改革到结构性出清的历史脉络。' },
  ],
  reform: [
    { to: '/private', label: '民营经济 · 56789', note: '改革释放的市场空间与民营活力互为表里。' },
    { to: '/soe', label: '国有资本 · 战略底座', note: '抓大放小后的央企链主格局。' },
    { to: '/foreign-trade', label: '对外贸易 · 入世红利', note: '2001 入世嵌入全球分工的物理后果。' },
  ],
  demographic: [
    { to: '/housing', label: '住房地产 · 周期', note: '人口负增长与库存周期的叠加效应。' },
    { to: '/healthcare', label: '医疗医保 · DRG', note: '老龄化驱动的医保支付改革。' },
    { to: '/education', label: '教育 · 普职分流', note: '人口结构变化下的教育供给再配置。' },
  ],
  ruleoflaw: [
    { to: '/governance', label: '治理现代化 · 数字政府', note: '智慧法院与网格治理的法治接口。' },
    { to: '/offshore', label: '港澳离岸 · 普通法窗口', note: '涉外法治与离岸司法管辖的衔接。' },
    { to: '/anticorruption', label: '反腐专题 · 制度约束', note: '法治化反腐与权力运行的边界。' },
  ],
  manufacturing: [
    { to: '/techtree', label: '科技树 · 卡脖子清单', note: 'GVC 微笑曲线与国产替代的节点对应。' },
    { to: '/semiconductor', label: '半导体 · 芯片主权', note: '制造业皇冠上的明珠。' },
    { to: '/robotics', label: '机器人 · 密度与人形', note: '智能制造的物理执行层。' },
  ],
  military: [
    { to: '/straits', label: '台海局势 · 地缘重力', note: 'A2/AD 与统一确定性的物理盘面。' },
    { to: '/techtree', label: '科技树 · 军事分支', note: '装备迭代与作战概念的技术底座。' },
    { to: '/deterrence', label: '威慑战略 · 可信承诺', note: '能力 × 决心 × 可信度的威慑平衡。' },
  ],
  straits: [
    { to: '/thucydides', label: '修昔底德陷阱 · 实力窗口', note: '台海是结构高危叠加擦枪走火的最可能燧石。' },
    { to: '/deterrence', label: '威慑战略 · 边缘政策', note: '封控与介入的威慑可信度计算。' },
    { to: '/military', label: '军事力量 · A2/AD', note: '区域拒止能力的装备与部署底座。' },
    { to: '/semiconductor', label: '半导体 · 硅盾', note: '台积电与全球产业链人质的非对称筹码。' },
  ],
  thucydides: [
    { to: '/diplomacy', label: '外交博弈 · 竞合管控', note: '实力转移窗口落到中美矢量盘。' },
    { to: '/straits', label: '台海局势', note: '最可能的结构触发点。' },
    { to: '/realism', label: '现实主义 · 进攻性悲观', note: '结构约束 vs 能动空间的对照。' },
  ],
  realism: [
    { to: '/thucydides', label: '修昔底德陷阱 · 可规避窗口', note: '共享结构起点，不同政策结论。' },
    { to: '/diplomacy', label: '外交博弈', note: '大国政治的实操盘面。' },
    { to: '/deterrence', label: '威慑战略', note: '谢林式边缘政策与可信承诺。' },
  ],
  deterrence: [
    { to: '/straits', label: '台海 · 介入代价', note: '外部干预的威慑平衡计算。' },
    { to: '/military', label: '军事力量', note: '威慑能力的物理载体。' },
    { to: '/gametheory', label: '博弈论 · 重复博弈', note: '以牙还牙与边缘策略的均衡。' },
  ],
  omnisecurity: [
    { to: '/food-security', label: '粮食安全 · 18 亿亩红线', note: '大安全观第一支柱的专题深潜。' },
    { to: '/energy', label: '能源 · 压舱石', note: 'SPR 与非化石转型的能源冗余。' },
    { to: '/supplychain', label: '供应链 · 韧性备份', note: '极端制裁下的生存确定性。' },
    { to: '/computing', label: '算力设施 · 语义防火墙', note: '网络主权与数据流向控制。' },
  ],
  redweb: [
    { to: '/powerlogic', label: '权力逻辑 · 儒表法里', note: '权贵网络与数字利维坦的底层代码。' },
    { to: '/govsystem', label: '政府体系 · 执行算法', note: '压力型体制与晋升激励。' },
    { to: '/talent', label: '人才库 · 公开履历', note: '人物节点与网络结构的交叉验证。' },
  ],
  resources: [
    { to: '/marine', label: '海洋经济 · 航道安全', note: '权益矿与海上生命线的耦合。' },
    { to: '/bri', label: '一带一路 · 六廊六路', note: '海外资源获取的陆海通道。' },
    { to: '/energy', label: '能源 · 对外依存', note: '油气进口与战略储备的物理约束。' },
  ],
  marine: [
    { to: '/straits', label: '台海 · 第一岛链', note: '海权突破与岛链重力。' },
    { to: '/resources', label: '海外资源 · 权益矿', note: '海上通道与资源获取的联动。' },
    { to: '/foreign-trade', label: '对外贸易 · 海运通道', note: '全球贸易流量的物理载体。' },
  ],
  polar: [
    { to: '/resources', label: '海外资源 · 北极航道', note: '极地航线缩短亚欧航程的物理收益。' },
    { to: '/diplomacy', label: '外交博弈 · 极地治理', note: '北极理事会与规则制定权。' },
    { to: '/marine', label: '海洋经济 · 海权', note: '极地科考与商业开发的战略延伸。' },
  ],
  energy: [
    { to: '/nuclear', label: '核电 · 华龙一号', note: '基荷电源与能源压舱石。' },
    { to: '/smartgrid', label: '智能电网 · 特高压', note: '西电东送与源网荷储一体化。' },
    { to: '/hydrogen', label: '氢能 · 绿氢链条', note: '非化石能源的储运载体。' },
    { to: '/omnisecurity', label: '大安全观 · 能源冗余', note: 'SPR 与能源主权保障。' },
  ],
  private: [
    { to: '/soe', label: '国有资本 · 国进民退边界', note: '56789 贡献 vs 命脉国有控盘。' },
    { to: '/enterprise500', label: '民企 500 强 · 治理透视', note: '头部民营企业的产业分布。' },
    { to: '/reform', label: '改革开放 · 两个毫不动摇', note: '从政策善意到法律确权的演进。' },
  ],
  offshore: [
    { to: '/financeRmb', label: '人民币国际化 · CIPS', note: '离岸窗口与跨境清算体系。' },
    { to: '/ruleoflaw', label: '法治建设 · 涉外法治', note: '普通法窗口与内地法治的接口。' },
    { to: '/fdi', label: '跨境投资 · 双向流动', note: '离岸资本与内地市场的通道。' },
  ],
  semiconductor: [
    { to: '/manufacturing', label: '制造业 · GVC 位势', note: '芯片在微笑曲线上的锚点。' },
    { to: '/techtree', label: '科技树 · 卡脖子', note: 'EDA/光刻/材料的节点清单。' },
    { to: '/straits', label: '台海 · 硅盾', note: '10nm 以下产能的地缘集中度。' },
  ],
  computing: [
    { to: '/aiplus', label: '人工智能+ · 智算', note: '算力主权与行业大模型的底座。' },
    { to: '/data-element', label: '数据要素 · 东数西算', note: '算力枢纽与数据确权。' },
    { to: '/semiconductor', label: '半导体 · 芯片', note: '算力设施的硬件根节点。' },
  ],
  finance: [
    { to: '/debt', label: '地方债务 · 省际热力', note: '系统性风险的地理分布。' },
    { to: '/financeRmb', label: '人民币国际化', note: '货币主权与跨境支付。' },
    { to: '/greenfinance', label: '绿色金融 · 碳定价', note: '双碳目标下的金融工具。' },
  ],
  governance: [
    { to: '/govsystem', label: '政府体系 · 压力型体制', note: '网格治理与科层执行的接口。' },
    { to: '/socialgov', label: '基层治理 · 综治', note: '最后一公里与数字政府下沉。' },
    { to: '/ruleoflaw', label: '法治建设', note: '治理现代化的法治约束。' },
  ],
  govsystem: [
    { to: '/governance', label: '治理现代化', note: '执行算法与数字政府的上层设计。' },
    { to: '/principalagent', label: '委托代理 · 激励相容', note: '央地关系与信息不对称。' },
    { to: '/powerlogic', label: '权力逻辑', note: '儒表法里与数字利维坦。' },
  ],
  powerlogic: [
    { to: '/civilization', label: '文明透视 · 源代码', note: '权力逻辑在 12 卷叙事中的位置。' },
    { to: '/redweb', label: '红网 · 结构分析', note: '权贵网络与权力物理学的交叉。' },
    { to: '/govsystem', label: '政府体系', note: '压力型体制与执行算法。' },
  ],
  foodSecurity: [
    { to: '/omnisecurity', label: '大安全观 · 粮食支柱', note: '18 亿亩红线在大安全框架中的位置。' },
    { to: '/rural', label: '乡村振兴 · 县域', note: '粮食生产与农村制度的耦合。' },
    { to: '/bri', label: '一带一路 · 海外农业', note: '海外粮仓与进口多元化。' },
  ],
  ecology: [
    { to: '/energy', label: '能源 · 双碳转型', note: '非化石能源与碳排放强度。' },
    { to: '/greenfinance', label: '绿色金融 · 碳市场', note: 'GEP 与碳定价的金融化。' },
    { to: '/megaprojects', label: '超级工程 · 生态 ROI', note: '大型生态工程的物理约束。' },
  ],
  bri: [
    { to: '/foreign-trade', label: '对外贸易 · RCEP', note: '陆海通道与贸易流量。' },
    { to: '/resources', label: '海外资源 · 权益矿', note: '一带一路上的资源获取节点。' },
    { to: '/financeRmb', label: '人民币国际化', note: '项目融资与跨境清算。' },
  ],
  foreignTrade: [
    { to: '/reform', label: '改革开放 · 入世红利', note: '外贸依存度峰值与回落。' },
    { to: '/bri', label: '一带一路', note: '贸易通道的陆海延伸。' },
    { to: '/marine', label: '海洋经济 · 航运', note: '海运通道与造船能力。' },
  ],
  supplychain: [
    { to: '/omnisecurity', label: '大安全观 · 生存冗余', note: '供应链备份与国产替代。' },
    { to: '/semiconductor', label: '半导体 · 卡脖子', note: '关键节点的断供风险。' },
    { to: '/materials', label: '关键材料 · 替代', note: '上游材料的韧性建设。' },
  ],
  hydrogen: [
    { to: '/energy', label: '能源 · 绿电制氢', note: '非化石能源的储运载体。' },
    { to: '/automotive', label: '汽车主权 · 燃料电池', note: '氢能汽车的产业化路径。' },
    { to: '/smartgrid', label: '智能电网 · 储能', note: '源网荷储与氢储能协同。' },
  ],
  nuclear: [
    { to: '/energy', label: '能源 · 压舱石', note: '基荷电源与能源结构。' },
    { to: '/materials', label: '关键材料 · 核级', note: '核级材料与进口替代。' },
    { to: '/megaprojects', label: '超级工程 · 华龙一号', note: '核电项目的多维 ROI。' },
  ],
  logistics: [
    { to: '/supplychain', label: '供应链 · 韧性', note: '多式联运与备份通道。' },
    { to: '/infrastructure', label: '基础设施 · 专项债', note: '物流枢纽的新老基建。' },
    { to: '/foreign-trade', label: '对外贸易 · 通道', note: '进出口流量的物理载体。' },
  ],
  cognition: [
    { to: '/middleincometrap', label: '中等收入陷阱', note: '长波周期与发展阶段窗口。' },
    { to: '/pathdependence', label: '路径依赖 · 锁定', note: '技术路线与制度锁定的交互。' },
    { to: '/reform', label: '改革开放 · 算法演进', note: '康波下行期的改革节奏。' },
  ],
  gametheory: [
    { to: '/deterrence', label: '威慑战略 · 边缘政策', note: '重复博弈与可信承诺。' },
    { to: '/diplomacy', label: '外交博弈', note: '大国互动的均衡求解。' },
    { to: '/straits', label: '台海 · 博弈盘面', note: '统一/维持/介入的三方博弈。' },
  ],
};

export function getCrossLinks(moduleId) {
  return MAP[moduleId] || [];
}

export default MAP;
