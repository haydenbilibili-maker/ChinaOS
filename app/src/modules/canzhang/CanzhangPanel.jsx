import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './canzhangContent.html?raw';
import { initCanzhang } from './canzhangInit.js';
import { resolveCanzhangTab } from '../../lib/canzhang/routing.js';

/** 残障人群 · 可见性的零点 GY-18 · #cz-app 样式与 localStorage 隔离 */
export default function CanzhangPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveCanzhangTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initCanzhang(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="canzhang-module-wrap">
      <div
        id="cz-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
