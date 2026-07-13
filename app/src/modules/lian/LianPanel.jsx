import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './lianContent.html?raw';
import { initLian } from './lianInit.js';
import { resolveLianTab } from '../../lib/lian/routing.js';

/** 离岸中国人 · 境外节点与未结清的账户 GY-16 · #la-app 样式与 localStorage 隔离 */
export default function LianPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveLianTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initLian(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="lian-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
