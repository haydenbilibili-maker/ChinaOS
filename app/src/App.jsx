import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from './app/Shell.jsx';
import { LoadingBlock } from './app/ui.jsx';
import AiLauncher from './app/AiLauncher.jsx';
import { MODULES, DEFAULT_MODULE } from './app/registry.js';

// 路由由注册表生成：新增模块无需改这里
export default function App() {
  return (
    <>
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
                  <Suspense fallback={<LoadingBlock />}>
                    <Cmp />
                  </Suspense>
                }
              />
            );
          })}
          <Route path="anticorruption" element={<Navigate to="/talent?tab=anticorruption" replace />} />
          <Route path="culture-elite" element={<Navigate to="/talent?tab=knowledge" replace />} />
          <Route path="business-elite" element={<Navigate to="/talent?tab=business" replace />} />
          <Route path="handong" element={<Navigate to="/sandbox?tab=handong" replace />} />
          <Route path="macro" element={<Navigate to="/sandbox?tab=macro" replace />} />
          <Route path="inspection" element={<Navigate to="/sandbox?tab=inspection" replace />} />
          <Route path="wargame" element={<Navigate to="/sandbox?tab=wargame" replace />} />
          <Route path="presser" element={<Navigate to="/sandbox?tab=presser" replace />} />
          <Route path="party-school" element={<Navigate to="/talent?tab=party-school" replace />} />
          <Route path="org-engine" element={<Navigate to="/talent?tab=org-dept" replace />} />
          <Route path="organization-dept" element={<Navigate to="/talent?tab=org-dept" replace />} />
          <Route path="legal-statutes" element={<Navigate to="/policydocs?tab=legal" replace />} />
          <Route path="*" element={<Navigate to={DEFAULT_MODULE.path} replace />} />
        </Route>
      </Routes>
      {/* 全局浮动 AI 助手：独立于路由，任意页面可唤起 */}
      <AiLauncher />
    </>
  );
}
