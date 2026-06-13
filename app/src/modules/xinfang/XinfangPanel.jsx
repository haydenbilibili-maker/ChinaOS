import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './xinfangContent.html?raw';
import { initXinfang } from './xinfangInit.js';
import { resolveXinfangTab } from '../../lib/xinfang/routing.js';

/** 信访群体 GY-58 · #xf-app 样式与 localStorage 隔离 */
export default function XinfangPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveXinfangTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initXinfang(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="xinfang-module-wrap">
      <div
        id="xf-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
