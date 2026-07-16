import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw24Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW24"
      badge="SJW-24 · 史鉴·世界"
      title="韩国发展型国家"
      subtitle="威权汲取 · 财阀出口 · 冷战前线"
      htmlSrc="/shijian-world/SJW-24.html"
      frameTitle="SJW-24 韩国发展型国家"
      hintLinks={[{ href: '/shijian-world/SJW-24.html', label: '/shijian-world/SJW-24.html' }]}
    />
  );
}
