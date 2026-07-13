import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ATTRIBUTION_DISCLAIMERS, LAYER_META, POWER_LAYERS } from '../../domain/governance.ts';
import LayerDiagram from './components/LayerDiagram';
import VerdictCard from './components/VerdictCard';
import { judgeIssue } from './judgment.ts';
import { useAttributionStore } from './useAttributionStore';

const EMPTY_CUSTOM = {
  title: '',
  layer: 'decision',
  rationale: '',
  accountableActor: '',
  reasonableExpectation: '',
  misattribution: '',
  tags: '',
};

export default function AttributionAnalyzer() {
  const { allIssues, seedIssues, customIssues, addCustomIssue, removeCustomIssue, exportJson } =
    useAttributionStore();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const linkedIssue = searchParams.get('issue');
    if (!linkedIssue) return;
    const issue = allIssues.find((i) => i.id === linkedIssue);
    if (issue) {
      setSelectedId(issue.id);
      setQuery(issue.title);
    }
  }, [searchParams, allIssues]);
  const [layerFilter, setLayerFilter] = useState('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState(EMPTY_CUSTOM);

  const filteredPresets = useMemo(() => {
    let list = seedIssues;
    if (layerFilter !== 'all') list = list.filter((i) => i.layer === layerFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [seedIssues, layerFilter, query]);

  const judgment = useMemo(
    () => judgeIssue(query, allIssues, selectedId || undefined),
    [query, allIssues, selectedId],
  );

  function handleSelectPreset(id) {
    setSelectedId(id);
    const issue = allIssues.find((i) => i.id === id);
    if (issue) setQuery(issue.title);
  }

  function handleJudge() {
    setSelectedId('');
  }

  function handleAddCustom(e) {
    e.preventDefault();
    if (!customForm.title.trim()) return;
    const issue = addCustomIssue({
      ...customForm,
      tags: customForm.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
    });
    setCustomForm(EMPTY_CUSTOM);
    setShowCustomForm(false);
    setSelectedId(issue.id);
    setQuery(issue.title);
  }

  return (
    <div id="aa-app">
      <div className="aa-wrap">
        <header className="aa-masthead">
          <div className="aa-brand">
            <span className="aa-glyph">AA</span>
            <h1>
              三层归因分析器
              <span> · 摆对被告席</span>
            </h1>
          </div>
          <div className="aa-meta">
            <div>规则判定 · 非 LLM</div>
            <div>
              库容 <b>{allIssues.length}</b> 条（种子 {seedIssues.length} + 自定义 {customIssues.length}）
            </div>
          </div>
        </header>

        <section className="aa-section">
          <div className="aa-section-head">
            <span className="aa-section-tier">1</span>
            <h2>判定器</h2>
            <span className="aa-desc">自由文本或预置库 → 归因判定卡</span>
          </div>

          <div className="aa-judge-panel">
            <div className="aa-input-row">
              <input
                type="text"
                className="aa-input"
                placeholder="输入政策议题，如「扭转通缩」「清理拖欠账款」…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedId('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleJudge()}
              />
              <button type="button" className="aa-btn primary" onClick={handleJudge}>
                判定
              </button>
            </div>

            <div className="aa-filter-row">
              <span className="aa-filter-label">层级筛选</span>
              <button
                type="button"
                className={`aa-chip ${layerFilter === 'all' ? 'on' : ''}`}
                onClick={() => setLayerFilter('all')}
              >
                全部
              </button>
              {POWER_LAYERS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`aa-chip ${layerFilter === l ? 'on' : ''}`}
                  style={{ '--chip-color': LAYER_META[l].color }}
                  onClick={() => setLayerFilter(l)}
                >
                  {LAYER_META[l].shortLabel}
                </button>
              ))}
            </div>

            <div className="aa-preset-grid">
              {filteredPresets.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  className={`aa-preset-card ${selectedId === issue.id ? 'selected' : ''}`}
                  style={{ '--card-layer': LAYER_META[issue.layer].color }}
                  onClick={() => handleSelectPreset(issue.id)}
                >
                  <span className="aa-preset-layer">{LAYER_META[issue.layer].shortLabel}</span>
                  <span className="aa-preset-title">{issue.title}</span>
                </button>
              ))}
            </div>
          </div>

          <VerdictCard result={judgment} />
        </section>

        <section className="aa-section">
          <div className="aa-section-head">
            <span className="aa-section-tier">2</span>
            <h2>结构性诊断</h2>
            <span className="aa-desc">SVG 分层图 · 分裂指数</span>
          </div>
          <LayerDiagram issues={allIssues} />
        </section>

        <section className="aa-section">
          <div className="aa-section-head">
            <span className="aa-section-tier">3</span>
            <h2>自定义议题</h2>
            <span className="aa-desc">localStorage 持久化 · 导出 JSON</span>
          </div>

          <div className="aa-custom-toolbar">
            <button type="button" className="aa-btn" onClick={() => setShowCustomForm((v) => !v)}>
              {showCustomForm ? '取消录入' : '+ 新增议题'}
            </button>
            <button type="button" className="aa-btn" onClick={exportJson}>
              导出 JSON
            </button>
          </div>

          {showCustomForm && (
            <form className="aa-custom-form" onSubmit={handleAddCustom}>
              <input
                className="aa-input"
                placeholder="议题名称 *"
                value={customForm.title}
                onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                required
              />
              <select
                className="aa-input"
                value={customForm.layer}
                onChange={(e) => setCustomForm({ ...customForm, layer: e.target.value })}
              >
                {POWER_LAYERS.map((l) => (
                  <option key={l} value={l}>{LAYER_META[l].label}</option>
                ))}
              </select>
              <textarea
                className="aa-input"
                placeholder="判定理由"
                rows={2}
                value={customForm.rationale}
                onChange={(e) => setCustomForm({ ...customForm, rationale: e.target.value })}
              />
              <textarea
                className="aa-input"
                placeholder="该问责谁（结构位置，非个人）"
                rows={2}
                value={customForm.accountableActor}
                onChange={(e) => setCustomForm({ ...customForm, accountableActor: e.target.value })}
              />
              <textarea
                className="aa-input"
                placeholder="可合理期待什么"
                rows={2}
                value={customForm.reasonableExpectation}
                onChange={(e) => setCustomForm({ ...customForm, reasonableExpectation: e.target.value })}
              />
              <textarea
                className="aa-input"
                placeholder="常见误诊（可选）"
                rows={2}
                value={customForm.misattribution}
                onChange={(e) => setCustomForm({ ...customForm, misattribution: e.target.value })}
              />
              <input
                className="aa-input"
                placeholder="标签，逗号分隔"
                value={customForm.tags}
                onChange={(e) => setCustomForm({ ...customForm, tags: e.target.value })}
              />
              <button type="submit" className="aa-btn primary">保存到本地库</button>
            </form>
          )}

          {customIssues.length > 0 && (
            <ul className="aa-custom-list">
              {customIssues.map((issue) => (
                <li key={issue.id}>
                  <button
                    type="button"
                    className="aa-custom-item"
                    onClick={() => handleSelectPreset(issue.id)}
                  >
                    <span style={{ color: LAYER_META[issue.layer].color }}>
                      [{LAYER_META[issue.layer].shortLabel}]
                    </span>
                    {issue.title}
                  </button>
                  <button
                    type="button"
                    className="aa-btn danger sm"
                    onClick={() => removeCustomIssue(issue.id)}
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="aa-footer">
          <h3>使用告诫</h3>
          <ol>
            {ATTRIBUTION_DISCLAIMERS.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ol>
          <p className="aa-footer-note">
            本工具评估结构位置，不对在任官员做个人功过评分；判定基于显式规则与种子数据，可审计、可复现。
          </p>
        </footer>
      </div>
    </div>
  );
}
