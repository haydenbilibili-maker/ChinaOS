import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './tuiyiContent.html?raw';
import { initTuiyi } from './tuiyiInit.js';
import { resolveTuiyiTab } from '../../lib/tuiyi/routing.js';

/** 退役军人 · 预装组织力 GY-12 · #ty-app 样式与 localStorage 隔离 */
export default function TuiyiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveTuiyiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initTuiyi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="tuiyi-module-wrap">
      <div
        id="ty-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
