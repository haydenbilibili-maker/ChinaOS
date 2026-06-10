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
          const routePath = m.wildcard ? `${m.path.slice(1)}/*` : m.path.slice(1);
          return (
            <Route
              key={m.id}
              path={routePath}
              element={
                <Suspense fallback={<Loading />}>
                  <Cmp />
                </Suspense>
              }
            />
          );
        })}
        <Route path="anticorruption" element={<Navigate to="/talent?tab=anticorruption" replace />} />
        <Route path="culture-elite" element={<Navigate to="/talent?tab=culture" replace />} />
        <Route path="business-elite" element={<Navigate to="/talent?tab=business" replace />} />
        <Route path="*" element={<Navigate to={DEFAULT_MODULE.path} replace />} />
      </Route>
    </Routes>
  );
}
