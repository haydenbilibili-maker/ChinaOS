import React from 'react';
import { Grid } from '../../app/ui.jsx';
import { VERIFY_META, LEDGER_META } from './schema.js';

// 学者专栏共享展示件：引语卡 / 观点清单 / 三列台账 / 核验徽标 / 表格

export const textStyle = { color: 'var(--text-secondary)' };
export const subtle = { color: 'var(--text-tertiary)' };

export function Prose({ children, className = '' }) {
  return <p className={`text-sm leading-relaxed ${className}`} style={textStyle}>{children}</p>;
}

export function VerifyBadge({ level }) {
  const m = VERIFY_META[level] ?? VERIFY_META.doubt;
  return (
    <span
      className="text-[10px] mono px-1.5 py-0.5 rounded whitespace-nowrap"
      style={{ color: m.color, border: `1px solid ${m.color}` }}
      title={m.note}
    >
      {m.label}
    </span>
  );
}

export function TypeBadge({ type }) {
  const quote = type === '原话';
  const color = quote ? 'var(--fire-gold)' : 'var(--text-tertiary)';
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap" style={{ color, border: `1px dashed ${color}` }}>
      {type}
    </span>
  );
}

export function SourceLine({ item }) {
  const label = `${item.date} · ${item.venue} · ${item.source}`;
  return (
    <div className="text-[11px] leading-relaxed mt-1.5" style={subtle}>
      {item.url
        ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyber-cyan)' }}>{label}</a>
        : label}
    </div>
  );
}

export function QuoteCard({ item, accent = 'var(--fire-gold)' }) {
  return (
    <figure className="os-card p-4 m-0 h-full" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${accent}` }}>
      <blockquote className="m-0 text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        「{item.text}」
      </blockquote>
      <figcaption className="mt-2 flex flex-wrap items-center gap-1.5">
        <TypeBadge type={item.type} />
        <VerifyBadge level={item.verified} />
      </figcaption>
      <SourceLine item={item} />
    </figure>
  );
}

export function ClaimList({ claims }) {
  return (
    <ul className="m-0 p-0 list-none space-y-3">
      {claims.map((c) => (
        <li key={c.id} className="pl-3" style={{ borderLeft: `2px solid ${c.type === '原话' ? 'var(--fire-gold)' : 'var(--border-subtle, rgba(148,163,184,0.25))'}` }}>
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <TypeBadge type={c.type} />
            <VerifyBadge level={c.verified} />
          </div>
          <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--text-primary)' }}>
            {c.type === '原话' ? `「${c.text}」` : c.text}
          </p>
          <SourceLine item={c} />
        </li>
      ))}
    </ul>
  );
}

export function LedgerBoard({ items, srcLabel = '对照数据' }) {
  const cols = ['done', 'failed', 'open'];
  return (
    <Grid cols={3}>
      {cols.map((key) => {
        const meta = LEDGER_META[key];
        const list = items.filter((it) => it.status === key);
        return (
          <section key={key} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${meta.color}` }} aria-label={meta.label}>
            <h3 className="text-xs font-semibold mb-3" style={{ color: meta.color }}>{meta.label} · {list.length}</h3>
            <div className="space-y-4">
              {list.map((it) => (
                <article key={it.id} style={{ paddingLeft: 8, borderLeft: `2px solid ${meta.color}55` }}>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="mono text-[10px]" style={subtle}>{it.date}</span>
                    <TypeBadge type={it.type} />
                  </div>
                  <p className="text-[12px] font-semibold leading-relaxed m-0 mb-1" style={{ color: 'var(--text-primary)' }}>
                    {it.type === '原话' ? `「${it.claim}」` : it.claim}
                  </p>
                  <p className="text-[11px] leading-relaxed m-0 mb-1" style={subtle}>
                    {it.url
                      ? <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyber-cyan)' }}>{it.venue}</a>
                      : it.venue}
                  </p>
                  <p className="text-[12px] leading-relaxed m-0" style={textStyle}>{it.check}</p>
                  <p className="text-[10px] leading-relaxed m-0 mt-1" style={subtle}>{srcLabel}：{it.dataSrc}</p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </Grid>
  );
}

export function DataTable({ head, rows, caption }) {
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
            <tr key={cells.key} style={{ borderTop: '1px solid var(--border-subtle, rgba(148,163,184,0.1))' }}>
              <th scope="row" className="py-2 pr-3 font-normal text-left align-top" style={{ color: 'var(--text-primary)', minWidth: 110 }}>{cells.cells[0]}</th>
              {cells.cells.slice(1).map((c, i) => (
                <td key={`${cells.key}-${head[i + 1]}`} className="py-2 pr-3 align-top leading-relaxed">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
