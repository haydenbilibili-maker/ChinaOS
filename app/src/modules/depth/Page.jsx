import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Stat } from '../../app/ui.jsx';
import { GROUPS, MODULES, modulesByGroup } from '../../app/registry.js';

function Icon({ name, size = 17 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

// 深度透视 = 项目内容主体：八大内容维度（认知内核/透镜/沙盒/底座不计入）。
const CONTENT_GROUPS = ['institutions', 'depthtopics', 'techtopics', 'society', 'industry', 'finance', 'region', 'security'];
const GROUP_MAP = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

// 含真实中国地图（drill-down）的专题，给个角标。
const HAS_MAP = new Set(['foodSecurity', 'urban', 'debtHeatmap', 'regional']);

export default function Page() {
  const [q, setQ] = useState('');
  const [dim, setDim] = useState('all');

  const sections = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return CONTENT_GROUPS
      .filter((gid) => dim === 'all' || dim === gid)
      .map((gid) => ({
        group: GROUP_MAP[gid],
        mods: modulesByGroup(gid).filter(
          (m) => !kw || m.title.toLowerCase().includes(kw) || (m.subtitle || '').toLowerCase().includes(kw)
        ),
      }))
      .filter((s) => s.mods.length);
  }, [q, dim]);

  const total = useMemo(() => CONTENT_GROUPS.reduce((n, g) => n + modulesByGroup(g).length, 0), []);
  const hit = sections.reduce((n, s) => n + s.mods.length, 0);

  return (
    <div>
      <PageHeader badge="Depth Lens · 内容主体" title="深度透视 · 八维专题矩阵"
        subtitle="项目最大的内容主体：制度 / 社会 / 产业 / 科技 / 区域 / 金融 / 安全 八大维度的全部专题，统一检索与直达入口" />

      {/* 概览统计 */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))' }}>
        <Stat value={total} label="已建专题" accent="var(--cyber-cyan)" />
        <Stat value={CONTENT_GROUPS.length} label="内容维度" accent="var(--fire-gold)" />
        <Stat value={HAS_MAP.size} label="含中国地图" accent="var(--china-red)" />
        <Stat value={MODULES.length} label="模块总数 (全栈)" accent="#10b981" />
      </div>

      {/* 检索 + 维度筛选 */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px' }}>
          <Lucide.Search size={16} style={{ color: 'var(--text-tertiary)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="检索专题（标题 / 关键词）…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14 }} />
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><Lucide.X size={15} /></button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setDim('all')} className="text-xs px-3 py-1 rounded-full mono"
            style={{ background: dim === 'all' ? 'rgba(34,211,238,0.18)' : 'var(--bg-elevated)', color: dim === 'all' ? 'var(--cyber-cyan)' : 'var(--text-secondary)', border: `1px solid ${dim === 'all' ? 'var(--cyber-cyan)' : 'transparent'}`, cursor: 'pointer' }}>
            全部 {total}
          </button>
          {CONTENT_GROUPS.map((gid) => {
            const g = GROUP_MAP[gid]; const c = modulesByGroup(gid).length; const on = dim === gid;
            return (
              <button key={gid} onClick={() => setDim(gid)} className="text-xs px-3 py-1 rounded-full mono"
                style={{ background: on ? `${g.accent}26` : 'var(--bg-elevated)', color: on ? g.accent : 'var(--text-secondary)', border: `1px solid ${on ? g.accent : 'transparent'}`, cursor: 'pointer' }}>
                {g.label} {c}
              </button>
            );
          })}
        </div>
      </Card>

      {hit === 0 && (
        <Card><p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>未命中「{q}」相关专题，试试其它关键词。</p></Card>
      )}

      {/* 分组矩阵 */}
      {sections.map(({ group, mods }) => (
        <div key={group.id} className="mb-7">
          <div className="flex items-baseline gap-3 mb-3">
            <span style={{ width: 9, height: 9, borderRadius: 2, background: group.accent }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{group.label}</h3>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{group.desc} · {mods.length}</span>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))' }}>
            {mods.map((m) => (
              <Link key={m.id} to={m.path} className="os-card p-4 block transition-colors"
                style={{ borderLeft: `3px solid ${group.accent}`, position: 'relative' }}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span style={{ color: group.accent }}><Icon name={m.icon} /></span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
                  {HAS_MAP.has(m.id) && <span className="mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.16)', color: 'var(--china-red)' }}>MAP</span>}
                </div>
                <p className="text-xs leading-snug" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</p>
                <Lucide.ArrowUpRight size={14} style={{ position: 'absolute', top: 14, right: 14, color: 'var(--text-tertiary)' }} />
              </Link>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
        专题持续从 <a href="../china.html" target="_blank" rel="noreferrer" className="mono" style={{ color: 'var(--cyber-cyan)' }}>china.html 传统视图</a> 迁入独立模块；带 <span className="mono" style={{ color: 'var(--china-red)' }}>MAP</span> 标记的专题含可下钻的中国省级地图。本页索引自动同步注册表，新增模块即插即用。
      </p>
    </div>
  );
}
