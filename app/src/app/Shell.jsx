import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { GROUPS, HUANGFEIZHAI_GROUP_ID, modulesByGroup } from './registry.js';
import { useHuangfeizhaiAuth } from '../lib/huangfeizhai/useHuangfeizhaiAuth.js';
import { buildBreadcrumbs, resolveModuleByPath } from './breadcrumb.js';
import GlobalSearch from './GlobalSearch.jsx';
import SiteFooter from './SiteFooter.jsx';
import { buildSearchIndex } from '../lib/search/buildIndex.js';
import { getTheme, toggleTheme, subscribeTheme } from '../lib/theme.js';
import { getDensity, toggleDensity, subscribeDensity } from '../lib/density.js';

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
const HOME_GROUP_ID = 'home';
const SIDEBAR_EXPANDED_KEY = 'c2os-sidebar-expanded';

function loadExpandedGroups() {
  try {
    const raw = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.filter((id) => id && id !== HOME_GROUP_ID));
      }
    }
  } catch (_) { /* 隐私模式等场景静默跳过 */ }
  return new Set();
}

function persistExpandedGroups(set) {
  try {
    localStorage.setItem(SIDEBAR_EXPANDED_KEY, JSON.stringify([...set]));
  } catch (_) { /* 隐私模式等场景静默跳过 */ }
}

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

