// ════════════ ROUTER / TABS ════════════

import { TABS_ORDER, SUBTABS_MAP } from '../data/constants.js';

export function swTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tb').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
  document.querySelector(`.tb[data-tab="${name}"]`)?.classList.add('active');
  buildSubtabs(name);
  window.scrollTo(0, 0);
}

export function buildSubtabs(tabName) {
  const bar = document.getElementById('subtabs-bar');
  if (!bar) return;
  const subs = SUBTABS_MAP[tabName];
  if (!subs || !subs.length) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const sections = document.querySelectorAll(`#tab-${tabName} [id]`);
  bar.innerHTML = subs.map((s, i) => {
    const el = document.getElementById(s) ||
               document.querySelector(`#tab-${tabName} .section:nth-child(${i+1})`);
    const label = el?.querySelector('.sec-head, .card-title, .we-title')?.textContent?.trim() ||
                  el?.getAttribute('data-label') || s;
    return `<button class="stb ${i===0?'active':''}" onclick="window.activateSub('${tabName}','${s}',this)">${label.slice(0,30)}</button>`;
  }).join('');
}

export function activateSub(tabName, subId, btn) {
  document.querySelectorAll('#subtabs-bar .stb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(subId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

Object.assign(window, { swTab, buildSubtabs, activateSub });

document.querySelectorAll('.tb').forEach(btn => {
  btn.addEventListener('click', () => swTab(btn.dataset.tab));
});

swTab('ustawienia');
