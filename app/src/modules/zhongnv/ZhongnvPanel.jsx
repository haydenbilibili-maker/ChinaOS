import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './zhongnvContent.html?raw';
import { initZhongnv } from './zhongnvInit.js';
import { resolveZhongnvTab } from '../../lib/zhongnv/routing.js';

/** 中年女性 · 被折叠的一代 GY-17 · #zn-app 样式与 localStorage 隔离 */
export default function ZhongnvPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveZhongnvTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initZhongnv(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="zhongnv-module-wrap">
      <div
        id="zn-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
