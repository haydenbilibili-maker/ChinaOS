import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './gongyiContent.html?raw';
import { initGongyi } from './gongyiInit.js';
import { resolveGongyiTab } from '../../lib/gongyi/routing.js';

/** 工程移民与生态移民 GY-56 · #gc-app 样式与 localStorage 隔离 */
export default function GongyiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveGongyiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initGongyi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="gongyi-module-wrap">
      <div
        id="gc-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
