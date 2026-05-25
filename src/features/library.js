// ════════════ BIBLIOTEKA MATERIAŁÓW I ROBOCIZNY ════════════

import { MATERIAL_LIBRARY, LABOR_LIBRARY, MAT_CATEGORIES, LABOR_CATEGORIES } from '../data/library.js';
import { CUSTOM_TABS } from '../data/constants.js';
import {
  libMode, setLibMode, libCatActive, setLibCatActive,
  favorites, setFavorites, setLibPickerTarget, libPickerTarget,
  priceMode, setPriceMode,
} from '../store/state.js';
import { customItems } from '../store/state.js';
import { fmt } from '../utils/format.js';

function vatFor(isLabor) { return priceMode === 'brutto' ? (isLabor ? 1.23 : 1.08) : 1; }

export function togglePriceMode(mode) {
  setPriceMode(mode);
  document.querySelectorAll('.lib-pmode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pricemode-' + mode)?.classList.add('active');
  const note = document.querySelector('.lib-info-note');
  if (note) note.dataset.priceMode = mode;
  renderLibrary();
}

export function initLibMode(mode) {
  setLibMode(mode);
  setLibCatActive('');
  document.querySelectorAll('.lib-mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('libmode-' + mode)?.classList.add('active');
  renderLibCatFilter();
  renderLibrary();
  if (typeof window.buildSubtabs === 'function' && document.getElementById('tab-biblioteka')?.classList.contains('active')) {
    window.buildSubtabs('biblioteka');
  }
}

export function getLibData() {
  if (libMode === 'rob') return LABOR_LIBRARY;
  if (libMode === 'fav') return [...MATERIAL_LIBRARY, ...LABOR_LIBRARY].filter(it => favorites.includes(it.id));
  return MATERIAL_LIBRARY;
}

export function getLibCats() {
  return libMode === 'rob' ? LABOR_CATEGORIES : MAT_CATEGORIES;
}

export function renderLibCatFilter() {
  const el = document.getElementById('libCatFilter');
  if (!el) return;
  if (libMode === 'fav') { el.innerHTML = ''; return; }
  const cats = getLibCats();
  el.innerHTML = `<button class="lib-cat ${libCatActive === '' ? 'active' : ''}" onclick="window.setLibMode('');window.renderLibrary();window.renderLibCatFilter()">Wszystkie</button>` +
    Object.entries(cats).map(([k, v]) =>
      `<button class="lib-cat ${libCatActive === k ? 'active' : ''}" onclick="window.filterLibCat('${k}')">${v}</button>`
    ).join('');
}

export function filterLibCat(k) {
  setLibCatActive(k);
  renderLibrary();
  renderLibCatFilter();
}

export function renderLibrary() {
  const el = document.getElementById('libraryList');
  if (!el) return;
  const q = (document.getElementById('libSearch')?.value || '').toLowerCase().trim();
  let data = getLibData();
  if (libCatActive) data = data.filter(it => it.cat === libCatActive);
  if (q) data = data.filter(it => it.name.toLowerCase().includes(q) || (it.note || '').toLowerCase().includes(q));

  if (!data.length) {
    el.innerHTML = `<div style="text-align:center;padding:30px 12px;color:var(--mut);font-size:.8rem">
      ${libMode === 'fav' ? '⭐ Brak ulubionych. Kliknij gwiazdkę przy pozycji aby dodać.' : 'Brak wyników wyszukiwania.'}</div>`;
    return;
  }

  const cats = getLibCats();
  const groups = {};
  data.forEach(it => { (groups[it.cat] = groups[it.cat] || []).push(it); });

  // Use document fragment for performance
  const frag = document.createDocumentFragment();
  const wrapper = document.createElement('div');

  const vatLabel = priceMode === 'brutto' ? 'brutto' : 'netto';
  wrapper.innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div class="lib-section-hdr">${cats[cat] || cat}</div>
    ${items.map(it => {
    const fav = favorites.includes(it.id);
    const isLab = LABOR_LIBRARY.some(x => x.id === it.id);
    const vat = vatFor(isLab);
    return `<div class="lib-item">
        <button class="lib-fav ${fav ? 'on' : ''}" onclick="window.toggleFav('${it.id}')" title="Ulubione">${fav ? '⭐' : '☆'}</button>
        <div class="lib-item-body" onclick="window.addFromLibrary('${it.id}')">
          <div class="lib-item-name">${it.name}</div>
          <div class="lib-item-meta">${it.note ? it.note + ' · ' : ''}${it.lambda ? 'λ=' + it.lambda + ' · ' : ''}jedn. ${it.unit}</div>
        </div>
        <div class="lib-item-price">
          <div class="lib-price-avg">${fmt(it.avg * vat, 2)} zł</div>
          <div class="lib-price-range">${fmt(it.low * vat, 2)}–${fmt(it.high * vat, 2)} <span style="font-size:.58rem;color:var(--mut)">${vatLabel}</span></div>
        </div>
        <button class="lib-add" onclick="window.addFromLibrary('${it.id}')" title="Dodaj do projektu">+</button>
      </div>`;
  }).join('')}
  `).join('');

  el.innerHTML = wrapper.innerHTML;
}

export function toggleFav(id) {
  const i = favorites.indexOf(id);
  if (i < 0) favorites.push(id);
  else favorites.splice(i, 1);
  saveFavorites();
  renderLibrary();
  window.showToast?.(i < 0 ? '⭐ Dodano do ulubionych' : 'Usunięto z ulubionych');
}

export function saveFavorites() {
  try { localStorage.setItem('elewacjapro_fav', JSON.stringify(favorites)); } catch (e) {}
}

export function loadFavorites() {
  try {
    const s = localStorage.getItem('elewacjapro_fav');
    if (s) setFavorites(JSON.parse(s));
  } catch (e) {}
}

export function findLibItem(id) {
  return MATERIAL_LIBRARY.find(x => x.id === id) || LABOR_LIBRARY.find(x => x.id === id);
}

export function addFromLibrary(id) {
  const it = findLibItem(id);
  if (!it) return;
  const isLabor = LABOR_LIBRARY.some(x => x.id === id);
  const defTab = libPickerTarget || (isLabor ? 'dodatki' : 'materialy');
  showLibAddModal(it, defTab, isLabor);
}

export function showLibAddModal(it, defTab, isLabor) {
  const m = document.getElementById('modal-libadd');
  if (!m) return;
  m.querySelector('.modal').innerHTML = `
    <button class="modal-close" onclick="window.closeModal('modal-libadd')">✕</button>
    <h3>Dodaj z biblioteki</h3>
    <div style="background:var(--card2);border:1px solid var(--brd);border-radius:9px;padding:10px 12px;margin-bottom:12px">
      <div style="font-weight:600;font-size:.86rem">${it.name}</div>
      <div style="font-size:.66rem;color:var(--mut);margin-top:2px">${it.note || ''} · cena rynkowa ${fmt(it.low, 2)}–${fmt(it.high, 2)} zł/${it.unit}</div>
    </div>
    <div class="ig" style="margin-bottom:9px">
      <label>Podsekcja docelowa</label>
      <select id="libadd-tab">
        <option value="ustawienia" ${defTab === 'ustawienia' ? 'selected' : ''}>⚙ Dane projektu</option>
        <option value="materialy" ${defTab === 'materialy' ? 'selected' : ''}>🧱 Materiały</option>
        <option value="parapety" ${defTab === 'parapety' ? 'selected' : ''}>🪟 Parapety / obróbki</option>
        <option value="dodatki" ${defTab === 'dodatki' ? 'selected' : ''}>🔧 Prace dodatkowe</option>
        <option value="lacze" ${defTab === 'lacze' ? 'selected' : ''}>🔩 Łączniki</option>
      </select>
    </div>
    <div class="fg fg2" style="margin-bottom:9px">
      <div class="ig"><label>Nazwa pozycji</label><input type="text" id="libadd-name" value="${it.name}"></div>
      <div class="ig"><label>Jednostka</label>
        <select id="libadd-unit">
          ${['szt.','mb','m²','m³','kg','l','worek','ark','kpl','rbg'].map(u => `<option value="${u}" ${it.unit === u ? 'selected' : ''}>${u}</option>`).join('')}
        </select>
      </div>
      <div class="ig"><label>Ilość</label><input type="number" id="libadd-qty" value="1" min="0" step="0.01"></div>
      <div class="ig"><label>Cena jedn. (zł)</label><input type="number" id="libadd-price" value="${it.avg}" min="0" step="0.01">
        <span class="hint">niska ${fmt(it.low, 2)} · śr. ${fmt(it.avg, 2)} · wysoka ${fmt(it.high, 2)}</span>
      </div>
    </div>
    <div style="display:flex;gap:5px;margin-bottom:12px">
      <button class="btn sm" style="flex:1;justify-content:center" onclick="document.getElementById('libadd-price').value=${it.low}">Najniższa</button>
      <button class="btn sm" style="flex:1;justify-content:center" onclick="document.getElementById('libadd-price').value=${it.avg}">Średnia</button>
      <button class="btn sm" style="flex:1;justify-content:center" onclick="document.getElementById('libadd-price').value=${it.high}">Wysoka</button>
    </div>
    <div class="btn-row" style="margin-bottom:0">
      <button class="btn pri" onclick="window.confirmLibAdd()">✓ Dodaj do projektu</button>
      <button class="btn" onclick="window.closeModal('modal-libadd')">Anuluj</button>
    </div>`;
  m.classList.remove('hidden');
}

export function confirmLibAdd() {
  const tab = document.getElementById('libadd-tab')?.value || 'materialy';
  const name = document.getElementById('libadd-name')?.value || 'Pozycja';
  const unit = document.getElementById('libadd-unit')?.value || 'szt.';
  const qty = parseFloat(document.getElementById('libadd-qty')?.value) || 1;
  const price = parseFloat(document.getElementById('libadd-price')?.value) || 0;
  customItems[tab].push({ id: Date.now(), name, qty, unit, price, enabled: true });
  window.renderCustom?.(tab);
  window.closeModal?.('modal-libadd');
  window.calc?.();
  window.showToast?.('✅ Dodano: ' + name);
}

export function openLibraryPicker(tab) {
  setLibPickerTarget(tab);
  window.swTab?.('biblioteka');
  initLibMode(tab === 'dodatki' ? 'rob' : 'mat');
  window.showToast?.('Wybierz pozycję — trafi do: ' + tab);
}

Object.assign(window, {
  setLibMode: initLibMode,
  filterLibCat,
  renderLibrary,
  renderLibCatFilter,
  toggleFav,
  addFromLibrary,
  confirmLibAdd,
  openLibraryPicker,
  loadFavorites,
  saveFavorites,
  togglePriceMode,
});
