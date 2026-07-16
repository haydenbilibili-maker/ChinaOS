import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

const HINT_LINKS = [
  { href: '/shijian-world/SJW-00.html', label: 'SJW-00 单页' },
  { href: '/modules/shijian', label: '史鉴·中华' },
  { href: '/modules/shijian-world/sjw-19', label: 'SJW-19 大革命' },
  { href: '/modules/shijian-world/sjw-22', label: 'SJW-22 改革对照' },
  { href: '/modules/shijian-world/sjw-23', label: 'SJW-23 发展型矩阵' },
  { href: '/modules/santi', label: '三体透镜（边界）' },
];

/**
 * 史鉴·世界 SJW-00 · 总索引
 */
export default function ShijianWorldPage() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW00"
      badge="SJW-00 · 史鉴·世界"
      title="史鉴·世界总索引"
      subtitle="比较历史动力学 · 可配置五轴 · 中华交叉"
      htmlSrc="/shijian-world/SJW-00.html"
      frameTitle="SJW-00 史鉴·世界总索引"
      hintLinks={HINT_LINKS}
    />
  );
}
