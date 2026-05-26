// ════════════ WYCENA — TABELA KOSZTORYSU ════════════

import { EXTRAS_DEF, FOAM_TYPES, CORNER_MULT, SHOP_MULT, SHOP_LABELS, SHEET_TYPES, VAT_MAT, VAT_LABOR, LABOR_SECTIONS } from '../data/constants.js';
import { parapetCalc } from './parapets.js';
import { getAllCustomItems } from './custom.js';
import { wycenaRows, setWycenaRows, wycenaManualEdits, setWycenaManualEdits, selectedVariant, priceMode, clientMargin, setClientMargin } from '../store/state.js';
import { gv, gs, gvn, gsn } from '../utils/dom.js';
import { fmt, pln } from '../utils/format.js';

export function rowKey(r) {
  return r.section + '|' + (r.key || r.name);
}

export function buildWycenaRows() {
  const area = gvn('area', 350), waste = gvn('waste', 5) / 100, lambda = gsn('epsType', 0.033);
  const aW = area * (1 + waste), t = selectedVariant;
  const adhesiveRate = gvn('adhesiveRate', 4), meshRate = gvn('meshRate', 5.5);
  const plasterKg = gsn('plasterType', 3.2), paintRate = gsn('paintType', 0);
  const primerRate = gvn('primerRate', 0.15), primerSubRate = gsn('primerSubType', 0.15);
  const bondRate = gsn('bondType', 0);
  const perim = gvn('perim', 75), winPerim = gvn('winPerim', 120), flashMb = gvn('flashMb', 0), dilMb = gvn('dilMb', 0);
  const anch = gvn('anchPerM2', 6), foilCount = gvn('foilCount', 0);
  const tapeWin = gvn('tapeWin', 0), tapeExp = gvn('tapeExp', 0), tapeElew = gvn('tapeElew', 0), tapeMal = gvn('tapeMal', 0);
  const winStrip = gsn('winStripType', 0), cornerMult = CORNER_MULT[gs('cornerType')] || 1;
  const anchTotal = Math.ceil(area * anch);
  const capTotal = gs('capType') !== '0' ? anchTotal : 0;
  const ruszArea = area * 1.18;
  const ruszEnabled = document.getElementById('rusz-toggle')?.checked !== false;
  const shop = gs('mainShop') || 'reczne';

  const mkRow = (name, unit, qty, baseId, extraMult, section, desc, opts = {}) => {
    const key = (section || 'eps') + '|' + (opts.key || name);
    const rowShop = wycenaManualEdits[key]?.rowShop;
    const effShop = rowShop || shop;
    let price;
    if (typeof baseId === 'number') price = baseId;
    else if (opts.noShop) price = gv(baseId);
    else price = gv(baseId) * (effShop === 'reczne' ? 1 : (SHOP_MULT[effShop] || 1));
    if (extraMult && typeof extraMult === 'number') price *= extraMult;
    if (priceMode === 'brutto') price *= opts.noShop ? VAT_LABOR : VAT_MAT;
    return {
      name, unit, qty: +(+qty).toFixed(2), price: +price.toFixed(2),
      shop: opts.noShop ? '—' : effShop, section: section || 'eps', desc: desc || '', key: opts.key || null,
    };
  };

  const epsM3 = +(aW * t / 100).toFixed(2);
  const epsM3Badge = document.getElementById('eps-m3-badge');
  if (epsM3Badge) { epsM3Badge.textContent = `≈ ${epsM3} m³`; epsM3Badge.style.display = ''; }
  const secEPS = [
    mkRow(`Styropian EPS ${t} cm (λ=${lambda.toFixed(3)} W/mK)`, 'm²', aW, 'p_eps', t, 'eps', `Płyty izolacyjne z naddatkiem ${gv('waste') || 5}% — ${fmt(aW, 1)} m² · objętość: ${epsM3} m³`),
  ];
  const secKleje = [
    mkRow('Masa klejąca do styropianu', 'kg', area * adhesiveRate, 'p_adhesive', null, 'kleje', `Klejenie płyt EPS — metoda obwodowo-punktowa, ${adhesiveRate} kg/m² (~40% pokrycia)`),
    mkRow('Masa szpachlowa zbrojąca', 'kg', area * meshRate, 'p_meshkg', null, 'kleje', `Warstwa bazowa z siatką zbrojącą — ${meshRate} kg/m²`),
    mkRow('Siatka zbrojąca 145 g/m²', 'm²', aW, 'p_mesh', null, 'kleje', `Z zakładem min. 10 cm na połączeniach — z naddatkiem ${fmt(aW, 1)} m²`),
    ...(bondRate > 0 ? [mkRow('Masa sczepna / preparat szczepny', 'kg', area * bondRate, 'p_bond', null, 'kleje', `Dla podłoży o słabej przyczepności — ${bondRate} kg/m²`)] : []),
  ];
  const secTynk = [
    mkRow(`Tynk elewacyjny — ${gs('plasterType').split('(')[0].trim()}`, 'kg', area * plasterKg, 'p_plaster', null, 'tynk', `Warstwa wykończeniowa, zużycie ${plasterKg} kg/m²`),
    mkRow('Grunt pod tynk elewacyjny', 'l', area * primerRate, 'p_primer', null, 'tynk', `Gruntowanie podłoża przed tynkiem — ${primerRate} l/m²`),
    ...(primerSubRate > 0 ? [mkRow('Grunt głębokopenetrujący do podłoża', 'l', area * primerSubRate, 'p_primsub', null, 'tynk', `Gruntowanie ściany nośnej — ${primerSubRate} l/m²`)] : []),
    ...(paintRate > 0 ? [mkRow(`Farba elewacyjna — ${gs('paintType').split('(')[0].trim()}`, 'l', area * paintRate, 'p_paint', null, 'tynk', `Warstwa malarska — ${paintRate} l/m²`)] : []),
  ];
  const secLacze = [
    mkRow(`Łączniki mechaniczne — ${gs('anchType')}`, 'szt.', anchTotal, 'p_anchor', null, 'lacze', `${anch} szt./m² × ${area} m² = ${anchTotal} szt. — długość wg zakładki Łączniki`),
    ...(capTotal > 0 ? [mkRow(`Zaślepki Ø${gs('capDia')}mm — ${gs('capType')}`, 'szt.', capTotal, 'p_cap', null, 'lacze', `Zaślepka na każdym łączniku — ${anchTotal} szt.`)] : []),
  ];
  const secProfile = [
    mkRow('Listwa startowa aluminiowa 2m', 'szt.', Math.ceil(perim / 2), 'p_starter', null, 'profile', `Obwód budynku ${perim} mb ÷ 2 m/szt. = ${Math.ceil(perim / 2)} szt.`),
    mkRow(`Narożniki — ${gs('cornerType').replace(/_/g, ' ')}`, 'mb', winPerim, 'p_corner', cornerMult, 'profile', `Obwód okien i drzwi ${winPerim} mb`),
    ...(winStrip > 0 ? [mkRow('Listwa przyokienna z uszczelką', 'mb', winPerim, 'p_winstrip', null, 'profile', `Uszczelnienie styku ościeżnicy z EPS — ${winPerim} mb`)] : []),
    ...(dilMb > 0 ? [mkRow('Profile dylatacyjne PVC/Al', 'mb', dilMb, 'p_dil', null, 'profile', 'Szczeliny dylatacyjne elewacji')] : []),
  ];

  const parFoamItems = window._foamItems || [];
  const secTasmy = [
    ...(tapeWin > 0 ? [mkRow('Taśma uszczelniająca okienno-elewacyjna', 'mb', tapeWin, 'p_tapew', null, 'tasmy', 'Niebieska/pomarańczowa — uszczelnienie styku ościeżnicy z EPS')] : []),
    ...(tapeExp > 0 ? [mkRow('Taśma rozprężna paroizolacyjna', 'mb', tapeExp, 'p_tapee', null, 'tasmy', 'Pod parapety i narożniki')] : []),
    ...(tapeElew > 0 ? [mkRow('Taśma elewacyjna ochronna', 'mb', tapeElew, 'p_tapeelew', null, 'tasmy', 'Zabezpieczenie krawędzi EPS')] : []),
    ...(tapeMal > 0 ? [mkRow('Taśma malarska', 'mb', tapeMal, 'p_tapemal', null, 'tasmy', 'Do maskowania podczas tynkowania')] : []),
    ...(foilCount > 0 ? [mkRow('Folia ochronna na okna i drzwi', 'szt.', foilCount, 'p_foil', null, 'tasmy', 'Ochrona szyb i ościeżnic podczas prac')] : []),
    ...parFoamItems.filter(f => f.count > 0).map((f, fi) => mkRow(`${FOAM_TYPES[f.type]?.name || 'Pianka montażowa'}`, 'szt.', f.count, FOAM_TYPES[f.type]?.price || 14, null, 'tasmy', 'Pianka poliuretanowa 750ml', { key: 'foam' + fi + '_' + f.type })),
  ];

  const parParsed = window._parapets || [];
  const secParapety = [
    ...parParsed.flatMap((p, pi) => {
      const cc = parapetCalc(p);
      const rows = [];
      if (cc.sheetsNeeded > 0)
        rows.push(mkRow(`Blacha — ${p.name} (${SHEET_TYPES[p.material]?.name || p.material})`, 'ark.', cc.sheetsNeeded, p.sheetPrice, null, 'parapety', `Arkusze ${p.sheetW}×${p.sheetL}mm · pole ${cc.areaM2.toFixed(2)} m² + 10% odpad · ${p.count} szt. parapetu`, { key: 'par' + pi + '_blacha' }));
      if (cc.bendsTotal > 0)
        rows.push(mkRow(`Gięcia blachy — ${p.name}`, 'szt.', cc.bendsTotal, p.bendCost, null, 'parapety', `${p.bendsPer} gięć × ${p.count} parapetów`, { key: 'par' + pi + '_giec' }));
      if (cc.cutsTotal > 0)
        rows.push(mkRow(`Cięcia blachy — ${p.name}`, 'szt.', cc.cutsTotal, p.cutCost, null, 'parapety', `${p.cutsPer} cięć × ${p.count} parapetów`, { key: 'par' + pi + '_ciec' }));
      if (cc.laborCost > 0)
        rows.push(mkRow(`Montaż parapetu — ${p.name}`, 'szt.', p.count, p.laborPer, null, 'parapety', `Robocizna montażu, ${p.count} szt.`, { key: 'par' + pi + '_montaz', noShop: true }));
      return rows;
    }),
    ...(flashMb > 0 ? [mkRow('Obróbki blacharskie — ogniomury i attyki', 'mb', flashMb, 'p_flash', null, 'parapety', `${flashMb} mb`)] : []),
  ];

  const secCustomMat = getAllCustomItems().filter(it => ['ustawienia', 'materialy', 'parapety'].includes(it.tab)).map(it => mkRow('◆ ' + it.name, it.unit, it.qty, it.price, null, 'custom_mat', 'Własna pozycja — materiał', { key: 'cm_' + it.id }));
  const secLabor = [
    mkRow('Robocizna — system ETICS (pełny zakres)', 'm²', area, 'p_labor', null, 'labor', `Montaż EPS, warstwa zbrojna, tynk, wykończenie — ${gvn('p_labor', 80)} zł/m²`, { noShop: true }),
  ];
  const secRusz = ruszEnabled ? [
    mkRow('Rusztowanie — dzierżawa', 'm²', ruszArea, gvn('ruszP', 8) * (gvn('ruszW', 6) / 4.33), null, 'rusz', `Pow. ${fmt(ruszArea, 0)} m² × ${gvn('ruszW', 6)} tyg. / 4,33 × ${gvn('ruszP', 8)} zł/m²/mies.`, { noShop: true }),
    mkRow('Rusztowanie — montaż i demontaż', 'm²', ruszArea, gvn('ruszM', 12) * 2, null, 'rusz', `Stawka ${gvn('ruszM', 12)} zł/m² × 2 (montaż + demontaż)`, { noShop: true }),
    mkRow('Siatka ochronna rusztowania', 'm²', ruszArea, gvn('ruszS', 4), null, 'rusz', 'Wymagana powyżej 5 m wysokości (BHP)', { noShop: true }),
  ] : [];
  const secPrace = EXTRAS_DEF.filter(e => document.getElementById('ext_' + e.id)?.checked).map(e => mkRow(e.lbl, e.unit, parseFloat(document.getElementById('ext_qty_' + e.id)?.value) || 0, parseFloat(document.getElementById('ext_p_' + e.id)?.value) || 0, null, 'prace', e.hint, { noShop: true, key: 'ex_' + e.id }));
  const secCustomRob = getAllCustomItems().filter(it => ['dodatki', 'lacze'].includes(it.tab)).map(it => mkRow('◆ ' + it.name, it.unit, it.qty, it.price, null, 'custom_rob', 'Własna praca/usługa', { noShop: true, key: 'cr_' + it.id }));

  const newRows = [
    ...secEPS, ...secKleje, ...secTynk, ...secLacze,
    ...secProfile, ...secParapety, ...secTasmy, ...secCustomMat,
    ...secLabor, ...secRusz, ...secPrace, ...secCustomRob,
  ];
  newRows.forEach((r, i) => { r.lp = i + 1; r._gi = i; });

  newRows.forEach(r => {
    const ov = wycenaManualEdits[rowKey(r)];
    if (ov) {
      if (ov.qty != null) r.qty = ov.qty;
      if (ov.price != null) {
        let price = ov.price;
        if (ov.savedMode && ov.savedMode !== priceMode) {
          const vat = LABOR_SECTIONS.includes(r.section) ? VAT_LABOR : VAT_MAT;
          price = priceMode === 'brutto' ? +(price * vat).toFixed(2) : +(price / vat).toFixed(2);
        }
        r.price = price; r.shop = ov.shop || 'własna';
      }
    }
  });

  setWycenaRows(newRows);

  const shops = ['styro24.pl', 'mega1000.pl', 'Castorama/LM', 'srednia', 'posrednia', 'reczne'];

  const renderSection = (idBody, idSubtot, rows) => {
    const el = document.getElementById(idBody), st = document.getElementById(idSubtot);
    if (!el) return;
    if (!rows.length) {
      el.innerHTML = '<div style="padding:9px 14px;font-size:.7rem;color:var(--mut);font-style:italic">Brak pozycji w tej sekcji.</div>';
      if (st) st.textContent = '—';
      return;
    }
    const total = rows.reduce((s, r) => s + (r.qty || 0) * (r.price || 0), 0);
    if (st) st.textContent = pln(total);
    el.innerHTML = `<div class="wys-table">
      <div class="wr wr-hdr">
        <span class="wr-lp">#</span>
        <span class="wr-name">Pozycja / opis</span>
        <span class="wr-qty">Ilość</span>
        <span class="wr-unit">Jedn.</span>
        <span class="wr-price">Cena</span>
        <span class="wr-src">Cennik</span>
        <span class="wr-total">Wartość</span>
      </div>
      ${rows.map(row => {
      const gi = row._gi;
      const tot = (row.qty || 0) * (row.price || 0);
      const edited = row.shop === 'własna';
      const noShop = row.shop === '—';
      return `<div class="wr${edited ? ' wr-edited' : ''}">
          <span class="wr-lp">${row.lp}</span>
          <span class="wr-name">
            <div class="wr-nm">${row.name}${edited ? '<span class="wr-flag">edytowano</span>' : ''}</div>
            ${row.desc ? `<div class="wr-desc">${row.desc}</div>` : ''}
          </span>
          <input class="wr-qty" type="number" inputmode="decimal" value="${row.qty}" step="0.01" min="0" title="Ilość" oninput="window.editWycenaRow(${gi},'qty',this.value)">
          <span class="wr-unit">${row.unit}</span>
          <input class="wr-price" type="number" inputmode="decimal" value="${row.price}" step="0.01" min="0" title="Cena jednostkowa" oninput="window.editWycenaRow(${gi},'price',this.value)">
          ${noShop
        ? `<span class="wr-src wr-src-fixed" title="Robocizna / rusztowanie — niezależne od cennika hurtowni">—</span>`
        : `<select class="wr-src" title="Cennik" onchange="window.changeRowShop(${gi},this.value)">
                ${shops.map(s => `<option value="${s}" ${row.shop === s ? 'selected' : ''}>${SHOP_LABELS[s] || s}</option>`).join('')}
                ${edited ? '<option value="własna" selected>Cena własna</option>' : ''}
              </select>`}
          <span class="wr-total">${pln(tot)}</span>
        </div>`;
    }).join('')}
    </div>`;
  };

  renderSection('wys-body-eps', 'wys-subtot-eps', secEPS);
  renderSection('wys-body-kleje', 'wys-subtot-kleje', secKleje);
  renderSection('wys-body-tynk', 'wys-subtot-tynk', secTynk);
  renderSection('wys-body-lacze', 'wys-subtot-lacze', secLacze);
  renderSection('wys-body-profile', 'wys-subtot-profile', secProfile);
  renderSection('wys-body-parapety', 'wys-subtot-parapety', secParapety);
  renderSection('wys-body-tasmy', 'wys-subtot-tasmy', secTasmy);
  renderSection('wys-body-custom', 'wys-subtot-custom', secCustomMat);
  renderSection('wys-body-labor', 'wys-subtot-labor', secLabor);
  renderSection('wys-body-rusz', 'wys-subtot-rusz', secRusz);
  renderSection('wys-body-prace', 'wys-subtot-prace', secPrace);
  renderSection('wys-body-custom-rob', 'wys-subtot-custom-rob', secCustomRob);

  updateWycenaSummary();
}

