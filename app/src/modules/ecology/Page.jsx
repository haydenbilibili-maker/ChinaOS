import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const forestTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['1949', '1980', '2000', '2010', '2020', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [8.6, 12, 16.6, 20.4, 23.0, 24.02], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};
const speciesChart = {
  legend: { data: ['2000 基准', '2024 现状'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 60, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['藏羚羊', '东北虎', '大熊猫', '朱鹮'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [
    { name: '2000 基准', type: 'bar', data: [100, 100, 100, 100], barWidth: 9, itemStyle: { color: '#27324a' } },
    { name: '2024 现状', type: 'bar', data: [300, 180, 165, 250], barWidth: 9, itemStyle: { color: '#10b981' } },
  ],
};
const energyTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', name: '单位GDP能耗指数', data: [100, 88, 78, 70], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.08)' } }],
};

const PARKS = [
  ['三江源', '长江/黄河/澜沧江发源地，「中华水塔」。以水源涵养与高原生态完整性为核心，面积约 19.07 万 km²，旗舰物种藏羚羊/雪豹。'],
  ['大熊猫', '打通栖息地走廊，连通分割种群，野外种群恢复至 1900 余只。'],
  ['东北虎豹', '跨境栖息地连通 + 红外监测网络，野生东北虎稳定繁殖、破 30 只。'],
  ['海南热带雨林', '保护长臂猿等热带物种，修复岛屿生态系统完整性。'],
  ['武夷山', '世界文化与自然双遗产，保护亚热带森林与生物多样性。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Ecology" title="生态文明 · 从治理到价值的系统重构" subtitle="绿水青山 · 双碳目标 · 生态产品价值实现 —— 把生态作为可核算、可定价、可交易的底层资产" />
      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          生态不再只是被保护的对象，而是被纳入核算、定价与交易的系统资产。从大规模国土绿化，到全国碳市场与生态产品价值实现机制，过去 20 年的方向，是把外部性内化为可量化、可激励的制度安排。
        </p>
      </Card>
      <Grid cols={4} className="mb-6">
        <Stat value="24.02%" label="森林覆盖率" accent="#10b981" />
        <Stat value="18%" label="非化石能源占比目标" accent="#22d3ee" />
        <Stat value="30%+" label="全球新增绿化贡献" />
        <Stat value="230,000" label="自然保护地数量级" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="森林覆盖率变迁（1949–2024 · %）"><EChart option={forestTrend} style={{ height: 240 }} /></Card>
        <Card title="环境投入与单位 GDP 能耗趋势（示意）"><EChart option={energyTrend} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="国家公园 · 山水林田湖草沙的系统治理" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>以整体生态系统而非单一物种为单元，统一边界、统一管理、统一核算，重构保护地体系。</p>
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
        <Card title="物种回归 · 生态修复的可见信号（指数 2000=100）">
          <EChart option={speciesChart} style={{ height: 200 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>大熊猫受威胁等级由「濒危」降为「易危」；东北虎跨境繁殖稳定。旗舰物种种群是生态健康度最直观的指标。</p>
        </Card>
        <Card title="降碳减污 · 扩绿与增长协同">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            环境治理不是增长的对立面。单位 GDP 能耗持续下降、碳排放强度较峰值降幅超 25%，环保产业本身成为新增长极。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>大气与水治理</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>重点城市 PM2.5 与劣Ⅴ类水体比例持续下降。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>全国碳市场与 CCUS</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>碳定价与碳捕集利用，把减排成本转化为可交易资产。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="制度创新 · 让生态资产可定价" className="mb-6">
        <Grid cols={3}>
          {[['1 · 生态产品价值核算', '以生态系统生产总值(GEP)为工具，把水源涵养、固碳、生物多样性等服务量化入账。'],
            ['2 · 价值实现路径', '通过生态补偿、碳汇交易与绿色金融，把核算价值转化为可流动、可变现的现金流。'],
            ['3 · 全球承诺', '主导 COP15、推动「昆明-蒙特利尔」框架，呼应「3030」目标——2030 前保护 30% 陆海。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统视角">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>美丽中国的本质，是用核算、定价与交易三层机制，把「绿水青山」稳定地转换为「金山银山」，让生态保护具备自我维持的经济动力。</p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理及示意值，部分指标参考 WCMC、UNEP 等 · 由 tabs/ecology.html 迁移</p>
    </div>
  );
}
