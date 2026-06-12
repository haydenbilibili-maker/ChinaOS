import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './nongmingongContent.html?raw';
import { initNongmingong } from './nongmingongInit.js';
import { resolveNongmingongTab } from '../../lib/nongmingong/routing.js';

/** 农民工(新生代) GY-06 · #nm-app 样式与 localStorage 隔离 */
export default function NongmingongPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveNongmingongTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initNongmingong(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="nongmingong-module-wrap">
      <div
        id="nm-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
