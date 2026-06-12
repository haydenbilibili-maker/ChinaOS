import { useEffect, useRef } from 'react';
import contentHtml from './guoyunContent.html?raw';
import { initGuoyun } from './guoyunInit.js';
import './guoyun.css';

/** 国运推演 · 2012—2036 · 起局 / 对账 / 推演 / 观测哨 */
export default function GuoyunPage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initGuoyun(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div className="guoyun-module-wrap">
      <div
        id="gy-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
