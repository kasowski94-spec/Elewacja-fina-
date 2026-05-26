// ════════════ PIANKA MONTAŻOWA ════════════

import { FOAM_TYPES } from '../data/constants.js';
import { foamItems, setFoamItems } from '../store/state.js';

export function renderFoam() {
  const c = document.getElementById('foamContainer');
  if (!c) return;
  if (!foamItems.length) {
    c.innerHTML = '<div style="font-size:.73rem;color:var(--mut);padding:4px 0">Brak pozycji pianki.</div>';
    return;
  }
  c.innerHTML = foamItems.map((f, i) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
      <select style="flex:1;background:var(--card2);border:1px solid var(--brd);border-radius:7px;color:var(--txt);padding:7px 8px;font-size:.83rem" onchange="updFoam(${i},'type',this.value)">
        ${Object.entries(FOAM_TYPES).map(([k,v]) => `<option value="${k}" ${f.type===k?'selected':''}>${v.name}</option>`).join('')}
      </select>
      <input type="number" value="${f.count}" min="0" style="width:60px;background:var(--card2);border:1px solid var(--brd);border-radius:7px;color:var(--txt);padding:7px 8px;font-size:.83rem" oninput="updFoam(${i},'count',+this.value)">
      <span style="font-size:.72rem;color:var(--mut)">szt.</span>
      <button style="background:none;border:none;color:var(--mut);font-size:1.1rem;cursor:pointer" onclick="removeFoam(${i})">✕</button>
    </div>`).join('');
}

export function addFoam() {
  foamItems.push({ type: 'niskoprezna', count: 1 });
  renderFoam();
  window.calc?.();
}

export function updFoam(i, k, v) {
  foamItems[i][k] = v;
  window.debCalc?.();
}

export function removeFoam(i) {
  foamItems.splice(i, 1);
  renderFoam();
  window.calc?.();
}

Object.assign(window, { renderFoam, addFoam, updFoam, removeFoam });
