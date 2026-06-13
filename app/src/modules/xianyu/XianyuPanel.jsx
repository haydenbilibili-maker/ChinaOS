import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './xianyuContent.html?raw';
import { initXianyu } from './xianyuInit.js';
import { resolveXianyuTab } from '../../lib/xianyu/routing.js';

/** 县域青年 · 留下的人 GY-20 · #xy-app 样式与 localStorage 隔离 */
export default function XianyuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveXianyuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initXianyu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="xianyu-module-wrap">
      <div
        id="xy-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
