import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './tajianContent.html?raw';
import { initTajian } from './tajianInit.js';
import { resolveTajianTab } from '../../lib/tajian/routing.js';

/** 塔尖 · 高净值与企业家 GY-10 · #tj-app 样式与 localStorage 隔离 */
export default function TajianPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveTajianTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initTajian(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="tajian-module-wrap">
      <div
        id="tj-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
