import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './tizhineiContent.html?raw';
import { initTizhinei } from './tizhineiInit.js';
import { resolveTizhineiTab } from '../../lib/tizhinei/routing.js';

/** 体制内人群 GY-07 · #tz-app 样式与 localStorage 隔离 */
export default function TizhineiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveTizhineiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initTizhinei(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="tizhinei-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
