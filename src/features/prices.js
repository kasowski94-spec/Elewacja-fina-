// ════════════ CENY ════════════

import { MATERIAL_LIBRARY, LABOR_LIBRARY, LIBRARY_DATE, LABOR_CATEGORIES } from '../data/library.js';
import { PRICE_LIBRARY_MAP, PRICE_DEFS, LABOR_TARGETS, EXTRAS_DEF } from '../data/constants.js';
import { priceSources, priceCompData, lastPriceUpdate, setPriceCompData, setLastPriceUpdate, parapets } from '../store/state.js';
import { fmt } from '../utils/format.js';

export function getApiKey() {
  try { return localStorage.getItem('elewacjapro_apikey') || ''; } catch(e) { return ''; }
}
export function saveApiKey(k) {
  try {
    if (k) localStorage.setItem('elewacjapro_apikey', k.trim());
    else localStorage.removeItem('elewacjapro_apikey');
  } catch(e) {}
}
export function promptApiKey() {
  const cur = getApiKey();
  const k = prompt(
    'Aktualizacja cen online wymaga klucza API Anthropic.\n\n' +
    'Wklej swój klucz (zaczyna się od "sk-ant-...").\n' +
    'Klucz zapisywany jest TYLKO lokalnie na tym urządzeniu.\n' +
    'Zostaw puste i zatwierdź, aby usunąć zapisany klucz.\n\n' +
    'Bez klucza aplikacja działa normalnie — używa cennika referencyjnego.',
    cur);
  if (k === null) return false;
  saveApiKey(k);
  return !!k.trim();
}

export function buildPricesGrid() {
  const g = document.getElementById('pricesGrid');
  if (!g) return;
  g.innerHTML = '';
  PRICE_DEFS.forEach(p => {
    const d = document.createElement('div');
    d.className = 'ig price-ig';
    const hasLib = !!PRICE_LIBRARY_MAP[p.id];
    let rangeChips = '';
    if (hasLib) {
      const r = getLibraryRangeFor(p.id);
      if (r) {
        rangeChips = `<div class="price-chips">
          <button type="button" class="price-chip low" onclick="window.setPrice('${p.id}',${r.low.toFixed(2)})" title="Najtaniej">${fmt(r.low,2)}</button>
          <button type="button" class="price-chip avg" onclick="window.setPrice('${p.id}',${r.avg.toFixed(2)})" title="Średnia rynkowa">${fmt(r.avg,2)}</button>
          <button type="button" class="price-chip high" onclick="window.setPrice('${p.id}',${r.high.toFixed(2)})" title="Premium">${fmt(r.high,2)}</button>
          <button type="button" class="price-lib-btn" onclick="window.openPriceLibrary('${p.id}')" title="Otwórz pełną listę">📚 więcej</button>
        </div>`;
      }
    }
    d.innerHTML = `
      <label>${p.lbl}</label>
      <input type="number" id="${p.id}" value="${p.def}" min="0" step=".01" oninput="window.debCalc()">
      ${p.hint ? `<span class="hint">${p.hint}</span>` : ''}
      ${rangeChips}
    `;
    g.appendChild(d);
  });
}

export function getLibraryRangeFor(priceId) {
  const map = PRICE_LIBRARY_MAP[priceId];
  if (!map) return null;
  const lib = map.lib === 'rob' ? LABOR_LIBRARY : MATERIAL_LIBRARY;
  const items = map.ids.map(id => lib.find(x => x.id === id)).filter(Boolean);
  if (!items.length) return null;
  const t = items.map(it => map.transform ? map.transform(it) : { low: it.low, avg: it.avg, high: it.high });
  return {
    low: Math.min(...t.map(x => x.low)),
    avg: t.reduce((s, x) => s + x.avg, 0) / t.length,
    high: Math.max(...t.map(x => x.high)),
  };
}

