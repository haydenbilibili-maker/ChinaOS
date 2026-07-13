// China OS 导出品牌头 · Markdown / 简报 / 全景报告共用

const BRAND_BLOCK = [
  '---',
  '',
  '**China OS** · 治大国如烹小鲜',
  '',
  '*中国深度调研操作系统 · 公开统计梳理 · 非投资建议 · 非预测*',
  '',
  '---',
  '',
].join('\n');

/** 在 Markdown 正文前插入 OS 品牌头 */
export function withExportBrand(md, { subtitle } = {}) {
  const body = String(md || '').trimStart();
  if (!body) return BRAND_BLOCK.trimEnd();
  const sub = subtitle ? `\n*${subtitle}*\n` : '';
  return `${BRAND_BLOCK}${sub}${body}`;
}

export const EXPORT_DISCLAIMER = '由 China OS 生成 · 公开统计梳理 · 非投资建议 · 非预测';
