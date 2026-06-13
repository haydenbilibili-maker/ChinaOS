import { PageHeader } from '../../app/ui.jsx';
import JingzhangPanel from './JingzhangPanel.jsx';
import './jingzhang.css';

/**
 * 中国人群分析 · 精神障碍者与被监护人(GY-55)
 * 人群画像分层第五十三子集 · 与 GY-54 同构
 * 注记:以精神卫生与监护制度框架处理,把精神障碍理解为可治疗可康复的健康问题,
 * 不病理化、不渲染、不将患者污名为危险,强调康复、权利与服务供给;
 * 监护代行边界、强制收治、「被精神病」等争议归因呈现、不裁决具体个案。
 */
export default function JingzhangPage() {
  return (
    <div className="jingzhang-page">
      <PageHeader
        badge="GY-55 · 人群画像分层"
        title="精神障碍者与被监护人"
        subtitle="执行权限被代理的进程 · 自主决定权的让渡"
      />
      <JingzhangPanel />
    </div>
  );
}
