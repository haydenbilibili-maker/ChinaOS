import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './fanguiContent.html?raw';
import { initFangui } from './fanguiInit.js';
import { resolveFanguiTab } from '../../lib/fangui/routing.js';

/** 被拐卖与反拐救助对象 GY-52 · #fg-app 样式与 localStorage 隔离 */
export default function FanguiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveFanguiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initFangui(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="fangui-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
