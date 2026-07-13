import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';
import { useHuangfeizhaiAuth } from '../../lib/huangfeizhai/useHuangfeizhaiAuth.js';
import './huangfeizhai.css';

export default function HuangfeizhaiGate({ children }) {
  const { authenticated, unlock } = useHuangfeizhaiAuth();
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authenticated) {
    return children;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const ok = unlock(password.trim(), remember);
    if (!ok) {
      setError('密钥不正确，荒废斋大门未开。');
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
          私人信息总入口。决策复盘、自画像与迁移日志仅存本地，需密钥方可入内。
          <br />
          <span className="hf-gate-note">（客户端门禁，防窥目非加密安全。）</span>
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
            记住本会话（24 小时内免重复输入）
          </label>
          {error ? <p className="hf-gate-error" role="alert">{error}</p> : null}
          <button type="submit" className="hf-gate-submit" disabled={submitting || !password.trim()}>
            启封入内
          </button>
        </form>
      </div>
    </div>
  );
}
