import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 国内供给 vs 进口依存（堆叠横条 · 示意）
const supplyRiskBar = {
  grid: { left: 90, right: 24, top: 28, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['半导体/装备', '稀土/材料', '医药', '汽车电子', '化工', '能源装备'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 } },
  series: [
    { name: '国内供给', type: 'bar', stack: 's', data: [45, 72, 88, 38, 35, 62], barWidth: 14, itemStyle: { color: '#10b981', borderRadius: [3, 0, 0, 3] } },
    { name: '进口依存', type: 'bar', stack: 's', data: [55, 28, 12, 62, 65, 38], barWidth: 14, itemStyle: { color: '#e8a317', borderRadius: [0, 3, 3, 0] } },
  ],
};
// 卡脖子环节风险强度（示意 · 100 = 完全受制于外部）
const chokeBar = {
  grid: { left: 90, right: 40, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['成熟制程产能', '特种材料', '工业软件', 'EDA 全流程', 'EUV 光刻机'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 } },
  series: [{ type: 'bar', data: [
    { value: 45, itemStyle: { color: '#10b981' } },
    { value: 70, itemStyle: { color: '#e8a317' } },
    { value: 75, itemStyle: { color: '#e8a317' } },
    { value: 82, itemStyle: { color: '#e8a317' } },
    { value: 95, itemStyle: { color: '#c41e3a' } },
  ], barWidth: 14, itemStyle: { borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 } }],
};
// 韧性建设节奏：储备/备份能力随时间爬坡（示意）
const resilienceLine = {
  grid: { left: 44, right: 16, top: 28, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025(E)'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '国产替代指数', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [38, 44, 52, 58, 64, 70], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    { name: '多元采购覆盖', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [30, 38, 50, 60, 68, 74], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

const chokeList = [
  ['EUV 光刻机', '极高', '#c41e3a'],
  ['EDA 全流程', '高', '#e8a317'],
  ['成熟制程产能', '中等', '#10b981'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Supply Chain · 产业链人质效应" title="产业链备份 · 库存韧性" subtitle="友岸外包应对 · 链长制 · 备份系统 —— 国产份额 · 对外依存 · 替代弹性" />
      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          关键领域的<span style={{ color: 'var(--china-red)', fontWeight: 600 }}>国产替代与通道多元化</span>正在重塑供应链版图：高端制程、工业软件与特种材料仍存在「卡脖子」清单；体制以举国体制 + 市场订单双轮驱动替代节奏，成本是时间与资本开支的函数。
        </p>
      </Card>
      <Grid cols={4} className="mb-6">
        <Stat value="6+" label="部委联席领域（示意）" accent="#22d3ee" />
        <Stat value="88%" label="稀土冶炼份额（示意）" accent="#e8a317" />
        <Stat value="45%" label="芯片自给率目标区间" accent="#c41e3a" />
        <Stat value="2,500+" label="专精特新「小巨人」" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="国内供给 vs 进口依存（示意 %）"><EChart option={supplyRiskBar} style={{ height: 260 }} /></Card>
        <Card title="典型卡脖子环节 · 风险强度（示意）"><EChart option={chokeBar} style={{ height: 260 }} /></Card>
      </Grid>

      <Card title="三类应对逻辑" className="mb-6">
        <Grid cols={3}>
          {[['库存与冗余', '#e8a317', '战略储备 + 安全库存拉长周转天数，换取极端情景下的可启动性。'],
            ['友岸外包', '#22d3ee', '在合规框架下分散采购国别，降低单一司法辖区的断供概率。'],
            ['国产替代', '#10b981', '成熟制程与材料端先行，先进制程依赖研发摊销与生态迁移。']].map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="典型卡脖子环节 · 定性分级">
          <div className="space-y-2">
            {chokeList.map(([name, level, c]) => (
              <div key={name} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(148,163,184,0.06)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</span>
                <span className="text-xs font-bold mono px-2 py-0.5 rounded" style={{ color: c, background: `${c}1a` }}>{level}</span>
              </div>
            ))}
            <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>先进制程设备与 EDA 工具链受出口管制约束最深；成熟制程产能已具备规模优势，竞争焦点转向良率与成本。</p>
          </div>
        </Card>
        <Card title="韧性建设节奏（指数 · 示意）"><EChart option={resilienceLine} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="链长制与备份系统 · 制度逻辑" className="mb-6">
        <Grid cols={3}>
          {[['1 · 链长制挂帅', '由地方与部委「链长」对重点产业链逐链建档，识别断点、卡点并匹配订单与资本，形成行政协调 + 市场验证的双轨推进。'],
            ['2 · 备份不等于替代', '备份系统追求「极端情景可启动」，允许成本与性能折让；替代追求商业闭环，两者节奏与考核标准不同。'],
            ['3 · 双供应商成为默认', '企业端表现为双供应商、近岸仓储与长单锁价，效率最优让位于可控性与冗余的「韧性税」。']].map(([t, d]) => (
            <div key={t}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="研判">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          供应链安全已从「效率最优」让位于「可控性与冗余」；企业端表现为双供应商、近岸仓储与长单锁价。宏观上与大基金二期、设备首台套政策形成共振——库存韧性与友岸外包是过渡形态，终局取决于国产替代的良率曲线能否在管制窗口期内爬坡。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>图示为结构推演示意，具体比例随年度与口径变化，请与半导体、能源专题交叉验证 · 由 china.html「供应链」专题迁移</p>
    </div>
  );
}
