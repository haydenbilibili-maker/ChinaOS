import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './ertongContent.html?raw';
import { initErtong } from './ertongInit.js';
import { resolveErtongTab } from '../../lib/ertong/routing.js';

/** 流动与留守儿童 GY-54 · #et-app 样式与 localStorage 隔离 */
export default function ErtongPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveErtongTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initErtong(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="ertong-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
