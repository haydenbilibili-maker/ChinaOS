// ============================================================================
// AI 客户端 · provider-agnostic 聊天调用（China OS AI 助手）
// ----------------------------------------------------------------------------
// 支持两种 API 形态：
//   · OpenAI 兼容（/chat/completions）—— OpenAI / DeepSeek / 自定义 baseURL
//   · Anthropic messages API（/v1/messages）
// 配置从 localStorage 读取（key: c2os-ai-config），密钥仅存浏览器本地，绝不硬编码。
// 既支持流式（fetch + ReadableStream/SSE），也支持普通一次性返回。
// ============================================================================

export const AI_CONFIG_KEY = 'c2os-ai-config';

// 供应商预设：决定 API 形态、默认 baseURL 与默认模型
export const PROVIDERS = {
  openai: {
    label: 'OpenAI 兼容',
    style: 'openai',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    hint: 'OpenAI 官方或任何兼容 /chat/completions 的服务',
  },
  deepseek: {
    label: 'DeepSeek',
    style: 'openai',
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    hint: 'DeepSeek 开放平台（OpenAI 兼容）',
  },
  anthropic: {
    label: 'Anthropic',
    style: 'anthropic',
    baseURL: 'https://api.anthropic.com',
    model: 'claude-3-5-sonnet-latest',
    hint: 'Claude messages API（浏览器直连需开启 direct-browser-access）',
  },
  custom: {
    label: '自定义（OpenAI 兼容）',
    style: 'openai',
    baseURL: '',
    model: '',
    hint: '自填 baseURL，按 OpenAI /chat/completions 形态调用',
  },
};

export const DEFAULT_CONFIG = {
  provider: 'openai',
  baseURL: PROVIDERS.openai.baseURL,
  model: PROVIDERS.openai.model,
  apiKey: '',
};

export function loadConfig() {
  try {
    const raw = localStorage.getItem(AI_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (_) {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(cfg) {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg || {}));
}

export function clearConfig() {
  localStorage.removeItem(AI_CONFIG_KEY);
}

export function isConfigured(cfg = loadConfig()) {
  return Boolean(cfg && cfg.apiKey && cfg.baseURL && cfg.model);
}

function styleOf(cfg) {
  return (PROVIDERS[cfg.provider] || PROVIDERS.custom).style;
}

function joinURL(base, path) {
  const b = (base || '').replace(/\/+$/, '');
  return `${b}${path}`;
}

// 把内部消息（{role, content}）拆成 system + 对话两部分
function splitMessages(messages) {
  const sys = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
  const chat = messages.filter((m) => m.role !== 'system');
  return { sys, chat };
}

// SSE 行解析：逐块累积，按 \n\n 分隔事件，回调每个 data 负载
function makeSSEParser(onData) {
  let buffer = '';
  return (chunk) => {
    buffer += chunk;
    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      rawEvent.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) onData(trimmed.slice(5).trim());
      });
    }
  };
}

// ---------------------------------------------------------------------------
// 主入口：chat({ messages, onToken, signal, stream })
//   messages: [{ role: 'system'|'user'|'assistant', content }]
//   onToken: (deltaText) => void   流式增量回调
//   返回：完整文本（Promise<string>）
// ---------------------------------------------------------------------------
export async function chat({ messages, onToken, signal, stream = true, config }) {
  const cfg = config || loadConfig();
  if (!isConfigured(cfg)) {
    const err = new Error('AI 尚未配置：请先在「AI 助手 · 设置」中填写 API Key、模型与 baseURL。');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }
  const style = styleOf(cfg);
  return style === 'anthropic'
    ? anthropicChat(cfg, messages, { onToken, signal, stream })
    : openaiChat(cfg, messages, { onToken, signal, stream });
}

// ---------------------------------------------------------------------------
// OpenAI 兼容
// ---------------------------------------------------------------------------
async function openaiChat(cfg, messages, { onToken, signal, stream }) {
  const url = joinURL(cfg.baseURL, '/chat/completions');
  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: Boolean(stream),
      temperature: 0.6,
    }),
  });

  if (!res.ok) throw await httpError(res);

  if (!stream || !res.body) {
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    if (onToken && text) onToken(text);
    return text;
  }

  let full = '';
  const parser = makeSSEParser((payload) => {
    if (payload === '[DONE]') return;
    try {
      const json = JSON.parse(payload);
      const delta = json?.choices?.[0]?.delta?.content || '';
      if (delta) { full += delta; onToken && onToken(delta); }
    } catch (_) { /* 忽略心跳/非 JSON 行 */ }
  });
  await pump(res.body, parser);
  return full;
}

// ---------------------------------------------------------------------------
// Anthropic messages API
// ---------------------------------------------------------------------------
async function anthropicChat(cfg, messages, { onToken, signal, stream }) {
  const url = joinURL(cfg.baseURL, '/v1/messages');
  const { sys, chat } = splitMessages(messages);
  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: 4096,
      system: sys || undefined,
      stream: Boolean(stream),
      messages: chat.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) throw await httpError(res);

  if (!stream || !res.body) {
    const data = await res.json();
    const text = (data?.content || []).map((b) => b.text || '').join('');
    if (onToken && text) onToken(text);
    return text;
  }

  let full = '';
  const parser = makeSSEParser((payload) => {
    try {
      const json = JSON.parse(payload);
      if (json.type === 'content_block_delta') {
        const delta = json?.delta?.text || '';
        if (delta) { full += delta; onToken && onToken(delta); }
      }
    } catch (_) { /* 忽略 */ }
  });
  await pump(res.body, parser);
  return full;
}

async function pump(body, parser) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parser(decoder.decode(value, { stream: true }));
  }
}

async function httpError(res) {
  let detail = '';
  try {
    const j = await res.json();
    detail = j?.error?.message || j?.message || JSON.stringify(j);
  } catch (_) {
    try { detail = await res.text(); } catch (__) { detail = ''; }
  }
  const map = {
    401: 'API Key 无效或未授权（401）',
    403: '无访问权限（403）',
    404: 'baseURL 或模型路径错误（404）',
    429: '请求过于频繁或额度耗尽（429）',
  };
  const msg = map[res.status] || `请求失败（${res.status}）`;
  const err = new Error(detail ? `${msg}：${detail}` : msg);
  err.code = 'HTTP_ERROR';
  err.status = res.status;
  return err;
}

// 连接测试：发一条极短的非流式请求，成功即返回 true
export async function testConnection(config) {
  await chat({
    config,
    stream: false,
    messages: [{ role: 'user', content: '回复"ok"两个字符即可。' }],
  });
  return true;
}
