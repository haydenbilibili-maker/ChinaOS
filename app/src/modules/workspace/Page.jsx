import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Star, Trash2, X, Check, Clock, BookMarked, Gauge, NotebookPen } from 'lucide-react';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { resolveModuleByPath } from '../../app/breadcrumb.js';
import { GROUPS } from '../../app/registry.js';
import { MODULE_ICONS } from '../../app/moduleIcons.js';
import { KEY_INDICATORS, INDICATOR_SPARKLINES, ECON_DATA_AS_OF, ECON_PERIOD } from '../econdash/econData.js';
import { assessFreshness } from '../../lib/time/dataFreshness.js';
import Kpi from '../../vi/Kpi.jsx';
import Signal from '../../vi/Signal.jsx';
import {
  useWorkspace, getFavorites, getRecents, getWatchlist, getNotes,
  toggleFavorite, setWatchlist, clearRecents, addNote, updateNote, deleteNote,
} from '../../lib/workspace/store.js';
import './workspace.css';

// ============================================================================
// 个人工作台：收藏、关注指标、最近访问、笔记。本地优先，无需登录。
// ============================================================================

const GROUP_BY_ID = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

const PERIOD_OF = {
  gdp_h1: ECON_PERIOD.gdp, cpi: ECON_PERIOD.ytd, ppi: ECON_PERIOD.month, pmi_mfg: ECON_PERIOD.month,
  pmi_nonmfg: ECON_PERIOD.month, urban_unemp: ECON_PERIOD.month, m2: `${ECON_PERIOD.month}末`,
  afre: `${ECON_PERIOD.month}末`, retail: ECON_PERIOD.ytd, fai: ECON_PERIOD.ytd, iva: ECON_PERIOD.ytd,
  export: ECON_PERIOD.ytd, new_afre: ECON_PERIOD.month,
};

function levelOf(k) {
  if (k.threshold != null) {
    const above = k.value >= k.threshold;
    if (k.good === 'high') return above ? 'ok' : 'alert';
    if (k.good === 'low') return above ? 'alert' : 'ok';
  }
  return k.trend === 'down' && k.good === 'high' ? 'watch' : k.trend === 'up' && k.good === 'low' ? 'watch' : 'ok';
}

function sparkDelta(id) {
  const s = INDICATOR_SPARKLINES[id];
  return s && s.length > 1 ? Number((s[s.length - 1] - s[s.length - 2]).toFixed(1)) : undefined;
}

