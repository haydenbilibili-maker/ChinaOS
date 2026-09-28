import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';
import { IntroCard, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { SCHOLARS, SCHOLAR_TABS, VERIFY_META, STANCE_ISSUES } from './schema.js';
import { STANCES_BY_SCHOLAR } from './stancesIndex.js';
import {
  Prose, SourceLine, TypeBadge, VerifyBadge, subtle, textStyle,
} from './ScholarKit.jsx';

// ============================================================================
// 中国学者专栏 · 总览 · IA 见 docs/scholars/README.md
// 名册卡片 + 思想光谱（议题 × 学者对照矩阵）。矩阵每格取自该学者 stances.js，
// 须有场合 + 日期 + 出处；无可核验表态则留空，不推测。
// ============================================================================

const LIVE = SCHOLARS.filter((s) => s.status === 'live');

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
      {live && s.corpus && <div className="text-[11px] mono mt-3" style={{ color: 'var(--cyber-cyan)' }}>{s.corpus} →</div>}
    </div>
  );
  return live
    ? <Link to={s.route} className="block h-full no-underline" aria-label={`进入${s.name}观点看板`}>{body}</Link>
    : <div aria-label="待建学者席位">{body}</div>;
}

function CoverageMatrix({ activeIssue, onSelect }) {
  return (
    <div className="os-table-scroll">
      <table className="w-full text-xs" style={{ borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
        <caption className="sr-only">议题 × 学者 表态覆盖矩阵</caption>
        <thead>
          <tr style={{ ...subtle, textAlign: 'center' }}>
            <th scope="col" className="py-2 pr-3 font-normal text-left">议题</th>
            {LIVE.map((s) => (
              <th key={s.id} scope="col" className="py-2 px-1.5 font-normal whitespace-nowrap">
                <Link to={s.route} style={{ color: s.accent }}>{s.name}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STANCE_ISSUES.map((issue) => {
            const active = issue.id === activeIssue;
            return (
              <tr
                key={issue.id}
                style={{
                  borderTop: '1px solid var(--border-subtle, rgba(148,163,184,0.1))',
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                <th scope="row" className="py-2 pr-3 font-normal text-left whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelect(issue.id)}
                    className="bg-transparent border-0 p-0 cursor-pointer text-xs"
                    style={{ color: active ? 'var(--fire-gold)' : 'var(--text-primary)' }}
                    aria-pressed={active}
                  >
                    {issue.label}
                  </button>
                </th>
                {LIVE.map((s) => {
                  const st = STANCES_BY_SCHOLAR[s.id]?.[issue.id];
                  return (
                    <td key={s.id} className="py-2 px-1.5 text-center" title={st ? `${s.name}：${st.stance}` : `${s.name}：未见可核验表态`}>
                      {st
                        ? <span style={{ color: st.type === '原话' ? 'var(--fire-gold)' : 'var(--cyber-cyan)' }}>{st.type === '原话' ? '●' : '○'}</span>
                        : <span style={subtle}>·</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StanceCard({ s, st }) {
  return (
    <article className="os-card p-4 h-full" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Link to={s.route} className="text-sm font-semibold no-underline" style={{ color: 'var(--text-primary)' }}>{s.name}</Link>
        <span className="text-[10px]" style={subtle}>{s.archetype}</span>
        <TypeBadge type={st.type} />
        <VerifyBadge level={st.verified} />
      </div>
      <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--text-primary)' }}>{st.stance}</p>
      {st.type === '原话' && st.quote && (
        <blockquote className="m-0 mt-2 text-[12px] leading-relaxed pl-2" style={{ ...textStyle, borderLeft: '2px solid var(--fire-gold)' }}>
          「{st.quote}」
        </blockquote>
      )}
      <SourceLine item={st} />
    </article>
  );
}

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const issueParam = searchParams.get('issue');
  const issue = STANCE_ISSUES.some((i) => i.id === issueParam) ? issueParam : STANCE_ISSUES[0].id;
  const issueMeta = STANCE_ISSUES.find((i) => i.id === issue);
  const setIssue = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('issue', id);
    setSearchParams(next, { replace: true });
  };

  const withStance = LIVE.filter((s) => STANCES_BY_SCHOLAR[s.id]?.[issue]);
  const without = LIVE.filter((s) => !STANCES_BY_SCHOLAR[s.id]?.[issue]);
  const cellCount = LIVE.reduce((n, s) => n + Object.keys(STANCES_BY_SCHOLAR[s.id] ?? {}).length, 0);

  return (
    <div>
      <PageHeader
        badge="学者专栏"
        title="中国学者专栏"
        subtitle={`${LIVE.length} 位学者 · 思想光谱 · 可追溯出处 · 预判检验台账`}
      />

      <IntroCard>
        专栏以「一人一看板」整理中国经济学、社会学与国际关系学者（及学者型官员）的公开著作、讲话与署名文章，
        对齐本站经济大盘、住房地产、地方债务、人口结构等模块的数据，检验其判断与现实的吻合度。
        人选覆盖宏观金融、发展与制度经济学、人口民生、三农与基层治理、政治经济学、国际关系与社会学，并刻意纳入彼此存在公开分歧的组合，
        以形成可对照的思想光谱。每条内容标注场合、日期与媒体/著作，区分原话与转述；网络流传的托名言论未经核实不收录。
      </IntroCard>

      <Card title="学者名册">
        <Grid cols={{ default: 1, md: 2, xl: 3 }}>
          {SCHOLARS.map((s) => <ScholarCard key={s.id} s={s} />)}
        </Grid>
        <p className="text-[11px] mt-4 leading-relaxed" style={subtle}>
          名册顺序为上线次序，不代表评价或排序；人选理由与取舍见专栏文档 roster.md。
        </p>
      </Card>

      <Card title="思想光谱 · 议题 × 学者对照矩阵" className="mb-6">
        <Prose className="mb-4">
          七个关键议题上各学者的公开立场。<span style={{ color: 'var(--fire-gold)' }}>●</span> 有逐字原话，
          <span style={{ color: 'var(--cyber-cyan)' }}>○</span> 为本站转述，· 为未见可核验表态（留空，不推测）。
          当前共 {cellCount} 格有出处。点击议题查看每位学者的立场摘要与出处。
        </Prose>
        <CoverageMatrix activeIssue={issue} onSelect={setIssue} />
      </Card>

      <SelectorBar
        items={STANCE_ISSUES.map((i) => ({ key: i.id, label: i.label, accent: 'var(--fire-gold)' }))}
        activeKey={issue}
        onSelect={setIssue}
      />
      <Card title={`${issueMeta.label} · ${withStance.length} 位学者有可核验表态`} className="mb-8">
        <Prose className="mb-4">议题范围：{issueMeta.hint}。立场摘要为本站概括，原话以引号与出处为准；不同学者的表态时间不同，比较时请留意语境。</Prose>
        <Grid cols={{ default: 1, md: 2 }}>
          {withStance.map((s) => <StanceCard key={s.id} s={s} st={STANCES_BY_SCHOLAR[s.id][issue]} />)}
        </Grid>
        {without.length > 0 && (
          <p className="text-[11px] mt-4 leading-relaxed" style={subtle}>
            未见可核验表态（留空）：{without.map((s) => s.name).join('、')}。
          </p>
        )}
      </Card>

      <Grid cols={{ default: 1, lg: 2 }} className="mb-8">
        <Card title="看板统一结构" asSection={false}>
          <ol className="m-0 pl-5 space-y-1.5 text-[13px]" style={textStyle}>
            {SCHOLAR_TABS.map((t) => <li key={t.id}>{t.label}</li>)}
          </ol>
          <Prose className="mt-3">
            每位学者按同一数据契约提供履历、著作、文库、观点、台账、争议与光谱条目，复用同一套展示件与图表；数据随路由按需加载。
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
