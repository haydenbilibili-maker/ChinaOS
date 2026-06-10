import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 三医联动拓扑：医疗服务 / 医保基金 / 医药流通 的闭环关系图 ──
const triadGraph = {
  series: [{
    type: 'graph', layout: 'circular', symbolSize: 58, roam: false,
    label: { show: true, fontSize: 10, color: '#93a1b5' },
    data: [
      { name: '医疗服务', itemStyle: { color: '#c41e3a' } },
      { name: '医保基金', itemStyle: { color: '#10b981' } },
      { name: '医药流通', itemStyle: { color: '#e8a317' } },
    ],
    links: [
      { source: '医药流通', target: '医保基金', label: { show: true, formatter: '挤水分', color: '#93a1b5' }, lineStyle: { curveness: 0.2, color: '#e8a317' } },
      { source: '医保基金', target: '医疗服务', label: { show: true, formatter: '调价/支付', color: '#93a1b5' }, lineStyle: { curveness: 0.2, color: '#10b981' } },
      { source: '医疗服务', target: '医药流通', label: { show: true, formatter: '处方外流', color: '#93a1b5' }, lineStyle: { curveness: 0.2, color: '#c41e3a' } },
    ],
    lineStyle: { opacity: 0.9, width: 2 },
  }],
};

// ── 价值采购（VBP）：历批集采品种平均降幅 ──
const vbpBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2024E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [52, 56, 48, 55], barWidth: 22, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'top', formatter: '-{c}%', color: '#93a1b5' } }],
};

// ── DRG/DIP 执行后的基金支出效率画像 ──
const drgRadar = {
  radar: {
    indicator: [{ name: '基金结余率', max: 100 }, { name: '次均住院费降幅', max: 100 }, { name: '临床路径规范度', max: 100 }, { name: '患者满意度', max: 100 }, { name: '管理响应速度', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [92, 85, 95, 78, 90], name: 'DRG/DIP 执行后', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } }] }],
};

const REFORM_STAGES = [
  { period: '1978–1992', title: '改革探索起步期', desc: '公费医疗与劳保医疗沿袭计划经济模式，财政负担沉重、效率低下；开始尝试「放权让利、扩大医院自主权」的初步改革。', accent: '#c41e3a' },
  { period: '1992–2001', title: '市场化改革探索期', desc: '医疗领域引入市场机制，医院走向自负盈亏，「看病难、看病贵」问题逐步显现。', accent: '#e8a317' },
  { period: '2001–2012', title: '全民医保体系建设期', desc: '启动「新医改」，建立城镇职工、城镇居民与新型农村合作医疗三大体系，到 2010 年基本实现全民医保广覆盖。', accent: '#22d3ee' },
  { period: '2012–至今', title: '医改深化攻坚期', desc: '围绕「强基层」「保基本」深化综合改革：分级诊疗、公立医院三医联动、基本药物制度与医保支付方式改革。', accent: '#10b981' },
];

