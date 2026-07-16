import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw08Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW08"
      badge="SJW-08 · 史鉴·世界"
      title="冷战与核威慑机制史"
      subtitle="二次打击 · 指挥链 · 危机管控"
      htmlSrc="/shijian-world/SJW-08.html"
      frameTitle="SJW-08 冷战与核威慑机制史"
      hintLinks={[{ href: '/shijian-world/SJW-08.html', label: '/shijian-world/SJW-08.html' }]}
    />
  );
}
