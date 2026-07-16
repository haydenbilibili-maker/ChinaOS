import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw11Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW11"
      badge="SJW-11 · 史鉴·世界"
      title="工业革命单案深描"
      subtitle="煤铁蒸汽 · 信用 · 帝国市场"
      htmlSrc="/shijian-world/SJW-11.html"
      frameTitle="SJW-11 工业革命单案深描"
      hintLinks={[{ href: '/shijian-world/SJW-11.html', label: '/shijian-world/SJW-11.html' }]}
    />
  );
}
