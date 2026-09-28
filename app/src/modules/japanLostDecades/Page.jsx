import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { radarOpt } from '../shared/chartHelpers.js';
import {
  AS_OF, ALIGN_MODES, METRICS, STAGES_JP, STAGES_CN, POSITIONING, CORE_FINDINGS, SIMILARITY,
  DIMENSIONS, LEDGER, BORROW, AVOID, STRUCTURAL, SCENARIOS, SIGNPOSTS, POLICY_OPINIONS,
  DEBATES, VERIFY, DOUBTFUL, SOURCES,
} from './data.js';
import { SERIES_FETCHED_AT } from './seriesGenerated.js';
import { alignedLineOption, JP_COLOR, CN_COLOR } from './charts.js';
import StageScroll from './StageScroll.jsx';

// ============================================================================
// 中日比较 · 失去的三十年 · IA 见 docs/japan-lost-decades-ia.md
// 总览（阶段对位 + 核心结论）→ 九维切片（对位图 + 相似/差异双栏）→ 启示与意见 → 核验与出处
// 铁律：每处古今/中日映射同时给「相似机制」与「关键差异」；数字标口径与出处；相似度为主观评估
// ============================================================================

const TABS = [
  { id: 'overview', label: '总览 · 阶段对位' },
  { id: 'slices', label: '九维切片' },
  { id: 'lessons', label: '启示与意见' },
  { id: 'sources', label: '核验与出处' },
];

const STATUS_META = {
  verified: { label: '已核验', color: '#10b981' },
  series: { label: 'API 序列', color: '#22d3ee' },
  approx: { label: '约数', color: '#e8a317' },
  doubt: { label: '存疑', color: '#c41e3a' },
};

const KEY_STATS = [
  { key: 'nikkei', value: '38,915', label: '日经泡沫高点', sub: '1989-12-29 收盘 · 2024-02 才被改写', accent: JP_COLOR },
  { key: 'boj', value: '1.25%', label: '日银政策利率', sub: '2026-09-18 · 1995 年以来最高', accent: JP_COLOR },
  { key: 'jpAging', value: '29.6%', label: '日本老龄化率', sub: '2026-09-15 · 总务省', accent: JP_COLOR },
  { key: 'cnDeflator', value: '3 年', label: '中国平减指数连负', sub: '2023–2025 · 世行 WDI', accent: CN_COLOR },
  { key: 'cnProperty', value: '−19.9%', label: '中国地产开发投资', sub: '2026 年 1–8 月 · NBS', accent: CN_COLOR },
  { key: 'cnAging', value: '15.9%', label: '中国 65 岁以上占比', sub: '2025 年末 · NBS', accent: CN_COLOR },
];

