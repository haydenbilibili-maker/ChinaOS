import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './yulunContent.html?raw';
import { initYulun } from './yulunInit.js';
import { resolveYulunTab } from '../../lib/yulun/routing.js';

/** 网络舆论场人群 GY-36 · #yl-app 样式与 localStorage 隔离 */
export default function YulunPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveYulunTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initYulun(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="yulun-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
