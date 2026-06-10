import React from 'react';
import { PageHeader, Card, Grid, Placeholder } from '../../app/ui.jsx';

const TALENT = [
  { region: '东北区域', status: '已讨论', note: '治理人才组合样板（其他对话中已成型）' },
  { region: '省级单位 + 省会', status: '规划', note: '由东北样板拓展到全部省级与省会' },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Simulation & Training"
        title="治国沙盒 · 技能训练"
        subtitle="区域治理人才配置 · 熵增监控 · 风险与情景推演 —— 把内容透镜的判断转化为可操练的决策"
      />
      <Card title="区域治理人才配置" className="mb-6">
        <div className="space-y-3">
          {TALENT.map((t) => (
            <div key={t.region} className="flex items-center gap-3 text-sm">
              <span className="mono text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: t.status === '已讨论' ? 'var(--cyber-cyan)' : 'var(--text-tertiary)' }}>{t.status}</span>
              <span style={{ color: 'var(--text-primary)' }}>{t.region}</span>
              <span style={{ color: 'var(--text-tertiary)' }}>— {t.note}</span>
            </div>
          ))}
        </div>
      </Card>
      <Grid cols={3}>
        <Placeholder note="熵增监控（治理碎片化指标）" />
        <Placeholder note="风险模拟（压力传导）" />
        <Placeholder note="情景推演（多参数沙盘）" />
      </Grid>
    </div>
  );
}
