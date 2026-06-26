import { useEffect, useRef } from 'react';
import contentHtml from './content.html?raw';
import { initHeshanFactsheets } from './factsheetsInit.js';

/** 重构河山 · #hs-factsheets-app 样式隔离 */
export default function HeshanFactsheetsPanel() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeshanFactsheets(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div className="heshanFactsheets-module-wrap">
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
