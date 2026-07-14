import React, { useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import {
  FIVE_YEAR_PLANS, planTally,
} from './econCycle.js';
import {
  ECON_COLORS, BandHead, Meter,
} from './econUI.jsx';

// ============================================================================
// 五年规划目标达成度（SectionFiveYear · Round6）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接取 FIVE_YEAR_PLANS（确定性 seed，基准日 '2026-07-14'），
// 主线程 Page.jsx import 后 <SectionFiveYear/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 ◷ 标题区
//   · planTally(current) 汇总：达标率大数 + 达标/接近/滞后三色计数
//   · 十四五 targets 列表：name + binding 徽章（约束性朱砂/预期性灰）
//       + target→latest + Meter(progress) + progress% + note 小字
//   · 十五五 outlook：next.outlook 卡片网格（name + aim），标「2026–2030 展望」
//   · 卡尾口径小字「目标为公开规划纲要口径，达成度为示意估算，以官方发布为准」。
//   · 容错：数据缺失逐块回退、零随机。
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS。
// 口径：目标用公开规划纲要口径，达成度为示意/估算，以官方发布为准。
// ============================================================================

const DISCLAIMER = '目标为公开规划纲要口径，达成度为示意估算，以官方发布为准 —— 非投资建议 · 非预测';

const C = ECON_COLORS || {};
const CIN = C.cinnabar || '#c44e3d';
const TEAL = C.teal || '#62a89e';
const OCHRE = C.ochre || '#c99a4e';
const INDIGO = C.indigo || '#8090c6';

// 进度状态 → 颜色 + Meter 渐变端点。达标 teal / 接近 ochre / 滞后 cinnabar。
function statusStyle(status) {
  if (status === '滞后' || status === 'lag' || status === 'behind') {
    return { color: CIN, from: OCHRE, to: CIN };
  }
  if (status === '接近' || status === 'near' || status === 'close') {
    return { color: OCHRE, from: OCHRE, to: OCHRE };
  }
  // 默认按达标
  return { color: TEAL, from: TEAL, to: TEAL };
}

// 由 progress 推断状态（econCycle 未直接给 status 时回退）
function deriveStatus(t) {
  if (t && t.status) return t.status;
  const p = typeof t?.progress === 'number' ? t.progress : null;
  if (p == null) return '—';
  if (p >= 100) return '达标';
  if (p >= 85) return '接近';
  return '滞后';
}

// 约束性 / 预期性徽章。约束性朱砂、预期性灰。
function BindingBadge({ binding }) {
  const isBinding = binding === '约束性' || binding === 'binding' || binding === true;
  const color = isBinding ? CIN : 'var(--text-tertiary)';
  const label = isBinding ? '约束性' : (typeof binding === 'string' && binding ? binding : '预期性');
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded mono font-semibold shrink-0"
      style={{
        background: isBinding ? `${CIN}1f` : 'var(--bg-elevated)',
        border: `1px solid ${isBinding ? CIN : 'var(--border-subtle)'}`,
        color,
      }}
    >
      {label}
    </span>
  );
}

