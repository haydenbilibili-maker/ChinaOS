import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './hanjianContent.html?raw';
import { initHanjian } from './hanjianInit.js';
import { resolveHanjianTab } from '../../lib/hanjian/routing.js';

/** 罕见病与大病自救群体 GY-53 · #hj-app 样式与 localStorage 隔离 */
export default function HanjianPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveHanjianTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initHanjian(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="hanjian-module-wrap">
      <div
        id="hj-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