// ── 政策抓手谱系（SelectorBar 驱动）──
const POLICY = {
  drug_vbp: {
    label: '药品集采', accent: '#c41e3a',
    mech: '国家组织带量采购，以「全国 50%–80% 用量」为筹码与药企议价，中选即独占市场份额，未中选者被挤出公立渠道。',
    effect: '前九批累计覆盖 374 个品种，平均降幅 50%+；仿制药价格回归制造成本线，流通环节灰色加价被系统性剥离。',
    impact: '药企从「带金销售」转向研发驱动；公立医院药占比下降，腾出空间调增诊疗服务价格。',
    dispute: '极端低价引发「质量与供应稳定性」担忧；个别中选药出现断供与一致性评价争议。',
    cut: 53,
  },
  device_vbp: {
    label: '耗材集采', accent: '#e8a317',
    mech: '高值医用耗材（支架、关节、种植牙）纳入带量采购，按手术量打包议价，剥离器械流通暴利。',
    effect: '心脏支架由万元级降至 700 元级（约 -90%）；人工关节平均 -82%；种植牙「单颗万元」时代终结。',
    impact: '器械经销商层级被压缩，临床用量不再受回扣驱动，患者自付端显著减负。',
    dispute: '耗材并非标准化产品，质量分层与术者偏好难以单一价格覆盖；部分高端进口退出公立市场。',
    cut: 86,
  },
  drg_dip: {
    label: 'DRG/DIP 支付', accent: '#22d3ee',
    mech: '按疾病诊断相关分组（DRG）或病种分值（DIP）打包预付，超支由医院自担、结余可留用。',
    effect: '医院从「项目计费的利润中心」转为「成本核算的责任主体」，过度检查与长期住院动机被压制。',
    impact: '倒逼临床路径标准化与精细化成本管理，次均住院费用与平均住院日双降。',
    dispute: '可能诱发「推诿重症」「分解住院」「高靠分组」等套利行为，需配套智能监管。',
    cut: null,
  },
  negotiation: {
    label: '医保谈判', accent: '#10b981',
    mech: '创新药通过国家医保谈判「以价换量」进目录，「灵魂砍价」压缩单价换取全国市场准入。',
    effect: '近年谈判药品平均降幅 60% 左右；大量高价创新药、罕见病药纳入报销，患者可及性跃升。',
    impact: '为创新药建立「上市即放量」的快速通道，重塑国内药企的研发回报预期。',
    dispute: '降幅过深可能挤压研发回报，部分跨国药企对「价格换市场」持保留态度。',
    cut: 61,
  },
  tiered: {
    label: '分级诊疗', accent: '#8b5cf6',
    mech: '以县域医共体、城市医疗集团与家庭医生签约构建「基层首诊、双向转诊」网格。',
    effect: '差异化报销比例引导小病在基层、大病去三甲，缓解三甲虹吸与基层闲置。',
    impact: '5G 远程会诊与医共体内检验互认，把优质资源「下沉」至县乡末梢。',
    dispute: '基层能力与患者信任仍是瓶颈，「向上转易、向下转难」的结构惯性待破。',
    cut: null,
  },
  three_med: {
    label: '三医联动', accent: '#f97316',
    mech: '医疗、医保、医药三方改革同步推进（三明模式），以医保为支付杠杆撬动医疗医药结构调整。',
    effect: '挤压药品耗材水分 → 上调诊疗服务价格 → 落地医务人员年薪制，利益链条整体重排。',
    impact: '阻断「以药养医」的激励扭曲，使医院收入结构回归技术劳务价值。',
    dispute: '高度依赖地方政府统筹力与执行决心，跨部门协同与全国推广存在落差。',
    cut: null,
  },
};
const POLICY_KEYS = Object.keys(POLICY);

