import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 风险领域：每个领域的等级 / 传导 / 处置工具 / 当前态势 ──────────────
const DOMAINS = [
  {
    key: 'property', label: '房地产', accent: '#c41e3a',
    level: '高 · 存量出清中', score: 85,
    desc: '房企信用收缩与销售下行相互强化，资产负债表衰退式去杠杆。风险已从增量蔓延至土地财政与城投的存量链条，是系统性风险的总闸门。',
    chain: ['房企现金流断裂', '土地出让收缩', '地方政府财力收缩', '城投再融资承压', '区域中小银行资产承压'],
    tools: ['保交楼专项借款', '三个不低于（信贷投放）', '白名单项目融资', '收储与去库存', '房企债务重组'],
    radar: [55, 62, 50, 70, 60, 88],
  },
  {
    key: 'lgfv', label: '地方债', accent: '#e8a317',
    level: '高 · 化债攻坚', score: 82,
    desc: '显性债务受限额硬约束，隐性债务（城投有息负债）规模庞大且区域分化极端。化债本质是用时间换空间，将高息短债置换为低息长债，缓释流动性而非消灭债务。',
    chain: ['土地财政收缩', '城投现金流恶化', '隐性债务暴露', '展期/置换/重组', '财政—金融风险交织'],
    tools: ['特殊再融资债置换', '一揽子化债方案', '金融机构展期降息', '债务限额动态管理', '遏制新增隐性债务'],
    radar: [60, 55, 58, 75, 65, 90],
  },
  {
    key: 'smallbank', label: '中小银行', accent: '#8b5cf6',
    level: '中高 · 局部出清', score: 78,
    desc: '高风险机构集中于村镇银行、农商行与部分城商行，资产端绑定地产与城投，资本与拨备薄弱。处置遵循「一省一策、兼并重组、注资化险」，防止局部演变为区域性危机。',
    chain: ['资产质量恶化', '不良暴露/拨备消耗', '资本充足率承压', '兼并重组/注资', '存款保险兜底'],
    tools: ['专项债补充资本', '兼并重组（村改支）', '不良资产批量转让', '存款保险基金', '高风险机构名单管理'],
    radar: [62, 70, 55, 80, 50, 75],
  },
  {
    key: 'shadow', label: '影子银行', accent: '#64748b',
    level: '中 · 已显著压降', score: 58,
    desc: '资管新规以来通道业务、多层嵌套与刚性兑付被系统性拆解，理财净值化重塑表外生态，传染链条被切断。规模较峰值大幅压降，但需防净值波动引发的赎回踩踏。',
    chain: ['资管新规出台', '通道/嵌套压降', '理财全面净值化', '打破刚兑', '赎回负反馈（尾部）'],
    tools: ['资管新规与净值化', '穿透式监管', '理财子公司隔离', '现金管理类新规', '流动性匹配监测'],
    radar: [80, 75, 72, 85, 78, 70],
  },
  {
    key: 'equity', label: '股市', accent: '#22d3ee',
    level: '中 · 波动管理', score: 60,
    desc: '注册制改革推进直接融资，但市场仍以散户结构与情绪驱动为主，估值波动放大。监管在「活跃资本市场」与「防风险」之间平衡，强化中长期资金入市与常态化退市。',
    chain: ['情绪/流动性冲击', '估值快速调整', '股权质押风险', '两融与杠杆收缩', '财富效应负反馈'],
    tools: ['平准/稳定资金入市', '中长期资金引导', '常态化退市', '程序化交易监管', '减持与分红约束'],
    radar: [70, 78, 68, 82, 55, 72],
  },
  {
    key: 'fx', label: '汇率', accent: '#10b981',
    level: '中 · 宏观审慎', score: 55,
    desc: '人民币汇率在合理均衡水平上保持基本稳定，宏观审慎工具箱应对顺周期与预期冲击。资本项目管道式开放，逆周期因子、外汇存款准备金率等工具平滑波动。',
    chain: ['内外利差扩大', '资本流动顺周期', '汇率预期分化', '逆周期工具启用', '跨境资金平衡'],
    tools: ['逆周期因子', '外汇风险准备金', '跨境融资宏观审慎参数', '中间价机制', '货币互换网络'],
    radar: [85, 80, 75, 60, 70, 88],
  },
  {
    key: 'external', label: '外债', accent: '#f97316',
    level: '低中 · 结构健康', score: 48,
    desc: '外债规模/GDP 与短期外债/外储等指标处于国际警戒线内，币种与期限结构总体稳健。风险点在于美元加息周期下企业外债再融资成本与展期压力。',
    chain: ['美元加息', '外债成本上升', '再融资/展期压力', '企业去外债化', '币种错配收敛'],
    tools: ['全口径跨境融资管理', '外债登记与额度', '本币结算替代', '外储缓冲垫', '币种结构优化'],
    radar: [90, 85, 80, 50, 82, 80],
  },
];

