import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { timelineMarkAreaOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import {
  AS_OF, MECHANISMS, LAYERS, NODES, EDGE_KIND,
  LAYER_RADAR, EMBED_ROWS, EMBED_COLS, EMBED_MATRIX,
  STAGES, INSPECTION_YEARS, INSPECTION_VALUES,
  buildGraphOption, buildSankeyOption,
} from './data.js';

const RADAR_DIMS = ['人事任免', '财权', '信息', '组织嵌入', '纪律', '赛博反馈'];

// 各层控制画像（多系列雷达）：mechIdx 高亮某一机制轴
function buildRadarOption(mechIdx) {
  return {
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, icon: 'circle' },
    radar: {
      indicator: RADAR_DIMS.map((name, i) => ({ name: i === mechIdx ? `▶ ${name}` : name, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: LAYER_RADAR.map((l) => ({
        value: l.values, name: l.name,
        lineStyle: { color: l.color, width: 2 }, itemStyle: { color: l.color },
        areaStyle: { color: l.color, opacity: 0.06 },
      })),
    }],
  };
}

// 党组织嵌入度热力图
const embedHeatmap = {
  tooltip: { position: 'top', formatter: (p) => `${EMBED_ROWS[p.value[1]]} · ${EMBED_COLS[p.value[0]]}: ${p.value[2]}%` },
  grid: { left: 80, right: 16, top: 8, bottom: 56 },
  xAxis: { type: 'category', data: EMBED_COLS, splitArea: { show: true }, axisLabel: { color: LABEL.color, fontSize: 10, rotate: 18 } },
  yAxis: { type: 'category', data: EMBED_ROWS, splitArea: { show: true }, axisLabel: { color: LABEL.color, fontSize: 10 } },
  visualMap: { min: 0, max: 100, calculable: false, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#0f1623', '#27324a', '#8b5cf6', '#c41e3a'] }, textStyle: { color: LABEL.color, fontSize: 10 } },
  series: [{
    type: 'heatmap',
    data: EMBED_MATRIX.flatMap((row, yi) => row.map((v, xi) => [xi, yi, v])),
    label: { show: true, color: '#e8f4f8', fontSize: 10, formatter: (p) => `${p.value[2]}` },
    emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.4)' } },
  }],
};

export default function Page() {
  const [mechKey, setMechKey] = useState('renshi');
  const [selectedId, setSelectedId] = useState('core');
  const [stageIdx, setStageIdx] = useState(3);

  const mech = MECHANISMS.find((m) => m.key === mechKey) || MECHANISMS[0];
  const mechIdx = MECHANISMS.findIndex((m) => m.key === mechKey);
  const node = NODES.find((n) => n.id === selectedId) || NODES[0];
  const nodeLayer = LAYERS.find((l) => l.key === node.layer);

  const graphOption = useMemo(() => buildGraphOption(mechKey, selectedId), [mechKey, selectedId]);
  const sankeyOption = useMemo(() => buildSankeyOption(), []);
  const radarOption = useMemo(() => buildRadarOption(mechIdx), [mechIdx]);

  const stageSpan = useMemo(() => {
    const stepsPerStage = INSPECTION_YEARS.length / STAGES.length;
    const a = Math.min(INSPECTION_YEARS.length - 1, Math.round(stageIdx * stepsPerStage));
    const b = Math.min(INSPECTION_YEARS.length - 1, Math.round((stageIdx + 1) * stepsPerStage));
    return [a, b];
  }, [stageIdx]);

  const inspectionOption = useMemo(() => timelineMarkAreaOpt({
    years: INSPECTION_YEARS, values: INSPECTION_VALUES, span: stageSpan,
    highlightColor: '#8b5cf6', lineColor: '#c41e3a',
  }), [stageSpan]);

  const handleReady = (chart) => {
    chart.on('click', (p) => {
      if (p.dataType === 'node' && p.data?.id) setSelectedId(p.data.id);
    });
  };

  const meanLabels = node.means.map((k) => MECHANISMS.find((m) => m.key === k)?.short).filter(Boolean);

  return (
    <div>
      <PageHeader badge="Red Net · 结构分析" title="红色巨网 · 党—国控制网络的结构拓扑"
        subtitle="层级 L0–L6 · 控制机制 × 反馈回路 · 组织嵌入 —— 把权力运作还原为可观察的网络物理" />

      <IntroCard>本模块把「红色巨网」作为一种<strong style={{ color: 'var(--text-primary)' }}>结构现象</strong>建模：从党中央内核到海外离岸窗口，控制经由<strong style={{ color: 'var(--cyber-cyan)' }}>人事、财权、信息（语义防火墙）、组织嵌入、纪律与赛博反馈</strong>六条机制自上而下传导，又经网格与平台的数据回流形成闭环。十八大后以纪律机制回收离心节点、以组织前置嵌入治理，数字化阶段更把静态层级升级为<strong style={{ color: 'var(--text-primary)' }}>赛博反馈回路</strong>。<span style={{ color: 'var(--text-tertiary)' }}> 本页仅作机制层面的结构分析，数值为公开资料示意（OSINT），不构成对具体个人/机构的指认。</span></IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="L0–L6" label="网络层级" accent="#c41e3a" />
        <Stat value={`${NODES.length} 节点`} label="控制节点 · 6 机制" />
        <Stat value={mech.label} label="当前控制维度 · 切换" accent={mech.accent} />
        <Stat value={`AS_OF ${AS_OF}`} label="数据基准（示意）" />
      </Grid>

      <Card title="交互 · 控制维度切换 → 网络高亮 + 节点详情" className="mb-6">
        <SelectorBar items={MECHANISMS} activeKey={mechKey} onSelect={setMechKey} getLabel={(i) => i.label} />
        <div className="os-card p-3 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${mech.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{mech.desc}</p>
        </div>
        <Grid cols={3} gap="1rem">
          <div style={{ gridColumn: 'span 2' }}>
            <EChart option={graphOption} onReady={handleReady} style={{ height: 420 }} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>力导向网络图 · 颜色=层级 · 高亮=使用「{mech.label}」机制的节点/边 · 点击节点查看详情 · 可拖拽/缩放</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${nodeLayer?.accent}` }}>
            <div className="text-xs mono mb-1" style={{ color: nodeLayer?.accent }}>{nodeLayer?.label}</div>
            <div className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{node.name}</div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>职能</div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{node.role}</p>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>控制手段</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {meanLabels.map((l) => (
                <span key={l} className="text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'rgba(196,30,58,0.16)', color: '#e8a317' }}>{l}</span>
              ))}
            </div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>典型机制</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{node.cases}</p>
            <div className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>控制强度示意 · <span className="mono" style={{ color: nodeLayer?.accent }}>{node.value}</span></div>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="控制流 Sankey · 控制/资源/信息 + 反馈回流">
          <EChart option={sankeyOption} style={{ height: 360 }} />
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.values(EDGE_KIND).map((k) => (
              <span key={k.label} className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                <span style={{ width: 10, height: 3, background: k.color, display: 'inline-block', borderRadius: 2 }} />{k.label}
              </span>
            ))}
          </div>
        </Card>
        <Card title="各层控制画像 · 6 机制雷达（高亮当前维度）">
          <EChart option={radarOption} style={{ height: 360 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="党组织嵌入度矩阵 · 主体 × 维度（覆盖率 % · 示意）">
          <EChart option={embedHeatmap} style={{ height: 300 }} />
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>从国企到外企，组织嵌入呈梯度衰减；民企/外企的「党组织覆盖」与「实质决策」之间存在显著落差。</p>
        </Card>
        <Card title="控制网层级 L0–L6 · 结构说明">
          {LAYERS.map((l) => (
            <div key={l.key} className="mb-2.5" style={{ borderLeft: `2px solid ${l.accent}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: l.accent }}>{l.label}</div>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-tertiary)' }}>{l.desc}</p>
            </div>
          ))}
        </Card>
      </Grid>

      <Card title="控制网演进 · 阶段时间线（联动巡视/反腐强度）" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
        <Grid cols={2} className="mt-4">
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${STAGES[stageIdx].accent}` }}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{STAGES[stageIdx].title}</span>
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{STAGES[stageIdx].period}</span>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{STAGES[stageIdx].desc}</p>
            <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>控制网刚性指数（示意）</div>
            <div style={{ height: 6, background: 'var(--bg-base)', borderRadius: 3 }}>
              <div style={{ width: `${STAGES[stageIdx].intensity}%`, height: '100%', background: STAGES[stageIdx].accent, borderRadius: 3, transition: 'width .25s' }} />
            </div>
          </div>
          <div>
            <EChart option={inspectionOption} style={{ height: 220 }} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>巡视/反腐强度指数（示意）· 高亮区间对应所选阶段 —— 纪律机制是网络拓扑刚性的周期性「系统杀毒」。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '组织嵌入 · 网络的骨架', subtitle: '支部建在连上 → 党组前置', accent: '#10b981', border: '#10b981', body: '控制网的第一性原理是组织嵌入：把党组/党委写入国企、高校乃至民企的治理结构，使「把方向、管大局」具备法理与人事抓手。覆盖率从国企的近满覆盖向外企梯度衰减。', pillars: [['双向进入', '党组与董事会交叉任职。'], ['前置研究', '重大事项党组先议。'], ['梯度衰减', '民企/外企实质决策落差。']] },
        { title: '纪律机制 · 系统杀毒', subtitle: '巡视全覆盖 · 回收离心节点', accent: '#8b5cf6', border: '#8b5cf6', body: '当市场化使节点离心、山头主义抬头，纪律机制（纪委—监委—巡视）以周期性反腐回收控制权、重建拓扑刚性。它是网络维持中心化的负反馈调节器，与 anticorruption 模块同源。', pillars: [['巡视利剑', '周期性结构清洗。'], ['派驻监督', '嵌入式纪检全覆盖。'], ['留置改革', '监察覆盖全体公职。']] },
        { title: '赛博反馈 · 从层级到闭环', subtitle: '网格 + 中台 + 语义防火墙', accent: '#22d3ee', border: '#22d3ee', body: '数字化把静态层级升级为动态闭环：基层网格采集信号 → 数据中台聚合 → 内核实时调度，平台与算法成为信息流的可控阀门。控制密度与响应速度达到历史峰值，但也提升了系统的复杂度与脆性。', pillars: [['网格采集', '毛细血管级触达。'], ['语义防火墙', '信息可见性控制。'], ['闭环响应', '信号回流即时调度。']] },
      ]} />

      <Card title="结构约束 · 成本与脆性" className="mb-2">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>控制网的刚性并非无代价：组织嵌入提高了协调一致性，却也抬高了<strong style={{ color: 'var(--text-primary)' }}>信息失真</strong>与<strong style={{ color: 'var(--text-primary)' }}>委托代理</strong>成本——层层加码与逐级衰减并存。纪律机制能回收离心节点，但高频清洗会冷却基层的能动性（避责、躺平）。赛博反馈缩短了内核与基层的距离，却使系统对单点数据失灵更敏感。换言之，<strong style={{ color: 'var(--cyber-cyan)' }}>网络越密、节点越多，维持其同步的能量与监控成本越高</strong>，这是任何中心化控制拓扑的物理上限。</p>
      </Card>

      <ModuleFooter moduleId="redweb"
        disclaimer="本模块为结构层面的政治学/政治经济学分析（OSINT），层级、节点强度与覆盖率均为模型示意，不构成对具体个人/机构的事实指认或决策依据"
        sourceNote="框架迁自 china.html「红网」专题 · 术语对齐中国深度调研系列" />
    </div>
  );
}
