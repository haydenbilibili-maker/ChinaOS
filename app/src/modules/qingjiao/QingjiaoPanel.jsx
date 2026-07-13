import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './qingjiaoContent.html?raw';
import { initQingjiao } from './qingjiaoInit.js';
import { resolveQingjiaoTab } from '../../lib/qingjiao/routing.js';

/** 高校青椒与过剩博士 GY-33 · #qj-app 样式与 localStorage 隔离 */
export default function QingjiaoPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveQingjiaoTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initQingjiao(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="qingjiao-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
