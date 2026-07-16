import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw21Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW21"
      badge="SJW-21 · 史鉴·世界"
      title="石油时代与中东地缘"
      subtitle="油井 · 海峡 · 租金政治"
      htmlSrc="/shijian-world/SJW-21.html"
      frameTitle="SJW-21 石油时代与中东地缘"
      hintLinks={[{ href: '/shijian-world/SJW-21.html', label: '/shijian-world/SJW-21.html' }]}
    />
  );
}
