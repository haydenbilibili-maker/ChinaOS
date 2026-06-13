import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './funvContent.html?raw';
import { initFunv } from './funvInit.js';
import { resolveFunvTab } from '../../lib/funv/routing.js';

/** 农村留守妇女 GY-45 · #fn-app 样式与 localStorage 隔离 */
export default function FunvPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveFunvTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initFunv(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="funv-module-wrap">
      <div
        id="fn-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
