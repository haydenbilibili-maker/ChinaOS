import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';
import { useHuangfeizhaiAuth } from '../../lib/huangfeizhai/useHuangfeizhaiAuth.js';
import { LoadingBlock } from '../../app/ui.jsx';
import './huangfeizhai.css';

const ERROR_TEXT = {
  invalid: '密钥不正确，荒废斋大门未开。',
  rate_limited: '尝试过于频繁，请稍后再试。',
  not_configured: '服务端尚未配置访问密钥。',
  network: '网络异常，无法连接鉴权服务。',
  bad_request: '请输入密钥。',
};

export default function HuangfeizhaiGate({ children }) {
  const { status, unlock } = useHuangfeizhaiAuth();
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    return children;
  }

  // 尚未向服务端确认会话：不闪现门禁
  if (status === 'unknown') {
    return <LoadingBlock />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    const res = await unlock(password.trim(), remember);
    if (!res.ok) {
      const wait = res.retryAfterSec ? `（约 ${Math.ceil(res.retryAfterSec / 60)} 分钟后）` : '';
      setError(`${ERROR_TEXT[res.error] || ERROR_TEXT.invalid}${res.error === 'rate_limited' ? wait : ''}`);
      setPassword('');
    }
    setSubmitting(false);
  };

  return (
    <div className="ink-observatory hf-gate-wrap">
      <div className="hf-gate-card">
        <div className="hf-gate-mark">
          <Lock size={28} strokeWidth={1.5} />
        </div>
        <p className="hf-gate-ey">ChinaOS · 私人分区</p>
        <h1 className="hf-gate-title">荒废斋</h1>
        <p className="hf-gate-lead">
          私人信息总入口。决策复盘、自画像与迁移日志需密钥方可入内。
          <br />
          <span className="hf-gate-note">（服务端校验，内容仅在会话有效时下发。）</span>
        </p>

        <form className="hf-gate-form" onSubmit={onSubmit}>
          <label className="hf-gate-label" htmlFor="hf-password">
            <KeyRound size={14} />
            访问密钥
          </label>
          <input
            id="hf-password"
            type="password"
            className="hf-gate-input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="输入密钥"
            autoComplete="current-password"
            autoFocus
          />
          <label className="hf-gate-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            记住本设备（24 小时内免重复输入）
          </label>
          {error ? <p className="hf-gate-error" role="alert">{error}</p> : null}
          <button type="submit" className="hf-gate-submit" disabled={submitting || !password.trim()}>
            {submitting ? '校验中…' : '启封入内'}
          </button>
        </form>
      </div>
    </div>
  );
}
