import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw19Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW19"
      badge="SJW-19 · 史鉴·世界"
      title="法国大革命—拿破仑秩序"
      subtitle="人民主权 · 动员 · 维也纳回摆"
      htmlSrc="/shijian-world/SJW-19.html"
      frameTitle="SJW-19 法国大革命—拿破仑秩序实验"
      hintLinks={[{ href: '/shijian-world/SJW-19.html', label: '/shijian-world/SJW-19.html' }]}
    />
  );
}
