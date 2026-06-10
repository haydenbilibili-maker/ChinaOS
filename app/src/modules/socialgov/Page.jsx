import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const depthFunnel = {
  series: [{
    type: 'funnel', left: '10%', top: 16, bottom: 16, width: '80%',
    min: 0, max: 100, minSize: '20%', maxSize: '100%', sort: 'descending', gap: 2,
    label: { show: true, position: 'inside', fontSize: 10, color: '#fff' },
    itemStyle: { borderColor: 'transparent', borderWidth: 0 },
    emphasis: { label: { fontSize: 12 } },
    data: [
      { value: 100, name: '市/州（顶层指挥）', itemStyle: { color: '#c41e3a' } },
      { value: 80, name: '县/区（资源调度）', itemStyle: { color: '#e8a317' } },
      { value: 60, name: '街/镇（阵地前移）', itemStyle: { color: '#22d3ee' } },
      { value: 40, name: '社区（微观网格）', itemStyle: { color: '#10b981' } },
    ],
  }],
};
const conflictLine = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '矛盾就地化解率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [78, 85, 92, 96.8], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }],
};
const cyberRadar = {
  radar: {
    indicator: [{ name: '舆情预判', max: 100 }, { name: '数据穿透力', max: 100 }, { name: '响应速度', max: 100 }, { name: '资源触达度', max: 100 }, { name: '反馈闭环率', max: 100 }],
    axisName: { color: '#93a1b5' },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: '#27324a' } },
    splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [95, 98, 92, 90, 96], name: '当前治理效能', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.15)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Social Governance · 一网统管" title="基层网格 · 综治与数字政务" subtitle="网格化 · 信访 · 矛盾化解 · 一网统管 —— 社会治理与网格化穿透" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>现实主义逻辑下，社会治理的难点在于「超大规模」。体制通过将国土划分为数百万个微观「网格」实现权力的物理级下沉：每一个网格员都是系统的「终端传感器」，负责采集人、地、物、事、情的实时数据，消解「山高皇帝远」的传统治理瓶颈；再以数字化反馈完成非代议制的民意校准。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="450 万+" label="网格员总数（全域覆盖率 100%）" accent="#e8a317" />
        <Stat value="96.8%" label="矛盾化解率 · 矛盾不上交，就地解决" accent="#10b981" />
        <Stat value="T + 0" label="风险预警前置时效 · 实时感知与反馈" accent="#22d3ee" />
        <Stat value="98.1%" label="群众安全感 · 世界领先水平" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="网格化：物理空间的数字化切片">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>「一格多元、一员多能」（One Grid, Many Functions）：网格不只承担综治维稳，还叠加民生服务、应急动员与数字政务入口，权力穿透到社区微观单元。</p>
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>治理层级穿透深度评估</div>
          <EChart option={depthFunnel} style={{ height: 220 }} />
        </Card>
        <Card title="矛盾化解算法 · 新时代「枫桥经验」">
          <EChart option={conflictLine} style={{ height: 200 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分析：新时代「枫桥经验」的本质是建立一套低摩擦的压力释放机制 —— 通过基层自治与法治结合，把信访与纠纷在源头消化，将风险坍缩在萌芽状态。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="赛博治理系统的风险校准雷达"><EChart option={cyberRadar} style={{ height: 280 }} /></Card>
        <Card title="赛博反馈：非代议制的民意校准">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>数字化治理实现了对社会不满的「量化监测」。当特定区域的投诉、矛盾或舆情超过预设阈值，系统自动启动「预防性维护」程序，释放治理红利或实施行政干预。这种基于大数据反馈的决策模型，正尝试取代效率较低的传统代议机制，构建一套极速响应的「智能合意系统」。</p>
          <Grid cols={2}>
            <Stat value="92%" label="民生诉求办结满意率" accent="#e8a317" />
            <Stat value="秒级" label="网格化指令流转时耗" accent="#22d3ee" />
          </Grid>
        </Card>
      </Grid>

      <Card title="四大支柱 · 治理穿透的运行结构" className="mb-6">
        <Grid cols={4}>
          {[['01 · 网格化穿透逻辑', '数百万微观网格 + 450 万网格员，把「人地物事情」采集为实时数据流，权力下沉至物理级。', '#c41e3a'],
            ['02 · 矛盾化解算法', '枫桥经验数字化：调解、信访、诉源治理逐级过滤，96.8% 矛盾就地化解、不上交。', '#e8a317'],
            ['03 · 赛博反馈校准', '投诉/舆情阈值触发预防性维护，以量化监测替代代议反馈，秒级指令流转闭环。', '#22d3ee'],
            ['04 · 基层韧性底座', '全域安全感知网络、社区积分制自治与数字化信用体系，构建高内聚、自修复的社会有机体。', '#10b981']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="数字政务 · 从「一网通办」到「一网统管」" className="mb-6">
        <Grid cols={3}>
          {[['一网通办（服务侧）', '政务服务事项线上集成办理，网格员兼任「数字政务代办员」，将服务入口前移至社区网格。', '#22d3ee'],
            ['一网统管（治理侧）', '城市运行体征指标接入城市大脑，跨部门指令经网格化平台秒级派单、闭环考核。', '#c41e3a'],
            ['信访法治化', '信访纳入诉源治理与矛盾排查闭环：依法分类处理、就地化解，减少越级上行的制度压力。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="韧性底座：消灭「意外」的系统设计" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国社会治理的终极目标是实现「极致的确定性」。通过全域安全感知网络、社区积分制自治及数字化信用体系，体制正构建起一套高内聚、自修复的社会有机体；在面临外部冲击时，这一底座能提供极高的动员效率与生存冗余。</p>
        <div className="flex flex-wrap gap-2">
          {['Predictive Policing', 'Social Credit Alignment', 'Emergency Response Grid'].map((tag) => (
            <span key={tag} className="text-[10px] mono px-2 py-1 rounded" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>{tag}</span>
          ))}
        </div>
      </Card>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>网格化把治理成本摊薄到「人」这一最小单元，换来的是对超大规模社会的实时感知与快速响应；但「一网统管」的效能边界，最终取决于反馈数据能否真实上传、矛盾能否真正化解而非仅仅「不上交」。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「基层网格综治」专题迁移</p>
    </div>
  );
}
