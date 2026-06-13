import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './shuziContent.html?raw';
import { initShuzi } from './shuziInit.js';
import { resolveShuziTab } from '../../lib/shuzi/routing.js';

/** 数字原住民 · 10 后与屏幕养大的一代 GY-26 · #sz-app 样式与 localStorage 隔离 */
export default function ShuziPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveShuziTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initShuzi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="shuzi-module-wrap">
      <div
        id="sz-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
