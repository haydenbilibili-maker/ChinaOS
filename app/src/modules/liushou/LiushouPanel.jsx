import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './liushouContent.html?raw';
import { initLiushou } from './liushouInit.js';
import { resolveLiushouTab } from '../../lib/liushou/routing.js';

/** 农村留守老人 GY-30 · #ll-app 样式与 localStorage 隔离 */
export default function LiushouPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveLiushouTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initLiushou(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="liushou-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
