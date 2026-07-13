import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './baoanContent.html?raw';
import { initBaoan } from './baoanInit.js';
import { resolveBaoanTab } from '../../lib/baoan/routing.js';

/** 保安群体 GY-39 · #ba-app 样式与 localStorage 隔离 */
export default function BaoanPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveBaoanTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initBaoan(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="baoan-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
