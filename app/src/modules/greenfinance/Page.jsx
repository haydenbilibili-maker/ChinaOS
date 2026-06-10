import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const TOOLS = [
  { key: 'loan', label: '绿色信贷', accent: '#10b981', balance: 35.5, desc: '本外币绿色贷款余额 ~34 万亿，投向清洁交通/能源占比 40%+，是绿色金融体量最大的工具。' },
  { key: 'bond', label: '绿色债券', accent: '#e8a317', balance: 4.2, desc: '绿债存量 ~4 万亿，全球发行体量第一；募集资金用途披露趋严，漂绿风险受监管关注。' },
  { key: 'carbon', label: '碳市场', accent: '#c41e3a', balance: 92, desc: '全国碳市场 CEA 均价 90+ 元/吨，覆盖 50 亿吨+ CO₂；电力先行，钢铁水泥扩围抬高合规成本。' },
  { key: 'esg', label: 'ESG 披露', accent: '#22d3ee', balance: 45, desc: '上市公司可持续发展报告指引推动环境指标可比；A 级领先企业约 15%（示意）。' },
];

const growthTrend = {
  legend: { data: ['绿色贷款余额', '绿色债券存量'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { ...GRID, top: 32 },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024(E)']),
  yAxis: valueY({ name: '万亿' }),
  series: [
    { name: '绿色贷款余额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [10.2, 12.0, 15.9, 22.0, 30.1, 35.5], lineStyle: { color: '#10b981', width: 3 }, itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16,185,129,0.15)' } },
    { name: '绿色债券存量', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: [1.1, 1.4, 1.8, 2.8, 3.5, 4.2], lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
  ],
};

export default function Page() {
  const [tool, setTool] = useState('carbon');
  const t = TOOLS.find((x) => x.key === tool) || TOOLS[2];

  const carbonSector = useMemo(() => ({
    legend: { data: ['配额缺口压力 (%)', '履约完成度'], textStyle: { color: '#93a1b5', fontSize: 11 }, bottom: 0 },
    grid: { left: 100, right: 24, top: 12, bottom: 32 },
    xAxis: valueY(),
    yAxis: categoryX(['航空/航运', '造纸', '有色/化工', '水泥/建材', '钢铁', '电力']),
    series: [
      { name: '配额缺口压力 (%)', type: 'bar', barWidth: 10, itemStyle: { color: t.accent, borderRadius: 3 },
        data: tool === 'carbon' ? [5, 8, 10, 12, 15, 45] : [3, 5, 6, 8, 10, 30] },
      { name: '履约完成度', type: 'bar', barWidth: 10, itemStyle: { color: '#22d3ee', borderRadius: 3 },
        data: [55, 65, 70, 78, 92, 85] },
    ],
  }), [tool, t]);

  const esgDonut = donutOpt([
    { value: 15, name: 'A 级 (领先)', itemStyle: { color: '#10b981' } },
    { value: 30, name: 'B 级 (中等)', itemStyle: { color: '#22d3ee' } },
    { value: 35, name: 'C 级 (滞后)', itemStyle: { color: '#e8a317' } },
    { value: 10, name: 'D 级 (高风险)', itemStyle: { color: '#c41e3a' } },
    { value: 10, name: '未覆盖', itemStyle: { color: 'rgba(148,163,184,0.25)' } },
  ]);

  return (
    <div>
      <PageHeader badge="Green Finance · 双碳金融" title="绿色信贷债券 · 转型金融" subtitle="碳定价 · ESG · 绿债市场 · 碳金融工具" />
      <IntroCard>把环境外部性「定价」写进资产负债表：绿色贷款、绿色债券与转型金融工具并行，目标是在<strong style={{ color: 'var(--text-primary)' }}>双碳约束</strong>下降低高碳资产再融资成本。绿色金融是宏观审慎与产业政策的交叉接口。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${t.balance}${tool === 'carbon' ? ' 元/吨' : ' 万亿'}`} label={`${t.label} · 切换`} accent={t.accent} />
        <Stat value="40%+" label="绿债投向清洁交通/能源" accent="#22d3ee" />
        <Stat value="#1" label="全球绿债发行体量" accent="#e8a317" />
        <Stat value="8.5 亿吨" label="碳市场年覆盖排放" accent="#c41e3a" />
      </Grid>

      <Card title="交互 · 绿色金融工具选择器" className="mb-6">
        <SelectorBar items={TOOLS} activeKey={tool} onSelect={setTool} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="绿色融资余额趋势"><EChart option={growthTrend} style={{ height: 220 }} /></Card>
          <Card title="分行业配额压力（随工具切换）"><EChart option={carbonSector} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="A 股 ESG 评级分布"><EChart option={esgDonut} style={{ height: 250 }} /></Card>
        <Card title="全国碳市场 · MRV 三要素">
          <div className="space-y-2">
            {[['配 · 碳排放配额', '年度基准线法分配 + 有偿拍卖；电力覆盖 99%+。', '#10b981'],
              ['证 · CCER 自愿减排', '抵消比例上限约 5%，避免低价冲抵。', '#e8a317'],
              ['测 · MRV 监测核查', 'CEMS + 第三方核查；数据造假入刑。', '#22d3ee']].map(([tit, d, c]) => (
              <div key={tit} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tit}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '碳定价传导', subtitle: 'CEA · CCER', body: '当「排碳有价、减碳有偿」成为财务报表刚性约束，工业转型从行政命令驱动转向内生经济利益驱动。', pillars: [['90+ 元/吨', '当前 CEA 基准。'], ['50 亿吨+', '覆盖排放量。'], ['扩围', '钢铁水泥纳入。']] },
        { title: '转型金融', subtitle: '棕色行业', body: '从「纯绿」扩展到钢铁、建材、航运等「棕色」行业可信转型计划与 KPI。', pillars: [['千亿需求', '年度转型资金。'], ['KPI 绑定', '可信转型计划。'], ['CBAM 外溢', '出口碳足迹核算。']] },
        { title: 'ESG 披露', subtitle: '半强制', body: '上市公司可持续发展报告指引与央企 ESG 专项报告并行，推动环境指标可比。', pillars: [['范围一/二', '碳排放披露。'], ['供应链劳工', 'S 维度纳入。'], ['中欧分类法', '跨境认证对接。']] },
      ]} />

      <ModuleFooter moduleId="greenfinance" sourceNote="由 china.html「绿色金融」专题迁移升级" />
    </div>
  );
}
