import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj18Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ18"
      badge="SJ-18 · 史鉴"
      title="拐点谱系矩阵"
      subtitle="三拐点跨案对比 · 鼎盛隐性危机"
      htmlSrc="/shijian/SJ-18.html"
      frameTitle="SJ-18 拐点谱系矩阵"
      hintLinks={[{ href: '/shijian/SJ-18.html', label: '/shijian/SJ-18.html' }]}
    />
  );
}
