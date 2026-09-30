import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { radarOpt } from '../shared/chartHelpers.js';
import {
  AS_OF, ALIGN_MODES, METRICS, STAGES_VN, STAGES_CN, POSITIONING, CORE_FINDINGS, SIMILARITY,
  DIMENSIONS, LEDGER, REVERSE, COMPETE, SCENARIOS, SIGNPOSTS, POLICY_OPINIONS,
  DEBATES, VERIFY, DOUBTFUL, SOURCES,
} from './data.js';
import { SERIES_FETCHED_AT } from './seriesGenerated.js';
import { alignedLineOption, EXTRA_CHARTS, VN_COLOR, CN_COLOR } from './charts.js';
import StageScroll from './StageScroll.jsx';

// ============================================================================
// 中越比较研究 · IA 见 docs/vietnam-compare-ia.md
// 总览（阶段对位 + 核心结论）→ 九维切片（对位图 + 相似/差异双栏）→ 双向启示 → 核验与出处
// 铁律：每处中越对照同时给「相似机制」与「关键差异」；数字标口径与出处；相似度与情景为主观评估
// ============================================================================

const TABS = [
  { id: 'overview', label: '总览 · 阶段对位' },
  { id: 'slices', label: '九维切片' },
  { id: 'lessons', label: '双向启示' },
  { id: 'sources', label: '核验与出处' },
];

const STATUS_META = {
  verified: { label: '已核验', color: '#10b981' },
  series: { label: 'API 序列', color: '#22d3ee' },
  approx: { label: '约数', color: '#e8a317' },
  doubt: { label: '存疑', color: '#c41e3a' },
};

const KEY_STATS = [
  { key: 'vnGdp', value: '8.02%', label: '越南 2025 年 GDP 增速', sub: '2026 上半年 8.18% · 越南统计局', accent: VN_COLOR },
  { key: 'ppp', value: '≈ 中国 2015', label: '越南人均收入对位', sub: 'PPP 2021 不变价 · 世行 · 现价美元≈中国 2010', accent: VN_COLOR },
  { key: 'open', value: '190%', label: '越南贸易 / GDP', sub: '2025 · 世行 · 中国约 38%', accent: VN_COLOR },
  { key: 'fie', value: '80.1%', label: '外资企业占越南出口', sub: '2026 年 1–8 月 · 越南统计局', accent: VN_COLOR },
  { key: 'cnExp', value: '1,981 亿', label: '中国对越出口（美元）', sub: '2025 · +22.4% · 海关总署', accent: CN_COLOR },
  { key: 'tariff', value: '12.5%', label: '美国对越现行 301 关税', sub: '2026-07-24 起 · 与中国同档 · USTR', accent: CN_COLOR },
];

const OVERVIEW_NOTES = {
  income: '横轴为人均 GDP（PPP，2021 年不变价，对数），纵轴为实际增速：在人均 5,000–15,000 国际元区间，中国（2003–2015 年）增速多在 7–14%，越南（2003–2025 年）多在 5–8%——越南跨越同一收入段的速度慢于中国。',
  reform: '按改革元年对齐：在 2021 年 PPP 口径下越南起点高于中国（早年数值受 PPP 基准修订影响，仅作量级参考），但中国凭更快增速在改革第 34 年前后（中 2012 / 越 2020）反超，此后差距扩大。',
  wto: '按入世对齐：入世当年越南（2007）的 PPP 人均收入高于中国（2001），中国在入世第 7–8 年前后反超，入世红利期的增速差是两国收入分化的主因。',
  calendar: '按日历年并列：2021 年 PPP 口径下越南 2002 年仍略高于中国，2003 年起被中国超过，2025 年约为中国的 61.7%。',
};

const textStyle = { color: 'var(--text-secondary)' };
const subtle = { color: 'var(--text-tertiary)' };
const link = { color: 'var(--cyber-cyan)' };

function Prose({ children, className = '' }) {
  return <p className={`text-sm leading-relaxed ${className}`} style={textStyle}>{children}</p>;
}

function MirrorPair({ similar, differ }) {
  return (
    <Grid cols={2} className="mb-4">
      <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: '2px solid var(--cyber-cyan)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--cyber-cyan)' }}>相似机制</div>
        <Prose>{similar}</Prose>
      </div>
      <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: '2px solid var(--china-red)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--china-red)' }}>关键差异</div>
        <Prose>{differ}</Prose>
      </div>
    </Grid>
  );
}

