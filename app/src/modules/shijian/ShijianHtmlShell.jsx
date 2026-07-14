import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { getTheme, subscribeTheme } from '../../lib/theme.js';
import './shijian.css';

const THEME_MSG = 'c2os-sj-theme';
const LENS_MSG = 'c2os-sj-lens';
const LOAD_TIMEOUT_MS = 8000;

function withDeepLinkQuery(htmlSrc, theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  try {
    const u = new URL(htmlSrc, typeof window !== 'undefined' ? window.location.origin : 'http://local');
    u.searchParams.set('theme', t);
    if (typeof window !== 'undefined') {
      const parentQs = new URLSearchParams(window.location.search);
      const q = parentQs.get('q');
      const lens = parentQs.get('lens');
      if (q) {
        u.searchParams.set('q', q);
        u.searchParams.delete('lens');
      } else if (lens) {
        u.searchParams.set('lens', lens);
        u.searchParams.delete('q');
      }
    }
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
 * 镜头深链 ?lens= / ?q= 与 iframe 双向 postMessage 同步，不重载 iframe。
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
  const lensEchoSkipRef = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [theme, setTheme] = useState(() => getTheme());
  const [frameState, setFrameState] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => subscribeTheme(setTheme), []);

  // 仅在换卷时重建 src；主题与深链初值写入 query；运行时改参走 postMessage
  const frameSrc = useMemo(() => withDeepLinkQuery(htmlSrc, getTheme()), [htmlSrc]);

  useEffect(() => {
    setFrameState('loading');
  }, [frameSrc, retryKey]);

  // iframe → 父路由：pick / 双镜 变更 URL，不重载
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      const d = e?.data;
      if (!d || d.type !== LENS_MSG) return;

      lensEchoSkipRef.current = true;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (d.q) {
          next.set('q', d.q);
          next.delete('lens');
        } else if (d.lens) {
          next.set('lens', d.lens);
          next.delete('q');
        } else {
          next.delete('lens');
          next.delete('q');
        }
        return next;
      }, { replace: true });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [setSearchParams]);

  // 父路由 → iframe：浏览器后退/外链进入时同步镜头
  useEffect(() => {
    if (lensEchoSkipRef.current) {
      lensEchoSkipRef.current = false;
      return;
    }
    if (frameState !== 'ready') return;

    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const q = searchParams.get('q');
    const lens = searchParams.get('lens');
    const payload = q
      ? { type: LENS_MSG, q }
      : lens
        ? { type: LENS_MSG, lens }
        : { type: LENS_MSG };

    try {
      iframe.contentWindow.postMessage(payload, window.location.origin);
    } catch {
      /* ignore */
    }
  }, [searchParams, frameState]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

    const clearLoadTimer = () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };

    const postTheme = () => {
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
      postTheme();
    };
    const onError = () => {
      clearLoadTimer();
      setFrameState('error');
    };

    clearLoadTimer();
    loadTimerRef.current = setTimeout(() => {
      setFrameState((prev) => (prev === 'loading' ? 'error' : prev));
    }, LOAD_TIMEOUT_MS);

    postTheme();
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
