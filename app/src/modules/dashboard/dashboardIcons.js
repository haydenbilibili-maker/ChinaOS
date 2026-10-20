// 中枢看板图标表：在注册表白名单基础上补齐看板数据用到的少量图标。
// 用显式命名导入代替 `import * as Lucide`，避免首页 chunk 打入整套图标库。
import {
  CalendarClock, Circle, Cloud, CloudRain, CloudSun, FolderTree, Microscope, Palmtree, PawPrint, Rows3, Square,
  Thermometer, TrainFront, Type,
} from 'lucide-react';
import { MODULE_ICONS } from '../../app/moduleIcons.js';

export const DASH_ICONS = {
  ...MODULE_ICONS,
  CalendarClock,
  Circle,
  Cloud,
  CloudRain,
  CloudSun,
  FolderTree,
  Microscope,
  Palmtree,
  Rows3,
  Thermometer,
  TrainFront,
  Type,
  Panda: PawPrint,
};

export function dashIcon(name) {
  return DASH_ICONS[name] || Square;
}
