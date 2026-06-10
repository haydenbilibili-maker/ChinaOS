import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const dividendTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '指数', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [60, 72, 84, 95], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};
const ipBar = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '万元/件', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [50, 110, 220, 400], barWidth: 28, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Rule of Law · 制度红利" title="法治建设与司法现代化" subtitle="营商环境法治化 · 知识产权护城河 · 智慧法院 · 涉外法治博弈 —— 制度红利替代要素红利" />
      <Grid cols={4} className="mb-6">
        <Stat value="99.5%" label="一审结案率" accent="#10b981" />
        <Stat value="1.4 亿+" label="文书公开份数" accent="#22d3ee" />
        <Stat value="UP TO 5X" label="惩罚性赔偿" accent="#c41e3a" />
        <Stat value="100%" label="智慧法院 4.0 覆盖" accent="#e8a317" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="营商环境 · 法治作为第一确定性">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>通过《民法典》及外商投资法，建立对标国际的营商环境算法。现实主义逻辑：<strong style={{ color: 'var(--text-primary)' }}>制度红利正在替代要素红利</strong>——破除地方保护主义、建立全国统一负面清单，把「权力意志」约束在「法治轨道」内。</p>
          <div className="space-y-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <div>✓ 建立市场准入效能评估体系</div>
            <div>✓ 完善企业破产重整司法制度</div>
            <div>✓ 强化民营企业产权司法保护</div>
          </div>
          <div className="mt-3"><EChart option={dividendTrend} style={{ height: 160 }} /></div>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>制度红利转化效率估算（示意）。</p>
        </Card>
        <Card title="知识产权护城河 · 赔偿额度指数级上涨">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>专利诉讼赔偿额度正指数级上涨——不仅保护创新，更是在「新质生产力」竞赛中构建自主的技术防御疆域。</p>
          <EChart option={ipBar} style={{ height: 200 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>知产案件平均判赔额（万元/件 · 示意）。</p>
        </Card>
      </Grid>

      <Card title="智慧法院 · 算法正义" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>司法现代化包含<strong style={{ color: 'var(--text-primary)' }}>区块链电子存证、AI 辅助量刑参考、裁判文书自动生成</strong>。数字化极大降低司法裁量的随意性（Arbitrary Power），实现海量案件的高效率、标准化处理；当正义可被计算与回溯，司法公信力获得技术背书。</p>
        <Grid cols={2}>
          <Stat value="秒级" label="司法区块链存证时延" accent="#22d3ee" />
          <Stat value="90%+" label="线上诉讼业务覆盖率" accent="#10b981" />
        </Grid>
      </Card>

      <Card title="涉外法治博弈 · 竞争的新边疆" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>通过设立国际商事法庭（CICC）、完善反制裁法律工具包，中国正从全球规则的接受者转变为「博弈者」。现实主义视角下，法治已成为非对称竞争中的合法性屏障，维护中国企业在全球价值链中的合法主权利益。</p>
        <div className="flex flex-wrap gap-2">{['国际商事法庭 CICC', '反制裁法律工具', '数字主权规则', '全球商事仲裁'].map((k) => (<span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{k}</span>))}</div>
      </Card>

      <Card title="结语 · 制度红利基础设施">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>法治不仅是公平叙事，更是降低交易成本、稳定长期预期的「确定性基础设施」。其建设进度，直接决定要素市场化与民营信心修复的深度。</p>
        <div className="flex flex-wrap gap-3 mt-3 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// JUSTICE: TRANSPARENT</span><span>// SYSTEM: REFORMED</span><span>// STATUS: SECURE</span>
        </div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：最高人民法院工作报告等，部分为示意值 · 由 china.html「法治政府」专题迁移</p>
    </div>
  );
}
