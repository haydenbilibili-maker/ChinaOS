import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const PILLARS = [
  { key: 'green', label: '扩绿增汇', accent: '#10b981', score: 95, desc: '森林覆盖率 24.02%，全球新增绿化贡献 30%+；国家公园体系重构保护地边界。' },
  { key: 'carbon', label: '降碳减污', accent: '#22d3ee', score: 88, desc: '单位 GDP 能耗指数较 2015 年降 30%；碳排放强度较峰值降幅超 25%。' },
  { key: 'value', label: '价值实现', accent: '#e8a317', score: 72, desc: 'GEP 核算与生态补偿、碳汇交易把外部性内化为可量化、可交易的制度安排。' },
];

const PARKS = [
  ['三江源', '长江/黄河/澜沧江发源地，「中华水塔」。'],
  ['大熊猫', '栖息地走廊连通，野外种群 1900+ 只。'],
  ['东北虎豹', '跨境连通 + 红外监测，野生东北虎破 30 只。'],
  ['海南热带雨林', '长臂猿等热带物种，岛屿生态完整性。'],
  ['武夷山', '世界双遗产，亚热带森林多样性。'],
];

export default function Page() {
  const [pillar, setPillar] = useState('green');
  const p = PILLARS.find((x) => x.key === pillar) || PILLARS[0];

  const forestTrend = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['1949', '1980', '2000', '2010', '2020', '2024']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: pillar === 'carbon' ? [8.6, 12, 16.6, 20.4, 23.0, 24.02] : [8.6, 12, 16.6, 20.4, 23.0, 24.02],
      lineStyle: { color: p.accent, width: 2 }, itemStyle: { color: p.accent },
      areaStyle: { color: `${p.accent}18` } }],
  }), [pillar, p]);

  const speciesChart = {
    legend: { data: ['2000 基准', '2024 现状'], textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 60, right: 16, top: 30, bottom: 24 },
    xAxis: valueY(),
    yAxis: categoryX(['藏羚羊', '东北虎', '大熊猫', '朱鹮']),
    series: [
      { name: '2000 基准', type: 'bar', data: [100, 100, 100, 100], barWidth: 9, itemStyle: { color: '#27324a' } },
      { name: '2024 现状', type: 'bar', data: [300, 180, 165, 250], barWidth: 9, itemStyle: { color: p.accent } },
    ],
  };

  const pillarRadar = radarOpt(['国土绿化', '物种保护', '碳市场', 'GEP 核算', '国际承诺'],
    pillar === 'green' ? [95, 92, 70, 65, 88] : pillar === 'carbon' ? [80, 75, 95, 70, 85] : [85, 80, 75, 95, 90],
    { name: p.label, color: p.accent });

  return (
    <div>
      <PageHeader badge="Ecology · 双碳" title="生态文明 · 从治理到价值" subtitle="绿水青山 · 双碳目标 · GEP · 碳市场" />
      <IntroCard>生态不再只是被保护的对象，而是被纳入<strong style={{ color: 'var(--text-primary)' }}>核算、定价与交易</strong>的系统资产——把外部性内化为可量化、可激励的制度安排。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="24.02%" label="森林覆盖率" accent="#10b981" />
        <Stat value={`${p.score}%`} label={`${p.label}指数 · 切换`} accent={p.accent} />
        <Stat value="30%+" label="全球新增绿化贡献" accent="#22d3ee" />
        <Stat value="230,000" label="自然保护地数量级" accent="#e8a317" />
      </Grid>

      <Card title="交互 · 生态文明三支柱选择器" className="mb-6">
        <SelectorBar items={PILLARS} activeKey={pillar} onSelect={setPillar} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="森林覆盖率变迁"><EChart option={forestTrend} style={{ height: 220 }} /></Card>
          <Card title="支柱能力雷达（随切换）"><EChart option={pillarRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="国家公园 · 系统治理" className="mb-6">
        <Grid cols={5}>
          {PARKS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="物种回归（指数 2000=100）"><EChart option={speciesChart} style={{ height: 200 }} /></Card>
        <Card title="制度创新 · 生态资产可定价">
          <div className="space-y-2">
            {[['GEP 核算', '生态系统生产总值量化入账。'], ['碳汇交易', '把固碳服务转化为现金流。'], ['COP15', '昆明-蒙特利尔框架 3030 目标。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '扩绿增汇', subtitle: '国土绿化', body: '大规模国土绿化 + 国家公园体系，把保护地从单一物种转向整体生态系统。', pillars: [['24% 森林覆盖', '持续上升。'], ['旗舰物种', '种群恢复信号。'], ['三江源', '中华水塔。']] },
        { title: '降碳减污', subtitle: '双碳协同', body: '环境治理不是增长对立面；碳市场与 CCUS 把减排成本转化为可交易资产。', pillars: [['能耗指数 -30%', '较 2015。'], ['碳强度 -25%', '较峰值。'], ['PM2.5 下降', '大气治理。']] },
        { title: '价值实现', subtitle: 'GEP · 碳汇', body: '美丽中国本质是用核算、定价、交易三层机制，让生态保护具备自我维持的经济动力。', pillars: [['生态补偿', '横向转移。'], ['绿色金融', '碳定价接口。'], ['3030 目标', '2030 保护 30% 陆海。']] },
      ]} />

      <ModuleFooter moduleId="ecology" sourceNote="由 tabs/ecology.html 迁移升级" />
    </div>
  );
}
