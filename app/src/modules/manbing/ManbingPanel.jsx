import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './manbingContent.html?raw';
import { initManbing } from './manbingInit.js';
import { resolveManbingTab } from '../../lib/manbing/routing.js';

/** 带病生存的年轻人 · 健康的阶层化 GY-23 · #mb-app 样式与 localStorage 隔离 */
export default function ManbingPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveManbingTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initManbing(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="manbing-module-wrap">
      <div
        id="mb-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
