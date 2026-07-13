import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './shiduContent.html?raw';
import { initShidu } from './shiduInit.js';
import { resolveShiduTab } from '../../lib/shidu/routing.js';

/** 失独与计生后遗人群 · 政策账单的活体 GY-25 · #sd-app 样式与 localStorage 隔离 */
export default function ShiduPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveShiduTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initShidu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="shidu-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
