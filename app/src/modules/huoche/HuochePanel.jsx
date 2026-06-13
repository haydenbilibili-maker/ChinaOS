import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './huocheContent.html?raw';
import { initHuoche } from './huocheInit.js';
import { resolveHuocheTab } from '../../lib/huoche/routing.js';

/** 货车司机与公路货运劳动者 GY-27 · #hc-app 样式与 localStorage 隔离 */
export default function HuochePanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveHuocheTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initHuoche(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="huoche-module-wrap">
      <div
        id="hc-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