export default function SectionFiveYear() {
  const plans = FIVE_YEAR_PLANS && typeof FIVE_YEAR_PLANS === 'object' ? FIVE_YEAR_PLANS : null;
  const current = plans && plans.current && typeof plans.current === 'object' ? plans.current : null;
  const next = plans && plans.next && typeof plans.next === 'object' ? plans.next : null;

  const targets = current && Array.isArray(current.targets) ? current.targets : [];
  const outlooks = next && Array.isArray(next.outlook) ? next.outlook : [];

  // 规划名 / 时段：econCycle 用 id 作规划名、span 作时段；兼容 name 容错。
  const curName = current ? (current.name || current.id || '十四五') : '十四五';
  const curSpan = current?.span || null;
  const nextName = next ? (next.name || next.id || '十五五') : '十五五';
  const nextSpan = next?.span || '2026–2030';

  // —— 汇总 ——
  const tally = useMemo(() => {
    if (!current) return null;
    try {
      const t = typeof planTally === 'function' ? planTally(current) : null;
      if (t && typeof t === 'object') return t;
    } catch { /* 回退到本地推断 */ }
    // 本地兜底：按 targets 逐条状态计数（键名与 econCycle.planTally 对齐）
    if (!targets.length) return null;
    let hit = 0, near = 0, lag = 0;
    for (const t of targets) {
      const s = deriveStatus(t);
      if (s === '达标') hit += 1;
      else if (s === '接近') near += 1;
      else lag += 1;
    }
    const total = targets.length;
    return {
      total,
      '达标': hit, '接近': near, '滞后': lag,
      rate: total ? Math.round((hit / total) * 1000) / 10 : 0,
    };
  }, [current, targets]);

  // econCycle.planTally 返回 {total, 达标, 接近, 滞后, rate, text}；兼容旧字段名容错。
  const hitRate = tally
    ? (tally.rate ?? tally.hitRate ?? null)
    : null;
  const hitCount = tally ? (tally['达标'] ?? tally.hit ?? tally.onTrack ?? tally.met ?? 0) : 0;
  const nearCount = tally ? (tally['接近'] ?? tally.near ?? tally.close ?? 0) : 0;
  const lagCount = tally ? (tally['滞后'] ?? tally.lag ?? tally.behind ?? 0) : 0;

  const hasAny = current || next;

  return (
    <Card className="os-card">
      <BandHead n="◷" title="五年规划目标达成度" en="FIVE-YEAR PLAN TRACKER" />

      {!hasAny && (
        <p className="text-xs mono mt-3" style={{ color: 'var(--text-tertiary)' }}>// 规划数据待载</p>
      )}

      {/* —— 汇总：达标率大数 + 三色计数 —— */}
      {tally && (
        <div
          className="flex items-center gap-5 flex-wrap rounded-md px-4 py-3.5 mt-3 mb-5"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="mono text-4xl font-bold leading-none" style={{ color: TEAL }}>
              {hitRate != null ? hitRate : '—'}
            </span>
            {hitRate != null && <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>%</span>}
            <span className="text-[11px] ml-1.5 self-end" style={{ color: 'var(--text-tertiary)' }}>
              达标率
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <CountChip color={TEAL} label="达标" n={hitCount} />
            <CountChip color={OCHRE} label="接近" n={nearCount} />
            <CountChip color={CIN} label="滞后" n={lagCount} />
          </div>
          <span className="mono text-[11px] ml-auto" style={{ color: 'var(--text-tertiary)' }}>
            {curName}{curSpan ? ` · ${curSpan}` : ''}
          </span>
        </div>
      )}

      {/* —— 十四五 targets 列表 —— */}
      {targets.length > 0 && (
        <div className="mb-7">
          <div className="text-[11px] mono mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
            {curName} · 主要指标进度
          </div>
          <div className="flex flex-col gap-3">
            {targets.map((t, i) => {
              const status = deriveStatus(t);
              const st = statusStyle(status);
              const progress = typeof t.progress === 'number' ? t.progress : 0;
              return (
                <div key={t.id ?? t.name ?? i} className="os-card p-3">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {t.name || '—'}
                      </span>
                      <BindingBadge binding={t.binding} />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(t.target != null || t.latest != null) && (
                        <span className="mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          {t.latest != null ? t.latest : '—'}
                          <span style={{ color: 'var(--text-tertiary)' }}> / 目标 </span>
                          {t.target != null ? t.target : '—'}
                        </span>
                      )}
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded mono font-semibold"
                        style={{ background: `${st.color}1f`, color: st.color }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Meter value={progress} from={st.from} to={st.to} />
                    </div>
                    <span className="mono text-[11px] shrink-0 w-10 text-right" style={{ color: st.color }}>
                      {typeof t.progress === 'number' ? `${Math.round(t.progress)}%` : '—'}
                    </span>
                  </div>
                  {t.note && (
                    <div className="text-[10px] mt-1.5 leading-snug" style={{ color: 'var(--text-tertiary)' }}>
                      {t.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* —— 十五五 outlook —— */}
      {outlooks.length > 0 && (
        <div className="mb-2">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
              {nextName} 展望
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded mono"
              style={{ background: `${INDIGO}14`, border: `1px solid ${INDIGO}40`, color: INDIGO }}
            >
              {nextSpan} 展望
            </span>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {outlooks.map((o, i) => (
              <div
                key={o.id ?? o.name ?? i}
                className="os-card p-3"
                style={{ borderLeft: `2px solid ${INDIGO}` }}
              >
                <div className="text-sm font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {o.name || '—'}
                </div>
                {o.aim && (
                  <p className="text-[11px] leading-snug mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {o.aim}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* —— 统一口径小字 —— */}
      <p className="mt-6 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}

// 三色计数 chip（达标/接近/滞后）
function CountChip({ color, label, n }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block' }} aria-hidden="true" />
      <span className="mono text-base font-semibold" style={{ color }}>{n ?? 0}</span>
      <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
    </span>
  );
}
