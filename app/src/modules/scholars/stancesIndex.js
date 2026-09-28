// 思想光谱矩阵数据汇总：只汇入各学者轻量的 stances.js，不拉取完整 data.js（保持总览 chunk 轻量）
import { STANCES as huangQifan } from './huangQifan/stances.js';
import { STANCES as linYifu } from './linYifu/stances.js';
import { STANCES as zhouQiren } from './zhouQiren/stances.js';
import { STANCES as wenTiejun } from './wenTiejun/stances.js';
import { STANCES as heXuefeng } from './heXuefeng/stances.js';
import { STANCES as yuYongding } from './yuYongding/stances.js';
import { STANCES as caiFang } from './caiFang/stances.js';
import { STANCES as zhouLian } from './zhouLian/stances.js';
import { STANCES as yanXuetong } from './yanXuetong/stances.js';
import { STANCES as xiangBiao } from './xiangBiao/stances.js';

/** key = SCHOLARS[].id */
export const STANCES_BY_SCHOLAR = {
  'huang-qifan': huangQifan,
  'lin-yifu': linYifu,
  'zhou-qiren': zhouQiren,
  'wen-tiejun': wenTiejun,
  'he-xuefeng': heXuefeng,
  'yu-yongding': yuYongding,
  'cai-fang': caiFang,
  'zhou-li-an': zhouLian,
  'yan-xuetong': yanXuetong,
  'xiang-biao': xiangBiao,
};
