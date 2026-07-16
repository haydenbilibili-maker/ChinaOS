import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw01Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW01"
      badge="SJW-01 · 史鉴·世界"
      title="大国崛起谱系"
      subtitle="海权窗口 · 财政信用 · 制度学习"
      htmlSrc="/shijian-world/SJW-01.html"
      frameTitle="SJW-01 大国崛起谱系"
      hintLinks={[{ href: '/shijian-world/SJW-01.html', label: '/shijian-world/SJW-01.html' }]}
    />
  );
}
