import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import { IntroCard, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  GLOSSARY_ENTRIES,
  GLOSSARY_CATEGORIES,
  GLOSSARY_COUNT,
  GLOSSARY_META,
  filterGlossary,
  findGlossaryEntry,
  glossaryInitials,
  enrichEntry,
} from '../../lib/db/glossary.js';

const inp = {
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
};

const chipBtn = (active, accent = 'var(--china-red)') => ({
  background: active ? `color-mix(in srgb, ${accent} 18%, transparent)` : 'var(--bg-elevated)',
  color: active ? accent : 'var(--text-secondary)',
  border: active ? `1px solid color-mix(in srgb, ${accent} 35%, transparent)` : '1px solid var(--border-subtle)',
  cursor: 'pointer',
  borderRadius: 6,
});

function CategoryChip({ cat, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(cat.id)}
      className="text-xs px-2.5 py-1 mono"
      style={chipBtn(active, cat.accent || 'var(--cyber-cyan)')}
    >
      {cat.label}
    </button>
  );
}

function TermRow({ entry, active, onSelect }) {
  const cat = GLOSSARY_CATEGORIES.find((c) => c.id === entry.category);
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="w-full text-left px-3 py-2.5 rounded-lg transition-colors"
      style={{
        background: active ? 'color-mix(in srgb, var(--cyber-cyan) 12%, transparent)' : 'transparent',
        borderLeft: active ? '3px solid var(--cyber-cyan)' : '3px solid transparent',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{entry.term}</span>
        <span className="text-[10px] mono shrink-0" style={{ color: cat?.accent || 'var(--text-tertiary)' }}>{cat?.label}</span>
      </div>
      {entry.aliases?.length > 0 && (
        <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
          又名 {entry.aliases.slice(0, 2).join(' · ')}
        </div>
      )}
    </button>
  );
}

function DetailPanel({ entry }) {
  if (!entry) {
    return (
      <div className="os-card flex items-center justify-center min-h-[320px]" style={{ padding: 'var(--card-padding)' }}>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>选择左侧词条，或从搜索/全局检索进入</p>
      </div>
    );
  }
  const cat = GLOSSARY_CATEGORIES.find((c) => c.id === entry.category);
  const Icon = Lucide.BookOpen;
  return (
    <div className="os-card flex flex-col gap-4" style={{ padding: 'var(--card-padding)', borderTop: `3px solid ${cat?.accent || 'var(--cyber-cyan)'}` }}>
      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{entry.term}</h2>
            {entry.aliases?.length > 0 && (
              <p className="text-xs mt-1 mono" style={{ color: 'var(--text-tertiary)' }}>
                别名：{entry.aliases.join(' · ')}
              </p>
            )}
          </div>
          <span className="text-xs mono px-2 py-1 rounded" style={{ background: `color-mix(in srgb, ${cat?.accent || '#888'} 14%, transparent)`, color: cat?.accent }}>
            {entry.categoryLabel || cat?.label}
          </span>
        </div>
      </div>

      <div>
        <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>释义</div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{entry.definition}</p>
      </div>

      {entry.contextResolved?.length > 0 && (
        <div>
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>项目内出现</div>
          <div className="flex flex-wrap gap-2">
            {entry.contextResolved.map((c) => (
              c.path ? (
                <Link
                  key={`${c.moduleId}-${c.path}`}
                  to={c.path}
                  className="inline-flex items-center gap-1 text-xs mono px-2 py-1 rounded os-link"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}
                >
                  <Lucide.ExternalLink size={11} />
                  {c.label}
                </Link>
              ) : (
                <span key={c.moduleId} className="text-xs mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                  {c.label}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      {entry.related?.length > 0 && (
        <div>
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>相关术语</div>
          <div className="flex flex-wrap gap-1.5">
            {entry.related.map((r) => (
              <Link
                key={r}
                to={`/glossary?term=${encodeURIComponent(r)}`}
                className="text-[11px] mono px-2 py-0.5 rounded"
                style={{ background: 'color-mix(in srgb, var(--fire-gold) 12%, transparent)', color: 'var(--fire-gold)' }}
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      )}

      {entry.source && (
        <div className="flex items-start gap-2 pt-2 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <Icon size={14} style={{ color: 'var(--text-tertiary)', marginTop: 2 }} />
          <div>
            <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>来源 / 参考</div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{entry.source}</p>
          </div>
        </div>
      )}

      <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        ID: {entry.id} · 拼音索引 {entry.initial || '#'}
      </div>
    </div>
  );
}

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [initial, setInitial] = useState('all');
  const [sel, setSel] = useState(null);

  const deepId = searchParams.get('id');
  const deepTerm = searchParams.get('term');

  const filtered = useMemo(
    () => filterGlossary(GLOSSARY_ENTRIES, { q, category, initial }),
    [q, category, initial],
  );

  const initials = useMemo(() => glossaryInitials(GLOSSARY_ENTRIES), []);

  const catCounts = useMemo(() => {
    const m = Object.fromEntries(GLOSSARY_CATEGORIES.map((c) => [c.id, 0]));
    for (const e of GLOSSARY_ENTRIES) m[e.category] = (m[e.category] || 0) + 1;
    return m;
  }, []);

  const selectEntry = useCallback((entry) => {
    const enriched = enrichEntry(entry);
    setSel(enriched);
    const next = new URLSearchParams(searchParams);
    next.set('id', entry.id);
    next.delete('term');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const found = findGlossaryEntry({ id: deepId, term: deepTerm });
    if (found) setSel(found);
  }, [deepId, deepTerm]);

  useEffect(() => {
    if (!sel && filtered.length && !deepId && !deepTerm) {
      setSel(enrichEntry(filtered[0]));
    }
  }, [filtered, sel, deepId, deepTerm]);

  const categoriesWithAccent = GLOSSARY_CATEGORIES.map((c, i) => ({
    ...c,
    accent: ['#c41e3a', '#d4af37', '#64748b', '#8b5cf6', '#10b981', '#22d3ee', '#c41e3a', '#f0abfc', '#fb923c'][i % 9],
  }));

  return (
    <div>
      <PageHeader
        badge="Data Console · 术语词典"
        title="词典"
        subtitle={`${GLOSSARY_META.source} —— 检索 · 分类 · 拼音索引 · 模块交叉链接（${GLOSSARY_COUNT} 条）`}
      />

      <IntroCard>
        聚合 China OS 全模块专有名词、深度调研系列关键词与 GY 推演术语。支持关键词/分类/拼音首字母筛选，深链
        {' '}
        <code className="mono text-xs">#/glossary?id=…</code>
        {' '}
        或
        {' '}
        <code className="mono text-xs">?term=…</code>
        。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value={GLOSSARY_COUNT} label="词条总数" accent="var(--cyber-cyan)" />
        <Stat value={GLOSSARY_CATEGORIES.length} label="分类维度" accent="var(--fire-gold)" />
        <Stat value={filtered.length} label="当前筛选" accent="var(--china-red)" />
        <Stat value={initials.length} label="拼音索引档" accent="#10b981" />
      </StatGrid>

      <div className="mb-4">
        <input
          type="search"
          placeholder="搜索词条、别名、释义、相关术语…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={inp}
          aria-label="搜索词典"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3 items-center">
        <span className="text-[11px] mono mr-1" style={{ color: 'var(--text-tertiary)' }}>分类</span>
        <button type="button" className="text-xs px-2.5 py-1 mono" style={chipBtn(category === 'all')} onClick={() => setCategory('all')}>全部</button>
        {categoriesWithAccent.map((cat) => (
          <CategoryChip key={cat.id} cat={{ ...cat, label: `${cat.label} (${catCounts[cat.id] || 0})` }} active={category === cat.id} onClick={setCategory} />
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-6 items-center">
        <span className="text-[11px] mono mr-1" style={{ color: 'var(--text-tertiary)' }}>拼音</span>
        <button type="button" className="text-xs px-2 py-0.5 mono" style={chipBtn(initial === 'all', 'var(--cyber-cyan)')} onClick={() => setInitial('all')}>全</button>
        {initials.map((ini) => (
          <button
            key={ini.id}
            type="button"
            className="text-xs px-2 py-0.5 mono min-w-[28px]"
            style={chipBtn(initial === ini.id, 'var(--cyber-cyan)')}
            onClick={() => setInitial(ini.id)}
            title={`${ini.count} 条`}
          >
            {ini.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:gap-6" style={{ gridTemplateColumns: 'minmax(240px, 320px) 1fr' }}>
        <Card title={`词条列表 · ${filtered.length}`} className="overflow-hidden">
          <div className="max-h-[62vh] overflow-y-auto -mx-1 px-1">
            {filtered.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>无匹配词条</p>
            ) : (
              filtered.map((e) => (
                <TermRow key={e.id} entry={e} active={sel?.id === e.id} onSelect={selectEntry} />
              ))
            )}
          </div>
        </Card>
        <DetailPanel entry={sel} />
      </div>

      <ModuleFooter moduleId="glossary" disclaimer="释义为项目内分析框架用语，仅供研究导航；部分自动抽取条目待持续校订" />
    </div>
  );
}
