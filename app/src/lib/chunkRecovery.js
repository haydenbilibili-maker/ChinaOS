// ============================================================================
// 部署后 stale chunk 自动恢复
// ----------------------------------------------------------------------------
// 场景：浏览器缓存了旧 index.html / 主包，lazy chunk hash 已随新部署失效 → 404。
// 策略：捕获 Vite 动态 import 失败，sessionStorage 标记后整页 reload 一次，避免死循环。
// ============================================================================

const RETRY_KEY = 'c2os-chunk-reload';

/** @param {unknown} reason */
function isChunkLoadError(reason) {
  const msg =
    (reason instanceof Error ? reason.message : null) ||
    (typeof reason === 'string' ? reason : '') ||
    String(reason ?? '');
  const lower = msg.toLowerCase();
  return (
    lower.includes('failed to fetch dynamically imported module') ||
    lower.includes('importing a module script failed') ||
    lower.includes('error loading dynamically imported module') ||
    lower.includes('loading chunk') ||
    lower.includes('loading css chunk') ||
    // stale chunk / 循环依赖时 React.lazy 常见症状
    (lower.includes('cannot read properties of undefined') && lower.includes('default'))
  );
}

function showReloadToast() {
  try {
    const el = document.createElement('div');
    el.textContent = '检测到新版本，正在刷新…';
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '99999',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0',
      background: 'rgba(15, 23, 42, 0.92)',
      border: '1px solid rgba(34, 211, 238, 0.35)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      pointerEvents: 'none',
    });
    document.body?.appendChild(el);
  } catch {
    /* 首屏 DOM 未就绪时忽略 */
  }
}

/** @param {unknown} reason */
function maybeReloadForStaleChunk(reason) {
  if (!isChunkLoadError(reason)) return false;

  try {
    if (sessionStorage.getItem(RETRY_KEY)) return false;
    sessionStorage.setItem(RETRY_KEY, '1');
  } catch {
    /* 隐私模式：仍尝试 reload 一次 */
  }

  showReloadToast();
  window.location.reload();
  return true;
}

/** 成功加载后清除重试标记，以便下次部署仍可自动恢复 */
function clearRetryFlagOnLoad() {
  window.addEventListener('load', () => {
    try {
      sessionStorage.removeItem(RETRY_KEY);
    } catch {
      /* noop */
    }
  });
}

/** 在 React 挂载前注册全局监听 */
export function initChunkRecovery() {
  clearRetryFlagOnLoad();

  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    if (maybeReloadForStaleChunk(event.payload)) return;
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      maybeReloadForStaleChunk(event.reason);
    }
  });

  window.addEventListener(
    'error',
    (event) => {
      const target = event.target;
      if (target instanceof HTMLScriptElement && target.src) {
        maybeReloadForStaleChunk(event.message || `script load failed: ${target.src}`);
      }
    },
    true,
  );
}
