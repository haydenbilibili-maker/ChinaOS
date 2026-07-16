import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

const HINT_LINKS = [
  { href: '/shijian-world/SJW-00.html', label: 'SJW-00 单页' },
  { href: '/modules/shijian', label: '史鉴·中华' },
  { href: '/modules/shijian-world/sjw-28', label: 'SJW-28 印度' },
  { href: '/modules/shijian-world/sjw-29', label: 'SJW-29 四小虎' },
  { href: '/modules/shijian-world/sjw-30', label: 'SJW-30 非洲资源' },
  { href: '/modules/shijian-world/sjw-31', label: 'SJW-31 联合国' },
  { href: '/modules/shijian-world/sjw-32', label: 'SJW-32 科技标准' },
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
