import React from 'react';
import { CrossLinks, Grid } from '../../app/ui.jsx';
import { getCrossLinks } from './moduleCrossLinks.js';

/** 专题页统一 intro 卡片 */
export function IntroCard({ children, className = 'mb-6' }) {
  return (
    <div className={`os-card p-5 ${className}`}>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</p>
    </div>
  );
}

/** pill 选择器条 */
export function SelectorBar({ items, activeKey, onSelect, getKey = (i) => i.key, getLabel = (i) => i.label || i.name, getAccent = (i) => i.accent || i.color || 'var(--china-red)' }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((item) => {
        const key = getKey(item);
        const active = key === activeKey;
        const accent = getAccent(item);
        return (
          <button key={key} type="button" onClick={() => onSelect(key)} className="text-xs px-3 py-1.5 rounded mono"
            style={{
              background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
              color: active ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${active ? accent : 'var(--border-subtle)'}`,
              cursor: 'pointer', transition: 'all .15s',
            }}>{getLabel(item)}</button>
        );
      })}
    </div>
  );
}

/** 阶段时间线选择器（可展开详情面板） */
export function TimelineBar({ stages, activeIdx, onSelect, renderDetail }) {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {stages.map((st, i) => {
          const active = i === activeIdx;
          const accent = st.accent || st.color || 'var(--china-red)';
          return (
            <button key={st.period || st.label || i} type="button" onClick={() => onSelect(i)} className="text-xs px-3 py-1.5 rounded mono flex-1"
              style={{
                minWidth: 120,
                background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
                color: active ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${active ? accent : 'var(--border-subtle)'}`,
                cursor: 'pointer', transition: 'all .15s', textAlign: 'left',
              }}>
              {(st.period || st.range) && <div style={{ color: active ? accent : 'var(--text-tertiary)' }}>{st.period || st.range}</div>}
              <div>{st.title || st.label}</div>
            </button>
          );
        })}
      </div>
      {renderDetail ? renderDetail(stages[activeIdx], activeIdx) : (
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${stages[activeIdx]?.accent || stages[activeIdx]?.color || 'var(--china-red)'}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {[stages[activeIdx]?.period, stages[activeIdx]?.title].filter(Boolean).join(' · ')}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{stages[activeIdx]?.desc}</p>
        </div>
      )}
    </>
  );
}

/** 三框架卡：盐铁逻辑 / 摸石头 / 升级路径（标题可定制） */
export function FrameworkTrio({ cards }) {
  const defaults = [
    { key: 'salt', title: '盐铁逻辑', subtitle: '命脉垄断 · 维稳底盘', accent: 'var(--fire-gold)', border: 'var(--fire-gold)' },
    { key: 'stone', title: '摸石头方法论', subtitle: '试点 · 灰度 · 迭代', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)' },
    { key: 'path', title: '升级路径', subtitle: '从存量到增量', accent: 'var(--china-red)', border: 'var(--china-red)' },
  ];
  const merged = defaults.map((d, i) => ({ ...d, ...(cards[i] || cards[d.key] || {}) }));
  return (
    <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      {merged.map((c) => (
        <div key={c.key} className="os-card p-5" style={{ background: 'var(--bg-surface)', borderLeft: `3px solid ${c.border}` }}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-semibold" style={{ color: c.accent }}>{c.title}</span>
            {c.subtitle && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{c.subtitle}</span>}
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{c.body}</p>
          {c.pillars?.length > 0 && (
            <Grid cols={c.pillars.length >= 3 ? 3 : c.pillars.length}>
              {c.pillars.map(([t, d]) => (
                <div key={t}>
                  <div className="text-xs font-semibold mb-1" style={{ color: c.accent }}>{t}</div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </Grid>
          )}
        </div>
      ))}
    </div>
  );
}

/** 页脚：CrossLinks + 免责声明 */
export function ModuleFooter({ moduleId, links, disclaimer, sourceNote }) {
  const resolved = links ?? getCrossLinks(moduleId);
  const text = disclaimer ?? '公开资料整理，示意非官方 · 仅供分析框架参考，非投资建议';
  return (
    <>
      {resolved.length > 0 && <CrossLinks className="mb-4" links={resolved} />}
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        {text}{sourceNote ? ` · ${sourceNote}` : ''}
      </p>
    </>
  );
}
