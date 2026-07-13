import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jingzhangContent.html?raw';
import { initJingzhang } from './jingzhangInit.js';
import { resolveJingzhangTab } from '../../lib/jingzhang/routing.js';

/** 精神障碍者与被监护人 GY-55 · #jh-app 样式与 localStorage 隔离 */
export default function JingzhangPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJingzhangTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJingzhang(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jingzhang-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
