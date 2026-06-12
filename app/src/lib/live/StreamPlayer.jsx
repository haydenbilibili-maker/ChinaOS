import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { resolveHlsUrl } from './streamUtils.js';

const MAX_HLS_RETRIES = 3;
const RETRY_DELAY_MS = 1200;
const IFRAME_FAIL_MS = 5000;

/**
 * 懒加载播放器：HLS（hls.js）/ iframe / page 外链提示
 * 仅在 modal 打开时挂载，避免全页自动播放
 */
export default function StreamPlayer({ stream, className = '' }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const retryTimerRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | playing | error
  const [errorMsg, setErrorMsg] = useState('');
  const [attempt, setAttempt] = useState(0);

  const fallbackUrl = stream?.pageUrl || stream?.streamUrl;

  const destroyHls = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.removeAttribute('src');
      video.load();
    }
  }, []);

  useEffect(() => {
    if (!stream || stream.embedType !== 'hls') return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    let cancelled = false;
    setStatus('loading');
    setErrorMsg('');
    setAttempt(0);

    const fail = (msg) => {
      if (!cancelled) {
        setStatus('error');
        setErrorMsg(msg || '信号不可用');
      }
    };

    const succeed = () => {
      if (!cancelled) setStatus('playing');
    };

    const scheduleRetry = (nextAttempt, runLoad) => {
      if (cancelled || nextAttempt >= MAX_HLS_RETRIES) {
        fail('HLS 信号加载失败（源端不可用或 CORS 限制）');
        return;
      }
      retryTimerRef.current = setTimeout(() => {
        if (!cancelled) {
          setAttempt(nextAttempt);
          runLoad(nextAttempt);
        }
      }, RETRY_DELAY_MS);
    };

    const loadHls = async (tryIndex) => {
      destroyHls();
      if (cancelled) return;

      setStatus('loading');

      const sourceUrl = resolveHlsUrl(stream.streamUrl, {
        useProxy: import.meta.env.DEV && (stream.needsProxy || tryIndex > 0),
      });

      const onVideoError = () => {
        if (!cancelled) scheduleRetry(tryIndex + 1, loadHls);
      };

      try {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = sourceUrl;
          video.onerror = onVideoError;
          video.onplaying = succeed;
          await video.play().catch(onVideoError);
          if (!cancelled && !video.error) succeed();
          return;
        }

        const { default: Hls } = await import('hls.js');
        if (cancelled) return;
        if (!Hls.isSupported()) {
          fail('当前浏览器不支持 HLS 播放');
          return;
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxLoadingRetry: 2,
          manifestLoadingMaxRetry: 2,
        });
        hlsRef.current = hls;
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled) return;
          video.play().then(succeed).catch(onVideoError);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (cancelled || !data.fatal) return;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            scheduleRetry(tryIndex + 1, loadHls);
          } else {
            fail('HLS 解码或媒体错误');
          }
        });
      } catch {
        scheduleRetry(tryIndex + 1, loadHls);
      }
    };

    loadHls(0);

    return () => {
      cancelled = true;
      destroyHls();
    };
  }, [stream, destroyHls]);

  if (!stream) return null;

  if (stream.embedType === 'iframe') {
    if (!stream.playVerified) {
      return (
        <PlayerFallback
          title={stream.title}
          message="该信号无法在站内 iframe 内嵌播放（版权或 X-Frame 限制），请打开原页面观看。"
          url={fallbackUrl}
          className={className}
        />
      );
    }
    return (
      <IframePlayer stream={stream} fallbackUrl={fallbackUrl} className={className} />
    );
  }

  if (stream.embedType === 'hls') {
    return (
      <div className={`relative w-full overflow-hidden rounded-lg ${className}`} style={{ aspectRatio: '16/9', background: '#000' }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          controls
          playsInline
          muted
          poster={stream.thumbnail}
        />
        <StatusOverlay status={status} attempt={attempt} />
        {status === 'error' && (
          <div className="absolute inset-0 z-20">
            <PlayerFallback title={stream.title} message={errorMsg} url={fallbackUrl} className="h-full" />
          </div>
        )}
        {!import.meta.env.DEV && stream.needsProxy && status !== 'playing' && status !== 'error' && (
          <p className="absolute bottom-2 left-2 text-[10px] mono px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--text-tertiary)' }}>
            生产环境部分 HLS 源需 Safari 或跳转原页面
          </p>
        )}
      </div>
    );
  }

  return (
    <PlayerFallback
      title={stream.title}
      message="该信号仅提供官方外链，请点击下方按钮跳转原页面观看。"
      url={fallbackUrl}
      className={className}
    />
  );
}

