import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';
import { IntroCard, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { SCHOLARS, SCHOLAR_TABS, VERIFY_META } from './schema.js';
import { Prose, subtle, textStyle } from './ScholarKit.jsx';

// ============================================================================
// 中国学者专栏 · 总览 · IA 见 docs/scholars/README.md
// 名册卡片：live 可进入看板；planned 仅占位「待建」，不写任何观点内容
// ============================================================================

function ScholarCard({ s }) {
  const live = s.status === 'live';
  const body = (
    <div
      className={`os-card ${live ? 'os-card-lift' : ''} p-5 h-full flex flex-col`}
      style={{ borderTop: `2px solid ${s.accent}`, opacity: live ? 1 : 0.6 }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h2 className="text-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>{s.name}</h2>
        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ color: live ? 'var(--fire-gold)' : 'var(--text-tertiary)', border: '1px solid currentColor' }}>
          {live ? '已上线' : '待建'}
        </span>
      </div>
      <div className="text-xs mb-2" style={subtle}>{s.archetype}</div>
      {live && <p className="text-[13px] leading-relaxed m-0 mb-3" style={textStyle}>{s.roles}</p>}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {s.fields.map((f) => (
          <span key={f} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>{f}</span>
        ))}
      </div>
      {live && <div className="text-[11px] mono mt-3" style={{ color: 'var(--cyber-cyan)' }}>{s.corpus} →</div>}
    </div>
  );
  return live
    ? <Link to={s.route} className="block h-full no-underline" aria-label={`进入${s.name}观点看板`}>{body}</Link>
    : <div aria-label="待建学者席位">{body}</div>;
}

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="学者专栏"
        title="中国学者专栏"
        subtitle="以可追溯出处为底线 · 观点看板 · 预判检验台账"
      />

      <IntroCard>
        专栏以「一人一看板」的形式整理中国经济学者与学者型官员的公开著作、讲话与署名文章，
        对齐本站经济大盘、住房地产、地方债务等模块的数据，检验其判断与现实的吻合度。
        每条内容标注场合、日期与媒体/著作，区分原话与转述；网络流传的托名演讲未经核实不收录。
      </IntroCard>

      <Card title="学者名册">
        <Grid cols={{ default: 1, md: 2, xl: 3 }}>
          {SCHOLARS.map((s) => <ScholarCard key={s.id} s={s} />)}
        </Grid>
        <p className="text-[11px] mt-4 leading-relaxed" style={subtle}>
          「待建」席位为选题池方向，尚未确定人选，不代表评价或排序；每位学者在母本资料与核验完成前不会上线。
        </p>
      </Card>

      <Grid cols={{ default: 1, lg: 2 }} className="mb-8">
        <Card title="看板统一结构" asSection={false}>
          <ol className="m-0 pl-5 space-y-1.5 text-[13px]" style={textStyle}>
            {SCHOLAR_TABS.map((t) => <li key={t.id}>{t.label}</li>)}
          </ol>
          <Prose className="mt-3">
            新学者只需按 schema.js 的数据契约提供著作、文库、观点、台账、争议五类数据，即可复用同一套展示件与图表。
          </Prose>
        </Card>
        <Card title="核验分级" asSection={false}>
          <ul className="m-0 p-0 list-none space-y-2">
            {Object.entries(VERIFY_META).map(([k, m]) => (
              <li key={k} className="flex items-start gap-2 text-[13px]" style={textStyle}>
                <span className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0" style={{ color: m.color, border: `1px solid ${m.color}` }}>{m.label}</span>
                {m.note}
              </li>
            ))}
            <li className="text-[13px]" style={textStyle}>原话：出处可见的逐字引文；转述：本站概括，不加引号。</li>
          </ul>
        </Card>
      </Grid>

      <ModuleFooter
        moduleId="scholars"
        sourceNote="各学者著作原书、主办方页面、署名文章与主流媒体报道"
        disclaimer="公开资料整理 · 不构成对人物的评价"
      />
    </div>
  );
}
