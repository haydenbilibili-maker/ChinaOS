import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './wangyueContent.html?raw';
import { initWangyue } from './wangyueInit.js';
import { resolveWangyueTab } from '../../lib/wangyue/routing.js';

/** 网约车司机 GY-40 · #wy-app 样式与 localStorage 隔离 */
export default function WangyuePanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveWangyueTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initWangyue(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="wangyue-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
