import type { CushionCountry, CushionLayer, CushionScore } from '../../domain/governance.ts';
import { CUSHION_COUNTRY_COLORS } from '../../domain/governance.ts';

/** verbatim from chinaos-cushion-monitor.html */
export const CUSHION_NAMES: Record<CushionCountry, string> = {
  cn: '中国',
  jp: '日本',
  kr: '韩国',
  us: '美国',
};

export const CUSHION_YEARS: Record<CushionCountry, string> = {
  cn: '2025/26',
  jp: '1991',
  kr: '1997',
  us: '1991',
};

/** 按厚度降序排列条形（让"谁最薄"一目了然） */
export function sortCushionBars(
  vals: Record<CushionCountry, CushionScore>,
): [CushionCountry, CushionScore][] {
  return (Object.entries(vals) as [CushionCountry, CushionScore][]).sort((a, b) => b[1].s - a[1].s);
}

export function countryColor(country: CushionCountry): string {
  return CUSHION_COUNTRY_COLORS[country];
}

export function chinaScore(layer: CushionLayer): number {
  return layer.vals.cn.s;
}

export function japanScore(layer: CushionLayer): number {
  return layer.vals.jp.s;
}

/** 中国在每一层是否都比日本薄（终局判断的结构验证） */
export function chinaThinnerThanJapanAllLayers(layers: CushionLayer[]): boolean {
  return layers.every((L) => L.vals.cn.s < L.vals.jp.s);
}

/** 中国四层垫子均值（相对厚度合成，0–100） */
export function chinaCushionAverage(layers: CushionLayer[]): number {
  if (layers.length === 0) return 0;
  const sum = layers.reduce((acc, L) => acc + L.vals.cn.s, 0);
  return Math.round(sum / layers.length);
}

/** 垫子厚度分段（薄 / 中 / 厚） */
export type CushionBand = 'thin' | 'mid' | 'thick';

export function cushionBand(score: number): CushionBand {
  if (score < 35) return 'thin';
  if (score < 65) return 'mid';
  return 'thick';
}
