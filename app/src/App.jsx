import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from './app/Shell.jsx';
import { LoadingBlock } from './app/ui.jsx';
import { MODULES, DEFAULT_MODULE, isHuangfeizhaiModule } from './app/registry.js';
import HuangfeizhaiGate from './modules/huangfeizhai/HuangfeizhaiGate.jsx';

const AiLauncher = lazy(() => import('./app/AiLauncher.jsx'));

function ModuleRoute({ module: m }) {
  const Cmp = m.component;
  const page = (
    <Suspense fallback={<LoadingBlock />}>
      <Cmp />
    </Suspense>
  );
  if (isHuangfeizhaiModule(m)) {
    return <HuangfeizhaiGate>{page}</HuangfeizhaiGate>;
  }
  return page;
}

// 路由由注册表生成：新增模块无需改这里
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Navigate to={DEFAULT_MODULE.path} replace />} />
          {MODULES.map((m) => {
            const routePath = m.wildcard ? `${m.path.slice(1)}/*` : m.path.slice(1);
            return (
              <Route
                key={m.id}
                path={routePath}
                element={<ModuleRoute module={m} />}
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
          <Route path="party-school" element={<Navigate to="/sandbox?tab=party-school" replace />} />
          <Route path="org-engine" element={<Navigate to="/sandbox?tab=org-dept" replace />} />
          <Route path="organization-dept" element={<Navigate to="/sandbox?tab=org-dept" replace />} />
          <Route path="legal-statutes" element={<Navigate to="/policydocs?tab=legal" replace />} />
          <Route path="chronicle" element={<Navigate to="/modules/guoyun?tab=timeline" replace />} />
          <Route path="modules/yishixingtai-jiagou" element={<Navigate to="/modules/yishixingtai" replace />} />
          <Route path="wb-ce-report" element={<Navigate to="/econ-dashboard?tab=worldbank" replace />} />
          <Route path="*" element={<Navigate to={DEFAULT_MODULE.path} replace />} />
        </Route>
      </Routes>
      {/* 全局浮动 AI 助手：独立于路由，任意页面可唤起 */}
      <Suspense fallback={null}>
        <AiLauncher />
      </Suspense>
    </>
  );
}
