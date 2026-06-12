import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './zhixiaoContent.html?raw';
import { initZhixiao } from './zhixiaoInit.js';
import { resolveZhixiaoTab } from '../../lib/zhixiao/routing.js';

/** 职校生 · 被分流的一半 GY-11 · #zx-app 样式与 localStorage 隔离 */
export default function ZhixiaoPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveZhixiaoTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initZhixiao(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="zhixiao-module-wrap">
      <div
        id="zx-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
