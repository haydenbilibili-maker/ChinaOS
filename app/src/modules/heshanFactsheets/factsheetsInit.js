/** 重构河山 · 交互初始化（自 0627.zip 迁移） */
const UNIT_SLUG_BY_TITLE = {
  京畿省: 'jingji',
  冀南省: 'jinan',
  冀东省: 'jidong',
  蒙东省: 'mengdong',
  蒙中省: 'mengzhong',
  蒙西省: 'mengxi',
  胶东省: 'jiaodong',
  鲁中省: 'luzhong',
  中原省: 'zhongyuan',
  豫西南省: 'yuxinan',
  淮海省: 'huaihai',
  苏南省: 'sunan',
  江淮省: 'jianghuai',
  浙北省: 'zhebei',
  浙南省: 'zhenan',
  皖南省: 'wannan',
  皖中省: 'wanzhong',
  湖北省: 'hubei-reorg',
  鄂西省: 'exi',
  闽东省: 'mindong',
  闽南省: 'minnan',
  深圳: 'shenzhen',
  珠三角省: 'zhusanjiao',
  潮汕省: 'chaoshan',
  粤西省: 'yuexi',
  粤北省: 'yuebei',
  成都平原省: 'chengdu-pingyuan',
  川南省: 'chuannan',
  攀西省: 'panxi',
  关中省: 'guanzhong',
  陕北省: 'shanbei',
  陕南省: 'shannan',
  陇右省: 'longyou',
  河西省: 'hexi',
};

function cardTitleKey(h3) {
  if (!h3) return '';
  const clone = h3.cloneNode(true);
  clone.querySelectorAll('.badge, small').forEach((el) => el.remove());
  return clone.textContent.replace(/★/g, '').replace(/（重组）/g, '').trim();
}

export function initHeshanFactsheets(root) {
  if (!root) return () => {};
  const cleanups = [];
  let io;
  try {
    root.querySelectorAll('.fc').forEach((card) => {
      const title = cardTitleKey(card.querySelector('h3'));
      const slug = UNIT_SLUG_BY_TITLE[title];
      if (slug) card.dataset.heshanUnit = slug;
    });

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