const RADAR_DIMS = ['资本充足', '流动性', '资产质量', '外部韧性', '市场深度', '政策响应'];

// ── 社融存量构成（间接融资为主 → 直接融资提升） ─────────────────────
const TSF_STOCK = [
  { name: '人民币贷款', value: 62, itemStyle: { color: '#c41e3a' } },
  { name: '政府/企业债券', value: 21, itemStyle: { color: '#e8a317' } },
  { name: '表外融资', value: 9, itemStyle: { color: '#64748b' } },
  { name: '股票融资', value: 4, itemStyle: { color: '#22d3ee' } },
  { name: '其他', value: 4, itemStyle: { color: '#475569' } },
];

// ── 监管演进时间线 ────────────────────────────────────────────────
const REG_STAGES = [
  { period: '1992–2003', title: '分业监管成形', accent: '#64748b',
    desc: '从人民银行「大一统」走向分业：1992 证监会、1998 保监会、2003 银监会相继设立，确立「一行三会」雏形，对应银证保分业经营格局。' },
  { period: '2003–2017', title: '一行三会', accent: '#8b5cf6',
    desc: '银监会、证监会、保监会与央行并立。分业监管在混业经营、影子银行与交叉金融产品扩张面前出现监管套利与盲区，风险在缝隙中累积。' },
  { period: '2017–2018', title: '一委一行两会', accent: '#e8a317',
    desc: '设立国务院金融稳定发展委员会统筹协调；银监会与保监会合并为银保监会，强化功能监管与穿透式监管，应对交叉性、系统性风险。' },
  { period: '2023–', title: '中央金融委 · 金融监管总局', accent: '#c41e3a',
    desc: '组建中央金融委员会与中央金融工委加强党对金融的集中统一领导；国家金融监督管理总局统一监管（证券业除外），地方金融监管体制重塑，「机构监管+行为监管+功能监管+穿透监管+持续监管」五位一体。' },
];

// ── 分部门宏观杠杆率趋势（示意，%GDP） ─────────────────────────────
const LEV_YEARS = ['2015', '2017', '2019', '2021', '2023', '2024'];
const leverageOpt = {
  grid: GRID,
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  xAxis: categoryX(LEV_YEARS),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '居民', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [39, 49, 56, 62, 63, 64], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '非金融企业', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [146, 156, 152, 157, 168, 174], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    { name: '政府', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [38, 45, 48, 53, 56, 60], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '宏观总杠杆', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [223, 250, 256, 272, 287, 298], lineStyle: { color: '#8b5cf6', width: 2, type: 'dashed' }, itemStyle: { color: '#8b5cf6' } },
  ],
};

// ── 直接 vs 间接融资占比演进（堆叠） ──────────────────────────────
const financeMixOpt = stackedBarOpt({
  categories: ['2010', '2015', '2020', '2024'],
  series: [
    { name: '间接融资（贷款）', data: [82, 78, 70, 63], itemStyle: { color: '#c41e3a' } },
    { name: '直接融资（债+股）', data: [18, 22, 30, 37], itemStyle: { color: '#22d3ee' } },
  ],
});

