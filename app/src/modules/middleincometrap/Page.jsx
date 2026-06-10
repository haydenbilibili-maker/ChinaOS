import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 中等收入陷阱（Middle Income Trap）交互模型
// ----------------------------------------------------------------------------
// 低成本优势消失、又难在高端创新上与发达国家竞争 → 人均 GDP 长期停滞。
// 跨越四要件：全要素生产率(TFP) / 人力资本 / 制度质量 / 创新体系。
// 三条路径：韩国跨越 · 拉美陷阱 · 中国当前关键窗口。
// ============================================================================

const PATHS = {
  korea: {
    label: '韩国 · 跨越', accent: '#10b981',
    gdp: [1.7, 3.6, 6.6, 12, 20, 28, 34],
    radar: [88, 90, 82, 85],
    note: '产业升级（半导体/造船/汽车）+ 研发强度全球第一 + 制度法治持续改良，1990s 后突破高收入线，未陷入停滞。',
  },
  latam: {
    label: '拉美 · 陷阱（阿根廷/巴西）', accent: '#c41e3a',
    gdp: [4, 6.5, 8, 8.5, 9, 8.8, 9.2],
    radar: [35, 48, 30, 38],
    note: '资源/初级品依赖、TFP 停滞、制度俘获与民粹周期 → 人均 GDP 在 8–10k 美元徘徊数十年，典型「陷阱」样本。',
  },
  china: {
    label: '中国 · 当前关键窗口', accent: '#22d3ee',
    gdp: [0.3, 1, 2.6, 6.5, 10.5, 12.6, 16],
    radar: [62, 70, 58, 68],
    note: '已越过中高收入门槛，人口红利消退、传统成本优势减弱；能否跨越取决于新质生产力、TFP 与制度型开放能否接棒。',
  },
};
const RADAR_IND = [{ name: '全要素生产率 TFP', max: 100 }, { name: '人力资本', max: 100 }, { name: '制度质量', max: 100 }, { name: '创新体系', max: 100 }];
const LEVERS = [
  ['全要素生产率 TFP', '从要素投入驱动转向效率驱动——劳动/资本之外的「技术与配置」贡献率，是跨越的核心引擎。'],
  ['人力资本', '高等教育普及 + 工程师红利，把人口数量优势转为质量优势，承接高端制造与服务业。'],
  ['制度质量', '产权保护、法治、营商环境与开放度，决定创新能否被激励、资源能否被高效配置。'],
  ['创新体系', '基础研究—产业转化—风险资本闭环，从「引进消化」走向「原始创新」，避免被锁死在中低端。'],
];
const MAP = [
  ['新质生产力', '以科技创新驱动 TFP 跃升——正是跨越陷阱的第一抓手。'],
  ['科技树 / 自主创新', '攻坚「卡脖子」环节，补齐创新体系闭环，向价值链高端攀升。'],
  ['教育 / 人才', '工程师红利与人力资本积累，为高端产业提供承接能力。'],
];

export default function Page() {
  const [p, setP] = useState('china');
  const pc = PATHS[p];
  const gdpOption = {
    grid: { left: 44, right: 16, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: ['1970', '1980', '1990', '2000', '2010', '2020', '2030E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'value', name: '人均GDP(千美元)', nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
    series: [
      { type: 'line', smooth: true, data: [13, 13, 13, 13, 13, 13, 13], lineStyle: { color: '#e8a317', type: 'dashed', width: 1 }, symbol: 'none', name: '高收入门槛' },
      { type: 'line', smooth: true, data: pc.gdp, lineStyle: { color: pc.accent, width: 3 }, itemStyle: { color: pc.accent }, areaStyle: { color: pc.accent + '22' }, name: pc.label },
    ],
    legend: { data: ['高收入门槛', pc.label], textStyle: { color: '#93a1b5' }, top: 0 },
  };
  const radarOption = {
    radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [{ value: pc.radar, name: pc.label, lineStyle: { color: pc.accent }, areaStyle: { color: pc.accent + '24' } }] }],
  };

  return (
    <div>
      <PageHeader badge="Cognition · 中等收入陷阱" title="中等收入陷阱 · 为何多数经济体止步于此"
        subtitle="低成本优势消失、高端又难敌发达国家 —— 选择路径，看人均 GDP 是持续上行还是长期停滞" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        经济体迈入中等收入后，廉价劳动力优势让位于新兴低成本国家，而在创新与高端制造上又<strong style={{ color: 'var(--text-primary)' }}>尚不能与发达国家竞争</strong>，人均 GDP 因而在「夹层」中长期停滞——这就是<strong style={{ color: 'var(--text-primary)' }}>中等收入陷阱</strong>。跨越与否，取决于增长动能能否从要素投入切换到 TFP、人力资本、制度与创新驱动。
      </p></Card>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(PATHS).map(([k, v]) => (
          <button key={k} onClick={() => setP(k)} className="text-sm px-3 py-1.5 rounded mono"
            style={{ background: k === p ? v.accent + '33' : 'var(--bg-elevated)', color: k === p ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === p ? v.accent : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
        ))}
      </div>

      <Grid cols={3} className="mb-6">
        <Stat value={pc.gdp[pc.gdp.length - 1] + 'k'} label="2030E 人均GDP(美元) · 示意" accent={pc.accent} />
        <Stat value={pc.radar[0]} label="全要素生产率 TFP 评分" accent="#22d3ee" />
        <Stat value={pc.gdp[6] > 13 ? '已跨越' : '停滞中'} label="相对高收入门槛(13k)" accent={pc.gdp[6] > 13 ? '#10b981' : '#e8a317'} />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="人均 GDP 轨迹 · 跨越 vs 停滞（示意）">
          <EChart option={gdpOption} style={{ height: 260 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{pc.note}</p>
        </Card>
        <Card title="跨越四要件 · 能力画像">
          <EChart option={radarOption} style={{ height: 260 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>韩国四角拉满（跨越）；拉美塌陷（陷阱）；中国处于关键攀升期。</p>
        </Card>
      </Grid>

      <Card title="跨越的四个抓手" className="mb-6">
        <Grid cols={2}>
          {LEVERS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="项目映射 · 中国的跨越抓手">
        <Grid cols={3} className="mb-3">
          {MAP.map(([t, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--cyber-cyan)' }}>{t}</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          中国正处<strong style={{ color: 'var(--text-primary)' }}>关键窗口</strong>：传统成本优势减弱，能否跨越取决于<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>新质生产力 / 科技树 / 教育人才</span>能否接棒成为新的增长引擎——这正是与本项目其他模块的接口。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为发展经济学概念梳理与思想工具，曲线/雷达/评分均为示意，不构成对具体经济体的预测。</p>
    </div>
  );
}
