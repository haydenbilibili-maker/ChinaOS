/** 总理权限半径 · 四任种子数据（公开政策文本与制度事实，可审计） */

/** @typedef {import('../../domain/governance').PremierTerm} PremierTerm */
/** @typedef {import('../../domain/governance').StructuralDriver} StructuralDriver */

/** @type {PremierTerm[]} */
export const PREMIER_TERMS = [
  {
    id: 'zhu',
    name: '朱镕基',
    start: 1998,
    end: 2003,
    radius: ['direction', 'decision', 'execution'],
    radiusNote: '覆盖决策层与执行层，且部分触及路线层——唯一一位「既设计方案、又拍板剂量、还亲自执行」的总理',
    keyAnnotation: '强势总理是危机与制度共同的产物，不只是个人性格。',
    constraints:
      '党政分工相对清晰，经济事务由国务院主导是制度惯例；亚洲金融危机、国企濒临崩溃等危机驱动赋予改革者非常规授权。',
    radiusPhases: [
      { start: 1998, end: 2003, radius: ['direction', 'decision', 'execution'], directionPartial: true },
    ],
    signaturePolicies: [
      { year: 1998, title: '国企三年脱困与下岗分流', layer: 'decision', note: '结构性改革剂量由国务院主导拍板', issueId: 'dir-soe-market' },
      { year: 1994, title: '分税制改革', layer: 'decision', note: '任副总理时主导，重塑央地财政契约', issueId: 'dec-fiscal-relation' },
      { year: 1998, title: '金融体系整肃', layer: 'decision', note: '关闭高风险金融机构，重建银行体系', issueId: 'dec-local-debt' },
      { year: 1998, title: '住房商品化改革', layer: 'decision', note: '停止福利分房，开启商品房时代', issueId: 'dir-real-estate-role' },
      { year: 2001, title: '入世谈判', layer: 'direction', note: '触及对外开放路线边缘，国务院深度参与谈判', issueId: 'exec-services-trade' },
    ],
    inflectionPoints: [
      { year: 1998, event: '亚洲金融危机应对', significance: '危机授权窗口打开，国企改革与金融整肃获非常规政治空间' },
      { year: 2001, event: '加入 WTO', significance: '对外开放路线节点，国务院谈判团队具实质话语权' },
    ],
  },
  {
    id: 'wen',
    name: '温家宝',
    start: 2003,
    end: 2013,
    radius: ['decision', 'execution'],
    radiusNote: '前期(2003–2008)有真实第二层空间，后期决策层话语权触顶——前强后弱',
    constraints:
      '全球化红利期与财政扩张窗口并存；2008 后四万亿后果（地方债务、产能过剩）使评价复杂化；2012 后路线层话语权天花板显现。',
    radiusPhases: [
      { start: 2003, end: 2008, radius: ['decision', 'execution'] },
      { start: 2008, end: 2013, radius: ['execution'] },
    ],
    signaturePolicies: [
      { year: 2006, title: '农业税全面取消', layer: 'decision', note: '四十年再平衡走得最实的一段', issueId: 'dec-fiscal-relation' },
      { year: 2003, title: '新型农村合作医疗', layer: 'decision', note: '社保体系初建，决策层剂量选择', issueId: 'dec-social-security' },
      { year: 2008, title: '城乡义务教育免费', layer: 'decision', note: '财政负担与再分配剂量由中央定调', issueId: 'dec-social-security' },
      { year: 2007, title: '四不诊断', layer: 'decision', note: '「不稳定、不平衡、不协调、不可持续」——典型第二层诊断' },
      { year: 2008, title: '四万亿刺激', layer: 'decision', note: '决策层大剂量扩张，后果塑造后续十年', issueId: 'dec-deficit' },
    ],
    inflectionPoints: [
      { year: 2007, event: '四不诊断', significance: '总理层面对结构问题的第二层诊断权仍有效' },
      { year: 2008, event: '四万亿刺激', significance: '决策层大剂量干预，其后地方债与产能过剩阴影延续', global: true },
      { year: 2012, event: '改革不进则退', significance: '路线层话语权触顶，政改呼吁未转化为议程' },
    ],
  },
  {
    id: 'likeqiang',
    name: '李克强',
    start: 2013,
    end: 2023,
    radius: ['decision', 'execution'],
    radiusNote: '决策层下沿 → 执行层，曲线斜率最陡的一段——财经委升格后国务院决策角色系统性让渡',
    keyAnnotation: '无法在结构层动刀时，话语校正成为剩余工具。',
    constraints:
      '中央财经领导小组（后升格为委员会）在经济决策中地位上升；「克强经济学」早期有独立品牌，后期收缩至执行与话语层。',
    radiusPhases: [
      { start: 2013, end: 2017, radius: ['decision', 'execution'] },
      { start: 2017, end: 2023, radius: ['execution'] },
    ],
    signaturePolicies: [
      { year: 2013, title: '克强经济学', layer: 'decision', note: '不刺激、去杠杆、结构改革——独立经济主张', issueId: 'dir-security-growth' },
      { year: 2014, title: '放管服改革', layer: 'execution', note: '简政放权、削减审批——第二、三层之间', issueId: 'exec-digital-gov' },
      { year: 2020, title: '6亿人月收入1000元', layer: 'execution', note: '无法改变结构时的公共认知校正', issueId: 'dec-cash-transfer' },
      { year: 2020, title: '地摊经济', layer: 'execution', note: '微观执行层话语，影响力停留于话语层', issueId: 'exec-enforcement' },
    ],
    inflectionPoints: [
      { year: 2013, event: '克强经济学提出', significance: '决策层仍有独立经济话语空间' },
      { year: 2018, event: '中央财经委升格', significance: '经济决策中枢上移，国务院决策角色系统性让渡', global: true },
      { year: 2020, event: '6亿人1000元表述', significance: '结构无法改变时的话语校正动作' },
    ],
  },
  {
    id: 'liqiang',
    name: '李强',
    start: 2023,
    end: null,
    radius: ['execution'],
    radiusNote: '执行层唯一——不是被削弱的强势总理，而是被重新定义的执行总部负责人',
    keyAnnotation: '他不是被削弱的强势总理，他是被重新定义的执行总部负责人。',
    constraints:
      '修订后《国务院组织法》明确党中央集中统一领导；2024 年取消延续三十年的总理记者会；重大经济决策中枢在党的机构。',
    radiusPhases: [{ start: 2023, end: null, radius: ['execution'] }],
    signaturePolicies: [
      { year: 2024, title: '民营经济促进法', layer: 'execution', note: '立法保护民企平等使用生产要素', issueId: 'dir-soe-market' },
      { year: 2024, title: '规范涉企执法专项行动', layer: 'execution', note: '整治乱收费/乱罚款/乱检查/乱查封', issueId: 'exec-enforcement' },
      { year: 2024, title: '清理拖欠企业账款', layer: 'execution', note: '合同履约与预算执行抓手', issueId: 'exec-arrears' },
      { year: 2024, title: '全国统一大市场 · 公平竞争审查', layer: 'execution', note: '规则执行与监管协调', issueId: 'exec-unified-market' },
      { year: 2024, title: '单方面免签扩容 · 240小时过境免签', layer: 'execution', note: '口岸与移民管理执行参数', issueId: 'exec-visa' },
      { year: 2024, title: '跨境服务贸易负面清单', layer: 'execution', note: '准入与监管方式细化', issueId: 'exec-services-trade' },
    ],
    inflectionPoints: [
      { year: 2023, event: '国务院组织法修订', significance: '法定确认党中央集中统一领导' },
      { year: 2024, event: '总理记者会取消', significance: '三十年惯例终止，总理公共话语渠道收缩', global: true },
    ],
  },
];

