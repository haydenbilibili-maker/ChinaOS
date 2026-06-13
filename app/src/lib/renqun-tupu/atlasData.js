/**
 * 人群画像总图谱 · 切片聚簇 / 八轴 / 校准点元数据
 * 标题与路由以 gy/registry + app/registry 为准；此处仅保留图谱专属文案与布局。
 */

/** @typedef {{ num: string, axes: string[], blurb?: string, sens?: string, extremal?: boolean }} AtlasSliceMeta */

/** @type {{ head: string, slices: AtlasSliceMeta[] }[]} */
export const ATLAS_CLUSTERS = [
  {
    head: '基准三片 · 价目表假说起源',
    slices: [
      { num: '03', axes: ['年龄', '阶层'], blurb: '机器的盲区 · 概率的暗物质。退出是最诚实的反馈。' },
      { num: '04', axes: ['身份', '横切'], blurb: '挤压性存在。被允许的可见形态=被允许的存在形态。' },
      { num: '05', axes: ['劳动', '底层'], blurb: '悬空的基础设施。同时是稳定器与风险源。' },
    ],
  },
  {
    head: '轴 · 阶层与财富(含退出)',
    slices: [
      { num: '08', axes: ['阶层', '需求侧'], blurb: '质押态进程 · 三张折价的凭证。防御性人生与需求侧微观地基。' },
      { num: '10', axes: ['阶层', '退出'], blurb: '可迁移进程 · 要钱不要人的塔尖。退出成本峰值校准点。', extremal: true, sens: '校准点' },
      { num: '16', axes: ['退出', '境外'], blurb: '境外节点 · 未结清的账户。退出语法的物理完成式。', sens: '敏·中高' },
    ],
  },
  {
    head: '轴 · 政治位置与治理',
    slices: [
      { num: '07', axes: ['体制内', '对照组'], blurb: '常驻内存 · 刚兑的最后分区。CH-03 形态 D 的载体人群。' },
      { num: '12', axes: ['组织化', '对照组'], blurb: '预装组织力 · 被定向赎买的人群。组织化峰值校准点。', extremal: true, sens: '校准点·敏' },
      { num: '24', axes: ['治理', '编外'], blurb: '借权代理进程 · 编外治理者。权力的临时工化与背锅缓冲层。' },
    ],
  },
  {
    head: '轴 · 城乡与户籍断层',
    slices: [
      { num: '06', axes: ['城乡', '流动'], blurb: '未完成的迁徙 · 换页内存。零工模块的终局预演。' },
      { num: '20', axes: ['城乡', '青年'], blurb: '未被监控的中间件 · 留下的人。编制原产地。' },
      { num: '21', axes: ['户籍', '夹心'], blurb: '访客会话 · 有城无籍。事实市民,法律外人。' },
    ],
  },
  {
    head: '轴 · 性别 / 年龄两端',
    slices: [
      { num: '17', axes: ['性别', '中年'], blurb: '后台守护进程 · 被折叠的一代。无偿劳动总承包人。' },
      { num: '19', axes: ['性别', '退出'], blurb: '独立运行实例 · 退出常态化。退出的建制化,不可逆性上升。' },
      { num: '09', axes: ['年龄', '老龄'], blurb: '应计负债 · 账期已至。建造城市的人不被城市养老。' },
      { num: '25', axes: ['政策史', '老龄'], blurb: '已废弃契约 · 政策账单活体。政策反转的代际套牢。', sens: '敏·中' },
    ],
  },
  {
    head: '轴 · 身体与健康',
    slices: [
      { num: '18', axes: ['身体', '对照组'], blurb: '未挂载设备 · 可见性的零点。驱逐被外包给建筑与制度的默认设置。', extremal: true, sens: '校准点' },
      { num: '15', axes: ['健康', '财政'], blurb: '全员接口 · 单方面改版的契约。所有人群最终汇入的总账切片。' },
      { num: '23', axes: ['健康', '青年'], blurb: '提前折旧的电池 · 健康阶层化。剪刀差的身体版。', sens: '敏·中' },
    ],
  },
  {
    head: '轴 · 教育-劳动出口 / 意义供给 / 新工种',
    slices: [
      { num: '11', axes: ['教育', '劳动'], blurb: '编译期定价 · 十五岁的一次性判决。青年研究的暗面补全。' },
      { num: '22', axes: ['劳动', '制造'], blurb: '关键依赖 · 被需要却不被向往。战略价值与社会地位的背离。' },
      { num: '14', axes: ['劳动', '意义'], blurb: '彩票调度 · 用中奖伪装的职业。零工的镜像兄弟。' },
      { num: '13', axes: ['意义', 'CH-04'], blurb: '无主端口 · 被许可的玄学。国家退出意义供给后谁在填。', sens: '敏·中' },
      { num: '26', axes: ['年龄', '前瞻'], blurb: '被改写的引导程序 · 屏幕养大的一代。社会化的平台化。' },
      { num: '27', axes: ['劳动', '流动'], blurb: '轮子上的实时进程 · 北斗即调度器。物流动脉上的零工化。' },
      { num: '28', axes: ['劳动', '知识'], blurb: '自我弃用的进程 · 35 岁折旧。知识劳动的加速折旧样本。' },
    ],
  },
  {
    head: '第三批 · 风险末梢与汇流 · 收官八片',
    slices: [
      { num: '29', axes: ['劳动', '风险'], blurb: '裸跑进程 · 自负盈亏到底。市场最末梢的风险承担者。' },
      { num: '30', axes: ['城乡', '养老'], blurb: '断电的边缘节点 · 城乡断层最底端。养儿防老的制度废墟。' },
      { num: '31', axes: ['性别', '照护'], blurb: '出借的守护进程 · 照护别家自家停摆。照护劳动的空间转移。' },
      { num: '32', axes: ['退出', '信用'], blurb: '被标记的账户 · 信用即权限。全光谱风险的最终货币化终端。' },
      { num: '33', axes: ['教育', '知识'], blurb: '非升即走 · 学术临时工。学历塔尖的知识生产末梢。' },
      { num: '34', axes: ['年龄', '退出'], blurb: '主动挂起的进程 · 全职儿女 NEET。从调度队列里主动下线。' },
      { num: '35', axes: ['城乡', '战略'], blurb: '不可关闭的根服务 · 谁来种地。粮食安全的人力基础。' },
      { num: '36', axes: ['媒介', '情绪'], blurb: '情绪中断风暴 · 受众即弹药。整张图谱的情绪传导层。', sens: '收官' },
    ],
  },
];

