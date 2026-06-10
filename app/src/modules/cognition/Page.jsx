import React from 'react';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const MODELS = [
  { name: '康波周期', en: 'Kondratiev Wave', desc: '50–60 年长波：繁荣→衰退→萧条→回升，用于科技与资本的长周期定位。' },
  { name: '权力物理学', en: 'Power Physics', desc: '把权力运行当作可计算的力场：收支、考核、确定性偏好。' },
  { name: '现实主义', en: 'Realism', desc: '剥离叙事，以成本收益与相对实力计算行为体的必然选择。' },
  { name: '系统去碎片化', en: 'De-fragmentation', desc: '把治理视为对熵增的持续对抗：统一市场、穿透监管。' },
];

// 康波周期示意波形（四个阶段的长波）
const kondratievOption = {
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  xAxis: { type: 'category', data: ['1950', '1965', '1980', '1995', '2010', '2025', '2040'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{
    type: 'line', smooth: true, symbol: 'none',
    data: [0.2, 0.9, 0.1, 0.8, 0.0, 0.6, 0.95],
    lineStyle: { color: '#22d3ee', width: 2 },
    areaStyle: { color: 'rgba(34,211,238,0.08)' },
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Cognition Kernel"
        title="认知内核 · 思想工具与理论模型库"
        subtitle="个人思考 × 成熟理论 —— 贯穿全局的解读透镜，对各模块信息做模型化的长期比较研究"
      />
      <Grid cols={2} className="mb-6">
        {MODELS.map((m) => (
          <Card key={m.name} title={`${m.name} · ${m.en}`}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
          </Card>
        ))}
      </Grid>
      <Card title="康波周期 · 长波示意（科技—资本定位）">
        <EChart option={kondratievOption} style={{ height: 260 }} />
      </Card>
    </div>
  );
}
