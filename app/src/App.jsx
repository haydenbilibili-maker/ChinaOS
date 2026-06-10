import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from './app/Shell.jsx';
import { MODULES, DEFAULT_MODULE } from './app/registry.js';

function Loading() {
  return (
    <div className="mono text-sm" style={{ color: 'var(--cyber-cyan)' }}>
      // 加载模块…
    </div>
  );
}

// 路由由注册表生成：新增模块无需改这里
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />}>
        <Route index element={<Navigate to={DEFAULT_MODULE.path} replace />} />
        {MODULES.map((m) => {
          const Cmp = m.component;
          return (
            <Route
              key={m.id}
              path={m.path.slice(1)}
              element={
                <Suspense fallback={<Loading />}>
                  <Cmp />
                </Suspense>
              }
            />
          );
        })}
        <Route path="*" element={<Navigate to={DEFAULT_MODULE.path} replace />} />
      </Route>
    </Routes>
  );
}
