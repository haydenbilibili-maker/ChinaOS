import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './xinyiminContent.html?raw';
import { initXinyimin } from './xinyiminInit.js';
import { resolveXinyiminTab } from '../../lib/xinyimin/routing.js';

/** 城市新移民与夹心层 · 有城无籍 GY-21 · #xm-app 样式与 localStorage 隔离 */
export default function XinyiminPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveXinyiminTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initXinyimin(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="xinyimin-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
