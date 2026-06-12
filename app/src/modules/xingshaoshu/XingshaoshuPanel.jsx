import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './xingshaoshuContent.html?raw';
import { initXingshaoshu } from './xingshaoshuInit.js';
import { resolveXingshaoshuTab } from '../../lib/xingshaoshu/routing.js';

/** 性少数群像 GY-04 · #xs-app 样式与 localStorage 隔离 */
export default function XingshaoshuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveXingshaoshuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initXingshaoshu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="xingshaoshu-module-wrap">
      <div
        id="xs-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