/** @type {{ name: string, sub: string, nodes: { num: string, short: string }[] }[]} */
export const ATLAS_AXES = [
  {
    name: '阶层轴',
    sub: '塔尖 → 底层',
    nodes: [
      { num: '10', short: '塔尖' },
      { num: '08', short: '中产' },
      { num: '21', short: '夹心层' },
      { num: '29', short: '个体户' },
      { num: '05', short: '零工' },
      { num: '06', short: '农民工' },
    ],
  },
  {
    name: '年龄轴',
    sub: '10后 → 老去',
    nodes: [
      { num: '26', short: '数字原住民' },
      { num: '03', short: '青年' },
      { num: '34', short: '慢就业' },
      { num: '17', short: '中年女性' },
      { num: '25', short: '计生后遗' },
      { num: '30', short: '留守老人' },
      { num: '09', short: '老年' },
    ],
  },
  {
    name: '性别轴',
    sub: '分叉 → 退出 → 折叠',
    nodes: [
      { num: '04', short: '性少数' },
      { num: '19', short: '单身不婚' },
      { num: '17', short: '中年女性' },
      { num: '31', short: '家政照护' },
    ],
  },
  {
    name: '政治位置轴',
    sub: '体制内 → 编外 → 对照组',
    nodes: [
      { num: '07', short: '体制内' },
      { num: '24', short: '治理末梢' },
      { num: '12', short: '退役军人' },
    ],
  },
  {
    name: '城乡户籍轴',
    sub: '县域 → 流动 → 夹心',
    nodes: [
      { num: '20', short: '县域青年' },
      { num: '21', short: '新移民' },
      { num: '06', short: '农民工' },
      { num: '30', short: '留守老人' },
      { num: '35', short: '职业农民' },
    ],
  },
  {
    name: '身体健康轴',
    sub: '可见性零点 → 总账',
    nodes: [
      { num: '18', short: '残障' },
      { num: '23', short: '带病青年' },
      { num: '15', short: '医保' },
    ],
  },
  {
    name: '意义轴',
    sub: '真空 → 供应商',
    nodes: [
      { num: '13', short: '信仰' },
      { num: '14', short: '创作者' },
      { num: '36', short: '舆论场' },
    ],
  },
  {
    name: '退出轴',
    sub: '原地 → 物理 → 离岸',
    nodes: [
      { num: '03', short: '躺平' },
      { num: '34', short: '慢就业' },
      { num: '19', short: '不婚' },
      { num: '32', short: '失信' },
      { num: '16', short: '离岸' },
      { num: '10', short: '塔尖外流' },
    ],
  },
];

/** 图谱聚簇中声明的全部 GY 编号（应与 gy/registry 人群切片一致） */
export function atlasDeclaredGyNums() {
  const nums = new Set();
  for (const cluster of ATLAS_CLUSTERS) {
    for (const slice of cluster.slices) nums.add(slice.num);
  }
  return [...nums].sort();
}
