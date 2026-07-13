import { useCallback, useEffect, useRef } from 'react';
import contentHtml from './content.html?raw';
import { initHeshanFactsheets } from './factsheetsInit.js';
import HeshanFactsheetMap from './HeshanFactsheetMap.jsx';

/** 重构河山 · #hs-factsheets-app 样式隔离 */
export default function HeshanFactsheetsPanel() {
  const shellRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeshanFactsheets(rootRef.current);
    shellRef.current?.querySelector('.heshan-map-section')?.classList.add('in');
    return cleanup;
  }, []);

  const handleSelectUnit = useCallback((slug) => {
    const root = rootRef.current;
    if (!root) return;
    const card = root.querySelector(`[data-heshan-unit="${slug}"]`);
    if (!card) return;
    root.querySelectorAll('.fc.is-map-highlight').forEach((el) => el.classList.remove('is-map-highlight'));
    card.classList.add('is-map-highlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => card.classList.remove('is-map-highlight'), 2400);
  }, []);

  return (
    <div className="heshanFactsheets-module-wrap">
      <div id="hs-factsheets-shell" ref={shellRef}>
        <HeshanFactsheetMap onSelectUnit={handleSelectUnit} />
        <div ref={rootRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </div>
  );
}
