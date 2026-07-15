import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj50Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ50"
      badge="SJ-50 · 史鉴"
      title="太平天国"
      subtitle="基座承载越阈 · 军事消耗 · 清帝国震荡"
      htmlSrc="/shijian/SJ-50.html"
      frameTitle="SJ-50 太平天国"
      hintLinks={[{ href: '/shijian/SJ-50.html', label: '/shijian/SJ-50.html' }]}
    />
  );
}
