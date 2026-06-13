import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './bianjiangContent.html?raw';
import { initBianjiang } from './bianjiangInit.js';
import { resolveBianjiangTab } from '../../lib/bianjiang/routing.js';

/** 边疆少数民族 GY-48 · #bj-app 样式与 localStorage 隔离 */
export default function BianjiangPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveBianjiangTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initBianjiang(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="bianjiang-module-wrap">
      <div
        id="bj-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
