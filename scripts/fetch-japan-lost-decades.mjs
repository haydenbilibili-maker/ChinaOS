#!/usr/bin/env node
/**
 * 中日比较·失去的三十年 —— 世行 WDI + IMF DataMapper 中日序列抓取（可复现）
 * 输出：app/src/modules/japanLostDecades/seriesGenerated.js（生成文件，勿手改）
 * 用法：node scripts/fetch-japan-lost-decades.mjs
 */
import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/src/modules/japanLostDecades/seriesGenerated.js');
const FROM = 1980;
const TO = 2025;

const WB = {
  urban: 'SP.URB.TOTL.IN.ZS',
  manuf: 'NV.IND.MANF.ZS',
  exportsGdp: 'NE.EXP.GNFS.ZS',
  fdiOut: 'BM.KLT.DINV.WD.GD.ZS',
  rnd: 'GB.XPD.RSDV.GD.ZS',
  tertiary: 'SE.TER.ENRR',
  hhCons: 'NE.CON.PRVT.ZS',
  pop65: 'SP.POP.65UP.TO.ZS',
  tfr: 'SP.DYN.TFRT.IN',
  wap: 'SP.POP.1564.TO',
  oldDep: 'SP.POP.DPND.OL',
  youthUnemp: 'SL.UEM.1524.ZS',
  gini: 'SI.POV.GINI',
  healthExp: 'SH.XPD.CHEX.GD.ZS',
  patentRes: 'IP.PAT.RESD',
  deflator: 'NY.GDP.DEFL.KD.ZG',
  hiTechExp: 'TX.VAL.TECH.MF.ZS',
};

const IMF = {
  gdpPcUsd: 'NGDPDPC',
  gdpPcPpp: 'PPPPC',
  gdpGrowth: 'NGDP_RPCH',
  cpi: 'PCPIPCH',
  govDebt: 'GGXWDG_NGDP',
  hhDebt: 'HH_LS',
  nfcDebt: 'NFC_LS',
  unemp: 'LUR',
};

const round = (v) => (v == null ? null : Math.round(v * 100) / 100);

// IMF 的 CDN 拒绝 Node 内置 fetch 的 TLS 指纹，统一走 curl。
async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const raw = execFileSync('curl', ['-s', '-f', '-m', '180', url], { maxBuffer: 64 * 1024 * 1024 });
      return JSON.parse(raw.toString('utf8'));
    } catch { /* retry */ }
  }
  throw new Error(`fetch failed: ${url}`);
}

async function fetchWb(code) {
  const url = `https://api.worldbank.org/v2/country/JPN;CHN/indicator/${code}?format=json&date=${FROM}:${TO}&per_page=500`;
  const [, rows = []] = await getJson(url);
  const out = { JPN: {}, CHN: {} };
  for (const r of rows) {
    if (r.value != null && out[r.countryiso3code]) out[r.countryiso3code][r.date] = round(r.value);
  }
  return out;
}

async function fetchImf(code) {
  const d = await getJson(`https://www.imf.org/external/datamapper/api/v1/${code}/JPN/CHN`);
  const v = d?.values?.[code] ?? {};
  const out = { JPN: {}, CHN: {} };
  for (const iso of ['JPN', 'CHN']) {
    for (const [y, val] of Object.entries(v[iso] ?? {})) {
      if (+y >= FROM && +y <= TO && val != null) out[iso][y] = round(val);
    }
  }
  return out;
}

const series = {};
for (const [key, code] of Object.entries(WB)) {
  series[key] = { source: `World Bank WDI · ${code}`, ...(await fetchWb(code)) };
  process.stdout.write(`WB ${key} ok\n`);
}
for (const [key, code] of Object.entries(IMF)) {
  series[key] = { source: `IMF DataMapper · ${code}`, ...(await fetchImf(code)) };
  process.stdout.write(`IMF ${key} ok\n`);
}

const fetchedAt = new Date().toISOString().slice(0, 10);
const body = `// 生成文件 · scripts/fetch-japan-lost-decades.mjs · 抓取日 ${fetchedAt}
// 口径：世行 WDI（年度）/ IMF DataMapper（WEO 2025 年及以前含 IMF 估计值；债务类为 Global Debt Database）
export const SERIES_FETCHED_AT = '${fetchedAt}';
export const SERIES = ${JSON.stringify(series)};
`;
writeFileSync(OUT, body);
console.log(`wrote ${OUT}`);
