import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import './shijian.css';

/**
 * 史鉴 SJ-00 · 总索引
 * 卷轴风格报告以 public/shijian/SJ-00.html 为真源；本壳提供侧栏路由与 GY 交叉链接。
 */
export default function ShijianPage() {
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
        /* same-origin public asset; ignore cross-origin edge cases */
      }
    };

    iframe.addEventListener('load', syncHeight);
    const t = window.setInterval(syncHeight, 800);
    return () => {
      iframe.removeEventListener('load', syncHeight);
      window.clearInterval(t);
    };
  }, []);

  return (
    <div className="shijian-page">
      <PageHeader
        badge="SJ-00 · 史鉴"
        title="史鉴总索引"
        subtitle="治乱螺旋 · 四步引擎 · 与 GY 交叉引用"
      />
      <div className="shijian-frame-wrap os-card">
        <iframe
          ref={iframeRef}
          className="shijian-frame"
          title="SJ-00 史鉴总索引"
          src="/shijian/SJ-00.html"
          style={{ height: frameH }}
        />
      </div>
      <p className="shijian-open-hint">
        亦可直接打开单页报告：
        {' '}
        <a href="/shijian/SJ-00.html" target="_blank" rel="noreferrer">/shijian/SJ-00.html</a>
      </p>
      <ModuleFooter moduleId="shijianSJ00" />
    </div>
  );
}
