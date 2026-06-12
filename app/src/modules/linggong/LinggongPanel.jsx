import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './linggongContent.html?raw';
import { initLinggong } from './linggongInit.js';
import { resolveLinggongTab } from '../../lib/linggong/routing.js';

/** 零工经济人群 GY-05 · #lg-app 样式与 localStorage 隔离 */
export default function LinggongPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveLinggongTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initLinggong(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="linggong-module-wrap">
      <div
        id="lg-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
