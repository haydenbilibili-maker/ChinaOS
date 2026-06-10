import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 功能定位选择器：港澳在不同功能维度上的角色 / 不可替代性 / 风险 ──
const FUNCTIONS = [
  {
    key: 'connector', label: '超级联系人', accent: '#c41e3a',
    role: '内地资本出海与外资入境的双向旋转门：IPO 承销、并购融资、跨境财富管理在此清算。',
    irreplace: 88, risk: 42,
    note: '不可替代性来自「一国之内、两制之间」的法域落差——既受主权庇护，又通行国际规则。',
  },
  {
    key: 'cnh', label: '离岸人民币枢纽', accent: '#22d3ee',
    role: '全球离岸 RMB 存款、点心债、清算量的绝对主导节点；人民币国际化的前哨试验田。',
    irreplace: 92, risk: 35,
    note: '在岸资本项目未完全开放的前提下，CNH 是唯一成规模的市场化人民币定价场。',
  },
  {
    key: 'commonlaw', label: '普通法窗口', accent: '#e8a317',
    role: '保留普通法体系与独立终审权，合同执行与国际仲裁的可预期性，是外资停留的底层契约。',
    irreplace: 90, risk: 55,
    note: '风险最高维度：法治的「感知」比「事实」更脆弱，国际叙事一旦动摇即削弱窗口价值。',
  },
  {
    key: 'ifc', label: '国际金融中心', accent: '#10b981',
    role: '股票、外汇、资管、保险的全功能金融中心；与新加坡构成亚洲双极竞争格局。',
    irreplace: 76, risk: 58,
    note: '不可替代性正被新加坡蚕食——家办、私人银行、区域总部的边际增量已部分分流。',
  },
  {
    key: 'tech', label: '科创桥头', accent: '#8b5cf6',
    role: '河套、生物科技 IPO（18A 章）、数据跨境试点；连接内地研发与国际资本的科技桥。',
    irreplace: 64, risk: 48,
    note: '后发功能：依赖大湾区研发腹地，自身科创生态薄，桥头价值大于源头价值。',
  },
  {
    key: 'gbaengine', label: '大湾区引擎', accent: '#fb923c',
    role: '为珠三角 9 市提供融资、专业服务与制度对接；前海 / 横琴 / 河套是物理试验场。',
    irreplace: 70, risk: 30,
    note: '风险最低、政策最确定的功能——融合是国家意志，腹地化趋势不可逆。',
  },
];

// ── 港澳角色演进时间线 ──
const STAGES = [
  { period: '1950s–70s', title: '转口贸易窗口', accent: '#64748b', desc: '冷战禁运下的唯一缺口：内地物资经香港转口，外汇与情报在此沉淀，窗口的原始形态。' },
  { period: '1980s–90s', title: '外资跳板', accent: '#c41e3a', desc: '改革开放第一桶外资经香港北上，港资制造业内迁珠三角，「前店后厂」奠定大湾区雏形。' },
  { period: '2000s–2010s', title: '离岸 RMB 枢纽', accent: '#22d3ee', desc: 'CNH 市场成形，点心债、沪深港通、债券通先行先试，香港成为人民币国际化的总前哨。' },
  { period: '2020s', title: '大湾区引擎', accent: '#e8a317', desc: '国安立法重置政治框架后，经济融合提速；前海 / 横琴 / 河套将窗口腹地化、制度化。' },
  { period: '前瞻', title: '普通法 / 国际仲裁', accent: '#8b5cf6', desc: '在安全底座之上保留法治差与争议解决功能，争夺亚洲国际仲裁与离岸法律服务的定价权。' },
];

// 离岸人民币全球份额（香港主导，示意值）
const CNH_SHARE = [
  { value: 73, name: '香港 CNH', itemStyle: { color: '#c41e3a' } },
  { value: 7, name: '伦敦', itemStyle: { color: '#22d3ee' } },
  { value: 6, name: '新加坡', itemStyle: { color: '#e8a317' } },
  { value: 4, name: '台北', itemStyle: { color: '#10b981' } },
  { value: 10, name: '其他', itemStyle: { color: '#64748b' } },
];

// 离岸窗口效用结构（保留）
const utilityPie = donutOpt([
  { value: 38, name: '投融资通道', itemStyle: { color: '#c41e3a' } },
  { value: 22, name: '风险管理', itemStyle: { color: '#22d3ee' } },
  { value: 25, name: '专业服务', itemStyle: { color: '#e8a317' } },
  { value: 15, name: '人才与信息', itemStyle: { color: '#10b981' } },
], { center: ['50%', '52%'] });

