import React, { useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import { Link } from 'react-router-dom';
import EChart from '../../lib/viz/EChart.jsx';
import {
  CLOCK_QUADRANTS, CYCLE_POSITION, KONDRATIEV, MIDDLE_INCOME, cycleSummary,
} from './econCycle.js';
import {
  ECON_COLORS, BandHead, SignalDot,
} from './econUI.jsx';
import { categoryX, valueY, CHART_TOOLTIP } from '../shared/chartHelpers.js';

// ============================================================================
// 历史周期对照 · 我们在周期的哪一格（SectionCycle · Round6）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接取 econCycle.js 常量（确定性 seed，基准日 '2026-06-11'），
// 主线程 Page.jsx import 后 <SectionCycle/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 ↻ 标题区 + cycleSummary 合成研判条
//   · 三联：
//       a. 美林时钟：四象限 2×2 方格，当前象限高亮 + 脉冲点（CYCLE_POSITION）
//       b. 康波长波：季相条（season 大字 + seasonColor + seedTech + nextWave）
//          + Link「→ 康波周期模块」to /cognition
//       c. 中等收入陷阱：人均 GDP 折线（高收入门槛 14000 markLine + 当前点）
//          + gapPct 大数 + risks(朱砂)/edges(青) 双列 + Link to /middleincometrap
//   · 卡尾统一口径小字。容错：数据缺失逐块回退、零随机。
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测 —— 周期定位为历史框架对照 + 示意标定，非预测';
const HIGH_INCOME_LINE = 14000; // 世界银行高收入门槛（人均 GNI，示意标定）

const C = ECON_COLORS || {};
const CIN = C.cinnabar || '#c44e3d';
const TEAL = C.teal || '#62a89e';
const OCHRE = C.ochre || '#c99a4e';
const INDIGO = C.indigo || '#8090c6';

// 季相 → 兜底配色（econCycle 未提供 seasonColor 时回退）
const SEASON_FALLBACK = {
  春: TEAL, 夏: OCHRE, 秋: CIN, 冬: INDIGO,
};

function seasonColorOf(k) {
  if (!k) return INDIGO;
  if (k.seasonColor) return k.seasonColor;
  const s = String(k.season || '').slice(0, 1);
  return SEASON_FALLBACK[s] || INDIGO;
}

// 小标签 chip（evidence / seedTech 通用）
function Chip({ children, color }) {
  const c = color || 'var(--text-tertiary)';
  return (
    <span
      className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded mono"
      style={{ background: `${c}14`, border: `1px solid ${c}40`, color: c }}
    >
      {children}
    </span>
  );
}

// 跨模块 Link 行（→ 模块名）
function CrossLink({ to, label }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[11px] mt-3 transition-colors"
      style={{ color: INDIGO }}
    >
      <span aria-hidden="true">→</span>
      <span style={{ borderBottom: `1px dashed ${INDIGO}66` }}>{label}</span>
    </Link>
  );
}

