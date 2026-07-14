import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import './shijian.css';

/**
 * 史鉴 HTML 单页壳：iframe 载入 public/shijian/SJ-XX.html，供侧栏路由复用。
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
  const [frameH, setFrameH] = useState(2400);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

    const syncHeight = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc?.body) return;
        const h = Math.max(doc.body.scrollHeight, doc.documentElement?.scrollHeight || 0, 1600);
        setFrameH(h + 24);
      } catch {
        /* same-origin public asset */
      }
    };

    iframe.addEventListener('load', syncHeight);
    const t = window.setInterval(syncHeight, 800);
    return () => {
      iframe.removeEventListener('load', syncHeight);
      window.clearInterval(t);
    };
  }, [htmlSrc]);

  return (
    <div className="shijian-page">
      <PageHeader badge={badge} title={title} subtitle={subtitle} />
      <div className="shijian-frame-wrap os-card">
        <iframe
          ref={iframeRef}
          className="shijian-frame"
          title={frameTitle}
          src={htmlSrc}
          style={{ height: frameH }}
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
