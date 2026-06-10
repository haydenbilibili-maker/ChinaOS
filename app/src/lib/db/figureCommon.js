// 政治人物简历 · 共享构造器
export const AS_OF = '2026-06-11';

/** @param {object} o */
export function fig(o) {
  return {
    kind: '公开',
    asOf: AS_OF,
    fields: { ethnic: '汉族', ...o.fields },
    career: o.career || [],
    ...o,
  };
}
