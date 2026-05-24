// ════════════ WŁASNE POZYCJE ════════════

import { CUSTOM_TABS, COMMON_ITEMS } from '../data/constants.js';
import { customItems } from '../store/state.js';
import { pln } from '../utils/format.js';

const UNITS = ['szt.','mb','m²','m³','kg','l','worek','ark','kpl','rbg'];

export function addCustom(tab, d = null) {
  const item = d || { id: Date.now(), name: '', qty: 1, unit: 'szt.', price: 0, enabled: true };
  if (!d) customItems[tab].push(item);
  renderCustom(tab);
  window.calc?.();
}

export function renderCustom(tab) {
  const c = document.getElementById('custom-' + tab);
  if (!c) return;

  if (!document.getElementById('common-items-list') && typeof COMMON_ITEMS !== 'undefined') {
    const dl = document.createElement('datalist');
    dl.id = 'common-items-list';
    dl.innerHTML = COMMON_ITEMS.map(x => `<option value="${x}">`).join('');
    document.body.appendChild(dl);
  }

  if (!customItems[tab].length) {
    c.innerHTML = '<div style="font-size:.69rem;color:var(--mut);padding:4px 0">Brak własnych pozycji.</div>';
    return;
  }

  c.innerHTML = customItems[tab].map((it, i) => `
    <div class="sub-row">
      <button class="sub-del" onclick="window.removeCustom('${tab}',${i})">✕</button>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <input type="checkbox" ${it.enabled ? 'checked' : ''} onchange="window.updCustom('${tab}',${i},'enabled',this.checked)" style="width:17px;height:17px;accent-color:var(--acc)">
        <span style="font-size:.72rem;font-weight:600;color:var(--acc2)">Własna pozycja #${i + 1}</span>
        <span id="custtot-${tab}-${i}" style="font-size:.72rem;color:var(--grn);margin-left:auto;font-weight:700">${it.enabled ? pln(it.qty * it.price) : 'wyłączona'}</span>
      </div>
      <div class="fg fg2">
        <div class="ig"><label>Nazwa pozycji</label><input type="text" list="common-items-list" value="${it.name}" placeholder="wybierz z listy lub wpisz…" oninput="window.updCustom('${tab}',${i},'name',this.value)"></div>
        <div class="ig"><label>Jednostka</label>
          <select onchange="window.updCustom('${tab}',${i},'unit',this.value)">
            ${UNITS.map(u => `<option value="${u}" ${it.unit === u ? 'selected' : ''}>${u}</option>`).join('')}
          </select>
        </div>
        <div class="ig"><label>Ilość</label><input type="number" value="${it.qty}" min="0" step="0.01" oninput="window.updCustom('${tab}',${i},'qty',+this.value)"></div>
        <div class="ig"><label>Cena jedn. (zł/${it.unit})</label><input type="number" value="${it.price}" min="0" step="0.01" oninput="window.updCustom('${tab}',${i},'price',+this.value)"></div>
      </div>
    </div>`).join('');
}

export function updCustom(tab, i, k, v) {
  const it = customItems[tab][i];
  if (!it) return;
  it[k] = v;
  if (k === 'name' || k === 'qty' || k === 'price') {
    const el = document.getElementById('custtot-' + tab + '-' + i);
    if (el) el.textContent = it.enabled ? pln((it.qty || 0) * (it.price || 0)) : 'wyłączona';
    window.debCalc?.();
  } else {
    renderCustom(tab);
    window.calc?.();
  }
}

export function removeCustom(tab, i) {
  customItems[tab].splice(i, 1);
  renderCustom(tab);
  window.calc?.();
}

export function getCustomCost() {
  let t = 0;
  CUSTOM_TABS.forEach(tab => customItems[tab].forEach(it => { if (it.enabled) t += it.qty * it.price; }));
  return t;
}

export function getAllCustomItems() {
  const out = [];
  CUSTOM_TABS.forEach(tab => customItems[tab].forEach(it => {
    if (it.enabled && it.name) out.push({ ...it, tab });
  }));
  return out;
}

Object.assign(window, { addCustom, renderCustom, updCustom, removeCustom, getCustomCost, getAllCustomItems });
