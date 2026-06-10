import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const ROBOTS = [
  { key: 'industrial', label: '工业机器人', accent: '#c41e3a', density: 392, share: 52, desc: '全球过半工业机器人装机于中国，密度达每万名工人 392 台；汽车、电子、物流是主要应用场景。' },
  { key: 'humanoid', label: '人形机器人', accent: '#e8a317', density: 15, share: 8, desc: '具身智能是 AI 进入物理世界的最后拼图；北京、上海、深圳国家级创新中心并行，2025 量产预期。' },
  { key: 'cobot', label: '协作机器人', accent: '#22d3ee', density: 85, share: 18, desc: '与人共融的轻量协作臂渗透 SME；安全标准与力控传感是差异化关键。' },
];

const componentRows = [
  ['精密减速器', 85], ['伺服驱动', 75], ['控制器', 60], ['传感器', 55], ['结构材料', 95],
];

export default function Page() {
  const [robot, setRobot] = useState('industrial');
  const r = ROBOTS.find((x) => x.key === robot) || ROBOTS[0];

  const intelligenceLine = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2021', '2022', '2023', '2024E']),
    yAxis: valueY(),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: robot === 'humanoid' ? [15, 30, 65, 95] : robot === 'cobot' ? [40, 55, 72, 88] : [60, 72, 85, 92],
      lineStyle: { color: r.accent, width: 2 }, itemStyle: { color: r.accent },
      areaStyle: { color: `${r.accent}18` } }],
  }), [robot, r]);

  const sectorPie = useMemo(() => donutOpt(
    robot === 'humanoid'
      ? [{ value: 30, name: '服务/医疗', itemStyle: { color: '#c41e3a' } }, { value: 25, name: '物流仓储', itemStyle: { color: '#22d3ee' } }, { value: 20, name: '汽车制造', itemStyle: { color: '#e8a317' } }, { value: 25, name: '其他', itemStyle: { color: '#64748b' } }]
      : [{ value: 35, name: '汽车制造', itemStyle: { color: '#c41e3a' } }, { value: 25, name: '电子集成', itemStyle: { color: '#22d3ee' } }, { value: 15, name: '物流仓储', itemStyle: { color: '#e8a317' } }, { value: 25, name: '其他', itemStyle: { color: '#64748b' } }],
  ), [robot]);

  const humanoidPatentRadar = radarOpt(['本体结构', '灵巧手', '平衡控制', '感知交互', '核心部件'],
    robot === 'humanoid' ? [95, 88, 82, 90, 85] : [80, 75, 70, 78, 72],
    { name: '中国', color: r.accent });

  return (
    <div>
      <PageHeader badge="Robotics · 具身智能" title="工业机器人 · 人形产业化" subtitle="机器人密度 · 具身智能 · 核心零部件" />
      <IntroCard>中国机器人产业崛起是「以资本替代劳动」的长期博弈：全球过半工业机器人装机于中国，下一阶段的胜负手在<strong style={{ color: 'var(--text-primary)' }}>核心零部件自给率</strong>与人形机器人的量产能力。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${r.share}%`} label={`全球装机份额 · ${r.label}`} accent={r.accent} />
        <Stat value={`${r.density} 台`} label="机器人密度/万人" accent="#22d3ee" />
        <Stat value="45%" label="核心零部件国产化率" accent="#e8a317" />
        <Stat value="2025" label="人形机器人量产预期" accent="#10b981" />
      </Grid>

      <Card title="交互 · 机器人类型选择器" className="mb-6">
        <SelectorBar items={ROBOTS} activeKey={robot} onSelect={setRobot} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${r.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="智能泛化能力指数（随类型切换）"><EChart option={intelligenceLine} style={{ height: 220 }} /></Card>
          <Card title="应用需求分布"><EChart option={sectorPie} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="人形机器人专利布局（随类型切换）"><EChart option={humanoidPatentRadar} style={{ height: 280 }} /></Card>
        <Card title="核心零部件国产化成熟度">
          <Grid cols={5}>
            {componentRows.map(([name, score]) => (
              <div key={name} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 8 }}>
                <div className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
                <div className="text-sm font-bold" style={{ color: '#e8a317' }}>{score}</div>
                <div style={{ height: 3, background: 'rgba(148,163,184,0.15)', borderRadius: 2, margin: '2px 0' }}>
                  <div style={{ width: `${score}%`, height: '100%', background: r.accent, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </Grid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '密度即竞争力', subtitle: '392 台/万人', body: '机器人密度是制造强国核心指标，决定单位劳动成本曲线与产业链留存能力。', pillars: [['52% 全球份额', '连续十年第一。'], ['老龄化对冲', '自动化溢价。'], ['数据闭环', '工厂实景强化学习。']] },
        { title: '零部件利润', subtitle: '70% 成本', body: '减速器、伺服、控制器占整机成本约七成；谐波减速器已具全球竞争力，行星滚柱丝杠攻坚中。', pillars: [['减速器 60%', '国产化率。'], ['伺服 45%', '编码器精度。'], ['四大家族', '运动控制生态。']] },
        { title: '人形终局', subtitle: '第三超级终端', body: '继智能手机、新能源汽车之后的第三个超级终端；谁掌握通用机器人量产能力，谁掌握未来 50 年生产力主权。', pillars: [['Top 1 专利', '公开量领先。'], ['20% 降本', '2030 预期空间。'], ['具身智能', '大模型 + 机器身体。']] },
      ]} />

      <ModuleFooter moduleId="robotics" sourceNote="由 china.html「机器人」专题迁移升级" />
    </div>
  );
}
