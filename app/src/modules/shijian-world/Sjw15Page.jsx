import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw15Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW15"
      badge="SJW-15 · 史鉴·世界"
      title="明治—战后日本发展型国家"
      subtitle="富国强兵 · MITI · 安全伞"
      htmlSrc="/shijian-world/SJW-15.html"
      frameTitle="SJW-15 明治—战后日本发展型国家"
      hintLinks={[{ href: '/shijian-world/SJW-15.html', label: '/shijian-world/SJW-15.html' }]}
    />
  );
}
