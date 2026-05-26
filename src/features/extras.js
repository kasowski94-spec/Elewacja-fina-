// ════════════ PRACE DODATKOWE ════════════

import { EXTRAS_DEF } from '../data/constants.js';
import { pln } from '../utils/format.js';

export function buildExtras() {
  const c = document.getElementById('extrasContainer');
  if (!c) return;
  EXTRAS_DEF.forEach(e => {
    const d = document.createElement('div');
    d.className = 'chk-row';
    d.id = 'exrow_' + e.id;
    d.innerHTML = `<input type="checkbox" id="ext_${e.id}" onchange="window.toggleExtra('${e.id}')">
      <div class="chk-body"><div class="chk-title">${e.lbl}</div><div class="chk-desc">${e.hint}</div>
        <div class="chk-extra" id="exinp_${e.id}"><div class="fg fg2" style="margin-top:6px">
          <div class="ig"><label>Ilość (${e.unit})</label><input type="number" id="ext_qty_${e.id}" value="${e.qDef}" min="0" oninput="window.calcExtras()"></div>
          <div class="ig"><label>Cena (zł/${e.unit})</label><input type="number" id="ext_p_${e.id}" value="${e.pDef}" min="0" step=".5" oninput="window.calcExtras()"></div>
        </div></div>
      </div><span class="chk-cost" id="ext_cost_${e.id}">—</span>`;
    c.appendChild(d);
  });
  calcExtras();
}

export function toggleExtra(id) {
  const on = document.getElementById('ext_' + id)?.checked;
  document.getElementById('exrow_' + id)?.classList.toggle('active', on);
  calcExtras();
}

export function calcExtras() {
  let t = 0;
  EXTRAS_DEF.forEach(e => {
    const on = document.getElementById('ext_' + e.id)?.checked;
    const q = parseFloat(document.getElementById('ext_qty_' + e.id)?.value) || 0;
    const p = parseFloat(document.getElementById('ext_p_' + e.id)?.value) || 0;
    const c = on ? q * p : 0;
    t += c;
    const el = document.getElementById('ext_cost_' + e.id);
    if (el) el.textContent = on ? pln(c) : '—';
  });
  const s = document.getElementById('extrasSummary');
  if (s) s.innerHTML = `<div style="font-size:1rem;font-weight:700;color:var(--acc2)">${pln(t)}</div>
    <div style="font-size:.66rem;color:var(--mut);margin-top:3px">Zaznaczone prace</div>`;
  window.calc?.();
  return t;
}

export function getExtrasCost() {
  return EXTRAS_DEF.reduce((s, e) => {
    const on = document.getElementById('ext_' + e.id)?.checked;
    const q = parseFloat(document.getElementById('ext_qty_' + e.id)?.value) || 0;
    const p = parseFloat(document.getElementById('ext_p_' + e.id)?.value) || 0;
    return s + (on ? q * p : 0);
  }, 0);
}

Object.assign(window, { buildExtras, toggleExtra, calcExtras, getExtrasCost });
