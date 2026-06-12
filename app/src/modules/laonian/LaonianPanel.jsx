import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './laonianContent.html?raw';
import { initLaonian } from './laonianInit.js';
import { resolveLaonianTab } from '../../lib/laonian/routing.js';

/** 老年群体 GY-09 · #ln-app 样式与 localStorage 隔离 */
export default function LaonianPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveLaonianTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initLaonian(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="laonian-module-wrap">
      <div
        id="ln-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
