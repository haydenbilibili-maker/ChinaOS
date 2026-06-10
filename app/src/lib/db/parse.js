// ============================================================================
// 数据解析工具 · CSV / JSON / 政治人物简历
// ============================================================================

// 健壮 CSV 解析（支持引号、逗号转义、CRLF）。返回 { columns, rows }。
export function parseCSV(text) {
  const out = [];
  let row = [], field = '', i = 0, inQ = false;
  const pushF = () => { row.push(field); field = ''; };
  const pushR = () => { pushF(); out.push(row); row = []; };
  text = text.replace(/^﻿/, ''); // BOM
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { pushF(); i++; continue; }
    if (c === '\n') { pushR(); i++; continue; }
    if (c === '\r') { i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) pushR();
  const nonEmpty = out.filter((r) => r.some((x) => x !== ''));
  if (!nonEmpty.length) return { columns: [], rows: [] };
  const columns = nonEmpty[0].map((h, idx) => h.trim() || `列${idx + 1}`);
  const rows = nonEmpty.slice(1).map((r) => {
    const o = {};
    columns.forEach((col, idx) => {
      const raw = (r[idx] ?? '').trim();
      const num = raw !== '' && !Number.isNaN(Number(raw.replace(/,/g, '')));
      o[col] = num ? Number(raw.replace(/,/g, '')) : raw;
    });
    return o;
  });
  return { columns, rows };
}

// JSON 解析为 {columns, rows}：接受 [{...}] 或 {provinces:[...]} 或 {rows:[...]} 或 {data:[...]}
export function parseJSON(text) {
  const j = JSON.parse(text);
  let arr = Array.isArray(j) ? j : (j.provinces || j.rows || j.data || j.records);
  if (!Array.isArray(arr)) throw new Error('JSON 顶层需为数组，或含 provinces/rows/data/records 数组字段');
  const columns = [...new Set(arr.flatMap((o) => Object.keys(o)))];
  return { columns, rows: arr, meta: j.meta };
}

// 政治人物简历解析：从粘贴文本或 JSON 抽取结构化字段 + 履历时间线。
// 支持「标签：值」与含年份的履历行（YYYY ... 任 ... 职）。
export function parseFigure(text) {
  const t = text.trim();
  // 先试 JSON
  if (t.startsWith('{')) {
    try {
      const j = JSON.parse(t);
      return { name: j.name || j.姓名 || '未命名', fields: j.fields || j, career: j.career || j.履历 || [], province: j.province || detectProvince(t), raw: t };
    } catch (_) { /* 退回文本解析 */ }
  }
  const LABELS = {
    name: ['姓名', '名字'], gender: ['性别'], birth: ['出生', '生于', '出生年月', '出生日期'],
    native: ['籍贯', '祖籍'], ethnic: ['民族'], party: ['入党', '党派'], edu: ['学历', '学位', '毕业'],
    title: ['现任', '职务', '现职'], field: ['分管', '领域'],
  };
  const fields = {};
  const lines = t.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const m = line.match(/^([一-龥A-Za-z]{2,8})\s*[:：]\s*(.+)$/);
    if (m) {
      const [, label, val] = m;
      for (const [key, alts] of Object.entries(LABELS)) {
        if (alts.some((a) => label.includes(a))) { fields[key] = val.trim(); break; }
      }
    }
  }
  // 名字兜底：首行若是 2-4 个汉字且无标签，视为姓名
  if (!fields.name) {
    const first = lines[0] || '';
    if (/^[一-龥]{2,4}$/.test(first)) fields.name = first;
  }
  // 履历时间线：抓含年份的行
  const career = [];
  const yearRe = /((?:19|20)\d{2})\s*[年.\-—~至到\s]*((?:(?:19|20)\d{2}|至今|今))?[^\n]*/g;
  for (const line of lines) {
    const ym = line.match(/^((?:19|20)\d{2})(?:[.\-年]\d{1,2})?\s*[—\-~至到]?\s*((?:19|20)\d{2}|至今|今)?[，,、\s]*(.+)?/);
    if (ym && (line.includes('任') || line.includes('副') || line.includes('书记') || line.includes('长') || line.includes('委') || /\d{4}/.test(line))) {
      career.push({ from: ym[1], to: ym[2] || '', desc: (ym[3] || line).trim() });
    }
  }
  return { name: fields.name || '未命名', fields, career, province: detectProvince(t), raw: t };
}

// 从文本检测关联省份（datav 全称），优先现任/籍贯出现的省份
const PROVINCES = ['北京市', '天津市', '上海市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区'];
export function detectProvince(text) {
  for (const p of PROVINCES) { if (text.includes(p)) return p; }
  // 简称兜底（如「黑龙江」「内蒙古」）
  for (const p of PROVINCES) { const short = p.replace(/(省|市|自治区|回族|壮族|维吾尔)/g, ''); if (short.length >= 2 && text.includes(short)) return p; }
  return '';
}
