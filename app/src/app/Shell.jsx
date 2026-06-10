import React, { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { GROUPS, modulesByGroup, moduleById } from './registry.js';

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

function GroupBlock({ group }) {
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
            className={({ isActive }) => `nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? 'is-active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? '#fff' : 'var(--text-secondary)',
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

  // 路由切换：内容区滚回顶部，避免「点了导航但内容停在旧滚动位置、看到空白」
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [loc.pathname]);

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <aside
        className="w-64 shrink-0 border-r flex flex-col h-full"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
      >
        <div className="px-4 py-4 border-b shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: 'var(--china-red)' }}>China OS</span>
            <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>
              v3
            </span>
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>治大国如烹小鲜</div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          {GROUPS.map((g) => <GroupBlock key={g.id} group={g} />)}
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto grid-backdrop h-full">
        <header
          className="px-8 py-3 border-b flex items-center gap-2 text-xs sticky top-0 z-10"
          style={{ borderColor: 'var(--border-subtle)', background: 'rgba(10,14,23,0.85)', backdropFilter: 'blur(8px)', color: 'var(--text-tertiary)' }}
        >
          <span>China OS</span>
          {group && <><Lucide.ChevronRight size={13} /><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: group.accent }} />{group.label}</span></>}
          <Lucide.ChevronRight size={13} />
          <span style={{ color: 'var(--text-secondary)' }}>{active ? active.title : '总览'}</span>
        </header>
        <div key={loc.pathname} className="os-page-enter px-8 py-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
