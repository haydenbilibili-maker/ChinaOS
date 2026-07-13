import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './zhengdiContent.html?raw';
import { initZhengdi } from './zhengdiInit.js';
import { resolveZhengdiTab } from '../../lib/zhengdi/routing.js';

/** 征地拆迁与失地农民 GY-51 · #zd-app 样式与 localStorage 隔离 */
export default function ZhengdiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveZhengdiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initZhengdi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="zhengdi-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
