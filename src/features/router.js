// ════════════ ROUTER: TABS + SUBTABS ════════════

import { TABS_ORDER } from '../data/constants.js';
import { libMode } from '../store/state.js';

const SUBTABS_MAP = {
  biblioteka: [
    { id: 'mat', label: 'Materiały', emoji: '🧱', type: 'mode' },
    { id: 'rob', label: 'Robocizna', emoji: '👷', type: 'mode' },
    { id: 'fav', label: 'Ulubione', emoji: '⭐', type: 'mode' },
  ],
  materialy: [
    { id: 'materialsSection', label: 'Zestawienie', emoji: '📋', type: 'anchor' },
    { id: 'custom-materialy', label: 'Własne', emoji: '◆', type: 'anchor' },
    { id: 'parapety', label: 'Parapety', emoji: '🪟', type: 'route' },
    { id: 'lacze', label: 'Łączniki', emoji: '🔩', type: 'route' },
    { id: 'dodatki', label: 'Prace dod.', emoji: '🔧', type: 'route' },
    { id: 'rusztowanie', label: 'Rusztowanie', emoji: '🏗', type: 'route' },
  ],
  wycena: [
    { id: 'wys-body-eps', label: 'EPS', emoji: '🧊', type: 'anchor' },
    { id: 'wys-body-kleje', label: 'Kleje', emoji: '🧪', type: 'anchor' },
    { id: 'wys-body-tynk', label: 'Tynk', emoji: '🎨', type: 'anchor' },
    { id: 'wys-body-lacze', label: 'Łączniki', emoji: '🔩', type: 'anchor' },
    { id: 'wys-body-profile', label: 'Profile', emoji: '📏', type: 'anchor' },
    { id: 'wys-body-parapety', label: 'Parapety', emoji: '🪟', type: 'anchor' },
    { id: 'wys-body-tasmy', label: 'Taśmy', emoji: '🩹', type: 'anchor' },
    { id: 'wys-body-labor', label: 'Robocizna', emoji: '👷', type: 'anchor' },
    { id: 'wys-body-rusz', label: 'Rusztowanie', emoji: '🏗', type: 'anchor' },
    { id: 'wys-body-prace', label: 'Prace dod.', emoji: '🔧', type: 'anchor' },
    { id: 'wycena-summary', label: 'Podsumowanie', emoji: '📊', type: 'anchor' },
  ],
  ceny: [
    { id: 'pricesGrid', label: 'Ceny ręczne', emoji: '💰', type: 'anchor' },
    { id: 'laborLibList', label: 'Robocizna', emoji: '👷', type: 'anchor' },
    { id: 'costSection', label: 'Wariant', emoji: '📦', type: 'anchor' },
    { id: 'biblioteka', label: 'Biblioteka', emoji: '📚', type: 'route' },
    { id: 'porownanie', label: 'Porównanie', emoji: '📊', type: 'route' },
  ],
  warianty: [
    { id: 'cardsContainer', label: 'Karty EPS', emoji: '📦', type: 'anchor' },
    { id: 'costTableBody', label: 'Tabela', emoji: '📋', type: 'anchor' },
  ],
  lacze: [
    { id: 'anchorResult', label: 'Kalkulator', emoji: '🧮', type: 'anchor' },
    { id: 'anchorTableBody', label: 'Tabela długości', emoji: '📋', type: 'anchor' },
    { id: 'custom-lacze', label: 'Własne pozycje', emoji: '➕', type: 'anchor' },
  ],
};

let _subtabsActive = null;

export function swTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tb').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name)?.classList.add('active');
  document.querySelectorAll('.tb').forEach(b => {
    if (b.getAttribute('onclick')?.includes("'" + name + "'")) b.classList.add('active');
  });
  buildSubtabs(name);
  window.scrollTo(0, 0);
}

export function buildSubtabs(tabName) {
  const bar = document.getElementById('subtabs-bar');
  if (!bar) return;
  const items = SUBTABS_MAP[tabName];
  if (!items || !items.length) { bar.classList.add('hidden'); bar.innerHTML = ''; _subtabsActive = null; return; }
  bar.classList.remove('hidden');
  bar.innerHTML = items.map((s, i) => {
    let active = false;
    if (s.type === 'mode') {
      active = (libMode === s.id);
    } else if (s.type === 'anchor') {
      active = (_subtabsActive === s.id);
      if (!_subtabsActive && i === 0) active = true;
    }
    return `<button type="button" class="stb ${active ? 'active' : ''}" data-sub="${s.id}" onclick="window.activateSub('${tabName}','${s.id}')">
      ${s.emoji ? `<span class="stb-emoji">${s.emoji}</span>` : ''}${s.label}
    </button>`;
  }).join('');
  bar.scrollLeft = 0;
}

export function activateSub(tabName, subId) {
  const items = SUBTABS_MAP[tabName];
  if (!items) return;
  const s = items.find(x => x.id === subId);
  if (!s) return;
  if (s.type === 'mode') {
    window.setLibMode?.(subId);
    buildSubtabs(tabName);
    return;
  }
  if (s.type === 'route') {
    swTab(s.id);
    return;
  }
  if (s.type === 'anchor') {
    _subtabsActive = subId;
    const el = document.getElementById(subId);
    if (el) {
      const topbarH = document.getElementById('topbar')?.offsetHeight || 90;
      const subH = document.getElementById('subtabs-bar')?.offsetHeight || 0;
      const y = el.getBoundingClientRect().top + window.scrollY - topbarH - subH - 8;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
    document.querySelectorAll('#subtabs-bar .stb').forEach(b => b.classList.remove('active'));
    document.querySelector(`#subtabs-bar .stb[data-sub="${subId}"]`)?.classList.add('active');
    const btn = document.querySelector(`#subtabs-bar .stb[data-sub="${subId}"]`);
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// Scroll spy
let _spyTimer = null;
let _scrollTrigger = 114; // cached topbar + subbar + 24; updated by invalidateScrollCache()
export function invalidateScrollCache() {
  const tb = document.getElementById('topbar')?.offsetHeight || 90;
  const sb = document.getElementById('subtabs-bar')?.offsetHeight || 0;
  _scrollTrigger = tb + sb + 24;
}
window.addEventListener('scroll', () => {
  clearTimeout(_spyTimer);
  _spyTimer = setTimeout(() => {
    const activeTab = document.querySelector('.tab-panel.active')?.id?.replace('tab-', '');
    const items = SUBTABS_MAP[activeTab];
    if (!items) return;
    const anchors = items.filter(s => s.type === 'anchor');
    if (!anchors.length) return;
    const trigger = _scrollTrigger;
    let current = anchors[0].id;
    for (const a of anchors) {
      const el = document.getElementById(a.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= trigger) current = a.id;
      else break;
    }
    if (current !== _subtabsActive) {
      _subtabsActive = current;
      document.querySelectorAll('#subtabs-bar .stb').forEach(b => b.classList.remove('active'));
      document.querySelector(`#subtabs-bar .stb[data-sub="${current}"]`)?.classList.add('active');
    }
  }, 80);
}, { passive: true });

Object.assign(window, { swTab, buildSubtabs, activateSub });