export function editWycenaRow(gi, field, value) {
  const r = wycenaRows[gi];
  if (!r) return;
  const v = parseFloat(value);
  const num = (isNaN(v) || !isFinite(v) || v < 0) ? 0 : v;
  const key = rowKey(r);
  if (!wycenaManualEdits[key]) wycenaManualEdits[key] = {};
  if (field === 'qty') {
    r.qty = num;
    wycenaManualEdits[key].qty = num;
  } else if (field === 'price') {
    r.price = num;
    r.shop = 'własna';
    wycenaManualEdits[key].price = num;
    wycenaManualEdits[key].shop = 'własna';
    wycenaManualEdits[key].savedMode = priceMode;
  }
  refreshRowTotals(gi);
  refreshSectionTotals();
}

export function changeRowShop(gi, val) {
  const r = wycenaRows[gi];
  if (!r) return;
  const key = rowKey(r);
  if (!wycenaManualEdits[key]) wycenaManualEdits[key] = {};
  if (val === 'własna') return;
  delete wycenaManualEdits[key].price;
  if (wycenaManualEdits[key].shop === 'własna') delete wycenaManualEdits[key].shop;
  wycenaManualEdits[key].rowShop = val;
  buildWycenaRows();
}

export function refreshRowTotals(gi) {
  const r = wycenaRows[gi];
  if (!r) return;
  const inp = document.querySelector(`.wr-qty[oninput*="editWycenaRow(${gi},"]`);
  const totEl = inp?.closest('.wr')?.querySelector('.wr-total');
  if (totEl) totEl.textContent = pln((r.qty || 0) * (r.price || 0));
}

