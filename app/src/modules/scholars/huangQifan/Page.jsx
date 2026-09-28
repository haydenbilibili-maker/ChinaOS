import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar } from '../../../app/ui.jsx';
import EChart from '../../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, ModuleFooter } from '../../shared/ModuleParadigm.jsx';
import { CHART_SERIES_COLORS } from '../../shared/chartHelpers.js';
import { SCHOLAR_TABS, VERIFY_META, LEDGER_META } from '../schema.js';
import {
  Prose, QuoteCard, ClaimList, LedgerBoard, DataTable, VerifyBadge, subtle, textStyle,
} from '../ScholarKit.jsx';
import {
  AS_OF, THEMES, THEME_KEYS, PROFILE, BOOKS, CORPUS, CLAIMS, QUOTES, THEME_INTRO,
  LEDGER, NUMERIC_CHECKS, CONTROVERSIES, DOUBTFUL, COUNTS,
} from './data.js';
import {
  themeHeatmapOption, careerGanttOption, bookTimelineOption, numericDeviationOption, frameworkGraphOption,
} from './charts.js';

// ============================================================================
// 学者专栏 · 黄奇帆 · IA 见 docs/scholars/README.md
// 总览（人物 + 框架 + 热力）→ 分领域观点 → 预判检验台账 → 著作与讲话文库 → 争议与出处
// 铁律：原话逐字且有出处；转述不加引号；未核实内容标〔存疑〕或不收录
// ============================================================================

const THEME_LINKS = {
  property: [{ to: '/housing', label: '住房地产' }, { to: '/debt', label: '地方债务' }],
  social: [{ to: '/urban', label: '城镇化' }, { to: '/demographic', label: '人口' }],
  capital: [{ to: '/capital-market', label: '资本市场' }, { to: '/rmb', label: '人民币' }],
  digital: [{ to: '/digital', label: '数字经济' }, { to: '/data-element', label: '数据要素' }],
  industry: [{ to: '/manufacturing', label: '制造业' }, { to: '/supplychain', label: '供应链' }],
  trade: [{ to: '/foreign-trade', label: '外贸' }, { to: '/econ-dashboard', label: '经济大盘' }],
  macro: [{ to: '/econ-dashboard', label: '经济大盘' }, { to: '/japan-lost-decades', label: '中日比较' }],
};

const FEATURED = ['p1', 'p6', 's1', 'f1', 'd4', 'i4', 't3', 't6'];

