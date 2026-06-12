import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { TabBar } from './ui.jsx';
import { Markdown } from '../lib/ai/markdown.jsx';
import {
  chat,
  loadConfig,
  saveConfig,
  isConfigured,
  testConnection,
  PROVIDERS,
} from '../lib/ai/client.js';

// ============================================================================
// AI 助手 · 浮动启动器（全局挂载，无需路由）
// ----------------------------------------------------------------------------
// 三种模式（辅助决策 / 辅助阅读 / 深度研究）以不同 system prompt 引导模型；
// 密钥仅存浏览器本地（c2os-ai-config），对话历史存 c2os-ai-history。
// 玻璃拟态面板全部使用 CSS 变量，随日/夜主题自适应。
// ============================================================================

const HISTORY_KEY = 'c2os-ai-history';

const MODES = [
  {
    id: 'decision',
    label: '辅助决策',
    system:
      '你是 China OS 的政策推演助手，面向严谨的中国问题研究者。请以冷峻中立、侧重逻辑推演与成本/收益/物理约束的书面简体中文作答；穿透宏观叙事，解析权力运作与制度演进的底层逻辑。给出选项时附成本、风险与建议。',
  },
  {
    id: 'reading',
    label: '辅助阅读',
    system:
      '你是 China OS 的阅读助手。请用简体中文帮助用户拆解、概括与解释材料：提炼关键论点、术语、数据与逻辑链条，必要时补充背景，保持客观克制，不夸大不臆断。',
  },
  {
    id: 'research',
    label: '深度研究',
    system:
      '你是 China OS 的深度研究助手。请进行结构化深度分析：背景/现状/数据/推演/结论分层展开，标注关键不确定性与证据强度，使用严谨书面简体中文，避免翻译腔与逻辑断层。',
  },
];

