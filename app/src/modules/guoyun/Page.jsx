import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader, TabBar } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { GUOYUN_TABS, resolveGuoyunTab } from '../../lib/guoyun/routing.js';
import ChroniclePanel from '../chronicle/ChroniclePanel.jsx';
import GuoyunSimPanel from './GuoyunSimPanel.jsx';
import './guoyun.css';

const LINEAGE_HINT = {
  timeline: '谱系一 · 已发生 —— 1949→2026 七时代六域大事记，把今日处境放回结构演化的经验底片里读。',
  sim: '谱系二 · 未来推演 —— 2012—2036 起局 / 对账 / 推演 / 观测哨，在干支时间轴上展开情景与对账。',
};

/** 国运 · 时间轴（已发生）+ 推演（未来）两谱系合一 */
export default function GuoyunPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = resolveGuoyunTab(searchParams.get('tab'));

  const setTab = useCallback((id) => {
    const next = resolveGuoyunTab(id);
    if (next === 'sim') setSearchParams({}, { replace: true });
    else setSearchParams({ tab: next }, { replace: true });
  }, [setSearchParams]);

  const activeTab = GUOYUN_TABS.find((t) => t.id === tab) || GUOYUN_TABS[1];

  return (
    <div className={`guoyun-unified ${tab === 'timeline' ? 'is-timeline' : 'is-sim'}`}>
      <PageHeader
        badge="国运模拟器 · 两谱系"
        title="国运模拟器"
        subtitle="已发生的结构演化 · 对未来的情景推演 —— 同一模块的两条谱系，互为坐标"
      />

      <TabBar
        tabs={GUOYUN_TABS}
        value={tab}
        onChange={setTab}
        variant="segment"
        sticky
        accent={activeTab.accent}
        className="guoyun-lineage-tabs"
      />

      <div
        className="guoyun-lineage-hint os-card mb-6"
        style={{ borderLeft: `3px solid ${activeTab.accent}` }}
      >
        <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
          {LINEAGE_HINT[tab]}
        </p>
      </div>

      {tab === 'timeline' ? <ChroniclePanel /> : <GuoyunSimPanel />}
      <ModuleFooter moduleId="guoyun" />
    </div>
  );
}
