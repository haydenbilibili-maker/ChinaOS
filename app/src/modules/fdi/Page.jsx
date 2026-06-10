import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const FLOWS = [
  { key: 'fdi_in', label: '外资流入', accent: '#22d3ee', hiTech: 39, desc: '吸引力从「低成本要素」转向「全产业链效率」：全球唯一全工业门类配套形成物理级产业粘性，高端制造外资逆势深耕。' },
  { key: 'odi_out', label: '对外投资', accent: '#e8a317', hiTech: 28, desc: '制造业产能、新能源与数字平台加速出海——双向流动的另一翼，构成「以市场换安全、以效率锁利益」的资本回路。' },
  { key: 'reinvest', label: '利润再投资', accent: '#10b981', hiTech: 45, desc: '约千亿级利润不汇出而转为再投资（Chain Locking），税收递延政策把存量外资转化为增量。' },
];

const PHASES = [
  { period: '2013–2017', title: '负面清单试点', accent: '#64748b', desc: '上海等自贸区试点，全国版负面清单 190 条起步。' },
  { period: '2018–2021', title: '制造业清零', accent: '#e8a317', desc: '负面清单持续压减，制造业限制条目清零，服务业开放加速。' },
  { period: '2022–至今', title: '制度型开放', accent: '#c41e3a', desc: '自贸试验区对接 CPTPP、DEPA 规则，国家安全审查与开放并行。' },
];

export default function Page() {
  const [flow, setFlow] = useState('fdi_in');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const f = FLOWS.find((x) => x.key === flow) || FLOWS[0];

  const hiTechLine = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2018', '2020', '2022', '2024E']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [20, 25, 34, f.hiTech], lineStyle: { color: f.accent, width: 2 },
      itemStyle: { color: f.accent }, areaStyle: { color: `${f.accent}18` } }],
  }), [f]);

  const negativeList = {
    grid: GRID,
    xAxis: categoryX(['2013', '2017', '2019', '2021', '2024']),
    yAxis: valueY(),
    series: [{ type: 'line', step: 'end', data: [190, 63, 40, 31, 29],
      lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' },
      areaStyle: { color: 'rgba(232,163,23,0.1)' }, label: { show: true, color: '#93a1b5', fontSize: 10 } }],
  };

  const rdCenterPie = donutOpt([
    { value: 40, name: '生物医药', itemStyle: { color: '#22d3ee' } },
    { value: 25, name: '汽车与智驾', itemStyle: { color: '#c41e3a' } },
    { value: 20, name: '新材料', itemStyle: { color: '#10b981' } },
    { value: 15, name: '数字技术', itemStyle: { color: '#e8a317' } },
  ]);

  return (
    <div>
      <PageHeader badge="FDI · 双向直投" title="跨境直接投资 · 双向流动" subtitle="负面清单 · 国家安全审查 · 外资留存 · 对外投资" />
      <IntroCard>现实主义框架下，中国对外资的吸引力已从「低成本要素」转向<strong style={{ color: 'var(--text-primary)' }}>全产业链效率</strong>。全球唯一全工业门类配套形成物理级产业粘性——撤离意味着放弃最优响应速度与成本平衡。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${f.hiTech}%`} label={`高技术占比 · ${f.label}`} accent={f.accent} />
        <Stat value="12,000+" label="新设外商投资企业（2024 Q1）" accent="#22d3ee" />
        <Stat value="29 条" label="全国版负面清单条目" accent="#e8a317" />
        <Stat value="~1,000 亿" label="利润再投资规模（RMB）" accent="#10b981" />
      </Grid>

      <Card title="交互① · 资本流向选择器" className="mb-6">
        <SelectorBar items={FLOWS} activeKey={flow} onSelect={setFlow} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${f.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="高技术产业占比（随流向切换）"><EChart option={hiTechLine} style={{ height: 220 }} /></Card>
          <Card title="负面清单压减演进"><EChart option={negativeList} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 开放政策阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="外资在华研发中心行业分布"><EChart option={rdCenterPie} style={{ height: 260 }} /></Card>
        <Card title="制度型开放 · 规则接轨">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>从「边境开放」转向「境内开放」：在自贸试验区测试 CPTPP、DEPA 等国际高标准经贸规则。谁定义了规则的本地化闭环，谁就掌握了在岸市场的准入话语权。</p>
          <Grid cols={2}>
            <Stat value="ZERO" label="制造业限制条目" accent="#10b981" />
            <Stat value="ACCELERATING" label="服务业开放深度" accent="#22d3ee" />
          </Grid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '市场重力场', subtitle: '供应链密度', body: '吸引力核心是不可比拟的供应链密度——从低成本洼地到全链条效率高地，外资留存决策被嵌入产业网络本身。', pillars: [['全工业门类', '唯一完整配套。'], ['响应速度', '最优成本平衡。'], ['去风险叙事', '逆势深耕。']] },
        { title: '负面清单算法', subtitle: '190→29 条', body: '制造业限制清零标志着以绝对产业自信迎接全球竞争；安全边界由外商投资国家安全审查单独守住。', pillars: [['清单管准入', '能不能进。'], ['审查管安全', '会不会伤。'], ['开放与审查', '并行不悖。']] },
        { title: '双向流动', subtitle: 'FDI + ODI', body: '利润再投资锁定存量外资；ODI 出海构成资本回路另一翼——以市场换安全、以效率锁利益。', pillars: [['Chain Locking', '千亿级再投资。'], ['ODI 出海', '产能与平台输出。'], ['深层嵌合', '在岸合作伙伴。']] },
      ]} />

      <ModuleFooter moduleId="fdi" sourceNote="由 china.html「FDI」专题迁移升级" />
    </div>
  );
}
