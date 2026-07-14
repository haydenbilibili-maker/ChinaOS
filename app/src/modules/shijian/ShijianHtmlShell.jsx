import { useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { getTheme, subscribeTheme } from '../../lib/theme.js';
import './shijian.css';

const THEME_MSG = 'c2os-sj-theme';
const LOAD_TIMEOUT_MS = 8000;

function withThemeQuery(htmlSrc, theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  try {
    const u = new URL(htmlSrc, typeof window !== 'undefined' ? window.location.origin : 'http://local');
    u.searchParams.set('theme', t);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    const sep = htmlSrc.includes('?') ? '&' : '?';
    return `${htmlSrc}${sep}theme=${t}`;
  }
}

/**
 * 史鉴 HTML 单页壳：iframe 载入 public/shijian/SJ-XX.html，供侧栏路由复用。
 * 高度固定为视口面板（内部滚动），禁止 scrollHeight 握手回路。
 * 日览/夜览经 ?theme= 初值 + postMessage 同步进 iframe。
 */
export default function ShijianHtmlShell({
  moduleId,
  badge,
  title,
  subtitle,
  htmlSrc,
  frameTitle,
  hintLinks = [],
}) {
  const iframeRef = useRef(null);
  const loadTimerRef = useRef(null);
  const [theme, setTheme] = useState(() => getTheme());
  const [frameState, setFrameState] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => subscribeTheme(setTheme), []);

  // 仅在换卷时重建 src；主题切换走 postMessage，避免整页重载回路
  const frameSrc = useMemo(() => withThemeQuery(htmlSrc, getTheme()), [htmlSrc]);

  useEffect(() => {
    setFrameState('loading');
  }, [frameSrc, retryKey]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

    const clearLoadTimer = () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };

    const post = () => {
      try {
        iframe.contentWindow?.postMessage(
          { type: THEME_MSG, theme: theme === 'light' ? 'light' : 'dark' },
          window.location.origin,
        );
      } catch {
        /* ignore */
      }
    };

    const onLoad = () => {
      clearLoadTimer();
      setFrameState('ready');
      post();
    };
    const onError = () => {
      clearLoadTimer();
      setFrameState('error');
    };

    clearLoadTimer();
    loadTimerRef.current = setTimeout(() => {
      setFrameState((prev) => (prev === 'loading' ? 'error' : prev));
    }, LOAD_TIMEOUT_MS);

    post();
    iframe.addEventListener('load', onLoad);
    iframe.addEventListener('error', onError);
    return () => {
      clearLoadTimer();
      iframe.removeEventListener('load', onLoad);
      iframe.removeEventListener('error', onError);
    };
  }, [theme, frameSrc, retryKey]);

  return (
    <div className="shijian-page">
      <PageHeader badge={badge} title={title} subtitle={subtitle} />
      <div className={`shijian-frame-wrap os-card${frameState === 'loading' ? ' is-loading' : ''}${frameState === 'error' ? ' is-error' : ''}`}>
        {frameState === 'loading' && (
          <div className="shijian-frame-status" aria-live="polite" aria-busy="true">
            <div className="shijian-frame-skeleton" aria-hidden="true">
              <span className="shijian-frame-skeleton-line" />
              <span className="shijian-frame-skeleton-line short" />
            </div>
            <p className="shijian-frame-status-text">载入卷页…</p>
          </div>
        )}
        {frameState === 'error' && (
          <div className="shijian-frame-status is-error-panel" role="alert">
            <p className="shijian-frame-status-text">卷页载入失败或超时</p>
            <p className="shijian-frame-status-hint">
              <button
                type="button"
                className="shijian-frame-retry"
                onClick={() => setRetryKey((k) => k + 1)}
              >
                重试载入
              </button>
              或
              <a href={htmlSrc} target="_blank" rel="noreferrer">直接打开单页</a>
              。
            </p>
          </div>
        )}
        <iframe
          key={retryKey}
          ref={iframeRef}
          className="shijian-frame"
          title={frameTitle}
          src={frameSrc}
          hidden={frameState === 'error'}
        />
      </div>
      {hintLinks.length > 0 && (
        <p className="shijian-open-hint">
          亦可直接打开单页报告：
          {hintLinks.map((link, i) => (
            <span key={link.href}>
              {i > 0 ? ' · ' : ' '}
              <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
            </span>
          ))}
        </p>
      )}
      <ModuleFooter moduleId={moduleId} />
    </div>
  );
}
