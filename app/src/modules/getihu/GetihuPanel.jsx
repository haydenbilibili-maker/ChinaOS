import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './getihuContent.html?raw';
import { initGetihu } from './getihuInit.js';
import { resolveGetihuTab } from '../../lib/getihu/routing.js';

/** 个体工商户与小微商家 GY-29 · #gt-app 样式与 localStorage 隔离 */
export default function GetihuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveGetihuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initGetihu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="getihu-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
