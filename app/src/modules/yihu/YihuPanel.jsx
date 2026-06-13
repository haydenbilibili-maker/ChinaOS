import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './yihuContent.html?raw';
import { initYihu } from './yihuInit.js';
import { resolveYihuTab } from '../../lib/yihu/routing.js';

/** 医护人员 GY-37 · #yh-app 样式与 localStorage 隔离 */
export default function YihuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveYihuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initYihu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="yihu-module-wrap">
      <div
        id="yh-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