function BreadcrumbNav({ items }) {
  if (!items.length) return null;
  return (
    <nav className="os-breadcrumb min-w-0 flex-1" aria-label="面包屑">
      <ol className="os-breadcrumb__list flex items-center gap-0.5 min-w-0 m-0 p-0 list-none">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-0.5 min-w-0">
            {i > 0 && (
              <Lucide.ChevronRight size={13} className="os-breadcrumb__sep shrink-0" aria-hidden="true" />
            )}
            {item.active || !item.to ? (
              <span
                className="os-breadcrumb__current truncate"
                aria-current={item.active ? 'page' : undefined}
              >
                {item.accent ? (
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.accent }} />
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link to={item.to} className="os-breadcrumb__link truncate">
                {item.accent ? (
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.accent }} />
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SidebarTreeControls({ anyExpanded, onToggleAll }) {
  const collapseMode = anyExpanded;
  return (
    <div
      className="os-sidebar-tree-controls px-3 py-2 shrink-0 border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <button
        type="button"
        className="os-sidebar-tree-btn os-btn os-btn-ghost os-btn-sm w-full"
        onClick={onToggleAll}
        aria-label={collapseMode ? '一键缩回全部分组' : '一键展开全部分组'}
        title={collapseMode ? '缩回全部分组' : '展开全部分组'}
      >
        {collapseMode ? <Lucide.FoldVertical size={13} /> : <Lucide.UnfoldVertical size={13} />}
        <span>{collapseMode ? '一键缩回' : '一键展开'}</span>
      </button>
    </div>
  );
}

function GroupBlock({ group, expanded, onToggle, onNavigate, alwaysShowModules, huangfeizhaiUnlocked }) {
  const allMods = modulesByGroup(group.id);
  if (!allMods.length) return null;

  const isPrivateGroup = group.id === HUANGFEIZHAI_GROUP_ID;
  const mods = isPrivateGroup && !huangfeizhaiUnlocked
    ? allMods.filter((m) => m.id === 'huangfeizhaiHub')
    : allMods;

  const collapsible = !alwaysShowModules;
  const showModules = alwaysShowModules || expanded;

  const headerInner = (
    <>
      <div className="os-group-header__row">
        <span className="os-group-header__dot" style={{ background: group.accent }} />
        <span className="os-group-header__title">{group.label}</span>
        <span className="os-group-header__count mono">{mods.length}</span>
        {collapsible ? (
          <Lucide.ChevronDown
            size={14}
            className={`os-group-header__chevron shrink-0 ${expanded ? 'is-expanded' : ''}`}
            aria-hidden="true"
          />
        ) : null}
      </div>
      {group.desc ? (
        <div className="os-group-header__desc">
          {group.desc}
          {isPrivateGroup && !huangfeizhaiUnlocked ? ' · 需密钥' : null}
        </div>
      ) : null}
    </>
  );

  return (
    <div className={`mb-5 os-group-block ${showModules ? '' : 'os-group-collapsed'}`}>
      {collapsible ? (
        <button
          type="button"
          className="os-group-header os-group-header--toggle px-3 mb-2"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`sidebar-group-${group.id}`}
        >
          {headerInner}
        </button>
      ) : (
        <div className="os-group-header px-3 mb-2" aria-label={group.label}>
          {headerInner}
        </div>
      )}
      <div
        id={`sidebar-group-${group.id}`}
        className={`os-group-modules ${showModules ? 'is-expanded' : ''}`}
      >
        <nav className="space-y-0.5">
          {mods.map((m) => (
            <NavLink
              key={m.id}
              to={m.path}
              onClick={onNavigate}
              className={({ isActive }) => `nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? 'is-active' : ''}`}
              style={({ isActive }) => ({
                color: isActive ? 'var(--nav-active-text)' : 'var(--text-secondary)',
                '--nav-accent': group.accent,
              })}
            >
              <Icon name={m.icon} />
              <span className="flex-1 truncate">{m.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Shell() {
  const loc = useLocation();
  const crumbs = useMemo(
    () => buildBreadcrumbs(loc.pathname, loc.search),
    [loc.pathname, loc.search],
  );
  const mainRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setThemeState] = useState(() => getTheme());
  const [density, setDensityState] = useState(() => getDensity());
  const [expandedGroups, setExpandedGroups] = useState(() => loadExpandedGroups());
  const { authenticated: huangfeizhaiUnlocked, lock: lockHuangfeizhai } = useHuangfeizhaiAuth();

  const collapsibleGroupIds = useMemo(
    () => GROUPS.filter((g) => g.id !== HOME_GROUP_ID && modulesByGroup(g.id).length > 0).map((g) => g.id),
    [],
  );

  const toggleGroup = useCallback((groupId) => {
    if (groupId === HOME_GROUP_ID) return;
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      persistExpandedGroups(next);
      return next;
    });
  }, []);

  const anyGroupExpanded = useMemo(
    () => collapsibleGroupIds.some((id) => expandedGroups.has(id)),
    [collapsibleGroupIds, expandedGroups],
  );

  const toggleAllGroups = useCallback(() => {
    setExpandedGroups((prev) => {
      const anyExpanded = collapsibleGroupIds.some((id) => prev.has(id));
      const next = anyExpanded ? new Set() : new Set(collapsibleGroupIds);
      persistExpandedGroups(next);
      return next;
    });
  }, [collapsibleGroupIds]);

  // 路由切换：主内容区滚回顶部（仅滚动容器，不干扰入场动画）；同时收起移动端抽屉
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    setDrawerOpen(false);
  }, [loc.pathname]);

  // 当前模块所在分组自动展开（看板分组模块常驻，无需写入）
  useEffect(() => {
    const mod = resolveModuleByPath(loc.pathname);
    if (!mod || mod.group === HOME_GROUP_ID) return;
    setExpandedGroups((prev) => {
      if (prev.has(mod.group)) return prev;
      const next = new Set(prev);
      next.add(mod.group);
      persistExpandedGroups(next);
      return next;
    });
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
  useEffect(() => subscribeDensity((d) => setDensityState(d)), []);

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
  const onDensityToggle = useCallback(() => { setDensityState(toggleDensity()); }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isLight = theme === 'light';
  const isCompact = density === 'compact';

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
        className={`os-sidebar w-64 shrink-0 border-r flex flex-col h-full relative z-[1] ${drawerOpen ? 'is-open' : ''}`}
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-glass)' }}
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
        <SidebarTreeControls anyExpanded={anyGroupExpanded} onToggleAll={toggleAllGroups} />
        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          {GROUPS.map((g) => (
            <GroupBlock
              key={g.id}
              group={g}
              expanded={expandedGroups.has(g.id)}
              onToggle={() => toggleGroup(g.id)}
              onNavigate={closeDrawer}
              alwaysShowModules={g.id === HOME_GROUP_ID}
              huangfeizhaiUnlocked={huangfeizhaiUnlocked}
            />
          ))}
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto grid-backdrop h-full relative z-[1]">
        <header
          className="os-topbar px-8 py-3 border-b flex items-center gap-2 text-xs sticky top-0 z-10"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-page)', backdropFilter: 'blur(var(--glass-blur-md))', WebkitBackdropFilter: 'blur(var(--glass-blur-md))', color: 'var(--text-tertiary)' }}
        >
          <button
            type="button"
            className="os-hamburger os-btn os-btn-ghost os-btn-sm shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开导航"
          >
            <Lucide.Menu size={16} />
          </button>
          <BreadcrumbNav items={crumbs} />

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {huangfeizhaiUnlocked && resolveModuleByPath(loc.pathname)?.group === HUANGFEIZHAI_GROUP_ID ? (
              <button
                type="button"
                onClick={lockHuangfeizhai}
                className="os-btn os-btn-ghost os-btn-sm"
                aria-label="荒废斋重新上锁"
                title="荒废斋重新上锁"
              >
                <Lucide.Lock size={15} />
                <span className="hidden sm:inline">上锁</span>
              </button>
            ) : null}
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
              onClick={onDensityToggle}
              className="os-density-toggle os-btn os-btn-ghost os-btn-sm"
              aria-label={isCompact ? '切换到舒适密度' : '切换到紧凑密度'}
              title={isCompact ? '切换到舒适密度' : '切换到紧凑密度'}
              aria-pressed={isCompact}
            >
              {isCompact ? <Lucide.Rows3 size={15} /> : <Lucide.LayoutGrid size={15} />}
              <span className="os-density-toggle-label">{isCompact ? '紧凑' : '舒适'}</span>
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
        <div key={loc.pathname} className="os-page-enter os-content-fluid py-8">
          <Outlet />
        </div>
        <SiteFooter />
      </main>

      <GlobalSearch open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