/** @type {StructuralDriver[]} */
export const STRUCTURAL_DRIVERS = [
  {
    id: 'driver1',
    title: '党政关系重构',
    summary: '从「党管方向、政府管经济」回归「党领导一切」，国务院经济决策中心地位让渡。',
    mechanism:
      '最根本的驱动力。中央财经委（原领导小组）升格后，赤字率、化债、再分配等「剂量」决策上移至党的机构；' +
      '修订后的《国务院组织法》将「坚持党中央集中统一领导」写入组织原则。总理从「经济总指挥」转为「执行总部负责人」——' +
      '这不是人事更迭，而是决策中枢的物理迁移。',
  },
  {
    id: 'driver2',
    title: '议题性质变化',
    summary: '从「做增量」到「分存量」，存量分配必触及权力核心，议题本身向上吸附。',
    mechanism:
      '朱镕基面对入世、市场化、城镇化——增量改革可让技术官僚放手。今天面对再平衡、财税、房产税、国企定位——' +
      '存量分配必触及产权与政治接受度，只有最高层敢拍板。总理权限收缩，部分是议题本身向上吸的结果：' +
      '当改革从「把蛋糕做大」变成「怎么切蛋糕」，执行层自然够不着。',
  },
  {
    id: 'driver3',
    title: '风险偏好变化',
    summary: '从「发展是硬道理」转向「统筹发展和安全」，安全议题天然是集中决策议题。',
    mechanism:
      '安全、科技自主、产业链韧性、金融稳定等议题在优先级序列中系统性前移。' +
      '风险偏好从扩张默认转为审慎默认——这意味着更多议题被归类为「需要集中决策」，' +
      '总理在执行层的腾挪空间仍在，但决策层的处方权持续上移且向安全倾斜。',
  },
];

/** 全局时间轴标注（跨任期） */
export const GLOBAL_INFLECTIONS = [
  { year: 2008, event: '四万亿刺激', significance: '决策层大剂量扩张，塑造此后十年地方债与产能格局' },
  { year: 2018, event: '中央财经委升格', significance: '经济决策中枢上移，国务院系统性让渡' },
  { year: 2024, event: '总理记者会取消', significance: '总理公共话语渠道收缩，执行总部角色定型' },
];

export default PREMIER_TERMS;