export function refreshSectionTotals() {
  const secs = {
    eps: 'wys-subtot-eps', kleje: 'wys-subtot-kleje', tynk: 'wys-subtot-tynk', lacze: 'wys-subtot-lacze',
    profile: 'wys-subtot-profile', parapety: 'wys-subtot-parapety', tasmy: 'wys-subtot-tasmy',
    custom_mat: 'wys-subtot-custom', labor: 'wys-subtot-labor', rusz: 'wys-subtot-rusz',
    prace: 'wys-subtot-prace', custom_rob: 'wys-subtot-custom-rob',
  };
  Object.entries(secs).forEach(([sec, id]) => {
    const tot = wycenaRows.filter(r => r.section === sec).reduce((s, r) => s + (r.qty || 0) * (r.price || 0), 0);
    const el = document.getElementById(id);
    if (el) el.textContent = tot > 0 ? pln(tot) : '—';
  });
  updateWycenaSummary();
  scheduleWycenaSave();
  syncLiveBarFromWycena();
}

export function syncLiveBarFromWycena() {
  const total = wycenaRows.reduce((s, r) => s + (r.qty || 0) * (r.price || 0), 0);
  const matT = wycenaRows.filter(r => !LABOR_SECTIONS.includes(r.section)).reduce((s, r) => s + (r.qty || 0) * (r.price || 0), 0);
  const labT = total - matT;
  const ct = document.getElementById('chip-total-val');
  if (ct) ct.textContent = pln(total);
  const cm = document.getElementById('chip-mat-val');
  if (cm) cm.textContent = pln(matT);
  const cl = document.getElementById('chip-labor-val');
  if (cl) cl.textContent = pln(labT);
}