export function setPrice(priceId, value) {
  const el = document.getElementById(priceId);
  if (!el) return;
  el.value = Number(value).toFixed(2);
  el.classList.add('price-flash');
  setTimeout(() => el.classList.remove('price-flash'), 420);
  window.calc?.();
}

export function openPriceLibrary(priceId) {
  const map = PRICE_LIBRARY_MAP[priceId];
  if (!map) { alert('Brak powiązanych pozycji w bibliotece.'); return; }
  const def = PRICE_DEFS.find(p => p.id === priceId);
  const lib = map.lib === 'rob' ? LABOR_LIBRARY : MATERIAL_LIBRARY;
  const items = map.ids.map(id => lib.find(x => x.id === id)).filter(Boolean);
  if (!items.length) { alert('Brak pasujących pozycji.'); return; }
  let m = document.getElementById('modal-pricelib');
  if (!m) {
    m = document.createElement('div');
    m.id = 'modal-pricelib';
    m.className = 'modal-overlay hidden';
    m.innerHTML = '<div class="modal" style="max-width:560px"></div>';
    m.addEventListener('click', e => { if (e.target === m) window.closeModal?.('modal-pricelib'); });
    document.body.appendChild(m);
  }
  const rows = items.map(it => {
    const t = map.transform ? map.transform(it) : null;
    const lo = t ? t.low : it.low, av = t ? t.avg : it.avg, hi = t ? t.high : it.high;
    return `<div class="plib-row">
      <div class="plib-info">
        <div class="plib-name">${it.name}</div>
        <div class="plib-note">${it.note ? it.note + ' · ' : ''}${it.lambda ? 'λ=' + it.lambda + ' · ' : ''}jednostka: ${it.unit}${t ? ' · ' + t.note : ''}</div>
      </div>
      <div class="plib-prices">
        <button type="button" class="price-chip low" onclick="window.setPrice('${priceId}',${lo.toFixed(3)});window.closeModal('modal-pricelib')">${fmt(lo,2)}</button>
        <button type="button" class="price-chip avg" onclick="window.setPrice('${priceId}',${av.toFixed(3)});window.closeModal('modal-pricelib')">${fmt(av,2)}</button>
        <button type="button" class="price-chip high" onclick="window.setPrice('${priceId}',${hi.toFixed(3)});window.closeModal('modal-pricelib')">${fmt(hi,2)}</button>
      </div>
    </div>`;
  }).join('');
  m.querySelector('.modal').innerHTML = `
    <button class="modal-close" onclick="window.closeModal('modal-pricelib')">✕</button>
    <h3 style="margin-bottom:4px">📚 ${def?.lbl || priceId}</h3>
    <p style="font-size:.7rem;color:var(--mut);margin-bottom:12px">Wybierz pozycję z biblioteki — kliknij chip aby wstawić cenę.</p>
    <div class="plib-list">${rows}</div>
    <div style="margin-top:10px;font-size:.62rem;color:var(--mut);text-align:right">Cennik referencyjny ${LIBRARY_DATE}</div>`;
  m.classList.remove('hidden');
}

