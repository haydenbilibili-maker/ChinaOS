import { useEffect, useRef } from 'react';
import contentHtml from './guoyunContent.html?raw';
import { initGuoyun } from './guoyunInit.js';

/** 国运推演谱系 · #gy-app 样式与 localStorage 隔离 */
export default function GuoyunSimPanel() {
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
