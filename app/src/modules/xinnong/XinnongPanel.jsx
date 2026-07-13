import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './xinnongContent.html?raw';
import { initXinnong } from './xinnongInit.js';
import { resolveXinnongTab } from '../../lib/xinnong/routing.js';

/** 职业农民与新农人 GY-35 · #xn-app 样式与 localStorage 隔离 */
export default function XinnongPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveXinnongTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initXinnong(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="xinnong-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
