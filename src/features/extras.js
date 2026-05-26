// ════════════ PRACE DODATKOWE ════════════

import { EXTRAS_DEF } from '../data/constants.js';
import { fmt, pln } from '../utils/format.js';

export function buildExtras() {
  const c = document.getElementById('extrasContainer');
  if (!c) return;
  c.innerHTML = EXTRAS_DEF.map(e => `
    <div class="chk-row" id="exrow_${e.id}">
      <input type="checkbox" id="ext_${e.id}" onchange="toggleExtra('${e.id}',this.checked)">
      <div class="chk-body">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="chk-title">${e.lbl}</div>
          <div class="chk-cost" id="extcost_${e.id}">—</div>
        </div>
        <div class="chk-desc">${e.hint}</div>
        <div class="chk-extra">
          <div class="fg fg2" style="margin-top:6px">
            <div class="ig"><label>Ilość (${e.unit})</label><input type="number" id="ext_qty_${e.id}" value="${e.defQty}" min="0" oninput="calcExtras()"></div>
            <div class="ig"><label>Stawka (zł/${e.unit})</label><input type="number" id="ext_p_${e.id}" value="${e.defP}" min="0" step=".5" oninput="calcExtras()"></div>
          </div>
        </div>
      </div>
    </div>`).join('');
  calcExtras();
}

export function toggleExtra(id, on) {
  document.getElementById('exrow_' + id)?.classList.toggle('active', on);
  calcExtras();
  window.calc?.();
}

export function calcExtras() {
  let total = 0;
  EXTRAS_DEF.forEach(e => {
    const on = document.getElementById('ext_' + e.id)?.checked;
    const qty = parseFloat(document.getElementById('ext_qty_' + e.id)?.value) || 0;
    const p   = parseFloat(document.getElementById('ext_p_' + e.id)?.value)   || 0;
    const cost = on ? qty * p : 0;
    total += cost;
    const el = document.getElementById('extcost_' + e.id);
    if (el) el.textContent = on ? pln(cost) : '—';
  });
  const sum = document.getElementById('extrasSummary');
  if (sum) sum.innerHTML = `<div style="font-family:var(--font-head);font-size:1.1rem;color:var(--grn);font-weight:700">${pln(total)}</div><div style="font-size:.67rem;color:var(--mut)">Razem prace dodatkowe</div>`;
  return total;
}

export function getExtrasCost() {
  return EXTRAS_DEF.reduce((s, e) => {
    const on = document.getElementById('ext_' + e.id)?.checked;
    const qty = parseFloat(document.getElementById('ext_qty_' + e.id)?.value) || 0;
    const p   = parseFloat(document.getElementById('ext_p_' + e.id)?.value)   || 0;
    return s + (on ? qty * p : 0);
  }, 0);
}

Object.assign(window, { buildExtras, toggleExtra, calcExtras, getExtrasCost });
