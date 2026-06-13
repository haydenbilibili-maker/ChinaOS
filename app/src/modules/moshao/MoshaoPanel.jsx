import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './moshaoContent.html?raw';
import { initMoshao } from './moshaoInit.js';
import { resolveMoshaoTab } from '../../lib/moshao/routing.js';

/** 基层治理末梢 · 网格员、辅警、社工、协管 GY-24 · #ms-app 样式与 localStorage 隔离 */
export default function MoshaoPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveMoshaoTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initMoshao(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="moshao-module-wrap">
      <div
        id="ms-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
