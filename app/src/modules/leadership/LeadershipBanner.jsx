import React, { useState } from 'react';
import { LEAD_AS_OF } from './leadershipData.js';

/** 本地缓存优先；Commons 同源肖像作回退（File:Xi Jinping portrait 2019.jpg · kremlin.ru CC BY 4.0） */
const LOCAL_SRC = '/portraits/xi-jinping-2019.jpg';
const COMMONS_SRC =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Xi_Jinping_portrait_2019.jpg/640px-Xi_Jinping_portrait_2019.jpg';
const COMMONS_PAGE = 'https://commons.wikimedia.org/wiki/File:Xi_Jinping_portrait_2019.jpg';

/**
 * 领袖统治 · 头图 Banner
 * 文案仅公开职务口径，不编造传记主张。
 */
export default function LeadershipBanner() {
  const [src, setSrc] = useState(LOCAL_SRC);

  return (
    <section className="lead-banner os-section mb-6" aria-label="领袖观察横幅">
      <div className="lead-banner__photo" aria-hidden="true">
        <img
          src={src}
          alt=""
          width={627}
          height={1200}
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (src !== COMMONS_SRC) setSrc(COMMONS_SRC);
          }}
        />
      </div>
      <div className="lead-banner__vignette" aria-hidden="true" />
      <div className="lead-banner__scan" aria-hidden="true" />

      <div className="lead-banner__content">
        <div className="lead-banner__glass">
          <div className="lead-banner__eyebrow">Observatory · 权力结构观察</div>
          <h2 className="lead-banner__name">习近平</h2>
          <p className="lead-banner__roles">
            中共中央总书记 · 国家主席 · 中央军委主席
          </p>
          <p className="lead-banner__meta">
            公开职务口径 · 基准日 {LEAD_AS_OF} · 非评价 · 非预测 · 非倡导
          </p>
          <p className="lead-banner__credit">
            肖像来源：{' '}
            <a href={COMMONS_PAGE} target="_blank" rel="noopener noreferrer">
              Wikimedia Commons · Xi Jinping portrait 2019
            </a>
            {' '}（kremlin.ru · CC BY 4.0）· wiki 标题「习近平」
          </p>
        </div>
      </div>
    </section>
  );
}