// ── 医保基金收入 / 支出 / 累计结余 趋势（多线，示意）──
const fundTrend = {
  tooltip: { trigger: 'axis' },
  legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 12 },
  grid: { left: 48, right: 16, top: 30, bottom: 24 },
  xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024E']),
  yAxis: valueY({ axisLabel: { formatter: '{value} 万亿' } }),
  series: [
    { name: '基金收入', type: 'line', smooth: true, symbol: 'circle', data: [2.1, 2.4, 2.5, 2.9, 3.1, 3.4, 3.6], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
    { name: '基金支出', type: 'line', smooth: true, symbol: 'circle', data: [1.8, 2.1, 2.1, 2.4, 2.5, 2.8, 3.1], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    { name: '累计结余', type: 'line', smooth: true, symbol: 'circle', data: [2.3, 2.7, 3.1, 3.6, 4.2, 4.8, 5.3], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
  ],
};

// ── 老龄化压力：抚养比 vs 在职缴费人口（双轴，示意）──
const agingDual = {
  tooltip: { trigger: 'axis' },
  legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 12 },
  grid: { left: 44, right: 48, top: 30, bottom: 24 },
  xAxis: categoryX(['2020', '2025', '2030E', '2035E', '2040E', '2050E']),
  yAxis: [
    { type: 'value', name: '退休抚养比 %', nameTextStyle: { color: '#93a1b5', fontSize: 9 }, axisLabel: { color: '#93a1b5', formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    { type: 'value', name: '缴费/退休比', nameTextStyle: { color: '#93a1b5', fontSize: 9 }, position: 'right', axisLabel: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '退休抚养比', type: 'bar', yAxisIndex: 0, barWidth: 18, data: [20, 25, 31, 38, 44, 52], itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '在职/退休赡养比', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', data: [2.8, 2.5, 2.1, 1.8, 1.5, 1.3], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

export default function Page() {
  const [stageIdx, setStageIdx] = useState(REFORM_STAGES.length - 1);
  const [policyKey, setPolicyKey] = useState('drug_vbp');
  const p = POLICY[policyKey];

  // 卫生费用结构 donut（个人/政府/社会 占比，示意：个人自付比例持续下降）
  const expDonut = useMemo(() => donutOpt([
    { name: '社会卫生支出', value: 44, itemStyle: { color: '#22d3ee' } },
    { name: '政府卫生支出', value: 29, itemStyle: { color: '#10b981' } },
    { name: '个人现金卫生支出', value: 27, itemStyle: { color: '#c41e3a' } },
  ]), []);

  // 医疗体系六维雷达（单系列）
  const sysRadar = useMemo(() => radarOpt(
    ['覆盖可及性', '筹资公平性', '服务质量', '基金控费', '创新可负担', '分级诊疗'],
    [92, 78, 74, 86, 70, 62],
    { name: '体系画像（示意）', color: '#c41e3a' },
  ), []);

  // 政策抓手降价对比（仅集采/谈判类有降幅）
  const cutItems = POLICY_KEYS.filter((k) => POLICY[k].cut != null);
  const cutBar = useMemo(() => stackedBarOpt({
    categories: cutItems.map((k) => POLICY[k].label),
    series: [{ name: '平均降幅 %', stack: undefined, data: cutItems.map((k) => POLICY[k].cut), itemStyle: { color: '#c41e3a' }, label: { show: true, position: 'right', formatter: '-{c}%', color: '#93a1b5', fontSize: 10 } }],
    horizontal: true,
  }), []);

  return (
    <div>
      <PageHeader badge="Healthcare · 三医联动" title="基本医保 · DRG 与集采" subtitle="全民医保 · 集采降价 · 公立医院改革 · 分级诊疗 · 基金可持续" />
      <IntroCard>
        中国医改并非单纯的财政投入，而是一场精密的<strong style={{ color: 'var(--text-primary)' }}>「结构性大迁徙」</strong>：通过「医药」环节挤出虚高价格水分，腾出的空间用于调增「医疗」服务价值（体现医生劳务价值），并纳入「医保」支付闭环。这种不增加财政总负担的平衡术，是在 13.6 亿人参保、人均资源有限的背景下实现全民覆盖的关键。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="13.6亿" label="基本医保参保人数" accent="#c41e3a" />
        <Stat value="95%+" label="基本医保覆盖率" accent="#e8a317" />
        <Stat value="6,000亿" label="集采累计节约资金" accent="#22d3ee" />
        <Stat value="78.6岁" label="人均预期寿命 · 超越部分中高收入国家" accent="#10b981" />
      </Grid>

      {/* ── 政策抓手选择器 ── */}
      <Card title="政策抓手 · 切换查看机制 / 效果 / 影响 / 争议" className="mb-6">
        <SelectorBar
          items={POLICY_KEYS.map((k) => ({ key: k, label: POLICY[k].label, accent: POLICY[k].accent }))}
          activeKey={policyKey}
          onSelect={setPolicyKey}
        />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
            <div className="text-[10px] mono uppercase tracking-widest mb-1" style={{ color: p.accent }}>// 运作机制</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{p.mech}</p>
            <div className="text-[10px] mono uppercase tracking-widest mb-1" style={{ color: '#10b981' }}>// 直接效果</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.effect}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #27324a' }}>
            <div className="text-[10px] mono uppercase tracking-widest mb-1" style={{ color: '#22d3ee' }}>// 结构影响</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{p.impact}</p>
            <div className="text-[10px] mono uppercase tracking-widest mb-1" style={{ color: '#e8a317' }}>// 争议与张力</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.dispute}</p>
            {p.cut != null && (
              <div className="flex items-baseline gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #27324a' }}>
                <span className="text-2xl font-bold mono" style={{ color: '#c41e3a' }}>-{p.cut}%</span>
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>平均价格降幅（示意）</span>
              </div>
            )}
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="核心逻辑 · 三医联动的效率模型">
          <EChart option={triadGraph} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>"Squeezing out procurement fat to nourish clinical service muscle." —— 挤出采购的水分，滋养临床服务的肌肉。</p>
        </Card>
        <Card title="价值采购（VBP）· 集采品种降价均幅">
          <EChart option={vbpBar} style={{ height: 200 }} />
          <div className="flex justify-between text-[11px] mt-3"><span style={{ color: 'var(--text-tertiary)' }}>心脏支架降幅</span><span className="font-bold" style={{ color: '#c41e3a' }}>-90%</span></div>
          <div className="flex justify-between text-[11px] mt-1"><span style={{ color: 'var(--text-tertiary)' }}>人工关节降幅</span><span className="font-bold" style={{ color: '#c41e3a' }}>-82%</span></div>
        </Card>
      </Grid>

      {/* ── 基金可持续 + 卫生费用结构 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="医保基金可持续 · 收入 / 支出 / 累计结余（示意）">
          <EChart option={fundTrend} style={{ height: 240 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>结余仍在累积，但支出增速持续逼近收入增速 —— 老龄化下「剪刀差」收窄是中长期核心变量。</p>
        </Card>
        <Card title="卫生费用结构 · 个人 / 政府 / 社会 支出占比（示意）">
          <EChart option={expDonut} style={{ height: 240 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>个人现金卫生支出占比由本世纪初的 ~60% 降至约 27%，逼近国际「灾难性医疗支出」安全线。</p>
        </Card>
      </Grid>

      {/* ── 集采降价对比 + 体系雷达 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="政策抓手 · 平均降价幅度横向对比（以量换价）">
          <EChart option={cutBar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>「灵魂砍价」的本质是用国家级采购量重置定价权，把流通水分一次性挤回支付端。</p>
        </Card>
        <Card title="医疗体系六维画像 · 强控费 / 弱创新可负担（示意）">
          <EChart option={sysRadar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>覆盖与控费维度领先，质量、创新可负担与分级诊疗仍是结构短板。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="DRG/DIP · 医院行为的算法重塑">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            支付方式改革是医保控费的「撒手锏」。按病种付费（DRG/DIP）将医院从「利润中心」强制转化为「成本中心」：超支由医院自担，医生不再倾向过度检查与长期住院。这套精算博弈模型正在根本上改写公立医院的运行代码，实现从「规模扩张」向「效率运营」的被迫转轨。
          </p>
          <div className="flex gap-2 flex-wrap mt-4">
            {['Clinical Protocol Alignment', 'Cost Control Engine'].map((t) => (
              <span key={t} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ border: '1px solid #27324a', color: '#22d3ee' }}>{t}</span>
            ))}
          </div>
        </Card>
        <Card title="医保基金支出构成与效率预测（DRG/DIP 执行后）"><EChart option={drgRadar} style={{ height: 260 }} /></Card>
      </Grid>

      {/* ── 老龄化压力（双轴）── */}
      <Card title="老龄化压力 · 退休抚养比上升 vs 在职赡养比下降（示意）" className="mb-6">
        <EChart option={agingDual} style={{ height: 260 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          缴费端人口收缩、领取端人口扩张，是统账结合的现收现付制最深的长期压力源。延迟退休、个人养老金与全国统筹是对冲该剪刀差的主要政策工具。
        </p>
      </Card>

      <Card title="医改四十年 · 阶段时间轴" className="mb-6">
        <TimelineBar stages={REFORM_STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      <Grid cols={3} className="mb-6">
        <Card title="集采 · 不只是压价">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国家组织药品与高值耗材带量采购以「量价挂钩」重构定价权：心脏支架从万元级降至千元级（-90%）。集采更深层的作用，是倒逼药企从「销售驱动」转向「研发驱动」。</p>
        </Card>
        <Card title="公立医院改革 · 三明医改样本">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>福建三明以「腾笼换鸟」打通三医联动：挤压药品耗材水分、上调诊疗服务价格、推行院长与医生年薪制，成为全国推广的公立医院综合改革范本。</p>
        </Card>
        <Card title="分级诊疗网格 · 数字化渗透">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>5G 远程手术与县域医共体逐步普及，异地就医结算走向「无感化」，以数字化手段消解地理上的医疗资源不均，筑牢基层首诊与双向转诊网格。</p>
        </Card>
      </Grid>

      <Card title="调研结论 · 构建普惠韧性">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          中国医疗体系的未来不在于单纯的私有化或绝对的政府包办，而在于<strong style={{ color: 'var(--text-primary)' }}>「数字治理下的动态平衡」</strong>：以集采与 DRG 守住基金安全，以三医联动重排利益结构，以分级诊疗与数字化构建一个具备「极致成本效率」的现代化健康保障网络。「效率是医改的第一性原理」。
        </p>
        <div className="flex gap-6 flex-wrap text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// FUND_SECURITY: GUARANTEED</span><span>// REFORM_LINKAGE: SYNCED</span><span>// PUBLIC_HEALTH: RESILIENT</span>
        </div>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '超大规模医保', subtitle: '14 亿人 · 战略稳定器', body: '全球最大的全民医保网络本身即是战略资产：超大规模筹资池摊薄个体风险，是社会稳定与内需信心的底盘。' },
        { key: 'stone', title: '以量换价', subtitle: '集采 + 谈判 · 挤水分倒逼创新', body: '用国家级采购量重置定价权，压缩流通水分，迫使药企从带金销售转向研发驱动。' },
        { key: 'path', title: '可持续挑战', subtitle: '老龄化 · 收支平衡', body: '老龄化下缴费人口收缩、领取人口扩张，分级诊疗与支付改革是守住基金长期平衡的关键。' },
      ]} />

      <ModuleFooter moduleId="healthcare" sourceNote="由 china.html「医保」专题迁移" disclaimer="公开资料整理，数值为示意非官方 · 仅供分析框架参考，不构成医疗或投资建议" />
    </div>
  );
}
