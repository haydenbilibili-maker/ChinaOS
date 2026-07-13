import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './zhiyebingContent.html?raw';
import { initZhiyebing } from './zhiyebingInit.js';
import { resolveZhiyebingTab } from '../../lib/zhiyebing/routing.js';

/** 尘肺与职业病/工伤群体 GY-50 · #zb-app 样式与 localStorage 隔离 */
export default function ZhiyebingPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveZhiyebingTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initZhiyebing(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="zhiyebing-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
