import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './qingnianContent.html?raw';
import { initQingnian } from './qingnianInit.js';
import { resolveQingnianTab } from '../../lib/qingnian/routing.js';

/** 青年 GY-03 · #qn-app 样式与 localStorage 隔离 */
export default function QingnianPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveQingnianTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initQingnian(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="qingnian-module-wrap">
      <div
        id="qn-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