function IframePlayer({ stream, fallbackUrl, className }) {
  const [status, setStatus] = useState('loading');
  const iframeRef = useRef(null);

  useEffect(() => {
    setStatus('loading');
    const failTimer = setTimeout(() => {
      setStatus((prev) => (prev === 'loading' ? 'error' : prev));
    }, IFRAME_FAIL_MS);
    return () => clearTimeout(failTimer);
  }, [stream?.id]);

  const handleIframeLoad = () => {
    // 跨域 iframe 无法读取 DOM；load 只表示文档到达，不代表视频可播
    setStatus((prev) => (prev === 'error' ? 'error' : 'loading'));
  };

  const handleIframeError = () => setStatus('error');

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`} style={{ aspectRatio: '16/9', background: '#000' }}>
      {status !== 'error' && (
        <iframe
          ref={iframeRef}
          title={stream.title}
          src={stream.streamUrl}
          className="absolute inset-0 w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
      <StatusOverlay status={status} />
      {status === 'error' && (
        <div className="absolute inset-0 z-20">
          <PlayerFallback
            title={stream.title}
            message="信号不可用，请打开原页面（iframe 内嵌可能被源站拦截或版权限制）。"
            url={fallbackUrl}
            className="h-full"
          />
        </div>
      )}
      {status !== 'error' && <IframeFallbackLink url={fallbackUrl} />}
    </div>
  );
}

function StatusOverlay({ status, attempt = 0 }) {
  if (status === 'error') return null;
  if (status === 'playing') {
    return (
      <span
        className="absolute top-2 left-2 text-[10px] mono px-2 py-0.5 rounded flex items-center gap-1.5 z-10"
        style={{ background: 'rgba(0,0,0,0.65)', color: '#34d399', border: '1px solid rgba(52,211,153,0.35)' }}
      >
        <Lucide.Circle size={6} fill="#34d399" stroke="none" />
        播放中
      </span>
    );
  }
  if (status === 'loading') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10" style={{ background: 'rgba(0,0,0,0.45)' }}>
        <Lucide.Loader2 size={28} className="animate-spin" style={{ color: 'var(--cyber-cyan)' }} />
        {attempt > 0 && (
          <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
            重试 {attempt}/{MAX_HLS_RETRIES - 1}…
          </span>
        )}
      </div>
    );
  }
  return null;
}

function IframeFallbackLink({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-2 right-2 text-[10px] mono px-2 py-1 rounded z-10"
      style={{ background: 'rgba(0,0,0,0.65)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.35)' }}
    >
      打开原页面 ↗
    </a>
  );
}

function PlayerFallback({ title, message, url, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-lg p-6 text-center ${className}`}
      style={{ aspectRatio: '16/9', background: 'var(--bg-elevated)', border: '1px dashed var(--border-subtle)' }}
    >
      <Lucide.SignalZero size={32} style={{ color: 'var(--text-tertiary)' }} />
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-xs leading-relaxed max-w-sm" style={{ color: 'var(--text-tertiary)' }}>
          {message || '信号不可用'}
        </p>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="os-btn os-btn-primary os-btn-sm inline-flex items-center gap-1.5"
        >
          <Lucide.ExternalLink size={13} />
          打开原页面
        </a>
      )}
    </div>
  );
}
