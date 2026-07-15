import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj52Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ52"
      badge="SJ-52 · 史鉴"
      title="五四运动"
      subtitle="合法性叙事断裂 · 拒签和约 · 新民主主义开端"
      htmlSrc="/shijian/SJ-52.html"
      frameTitle="SJ-52 五四运动"
      hintLinks={[{ href: '/shijian/SJ-52.html', label: '/shijian/SJ-52.html' }]}
    />
  );
}