let _wycenaSaveTimer = null;
export function scheduleWycenaSave() {
  clearTimeout(_wycenaSaveTimer);
  _wycenaSaveTimer = setTimeout(() => {
    window.autoSave?.();
    window.showToast?.('💾 Wycena zapisana', 1500);
  }, 800);
}

export function updClientMargin(v) {
  setClientMargin(v);
  const inp = document.getElementById('client-margin-input');
  if (inp && +inp.value !== clientMargin) inp.value = clientMargin;
  updateWycenaSummary();
}

export function updateWycenaSummary() {
  const s = document.getElementById('wycena-summary');
  if (!s) return;
  const sumSec = sec => wycenaRows.filter(r => r.section === sec).reduce((a, r) => a + (r.qty || 0) * (r.price || 0), 0);
  const matTotal = wycenaRows.filter(r => !LABOR_SECTIONS.includes(r.section)).reduce((a, r) => a + (r.qty || 0) * (r.price || 0), 0);
  const laborTotal = LABOR_SECTIONS.reduce((a, sec) => a + sumSec(sec), 0);
  const grandTotal = matTotal + laborTotal;

  const isBrutto = priceMode === 'brutto';
  const area = gvn('area', 0);
  const editCount = Object.keys(wycenaManualEdits).length;
  const margin = clientMargin / 100;

  // W trybie netto: ceny w wierszach są netto → oblicz brutto do wyświetlenia
  const matBrutto = isBrutto ? matTotal : matTotal * VAT_MAT;
  const laborBrutto = isBrutto ? laborTotal : laborTotal * VAT_LABOR;
  const grandBrutto = matBrutto + laborBrutto;

  // Cena klienta (narzut od cen wierszy) + VAT jeśli tryb netto
  const clientTotal = grandTotal * (1 + margin);
  const profit = grandTotal * margin;

  const dispPerM2 = area > 0 ? pln(grandBrutto / area) + ' / m²' : '';
  // Oferta dla klienta brutto: stosuj VAT_MAT/VAT_LABOR osobno dla materiałów i robocizny
  const clientDisplayBrutto = isBrutto
    ? clientTotal
    : matTotal * (1 + margin) * VAT_MAT + laborTotal * (1 + margin) * VAT_LABOR;
  const clientPerM2 = area > 0 ? pln(clientDisplayBrutto / area) + ' / m²' : '';

  const row = (lbl, val, cls) => `<div class="ws-row"><span>${lbl}</span><span class="${cls || ''}">${pln(val)}</span></div>`;

  const vatBlock = isBrutto ? '' : `
    <div class="ws-row"><span>VAT materiały ${Math.round((VAT_MAT - 1) * 100)}%</span><span>${pln(matTotal * (VAT_MAT - 1))}</span></div>
    <div class="ws-row"><span>VAT robocizna ${Math.round((VAT_LABOR - 1) * 100)}%</span><span>${pln(laborTotal * (VAT_LABOR - 1))}</span></div>`;

  const clientPanel = clientMargin > 0 ? `
    <div class="ws-panel-label ws-panel-label-client">🧾 Oferta dla klienta — narzut ${clientMargin}%</div>
    <div class="ws-group">
      <div class="ws-gtitle">Kalkulacja cenowa ${isBrutto ? '(ceny brutto)' : '(ceny netto)'}</div>
      ${row('Materiały budowlane', matTotal * (1 + margin))}
      ${row('Robocizna i usługi', laborTotal * (1 + margin))}
      <div class="ws-row ws-subtot"><span>Suma klienta</span><span>${pln(clientTotal)}</span></div>
    </div>
    <div class="ws-final" style="border-color:rgba(62,207,142,.45);background:linear-gradient(135deg,rgba(62,207,142,.08),rgba(62,207,142,.02))">
      ${isBrutto ? '' : `
        <div class="ws-row"><span>VAT materiały ${Math.round((VAT_MAT - 1) * 100)}%</span><span>${pln(matTotal * (1 + margin) * (VAT_MAT - 1))}</span></div>
        <div class="ws-row"><span>VAT robocizna ${Math.round((VAT_LABOR - 1) * 100)}%</span><span>${pln(laborTotal * (1 + margin) * (VAT_LABOR - 1))}</span></div>`}
      <div class="ws-brutto" style="border-color:var(--grn)">
        <div>
          <div class="ws-bl" style="color:var(--grn)">${isBrutto ? 'Oferta brutto' : 'Oferta brutto klienta'}</div>
          ${area > 0 ? `<div class="ws-perm">≈ ${clientPerM2}</div>` : ''}
          <div class="ws-perm" style="color:var(--grn);font-weight:700">Zysk: +${pln(profit)}</div>
        </div>
        <div class="ws-bv" style="color:var(--grn)">${pln(clientDisplayBrutto)}</div>
      </div>
    </div>` : '';

  s.innerHTML = `
  <div class="ws-box">
    <div class="ws-panel-label">📊 Kosztorys ${isBrutto ? '(ceny brutto z VAT)' : '(ceny netto)'}</div>
    <div class="ws-group">
      <div class="ws-gtitle">Materiały budowlane (A–H)</div>
      ${row('Izolacja EPS', sumSec('eps'))}
      ${row('Kleje, masy, siatka', sumSec('kleje'))}
      ${row('Tynk, farba, grunty', sumSec('tynk'))}
      ${row('Łączniki i zaślepki', sumSec('lacze'))}
      ${row('Profile i listwy', sumSec('profile'))}
      ${row('Parapety i obróbki', sumSec('parapety'))}
      ${row('Taśmy, folie, pianka', sumSec('tasmy'))}
      ${sumSec('custom_mat') > 0 ? row('Własne materiały', sumSec('custom_mat')) : ''}
      <div class="ws-row ws-subtot"><span>Razem materiały</span><span>${pln(matTotal)}</span></div>
    </div>
    <div class="ws-group">
      <div class="ws-gtitle">Robocizna i usługi (I–L)</div>
      ${row('Robocizna montażowa', sumSec('labor'))}
      ${sumSec('rusz') > 0 ? row('Rusztowanie', sumSec('rusz')) : ''}
      ${sumSec('prace') > 0 ? row('Prace dodatkowe', sumSec('prace')) : ''}
      ${sumSec('custom_rob') > 0 ? row('Własne prace', sumSec('custom_rob')) : ''}
      <div class="ws-row ws-subtot"><span>Razem robocizna</span><span>${pln(laborTotal)}</span></div>
    </div>
    <div class="ws-final">
      ${isBrutto
        ? `<div class="ws-row"><span>Razem (z VAT)</span><span style="font-weight:700">${pln(grandTotal)}</span></div>`
        : `<div class="ws-row"><span>Suma netto</span><span style="font-weight:700">${pln(grandTotal)}</span></div>
           ${vatBlock}`}
      <div class="ws-brutto">
        <div><div class="ws-bl">Razem brutto</div>${area > 0 ? `<div class="ws-perm">≈ ${dispPerM2}</div>` : ''}</div>
        <div class="ws-bv">${pln(grandBrutto)}</div>
      </div>
    </div>
    ${clientPanel}
    ${editCount > 0 ? `<div class="ws-note">✎ ${editCount} ${editCount === 1 ? 'pozycja edytowana ręcznie' : 'pozycji edytowanych ręcznie'} — użyj „Reset edycji" aby przywrócić wartości automatyczne.</div>` : ''}
  </div>`;
}

export function resetWycenaEdits() {
  if (!Object.keys(wycenaManualEdits).length) {
    window.showToast?.('Brak edycji do zresetowania');
    return;
  }
  if (!confirm('Przywrócić wszystkie ceny i ilości obliczone automatycznie? Ręczne zmiany w wycenie zostaną usunięte.')) return;
  setWycenaManualEdits({});
  buildWycenaRows();
  window.autoSave?.();
  window.showToast?.('↺ Przywrócono wartości automatyczne');
}

Object.assign(window, {
  buildWycenaRows, rowKey, editWycenaRow, changeRowShop,
  refreshRowTotals, refreshSectionTotals, syncLiveBarFromWycena,
  scheduleWycenaSave, updateWycenaSummary, resetWycenaEdits,
  updClientMargin,
});
