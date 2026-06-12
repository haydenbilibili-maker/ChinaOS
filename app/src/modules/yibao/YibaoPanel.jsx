import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './yibaoContent.html?raw';
import { initYibao } from './yibaoInit.js';
import { resolveYibaoTab } from '../../lib/yibao/routing.js';

/** 医保里的人 · 慢病与老龄财政 GY-15 · #yb-app 样式与 localStorage 隔离 */
export default function YibaoPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveYibaoTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initYibao(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="yibao-module-wrap">
      <div
        id="yb-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
