import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const MODES = [
  { key: 'express', label: '快递末端', accent: '#c41e3a', volume: 1500, cost: 14.4, desc: '快递业务量超 1,320 亿件居全球第一；末端共配与驿站降低单票成本，CR8 长期维持高位。' },
  { key: 'multimodal', label: '多式联运', accent: '#22d3ee', volume: 380, cost: 12.8, desc: '铁海公空组合压缩干线时效；口岸数字化缩短在途不确定性，「一单制」试点服务统一大市场。' },
  { key: 'cold', label: '冷链物流', accent: '#10b981', volume: 520, cost: 16.2, desc: '生鲜与医药驱动冷链网络扩张；自动化立体仓与温控监测构成品质护城河。' },
];

export default function Page() {
  const [mode, setMode] = useState('express');
  const m = MODES.find((x) => x.key === mode) || MODES[0];

  const expressTrend = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2016', '2018', '2020', '2022', '2023', '2024E']),
    yAxis: valueY({ name: mode === 'express' ? '亿件' : '指数' }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: mode === 'express' ? [312, 507, 833, 1106, 1320, 1500] : [100, 145, 220, 310, 380, 450],
      lineStyle: { color: m.accent, width: 2 }, itemStyle: { color: m.accent },
      areaStyle: { color: `${m.accent}18` } }],
  }), [mode, m]);

  const techAutomation = {
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
    xAxis: categoryX(['2020', '2021', '2022', '2023', '2024']),
    yAxis: [
      valueY({ name: '%' }),
      { type: 'value', name: '指数', splitLine: { show: false }, axisLabel: { color: '#93a1b5' } },
    ],
    series: [
      { name: '科技投入占比', type: 'bar', data: [15, 22, 18, 25, 30], barWidth: 18, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
      { name: '自动化指数', type: 'line', yAxisIndex: 1, smooth: true, data: [100, 145, 182, 230, 285],
        lineStyle: { color: m.accent, width: 2 }, itemStyle: { color: m.accent } },
    ],
  };

  const globalSpeed = useMemo(() => ({
    grid: { left: 70, right: 36, top: 16, bottom: 24 },
    xAxis: valueY({ name: '日' }),
    yAxis: categoryX(['跨境均值', '日本', '美国', '欧盟', '中国']),
    series: [{ type: 'bar', barWidth: 16, itemStyle: { borderRadius: 3 },
      data: [7.5, 5.2, 4.8, 4.5, { value: mode === 'express' ? 3.5 : 4.2, itemStyle: { color: m.accent } }],
      itemStyle: { color: '#22d3ee' },
      label: { show: true, position: 'right', formatter: '{c} 日', color: '#93a1b5', fontSize: 10 } }],
  }), [mode, m]);

  return (
    <div>
      <PageHeader badge="Logistics · 多式联运" title="社会物流 · 多式联运" subtitle="物流总费用占比 · 枢纽网络 · 降本增效" />
      <IntroCard>社会物流总额 2024 年预计超 <strong style={{ color: 'var(--text-primary)' }}>380 万亿元</strong>；物流总费用占 GDP 约 14.4%，仍高于美日欧。规模红利见顶之后，竞争转向效率与韧性——降本空间来自多式联运、库存周转与数字化。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${m.volume}${mode === 'express' ? ' 亿件' : ' 指数'}`} label={`${m.label}规模 · 切换`} accent={m.accent} />
        <Stat value={`${m.cost}%`} label="物流费用占 GDP" accent="#e8a317" />
        <Stat value="352 万亿" label="社会物流总额 (2023)" accent="#c41e3a" />
        <Stat value="#1" label="全球快递规模" accent="#10b981" />
      </Grid>

      <Card title="交互 · 物流模式选择器" className="mb-6">
        <SelectorBar items={MODES} activeKey={mode} onSelect={setMode} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${m.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="业务量走势（随模式切换）"><EChart option={expressTrend} style={{ height: 220 }} /></Card>
          <Card title="科技投入与自动化指数"><EChart option={techAutomation} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="主要经济体快递时效对比"><EChart option={globalSpeed} style={{ height: 230 }} /></Card>
        <Card title="仓配自动化与智能调度">
          <div className="space-y-2">
            {[['立体仓与机器人', 'AGV/AMR + WMS/TMS 联动形成可审计履约闭环。', '#22d3ee'],
              ['预测补货 AI', '多步预测降低安全库存，命中率 ~98%。', '#e8a317'],
              ['多式联运关务', '口岸数字化缩短在途不确定性。', '#10b981']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '降本路径', subtitle: '14.4% → 8–10%', body: '政策目标由约 14% 向 8–10% 区间收敛，降本潜力示意 20%+；差距主要在结构而非单环节效率。', pillars: [['多式联运', '铁水分担率提升。'], ['库存周转', '预测 AI 降库存。'], ['数字化', '全链路可视。']] },
        { title: '枢纽网络', subtitle: '120+ 枢纽', body: '国家物流枢纽与示范园区带动干支衔接与产业集聚，是一统一大市场的血管系统。', pillars: [['国家枢纽', '干支衔接。'], ['快递进村', '末端共配降本。'], ['一带一路', '陆海通道重塑。']] },
        { title: '韧性建设', subtitle: '效率 + 冗余', body: '网络韧性短板在数字化与应急两维；极端情景下备份通道与国产替代构成隐性成本。', pillars: [['CR8 高位', '头部集中。'], ['设备依存', '关键软件风险。'], ['绿色 KPI', '进入考核核心。']] },
      ]} />

      <ModuleFooter moduleId="logistics" sourceNote="由 china.html「物流」专题迁移升级" />
    </div>
  );
}
