import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { TOOLS, CRISIS_DOMAINS, mitigatedImpact, compositeImpact, buildCrisisReport } from './crisisData.js';
import { HANDONG_TOOLS, HANDONG_DOMAINS } from './handongScenarios.js';
import { handongMitigatedImpact, handongComposite } from './handongEngine.js';

/**
 * 四件套复用组件：政策资源配置器 · 复合危机叠加 · 应对小组 · 治理报告
 * mode: 'national' | 'handong'
 */
export default function SandboxToolkit({
  mode = 'national',
  crises,
  crisisKey,
  setCrisisKey,
  secondCrisis,
  setSecondCrisis,
  intensity,
  setIntensity,
  alloc,
  setAlloc,
  figures,
  reportMd,
  setReportMd,
  reportCopied,
  setReportCopied,
  buildReport,
  title = '危机情景引擎',
  subtitle,
}) {
  const tools = mode === 'handong' ? HANDONG_TOOLS : TOOLS;
  const domains = mode === 'handong' ? HANDONG_DOMAINS : CRISIS_DOMAINS;

  const crisis = useMemo(() => {
    const A = crises[crisisKey];
    if (!A) return null;
    if (secondCrisis && secondCrisis !== crisisKey && crises[secondCrisis]) {
      return mode === 'handong'
        ? handongComposite(A, crises[secondCrisis], intensity)
        : compositeImpact(A, crises[secondCrisis], intensity);
    }
    return A;
  }, [crises, crisisKey, secondCrisis, intensity, mode]);

  const engine = useMemo(() => {
    if (!crisis) return null;
    return mode === 'handong'
      ? handongMitigatedImpact(crisis, intensity, alloc)
      : mitigatedImpact(crisis, intensity, alloc);
  }, [crisis, intensity, alloc, mode]);

  const team = useMemo(() => {
    if (!figures || !crisis?.talentKeywords) return [];
    return figures
      .map((f) => {
        const hay = [f.raw, f.org, f.fields?.title, ...(f.career || []).map((c) => c.desc)].filter(Boolean).join(' ');
        const hits = crisis.talentKeywords.filter((k) => hay.includes(k));
        return hits.length ? { name: f.name, title: f.fields?.title || f.org || f.role || '', score: hits.length, hits } : null;
      })
      .filter(Boolean)
      .sort((x, y) => y.score - x.score)
      .slice(0, 5);
  }, [figures, crisis]);

  const allocTotal = tools.reduce((sum, t) => sum + (alloc[t.id] || 0), 0);

  const crisisOption = useMemo(() => {
    if (!engine) return null;
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['应对前', '应对后'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 10 },
      grid: { left: 72, right: 24, top: 26, bottom: 16 },
      xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
      yAxis: { type: 'category', data: [...domains].reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
      series: [
        { name: '应对前', type: 'bar', barWidth: 8, data: [...engine.raw].reverse(), itemStyle: { color: 'rgba(196,30,58,0.35)', borderRadius: [0, 3, 3, 0] } },
        { name: '应对后', type: 'bar', barWidth: 8, data: [...engine.net].reverse(), itemStyle: { color: '#c41e3a', borderRadius: [0, 3, 3, 0] } },
      ],
    };
  }, [engine, domains]);

  if (!crisis || !engine) return null;

  const crisisVerdict = { tier: engine.verdict[0], color: engine.verdict[1], read: engine.verdict[2] };

  const genReport = () => {
    const md = buildReport
      ? buildReport({ crisis, engine, team, intensity, alloc })
      : buildCrisisReport({
        crisisLabel: crisis.label, intensity, alloc, raw: engine.raw, net: engine.net,
        score: engine.score, verdict: engine.verdict, team,
      });
    setReportMd(md);
    setReportCopied(false);
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportMd);
      setReportCopied(true);
      setTimeout(() => setReportCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="os-card p-5" style={{ borderColor: `${crisis.color}66` }}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <div className="text-[10px] mono uppercase tracking-wider" style={{ color: crisis.color }}>Sandbox Toolkit · 四件套</div>
          <h3 className="text-base font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>}
        </div>
        <span className="text-[11px] mono px-2.5 py-1 rounded" style={{ background: `${crisisVerdict.color}22`, color: crisisVerdict.color, border: `1px solid ${crisisVerdict.color}55` }}>
          总冲击 {engine.score} · {crisisVerdict.tier}
        </span>
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.keys(crises).map((k) => (
          <button key={k} type="button" onClick={() => setCrisisKey(k)} className="text-xs px-3 py-1 rounded mono"
            style={{
              background: k === crisisKey ? `${crises[k].color}26` : 'var(--bg-elevated)',
              color: k === crisisKey ? crises[k].color : 'var(--text-secondary)',
              border: k === crisisKey ? `1px solid ${crises[k].color}66` : '1px solid transparent', cursor: 'pointer',
            }}>
            {crises[k].label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>烈度 0—100</span>
        <input type="range" min={0} max={100} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
          style={{ width: '100%', accentColor: crisis.color }} />
        <span className="text-sm mono font-semibold w-10 text-right shrink-0" style={{ color: crisis.color }}>{intensity}</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-[11px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>叠加第二危机</span>
        <button type="button" onClick={() => setSecondCrisis('')} className="text-[10px] px-2 py-0.5 rounded mono"
          style={{ background: !secondCrisis ? 'rgba(148,163,184,0.18)' : 'var(--bg-elevated)', color: !secondCrisis ? 'var(--text-primary)' : 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>无</button>
        {Object.keys(crises).filter((k) => k !== crisisKey).map((k) => (
          <button key={k} type="button" onClick={() => setSecondCrisis(secondCrisis === k ? '' : k)} className="text-[10px] px-2 py-0.5 rounded mono"
            style={{ background: secondCrisis === k ? 'rgba(239,68,68,0.2)' : 'var(--bg-elevated)', color: secondCrisis === k ? '#ef4444' : 'var(--text-tertiary)', border: `1px solid ${secondCrisis === k ? '#ef444466' : 'var(--border-subtle)'}`, cursor: 'pointer' }}>
            + {crises[k].label}
          </button>
        ))}
        {secondCrisis && <span className="text-[10px] mono" style={{ color: '#ef4444' }}>⚠ 非线性耦合：救援资源互相挤占</span>}
      </div>

      <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <span className="text-[10px] mono uppercase" style={{ color: 'var(--cyber-cyan)' }}>政策资源配置器 · 预算 100 点</span>
          <span className="flex items-center gap-2">
            <span className="text-[11px] mono" style={{ color: allocTotal > 100 ? '#ef4444' : allocTotal === 100 ? '#10b981' : 'var(--text-secondary)' }}>已配 {allocTotal} / 100</span>
            <button type="button" onClick={() => setAlloc(Object.fromEntries(tools.map((t) => [t.id, 0])))} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>清零</button>
          </span>
        </div>
        <Grid cols={mode === 'handong' ? 5 : 5}>
          {tools.map((t) => {
            const others = allocTotal - (alloc[t.id] || 0);
            const max = Math.max(0, 100 - others);
            return (
              <div key={t.id}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: t.color }}>{t.label}</span>
                  <span className="mono" style={{ color: 'var(--text-secondary)' }}>{alloc[t.id] || 0}</span>
                </div>
                <input type="range" min={0} max={100} value={alloc[t.id] || 0}
                  onChange={(e) => { const v = Math.min(Number(e.target.value), max); setAlloc((prev) => ({ ...prev, [t.id]: v })); }}
                  style={{ width: '100%', accentColor: t.color }} />
                <p className="text-[9px] leading-snug mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</p>
              </div>
            );
          })}
        </Grid>
      </div>

      <Grid cols={2}>
        <div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>机理：</span>{crisis.intro}
          </p>
          <div className="p-3 rounded mb-3" style={{ background: 'var(--bg-elevated)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: crisisVerdict.color }}>判定 · {crisisVerdict.tier}</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{crisisVerdict.read}</p>
          </div>
          {crisis.toolbox && (
            <div className="space-y-2">
              {crisis.toolbox.map(([t, d]) => (
                <div key={t} style={{ borderLeft: `2px solid ${crisis.color}`, paddingLeft: 10 }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-[10px] mono uppercase mb-1" style={{ color: '#93a1b5' }}>冲击域 · 应对前 vs 后</div>
          {crisisOption && <EChart option={crisisOption} style={{ height: 200 }} />}
          <div className="p-3 rounded mt-3" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--fire-gold)' }}>应对小组自动组建 · Top5</span>
            {!team.length && <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>// 履历池无匹配</p>}
            <div className="space-y-1.5 mt-2">
              {team.map((m) => (
                <div key={m.name + m.title} className="flex items-center gap-2">
                  <span className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-primary)' }}>{m.name}</span>
                  <span className="text-[10px] truncate flex-1" style={{ color: 'var(--text-tertiary)' }}>{m.title}</span>
                  <span className="text-[10px] mono shrink-0" style={{ color: 'var(--cyber-cyan)' }}>匹配 {m.score}</span>
                </div>
              ))}
            </div>
          </div>
          {crisis.talentNeed && (
            <div className="p-3 rounded mt-3" style={{ background: 'var(--bg-elevated)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--fire-gold)' }}>班子画像需求</span>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {crisis.talentNeed} <Link to="/talent" className="mono" style={{ color: 'var(--cyber-cyan)' }}>→ 干部画像库</Link>
              </p>
            </div>
          )}
        </div>
      </Grid>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button type="button" onClick={genReport} className="os-btn os-btn-primary os-btn-sm">生成治理报告</button>
        {reportMd && <button type="button" onClick={copyReport} className="os-btn os-btn-sm">{reportCopied ? '✓ 已复制' : '复制 Markdown'}</button>}
      </div>
      {reportMd && (
        <pre className="os-card p-4 mt-3 text-xs mono" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', maxHeight: 260, overflowY: 'auto', lineHeight: 1.7, background: 'var(--bg-elevated)' }}>{reportMd}</pre>
      )}
    </div>
  );
}
