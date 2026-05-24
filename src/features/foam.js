// ════════════ PIANKI MONTAŻOWE ════════════

import { FOAM_TYPES } from '../data/constants.js';
import { foamItems, setFoamItems } from '../store/state.js';
import { pln } from '../utils/format.js';

export function renderFoam() {
  const c = document.getElementById('foamContainer');
  if (!c) return;
  if (!foamItems.length) {
    c.innerHTML = '<div style="font-size:.69rem;color:var(--mut)">Brak pianki.</div>';
    window.calc?.();
    return;
  }
  c.innerHTML = foamItems.map((f, i) => `
    <div class="sub-row">
      <button class="sub-del" onclick="window.removeFoam(${i})">✕</button>
      <div class="sub-title">Pianka #${i + 1}</div>
      <div class="fg fg2">
        <div class="ig"><label>Rodzaj pianki</label>
          <select onchange="window.updFoam(${i},'type',this.value)">
            ${Object.entries(FOAM_TYPES).map(([k, v]) => `<option value="${k}" ${f.type === k ? 'selected' : ''}>${v.name}</option>`).join('')}
          </select>
        </div>
        <div class="ig"><label>Ilość (szt. 750ml)</label><input type="number" value="${f.count}" min="0" oninput="window.updFoam(${i},'count',+this.value)"></div>
      </div>
      <div id="foamcost-${i}" style="margin-top:6px;font-size:.68rem;color:var(--grn)">
        Koszt: <b>${pln(f.count * (FOAM_TYPES[f.type]?.price || 14))}</b> (${FOAM_TYPES[f.type]?.price || 14} zł/szt.)
      </div>
    </div>`).join('');
}

export function addFoam() {
  foamItems.push({ type: 'uniwersalna', count: 1 });
  renderFoam();
  window.calc?.();
}

export function updFoam(i, k, v) {
  const f = foamItems[i];
  if (!f) return;
  f[k] = v;
  if (k === 'count') {
    const el = document.getElementById('foamcost-' + i);
    if (el) el.innerHTML = 'Koszt: <b>' + pln((f.count || 0) * (FOAM_TYPES[f.type]?.price || 14)) + '</b> (' + (FOAM_TYPES[f.type]?.price || 14) + ' zł/szt.)';
    window.debCalc?.();
  } else {
    renderFoam();
    window.calc?.();
  }
}

export function removeFoam(i) {
  foamItems.splice(i, 1);
  renderFoam();
  window.calc?.();
}

Object.assign(window, { addFoam, updFoam, removeFoam, renderFoam });
