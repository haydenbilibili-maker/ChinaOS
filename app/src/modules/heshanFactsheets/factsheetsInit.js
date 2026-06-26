/** 重构河山 · 交互初始化（自 0627.zip 迁移） */
export function initHeshanFactsheets(root) {
  if (!root) return () => {};
  const cleanups = [];
  let io;
  try {
    io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    root.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 50}ms`;
      io.observe(el);
    });
    cleanups.push(() => io?.disconnect());
  } catch (err) {
    console.warn('[initHeshanFactsheets]', err);
  }
  return () => {
    cleanups.forEach((fn) => { try { fn(); } catch (_) {} });
  };
}
