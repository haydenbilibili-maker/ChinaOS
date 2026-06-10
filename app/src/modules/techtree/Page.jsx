import React from 'react';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 重大科技成熟度（TRL 示意，0-9）与战略权重
const techMaturity = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 9, name: 'TRL', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['军事 AI', '太空/重型运载', '可控核聚变', '量子计算', '先进半导体', '大模型 AI'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{
    type: 'bar', data: [6, 7, 4, 5, 6, 8], barWidth: 14,
    itemStyle: {
      borderRadius: 3,
      color: (p) => ['#64748b', '#22d3ee', '#e8a317', '#22d3ee', '#c41e3a', '#22d3ee'][p.dataIndex],
    },
    label: { show: true, position: 'right', formatter: 'TRL {c}', color: '#93a1b5' },
  }],
};

const BRANCHES = [
  { t: 'AI', d: '大模型与智算落地、端到端、军事 AI；算力调度为约束。', trl: '领先梯队' },
  { t: '可控核聚变', d: '托卡马克与紧凑路线并进；工程化与商业化仍远。', trl: '攻坚期' },
  { t: '太空技术', d: '重型运载、低轨星座、商业航天；轨道资产争夺。', trl: '加速期' },
  { t: '军事技术', d: '高超声速、无人集群、反介入/区域拒止体系。', trl: '换代中' },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Tech Tree"
        title="科技树 · 进展与博弈"
        subtitle="AI · 可控核聚变 · 太空 · 军事技术 —— 以成熟度（TRL）与战略权重定位换道超车的节点"
      />
      <Grid cols={2} className="mb-6">
        {BRANCHES.map((b) => (
          <Card key={b.t} title={b.t}>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{b.d}</p>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{b.trl}</span>
          </Card>
        ))}
      </Grid>
      <Card title="重大科技成熟度 TRL（示意）">
        <EChart option={techMaturity} style={{ height: 280 }} />
      </Card>
    </div>
  );
}
