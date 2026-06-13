import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './zhaiwuContent.html?raw';
import { initZhaiwu } from './zhaiwuInit.js';
import { resolveZhaiwuTab } from '../../lib/zhaiwu/routing.js';

/** 失信被执行人与债务人群 GY-32 · #zw-app 样式与 localStorage 隔离 */
export default function ZhaiwuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveZhaiwuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initZhaiwu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="zhaiwu-module-wrap">
      <div
        id="zw-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
