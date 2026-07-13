import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './junrenContent.html?raw';
import { initJunren } from './junrenInit.js';
import { resolveJunrenTab } from '../../lib/junren/routing.js';

/** 现役军人 GY-47 · #jr-app 样式与 localStorage 隔离 */
export default function JunrenPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJunrenTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJunren(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="junren-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