const PANEL_BG = 'color-mix(in srgb, var(--bg-surface) 92%, transparent)';

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function Bubble({ role, content, streaming }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      <div
        style={{
          maxWidth: '88%',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-relaxed)',
          background: isUser ? 'var(--accent-soft)' : 'var(--bg-elevated)',
          border: `1px solid ${isUser ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
          color: isUser ? 'var(--text-primary)' : 'var(--text-secondary)',
          whiteSpace: isUser ? 'pre-wrap' : 'normal',
          wordBreak: 'break-word',
        }}
      >
        {isUser ? content : <Markdown text={content || (streaming ? '…' : '')} />}
      </div>
    </div>
  );
}

function SettingsForm({ onSaved, onClose }) {
  const [cfg, setCfg] = useState(() => loadConfig());
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const onProvider = (provider) => {
    const preset = PROVIDERS[provider] || PROVIDERS.custom;
    setCfg((c) => ({
      ...c,
      provider,
      baseURL: preset.baseURL || c.baseURL,
      model: preset.model || c.model,
    }));
  };

  const save = () => {
    saveConfig(cfg);
    onSaved?.(cfg);
  };

  const test = async () => {
    setTesting(true);
    setResult(null);
    try {
      saveConfig(cfg);
      await testConnection(cfg);
      setResult({ ok: true, msg: '连接成功' });
      onSaved?.(cfg);
    } catch (e) {
      setResult({ ok: false, msg: e?.message || '连接失败' });
    } finally {
      setTesting(false);
    }
  };

  const field = (label, node) => (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>{label}</span>
      {node}
    </label>
  );

  return (
    <div style={{ padding: '12px 14px', overflowY: 'auto' }}>
      <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
        密钥仅保存在本浏览器（localStorage），不会上传或写入代码。
      </div>

      {field('供应商', (
        <select
          className="os-input"
          style={{ width: '100%' }}
          value={cfg.provider}
          onChange={(e) => onProvider(e.target.value)}
        >
          {Object.entries(PROVIDERS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      ))}

      <div className="text-[11px] mb-3" style={{ color: 'var(--text-tertiary)' }}>
        {(PROVIDERS[cfg.provider] || PROVIDERS.custom).hint}
      </div>

      {field('Base URL', (
        <input
          className="os-input"
          style={{ width: '100%' }}
          value={cfg.baseURL}
          placeholder="https://api.openai.com/v1"
          onChange={(e) => setCfg((c) => ({ ...c, baseURL: e.target.value }))}
        />
      ))}

      {field('模型', (
        <input
          className="os-input"
          style={{ width: '100%' }}
          value={cfg.model}
          placeholder="gpt-4o-mini"
          onChange={(e) => setCfg((c) => ({ ...c, model: e.target.value }))}
        />
      ))}

      {field('API Key', (
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="os-input"
            style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
            type={showKey ? 'text' : 'password'}
            value={cfg.apiKey}
            placeholder="sk-…"
            autoComplete="off"
            onChange={(e) => setCfg((c) => ({ ...c, apiKey: e.target.value }))}
          />
          <button
            type="button"
            className="os-btn os-btn-sm"
            onClick={() => setShowKey((v) => !v)}
            aria-label={showKey ? '隐藏密钥' : '显示密钥'}
          >
            {showKey ? <Lucide.EyeOff size={14} /> : <Lucide.Eye size={14} />}
          </button>
        </div>
      ))}

      {result && (
        <div
          className="text-xs mono mb-2"
          style={{ color: result.ok ? 'var(--cyber-cyan)' : 'var(--china-red)' }}
        >
          {result.ok ? '// ' : '// 错误：'}{result.msg}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        <button type="button" className="os-btn os-btn-primary os-btn-sm" onClick={save}>保存</button>
        <button type="button" className="os-btn os-btn-sm" onClick={test} disabled={testing}>
          {testing ? '测试中…' : '测试连接'}
        </button>
        <button type="button" className="os-btn os-btn-ghost os-btn-sm" style={{ marginLeft: 'auto' }} onClick={onClose}>返回</button>
      </div>
    </div>
  );
}

export default function AiLauncher() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('decision');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configured, setConfigured] = useState(() => isConfigured());
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  // 持久化对话历史
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      /* 忽略写入失败 */
    }
  }, [messages]);

  // 新消息滚动到底
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const refreshConfigured = useCallback(() => setConfigured(isConfigured()), []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    if (!isConfigured()) {
      setSettingsOpen(true);
      return;
    }
    setError(null);
    setInput('');
    const sys = MODES.find((m) => m.id === mode)?.system || '';
    const next = [...messages, { role: 'user', content: text }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let acc = '';
    try {
      await chat({
        signal: controller.signal,
        messages: [
          { role: 'system', content: sys },
          ...next.map((m) => ({ role: m.role, content: m.content })),
        ],
        onToken: (delta) => {
          acc += delta;
          setMessages((prev) => {
            const copy = prev.slice();
            copy[copy.length - 1] = { role: 'assistant', content: acc };
            return copy;
          });
        },
      });
    } catch (e) {
      if (e?.name === 'AbortError') {
        // 用户主动停止：保留已生成内容
      } else if (e?.code === 'NOT_CONFIGURED') {
        setSettingsOpen(true);
        setMessages((prev) => prev.slice(0, -1));
      } else {
        setError(e?.message || '请求失败');
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [input, busy, mode, messages]);

  const stop = () => abortRef.current?.abort();
  const clearChat = () => { setMessages([]); setError(null); };

  const onInputKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开 AI 助手"
        className="os-ai-fab"
        style={{
          position: 'fixed', right: 20, bottom: 20, zIndex: 900,
          width: 52, height: 52, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--btn-primary-bg)',
          border: '1px solid var(--accent-border)',
          color: 'var(--cyber-cyan)',
          cursor: 'pointer', backdropFilter: 'blur(8px)',
        }}
      >
        <Lucide.Sparkles size={22} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <div
      className="os-ai-panel"
      style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 901,
        width: 'min(400px, calc(100vw - 24px))',
        height: 'min(78vh, 680px)',
        display: 'flex', flexDirection: 'column',
        background: PANEL_BG,
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}
    >
      {/* 头部 */}
      <div
        className="flex items-center gap-2 px-3"
        style={{ height: 48, borderBottom: '1px solid var(--border-subtle)' }}
      >
        <Lucide.Sparkles size={16} style={{ color: 'var(--cyber-cyan)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI 助手</span>
        <span className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>研究参考</span>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className="os-btn os-btn-ghost os-btn-sm" onClick={clearChat} aria-label="清空对话" title="清空对话">
            <Lucide.Trash2 size={14} />
          </button>
          <button
            type="button"
            className="os-btn os-btn-ghost os-btn-sm"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-label="AI 设置"
            title="设置 API Key"
            style={settingsOpen ? { color: 'var(--cyber-cyan)' } : undefined}
          >
            <Lucide.Settings size={14} />
          </button>
          <button type="button" className="os-btn os-btn-ghost os-btn-sm" onClick={() => setOpen(false)} aria-label="关闭">
            <Lucide.X size={15} />
          </button>
        </div>
      </div>

      {settingsOpen ? (
        <SettingsForm
          onSaved={() => { refreshConfigured(); }}
          onClose={() => { setSettingsOpen(false); refreshConfigured(); }}
        />
      ) : (
        <>
          {/* 模式切换 */}
          <div className="px-3 pt-2.5">
            <TabBar
              tabs={MODES.map((m) => ({ id: m.id, label: m.label }))}
              value={mode}
              onChange={setMode}
              variant="segment"
              accent="var(--cyber-cyan)"
              className="!mb-2"
            />
          </div>

          {/* 消息区 */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '6px 14px 4px' }}>
            {!configured && (
              <div
                className="os-card"
                style={{ padding: 12, marginBottom: 12, background: 'var(--bg-elevated)' }}
              >
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>尚未配置 API Key</div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  配置任一 OpenAI 兼容服务或 Anthropic 即可开始对话。密钥仅存本地。
                </div>
                <button type="button" className="os-btn os-btn-primary os-btn-sm" onClick={() => setSettingsOpen(true)}>
                  <Lucide.Settings size={13} /> 去配置
                </button>
              </div>
            )}

            {messages.length === 0 && configured && (
              <div className="text-xs mono py-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
                // 选择模式后开始提问
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble
                key={i}
                role={m.role}
                content={m.content}
                streaming={busy && i === messages.length - 1 && m.role === 'assistant'}
              />
            ))}

            {error && (
              <div className="text-xs mono" style={{ color: 'var(--china-red)', padding: '4px 2px' }}>
                // 错误：{error}
              </div>
            )}
          </div>

          {/* 输入区 */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '8px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <textarea
                className="os-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={configured ? '输入问题，Enter 发送 / Shift+Enter 换行' : '请先配置 API Key'}
                style={{ flex: 1, resize: 'none', maxHeight: 120, fontFamily: 'inherit' }}
              />
              {busy ? (
                <button type="button" className="os-btn os-btn-sm" onClick={stop} aria-label="停止生成">
                  <Lucide.Square size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  className="os-btn os-btn-primary os-btn-sm"
                  onClick={send}
                  disabled={!input.trim()}
                  aria-label="发送"
                >
                  <Lucide.SendHorizontal size={15} />
                </button>
              )}
            </div>
            <div className="text-[10px] mono mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
              AI 输出仅供研究参考，请独立核实。
            </div>
          </div>
        </>
      )}
    </div>
  );
}
