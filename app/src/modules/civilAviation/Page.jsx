import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const demandTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2024', '2029', '2034', '2039', '2043'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '架', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [1400, 1800, 2100, 2400, 2700], barWidth: 26, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
};
const localizeBar = {
  grid: { left: 70, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['发动机', '航电', '机体结构', '客舱内饰'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [25, 55, 80, 90], barWidth: 14, itemStyle: { color: (p) => ['#c41e3a', '#e8a317', '#10b981', '#10b981'][p.dataIndex], borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
};
const makerRadar = {
  legend: { data: ['COMAC', 'Boeing', 'Airbus'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: '产品谱系', max: 100 }, { name: '产能', max: 100 }, { name: '适航互认', max: 100 }, { name: '发动机', max: 100 }, { name: '后市场', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [60, 45, 35, 30, 40], name: 'COMAC', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [95, 90, 100, 95, 95], name: 'Boeing', lineStyle: { color: '#22d3ee' } },
    { value: [98, 95, 100, 90, 92], name: 'Airbus', lineStyle: { color: '#e8a317' } },
  ] }],
};

const MODELS = [
  ['ARJ21 支线客机', '已交付超 100 架，主要执飞支线；持续迭代与国产发动机配套。', '78–97 座 · 订单 >30 家航司'],
  ['C919 窄体干线', '国产大飞机主力，已商运并放量，对标 A320neo / 737 MAX。', '158–192 座 · 订单千架以上'],
  ['C929 宽体客机', '面向远程双通道市场的研制项目，设计航程约 12,000 公里级别。', '280–350 座 · 研制与试验中'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Civil Aviation · Trillion Market" title="民航与国产大飞机布局" subtitle="C919 · ABC 产品线 · 发动机攻坚 · 适航出海 —— 未来 20 年约 1.5 万亿新机需求" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>C919 取证商飞标志产业链自主可控的关键一步；窄体/宽体/支线形成 ABC 产品线，与材料、发动机、适航深度耦合。大飞机不只是一架飞机，而是一国高端制造与适航体系的综合检验。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="1,200+ 架" label="C919 订单量" accent="#22d3ee" />
        <Stat value="~9 万亿" label="未来 20 年新机市场" accent="#e8a317" />
        <Stat value="~60%" label="C919 国产化率目标" accent="#10b981" />
        <Stat value="#1" label="国内民航市场规模" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="新机需求预测（2024–2043 · 架 · 示意）"><EChart option={demandTrend} style={{ height: 240 }} /></Card>
        <Card title="关键系统国产化程度（% · 示意）"><EChart option={localizeBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="国产机型与产品线 · ARJ21 / C919 / C929" className="mb-6">
        <Grid cols={3}>
          {MODELS.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="航空发动机攻坚 · CJ-1000A">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>发动机是大飞机产业链上最难攻克的核心环节。国产 CJ-1000A 大涵道比涡扇处于研制与适航验证阶段，目标逐步替代进口动力。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>动力进口依赖</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>现役 LEAP-1C 仍依赖进口，是产业链国产化的最大短板。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>自主动力研制提速</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高温合金、热端部件与整机试验推进，从台架走向装机验证（TRL 7-8）。</p></div>
          </div>
        </Card>
        <Card title="三大主制造商综合能力对比（示意）"><EChart option={makerRadar} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="走向全球 · 适航互认与出海" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>走向国际市场的核心门槛是 EASA/FAA 适航取证与互认。一旦获得 EASA 型号认可，C919 才能真正打开海外市场。</p>
        <Grid cols={2}>
          <Stat value="审定推进中" label="EASA 适航 · 目标 2025-26" accent="#e8a317" />
          <Stat value="~15% (2035)" label="单通道全球份额目标" accent="#22d3ee" />
        </Grid>
      </Card>

      <Card title="系统视角下的三重逻辑" className="mb-6">
        <Grid cols={3}>
          {[['1 · 产业链拉动效应', '牵引材料、电子、机电与制造协同升级，整机带动上下游产值放大约 1:8。'],
            ['2 · 从制造到服务延伸', '价值重心由整机销售向全寿命周期转移，运营、MRO 维修与航材后市场成为长期收益。'],
            ['3 · 数字化与智能运维', '借 5G 与数据链实现飞机健康管理 (PHM)，从被动维修转向预测性运维。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统结论"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>C919 的真正意义在于打通自主可控的产业链与制度能力，而非短期市场份额。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为商飞(COMAC)、民航局(CAAC)、IATA 等公开信息综合整理及示意值 · 由 tabs/civilAviation.html 迁移</p>
    </div>
  );
}