function greeting(now) {
  const h = now.getHours();
  if (h < 5) return '夜深了';
  if (h < 11) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

function ModuleTile({ path, onUnstar }) {
  const mod = resolveModuleByPath(path);
  if (!mod) return null;
  const Icon = MODULE_ICONS[mod.icon] || BookMarked;
  const group = GROUP_BY_ID[mod.group];
  return (
    <div className="ws-tile os-card os-card-interactive">
      <Link to={path} className="ws-tile__link">
        <span className="ws-tile__icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>
        <span className="ws-tile__title">{mod.title}</span>
        <span className="ws-tile__meta">{group?.label}{mod.subtitle ? ` · ${mod.subtitle}` : ''}</span>
      </Link>
      {onUnstar && (
        <button type="button" className="ws-tile__star" onClick={() => onUnstar(path)} aria-label={`取消收藏 ${mod.title}`}>
          <Star size={14} fill="currentColor" />
        </button>
      )}
    </div>
  );
}

function WatchlistEditor({ value, onChange, onDone }) {
  return (
    <div className="ws-picker os-card" role="group" aria-label="选择关注指标">
      <div className="ws-picker__chips">
        {KEY_INDICATORS.map((k) => {
          const on = value.includes(k.id);
          return (
            <button key={k.id} type="button" className={`ws-chip${on ? ' is-on' : ''}`} aria-pressed={on}
              onClick={() => onChange(on ? value.filter((x) => x !== k.id) : [...value, k.id])}>
              {on ? <Check size={13} /> : <Plus size={13} />}{k.label}
            </button>
          );
        })}
      </div>
      <button type="button" className="os-btn os-btn-primary" onClick={onDone}>完成</button>
    </div>
  );
}

function NoteCard({ note }) {
  const [editing, setEditing] = useState(!note.title && !note.body);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const save = () => {
    updateNote(note.id, { title: title.trim(), body: body.trim() });
    setEditing(false);
  };
  const date = new Date(note.updatedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  return (
    <article className={`ws-note os-card ws-note--${note.color || 'brass'}`}>
      {editing ? (
        <div className="ws-note__edit">
          <input className="os-input ws-note__title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" aria-label="笔记标题" autoFocus />
          <textarea className="os-input ws-note__body-input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="写点什么…" rows={4} aria-label="笔记内容" />
          <div className="ws-note__actions">
            <button type="button" className="os-btn os-btn-sm" onClick={() => (note.title || note.body ? setEditing(false) : deleteNote(note.id))}><X size={14} />取消</button>
            <button type="button" className="os-btn os-btn-primary os-btn-sm" onClick={save}><Check size={14} />保存</button>
          </div>
        </div>
      ) : (
        <>
          <header className="ws-note__head">
            <h3 className="ws-note__title">{note.title || '无标题'}</h3>
            <span className="ws-note__date">{date}</span>
          </header>
          {note.source?.quote && <blockquote className="ws-note__quote">{note.source.quote}</blockquote>}
          {note.body && <p className="ws-note__body">{note.body}</p>}
          <footer className="ws-note__foot">
            {note.source?.path ? <Link to={note.source.path} className="ws-note__src">{note.source.label || '来源'}</Link> : <span />}
            <span className="ws-note__tools">
              <button type="button" className="ws-icon" onClick={() => setEditing(true)} aria-label="编辑"><Pencil size={14} /></button>
              <button type="button" className="ws-icon" onClick={() => deleteNote(note.id)} aria-label="删除"><Trash2 size={14} /></button>
            </span>
          </footer>
        </>
      )}
    </article>
  );
}

export default function WorkspacePage() {
  const favorites = useWorkspace(getFavorites);
  const recents = useWorkspace(getRecents);
  const watchlist = useWorkspace(getWatchlist);
  const notes = useWorkspace(getNotes);
  const [editingWatch, setEditingWatch] = useState(false);
  const [draftWatch, setDraftWatch] = useState(watchlist);

  const now = useMemo(() => new Date(), []);
  const fresh = assessFreshness(ECON_DATA_AS_OF, now);
  const watched = watchlist.map((id) => KEY_INDICATORS.find((k) => k.id === id)).filter(Boolean);
  const recentMods = recents.filter((p) => resolveModuleByPath(p)).slice(0, 8);
  const dateLabel = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="ws">
      <PageHeader badge="Workspace" title={`${greeting(now)}，今天是 ${dateLabel}`} subtitle="你的收藏、关注的指标与笔记都在这里。全部保存在本机浏览器，无需登录。" noAccent>
        <div className="ws-status">
          <Signal level={fresh.level === 'fresh' ? 'ok' : fresh.level === 'aging' ? 'watch' : 'alert'} size="s" showLabel={false} />
          <span>宏观数据截至 <b className="vi-figure">{ECON_DATA_AS_OF}</b> · {fresh.level === 'fresh' ? '最新' : fresh.level === 'aging' ? '即将更新' : '待更新'}</span>
          <Link to="/econ-dashboard" className="ws-status__link">经济大盘 →</Link>
        </div>
      </PageHeader>

      <section className="ws-section">
        <header className="ws-section__head">
          <h2 className="vi-h2"><Gauge size={18} aria-hidden="true" />关注指标</h2>
          {!editingWatch && (
            <button type="button" className="os-btn os-btn-sm" onClick={() => { setDraftWatch(watchlist); setEditingWatch(true); }}>
              <Pencil size={14} />调整
            </button>
          )}
        </header>
        {editingWatch ? (
          <WatchlistEditor value={draftWatch} onChange={setDraftWatch} onDone={() => { setWatchlist(draftWatch); setEditingWatch(false); }} />
        ) : watched.length ? (
          <div className="ws-kpis">
            {watched.map((k) => (
              <Kpi key={k.id} size="s" label={k.label.replace(/（.*?）/, '')} period={PERIOD_OF[k.id]} value={k.value}
                unit={k.unit.startsWith('%') ? '%' : k.unit === '点' ? '' : k.unit} delta={sparkDelta(k.id)}
                good={k.good === 'low' ? 'down' : 'up'} level={levelOf(k)} spark={INDICATOR_SPARKLINES[k.id]} />
            ))}
          </div>
        ) : (
          <p className="ws-empty">还没有关注的指标。点「调整」从经济大盘的 13 项指标中挑选。</p>
        )}
      </section>

      <div className="ws-split">
        <section className="ws-section">
          <header className="ws-section__head">
            <h2 className="vi-h2"><Star size={18} aria-hidden="true" />收藏</h2>
            <span className="ws-count vi-figure">{favorites.length}</span>
          </header>
          {favorites.length ? (
            <div className="ws-tiles">
              {favorites.map((p) => <ModuleTile key={p} path={p} onUnstar={toggleFavorite} />)}
            </div>
          ) : (
            <p className="ws-empty">在任意模块顶栏点 <Star size={13} aria-hidden="true" /> 即可收藏，常用的专题会出现在这里和侧栏。</p>
          )}
        </section>

        <section className="ws-section">
          <header className="ws-section__head">
            <h2 className="vi-h2"><Clock size={18} aria-hidden="true" />最近</h2>
            {recentMods.length > 0 && <button type="button" className="ws-text-btn" onClick={clearRecents}>清空</button>}
          </header>
          {recentMods.length ? (
            <ol className="ws-recents">
              {recentMods.map((p) => {
                const m = resolveModuleByPath(p);
                const Icon = MODULE_ICONS[m.icon] || BookMarked;
                return (
                  <li key={p}>
                    <Link to={p} className="ws-recent">
                      <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
                      <span className="ws-recent__t">{m.title}</span>
                      <span className="ws-recent__g">{GROUP_BY_ID[m.group]?.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="ws-empty">浏览过的专题会按时间排在这里。</p>
          )}
        </section>
      </div>

      <section className="ws-section">
        <header className="ws-section__head">
          <h2 className="vi-h2"><NotebookPen size={18} aria-hidden="true" />笔记</h2>
          <button type="button" className="os-btn os-btn-primary os-btn-sm" onClick={() => addNote({})}><Plus size={14} />新建</button>
        </header>
        {notes.length ? (
          <div className="ws-notes">
            {notes.map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        ) : (
          <p className="ws-empty">记下判断与疑问。阅读器中划线的段落也会自动收进这里。</p>
        )}
      </section>

      <ModuleFooter moduleId="workspace" disclaimer="个人数据仅存于本机浏览器 · 清除站点数据会一并清除" />
    </div>
  );
}
