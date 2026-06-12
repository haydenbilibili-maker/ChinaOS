import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CrossLinks, Grid, Stat } from '../../app/ui.jsx';
import { FrameworkTrio } from '../shared/ModuleParadigm.jsx';
import {
  VOLUMES, CANONICAL_ORDER, REGIME, REGIME_TAG, VOL_LINKS, getVolume, wordEstimate, getLayerCode, getPrevNextVol,
} from './volumes.js';

const PROGRESS_KEY = 'civilization-read-progress';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}

function saveProgress(id, pct) {
  try {
    const p = loadProgress();
    p[id] = Math.max(p[id] || 0, Math.round(pct));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch { /* private mode */ }
}

function TocNav({ sections, activeId, color }) {
  return (
    <nav className="space-y-1">
      {sections.map((s) => {
        const on = s.id === activeId;
        return (
          <a key={s.id} href={`#${s.id}`}
            className="block text-xs px-3 py-2 rounded transition-colors mono"
            style={{
              color: on ? '#fff' : 'var(--text-secondary)',
              background: on ? `${color}33` : 'transparent',
              borderLeft: `2px solid ${on ? color : 'transparent'}`,
            }}>
            {s.title}
          </a>
        );
      })}
    </nav>
  );
}

export default function VolumeDetail() {
  const { volId } = useParams();
  const navigate = useNavigate();
  const vol = getVolume(volId);
  const [activeSec, setActiveSec] = useState(null);
  const [scrollPct, setScrollPct] = useState(0);

  const allSections = useMemo(() => {
    if (!vol) return [];
    const fw = (vol.frameworks || []).map((f, i) => ({
      id: `fw-${i}`, title: `框架 · ${f.title}`, isFramework: true,
    }));
    return [...fw, ...(vol.sections || [])];
  }, [vol]);

  const [rtag, rcolor] = vol ? REGIME_TAG[REGIME[vol.id]] : ['', '#64748b'];
  const progress = loadProgress()[volId] || 0;
  const words = vol ? wordEstimate(vol) : 0;

  const prevNext = useMemo(() => getPrevNextVol(volId), [volId]);
  const layerCode = vol ? getLayerCode(vol.role) : '';

  useEffect(() => {
    if (!vol) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]?.target?.id) setActiveSec(vis[0].target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );
    allSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [vol, allSections]);

  useEffect(() => {
    if (!vol) return undefined;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      setScrollPct(pct);
      saveProgress(volId, pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [vol, volId]);

  if (!vol) {
    return (
      <div className="py-20 text-center">
        <p className="mono text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>// 未找到该卷 · {volId}</p>
        <Link to="/civilization" className="text-sm mono" style={{ color: 'var(--cyber-cyan)' }}>← 返回文明透视</Link>
      </div>
    );
  }

  return (
    <div>
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: 'var(--bg-base)' }}>
        <div style={{ width: `${scrollPct}%`, height: '100%', background: vol.color, transition: 'width .1s' }} />
      </div>

      {/* 顶栏 */}
      <div className="mb-6 pb-4 border-b flex flex-wrap items-start justify-between gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <Link to="/civilization" className="text-xs mono inline-flex items-center gap-1 mb-2" style={{ color: 'var(--cyber-cyan)' }}>
            ← 文明透视 · 逐卷精读
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.14)', color: 'var(--china-red)' }}>
              全文报告
            </span>
            {prevNext.index >= 0 && (
              <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>
                栈序 {prevNext.index + 1}/{prevNext.total}
              </span>
            )}
            {layerCode && (
              <span className="text-[10px] mono px-2 py-0.5 rounded font-semibold" style={{ background: `${vol.color}22`, color: vol.color, border: `1px solid ${vol.color}44` }}>{layerCode}</span>
            )}
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: vol.color }}>{vol.role}</span>
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${rcolor}1a`, color: rcolor }}>{rtag}</span>
          </div>
          <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{vol.num} · {vol.title}</h1>
          <p className="text-sm mt-1.5 leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>{vol.thesis}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {vol.tags?.map((t) => (
            <span key={t} className="text-[10px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{t}</span>
          ))}
        </div>
      </div>

      <Grid cols={4} className="mb-6">
        <Stat value={vol.sections?.length || 0} label="正文章节" accent={vol.color} />
        <Stat value={`${words}`} label="字数约" accent="#22d3ee" />
        <Stat value={`${Math.max(progress, Math.round(scrollPct))}%`} label="阅读进度" accent="#10b981" />
        <Stat value={vol.frameworks?.length || 0} label="框架卡" accent="#e8a317" />
      </Grid>

      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'minmax(180px, 220px) 1fr' }}>
        {/* TOC 侧栏 */}
        <aside className="hidden md:block">
          <div className="sticky" style={{ top: 16 }}>
            <Card title="目录">
              <TocNav sections={allSections} activeId={activeSec} color={vol.color} />
            </Card>
            <Card title="卷序导航" className="mt-3">
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {CANONICAL_ORDER.map((id, i) => {
                  const v = VOLUMES[id];
                  const on = id === volId;
                  const lc = getLayerCode(v.role);
                  return (
                    <Link key={id} to={`/civilization/v/${id}`}
                      className="flex items-center gap-2 text-[11px] mono px-2 py-1.5 rounded"
                      style={{
                        color: on ? '#fff' : 'var(--text-secondary)',
                        background: on ? `${vol.color}33` : 'transparent',
                        borderLeft: `2px solid ${on ? vol.color : 'transparent'}`,
                      }}>
                      <span style={{ color: on ? vol.color : 'var(--text-tertiary)', width: 14 }}>{i + 1}</span>
                      {lc && <span style={{ color: v.color, fontSize: 10 }}>{lc}</span>}
                      <span className="truncate">{v.num}</span>
                    </Link>
                  );
                })}
              </div>
            </Card>
            <div className="mt-3 space-y-1">
              {prevNext.prev && (
                <button type="button" onClick={() => navigate(`/civilization/v/${prevNext.prev}`)}
                  className="w-full text-left text-xs mono px-3 py-2 rounded"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  ← {VOLUMES[prevNext.prev].num}
                </button>
              )}
              {prevNext.next && (
                <button type="button" onClick={() => navigate(`/civilization/v/${prevNext.next}`)}
                  className="w-full text-left text-xs mono px-3 py-2 rounded"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  {VOLUMES[prevNext.next].num} →
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* 正文 */}
        <article className="os-prose">
          {vol.frameworks?.length > 0 && (
            <div id="fw-block" className="mb-8">
              <FrameworkTrio cards={vol.frameworks} />
            </div>
          )}

          <div className="space-y-8">
            {vol.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-20">
                <Card>
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ width: 4, height: 28, background: vol.color, borderRadius: 2, flexShrink: 0 }} />
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{sec.title}</h2>
                      {sec.lead && <p className="text-xs mt-0.5 mono" style={{ color: vol.color }}>{sec.lead}</p>}
                    </div>
                  </div>
                  <div className="space-y-3 os-prose">
                    {sec.body.map((p, i) => (
                      <p key={i} className="prose-p">{p}</p>
                    ))}
                  </div>
                  {sec.cards?.length > 0 && (
                    <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      {sec.cards.map((c) => (
                        <div key={c.title} className="rounded-lg p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent || vol.color}` }}>
                          <div className="text-sm font-semibold mb-1" style={{ color: c.accent || vol.color }}>{c.title}</div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{c.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </section>
            ))}
          </div>

          {VOL_LINKS[vol.id] && (
            <div className="mt-8">
              <CrossLinks title={`${vol.num} · 现实接口 · 叠读业务模块`} links={VOL_LINKS[vol.id]} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2 justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <Link to="/civilization" className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>← 返回列表</Link>
            <div className="flex gap-2">
              {prevNext.prev && (
                <button type="button" onClick={() => navigate(`/civilization/v/${prevNext.prev}`)}
                  className="text-xs mono px-3 py-1.5 rounded"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  ← {VOLUMES[prevNext.prev].num}
                </button>
              )}
              {prevNext.next && (
                <button type="button" onClick={() => navigate(`/civilization/v/${prevNext.next}`)}
                  className="text-xs mono px-3 py-1.5 rounded"
                  style={{ background: `${vol.color}22`, color: '#fff', border: `1px solid ${vol.color}`, cursor: 'pointer' }}>
                  {VOLUMES[prevNext.next].num} →
                </button>
              )}
            </div>
          </div>

          <p className="text-xs mt-6 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            思想史与制度隐喻梳理，非历史决定论 · 内容迁自 civilization-*.html 独立报告并内嵌至 React 全文视图
          </p>
        </article>
      </div>
    </div>
  );
}
