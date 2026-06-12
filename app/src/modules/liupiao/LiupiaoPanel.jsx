import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './liupiaoContent.html?raw';
import { initLiupiao } from './liupiaoInit.js';
import { resolveLiupiaoTab } from '../../lib/liupiao/routing.js';

/** 流量彩票 · 主播与创作者 GY-14 · #lp-app 样式与 localStorage 隔离 */
export default function LiupiaoPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveLiupiaoTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initLiupiao(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="liupiao-module-wrap">
      <div
        id="lp-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