export function renderLaborLibrary() {
  const el = document.getElementById('laborLibList');
  if (!el) return;
  const groups = {};
  LABOR_LIBRARY.forEach(it => { (groups[it.cat] = groups[it.cat] || []).push(it); });
  const order = ['kompleksowe','ocieplenie','wykonczenie','przygotowanie','detale','rusztowanie'];
  el.innerHTML = order.filter(k => groups[k]).map(cat => {
    const items = groups[cat];
    return `<div style="margin-bottom:12px">
      <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--blu);margin-bottom:6px">${LABOR_CATEGORIES[cat] || cat}</div>
      ${items.map(it => {
        const t = LABOR_TARGETS[it.id];
        const tgtLabel = t ? (t.target === 'p_labor' ? '→ Robocizna ETICS' : t.target.startsWith('ext_p_') ? '→ Prace dodatkowe' : '→ Parapety') : 'wybór miejsca';
        return `<div class="rob-row">
          <div class="rob-info">
            <div class="rob-name">${it.name}</div>
            <div class="rob-note">${it.note ? it.note + ' · ' : ''}jedn. ${it.unit} · <span style="color:var(--blu)">${tgtLabel}</span></div>
          </div>
          <div class="rob-chips">
            <button type="button" class="price-chip low" onclick="window.applyLaborPrice('${it.id}',${it.low})">${fmt(it.low,0)} zł</button>
            <button type="button" class="price-chip avg" onclick="window.applyLaborPrice('${it.id}',${it.avg})">${fmt(it.avg,0)} zł</button>
            <button type="button" class="price-chip high" onclick="window.applyLaborPrice('${it.id}',${it.high})">${fmt(it.high,0)} zł</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

export function applyLaborPrice(libId, value) {
  const t = LABOR_TARGETS[libId];
  const it = LABOR_LIBRARY.find(x => x.id === libId);
  if (!it) return;
  if (!t) { openLaborTargetPicker(it, value); return; }
  if (t.target === 'p_labor') {
    setPrice('p_labor', value);
    window.showToast?.('✓ Robocizna ETICS: ' + fmt(value, 0) + ' zł/m² (' + it.name + ')');
    return;
  }
  if (t.target.startsWith('ext_p_')) {
    const el = document.getElementById(t.target);
    if (el) {
      el.value = Number(value).toFixed(2);
      const extId = t.target.replace('ext_p_', '');
      const cb = document.getElementById('ext_' + extId);
      if (cb && !cb.checked) { cb.checked = true; document.getElementById('exrow_' + extId)?.classList.add('active'); }
      el.classList.add('price-flash'); setTimeout(() => el.classList.remove('price-flash'), 420);
      window.calcExtras?.();
      window.calc?.();
      window.showToast?.('✓ ' + it.name + ': ' + fmt(value, 0) + ' zł/' + it.unit);
    }
    return;
  }
  if (t.target.startsWith('parapet_')) {
    if (!parapets.length) { window.showToast?.('Brak parapetów — dodaj parapet w zakładce Parapety'); return; }
    const field = t.target === 'parapet_labor' ? 'laborPer' : t.target === 'parapet_bend' ? 'bendCost' : 'cutCost';
    parapets.forEach(p => { p[field] = value; });
    window.renderParapets?.();
    window.calc?.();
    window.showToast?.('✓ ' + it.name + ' zastosowane do ' + parapets.length + ' parapetów');
    return;
  }
}

export function openLaborTargetPicker(it, value) {
  let m = document.getElementById('modal-labpick');
  if (!m) {
    m = document.createElement('div');
    m.id = 'modal-labpick';
    m.className = 'modal-overlay hidden';
    m.innerHTML = '<div class="modal" style="max-width:440px"></div>';
    m.addEventListener('click', e => { if (e.target === m) window.closeModal?.('modal-labpick'); });
    document.body.appendChild(m);
  }
  const opts = [
    { key: 'p_labor', name: 'Robocizna ETICS (główna stawka)' },
    ...EXTRAS_DEF.map(e => ({ key: 'ext_p_' + e.id, name: 'Prace dodatkowe: ' + e.lbl })),
  ];
  m.querySelector('.modal').innerHTML = `
    <button class="modal-close" onclick="window.closeModal('modal-labpick')">✕</button>
    <h3>Gdzie wstawić stawkę?</h3>
    <div style="background:var(--card2);border:1px solid var(--brd);border-radius:9px;padding:10px 12px;margin-bottom:12px">
      <div style="font-weight:600">${it.name}</div>
      <div style="font-size:.7rem;color:var(--mut);margin-top:3px">${fmt(value, 2)} zł / ${it.unit}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:50vh;overflow-y:auto">
      ${opts.map(o => `<button class="btn" style="justify-content:flex-start" onclick="window.setPrice('${o.key}',${value});window.closeModal('modal-labpick')">${o.name}</button>`).join('')}
    </div>`;
  m.classList.remove('hidden');
}

export function addSource(type) {
  if (type === 'file') { document.getElementById('fileInput')?.click(); return; }
  priceSources.push({ id: Date.now(), type, url: '' });
  renderSources();
}

export function renderSources() {
  const c = document.getElementById('sourcesContainer');
  if (!c) return;
  if (!priceSources.length) {
    c.innerHTML = '<div style="font-size:.68rem;color:var(--mut);padding:5px 0">Brak własnych źródeł. Domyślne: mega1000.pl, styro24.pl, Castorama.</div>';
    return;
  }
  c.innerHTML = priceSources.map((s, i) => `
    <div class="src-pill">
      <span class="src-badge" style="background:${s.type === 'url' ? 'rgba(91,156,246,.2)' : 'rgba(62,207,142,.2)'};color:${s.type === 'url' ? 'var(--blu)' : 'var(--grn)'}">${s.type === 'url' ? 'URL' : 'PLIK'}</span>
      <input type="text" value="${s.url}" placeholder="${s.type === 'url' ? 'https://hurtownia.pl' : 'nazwa pliku'}" oninput="window._srcUpd(${i},this.value)">
      <button class="btn sm" onclick="window._srcRm(${i})">✕</button>
    </div>`).join('');
}
window._srcUpd = (i, v) => { priceSources[i].url = v; };
window._srcRm = (i) => { priceSources.splice(i, 1); renderSources(); };

export function parseCSVFile(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    let data = [];
    try {
      const raw = ev.target.result.replace(/^﻿/, '');
      const lines = raw.split(/\r?\n/).filter(l => l.trim());
      if (!lines.length) throw new Error('pusty plik');
      const sep = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');
      data = lines.slice(1).map(l => {
        const c = l.split(sep);
        const name = (c[0] || '').trim();
        let price = parseFloat((c[1] || '0').replace(/\s/g, '').replace(',', '.'));
        if (!isFinite(price) || price < 0) price = 0;
        return { name, price, unit: (c[2] || '').trim() };
      }).filter(x => x.name);
    } catch(err) {
      alert('Nie udało się odczytać pliku CSV: ' + err.message + '\n\nFormat: nazwa;cena;jednostka (pierwszy wiersz = nagłówek).');
      e.target.value = ''; return;
    }
    priceSources.push({ id: Date.now(), type: 'file', url: f.name, data });
    renderSources();
    const applied = applyCSVToPriceGrid(data);
    alert(`Wgrano: ${f.name} (${data.length} pozycji).` +
      (applied ? `\nDopasowano i zaktualizowano ${applied} cen w zakładce Ceny.` :
        '\nNie rozpoznano nazw — ceny dostępne w porównaniu źródeł.'));
  };
  r.readAsText(f, 'UTF-8');
  e.target.value = '';
}

export function applyCSVToPriceGrid(data) {
  const map = [
    { kw: ['styropian','eps'], f: 'p_eps', perCm: true },
    { kw: ['klej','klejąca','klejaca'], f: 'p_adhesive', div: 25 },
    { kw: ['zbrojąca','zbrojaca','szpachl'], f: 'p_meshkg', div: 25 },
    { kw: ['siatka'], f: 'p_mesh' },
    { kw: ['tynk'], f: 'p_plaster', div: 25 },
    { kw: ['grunt'], f: 'p_primer' },
    { kw: ['łącznik','lacznik','kołek','kolek'], f: 'p_anchor' },
    { kw: ['zaślepk','zaslepk'], f: 'p_cap' },
    { kw: ['listwa startowa','startowa'], f: 'p_starter' },
    { kw: ['narożnik','naroznik'], f: 'p_corner' },
    { kw: ['farba'], f: 'p_paint' },
  ];
  let n = 0;
  data.forEach(it => {
    if (!it.price) return;
    const low = it.name.toLowerCase();
    for (const m of map) {
      if (m.kw.some(k => low.includes(k))) {
        const el = document.getElementById(m.f);
        if (el) { let v = it.price; if (m.div) v /= m.div; if (m.perCm) v /= 15; el.value = v.toFixed(2); n++; }
        break;
      }
    }
  });
  if (n) window.calc?.();
  return n;
}

export async function refreshPrices() {
  const btn = document.getElementById('btnRefresh');
  const st = document.getElementById('aiStatus');
  if (st) st.style.display = 'block';
  let apiKey = getApiKey();
  if (!apiKey) {
    if (st) {
      st.className = 'ai-st';
      st.innerHTML = 'ℹ️ Aktualizacja online wymaga klucza API Anthropic. ' +
        '<button class="btn sm" style="margin-left:6px" onclick="if(window.promptApiKey())window.refreshPrices()">Wprowadź klucz</button>' +
        '<button class="btn sm" style="margin-left:4px" onclick="window.renderFallback()">Użyj cennika referencyjnego</button>';
    }
    return;
  }
  if (btn) { btn.disabled = true; btn.innerHTML = '🔄 Pobieranie… <span class="spin"></span>'; }
  const extra = priceSources.filter(s => s.url).map(s => s.url).join(', ');
  if (st) { st.className = 'ai-st'; st.textContent = `AI wyszukuje aktualne ceny: mega1000.pl, styro24.pl, Castorama${extra ? ', ' + extra : ''}…`; }
  const today = new Date().toISOString().split('T')[0];
  const prompt = `Ekspert budowlany. Dzisiejsza data: ${today}. Wyszukaj AKTUALNE ceny netto materiałów ETICS z 3 źródeł: mega1000.pl, styro24.pl, Castorama/LeroyMerlin.${extra ? ' Uwzględnij też: ' + extra : ''}\nDla każdej pozycji podaj ceny ORAZ dostępność (true/false). Odpowiedz TYLKO czysty JSON (bez markdown):\n{"updated":"${today}","sources":["mega1000.pl","styro24.pl","Castorama"],"items":[{"name":"Styropian EPS biały 038 15cm","unit":"m²","prices":[26.5,24.8,29.0],"available":[true,true,true]},{"name":"Masa klejąca EPS 25kg","unit":"worek","prices":[42,40,52],"available":[true,true,true]},{"name":"Siatka zbrojąca 145g","unit":"m²","prices":[3.2,3,4.5],"available":[true,true,true]},{"name":"Tynk silikonowy 25kg","unit":"worek","prices":[130,125,165],"available":[true,true,true]},{"name":"Grunt pod tynk","unit":"l","prices":[9.5,9,13],"available":[true,true,true]},{"name":"Łącznik kołek 200mm","unit":"szt.","prices":[0.72,0.68,0.95],"available":[true,true,true]},{"name":"Listwa startowa Al 2m","unit":"szt.","prices":[7.5,7.2,10.5],"available":[true,true,true]},{"name":"Zaślepka styropianowa","unit":"szt.","prices":[0.18,0.16,0.30],"available":[true,true,false]}]}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      signal: controller.signal,
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2200, tools: [{ type: 'web_search_20250305', name: 'web_search' }], messages: [{ role: 'user', content: prompt }] }),
    });
    clearTimeout(timeout);
    if (resp.status === 401) throw new Error('Nieprawidłowy klucz API (401)');
    if (resp.status === 429) throw new Error('Przekroczono limit zapytań (429)');
    if (!resp.ok) throw new Error('Błąd serwera HTTP ' + resp.status);
    const data = await resp.json();
    let text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
    const j1 = text.indexOf('{'), j2 = text.lastIndexOf('}');
    if (j1 < 0) throw new Error('Brak danych w odpowiedzi');
    const newData = JSON.parse(text.substring(j1, j2 + 1));
    const now = new Date();
    setLastPriceUpdate(now);
    newData.fetchedAt = now.toLocaleString('pl-PL');
    setPriceCompData(newData);
    renderPriceCompare(newData);
    updatePriceDate();
    if (st) { st.className = 'ai-st ok'; st.innerHTML = `✅ Cennik zaktualizowany: <strong>${now.toLocaleString('pl-PL')}</strong> — źródła: ${newData.sources?.join(' · ')}`; }
    window.showToast?.('✅ Cennik zaktualizowany');
  } catch(err) {
    clearTimeout(timeout);
    const msg = err.name === 'AbortError' ? 'Przekroczono czas oczekiwania (45s)' : err.message;
    if (st) { st.className = 'ai-st err'; st.innerHTML = `⚠ ${msg} — wyświetlam cennik referencyjny (${LIBRARY_DATE}). <button class="btn sm" style="margin-left:6px" onclick="if(window.promptApiKey())window.refreshPrices()">Zmień klucz API</button>`; }
    renderFallback();
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '🔄 Aktualizuj ceny'; }
  }
}

export function updatePriceDate() {
  const d = lastPriceUpdate ? lastPriceUpdate.toLocaleDateString('pl-PL') : LIBRARY_DATE;
  document.querySelectorAll('.price-date-label').forEach(el => { el.textContent = d; });
}

export function renderFallback() {
  const data = {
    updated: LIBRARY_DATE + ' (cennik referencyjny)',
    sources: ['mega1000.pl', 'styro24.pl', 'Castorama/LM'],
    items: [
      { name: 'Styropian EPS biały 038 15cm', unit: 'm²', prices: [24.5, 23.0, 28.5], available: [true, true, true] },
      { name: 'Styropian EPS grafitowy 033 15cm', unit: 'm²', prices: [30.0, 28.5, 35.0], available: [true, true, true] },
      { name: 'Masa klejąca EPS 25kg', unit: 'worek', prices: [42, 40, 52], available: [true, true, true] },
      { name: 'Masa zbrojąca 25kg', unit: 'worek', prices: [44, 42, 54], available: [true, true, true] },
      { name: 'Siatka zbrojąca 145g', unit: 'm²', prices: [3.2, 3.0, 4.5], available: [true, true, true] },
      { name: 'Tynk silikonowy 25kg', unit: 'worek', prices: [130, 125, 165], available: [true, true, true] },
      { name: 'Grunt pod tynk', unit: 'l', prices: [9.5, 9.0, 13], available: [true, true, true] },
      { name: 'Łącznik kołek 200mm', unit: 'szt.', prices: [0.72, 0.68, 0.95], available: [true, true, true] },
      { name: 'Listwa startowa Al 2m', unit: 'szt.', prices: [7.5, 7.2, 10.5], available: [true, true, true] },
      { name: 'Zaślepka styropianowa', unit: 'szt.', prices: [0.18, 0.16, 0], available: [true, true, false] },
    ],
  };
  setPriceCompData(data);
  renderPriceCompare(data);
  updatePriceDate();
}

export function renderPriceCompare(data) {
  const sec = document.getElementById('priceCompareSection');
  if (!sec || !data?.items) return;
  const src = data.sources || ['Źr.1', 'Źr.2', 'Źr.3'];
  const totals = [0, 0, 0], estimated = [0, 0, 0];
  data.items.forEach(it => {
    it.prices.forEach((p, i) => {
      const avail = it.available ? it.available[i] : p > 0;
      if (avail && p > 0) { totals[i] += p; }
      else {
        const availP = it.prices.filter((pp, j) => (it.available ? it.available[j] : pp > 0) && pp > 0);
        estimated[i] += availP.length ? availP.reduce((a, b) => a + b, 0) / availP.length : 0;
      }
    });
  });
  let html = `<div class="pc-summary">
    <div style="font-size:.66rem;color:var(--mut);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">Suma cen jednostkowych (${data.updated || ''})</div>
    <div class="pc-sum-grid">
      ${src.map((s, i) => {
        const allTotal = totals[i] + estimated[i];
        const minTotal = Math.min(...src.map((_, j) => totals[j] + estimated[j]));
        const isBest = allTotal === minTotal;
        return `<div class="pc-sum-item"><div class="l">${s}</div><div class="v" style="color:${isBest ? 'var(--grn)' : 'var(--txt)'}">${fmt(allTotal, 2)} zł${isBest ? ' ↓' : ''}</div><div style="font-size:.58rem;color:var(--mut)">dostępne: ${fmt(totals[i], 2)} zł${estimated[i] > 0 ? ' · szac.: +' + fmt(estimated[i], 2) : ''}</div></div>`;
      }).join('')}
    </div>
  </div>
  <div style="font-size:.68rem;color:var(--mut);margin-bottom:8px">Porównanie pozycja po pozycji:</div>`;
  data.items.forEach(item => {
    const av = item.available || item.prices.map(p => p > 0);
    const availP = item.prices.filter((p, i) => av[i] && p > 0);
    const minP = availP.length ? Math.min(...availP) : 0;
    html += `<div class="pc-item"><div class="pc-name"><span>${item.name}</span><span style="font-size:.62rem;color:var(--mut);font-weight:400;white-space:nowrap">${item.unit}</span></div><div class="pc-grid">
      ${item.prices.map((p, i) => {
        const avail = av[i] && p > 0;
        const isBest = avail && p === minP;
        if (!avail) {
          const est = availP.length ? availP.reduce((a, b) => a + b, 0) / availP.length : 0;
          return `<div class="pc-cell unavail"><div class="src">${src[i] || 'Źr.' + (i+1)}</div><div class="price" style="color:var(--mut)">~${fmt(est,2)} zł</div><div class="total"><span class="badge b-red">niedostępne</span></div></div>`;
        }
        return `<div class="pc-cell ${isBest ? 'best' : ''}"><div class="src">${src[i] || 'Źr.' + (i+1)}</div><div class="price ${isBest ? 'best' : ''}">${fmt(p,2)} zł${isBest ? ' ↓' : ''}</div><div class="total">${isBest ? '<span class="badge b-grn">najtaniej</span>' : 'dostępne'}</div></div>`;
      }).join('')}
    </div></div>`;
  });
  sec.innerHTML = html;
}

export function applyBestPrices() {
  if (!priceCompData?.items) { alert('Najpierw zaktualizuj ceny.'); return; }
  const map = [
    { m: 'klej', f: 'p_adhesive', d: 25 }, { m: 'zbrojąca', f: 'p_meshkg', d: 25 },
    { m: 'siatka', f: 'p_mesh', d: 1 }, { m: 'tynk silikonowy', f: 'p_plaster', d: 25 },
    { m: 'grunt pod tynk', f: 'p_primer', d: 1 }, { m: 'łącznik', f: 'p_anchor', d: 1 },
    { m: 'listwa', f: 'p_starter', d: 1 }, { m: 'zaślepka', f: 'p_cap', d: 1 },
  ];
  let n = 0;
  priceCompData.items.forEach(item => {
    const av = item.available || item.prices.map(p => p > 0);
    const availP = item.prices.filter((p, i) => av[i] && p > 0);
    if (!availP.length) return;
    const best = Math.min(...availP);
    map.forEach(m => { if (item.name.toLowerCase().includes(m.m)) { const el = document.getElementById(m.f); if (el) { el.value = (best / m.d).toFixed(2); n++; } } });
  });
  window.calc?.();
  const st = document.getElementById('aiStatus');
  if (st) { st.style.display = 'block'; st.className = 'ai-st ok'; st.textContent = `✅ Zastosowano najniższe ceny dla ${n} pozycji.`; }
}

Object.assign(window, {
  buildPricesGrid, getLibraryRangeFor, setPrice, openPriceLibrary,
  renderLaborLibrary, applyLaborPrice, openLaborTargetPicker,
  addSource, renderSources, parseCSVFile, applyCSVToPriceGrid,
  refreshPrices, updatePriceDate, renderFallback, renderPriceCompare,
  applyBestPrices, promptApiKey,
});
