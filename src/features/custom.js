// ════════════ WŁASNE POZYCJE ════════════

import { CUSTOM_TABS } from '../data/constants.js';
import { customItems } from '../store/state.js';
import { fmt, pln } from '../utils/format.js';

export function addCustom(tab) {
  customItems[tab].push({ id: Date.now(), name: 'Nowa pozycja', qty: 1, unit: 'szt.', price: 0, enabled: true });
  renderCustom(tab);
}

export function renderCustom(tab) {
  const c = document.getElementById('custom-' + tab);
  if (!c) return;
  const items = customItems[tab];
  if (!items || !items.length) {
    c.innerHTML = '<div style="font-size:.71rem;color:var(--mut);padding:4px 0">Brak własnych pozycji.</div>';
    window.calc?.();
    return;
  }
  c.innerHTML = items.map((it, i) => `
    <div style="display:grid;grid-template-columns:1fr 60px 70px 70px 28px;gap:6px;align-items:center;margin-bottom:6px;padding:7px 9px;background:var(--card2);border:1px solid var(--brd);border-radius:8px">
      <input type="text" value="${it.name}" style="background:var(--card);border:1px solid var(--brd);border-radius:6px;color:var(--txt);font-size:.78rem;padding:5px 7px" oninput="updCustom('${tab}',${i},'name',this.value)">
      <input type="number" value="${it.qty}" min="0" step="0.01" style="background:var(--card);border:1px solid var(--brd);border-radius:6px;color:var(--txt);font-size:.78rem;padding:5px 7px" oninput="updCustom('${tab}',${i},'qty',+this.value)">
      <select style="background:var(--card);border:1px solid var(--brd);border-radius:6px;color:var(--txt);font-size:.78rem;padding:5px 4px" onchange="updCustom('${tab}',${i},'unit',this.value)">
        ${['szt.','mb','m²','m³','kg','l','worek','ark','kpl','rbg'].map(u=>`<option value="${u}" ${it.unit===u?'selected':''}>${u}</option>`).join('')}
      </select>
      <input type="number" value="${it.price}" min="0" step="0.01" style="background:var(--card);border:1px solid var(--brd);border-radius:6px;color:var(--txt);font-size:.78rem;padding:5px 7px" oninput="updCustom('${tab}',${i},'price',+this.value)" placeholder="zł">
      <button style="background:none;border:none;color:var(--mut);font-size:1rem;cursor:pointer" onclick="removeCustom('${tab}',${i})">✕</button>
    </div>`).join('');
  window.calc?.();
}

export function updCustom(tab, i, k, v) {
  customItems[tab][i][k] = v;
  window.debCalc?.();
}

export function removeCustom(tab, i) {
  customItems[tab].splice(i, 1);
  renderCustom(tab);
  window.calc?.();
}

export function getCustomCost() {
  return CUSTOM_TABS.reduce((s, t) =>
    s + (customItems[t] || []).reduce((ss, it) => ss + (it.qty || 0) * (it.price || 0), 0), 0);
}

export function getAllCustomItems() {
  return CUSTOM_TABS.flatMap(t => (customItems[t] || []).map(it => ({ ...it, tab: t })));
}

Object.assign(window, { addCustom, renderCustom, updCustom, removeCustom, getCustomCost, getAllCustomItems });
