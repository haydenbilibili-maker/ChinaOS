import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const WINDOWS = [
  { key: 'hk', label: '香港窗口', accent: '#22d3ee', rmbShare: 75, desc: '全球最大离岸人民币业务枢纽：CNH 定价、互联互通机制与超级联系人功能——普通法窗口的核心载体。' },
  { key: 'macau', label: '澳门样本', accent: '#10b981', rmbShare: 8, desc: '博彩税收支撑高福利财政，横琴粤澳深度合作区是其腹地化的制度载体；葡语国家经贸平台。' },
  { key: 'gba', label: '大湾区融合', accent: '#e8a317', rmbShare: 45, desc: '14 万亿+ GDP，与深圳、广州构成「研发—制造—融资」闭环；前海、河套是制度对接物理试验场。' },
];

const utilityPie = donutOpt([
  { value: 38, name: '投融资通道', itemStyle: { color: '#c41e3a' } },
  { value: 22, name: '风险管理', itemStyle: { color: '#22d3ee' } },
  { value: 25, name: '专业服务', itemStyle: { color: '#e8a317' } },
  { value: 15, name: '人才与信息', itemStyle: { color: '#10b981' } },
]);

export default function Page() {
  const [win, setWin] = useState('hk');
  const w = WINDOWS.find((x) => x.key === win) || WINDOWS[0];

  const sovereigntyRadar = useMemo(() => radarOpt(
    ['法治可预期', '资本流动', '信息枢纽', '人才密度', '国安适配'],
    win === 'hk' ? [88, 92, 90, 85, 78] : win === 'macau' ? [75, 70, 65, 72, 88] : [82, 85, 88, 90, 80],
    { name: `${w.label}`, color: w.accent },
  ), [win, w]);

  const dissolutionBar = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['国安法', '选举改革', '经济融合', '国际叙事']),
    yAxis: valueY({ max: 100 }),
    series: [{ type: 'bar', barWidth: 28, data: [
      win === 'hk' ? 72 : 85, 68, win === 'gba' ? 92 : 85, win === 'hk' ? 55 : 70,
    ].map((v) => ({ value: v, itemStyle: { color: w.accent, borderRadius: 4 } })),
    label: { show: true, position: 'top', color: '#93a1b5' } }],
  }), [win, w]);

  return (
    <div>
      <PageHeader badge="HK-Macao Offshore · 一国两制" title="普通法窗口 · 离岸人民币" subtitle="香港金融枢纽 · 离岸 RMB · 制度再平衡 · 大湾区" />
      <IntroCard>香港是中国主权之内、普通法体系之上的资本自由港：既是全球最大离岸人民币业务枢纽，也是内地企业投融资与风险管理的<strong style={{ color: 'var(--cyber-cyan)' }}>超级联系人</strong>。国安立法之后，窗口进入「安全底座 + 市场开放」的再平衡阶段。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="≈1 万亿元" label="香港离岸 RMB 存款" accent="#c41e3a" />
        <Stat value={`${w.rmbShare}%`} label={`${w.label} RMB 占比 · 切换`} accent={w.accent} />
        <Stat value="14 万亿+" label="大湾区 GDP" accent="#e8a317" />
        <Stat value="普通法" label="司法体系差" accent="#22d3ee" />
      </Grid>

      <Card title="交互 · 离岸窗口类型选择器" className="mb-6">
        <SelectorBar items={WINDOWS} activeKey={win} onSelect={setWin} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${w.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="主权—市场接口雷达（随窗口切换）"><EChart option={sovereigntyRadar} style={{ height: 240 }} /></Card>
          <Card title="制度张力与消解路径"><EChart option={dissolutionBar} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="离岸窗口效用结构"><EChart option={utilityPie} style={{ height: 260 }} /></Card>
        <Card title="离岸人民币 · 在岸之外的试验田">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>CNH 市场让人民币在资本项目未完全开放的前提下实现「有限国际化」：点心债、互换通、跨境理财通等机制在香港先行先试。</p>
          <div className="space-y-2">
            {[['互联互通机制', '沪深港通、债券通、互换通构成受控双向管道。'], ['CNH 定价功能', '离岸汇率反映真实市场预期，是资本流动压力的高频窗口。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '普通法窗口', subtitle: '司法可预期', body: '香港保留普通法体系与独立终审权，合同执行与司法可预期性是国际资本停留的底层前提。', pillars: [['制度差', '与内地法域最大差异。'], ['超级联系人', '内地出海投融资通道。'], ['风险防火墙', '联系汇率缓冲层。']] },
        { title: '国安后再平衡', subtitle: '可控地开着', body: '2020 年国安法重置政治框架；经济融合推进最快，国际叙事修复仍是短板。目标不是关闭窗口，而是确保窗口可控。', pillars: [['经济融合 85', '最快推进维度。'], ['国际叙事 55', '修复短板。'], ['资金净流入', '关键观察指标。']] },
        { title: '大湾区接口', subtitle: '制度试验场', body: '与深圳、广州构成研发—制造—融资闭环；横琴、前海、河套是制度对接的物理试验场。', pillars: [['14 万亿 GDP', '约全国 1/9。'], ['河套', '科研与数据跨境。'], ['前海', '现代服务业开放。']] },
      ]} />

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>离岸窗口的价值恰恰在于「不同」：一旦香港在法治、信息与资本流动上与内地完全同构，窗口即失去存在意义。再平衡是在国家安全刚性约束下，为制度差保留足够弹性空间。</p>
      </Card>

      <ModuleFooter moduleId="offshore" sourceNote="由 china.html「港澳离岸」专题迁移升级" />
    </div>
  );
}