// 大湾区 11 城 GDP 分工（示意，万亿元）
const GBA_CITIES = [
  { city: '深圳', gdp: 3.6, role: '研发 / 科创', accent: '#c41e3a' },
  { city: '广州', gdp: 3.0, role: '商贸 / 枢纽', accent: '#e8a317' },
  { city: '香港', gdp: 2.9, role: '金融 / 离岸', accent: '#22d3ee' },
  { city: '佛山', gdp: 1.3, role: '先进制造', accent: '#10b981' },
  { city: '东莞', gdp: 1.1, role: '电子制造', accent: '#8b5cf6' },
  { city: '其他5市', gdp: 1.8, role: '配套腹地', accent: '#64748b' },
  { city: '澳门', gdp: 0.3, role: '博彩 / 葡语', accent: '#fb923c' },
];

export default function Page() {
  const [fn, setFn] = useState('cnh');
  const [stage, setStage] = useState(2);
  const f = FUNCTIONS.find((x) => x.key === fn) || FUNCTIONS[0];

  // 主权—市场接口雷达（随功能切换，单系列）
  const sovereigntyRadar = useMemo(() => {
    const map = {
      connector: [78, 90, 85, 82, 80],
      cnh: [82, 95, 88, 80, 84],
      commonlaw: [95, 80, 86, 84, 62],
      ifc: [88, 92, 90, 88, 70],
      tech: [70, 82, 80, 76, 78],
      gbaengine: [80, 84, 88, 90, 88],
    };
    return radarOpt(
      ['法治可预期', '资本流动', '信息枢纽', '人才密度', '国安适配'],
      map[fn] || map.cnh,
      { name: f.label, color: f.accent },
    );
  }, [fn, f]);

  // 港 vs 新加坡 国际金融中心竞争力（双系列，自写内联 option）
  const ifcCompete = useMemo(() => ({
    grid: GRID,
    legend: { data: ['香港', '新加坡'], textStyle: { color: '#93a1b5' }, top: 0 },
    tooltip: { trigger: 'axis' },
    radar: {
      indicator: [
        { name: '资本自由', max: 100 }, { name: '法治', max: 100 },
        { name: '税制', max: 100 }, { name: '人才', max: 100 },
        { name: '连接性', max: 100 }, { name: '监管稳定', max: 100 },
      ],
      center: ['50%', '56%'], radius: '64%',
      axisName: { color: '#93a1b5', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.18)' } },
      splitArea: { areaStyle: { color: ['rgba(34,211,238,0.03)', 'transparent'] } },
    },
    series: [{
      type: 'radar',
      data: [
        { value: [92, 86, 80, 84, 94, 70], name: '香港', areaStyle: { color: 'rgba(196,30,58,0.18)' }, lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' } },
        { value: [88, 90, 88, 86, 88, 92], name: '新加坡', areaStyle: { color: 'rgba(34,211,238,0.15)' }, lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' } },
      ],
    }],
  }), []);

  // 不可替代性 vs 风险（随功能高亮）
  const riskBar = useMemo(() => ({
    grid: { ...GRID, bottom: 36 },
    legend: { data: ['不可替代性', '地位风险'], textStyle: { color: '#93a1b5' }, top: 0 },
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(FUNCTIONS.map((x) => x.label)),
    yAxis: valueY({ max: 100 }),
    series: [
      {
        name: '不可替代性', type: 'bar', barWidth: 16,
        data: FUNCTIONS.map((x) => ({ value: x.irreplace, itemStyle: { color: x.key === fn ? x.accent : 'rgba(34,211,238,0.45)', borderRadius: 3 } })),
      },
      {
        name: '地位风险', type: 'bar', barWidth: 16,
        data: FUNCTIONS.map((x) => ({ value: x.risk, itemStyle: { color: x.key === fn ? '#c41e3a' : 'rgba(196,30,58,0.35)', borderRadius: 3 } })),
      },
    ],
  }), [fn]);

  // CNH 全球份额 donut
  const cnhDonut = useMemo(() => donutOpt(CNH_SHARE, { center: ['50%', '52%'] }), []);

  // 离岸 RMB 三大产品规模（对数轴，示意）
  const cnhProducts = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['CNH 存款', '点心债存量', '互换通日均', '跨境理财通']),
    yAxis: logY(),
    series: [{
      type: 'bar', barWidth: 30,
      data: [10000, 6500, 250, 1200].map((v) => ({ value: v, itemStyle: { color: '#22d3ee', borderRadius: 4 } })),
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
    }],
  }), []);

  // 大湾区城市 GDP 分工 bar
  const gbaBar = useMemo(() => ({
    grid: { ...GRID, bottom: 30 },
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}<br/>GDP ≈ ${p[0].value} 万亿元` },
    xAxis: categoryX(GBA_CITIES.map((c) => c.city)),
    yAxis: valueY({ name: '万亿元', max: 4 }),
    series: [{
      type: 'bar', barWidth: 26,
      data: GBA_CITIES.map((c) => ({ value: c.gdp, itemStyle: { color: c.accent, borderRadius: 4 } })),
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
    }],
  }), []);

  // 制度套利价值：港澳 vs 内地的「窗口落差」堆叠
  const arbitrageBar = useMemo(() => stackedBarOpt({
    categories: ['资本流动', '司法体系', '货币兑换', '税制', '信息流通'],
    series: [
      { name: '香港自由度', data: [95, 92, 98, 88, 90], itemStyle: { color: '#22d3ee' } },
      { name: '内地基线', data: [55, 68, 50, 72, 60], itemStyle: { color: '#64748b' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="HK-Macao Offshore · 一国两制" title="普通法窗口 · 离岸人民币枢纽" subtitle="超级联系人 · CNH 主导 · 制度套利窗口 · 大湾区引擎" />

      <IntroCard>
        香港是中国主权之内、普通法体系之上的资本自由港——一台被精心维护的<strong style={{ color: 'var(--text-primary)' }}>制度套利机器</strong>。
        它承担全球七成以上的离岸人民币业务、内地企业出海的超级联系人功能、以及外资停留所依赖的法治契约。
        国安立法之后，窗口进入「安全底座 + 市场开放」的再平衡：目标不是关闭，而是<strong style={{ color: 'var(--text-primary)' }}>确保窗口可控地继续开着</strong>。
        澳门则以博彩财政 + 横琴腹地化，走向另一种被纳入的样本。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="≈73%" label="香港占全球离岸 RMB 份额" accent="#c41e3a" />
        <Stat value="全球前列" label="年度 IPO 募资排名（示意）" accent="#e8a317" />
        <Stat value="14 万亿+" label="大湾区 GDP（约全国 1/9）" accent="#10b981" />
        <Stat value="普通法" label="对内地的核心法域落差" accent="#22d3ee" />
      </Grid>

      {/* ── 功能定位选择器 ── */}
      <Card title="交互 · 港澳功能定位选择器（角色 / 不可替代性 / 风险）" className="mb-6">
        <SelectorBar items={FUNCTIONS} activeKey={fn} onSelect={setFn} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${f.accent}` }}>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{f.role}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{f.note}</p>
          <div className="flex gap-6 mt-3">
            <span className="text-xs" style={{ color: '#22d3ee' }}>不可替代性 <strong style={{ color: 'var(--text-primary)' }}>{f.irreplace}</strong></span>
            <span className="text-xs" style={{ color: '#c41e3a' }}>地位风险 <strong style={{ color: 'var(--text-primary)' }}>{f.risk}</strong></span>
          </div>
        </div>
        <Grid cols={2}>
          <Card title="主权—市场接口雷达（随功能切换）"><EChart option={sovereigntyRadar} style={{ height: 260 }} /></Card>
          <Card title="六大功能 · 不可替代性 vs 地位风险"><EChart option={riskBar} style={{ height: 260 }} /></Card>
        </Grid>
      </Card>

      {/* ── 角色演进时间线 ── */}
      <Card title="时间线 · 港澳角色演进（点击切换阶段）" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stage} onSelect={setStage} />
      </Card>

      {/* ── 离岸人民币枢纽 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="离岸人民币全球份额 · 香港绝对主导（示意）"><EChart option={cnhDonut} style={{ height: 260 }} /></Card>
        <Card title="离岸 RMB 三大产品规模（对数轴 · 示意）"><EChart option={cnhProducts} style={{ height: 260 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="离岸窗口效用结构"><EChart option={utilityPie} style={{ height: 260 }} /></Card>
        <Card title="CNH · 在岸之外的试验田">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>CNH 市场让人民币在资本项目未完全开放的前提下实现「有限国际化」：点心债、互换通、跨境理财通在香港先行先试，构成受控的双向管道。</p>
          <div className="space-y-2">
            {[
              ['互联互通机制', '沪深港通、债券通、互换通构成受控双向管道，额度即闸门。'],
              ['CNH 定价功能', '离岸汇率反映真实市场预期，是资本流动压力的高频窗口。'],
              ['人民币国际化前哨', 'SWIFT 人民币结算与点心债的边际增量，香港承接其中主体。'],
            ].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ── 国际金融中心竞争 + 制度套利 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="国际金融中心竞争力 · 香港 vs 新加坡（双系列雷达）"><EChart option={ifcCompete} style={{ height: 300 }} /></Card>
        <Card title="制度套利窗口 · 港澳 vs 内地自由度落差">
          <EChart option={arbitrageBar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>窗口的价值正是「落差」本身：资本流动、货币兑换、司法体系上的制度差，构成外资可停留的弹性空间。一旦完全同构，窗口即失去存在意义。</p>
        </Card>
      </Grid>

      {/* ── 大湾区融合 ── */}
      <Card title="大湾区融合 · 11 城 GDP 分工与制度平台" className="mb-6">
        <Grid cols={2}>
          <Card title="大湾区城市 GDP 分工（万亿元 · 示意）"><EChart option={gbaBar} style={{ height: 260 }} /></Card>
          <Card title="三大制度对接平台">
            <div className="space-y-2">
              {[
                ['前海', '#c41e3a', '深港现代服务业开放合作区——金融、法律、专业服务对接。'],
                ['横琴', '#10b981', '粤澳深度合作区——澳门腹地化的制度载体，产业多元化试验。'],
                ['河套', '#8b5cf6', '深港科创合作区——科研要素与数据跨境的物理试验场。'],
              ].map(([t, c, d]) => (
                <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c}` }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        {
          title: '制度套利窗口', subtitle: '可控的开放试验场',
          body: '一国两制本质是一台制度套利机器：普通法 + 联系汇率 + 自由港 + 资本自由流动，在主权庇护下提供国际规则接口。窗口的价值在于「不同」。',
          pillars: [['普通法', '独立终审与合同可预期。'], ['联系汇率', '港元锚定美元的缓冲层。'], ['自由港', '资本与货物的零摩擦通道。']],
        },
        {
          title: '离岸枢纽', subtitle: 'CNH + IPO + 人民币国际化前哨',
          body: '香港是在岸资本项目未开放前提下，唯一成规模的市场化人民币定价场；IPO 与互联互通让内地资产与国际资本在受控管道中相遇。',
          pillars: [['CNH 73%', '全球离岸 RMB 主导份额。'], ['IPO 通道', '内地企业上市与融资前哨。'], ['互换通', '受控双向资金管道。']],
        },
        {
          title: '不可替代性与风险', subtitle: '地位维系 vs 新加坡 + 本地张力',
          body: '不可替代性来自法域落差与主权庇护的叠加；风险来自新加坡的边际分流、法治「感知」的脆弱、以及本地社会张力与国际叙事的修复滞后。',
          pillars: [['新加坡竞争', '家办 / 区域总部分流。'], ['叙事修复', '国际信任的滞后短板。'], ['再平衡', '安全底座下保留弹性。']],
        },
      ]} />

      <Card title="系统观察 · 窗口的悖论" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          离岸窗口的存在本身是一个悖论：它的价值恰恰在于与内地「不同」，但主权逻辑天然倾向于消除差异。
          再平衡的艺术，是在国家安全的刚性约束下，为制度差保留足够的弹性——既不让窗口失控，也不让它失效。
          香港的命运因此不取决于 GDP，而取决于全球资本是否仍相信：在这里，普通法的契约会被执行。
          这种「信任」是一种比资本更稀缺、也更难重建的资产。
        </p>
      </Card>

      <ModuleFooter moduleId="offshore" disclaimer="本模块数据（离岸 RMB 份额、IPO 排名、大湾区 GDP、竞争力评分等）均为示意性整理，用于呈现结构与权力物理，非实时统计口径。由 china.html「港澳离岸」专题迁移升级。" />
    </div>
  );
}
