import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './baoxianContent.html?raw';
import { initBaoxian } from './baoxianInit.js';
import { resolveBaoxianTab } from '../../lib/baoxian/routing.js';

/** 保险代理与直销末梢 GY-41 · #bx-app 样式与 localStorage 隔离 */
export default function BaoxianPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveBaoxianTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initBaoxian(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="baoxian-module-wrap">
      <div
        id="bx-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
