import ShijianHtmlShell from '../shijian/ShijianHtmlShell.jsx';

export default function Sjw02Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianWorldSJW02"
      badge="SJW-02 · 史鉴·世界"
      title="两次世界大战"
      subtitle="联盟锁死 · 总体战 · 帝国透支"
      htmlSrc="/shijian-world/SJW-02.html"
      frameTitle="SJW-02 两次世界大战"
      hintLinks={[{ href: '/shijian-world/SJW-02.html', label: '/shijian-world/SJW-02.html' }]}
    />
  );
}
