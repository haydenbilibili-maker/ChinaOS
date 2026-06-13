import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './chengxuContent.html?raw';
import { initChengxu } from './chengxuInit.js';
import { resolveChengxuTab } from '../../lib/chengxu/routing.js';

/** 程序员与大厂白领 GY-28 · #cx-app 样式与 localStorage 隔离 */
export default function ChengxuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveChengxuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initChengxu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="chengxu-module-wrap">
      <div
        id="cx-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
