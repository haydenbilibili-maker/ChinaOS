import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jiaoshiContent.html?raw';
import { initJiaoshi } from './jiaoshiInit.js';
import { resolveJiaoshiTab } from '../../lib/jiaoshi/routing.js';

/** 中小学教师 GY-38 · #js-app 样式与 localStorage 隔离 */
export default function JiaoshiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJiaoshiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJiaoshi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jiaoshi-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
