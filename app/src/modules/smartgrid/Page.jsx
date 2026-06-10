import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const uhvTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2017', '2019', '2021', '2023', '2025E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [0.6, 1.2, 1.9, 2.8, 4.0, 5.5], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }],
};
const digitalImpact = {
  grid: { left: 40, right: 40, top: 30, bottom: 24 },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10 },
  xAxis: { type: 'category', data: ['预测', '调度', '保护', '计量', '市场'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: [
    { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    { type: 'value', position: 'right', axisLabel: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '数字化覆盖', type: 'bar', data: [85, 72, 60, 45, 92], barWidth: 18, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '线损系数', type: 'line', yAxisIndex: 1, smooth: true, data: [1.2, 1.5, 2.1, 1.8, 1.1], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};
const resilienceRadar = {
  radar: { indicator: [{ name: '备用', max: 100 }, { name: '黑启动', max: 100 }, { name: '网架', max: 100 }, { name: '数字化', max: 100 }, { name: '储能', max: 100 }, { name: '跨区', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [75, 82, 95, 88, 90, 92], name: '2024 评估', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } }] }],
};

const sglsCards = [
  ['源 · 多能互补基地', '风光火储一体化降低弃电率；水电与抽蓄提供快速爬坡。预测精度 95%+，对象为省级调度。', '#10b981'],
  ['网 · 主网架与 N-1', '特高压直流与交流混联；故障隔离与潮流重分配依赖保护整定。准则 N-1，场景为极端天气。', '#22d3ee'],
  ['荷 · 虚拟电厂 VPP', '聚合工商业可调负荷与分布式资源参与辅助服务市场。渗透约 5% 负荷，落地于现货试点省。', '#e8a317'],
  ['储 · 多技术储能', '锂电、抽蓄、压缩空气、液流等按时长与功率分层配置；独立储能目标 100%+ 利用率。', '#c41e3a'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Smart Grid · 新型电力系统" title="特高压骨干 · 储能调度" subtitle="特高压 · 配网数字化 · 新型储能 · 虚拟电厂" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>特高压把西部风光搬到东部负荷中心。风光渗透率提高后，系统转动惯量下降、频率与电压问题显性化；抽蓄、储能、需求响应与数字化调度共同构成「柔性电网」，并与「东数西算」形成电力协同。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="35 万+ km" label="输电线路（量级）" accent="#e8a317" />
        <Stat value="~3 亿 kW" label="跨区输送能力（示意）" accent="#22d3ee" />
        <Stat value="#1" label="特高压工程规模" accent="#c41e3a" />
        <Stat value="~14%" label="非化石装机占比区间" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="跨区输送电量走势（万亿 kWh · 示意）"><EChart option={uhvTrend} style={{ height: 240 }} /></Card>
        <Card title="数字化对消纳与安全的影响（示意）"><EChart option={digitalImpact} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="源网荷储协同 · 电源侧多能互补 / 电网侧柔性互联 / 负荷侧资源聚合 / 储能侧多路线并行" className="mb-6">
        <Grid cols={4}>
          {sglsCards.map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="电网韧性六维（2024 · 示意）"><EChart option={resilienceRadar} style={{ height: 260 }} /></Card>
        <Card title="调度大脑 · AI 与边缘计算">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>超短期功率预测、网络拓扑优化与故障定位依赖数据融合；虚拟电厂与分布式交易对计量与结算提出合规要求。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>虚拟电厂运营</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>聚合商作为市场主体参与调峰调频；合约与信用是关键。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>调度 AI 与网损</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>优化潮流可降低线损；需防范模型黑箱与网络安全风险。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>韧性与备用</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>极端天气与地缘冲击下，备用容量与黑启动路径构成隐性成本；微电网与分布式光伏提升末端韧性。城市配网供电可靠率约 99.9%，备用容量按省由现货市场披露。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 现货与辅助服务', '定价机制决定储能、火电灵活性与用户侧响应的经济性。'],
            ['2 · 跨省输电与地方利益', '送受端省份对电价与环保责任分配敏感。'],
            ['3 · 网络安全', '调度系统与工控设备成为关键信息基础设施保护对象。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>投资优先级正从特高压主网向数字化与储能倾斜（示意指数：数字化 420 / 储能 350 / 需求响应 280 / 配网 210 / 特高压 120）——新型电力系统的瓶颈已从「输得出」转向「调得动」。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开资料与模型示意，与能源局、电网企业发布值可能不一致；参考国家电网、南方电网公开材料 · 由 china.html「智能电网」专题迁移</p>
    </div>
  );
}
