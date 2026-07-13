import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { AS_OF, DASHBOARD_CHARTS, CONTRADICTIONS, getContradiction } from './data.js';

// ============================================================================
// 认知内核 · 矛盾论（社会矛盾体透视）
// ----------------------------------------------------------------------------
// 主要矛盾与次要矛盾的分析框架；各矛盾体含激化条件、缓和机制与政策杠杆。
// 数据 asOf 2026-06-11，公开资料示意，非官方统计。
// ============================================================================

function ThesisCard({ body, accent }) {
  return (
    <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${accent}` }}>
      <div className="text-[10px] mono uppercase mb-2" style={{ color: accent }}>核心论点</div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
    </div>
  );
}

function ContradictionPair({ primary, secondary }) {
  return (
    <Grid cols={2} className="mb-4">
      <div className="os-card p-4" style={{ borderLeft: '3px solid var(--china-red)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--china-red)' }}>主要矛盾</div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{primary}</p>
      </div>
      <div className="os-card p-4" style={{ borderLeft: '3px solid var(--text-tertiary)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>次要矛盾</div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{secondary}</p>
      </div>
    </Grid>
  );
}

function MechanismGrid({ escalation, mitigation, levers }) {
  const blocks = [
    { title: '激化条件', items: escalation, accent: '#c41e3a' },
    { title: '缓和机制', items: mitigation, accent: '#10b981' },
    { title: '政策杠杆', items: levers, accent: '#22d3ee' },
  ];
  return (
    <Grid cols={3} className="mb-4">
      {blocks.map(({ title, items, accent }) => (
        <div key={title} className="os-card p-4" style={{ background: 'var(--bg-surface)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: accent }}>{title}</div>
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item} className="text-[11px] leading-relaxed flex gap-2" style={{ color: 'var(--text-tertiary)' }}>
                <span style={{ color: accent }}>·</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Grid>
  );
}

export default function Page() {
  const [active, setActive] = useState('gender');
  const c = getContradiction(active);

  return (
    <div>
      <PageHeader
        badge="Cognition · 矛盾论"
        title="矛盾论 · 社会矛盾体透视"
        subtitle="主要矛盾与次要矛盾 —— 性别 / 央地 / 城乡 / 阶层 / 区域 / 代际 / 贫富 / 劳资 / 官民 / 民族地区"
      />

      <IntroCard>
        社会运行并非单一叙事，而是多组<strong style={{ color: 'var(--text-primary)' }}>矛盾体</strong>在资源稀缺、制度约束与物理边界下的叠加博弈。
        本模块以矛盾论为分析透镜：识别各领域的<strong style={{ color: 'var(--text-primary)' }}>主要矛盾与次要矛盾</strong>，推演激化条件与缓和机制，对接政策杠杆与制度演进路径。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，均为公开资料示意，非官方统计。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={CONTRADICTIONS.length} label="矛盾体研究单元" accent="#c41e3a" />
        <Stat value="7+3" label="核心 + 延伸矛盾体" accent="#22d3ee" />
        <Stat value="2—4" label="每视图 ECharts 数" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Card title="全局仪表盘 · 四组结构性指标（示意）" className="mb-6">
        <Grid cols={2}>
          {Object.values(DASHBOARD_CHARTS).map((ch) => (
            <div key={ch.title}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{ch.title}</div>
              <EChart option={ch.build()} style={{ height: 220 }} />
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          城乡收入比、区域梯度、抚养比与基尼系数构成社会矛盾体的「背景场」——多组矛盾在同一宏观坐标下共振或对冲。
        </p>
      </Card>

      <Card title="交互 · 矛盾体选择器" className="mb-4">
        <SelectorBar
          items={CONTRADICTIONS.map((x) => ({ key: x.key, label: x.label, accent: x.accent }))}
          activeKey={active}
          onSelect={setActive}
        />
      </Card>

      <ThesisCard body={c.thesis} accent={c.accent} />
      <ContradictionPair primary={c.primary} secondary={c.secondary} />
      <MechanismGrid escalation={c.escalation} mitigation={c.mitigation} levers={c.levers} />

      <Card title={`${c.label} · 分析维度`} className="mb-4">
        <Grid cols={2}>
          {c.dimensions.map(([title, desc]) => (
            <div key={title} style={{ borderLeft: `2px solid ${c.accent}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title={`${c.label} · 数据透视（示意）`} className="mb-6">
        <Grid cols={c.charts.length >= 3 ? 3 : c.charts.length}>
          {c.charts.map((ch) => (
            <div key={ch.title}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{ch.title}</div>
              <EChart option={ch.build()} style={{ height: 240 }} />
            </div>
          ))}
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '资源分配', body: c.framework.salt.body, pillars: c.framework.salt.pillars },
        { key: 'stone', title: '摸石头方法论', subtitle: '试点博弈', body: c.framework.stone.body, pillars: c.framework.stone.pillars },
        { key: 'path', title: '升级路径', subtitle: '制度演进', body: c.framework.path.body, pillars: c.framework.path.pillars },
      ]} />

      <Card title="作为思想工具 · 矛盾论的用法与边界">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          矛盾论不是立场站队，而是一副<strong style={{ color: 'var(--text-primary)' }}>「结构透镜」</strong>：
          在任一社会领域，先问「当前主要矛盾是什么」「次要矛盾如何牵制」「什么条件下会激化或缓和」——
          再对接<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>治理现代化 / 区域协调 / 乡村振兴 / 人口结构 / 改革开放</span>等专题的实证数据。
          主要矛盾随发展阶段转移：城镇化中期城乡矛盾突出，增速换挡后阶层与贫富矛盾上升，老龄化加深则代际矛盾前置。
        </p>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          边界：矛盾体之间存在交叉（央地矛盾与区域矛盾、城乡与阶层），本模块按分析便利切分，非互斥分类；
          图表均为公开资料整理的示意数据，不可直接用于决策或投资判断。
        </p>
      </Card>

      <ModuleFooter
        moduleId="contradictions"
        sourceNote={`数据截至 ${AS_OF}`}
        disclaimer="公开资料整理，示意非官方 · 矛盾体切分为分析便利，图表仅供框架参考"
      />
    </div>
  );
}
