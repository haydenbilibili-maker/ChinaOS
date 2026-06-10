import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const rdPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 6.9, name: '基础研究', itemStyle: { color: '#c41e3a' } },
    { value: 12, name: '应用研究', itemStyle: { color: '#22d3ee' } },
    { value: 81.1, name: '试验发展', itemStyle: { color: '#27324a' } },
  ] }],
};
const reformBar = {
  grid: { left: 100, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['大科学装置开放', '青年经费倾斜', '破四唯评价', '有组织科研'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [65, 55, 70, 80], barWidth: 14, itemStyle: { color: '#10b981', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
};
const natureBar = {
  grid: { left: 60, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['德国', '英国', '美国', '中国'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [8, 9, 22, 24], barWidth: 16, itemStyle: { color: (p) => p.dataIndex === 3 ? '#c41e3a' : '#64748b', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};

const ACTORS = [
  ['国家实验室体系', '面向芯片、材料、生命健康、空天等长周期领域，强调跨单位攻关与稳定经费；考核从论文导向向任务导向与国家安全外部性延伸。', '领衔制/梯队 · 大装置+专利'],
  ['高校与学科调整', '「双一流」与交叉学科扩容支撑原始创新；研究生规模与论文全球领先，挑战在评价改革与重复研究治理。', '引用/人才流动 · 内卷与同质化'],
  ['新型研发机构与中试', '地方与央企共建，承担「死亡之谷」阶段的工艺验证与首台套；混合所有制与股权激励试点。', '引导基金/产投 · 审计与问责'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Basic Science · 制度演进" title="基础研究与研发结构" subtitle="原始创新 · 国家实验室重组 · 评价改革 —— 压缩从论文到样机的制度时滞" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>2024 年 R&D 经费中基础研究约 2,501 亿元、占 6.9% 左右；应用研究约 12%、试验发展仍占主体。国家实验室重组、大科学装置与「揭榜挂帅」并行。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="3.63 万亿" label="2024 R&D 经费 (RMB)" accent="#22d3ee" />
        <Stat value="~6.9%" label="基础研究占比 (2024)" accent="#c41e3a" />
        <Stat value="#1" label="2023 自然指数" accent="#e8a317" />
        <Stat value="1,200+" label="重大科技基础设施" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="R&D 经费结构（% · 示意）"><EChart option={rdPie} style={{ height: 240 }} /></Card>
        <Card title="改革维度推进度（模型示意）"><EChart option={reformBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="国家实验室 · 高校 · 新型研发机构" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>以战略领域重组国家实验室，推动「有组织科研」；高校侧重自由探索，新型研发机构衔接中试与产业资本，把制度时滞转化为可度量的技术就绪度（TRL）。</p>
        <Grid cols={3}>
          {ACTORS.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="评价改革与科研资源再配置">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>破「四唯」后，代表作、专利质量与工程突破纳入考核，但行政化评审惯性仍在。经费向青年科学家与冷门学科倾斜，与地方政绩冲动之间存在张力。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>分类评价与长周期</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>基础研究容忍失败，应用研究对齐产业 KPI，试验发展绑定国产化率与首台套。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>大科学装置开放共享</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>同步辐射、聚变、射电等装置提升公共实验能力；运维成本与排队机制影响中小企业可及性。</p></div>
          </div>
        </Card>
        <Card title="主要国家自然指数份额（示意）">
          <EChart option={natureBar} style={{ height: 180 }} />
          <div className="flex gap-4 mt-2 text-xs"><span style={{ color: 'var(--text-tertiary)' }}>高被引份额年增 <span style={{ color: 'var(--text-primary)' }}>&gt; 10%</span></span><span style={{ color: 'var(--text-tertiary)' }}>国际合作论文 <span style={{ color: 'var(--text-primary)' }}>~28.5%</span></span></div>
        </Card>
      </Grid>

      <Card title="战略结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 基础研究占比仍偏低', '与 OECD 领先国相比，「从 0 到 1」的投入强度与稳定度仍是短板，需与产业反哺衔接。'],
            ['2 · 组织形态决定转化速率', '国家实验室抓总、新型研发机构做中试、企业提需求的三角结构若不契约化，易停留在运动式攻关。'],
            ['3 · AI for Science 放大马太效应', '算力与高质量语料向头部集聚，若无公共数据与开源工具投入，基础研究的「机会公平」将承压。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="制度锚点"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>基础研究是新质生产力与算力主权的上游；其回报率以十年尺度计量，与年度 GDP 考核存在天然张力，需靠中央财政与法治化的科研诚信体系托底。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>自然指数、论文与合作占比为行业公开区间与模型示意，以 Nature Research、国家统计局公报为准 · 由 china.html「基础研究」专题迁移</p>
    </div>
  );
}
