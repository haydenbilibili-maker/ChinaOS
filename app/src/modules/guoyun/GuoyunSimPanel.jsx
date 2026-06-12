import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './guoyunContent.html?raw';
import { initGuoyun } from './guoyunInit.js';

/** 国运推演谱系 · #gy-app 样式与 localStorage 隔离 */
export default function GuoyunSimPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(() => ({
    panel: searchParams.get('panel') || undefined,
    scenario: searchParams.get('scenario') || undefined,
    var: searchParams.get('var') || undefined,
    watch: searchParams.get('watch') || undefined,
  }), [searchParams]);

  useEffect(() => {
    const cleanup = initGuoyun(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

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
