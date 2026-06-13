import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './ganranContent.html?raw';
import { initGanran } from './ganranInit.js';
import { resolveGanranTab } from '../../lib/ganran/routing.js';

/** 受污名疾病与感染者群体 GY-57 · #gr-app 样式与 localStorage 隔离 */
export default function GanranPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveGanranTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initGanran(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="ganran-module-wrap">
      <div
        id="gr-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
