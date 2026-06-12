import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './yiyiContent.html?raw';
import { initYiyi } from './yiyiInit.js';
import { resolveYiyiTab } from '../../lib/yiyi/routing.js';

/** 意义市场 · 信仰人群 GY-13 · #ym-app 样式与 localStorage 隔离 */
export default function YiyiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveYiyiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initYiyi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="yiyi-module-wrap">
      <div
        id="ym-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