const ledgerCount = (s) => LEDGER.filter((l) => l.status === s).length;

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = SCHOLAR_TABS.some((t) => t.id === tabParam) ? tabParam : 'overview';
  const themeParam = searchParams.get('theme');
  const theme = THEME_KEYS.includes(themeParam) ? themeParam : 'property';
  const [libTheme, setLibTheme] = useState('all');

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const heatOpt = useMemo(() => themeHeatmapOption(), []);
  const ganttOpt = useMemo(() => careerGanttOption(), []);
  const bookOpt = useMemo(() => bookTimelineOption(), []);
  const devOpt = useMemo(() => numericDeviationOption(), []);
  const graphOpt = useMemo(() => frameworkGraphOption(), []);

  const featured = FEATURED.map((id) => QUOTES.find((q) => q.id === id)).filter(Boolean);
  const themeClaims = CLAIMS.filter((c) => c.theme === theme);
  const libCorpus = libTheme === 'all' ? CORPUS : CORPUS.filter((k) => k.themes.includes(libTheme));

  const themeItems = THEME_KEYS.map((k) => ({ key: k, label: THEMES[k].label, accent: THEMES[k].color }));

  return (
    <div>
      <PageHeader
        badge="学者专栏 · 01"
        title="黄奇帆 · 观点看板"
        subtitle="人物履历 · 人地钱房 · 产业开放 · 贸易格局 · 预判检验"
      >
        <span className="mono text-xs" style={subtle}>asOf {AS_OF} · <Link to="/scholars" style={{ color: 'var(--cyber-cyan)' }}>返回专栏</Link></span>
      </PageHeader>

      <IntroCard>
        {PROFILE.summary}本看板把其 1995—2026 年的著作、讲话与署名文章按七个领域整理，
        区分<strong style={{ color: 'var(--fire-gold)' }}>原话</strong>（出处可见的逐字引文）与
        <strong style={{ color: 'var(--text-primary)' }}>转述</strong>（本站概括，不加引号），并把可被数据检验的前瞻性表述放入
        「已兑现 / 已失败 / 未决」三列台账。网传托名演讲未见可靠出处者一律不收录。
      </IntroCard>

      <TabBar tabs={SCHOLAR_TABS} value={tab} onChange={(id) => setParam('tab', id)} />

      {tab === 'overview' && (
        <>
          <StatGrid className="mb-6">
            <Stat value={COUNTS.quote} label="原话条目" sub="逐字 · 附场合日期" accent="var(--fire-gold)" />
            <Stat value={COUNTS.paraphrase} label="转述条目" sub="概括 · 不加引号" />
            <Stat value={COUNTS.corpus} label="讲话/文章" sub="2010—2026 文库" accent="var(--cyber-cyan)" />
            <Stat value={COUNTS.books} label="著作" sub="另 1 部〔存疑〕" accent="var(--cyber-cyan)" />
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

          <Card title="履历时间线 · 上海 → 重庆 → 北京 → 智库" className="mb-6">
            <EChart option={ganttOpt} style={{ height: 380 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
              <span style={{ color: CHART_SERIES_COLORS.cyberCyan }}>■</span> 上海　
              <span style={{ color: CHART_SERIES_COLORS.powerRed }}>■</span> 重庆　
              <span style={{ color: CHART_SERIES_COLORS.fireGold }}>■</span> 全国人大　
              <span style={{ color: CHART_SERIES_COLORS.emerald }}>■</span> 智库/高校 · 半透明条为起止未核〔存疑〕；悬停查看本人回忆与公开履历的出入。
            </p>
          </Card>

          <Card title="议题热力 · 年份 × 领域" className="mb-6">
            <EChart option={heatOpt} style={{ height: 320 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
              计数 = 本站文库讲话/文章与著作的领域标注次数（一篇可跨多个领域），反映收录样本分布，不代表其全部公开发言。
            </p>
          </Card>

          <Card title="代表性原话 · 附完整出处">
            <Grid cols={{ default: 1, md: 2 }}>
              {featured.map((q) => <QuoteCard key={q.id} item={q} accent={THEMES[q.theme].color} />)}
            </Grid>
          </Card>
        </>
      )}

      {tab === 'views' && (
        <>
          <SelectorBar items={themeItems} activeKey={theme} onSelect={(k) => setParam('theme', k)} />
          <Card title={`${THEMES[theme].label} · ${themeClaims.length} 条`}>
            <Prose className="mb-4">{THEME_INTRO[theme]}</Prose>
            <ClaimList claims={themeClaims} />
            <div className="flex flex-wrap gap-2 mt-5 text-xs" style={subtle}>
              <span>对照本站数据：</span>
              {THEME_LINKS[theme].map((l) => (
                <Link key={l.to} to={l.to} className="os-filter-chip mono" style={{ '--chip-accent': THEMES[theme].color }}>{l.label} →</Link>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === 'ledger' && (
        <>
          <IntroCard className="mb-6">
            台账只收录「可被数据检验」的前瞻性表述，对照数据截至 {AS_OF}。检验窗口尚未结束或官方未公布可比数据者一律归入「未决」，
            不做虚假收束；依赖当事人自述口径的「已兑现」条目会在说明中注明。
          </IntroCard>
          <div className="mb-8"><LedgerBoard items={LEDGER} /></div>

          <Card title="数字口径对照 · 公开表述 vs 官方统计" className="mb-6">
            <EChart option={devOpt} style={{ height: 300 }} />
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
              rows={[...libCorpus].reverse().map((k) => ({
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
              本看板共收录原话 {COUNTS.quote} 条、转述 {COUNTS.paraphrase} 条、〔存疑〕{COUNTS.doubt} 项；台账
              {' '}{LEDGER_META.done.label} {ledgerCount('done')}、{LEDGER_META.failed.label} {ledgerCount('failed')}、{LEDGER_META.open.label} {ledgerCount('open')}。
              原话均逐字取自主办方页面、署名文章或主流媒体报道；整理稿与转载稿降为「转载」级别，其中的数字不作为本人立场定论。
              对在世人物仅呈现公开表述与可比数据，不作人身评价。
            </Prose>
          </Card>
        </>
      )}

      <ModuleFooter
        moduleId="scholarHuangQifan"
        sourceNote="著作原书 / 主办方页面 / 署名文章 / 主流媒体报道 · 对照数据：财政部、海关总署、国家统计局、国务院关税税则委员会"
        disclaimer="公开资料整理 · 转述为本站概括 · 不构成对人物的评价"
      />
    </div>
  );
}
