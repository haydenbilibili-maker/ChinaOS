import { useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { getTheme, subscribeTheme } from '../../lib/theme.js';
import './shijian.css';

const THEME_MSG = 'c2os-sj-theme';

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
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => subscribeTheme(setTheme), []);

  // 仅在换卷时重建 src；主题切换走 postMessage，避免整页重载回路
  const frameSrc = useMemo(() => withThemeQuery(htmlSrc, getTheme()), [htmlSrc]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

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

    post();
    iframe.addEventListener('load', post);
    return () => iframe.removeEventListener('load', post);
  }, [theme, frameSrc]);

  return (
    <div className="shijian-page">
      <PageHeader badge={badge} title={title} subtitle={subtitle} />
      <div className="shijian-frame-wrap os-card">
        <iframe
          ref={iframeRef}
          className="shijian-frame"
          title={frameTitle}
          src={frameSrc}
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