const textStyle = { color: 'var(--text-secondary)' };
const subtle = { color: 'var(--text-tertiary)' };

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

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = TABS.some((t) => t.id === tabParam) ? tabParam : 'overview';
  const dimParam = searchParams.get('dim');
  const dimKey = DIMENSIONS.some((d) => d.key === dimParam) ? dimParam : DIMENSIONS[0].key;

  const [modeKey, setModeKey] = useState('asset');
  const [stageKey, setStageKey] = useState('jp2');
  const [metricByDim, setMetricByDim] = useState({});

  const mode = ALIGN_MODES.find((m) => m.key === modeKey);
  const dim = DIMENSIONS.find((d) => d.key === dimKey);
  const metricKey = metricByDim[dim.key] ?? dim.metrics[0];
  const stage = [...STAGES_JP, ...STAGES_CN].find((s) => s.key === stageKey);
  const stageCountry = STAGES_JP.some((s) => s.key === stageKey) ? '日本' : '中国';

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const lineOption = useMemo(() => alignedLineOption(metricKey, mode), [metricKey, mode]);
  const radarOption = useMemo(() => radarOpt(
    SIMILARITY.map((s) => ({ name: s.dim, max: 100 })),
    SIMILARITY.map((s) => s.score),
    { name: '与日本对位阶段相似度（主观）', color: '#e8a317' },
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
        badge="比较研究 · 中日发展阶段"
        title="中日比较 · 失去的三十年"
        subtitle="阶段对位 · 九维切片 · 比较样本与政策意见"
      >
        <span className="mono text-xs" style={subtle}>asOf {AS_OF} · 序列抓取 {SERIES_FETCHED_AT}</span>
      </PageHeader>

      <IntroCard>
        日本 1985 年广场协议后吹起资产泡沫，1990 年破裂，此后经历坏账拖延、通缩固化、安倍经济学，直到 2024 年才结束负利率。
        中国自 2021 年地产转折以来，同样出现了资产价格下行、GDP 平减指数转负、老龄化与少子化加速的组合。本模块以
        <strong style={{ color: 'var(--text-primary)' }}>「阶段对位」</strong>
        为方法——资产拐点（日 1990 ↔ 中 2021）或深度老龄化（日 1994 ↔ 中 2021）——在宏观、产业、社会、贸易、金融、科技、教育、民生、人口九个切片上逐一比较，
        每处对照都同时给出<strong style={{ color: 'var(--cyber-cyan)' }}>相似机制</strong>与<strong style={{ color: 'var(--china-red)' }}>关键差异</strong>，拒绝「中国就是下一个日本」式的裸类比。
        数据以世行 WDI、IMF 与两国官方统计为准，截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>。
      </IntroCard>

      <TabBar tabs={TABS} value={tab} onChange={(id) => setParam('tab', id)} />

      {tab === 'overview' && (
        <>
          <StatGrid className="mb-6">
            {KEY_STATS.map((s) => <Stat key={s.key} value={s.value} label={s.label} sub={s.sub} accent={s.accent} />)}
          </StatGrid>

          <Card title="阶段对位卷轴 · 日本 1985–2026 × 中国 2005–2026" className="mb-6">
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
            <Card title="中国当下 ≈ 日本何时 · 分维度对位">
              <DataTable
                caption="分维度对位表"
                head={['维度', '对位日本', '依据']}
                rows={POSITIONING.map((p) => [p.dim, <span key="jp" className="mono" style={{ color: JP_COLOR }}>{p.jp}</span>, p.basis])}
              />
            </Card>
            <Card title="阶段相似度雷达（本模块主观评估 · 0–100）">
              <EChart option={radarOption} style={{ height: 320 }} />
              <p className="text-[11px] mt-2 leading-relaxed" style={subtle}>
                分值越高，表示中国当下该维度的机制与日本对位阶段越相似。人口（85）与宏观价格（70）最接近；民生（40）差异最大——中国居民消费率低、社保待遇城乡落差大，
                既是短板也是日本当年已无的政策空间。评分为本模块研判，非统计指标。
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
              图表横轴为「对位年 t」：t=0 为所选对位原点，日本线延伸至 t=+35，可作为中国未来路径的参照（不是预测）。选择「同日历年」则按年份并列。
            </p>
          </Card>

          <Card title={`${dim.title} · ${dim.question}`} className="mb-6">
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

            <DataTable
              caption={`${dim.title}关键数据`}
              head={['指标', '日本', '中国', '口径 / 出处']}
              rows={dim.facts.map((f) => [f.label, f.jp, f.cn, <span key="s" style={subtle}>{f.src}</span>])}
            />

            <Grid cols={2} className="mt-5 mb-4">
              <section>
                <h3 className="text-xs font-semibold mb-2" style={{ color: JP_COLOR }}>日本 · 发生了什么</h3>
                <Prose>{dim.jpText}</Prose>
              </section>
              <section>
                <h3 className="text-xs font-semibold mb-2" style={{ color: CN_COLOR }}>中国 · 当下切片</h3>
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
          <Card title="日本教训台账 · 已兑现 / 已失败 / 未决" className="mb-6">
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

          <Grid cols={2} className="mb-6">
            {[
              { key: 'borrow', title: '中国可借鉴', accent: '#10b981', items: BORROW },
              { key: 'avoid', title: '中国需避免', accent: '#c41e3a', items: AVOID },
            ].map((col) => (
              <Card key={col.key} title={col.title}>
                <div className="space-y-3">
                  {col.items.map((it) => (
                    <div key={it.title} style={{ paddingLeft: 10, borderLeft: `2px solid ${col.accent}` }}>
                      <div className="text-[13px] font-semibold mb-0.5" style={{ color: col.accent }}>{it.title}</div>
                      <p className="text-[12px] leading-relaxed m-0" style={textStyle}>{it.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </Grid>

          <Card title="中国不同于日本的结构性条件" className="mb-6">
            <DataTable
              caption="结构性条件差异"
              head={['维度', '日本 · 1990 前后', '中国 · 2026', '含义']}
              rows={STRUCTURAL.map((s) => [s.dim, s.jp, s.cn, s.meaning])}
            />
          </Card>

          <Card title="风险情景 · 日本化 / 非日本化分叉（主观情景，非预测）" className="mb-6">
            <Grid cols={3} className="mb-5">
              {SCENARIOS.map((s) => (
                <div key={s.key} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${s.accent}` }}>
                  <div className="text-sm font-semibold mb-2" style={{ color: s.accent }}>{s.title}</div>
                  <p className="text-[12px] leading-relaxed mb-2" style={textStyle}>{s.text}</p>
                  <p className="text-[11px] leading-relaxed m-0" style={subtle}><strong>触发信号：</strong>{s.triggers}</p>
                </div>
              ))}
            </Grid>
            <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>分叉观测清单</h3>
            <DataTable
              caption="分叉观测清单"
              head={['指标', '当前读数', '日本化警戒', '非日本化信号', '出处']}
              rows={SIGNPOSTS.map((s) => [s.indicator, s.now, <span key="w" style={{ color: '#c41e3a' }}>{s.warn}</span>, <span key="g" style={{ color: '#10b981' }}>{s.good}</span>, <span key="s" style={subtle}>{s.src}</span>])}
            />
          </Card>

          <Card title="政策意见 · 比较研究样本给出的六条建议" className="mb-6">
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
              <Link to="/econ-dashboard" style={{ color: 'var(--cyber-cyan)' }}>经济大盘</Link>
              {' · '}
              <Link to="/modules/shijian-world/sjw-15" style={{ color: 'var(--cyber-cyan)' }}>SJW-15 日本发展型国家</Link>
              {' · '}
              <Link to="/modules/shijian-world/sjw-16" style={{ color: 'var(--cyber-cyan)' }}>SJW-16 广场协议货币锚</Link>
              {' · '}
              <Link to="/middleincometrap" style={{ color: 'var(--cyber-cyan)' }}>中等收入陷阱</Link>
              {' · '}
              <Link to="/demographic" style={{ color: 'var(--cyber-cyan)' }}>人口结构</Link>。
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
                  年度序列由 <span className="mono">scripts/fetch-japan-lost-decades.mjs</span> 从世行 WDI 与 IMF DataMapper 抓取（{SERIES_FETCHED_AT}），重跑脚本即可更新；
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
        moduleId="japanLostDecades"
        sourceNote="世行 WDI / IMF / 国家统计局 / 日本总务省·厚劳省·日本银行 · 阶段对位比较"
        disclaimer="公开资料整理 · 比较研究非预测 · 相似度与情景为主观研判"
      />
    </div>
  );
}
