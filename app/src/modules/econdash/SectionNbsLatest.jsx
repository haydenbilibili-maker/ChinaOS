import React, { useState, useMemo } from 'react';
import { NBS_SOURCE_URL, NBS_LATEST, useNbsLatest, nbsStat } from './liveNbs.js';
import { ECON_COLORS, BandHead, SignalDot } from './econUI.jsx';
import { Link } from 'react-router-dom';

// ============================================================================
// 国家统计局最新数据 · 2025 年度 / 2026 年初（SectionNbsLatest）
// ----------------------------------------------------------------------------
// 自包含 Section：内部用 useNbsLatest（探针直连 + 始终展示快照），主线程
// Page.jsx import 后 <SectionNbsLatest/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 ⊞ 标题区
//   · 接入状态条：degraded 时诚实说明 NBS 浏览器端无 CORS、已回退最新公开口径
//     快照，并给出官网外链按钮（→ 国家统计局·年度数据）。
//   · group 筛选 chips + 指标卡网格：label + value+unit 大数 + period 徽章
//     （年度赭 / 月度青）+ yoy 着色 + source 小字。
//   · 卡尾统一口径小字。容错：数据缺失回退、零随机、不崩。
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测；以国家统计局发布为准。
// ============================================================================

const FOOT =
  '国家统计局公开口径快照 · 以官方发布为准 · 非投资建议 · 非预测';

// group 展示顺序（与 NBS_GROUPS 对齐，UI 用作 chip 排序）
const GROUP_ORDER = ['增长', '产业', '物价', '就业', '投资消费', '对外', '人口'];

// 月度 period 识别：含「月」字即月度（青徽章），否则年度（赭徽章）
function isMonthly(period) {
  return typeof period === 'string' && period.indexOf('月') >= 0;
}

// 同比方向 → 着色（升=青，降=朱砂，平/无=次级文字色）
function yoyStyle(yoy) {
  const C = ECON_COLORS || {};
  if (yoy == null || Number.isNaN(Number(yoy))) {
    return { text: '', color: 'var(--text-tertiary)' };
  }
  const n = Number(yoy);
  if (n > 0) return { text: `同比 +${n.toFixed(1)}%`, color: C.teal || '#62a89e' };
  if (n < 0) return { text: `同比 ${n.toFixed(1)}%`, color: C.cinnabar || '#c44e3d' };
  return { text: '同比 0.0%', color: 'var(--text-tertiary)' };
}

// 指标卡（容错：缺值回退 —）
function NbsCard({ item }) {
  const C = ECON_COLORS || {};
  if (!item) return null;
  const monthly = isMonthly(item.period);
  const badgeColor = monthly ? (C.teal || '#62a89e') : (C.ochre || '#c99a4e');
  const yoy = yoyStyle(item.yoy);
  return (
    <div className="os-card p-4" style={{ position: 'relative' }}>
      {/* period 徽章：年度赭 / 月度青 */}
      <span
        className="mono text-[10px] px-1.5 py-0.5 rounded"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: badgeColor,
          border: `1px solid ${badgeColor}66`,
          background: `${badgeColor}14`,
        }}
      >
        {item.period || '—'}
      </span>

      <div
        className="text-sm font-semibold leading-tight pr-16"
        style={{ color: 'var(--text-primary)' }}
      >
        {item.label || '—'}
      </div>

      <div className="mono text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
        {nbsStat(item.value, item.unit)}
      </div>

      {yoy.text && (
        <div className="mono text-[11px] mt-1" style={{ color: yoy.color }}>
          {yoy.text}
        </div>
      )}

      <div
        className="mono text-[10px] mt-2 pt-2"
        style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}
      >
        {item.source || '国家统计局'}
      </div>
    </div>
  );
}

export default function SectionNbsLatest() {
  const { items, degraded, reason, fetchedAt } = useNbsLatest();
  const list = Array.isArray(items) ? items : [];

  // 实际出现的 group（按 GROUP_ORDER 排序，未在序中的追加末尾）
  const groups = useMemo(() => {
    const seen = [];
    list.forEach((it) => {
      if (it && it.group && seen.indexOf(it.group) < 0) seen.push(it.group);
    });
    seen.sort((a, b) => {
      const ia = GROUP_ORDER.indexOf(a);
      const ib = GROUP_ORDER.indexOf(b);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
    return seen;
  }, [list]);

  // 筛选态：'全部' 或某个 group
  const [filter, setFilter] = useState('全部');
  const shown = useMemo(() => {
    if (filter === '全部') return list;
    return list.filter((it) => it && it.group === filter);
  }, [list, filter]);

  const C = ECON_COLORS || {};
  const chip = (active) => ({
    background: active ? `${C.indigo || '#8090c6'}1f` : 'var(--bg-elevated)',
    border: `1px solid ${active ? (C.indigo || '#8090c6') : 'var(--border-subtle)'}`,
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
  });

  return (
    <section>
      <BandHead n="⊞" title="国家统计局最新数据 · 2025 年度 / 2026 年初" en="NBS LATEST" />

      {/* 接入状态条 —— 诚实说明直连降级 */}
      <div
        className="os-card p-3 mb-4 flex items-start gap-3 flex-wrap"
        style={{ borderLeft: `3px solid ${degraded ? (C.ochre || '#c99a4e') : (C.teal || '#62a89e')}` }}
      >
        <span className="mt-0.5 shrink-0">
          <SignalDot signal={degraded ? 'amber' : 'green'} />
        </span>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {degraded ? (
              <>
                直连状态：国家统计局站点浏览器端无 CORS，已回退最新公开口径快照
                （{reason || 'NBS 浏览器端无 CORS · 直连受限'}）；可在
                {' '}
                <Link
                  to="/foundation?tab=econ"
                  className="underline underline-offset-2"
                  style={{ color: C.indigo || '#8090c6' }}
                >
                  『数据底座 · 经济数据』
                </Link>
                {' '}
                粘贴官网序列接入最新值。
              </>
            ) : (
              <>已直连国家统计局（{reason || '直连成功'}）；下列仍以公开口径快照展示，以官方发布为准。</>
            )}
          </div>
          {fetchedAt && (
            <div className="mono text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
              直连探针：{fetchedAt.toLocaleString('zh-CN', { hour12: false })}
            </div>
          )}
        </div>
        <a
          href={NBS_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-[11px] px-2.5 py-1 rounded shrink-0"
          style={{
            color: C.indigo || '#8090c6',
            border: `1px solid ${(C.indigo || '#8090c6')}66`,
            background: `${(C.indigo || '#8090c6')}14`,
            textDecoration: 'none',
          }}
        >
          → 国家统计局·年度数据
        </a>
      </div>

      {/* group 筛选 chips */}
      {groups.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <button
            type="button"
            onClick={() => setFilter('全部')}
            className="mono text-[11px] px-2.5 py-1 rounded"
            style={chip(filter === '全部')}
          >
            全部
          </button>
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilter(g)}
              className="mono text-[11px] px-2.5 py-1 rounded"
              style={chip(filter === g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* 指标卡网格 */}
      {shown.length > 0 ? (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {shown.map((it) => (
            <NbsCard key={it && it.id ? it.id : Math.random()} item={it} />
          ))}
        </div>
      ) : (
        <div className="os-card p-4 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          暂无可展示的指标快照。
        </div>
      )}

      {/* 卡尾口径小字 */}
      <p className="text-[11px] leading-relaxed mt-3" style={{ color: 'var(--text-tertiary)' }}>
        {FOOT}
      </p>
    </section>
  );
}
