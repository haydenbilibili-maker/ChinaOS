/** 重构河山 · 交互初始化 */
import { HESHAN_AS_OF, HESHAN_FISCAL_ROWS } from '../shared/heshanData.js';

export function initHeshanFiscal(root) {
  if (!root) return () => {};
  const cleanups = [];
  try {
    const P = HESHAN_FISCAL_ROWS;
    const COSTK = [1.0, 1.1, 1.3];
    const $ = (id) => root.querySelector(`#${id}`);
    function calc() {
      const exp = +$('exp').value;
      const rev = +$('rev').value / 100;
      const eq = +$('eq').value / 100;
      const useCost = +$('cost').value;
      $('v_exp').textContent = `${exp.toFixed(2)} 万元/人`;
      $('v_rev').textContent = `${(rev * 100).toFixed(1)}%`;
      $('v_eq').textContent = `${Math.round(eq * 100)}%`;
      $('v_cost').textContent = useCost ? '开启' : '关闭';
      const rows = P.map((p) => {
        const k = useCost ? COSTK[p[3]] : 1.0;
        const stdExp = p[1] * exp * k;
        const stdRev = p[2] * rev;
        const gap = stdExp - stdRev;
        const transfer = gap > 0 ? gap * eq : 0;
        const give = gap < 0 ? -gap : 0;
        return { n: p[0], transfer, give, net: transfer > 0 ? transfer : -give };
      });
      const totalTransfer = rows.reduce((a, r) => a + r.transfer, 0);
      const totalGive = rows.reduce((a, r) => a + r.give, 0);
      const recvCnt = rows.filter((r) => r.transfer > 0).length;
      const giveCnt = rows.filter((r) => r.give > 0).length;
      $('sumcards').innerHTML = `
        <div class="sumcard"><div class="v">${(totalTransfer / 10000).toFixed(2)}<small>万亿</small></div><div class="k">转移支付总盘子</div></div>
        <div class="sumcard"><div class="v">${recvCnt}<small>个</small></div><div class="k">净受益单元</div></div>
        <div class="sumcard"><div class="v">${giveCnt}<small>个</small></div><div class="k">净贡献单元</div></div>
        <div class="sumcard"><div class="v">${(totalGive / 10000).toFixed(2)}<small>万亿</small></div><div class="k">盈余可上缴财力</div></div>`;
      const showgive = $('showgive').checked;
      let list = rows.slice().sort((a, b) => b.net - a.net);
      if (!showgive) list = list.filter((r) => r.transfer > 0);
      const maxV = Math.max(...list.map((r) => Math.max(r.transfer, r.give)), 1);
      $('bars').innerHTML = list
        .map((r) => {
          if (r.transfer > 0) {
            return `<div class="bar-row"><div class="nm">${r.n}</div><div class="bar-track"><div class="bar-fill recv" style="width:${(r.transfer / maxV) * 100}%"></div></div><div class="val recv">+${Math.round(r.transfer)}亿</div></div>`;
          }
          return `<div class="bar-row"><div class="nm">${r.n}</div><div class="bar-track"><div class="bar-fill give" style="width:${(r.give / maxV) * 100}%"></div></div><div class="val give">−${Math.round(r.give)}亿</div></div>`;
        })
        .join('');
    }
    ['exp', 'rev', 'eq', 'cost', 'showgive'].forEach((id) => $(id).addEventListener('input', calc));

    function calcSave() {
      const num = +$('d_num').value;
      const cost = +$('d_cost').value;
      const cut = +$('d_cut').value / 100;
      $('rv_num').textContent = num;
      $('rv_cost').textContent = cost;
      $('rv_cut').textContent = Math.round(cut * 100);
      const save = Math.round(num * cost * cut);
      $('out_save').innerHTML = `${save.toLocaleString()}<small>亿/年</small>`;
    }
    ['d_num', 'd_cost', 'd_cut'].forEach((id) => $(id).addEventListener('input', calcSave));

    function calcDebt() {
      const debt = +$('b_debt').value;
      const rate = +$('b_rate').value / 100;
      const spread = +$('b_spread').value;
      const year = +$('b_year').value;
      $('rv_debt').textContent = debt;
      $('rv_rate').textContent = Math.round(rate * 100);
      $('rv_spread').textContent = spread.toFixed(1);
      $('rv_year').textContent = year;
      const swap = debt * rate;
      const intSave = Math.round((swap * 10000 * spread) / 100);
      $('out_int').innerHTML = `${intSave.toLocaleString()}<small>亿/年</small>`;
      $('out_swap').textContent = (swap / year).toFixed(2);
    }
    ['b_debt', 'b_rate', 'b_spread', 'b_year'].forEach((id) => $(id).addEventListener('input', calcDebt));

    const asOfEl = root.querySelector('#hs-fiscal-asof');
    if (asOfEl) asOfEl.textContent = HESHAN_AS_OF;

    calc();
    calcSave();
    calcDebt();
  } catch (err) {
    console.warn('[initHeshanFiscal]', err);
  }
  return () => {
    cleanups.forEach((fn) => {
      try {
        fn();
      } catch (_) {}
    });
  };
}