export default function Page() {
  const [domainKey, setDomainKey] = useState('property');
  const d = DOMAINS.find((x) => x.key === domainKey) || DOMAINS[0];
  const [regIdx, setRegIdx] = useState(3);

  // 稳定雷达：随领域切换（得分越高越稳健）
  const stabilityRadar = useMemo(
    () => radarOpt(RADAR_DIMS, d.radar, { name: `${d.label} · 稳健度`, color: d.accent }),
    [d],
  );

  // 跨领域风险指数对比条
  const riskBar = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: categoryX(DOMAINS.map((x) => x.label)),
    yAxis: valueY({ max: 100, name: '风险指数' }),
    series: [{
      type: 'bar', barWidth: 20,
      data: DOMAINS.map((x) => ({
        value: x.score,
        itemStyle: { color: x.key === domainKey ? x.accent : 'rgba(100,116,139,0.4)', borderRadius: 3 },
      })),
      markLine: { silent: true, symbol: 'none', lineStyle: { color: '#f97316', type: 'dashed' },
        data: [{ yAxis: 70, label: { formatter: '审慎警戒', color: '#f97316', fontSize: 10 } }] },
    }],
  }), [domainKey]);

  const tsfDonut = useMemo(() => donutOpt(TSF_STOCK), []);

  // 系统性风险综合雷达（六维全局，区别于领域稳健度）
  const systemicRadar = useMemo(() => radarOpt(
    ['房地产', '地方债', '银行资产质量', '流动性', '外部冲击', '传染性'],
    [85, 82, 72, 60, 58, 70],
    { name: '系统性风险压力', color: '#c41e3a' },
  ), []);

  return (
    <div>
      <PageHeader badge="Finance System · 金融安全与效率" title="系统性风险 · 宏观审慎" subtitle="社融结构 · 分部门杠杆 · 风险传导 · 中央金融委统筹" />
      <IntroCard>
        金融系统的真实约束是<strong style={{ color: '#e8a317' }}>「开放节奏」与「风险底线」</strong>的动态权衡。中国金融以间接融资（银行信贷）为主体，宏观杠杆率持续攀升至 GDP 的近三倍——这意味着风险不会消失，只会在<strong style={{ color: '#c41e3a' }}>居民、企业、政府、金融</strong>四张资产负债表之间转移与再定价。守住「不发生系统性金融风险」的底线，依赖宏观审慎框架、逆周期工具与中央金融委的集中统筹：稳定优先于速度，化债本质是<strong style={{ color: '#22d3ee' }}>用时间换空间</strong>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~400 万亿" label="社融存量规模（元 · 示意）" accent="#c41e3a" />
        <Stat value="~298%" label="宏观杠杆率（%GDP · 示意）" accent="#8b5cf6" />
        <Stat value="~8%" label="M2 同比增速（示意）" accent="#e8a317" />
        <Stat value="~1.6%" label="商业银行不良率（示意）" accent="#10b981" />
      </Grid>

      {/* ── 交互 1：风险领域选择器 ─────────────────────────── */}
      <Card title="交互 · 风险领域选择器（等级 · 传导 · 工具 · 态势）" className="mb-6">
        <SelectorBar items={DOMAINS} activeKey={domainKey} onSelect={setDomainKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${d.accent}` }}>
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <span className="text-base font-semibold" style={{ color: d.accent }}>{d.label}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: `1px solid ${d.accent}` }}>风险等级 · {d.level}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>风险指数 {d.score}/100</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.desc}</p>
        </div>

        {/* 该领域传导链 + 处置工具 */}
        <Grid cols={2} className="mb-4">
          <div className="os-card p-4" style={{ background: 'var(--bg-surface)' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>风险传导链 · {d.label}</div>
            <div className="flex flex-col gap-2">
              {d.chain.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="mono text-[10px] flex items-center justify-center" style={{ width: 18, height: 18, borderRadius: '50%', background: d.accent, color: '#fff', flexShrink: 0 }}>{i + 1}</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-surface)' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>处置工具箱 · {d.label}</div>
            <div className="flex flex-wrap gap-2">
              {d.tools.map((t) => (
                <span key={t} className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{t}</span>
              ))}
            </div>
          </div>
        </Grid>

        <Grid cols={2}>
          <Card title="跨领域风险指数对比（示意 · 警戒线 70）"><EChart option={riskBar} style={{ height: 240 }} /></Card>
          <Card title={`稳健度雷达 · ${d.label}（随领域切换）`}><EChart option={stabilityRadar} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* ── 金融结构 + 杠杆 ─────────────────────────────────── */}
      <Grid cols={2} className="mb-6">
        <Card title="社融存量构成（% · 间接融资为主体 · 示意）"><EChart option={tsfDonut} style={{ height: 260 }} /></Card>
        <Card title="直接 vs 间接融资占比演进（% · 示意）"><EChart option={financeMixOpt} style={{ height: 260 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="分部门宏观杠杆率趋势（%GDP · 示意）"><EChart option={leverageOpt} style={{ height: 260 }} /></Card>
        <Card title="系统性风险综合雷达（六维压力 · 示意）"><EChart option={systemicRadar} style={{ height: 260 }} /></Card>
      </Grid>

      {/* ── 总闸门传导链：房企暴雷 → 财政 → 金融 ──────────────── */}
      <Card title="系统性传导：地产—财政—金融的死亡螺旋（机制示意）" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          房地产是连接居民资产负债表、地方财政与银行体系的总枢纽。一旦房企信用收缩，链条沿土地财政逐级传导，最终在区域中小银行资产端兑现——这是宏观审慎政策最优先切断的传染路径。
        </p>
        <div className="flex flex-wrap items-stretch gap-2">
          {[
            ['房企暴雷', '销售与融资双杀，现金流断裂，竣工与拿地停摆。', '#c41e3a'],
            ['土地财政', '土地出让金骤降，地方政府性基金收入失血。', '#e8a317'],
            ['城投承压', '土地抵押价值缩水，城投再融资与还本付息承压。', '#f97316'],
            ['中小银行', '地产+城投敞口集中，不良暴露、拨备与资本消耗。', '#8b5cf6'],
            ['财政—金融交织', '化债以展期降息缓释流动性，风险跨周期平滑。', '#22d3ee'],
          ].map(([t, dsc, c], i, arr) => (
            <React.Fragment key={t}>
              <div className="os-card p-3 flex-1" style={{ minWidth: 150, background: 'var(--bg-surface)', borderTop: `3px solid ${c}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: c }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{dsc}</p>
              </div>
              {i < arr.length - 1 && <div className="flex items-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>→</div>}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* ── 时间线：监管体制演进 ───────────────────────────── */}
      <Card title="时间线 · 金融监管体制演进（分业 → 集中统一领导）" className="mb-6">
        <TimelineBar stages={REG_STAGES} activeIdx={regIdx} onSelect={setRegIdx} />
      </Card>

      {/* ── FrameworkTrio：三大制度逻辑 ─────────────────────── */}
      <FrameworkTrio cards={[
        {
          key: 'salt', title: '服务实体经济', subtitle: '防脱实向虚', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '金融是实体经济的血脉，本源在配置资金支持生产。抑制资金空转、套利与房地产化金融，引导信贷流向制造业、科创与普惠。',
          pillars: [['脱虚向实', '约束同业与通道空转。'], ['普惠下沉', '小微与涉农信贷扩面。'], ['科技金融', '配置新质生产力赛道。']],
        },
        {
          key: 'stone', title: '防风险底线', subtitle: '不发生系统性风险', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '守住不发生系统性金融风险是永恒主题。化险遵循「时间换空间、分类施策、压实主体责任」，防止局部风险演变为区域性、系统性危机。',
          pillars: [['硬约束', '房企三道红线/化债限额。'], ['分类处置', '一省一策、一机构一策。'], ['兜底机制', '存款保险与金融稳定基金。']],
        },
        {
          key: 'path', title: '审慎工具箱', subtitle: '宏观审慎 + 逆周期', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '在微观审慎之上叠加宏观审慎，逆周期调节顺周期波动与跨市场传染。MPA、逆周期因子、跨境融资参数构成可动态校准的政策面板。',
          pillars: [['MPA 评估', '引导广义信贷稳健扩张。'], ['逆周期因子', '平滑汇率与资本流。'], ['穿透监管', '识别交叉金融风险。']],
        },
      ]} />

      {/* ── 系统观察 ─────────────────────────────────────── */}
      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          金融风险从不在监管报表里消失，它只是改变栖身的资产负债表。地产去杠杆把风险压向地方财政，化债把财政压力转译为金融机构的久期与利差让渡——每一步都是用更长的时间、更低的票息，换取不引爆的当下。在以银行信贷为骨架、间接融资为主体的结构里，「稳定」是一种由央行资产负债表与国家信用共同背书的政治选择：宁可承受效率损失与缓慢出清，也不接受系统性断裂。开放与国际化只能是管道式、可逆的——因为底线一旦失守，没有第二次摸石头的机会。
        </p>
      </Card>

      <ModuleFooter moduleId="finance" disclaimer="公开资料整理 · 数值为量级示意非官方统计 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「金融系统」专题迁移升级" />
    </div>
  );
}
