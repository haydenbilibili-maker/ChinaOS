// 文明透视 · 卷 → 阅读器 Markdown（结构化卷数据直出，无需解析 DOM）

/** @param {object} vol @returns {string} */
export function volumeToMarkdown(vol) {
  if (!vol) return '';
  const out = [];
  if (vol.thesis) out.push(`> ${vol.thesis}`, '');
  (vol.frameworks || []).forEach((f) => {
    out.push(`## 框架 · ${f.title}`, '');
    if (f.subtitle) out.push(`*${f.subtitle}*`, '');
    if (f.body) out.push(f.body, '');
    if (f.pillars?.length) {
      f.pillars.forEach(([k, v]) => out.push(`- **${k}**　${v}`));
      out.push('');
    }
  });
  (vol.sections || []).forEach((s) => {
    out.push(`## ${s.title}`, '');
    if (s.lead) out.push(`> ${s.lead}`, '');
    (s.body || []).forEach((p) => out.push(p, ''));
    (s.cards || []).forEach((c) => out.push(`**${c.title}**　${c.body}`, ''));
  });
  return out.join('\n').trim();
}
