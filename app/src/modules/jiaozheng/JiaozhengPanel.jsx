import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jiaozhengContent.html?raw';
import { initJiaozheng } from './jiaozhengInit.js';
import { resolveJiaozhengTab } from '../../lib/jiaozheng/routing.js';

/** 社区矫正与刑释人员 GY-44 · #jc-app 样式与 localStorage 隔离 */
export default function JiaozhengPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJiaozhengTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJiaozheng(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jiaozheng-module-wrap">
      <div
        id="jc-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
