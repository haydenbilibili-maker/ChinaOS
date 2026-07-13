import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initTheme } from './lib/theme.js';
import { initDensity } from './lib/density.js';
import { initChunkRecovery } from './lib/chunkRecovery.js';

// 部署后 stale chunk → 自动 reload 一次（须在 React 挂载前注册）
initChunkRecovery();

// 启动即确定主题（存储 > 系统 > 夜览），避免首帧闪烁并同步图表调色板
initTheme();
initDensity();

// 修复直链 /talent?tab=…（query 在 hash 外）无法被 HashRouter 识别的问题
(() => {
  const { pathname, search, hash } = window.location;
  if (pathname && pathname !== '/' && !pathname.endsWith('.html')) {
    const target = `#${pathname}${search || ''}`;
    if (!hash || hash === '#' || hash === '#/' || !hash.startsWith(`#${pathname}`)) {
      window.location.replace(`${window.location.origin}/${target}`);
    }
  }
})();

// HashRouter：无需服务端路由配置，兼容任意静态托管（与 china.html 同款部署约束）
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </React.StrictMode>
);
