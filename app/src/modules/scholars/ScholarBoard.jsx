import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { SCHOLAR_TABS, VERIFY_META, LEDGER_META } from './schema.js';
import {
  Prose, QuoteCard, ClaimList, LedgerBoard, DataTable, VerifyBadge, subtle, textStyle,
} from './ScholarKit.jsx';
import {
  themeHeatmapOption, careerGanttOption, bookTimelineOption, numericDeviationOption, frameworkGraphOption,
} from './scholarCharts.js';

// ============================================================================
// 学者专栏 · 通用五 Tab 看板（IA 见 docs/scholars/README.md）
// 总览（人物 + 框架 + 热力）→ 分领域观点 → 预判检验台账 → 著作与讲话文库 → 争议与出处
// 每位学者的 Page.jsx 仅传入自己的 data.js 命名空间，数据随路由懒加载
// ============================================================================

const yearOf = (d) => String(d).slice(0, 4);

export default function ScholarBoard({ data: D }) {
  const {
    AS_OF, THEMES, THEME_KEYS, PROFILE, BOOKS, CORPUS, CLAIMS, QUOTES, THEME_INTRO, THEME_LINKS = {},
    LEDGER, NUMERIC_CHECKS = [], CONTROVERSIES, DOUBTFUL, COUNTS, CAREER_GROUPS, FEATURED = [], BOARD,
  } = D;

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = SCHOLAR_TABS.some((t) => t.id === tabParam) ? tabParam : 'overview';
  const themeParam = searchParams.get('theme');
  const theme = THEME_KEYS.includes(themeParam) ? themeParam : (BOARD.defaultTheme ?? THEME_KEYS[0]);
  const [libTheme, setLibTheme] = useState('all');

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const heatOpt = useMemo(() => themeHeatmapOption(D), [D]);
  const ganttOpt = useMemo(() => careerGanttOption(D), [D]);
  const bookOpt = useMemo(() => bookTimelineOption(D), [D]);
  const devOpt = useMemo(() => (NUMERIC_CHECKS.length ? numericDeviationOption(D) : null), [D, NUMERIC_CHECKS.length]);
  const graphOpt = useMemo(() => frameworkGraphOption(D), [D]);

  const ledgerCount = (s) => LEDGER.filter((l) => l.status === s).length;
  const featured = FEATURED.map((id) => QUOTES.find((q) => q.id === id)).filter(Boolean);
  const themeClaims = CLAIMS.filter((c) => c.theme === theme);
  const libCorpus = libTheme === 'all' ? CORPUS : CORPUS.filter((k) => k.themes.includes(libTheme));
  const themeItems = THEME_KEYS.map((k) => ({ key: k, label: THEMES[k].label, accent: THEMES[k].color }));
  const corpusYears = CORPUS.map((k) => yearOf(k.date)).sort();
  const doubtBooks = BOOKS.filter((b) => b.verified === 'doubt').length;
  const themeLinks = THEME_LINKS[theme] ?? [];

  return (
    <div>
      <PageHeader
        badge={`学者专栏 · ${String(BOARD.order).padStart(2, '0')}`}
        title={`${PROFILE.name} · 观点看板`}
        subtitle={BOARD.subtitle}
      >
        <span className="mono text-xs" style={subtle}>asOf {AS_OF} · <Link to="/scholars" style={{ color: 'var(--cyber-cyan)' }}>返回专栏</Link></span>
      </PageHeader>

      <IntroCard>
        {PROFILE.summary}本看板把其 {BOARD.span} 年的著作、讲话与文章按 {THEME_KEYS.length} 个领域整理，
        区分<strong style={{ color: 'var(--fire-gold)' }}>原话</strong>（出处可见的逐字引文）与
        <strong style={{ color: 'var(--text-primary)' }}>转述</strong>（本站概括，不加引号），并把可被数据检验的前瞻性表述放入
        「已兑现 / 已失败 / 未决」三列台账。网传托名言论未见可靠出处者一律不收录。
      </IntroCard>

      <TabBar tabs={SCHOLAR_TABS} value={tab} onChange={(id) => setParam('tab', id)} />

      {tab === 'overview' && (
        <>
          <StatGrid className="mb-6">
            <Stat value={COUNTS.quote} label="原话条目" sub="逐字 · 附场合日期" accent="var(--fire-gold)" />
            <Stat value={COUNTS.paraphrase} label="转述条目" sub="概括 · 不加引号" />
            <Stat value={COUNTS.corpus} label="讲话/文章" sub={`${corpusYears[0]}—${corpusYears[corpusYears.length - 1]} 文库`} accent="var(--cyber-cyan)" />
            <Stat value={COUNTS.books} label="著作" sub={doubtBooks ? `另 ${doubtBooks} 部〔存疑〕` : '书名 / 出版社 / 年份已核'} accent="var(--cyber-cyan)" />
            <Stat value={`${ledgerCount('done')} / ${ledgerCount('failed')} / ${ledgerCount('open')}`} label="台账 兑现/失败/未决" sub="可检验预判" accent="var(--china-red)" />
          </StatGrid>

          <Grid cols={{ default: 1, lg: 2 }} className="mb-8">
            <Card title="人物速写" asSection={false}>
              <Prose className="mb-3">出生：{PROFILE.born}</Prose>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>现任 / 近年身份</div>
              <ul className="m-0 pl-4 space-y-1 text-[13px]" style={textStyle}>
                {PROFILE.current.map((r) => <li key={r}>{r}</li>)}
              </ul>
              <p className="text-[11px] mt-3 leading-relaxed" style={subtle}>履历来源：{PROFILE.sources}</p>
            </Card>
            <Card title="思想框架图谱 · 可拖拽" asSection={false}>
              <EChart option={graphOpt} style={{ height: 340 }} />
              <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>本站据文库归纳的主张关联，非其本人绘制；连线表示在同一论述中相互支撑。</p>
            </Card>
          </Grid>

          <Card title={BOARD.careerTitle} className="mb-6">
            <EChart option={ganttOpt} style={{ height: Math.max(240, D.CAREER.length * 30 + 60) }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
              {Object.entries(CAREER_GROUPS).map(([k, g]) => (
                <span key={k}><span style={{ color: g.color }}>■</span> {g.label}　</span>
              ))}
              · 半透明条为起止未核〔存疑〕；悬停查看备注。
            </p>
          </Card>

          <Card title="议题热力 · 年份 × 领域" className="mb-6">
            <EChart option={heatOpt} style={{ height: Math.max(260, THEME_KEYS.length * 36 + 72) }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
              计数 = 本站文库讲话/文章与著作的领域标注次数（一篇可跨多个领域），反映收录样本分布，不代表其全部公开发言。
            </p>
          </Card>

          {featured.length > 0 && (
            <Card title="代表性原话 · 附完整出处">
              <Grid cols={{ default: 1, md: 2 }}>
                {featured.map((q) => <QuoteCard key={q.id} item={q} accent={THEMES[q.theme].color} />)}
              </Grid>
            </Card>
          )}
        </>
      )}

      {tab === 'views' && (
        <>
          <SelectorBar items={themeItems} activeKey={theme} onSelect={(k) => setParam('theme', k)} />
          <Card title={`${THEMES[theme].label} · ${themeClaims.length} 条`}>
            <Prose className="mb-4">{THEME_INTRO[theme]}</Prose>
            <ClaimList claims={themeClaims} />
            {themeLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5 text-xs" style={subtle}>
                <span>对照本站数据：</span>
                {themeLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="os-filter-chip mono" style={{ '--chip-accent': THEMES[theme].color }}>{l.label} →</Link>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {tab === 'ledger' && (
        <>
          <IntroCard className="mb-6">
            台账只收录「可被数据或事实检验」的前瞻性表述，对照数据截至 {AS_OF}。检验窗口尚未结束或官方未公布可比数据者一律归入「未决」，
            不做虚假收束；依赖当事人自述口径的「已兑现」条目会在说明中注明。
          </IntroCard>
          <div className="mb-8"><LedgerBoard items={LEDGER} /></div>

          {devOpt && (
            <Card title="数字口径对照 · 公开表述 vs 官方统计" className="mb-6">
              <EChart option={devOpt} style={{ height: Math.max(200, NUMERIC_CHECKS.length * 40 + 60) }} />
              <p className="text-[11px] mt-2 mb-4 leading-relaxed" style={subtle}>
                偏离 =（表述 − 官方）÷ 官方。淡色条为时间窗口不一致、仅作参考；转载稿中的数字可能含记录误差，已在出处中标注。
              </p>
              <DataTable
                caption="数字口径对照表"
                head={['指标', '其表述', '官方数据', '偏离', '出处']}
                rows={NUMERIC_CHECKS.map((n) => ({
                  key: n.id,
                  cells: [
                    n.label,
                    `${n.said} ${n.unit}`,
                    `${n.official} ${n.unit}`,
                    <span key="d" className="mono" style={{ color: n.deviation >= 0 ? 'var(--fire-gold)' : 'var(--cyber-cyan)' }}>{n.deviation > 0 ? '+' : ''}{n.deviation}%{n.comparable ? '' : ' *'}</span>,
                    <span key="s" style={subtle}>表述：{n.saidSrc}；官方：{n.offSrc}</span>,
                  ],
                }))}
              />
            </Card>
          )}
        </>
      )}

      {tab === 'library' && (
        <>
          <Card title="著作时间线" className="mb-6">
            <EChart option={bookOpt} style={{ height: 220 }} />
            <DataTable
              caption="著作清单"
              head={['书名', '出版', '时间', 'ISBN', '核验']}
              rows={BOOKS.map((b) => ({
                key: b.id,
                cells: [
                  `《${b.title}》${b.coauthors ? `（合著：${b.coauthors}）` : ''}`,
                  b.publisher,
                  b.date ?? b.year ?? '—',
                  <span key="i" className="mono">{b.isbn ?? '—'}</span>,
                  <span key="v" className="inline-flex flex-col gap-1"><VerifyBadge level={b.verified} />{b.note ? <span style={subtle}>{b.note}</span> : null}</span>,
                ],
              }))}
            />
          </Card>

          <Card title={`讲话与文章文库 · ${libCorpus.length} 篇`}>
            <SelectorBar
              items={[{ key: 'all', label: '全部', accent: 'var(--cyber-cyan)' }, ...themeItems]}
              activeKey={libTheme}
              onSelect={setLibTheme}
            />
            <DataTable
              caption="讲话与文章文库"
              head={['日期', '场合', '形式', '出处', '核验']}
              rows={[...libCorpus].sort((a, b) => String(b.date).localeCompare(String(a.date))).map((k) => ({
                key: k.id,
                cells: [
                  <span key="d" className="mono">{k.date}</span>,
                  k.url
                    ? <a key="v" href={k.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyber-cyan)' }}>{k.venue}</a>
                    : k.venue,
                  k.form,
                  k.source,
                  <VerifyBadge key="b" level={k.verified} />,
                ],
              }))}
            />
            <p className="text-[11px] mt-3 leading-relaxed" style={subtle}>
              核验分级：{Object.values(VERIFY_META).map((m) => `${m.label}＝${m.note}`).join('；')}。
            </p>
          </Card>
        </>
      )}

      {tab === 'debate' && (
        <>
          {CONTROVERSIES.map((x) => (
            <Card key={x.id} title={x.title} className="mb-6">
              <Grid cols={{ default: 1, md: 2 }} className="mb-3">
                {x.sides.map((s, i) => (
                  <div key={s.who} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${i === 0 ? 'var(--fire-gold)' : 'var(--cyber-cyan)'}` }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: i === 0 ? 'var(--fire-gold)' : 'var(--cyber-cyan)' }}>{s.who}</div>
                    <Prose>{s.view}</Prose>
                  </div>
                ))}
              </Grid>
              <p className="text-[12px] leading-relaxed m-0" style={subtle}>{x.note}</p>
            </Card>
          ))}

          <Card title="存疑 · 不收录 · 更正清单" className="mb-6">
            <DataTable
              caption="存疑与不收录清单"
              head={['条目', '处理', '理由']}
              rows={DOUBTFUL.map((d) => ({
                key: d.id,
                cells: [
                  d.item,
                  <span key="s" className="whitespace-nowrap" style={{ color: d.status === '不收录' || d.status === '〔存疑〕' ? 'var(--china-red)' : 'var(--fire-gold)' }}>{d.status}</span>,
                  d.reason,
                ],
              }))}
            />
          </Card>

          <Card title="核验规则与统计">
            <Prose className="mb-3">
              本看板共收录原话 {COUNTS.quote} 条、转述 {COUNTS.paraphrase} 条、〔存疑〕{COUNTS.doubt} 项、不收录 {DOUBTFUL.filter((d) => d.status === '不收录').length} 项；台账
              {' '}{LEDGER_META.done.label} {ledgerCount('done')}、{LEDGER_META.failed.label} {ledgerCount('failed')}、{LEDGER_META.open.label} {ledgerCount('open')}。
              原话均逐字取自著作原书、主办方页面、署名文章或主流媒体报道；整理稿与转载稿降为「转载」级别，其中的数字不作为本人立场定论。
              对在世人物仅呈现公开表述与可比数据，不作人身评价。
            </Prose>
          </Card>
        </>
      )}

      <ModuleFooter
        moduleId={BOARD.moduleId}
        sourceNote={BOARD.sourceNote}
        disclaimer="公开资料整理 · 转述为本站概括 · 不构成对人物的评价"
      />
    </div>
  );
}