function DataTable({ head, rows, caption }) {
  return (
    <div className="os-table-scroll">
      <table className="w-full text-xs" style={{ borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr style={{ ...subtle, textAlign: 'left' }}>
            {head.map((h) => <th key={h} scope="col" className="py-2 pr-3 font-normal">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells) => (
            <tr key={cells[0]} style={{ borderTop: '1px solid var(--border-subtle, rgba(148,163,184,0.1))' }}>
              <th scope="row" className="py-2 pr-3 font-normal text-left align-top" style={{ color: 'var(--text-primary)', minWidth: 110 }}>{cells[0]}</th>
              {cells.slice(1).map((c, i) => (
                <td key={`${cells[0]}-${head[i + 1]}`} className="py-2 pr-3 align-top leading-relaxed">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status];
  return (
    <span className="text-[10px] mono px-1.5 py-0.5 rounded whitespace-nowrap" style={{ color: m.color, border: `1px solid ${m.color}` }}>
      {m.label}
    </span>
  );
}

function ExtraChart({ chartKey }) {
  const spec = EXTRA_CHARTS[chartKey];
  const option = useMemo(() => spec.build(), [spec]);
  return (
    <section className="mb-5">
      <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{spec.title}</h3>
      <EChart option={option} style={{ height: spec.height }} />
      <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>口径：{spec.note}</p>
    </section>
  );
}

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = TABS.some((t) => t.id === tabParam) ? tabParam : 'overview';
  const dimParam = searchParams.get('dim');
  const dimKey = DIMENSIONS.some((d) => d.key === dimParam) ? dimParam : DIMENSIONS[0].key;

  const [modeKey, setModeKey] = useState('income');
  const [stageKey, setStageKey] = useState('vn7');
  const [metricByDim, setMetricByDim] = useState({});

  const mode = ALIGN_MODES.find((m) => m.key === modeKey);
  const dim = DIMENSIONS.find((d) => d.key === dimKey);
  const metricKey = dim.metrics.length ? (metricByDim[dim.key] ?? dim.metrics[0]) : null;
  const stage = [...STAGES_VN, ...STAGES_CN].find((s) => s.key === stageKey);
  const stageCountry = STAGES_VN.some((s) => s.key === stageKey) ? '越南' : '中国';
  const overviewMetric = mode.income ? 'gdpGrowth' : 'gdpPcPppKd';

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const lineOption = useMemo(() => (metricKey ? alignedLineOption(metricKey, mode) : null), [metricKey, mode]);
  const overviewOption = useMemo(() => alignedLineOption(overviewMetric, mode), [overviewMetric, mode]);
  const radarOption = useMemo(() => radarOpt(
    SIMILARITY.map((s) => ({ name: s.dim, max: 100 })),
    SIMILARITY.map((s) => s.score),
    { name: '与中国对位阶段相似度（主观）', color: VN_COLOR },
  ), []);

  const modeSelector = (
    <SelectorBar
      items={ALIGN_MODES.map((m) => ({ key: m.key, label: m.label, accent: m.accent }))}
      activeKey={modeKey}
      onSelect={setModeKey}
    />
  );

  return (
    <div>
      <PageHeader
        badge="比较研究 · 中越转型路径"
        title="中越比较研究"
        subtitle="阶段对位 · 九维切片 · 竞争互补与双向启示"
      >
        <span className="mono text-xs" style={subtle}>asOf {AS_OF} · 序列抓取 {SERIES_FETCHED_AT}</span>
      </PageHeader>

      <IntroCard>
        中国 1978 年改革开放、2001 年入世；越南 1986 年「革新」（Đổi Mới）、2007 年入世——同为共产党领导、渐进改革转型的两国，
        越南在哪些维度复刻了中国路径、在哪些维度偏离？越南当下对应中国哪个阶段？中国能从越南学到什么、又面临哪些竞争？本模块以
        <strong style={{ color: 'var(--text-primary)' }}>「阶段对位」</strong>
        为方法——改革起点、入世、人均收入（PPP）三种口径可切换——在宏观、政治治理、产业与外资、贸易、金融地产、科技教育、人口民生、外交地缘、转型路径九个切片上逐一比较，
        每处对照同时给出<strong style={{ color: 'var(--cyber-cyan)' }}>相似机制</strong>与<strong style={{ color: 'var(--china-red)' }}>关键差异</strong>，拒绝「越南就是下一个中国」式的裸类比。
        数据以世行 WDI、IMF、越南统计总局与中国官方统计为准，政治外交议题只陈述可核实事实，截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>。
      </IntroCard>

      <TabBar tabs={TABS} value={tab} onChange={(id) => setParam('tab', id)} />

      {tab === 'overview' && (
        <>
          <StatGrid className="mb-6">
            {KEY_STATS.map((s) => <Stat key={s.key} value={s.value} label={s.label} sub={s.sub} accent={s.accent} />)}
          </StatGrid>

          <Card title="阶段对位卷轴 · 越南 1976–2026 × 中国 1976–2026" className="mb-6">
            {modeSelector}
            <p className="text-[11px] mb-3 leading-relaxed" style={subtle}>{mode.note}</p>
            <StageScroll mode={mode} activeKey={stageKey} onSelect={setStageKey} />
            {stage && (
              <div className="os-card p-4 mt-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${stage.accent}` }} aria-live="polite">
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {stageCountry} · {stage.from}–{stage.to} · {stage.title}
                </div>
                <Prose>{stage.desc}</Prose>
              </div>
            )}
          </Card>

          <Card title={mode.income ? '收入对齐曲线 · 同一人均收入水平下的增速' : `对齐曲线 · 人均 GDP（PPP）· ${mode.short}`} className="mb-6">
            <EChart option={overviewOption} style={{ height: 320 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
              {OVERVIEW_NOTES[mode.key]}
              {' '}口径：{METRICS[overviewMetric].note}
            </p>
          </Card>

          <Card title="核心结论" className="mb-6">
            <div className="space-y-5">
              {CORE_FINDINGS.map((f) => (
                <section key={f.title}>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <Prose>{f.body}</Prose>
                </section>
              ))}
            </div>
          </Card>

          <Grid cols={2} className="mb-6">
            <Card title="越南当下 ≈ 中国何时 · 分维度对位">
              <DataTable
                caption="分维度对位表"
                head={['维度', '对位中国', '依据']}
                rows={POSITIONING.map((p) => [p.dim, <span key="cn" className="mono" style={{ color: CN_COLOR }}>{p.cn}</span>, p.basis])}
              />
            </Card>
            <Card title="阶段相似度雷达（本模块主观评估 · 0–100）">
              <EChart option={radarOption} style={{ height: 320 }} />
              <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
                分值越高，表示越南当下该维度的机制与中国对位阶段越相似。政治与治理（75）、宏观增长（65）最接近；外交地缘（25）与科技教育（30）差异最大——
                越南以竹子外交多方押注、以外资组装替代本土研发，与中国的大国外交与全链条自主形成对照。评分为本模块研判，非统计指标。
              </p>
            </Card>
          </Grid>

          <Card title="学界争议 · 并陈异说" className="mb-6">
            <div className="space-y-6">
              {DEBATES.map((d) => (
                <section key={d.q}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--fire-gold)' }}>{d.q}</h3>
                  <Grid cols={2}>
                    {d.views.map((v) => (
                      <div key={v.who} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{v.who}</div>
                        <p className="text-[12px] leading-relaxed m-0" style={textStyle}>{v.text}</p>
                      </div>
                    ))}
                  </Grid>
                </section>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === 'slices' && (
        <>
          <Card title="切片选择 · 对齐口径" className="mb-6">
            <SelectorBar
              items={DIMENSIONS.map((d) => ({ key: d.key, label: d.title, accent: d.accent }))}
              activeKey={dim.key}
              onSelect={(k) => setParam('dim', k)}
            />
            {modeSelector}
            <p className="text-[11px] leading-relaxed m-0" style={subtle}>
              改革起点 / 入世口径下横轴为「对位年 t」（t=0 为所选原点）；收入水平口径下横轴为人均 GDP（PPP），两国在同一收入水平上直接比较；「同日历年」则按年份并列。中国曲线越过越南当下的部分，可作为越南未来路径的参照（不是预测）。
            </p>
          </Card>

          <Card title={`${dim.title} · ${dim.question}`} className="mb-6">
            {metricKey && (
              <>
                <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="指标选择">
                  {dim.metrics.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={m === metricKey}
                      onClick={() => setMetricByDim((prev) => ({ ...prev, [dim.key]: m }))}
                      className={`os-filter-chip mono ${m === metricKey ? 'is-active' : ''}`}
                      style={{ '--chip-accent': dim.accent }}
                    >
                      {METRICS[m].label}
                    </button>
                  ))}
                </div>
                <EChart option={lineOption} style={{ height: 340 }} />
                <p className="text-[11px] mt-2 mb-5 leading-relaxed" style={subtle}>
                  口径：{METRICS[metricKey].note}
                </p>
              </>
            )}

            {dim.extra && <ExtraChart key={dim.extra} chartKey={dim.extra} />}

            <DataTable
              caption={`${dim.title}关键数据`}
              head={['指标', '越南', '中国', '口径 / 出处']}
              rows={dim.facts.map((f) => [f.label, f.vn, f.cn, <span key="s" style={subtle}>{f.src}</span>])}
            />

            <Grid cols={2} className="mt-5 mb-4">
              <section>
                <h3 className="text-xs font-semibold mb-2" style={{ color: VN_COLOR }}>越南 · 路径与现状</h3>
                <Prose>{dim.vnText}</Prose>
              </section>
              <section>
                <h3 className="text-xs font-semibold mb-2" style={{ color: CN_COLOR }}>中国 · 对位切片</h3>
                <Prose>{dim.cnText}</Prose>
              </section>
            </Grid>

            <MirrorPair similar={dim.similar} differ={dim.differ} />

            <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--fire-gold)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--fire-gold)' }}>中国启示</div>
              <Prose>{dim.implication}</Prose>
            </div>
          </Card>
        </>
      )}

      {tab === 'lessons' && (
        <>
          <Card title="中国经验在越南 · 复制成败台账（已兑现 / 已失败 / 未决）" className="mb-6">
            <Grid cols={3}>
              {[
                { key: 'done', title: '已兑现', accent: '#10b981', items: LEDGER.done },
                { key: 'failed', title: '已失败', accent: '#c41e3a', items: LEDGER.failed },
                { key: 'open', title: '未决', accent: '#e8a317', items: LEDGER.open },
              ].map((col) => (
                <div key={col.key} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${col.accent}` }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: col.accent }}>{col.title}</div>
                  <div className="space-y-3">
                    {col.items.map((it) => (
                      <div key={it.title} style={{ paddingLeft: 8, borderLeft: `2px solid ${col.accent}55` }}>
                        <div className="text-[12px] font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{it.title}</div>
                        <p className="text-[12px] leading-relaxed m-0" style={textStyle}>{it.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Grid>
          </Card>

          <Card title="越南对中国的反向启示" className="mb-6">
            <Grid cols={2}>
              {REVERSE.map((it) => (
                <div key={it.title} style={{ paddingLeft: 10, borderLeft: `2px solid ${VN_COLOR}` }}>
                  <div className="text-[13px] font-semibold mb-0.5" style={{ color: VN_COLOR }}>{it.title}</div>
                  <p className="text-[12px] leading-relaxed m-0" style={textStyle}>{it.text}</p>
                </div>
              ))}
            </Grid>
          </Card>

          <Card title="中国面临的产业竞争与互补" className="mb-6">
            <DataTable
              caption="产业竞争与互补"
              head={['领域', '关系', '越南侧', '中国侧', '研判']}
              rows={COMPETE.map((c) => [c.sector, <span key="r" className="whitespace-nowrap" style={{ color: 'var(--fire-gold)' }}>{c.relation}</span>, c.vn, c.cn, c.note])}
            />
          </Card>

          <Card title="越南路径情景分析（主观情景，非预测）" className="mb-6">
            <Grid cols={3} className="mb-5">
              {SCENARIOS.map((s) => (
                <div key={s.key} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${s.accent}` }}>
                  <div className="text-sm font-semibold mb-2" style={{ color: s.accent }}>{s.title}</div>
                  <p className="text-[12px] leading-relaxed mb-2" style={textStyle}>{s.text}</p>
                  <p className="text-[11px] leading-relaxed m-0" style={subtle}><strong>触发信号：</strong>{s.triggers}</p>
                </div>
              ))}
            </Grid>
            <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>观察指标</h3>
            <DataTable
              caption="观察指标"
              head={['指标', '当前读数', '警戒', '向好信号', '出处']}
              rows={SIGNPOSTS.map((s) => [s.indicator, s.now, <span key="w" style={{ color: '#c41e3a' }}>{s.warn}</span>, <span key="g" style={{ color: '#10b981' }}>{s.good}</span>, <span key="s" style={subtle}>{s.src}</span>])}
            />
          </Card>

          <Card title="政策意见 · 中越比较给中国的六条建议" className="mb-6">
            <div className="space-y-4">
              {POLICY_OPINIONS.map((p) => (
                <section key={p.title}>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                  <Prose>{p.text}</Prose>
                </section>
              ))}
            </div>
            <p className="text-[11px] mt-4 leading-relaxed" style={subtle}>
              交叉阅读：
              <Link to="/japan-lost-decades" style={link}>中日比较 · 失去的三十年</Link>
              {' · '}
              <Link to="/benchmark" style={link}>国际对标</Link>
              {' · '}
              <Link to="/econ-dashboard" style={link}>经济大盘</Link>
              {' · '}
              <Link to="/middleincometrap" style={link}>中等收入陷阱</Link>
              {' · '}
              <Link to="/foreign-trade" style={link}>对外贸易</Link>
              {' · '}
              <Link to="/supplychain" style={link}>供应链</Link>
              {' · '}
              <Link to="/diplomacy" style={link}>外交博弈</Link>
              {' · '}
              <Link to="/modules/heshan/reform" style={link}>重构山河 · 区划诊断</Link>
              {' · '}
              <Link to="/modules/shijian-world/sjw-29" style={link}>SJW-29 东南亚四小虎</Link>
              {' · '}
              <Link to="/scholars/xiao-gongqin?tab=views&theme=chinamodel" style={link}>萧功秦 · 中国—越南模式</Link>。
            </p>
          </Card>
        </>
      )}

      {tab === 'sources' && (
        <>
          <Card title="关键数据核验表" className="mb-6">
            <DataTable
              caption="关键数据核验表"
              head={['指标', '数值', '口径', '来源', '状态']}
              rows={VERIFY.map((v) => [v.item, v.value, v.caliber, <span key="s" style={subtle}>{v.src}</span>, <StatusBadge key="b" status={v.status} />])}
            />
          </Card>

          <Grid cols={2} className="mb-6">
            <Card title="〔存疑〕与口径提示">
              <ol className="m-0 pl-4 space-y-1.5">
                {DOUBTFUL.map((d) => <li key={d} className="text-[12px] leading-relaxed" style={textStyle}>{d}</li>)}
              </ol>
            </Card>
            <Card title="对齐口径与方法说明">
              <div className="space-y-3">
                {ALIGN_MODES.map((m) => (
                  <div key={m.key} style={{ paddingLeft: 10, borderLeft: `2px solid ${m.accent}` }}>
                    <div className="text-[12px] font-semibold mb-0.5" style={{ color: m.accent }}>{m.label}</div>
                    <p className="text-[12px] leading-relaxed m-0" style={textStyle}>{m.note}</p>
                  </div>
                ))}
                <p className="text-[11px] leading-relaxed m-0" style={subtle}>
                  年度序列由 <span className="mono">scripts/fetch-vietnam-compare.mjs</span> 从世行 WDI 与 IMF DataMapper 抓取（{SERIES_FETCHED_AT}），重跑脚本即可更新；
                  手工录入项均在核验表中标注来源与状态。
                </p>
              </div>
            </Card>
          </Grid>

          <Card title="出处" className="mb-6">
            <ol className="m-0 pl-4 space-y-1.5">
              {SOURCES.map((s) => (
                <li key={s.id} className="text-[11px] leading-relaxed" style={subtle}>
                  <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{s.id}</span>
                  {' · '}
                  {s.text}
                </li>
              ))}
            </ol>
          </Card>
        </>
      )}

      <ModuleFooter
        moduleId="vietnamCompare"
        sourceNote="世行 WDI / IMF / 越南统计总局·国会·越共文献 / 中国海关·统计局 / USTR·美国普查局 · 阶段对位比较"
        disclaimer="公开资料整理 · 比较研究非预测 · 相似度与情景为主观研判 · 政治外交议题仅陈述可核实事实"
      />
    </div>
  );
}
