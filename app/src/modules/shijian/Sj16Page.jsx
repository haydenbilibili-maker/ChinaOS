import ShijianHtmlShell from './ShijianHtmlShell.jsx';

export default function Sj16Page() {
  return (
    <ShijianHtmlShell
      moduleId="shijianSJ16"
      badge="SJ-16 · 史鉴"
      title="变法谱系矩阵"
      subtitle="五变法跨案对比 · 改革的两难 · 综合层"
      htmlSrc="/shijian/SJ-16.html"
      frameTitle="SJ-16 变法谱系矩阵"
      hintLinks={[{ href: '/shijian/SJ-16.html', label: '/shijian/SJ-16.html' }]}
    />
  );
}