export default function SectionCycle() {
  const quadrants = Array.isArray(CLOCK_QUADRANTS) ? CLOCK_QUADRANTS : [];
  const pos = CYCLE_POSITION && typeof CYCLE_POSITION === 'object' ? CYCLE_POSITION : null;
  const kondratiev = KONDRATIEV && typeof KONDRATIEV === 'object' ? KONDRATIEV : null;
  const mit = MIDDLE_INCOME && typeof MIDDLE_INCOME === 'object' ? MIDDLE_INCOME : null;

  // —— 美林时钟当前象限 ——
  const activeId = pos?.quadrantId != null ? pos.quadrantId : null;
  const activeQuad = quadrants.find((q) => q.id === activeId)
    || quadrants.find((q) => q.label === pos?.label)
    || null;

  // —— 合成研判条 ——
  // econCycle.cycleSummary 返回 {clock, kondratiev, middleIncome} 三句；
  // 容错：字符串则整条展示；缺字段逐句跳过。
  const summary = useMemo(() => {
    let s = null;
    try {
      s = typeof cycleSummary === 'function' ? cycleSummary() : null;
    } catch { s = null; }
    if (!s) return null;
    if (typeof s === 'string') return { lines: [{ label: '研判', text: s, color: INDIGO }] };
    const lines = [
      { label: '时钟', text: s.clock, color: activeQuad?.color || CIN },
      { label: '长波', text: s.kondratiev, color: seasonColorOf(kondratiev) },
      { label: '阶段', text: s.middleIncome, color: OCHRE },
    ].filter((l) => l.text);
    return lines.length ? { lines } : null;
  }, [activeQuad, kondratiev]);

  // 2×2 网格固定布局（标准美林时钟：x=增长右正，y=通胀上正）
  //   滞胀(增长↓通胀↑ 左上) | 过热(增长↑通胀↑ 右上)
  //   衰退(增长↓通胀↓ 左下) | 复苏(增长↑通胀↓ 右下)
  // 优先 econCycle 提供的 row/col；否则按 id 映射；再否则按数组序铺 2×2。
  const gridCells = useMemo(() => {
    const byId = {
      滞胀: { row: 0, col: 0 },
      过热: { row: 0, col: 1 },
      衰退: { row: 1, col: 0 },
      复苏: { row: 1, col: 1 },
    };
    const seqSlots = [
      { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
    ];
    return quadrants.slice(0, 4).map((q, i) => {
      const mapped = byId[q.id] || byId[q.label] || seqSlots[i];
      const r = typeof q.row === 'number' ? q.row : mapped.row;
      const c = typeof q.col === 'number' ? q.col : mapped.col;
      return { q, row: r, col: c };
    });
  }, [quadrants]);

  // —— 中等收入陷阱：人均 GDP 折线 option ——
  const mitOption = useMemo(() => {
    if (!mit) return null;
    const traj = Array.isArray(mit.trajectory) ? mit.trajectory : [];
    const pts = traj
      .map((d) => {
        if (Array.isArray(d)) return { year: d[0], value: d[1] };
        return { year: d?.year ?? d?.x, value: d?.value ?? d?.gdp ?? d?.y };
      })
      .filter((d) => d.year != null && typeof d.value === 'number' && isFinite(d.value));
    if (!pts.length) return null;
    const years = pts.map((d) => String(d.year));
    const vals = pts.map((d) => d.value);
    const last = pts[pts.length - 1];
    const threshold = typeof mit.highThreshold === 'number'
      ? mit.highThreshold
      : (typeof mit.highIncomeLine === 'number' ? mit.highIncomeLine : HIGH_INCOME_LINE);
    return {
      grid: { left: 56, right: 24, top: 22, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        ...CHART_TOOLTIP,
        formatter: (ps) => {
          const p = ps && ps[0];
          if (!p) return '';
          return `${p.axisValue}<br/>人均 GDP ${Number(p.data).toLocaleString()} 美元`;
        },
      },
      xAxis: {
        ...categoryX(years, { interval: Math.max(0, Math.floor(years.length / 7)) }),
        boundaryGap: false,
        axisTick: { show: false },
      },
      yAxis: {
        ...valueY({
          scale: true,
          axisLabel: {
            formatter: (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)),
          },
        }),
      },
      series: [{
        type: 'line', data: vals, smooth: true, symbol: 'none',
        lineStyle: { width: 2, color: TEAL },
        areaStyle: { color: `${TEAL}1f` },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { type: 'dashed', color: CIN, opacity: 0.75 },
          label: { color: CIN, fontSize: 10, formatter: `高收入门槛 ${(threshold / 1000).toFixed(0)}k` },
          data: [{ yAxis: threshold }],
        },
        markPoint: {
          symbol: 'circle', symbolSize: 9,
          itemStyle: { color: TEAL },
          label: { color: 'var(--text-primary)', fontSize: 10, formatter: '当前' },
          data: [{ coord: [String(last.year), last.value] }],
        },
      }],
    };
  }, [mit]);

  const gapPct = mit && (typeof mit.gapPct === 'number' || typeof mit.gapPct === 'string')
    ? mit.gapPct : null;
  const risks = mit && Array.isArray(mit.risks) ? mit.risks : [];
  const edges = mit && Array.isArray(mit.edges) ? mit.edges : [];

  const hasAny = quadrants.length || kondratiev || mit;

  return (
    <Card className="os-card">
      <BandHead n="↻" title="历史周期对照 · 我们在周期的哪一格" en="CYCLE POSITIONING" />

      {/* —— 合成研判条：时钟 / 长波 / 阶段 三句 —— */}
      {summary && Array.isArray(summary.lines) && summary.lines.length > 0 && (
        <div
          className="flex flex-col gap-2 rounded-md px-4 py-3 mt-3 mb-5"
          style={{ background: `${INDIGO}10`, borderLeft: `3px solid ${INDIGO}` }}
        >
          {summary.lines.map((ln, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-1 shrink-0"><SignalDot signal="amber" /></span>
              <p className="text-xs leading-relaxed min-w-0" style={{ color: 'var(--text-secondary)' }}>
                <span
                  className="mono text-[10px] font-semibold mr-1.5 px-1 py-0.5 rounded align-middle"
                  style={{ background: `${ln.color}1f`, color: ln.color }}
                >
                  {ln.label}
                </span>
                {ln.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {!hasAny && (
        <p className="text-xs mono mt-3" style={{ color: 'var(--text-tertiary)' }}>// 周期数据待载</p>
      )}

      {/* ===== a. 美林时钟 ===== */}
      {quadrants.length > 0 && (
        <div className="mb-7">
          <div className="text-[11px] mono mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
            美林投资时钟 · 增长 × 通胀四象限
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: '1fr 1fr', gap: 8, position: 'relative' }}
          >
            {gridCells.map(({ q, row, col }) => {
              const active = activeQuad ? q.id === activeQuad.id : false;
              const qc = q.color || (active ? CIN : 'var(--text-tertiary)');
              return (
                <div
                  key={q.id ?? `${row}-${col}`}
                  className="os-card p-3 relative"
                  style={{
                    gridRow: row + 1,
                    gridColumn: col + 1,
                    minHeight: 92,
                    background: active ? `${qc}14` : 'var(--bg-elevated)',
                    border: `1px solid ${active ? qc : 'var(--border-subtle)'}`,
                    boxShadow: active ? `0 0 0 1px ${qc}55, 0 0 16px -4px ${qc}66` : 'none',
                  }}
                >
                  {/* 脉冲点（仅当前象限） */}
                  {active && (
                    <span
                      className="cycle-pulse"
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 8, height: 8, borderRadius: '50%', background: qc,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="text-sm font-semibold leading-tight" style={{ color: active ? qc : 'var(--text-primary)' }}>
                    {q.label}
                  </div>
                  {q.tag && (
                    <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {q.tag}
                    </div>
                  )}
                  {q.desc && (
                    <p className="text-[11px] leading-snug mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                      {q.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 中心研判：当前象限 */}
          {pos && (
            <div
              className="rounded-md px-4 py-3 mt-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>当前 ·</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: activeQuad?.color || CIN }}
                >
                  {pos.label || activeQuad?.label || '—'}
                </span>
              </div>
              {pos.text && (
                <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                  {pos.text}
                </p>
              )}
              {Array.isArray(pos.evidence) && pos.evidence.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  {pos.evidence.map((e, i) => (
                    <Chip key={i} color={OCHRE}>{typeof e === 'string' ? e : (e?.label ?? '')}</Chip>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== b. 康波长波 ===== */}
      {kondratiev && (
        <div className="mb-7">
          <div className="text-[11px] mono mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
            康德拉季耶夫长波 · 五十年技术革命周期
          </div>
          <div
            className="rounded-md px-4 py-4"
            style={{
              background: `${seasonColorOf(kondratiev)}10`,
              borderLeft: `3px solid ${seasonColorOf(kondratiev)}`,
            }}
          >
            <div className="flex items-baseline gap-3 flex-wrap">
              {/* 季相字号自适应：单字大字，长描述串中字防溢出 */}
              <span
                className="font-bold leading-tight"
                style={{
                  fontSize: String(kondratiev.season || '').length <= 2 ? 34 : 20,
                  color: seasonColorOf(kondratiev),
                }}
              >
                {kondratiev.season || '—'}
              </span>
              {kondratiev.phase && (
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {kondratiev.phase}
                </span>
              )}
              {kondratiev.wave && (
                <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  {kondratiev.wave}
                </span>
              )}
            </div>
            {kondratiev.text && (
              <p className="text-xs leading-relaxed mt-2.5" style={{ color: 'var(--text-secondary)' }}>
                {kondratiev.text}
              </p>
            )}
            {Array.isArray(kondratiev.seedTech) && kondratiev.seedTech.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                <span className="mono text-[10px] mr-0.5" style={{ color: 'var(--text-tertiary)' }}>主导技术</span>
                {kondratiev.seedTech.map((t, i) => (
                  <Chip key={i} color={seasonColorOf(kondratiev)}>{typeof t === 'string' ? t : (t?.label ?? '')}</Chip>
                ))}
              </div>
            )}
            {kondratiev.nextWave && (
              <p className="text-[11px] leading-relaxed mt-2.5" style={{ color: 'var(--text-tertiary)' }}>
                下一程 · {kondratiev.nextWave}
              </p>
            )}
            <CrossLink to="/cognition" label="康波周期模块" />
          </div>
        </div>
      )}

      {/* ===== c. 中等收入陷阱 ===== */}
      {mit && (
        <div className="mb-2">
          <div className="text-[11px] mono mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
            中等收入陷阱 · 人均 GDP 攀越高收入门槛
          </div>

          {/* gapPct 大数 */}
          {gapPct != null && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="mono text-3xl font-bold" style={{ color: OCHRE }}>
                {typeof gapPct === 'number' ? `${gapPct}%` : gapPct}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                {mit.gapLabel || '距高收入门槛缺口（示意）'}
              </span>
            </div>
          )}

          {/* 折线 */}
          {mitOption ? (
            <EChart option={mitOption} style={{ height: 260 }} />
          ) : (
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 轨迹数据待载</p>
          )}

          {/* risks / edges 双列 */}
          {(risks.length > 0 || edges.length > 0) && (
            <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="os-card p-3" style={{ borderTop: `2px solid ${CIN}` }}>
                <div className="text-[11px] font-semibold mb-2" style={{ color: CIN }}>陷阱风险</div>
                {risks.length ? (
                  <ul className="flex flex-col gap-1.5">
                    {risks.map((r, i) => (
                      <li key={i} className="text-[11px] leading-snug flex gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: CIN }}>·</span>
                        <span>{typeof r === 'string' ? r : (r?.label ?? '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>—</span>
                )}
              </div>
              <div className="os-card p-3" style={{ borderTop: `2px solid ${TEAL}` }}>
                <div className="text-[11px] font-semibold mb-2" style={{ color: TEAL }}>跨越优势</div>
                {edges.length ? (
                  <ul className="flex flex-col gap-1.5">
                    {edges.map((e, i) => (
                      <li key={i} className="text-[11px] leading-snug flex gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: TEAL }}>·</span>
                        <span>{typeof e === 'string' ? e : (e?.label ?? '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>—</span>
                )}
              </div>
            </div>
          )}

          {/* verdict */}
          {mit.verdict && (
            <p className="text-xs leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
              {mit.verdict}
            </p>
          )}

          <CrossLink to="/middleincometrap" label="中等收入陷阱模块" />
        </div>
      )}

      {/* —— 统一口径小字 —— */}
      <p className="mt-6 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>

      {/* 脉冲点动画（局部 style，无外部依赖） */}
      <style>{`
        @keyframes cyclePulse {
          0% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
          70% { box-shadow: 0 0 0 7px transparent; opacity: 0.85; }
          100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
        }
        .cycle-pulse { animation: cyclePulse 2s ease-out infinite; }
      `}</style>
    </Card>
  );
}
