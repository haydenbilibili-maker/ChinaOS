import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { GROUPS, modulesByGroup, moduleById } from './registry.js';
import GlobalSearch from './GlobalSearch.jsx';
import { buildSearchIndex } from '../lib/search/buildIndex.js';
import { getTheme, toggleTheme, subscribeTheme } from '../lib/theme.js';

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

function GroupBlock({ group, onNavigate }) {
  const mods = modulesByGroup(group.id);
  if (!mods.length) return null;
  return (
    <div className="mb-5">
      <div className="px-3 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.accent }} />
        <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          {group.label}
        </span>
        <span className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{group.desc}</span>
        <span className="text-[10px] mono ml-auto" style={{ color: 'var(--text-tertiary)' }}>{mods.length}</span>
      </div>
      <nav className="space-y-0.5">
        {mods.map((m) => (
          <NavLink
            key={m.id}
            to={m.path}
            onClick={onNavigate}
            className={({ isActive }) => `nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? 'is-active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? 'var(--nav-active-text)' : 'var(--text-secondary)',
              borderLeft: `2px solid ${isActive ? group.accent : 'transparent'}`,
            })}
          >
            <Icon name={m.icon} />
            <span className="flex-1 truncate">{m.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function Shell() {
  const loc = useLocation();
  const active = moduleById(loc.pathname.replace('/', '')) || null;
  const group = active ? GROUPS.find((g) => g.id === active.group) : null;
  const mainRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setThemeState] = useState(() => getTheme());

  // 路由切换：内容区滚回顶部；同时收起移动端抽屉
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setDrawerOpen(false);
  }, [loc.pathname]);

  // 访问足迹：记录最近访问的模块路径（中枢看板「最近访问」直达条的数据源）
  useEffect(() => {
    const p = loc.pathname;
    if (!p || p === '/' || p === '/dashboard') return;
    try {
      const key = 'cos-recent';
      const arr = JSON.parse(localStorage.getItem(key) || '[]').filter((x) => x !== p);
      arr.unshift(p);
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 16)));
    } catch (_) { /* 隐私模式等场景静默跳过 */ }
  }, [loc.pathname]);

  // 全局快捷键：⌘K / Ctrl+K 打开搜索；Esc 关闭抽屉
  useEffect(() => {
    const onKey = (e) => {
      const cmdK = (IS_MAC ? e.metaKey : e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      if (cmdK) {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 订阅主题变更，使切换按钮图标即时同步
  useEffect(() => subscribeTheme((t) => setThemeState(t)), []);

  // 空闲时预构建搜索索引，避免首次 ⌘K 仅搜到模块
  useEffect(() => {
    const run = () => { buildSearchIndex().catch(() => {}); };
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(run, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, 1200);
    return () => clearTimeout(t);
  }, []);

  const onThemeToggle = useCallback(() => { setThemeState(toggleTheme()); }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isLight = theme === 'light';

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* 移动端抽屉遮罩 */}
      {drawerOpen && (
        <div
          className="os-drawer-backdrop"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        className={`os-sidebar w-64 shrink-0 border-r flex flex-col h-full ${drawerOpen ? 'is-open' : ''}`}
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-glass)', backdropFilter: 'blur(var(--surface-glass-blur))' }}
      >
        <div className="px-4 py-4 border-b shrink-0 flex items-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex-1 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-2 os-link" style={{ textDecoration: 'none' }} onClick={closeDrawer}>
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--china-red)' }}>China OS</span>
              <span className="text-xs mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>
                v3
              </span>
            </Link>
            <div className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>治大国如烹小鲜</div>
          </div>
          <button
            type="button"
            className="os-drawer-close os-btn os-btn-ghost os-btn-sm"
            onClick={closeDrawer}
            aria-label="关闭导航"
          >
            <Lucide.X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          {GROUPS.map((g) => <GroupBlock key={g.id} group={g} onNavigate={closeDrawer} />)}
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto grid-backdrop h-full">
        <header
          className="os-topbar px-8 py-3 border-b flex items-center gap-2 text-xs sticky top-0 z-10"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-page)', backdropFilter: 'blur(12px)', color: 'var(--text-tertiary)' }}
        >
          <button
            type="button"
            className="os-hamburger os-btn os-btn-ghost os-btn-sm"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开导航"
          >
            <Lucide.Menu size={16} />
          </button>
          <span>China OS</span>
          {group && <><Lucide.ChevronRight size={13} /><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: group.accent }} />{group.label}</span></>}
          <Lucide.ChevronRight size={13} />
          <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{active ? active.title : '总览'}</span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="os-search-trigger os-btn os-btn-ghost os-btn-sm"
              aria-label="全局搜索"
            >
              <Lucide.Search size={15} />
              <span className="os-search-trigger-label">搜索</span>
              <kbd className="mono os-search-trigger-kbd" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 5px', fontSize: 10, color: 'var(--text-tertiary)' }}>
                {IS_MAC ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
            <button
              type="button"
              onClick={onThemeToggle}
              className="os-theme-toggle os-btn os-btn-ghost os-btn-sm"
              aria-label={isLight ? '切换到夜览' : '切换到日览'}
              title={isLight ? '切换到夜览' : '切换到日览'}
              aria-pressed={isLight}
            >
              {isLight ? <Lucide.Moon size={15} /> : <Lucide.Sun size={15} />}
              <span className="os-theme-toggle-label">{isLight ? '日览' : '夜览'}</span>
            </button>
          </div>
        </header>
        <div key={loc.pathname} className="os-page-enter px-8 py-8 max-w-6xl">
          <Outlet />
        </div>
      </main>

      <GlobalSearch open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
