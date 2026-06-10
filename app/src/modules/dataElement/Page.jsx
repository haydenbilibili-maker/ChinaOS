import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const marketTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [550, 750, 950, 1200, 1500], barWidth: 28, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
};
const sectorPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 28, name: '金融', itemStyle: { color: '#c41e3a' } },
    { value: 22, name: '政务/公共', itemStyle: { color: '#22d3ee' } },
    { value: 20, name: '互联网', itemStyle: { color: '#e8a317' } },
    { value: 18, name: '工业', itemStyle: { color: '#10b981' } },
    { value: 12, name: '医疗', itemStyle: { color: '#64748b' } },
  ] }],
};
const privacyRadar = {
  legend: { data: ['2024 水平', '2021 水平'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: 'MPC', max: 100 }, { name: '联邦学习', max: 100 }, { name: 'TEE', max: 100 }, { name: '性能', max: 100 }, { name: '合规', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [85, 90, 80, 72, 88], name: '2024 水平', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [60, 62, 55, 45, 60], name: '2021 水平', lineStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.1)' } },
  ] }],
};

const EXCHANGES = [
  ['上海数据交易所', '以「数商」生态为核心，推动数据产品标准化挂牌与跨境流通试点，金融与航运数据为重点。', '国家级枢纽 · 数商生态'],
  ['深圳数据交易所', '背靠粤港澳大湾区，聚焦企业数据与跨境合规流通，探索数据资产入表与场内登记。', '湾区 · 跨境合规'],
  ['北京国际大数据交易所', '依托公共数据授权运营与隐私计算，主打「可用不可见」的安全交付与政务数据开放。', '公共数据 · 隐私计算'],
  ['区域与行业交易平台', '贵阳、广州、郑州等地交易场所与行业平台并行，承接区域要素配置与垂直行业流通。', '区域节点 · 行业垂直'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Data Element · Digital Gold Rush" title="数据要素与数字基础制度" subtitle="数据二十条 · 确权 · 入表 · 东数西算 —— 数据被列为第五大生产要素" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>数据基础制度、交易所试点与算力布局构成数字时代的基础设施。本模块呈现数据要素市场化与算力主权的演进逻辑。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~1,500 亿" label="2024 数据市场 (RMB)" accent="#22d3ee" />
        <Stat value="25%+" label="年均增速预期" accent="#10b981" />
        <Stat value="40+ 家" label="数据交易所/平台" />
        <Stat value="#1" label="算力规模全球排名" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="数据要素市场规模（RMB · 亿 · 示意）"><EChart option={marketTrend} style={{ height: 240 }} /></Card>
        <Card title="数据交易行业分布（2024 · 示意）"><EChart option={sectorPie} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="数据交易所与流通基础设施" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>以「数据二十条」为顶层框架，各地交易所承担确权登记、合规交付与场内交易，从分散试点走向区域枢纽。</p>
        <Grid cols={2}>
          {EXCHANGES.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="隐私计算能力成熟度（示意）">
          <EChart option={privacyRadar} style={{ height: 240 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>MPC / 联邦学习 / TEE 三条路线支撑「可用不可见」，让数据确权后合规交付、价值释放。</p>
        </Card>
        <Card title="数据基础制度 · 三权分置与资产入表">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>「数据二十条」确立<strong style={{ color: 'var(--text-primary)' }}>数据资源持有权、加工使用权、产品经营权</strong>三权分置，破解确权难题；数据资产入表推动数据从成本项走向资产负债表。</p>
          <Grid cols={2}>
            <Stat value="三权分置" label="持有/使用/经营" accent="#22d3ee" />
            <Stat value="数据入表" label="确权/计量/披露" accent="#c41e3a" />
          </Grid>
        </Card>
      </Grid>

      <Card title="系统视角下的三条主线" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从场外走向场内', '大量交易仍在场外、与 C 端灰色流通并存；制度红利在于把 B 端与公共数据高价值流通纳入合规场内。'],
            ['2 · 算力与数据耦合', '「东数西算」重构算力地理分布，叠加数据要素 x 行动，决定数据加工与价值释放的物理底座与成本曲线。'],
            ['3 · 数据喂养大模型', '通往 AGI 的竞争本质是高质量语料与领域数据的竞争，确权与流通制度决定合规数据供给规模。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统判断"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>数据要素市场的瓶颈不在技术，而在确权、定价与跨主体信任机制；制度设计能否跑赢技术演进，决定要素市场化配置的最终深度。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供分析参考 · 由 tabs/dataElement.html 迁移</p>
    </div>
  );
}
