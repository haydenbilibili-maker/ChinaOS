import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw22Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW22"
      badge="SJW-22 · 史鉴·世界"
      title="中国改革开放对照外卷"
      subtitle="发展型对照 · 强制关键差异"
      htmlSrc="/shijian-world/SJW-22.html"
      frameTitle="SJW-22 中国改革开放对照外卷"
      hintLinks={[{ href: '/shijian-world/SJW-22.html', label: '/shijian-world/SJW-22.html' }]}
    />
  );
}
