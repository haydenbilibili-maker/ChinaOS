import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './zhongchanContent.html?raw';
import { initZhongchan } from './zhongchanInit.js';
import { resolveZhongchanTab } from '../../lib/zhongchan/routing.js';

/** 中产阶层 GY-08 · #zc-app 样式与 localStorage 隔离 */
export default function ZhongchanPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveZhongchanTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initZhongchan(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="zhongchan-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
