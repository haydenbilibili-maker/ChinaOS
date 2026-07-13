import GySliceShell from '../shared/gy/GySliceShell.jsx';
import ZhixiaoPanel from './ZhixiaoPanel.jsx';
import './zhixiao.css';

/**
 * 中国人群分析 · 被分流的一半:职校生(GY-11)
 * 人群画像分层第九子集 · 与 GY-09 老年 / GY-10 塔尖同构
 */
export default function ZhixiaoPage() {
  return (
    <GySliceShell
      badge="GY-11 · 人群画像分层"
      title="职校生"
      subtitle="编译期定价 · 十五岁的一次性判决"
      appId="zx-app"
      moduleId="zhixiao"
      className="zhixiao-page"
    >
      <ZhixiaoPanel />
    </GySliceShell>
  );
}
