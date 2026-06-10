import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const penetrationTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [5, 6, 14, 26, 36, 50], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const compareRadar = {
  legend: { data: ['新能源车', '传统燃油车'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: '三电/动力', max: 100 }, { name: '智能化', max: 100 }, { name: '产业链', max: 100 }, { name: '成本', max: 100 }, { name: '补能网络', max: 100 }, { name: '品牌溢价', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [95, 90, 98, 85, 80, 60], name: '新能源车', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [70, 40, 60, 75, 95, 85], name: '传统燃油车', lineStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.1)' } },
  ] }],
};
const mix2030 = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 55, name: '纯电 BEV', itemStyle: { color: '#c41e3a' } },
    { value: 25, name: '插混/增程', itemStyle: { color: '#e8a317' } },
    { value: 15, name: '燃油 ICE', itemStyle: { color: '#27324a' } },
    { value: 5, name: '氢能/其他', itemStyle: { color: '#22d3ee' } },
  ] }],
};

const SDV = [
  ['城区 NOA / 智能驾驶', '从高速领航向城区点到点延伸，逐步摆脱高精地图依赖，转向以视觉与 AI 大模型为核心的端到端方案。', '渗透率 30%+ · 重感知轻地图'],
  ['车载智驾芯片（自研）', '从外购 Orin 转向自研车规级智驾与座舱芯片，缓解供应链与成本约束，部分平台算力迈向 1000+ TOPS。', '突破口算力自主 · 约束先进制程'],
  ['集中式电子电气架构', '从分布式 ECU 走向域控与中央计算，线束与算力集中化，为整车 OTA、持续迭代与软件付费提供底层支撑。', '域控/中央计算 · 整车 OTA'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Automotive · SDV" title="汽车与新能源车产业" subtitle="电动化 · 智能化 · 三电 · 出海 —— 2024 渗透率超 50%、产销与出口全球第一" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>电动化解决了底盘与动力，智能化决定下一阶段的竞争。整车厂正把价值链从硬件向软件与算力迁移；软件定义汽车（SDV）、智能座舱与 OTA 迭代成为竞争焦点。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="50%+" label="NEV 渗透率" accent="#22d3ee" />
        <Stat value="500 万+" label="新能源车销量" />
        <Stat value="~60%" label="全球动力电池份额" accent="#c41e3a" />
        <Stat value="#1" label="汽车出口量" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="新能源车渗透率走势（% · 示意）"><EChart option={penetrationTrend} style={{ height: 240 }} /></Card>
        <Card title="动力形式结构预测 2030（示意）"><EChart option={mix2030} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="智能化主战场 · SDV 软件定义汽车" className="mb-6">
        <Grid cols={3}>
          {SDV.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="换道超车 · 燃油 vs 新能源能力对比（示意）"><EChart option={compareRadar} style={{ height: 280 }} /></Card>
        <div className="space-y-4">
          <Card title="出海升级 · 从整车出口到本地建厂">
            <div className="space-y-2">
              <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>技术与产能输出</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>经合资、技术授权（如与 Stellantis 合作）与海外建厂，把三电与平台能力反向输出至传统强国。</p></div>
              <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>关税与贸易壁垒</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>欧盟反补贴关税、美国封锁与本地化审查，倒逼以本地生产和合规对冲贸易摩擦。</p></div>
            </div>
          </Card>
          <Card title="燃油 vs 新能源">
            <div className="flex gap-4">
              <div><div className="text-lg font-bold mono" style={{ color: 'var(--text-secondary)' }}>~10%</div><div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>燃油车全球份额</div></div>
              <div><div className="text-lg font-bold mono" style={{ color: 'var(--china-red)' }}>全球 #1</div><div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>新能源车竞争力</div></div>
            </div>
          </Card>
        </div>
      </Grid>

      <Card title="面向下一阶段的三条主线" className="mb-6">
        <Grid cols={3}>
          {[['1 · 动力电池与充换电', '巩固电池规模与成本优势，铺开高压快充与换电网络，缓解补能焦虑。'],
            ['2 · 三电与产业链本土化', '电池/电机/电控全栈自主，SiC 等关键器件趋近 100% 国产化。'],
            ['3 · 智驾向高阶演进', '以端到端大模型为主线，2025–2026 逐步落地 L3，把智驾从卖点变标配。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统视角"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>电动化是入场券，智能化与 AI 才是护城河；真正的汽车主权，在于三电、芯片、智驾与充换电网络的全栈可控，而非单一车型的销量。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据综合自中汽协(CAAM)、行业研究与 Canalys 等公开信息，部分为示意值 · 由 tabs/automotive.html 迁移</p>
    </div>
  );
}
