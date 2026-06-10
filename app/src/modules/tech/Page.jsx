import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const rdTrend = {
  grid: { left: 52, right: 52, top: 28, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, data: ['R&D 经费 (亿元)', 'R&D 强度 (%GDP)'] },
  xAxis: { type: 'category', data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: [
    { type: 'value', name: '亿元', axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    { type: 'value', name: '%', min: 1.8, max: 3, axisLabel: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: 'R&D 经费 (亿元)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [14169, 15676, 17606, 19677, 22143, 24393, 27956, 30782, 33278, 36327], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } },
    { name: 'R&D 强度 (%GDP)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: [2.06, 2.10, 2.12, 2.14, 2.24, 2.41, 2.44, 2.54, 2.64, 2.69], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};
const innoRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 11 } },
  radar: { indicator: [{ name: '研发投入', max: 100 }, { name: '人才与论文', max: 100 }, { name: '基础设施', max: 100 }, { name: '原始创新', max: 100 }, { name: '产业转化', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [88, 92, 95, 72, 90], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' } },
    { value: [95, 90, 88, 98, 92], name: '美国', lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } },
  ] }],
};
const pctBar = {
  grid: { left: 44, right: 16, top: 28, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 } },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '中国', type: 'bar', stack: 'pct', data: [35, 38, 42, 45, 48], barWidth: 22, itemStyle: { color: '#c41e3a' } },
    { name: '美国', type: 'bar', stack: 'pct', data: [20, 22, 25, 28, 32], itemStyle: { color: '#e8a317' } },
    { name: '日本', type: 'bar', stack: 'pct', data: [45, 40, 33, 27, 20], itemStyle: { color: '#22d3ee', opacity: 0.7 } },
  ],
};

const domains = [
  ['智 · 人工智能', '大模型 · 智算 · 行业落地', '自主可控度 92% / 产业化成熟度 60% / 国际竞争力 78%（示意）', '#22d3ee'],
  ['量 · 量子信息', '九章 · 祖冲之 · 保密通信', '量子计算原型机与量子保密通信处于国际第一梯队。', '#c41e3a'],
  ['航 · 航天', '北斗 · 深空 · 空间站', '北斗全球组网、空间站常态化运营、深空探测持续推进。', '#e8a317'],
  ['能 · 能源', '双碳 · 新能源 · 核能', '新能源装机与核电技术形成规模优势，支撑双碳路径。', '#10b981'],
];
const roadmap = [
  ['01 · 2025 关键核心技术突破', '芯片、工业软件、基础材料等卡脖子领域取得阶段性进展。', '#22d3ee'],
  ['02 · 2030 进入创新型国家前列', '人工智能、量子、深空等领域形成全球竞争力与标准话语权。', '#e8a317'],
  ['03 · 2035 科技强国', '主要领域实现并跑领跑，支撑现代化经济体系与国家安全。', '#c41e3a'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Tech Policy · 科技自立自强" title="国家创新体系 · R&D 与高企" subtitle="研发强度 · 高新技术企业 · 科技自立自强" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国家统计局公报：2024 年全国 R&amp;D 经费投入约 3.63 万亿元，同比增 8.9%，占 GDP 比重约 2.69%。企业占比约 77.7%、基础研究占比约 6.9%，投入结构仍在向「全链条攻关」调整——既要总量追赶，更要原始创新与产业转化两端补强。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="3.63 万亿" label="R&D 经费 (2024)" accent="#c41e3a" />
        <Stat value="2.69%" label="R&D 占 GDP" accent="#22d3ee" />
        <Stat value="46.5 万件" label="发明专利授权" accent="#e8a317" />
        <Stat value="6.9%" label="基础研究占比" accent="#10b981" />
      </Grid>
      <Card title="研发经费 (R&D) 趋势 · 总量与强度（2015-2024）" className="mb-6"><EChart option={rdTrend} style={{ height: 280 }} /></Card>
      <Grid cols={2} className="mb-6">
        <Card title="创新维度雷达 · 中美对比（示意）"><EChart option={innoRadar} style={{ height: 280 }} /></Card>
        <Card title="PCT 国际专利申请 · 中美日（千件 · 示意区间）"><EChart option={pctBar} style={{ height: 280 }} /></Card>
      </Grid>

      <Card title="重点领域布局" className="mb-6">
        <Grid cols={4}>
          {domains.map(([t, s, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <div className="text-[11px] mt-0.5 mono" style={{ color: c }}>{s}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="投入结构 · 谁在出钱，钱投向哪">
          <div className="space-y-2">
            {[['企业主体 77.7%', '企业是研发投入绝对主体，但偏重试验开发与应用端，离市场近、离源头远。', '#c41e3a'],
              ['基础研究 6.9%', '占比逐年提升仍低于主要创新国家（10-20%），是「原始创新」短板的结构性根源。', '#22d3ee'],
              ['高新技术企业', '高企认定与「专精特新」分层培育构成企业端创新政策抓手，约九成高企为民营。', '#e8a317']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="创新画像 · 强在规模，弱在源头">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>雷达图显示的非对称结构：研发投入、人才论文、基础设施、产业转化四个维度上中国已接近或并跑，唯独「原始创新」一项显著落后——这正是 PCT 专利量领先与卡脖子并存的解释变量。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>数量优势</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>PCT 申请量自 2019 年起居全球首位，发明专利授权 46.5 万件。</p></div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>质量约束</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高被引论文与从 0 到 1 的突破仍集中于少数领域，转化率待提升。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="至 2035 科技强国路线图" className="mb-6">
        <Grid cols={3}>
          {roadmap.map(([t, d, c]) => (
            <div key={t}><div className="text-sm font-semibold mono" style={{ color: c }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>3.63 万亿的投入规模已无悬念，真正的变量在结构：基础研究占比能否向两位数爬坡、企业研发能否从「跟随式开发」转向「源头式创新」，决定 2035 科技强国目标是规模叙事还是能力叙事。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国家统计局《2024 年全国科技经费投入统计公报》、WIPO PCT（专利量为示意区间）· 由 china.html「科技与创新」专题迁移</p>
    </div>
  );
}
