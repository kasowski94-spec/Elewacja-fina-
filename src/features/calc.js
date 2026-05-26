// ════════════ MAIN CALCULATOR ════════════

import { THICK, FOAM_TYPES, CORNER_MULT, SHOP_MULT, SHOP_LABELS, RUSZ_OVERHANG } from '../data/constants.js';
import { selectedVariant } from '../store/state.js';
import { gv, gs, gvn, gsn, validateInputs } from '../utils/dom.js';
import { calcU, uColor, uPct, isRec } from '../utils/math.js';
import { fmt, pln } from '../utils/format.js';
import { getExtrasCost } from './extras.js';
import { getParapetsCost } from './parapets.js';
import { getCustomCost, getAllCustomItems } from './custom.js';

export function shopPrice(baseId) {
  const base = gv(baseId) || 0;
  const shop = gs('mainShop') || 'reczne';
  if (shop === 'reczne') return base;
  return base * (SHOP_MULT[shop] || 1);
}

let _calcTimer = null;
export function debCalc() {
  clearTimeout(_calcTimer);
  _calcTimer = setTimeout(() => {
    try { calc(); } catch (e) { console.warn(e); }
  }, 160);
}

export function calc() {
  const issues = validateInputs();
  const vb = document.getElementById('validation-banner');
  if (vb) {
    if (issues.length) {
      vb.classList.add('show');
      const uniq = [...new Set(issues)].slice(0, 3);
      vb.innerHTML = `<span>⚠</span><span>Sprawdź pola: ${uniq.join(', ')}${issues.length > 3 ? ' i inne…' : ''}</span>`;
    } else {
      vb.classList.remove('show');
    }
  }

  const area = gvn('area', 350), waste = gvn('waste', 5) / 100;
  const lambda = gsn('epsType', 0.033), wallU0 = gvn('wallU0', 0.45);
  const plasterKg = gsn('plasterType', 3.2), paintRate = gsn('paintType', 0);
  const primerRate = gvn('primerRate', 0.15), primerSubRate = gsn('primerSubType', 0.15);
  const bondRate = gsn('bondType', 0);
  const perim = gvn('perim', 75), winPerim = gvn('winPerim', 120);
  const flashMb = gvn('flashMb', 0), dilMb = gvn('dilMb', 0), anch = gvn('anchPerM2', 6);
  const foilCount = gvn('foilCount', 0);
  const tapeWin = gvn('tapeWin', 0), tapeExp = gvn('tapeExp', 0), tapeElew = gvn('tapeElew', 0), tapeMal = gvn('tapeMal', 0);
  const winStrip = gsn('winStripType', 0);
  const cornerMult = CORNER_MULT[gs('cornerType')] || 1.0;
  const aW = area * (1 + waste);

  const adhesive = area * 4, meshReinf = area * 5.5, meshM2 = aW;
  const plasterTot = area * plasterKg, primerL = area * primerRate;
  const paintL = paintRate > 0 ? area * paintRate : 0;
  const starters = Math.ceil(perim / 2), cornersMb = winPerim;
  const anchTotal = Math.ceil(area * anch);
  const capTotal = gs('capType') !== '0' ? anchTotal : 0;
  const primerSubL = primerSubRate > 0 ? area * primerSubRate : 0;
  const bondTot = bondRate > 0 ? area * bondRate : 0;
  const winStripMb = winStrip > 0 ? winPerim : 0;

  const foamItems = window._foamItems || [];
  const foamTotalCost = foamItems.reduce((s, f) => s + f.count * (FOAM_TYPES[f.type]?.price || 14), 0);
  const foamTotalCount = foamItems.reduce((s, f) => s + f.count, 0);

  const pEps = shopPrice('p_eps'), pAnc = shopPrice('p_anchor'), pCap = shopPrice('p_cap');
  const pAdh = shopPrice('p_adhesive'), pMK = shopPrice('p_meshkg'), pM = shopPrice('p_mesh');
  const pPl = shopPrice('p_plaster'), pPr = shopPrice('p_primer'), pPa = shopPrice('p_paint');
  const pSt = shopPrice('p_starter'), pCo = shopPrice('p_corner') * cornerMult, pWS = shopPrice('p_winstrip');
  const pFl = shopPrice('p_flash'), pDi = shopPrice('p_dil'), pFoil = shopPrice('p_foil');
  const pTW = shopPrice('p_tapew'), pTE = shopPrice('p_tapee'), pTEl = shopPrice('p_tapeelew'), pTM = shopPrice('p_tapemal');
  const pPrSub = shopPrice('p_primsub'), pBond = shopPrice('p_bond'), pLab = gv('p_labor') || 80;

  const ruszW = gvn('ruszW', 6), ruszP = gvn('ruszP', 8), ruszMont = gvn('ruszM', 12), ruszSiatka = gvn('ruszS', 4);
  const ruszArea = area * RUSZ_OVERHANG;
  const ruszRaw = ruszArea * ruszP * (ruszW / 4.33) + ruszArea * ruszMont * 2 + ruszArea * ruszSiatka;
  const ruszEnabled = document.getElementById('rusz-toggle')?.checked !== false;
  const ruszTotal = ruszEnabled ? ruszRaw : 0;
  const rt2 = document.getElementById('rusz-toggle2');
  if (rt2) rt2.checked = ruszEnabled;
  const rtcost = document.getElementById('rusz-toggle-cost');
  if (rtcost) rtcost.textContent = ruszEnabled ? pln(ruszRaw) : 'wyłączone';
  const rtcost2 = document.getElementById('rusz-toggle-cost2');
  if (rtcost2) rtcost2.textContent = ruszEnabled ? pln(ruszRaw) : 'wyłączone';

  const costShared = adhesive * pAdh + meshReinf * pMK + meshM2 * pM + plasterTot * pPl + primerL * pPr + paintL * pPa +
    starters * pSt + cornersMb * pCo + winStripMb * pWS + flashMb * pFl + dilMb * pDi + anchTotal * pAnc + capTotal * pCap +
    foilCount * pFoil + tapeWin * pTW + tapeExp * pTE + tapeElew * pTEl + tapeMal * pTM +
    primerSubL * pPrSub + bondTot * pBond + foamTotalCost;
  const laborCost = area * pLab;
  const extrasCost = getExtrasCost();
  const parCost = getParapetsCost();
  const customCost = getCustomCost();
  const selCostEPS = aW * selectedVariant * pEps;
  const selTotal = selCostEPS + costShared + parCost + extrasCost + customCost + ruszTotal + laborCost;

  // TOPBAR
  document.getElementById('chip-total-val').textContent = pln(selTotal);
  document.getElementById('chip-eps-val').textContent = pln(selCostEPS);
  document.getElementById('chip-mat-val').textContent = pln(costShared + parCost + customCost);
  document.getElementById('chip-labor-val').textContent = pln(laborCost);
  document.getElementById('chip-var-val').textContent = selectedVariant + ' cm';
  document.getElementById('chip-shop-val').textContent = SHOP_LABELS[gs('mainShop')] || gs('mainShop') || '—';
  const m3El = document.getElementById('chip-eps-m3-val');
  if (m3El) m3El.textContent = fmt(aW * selectedVariant / 100, 2) + ' m³';

  // VARIANT CARDS
  const cc = document.getElementById('cardsContainer');
  if (cc) {
    cc.innerHTML = '';
    THICK.forEach(t => {
      const u = calcU(t / 100, lambda, wallU0), cEPS = aW * t * pEps, rec = isRec(t), col = uColor(u);
      const div = document.createElement('div');
      div.className = 'vc' + (rec ? ' rec' : '') + (t === selectedVariant ? ' sel' : '');
      div.onclick = () => window.setVariant(t);
      div.innerHTML = `<div class="vc-sel-badge">✓ WYBRANY</div>
        <div class="vt">${t}<small> cm</small></div>
        <div class="vn">λ=${lambda.toFixed(3)} · U₀=${wallU0.toFixed(2)}</div>
        <div>
          <div class="vr"><span class="vrl">Płyty EPS</span><span class="vrv hl">${fmt(aW, 1)} m²</span></div>
          <div class="vr"><span class="vrl">EPS m³</span><span class="vrv">${fmt(aW * t / 100, 2)}</span></div>
          <div class="vr"><span class="vrl">Łączniki</span><span class="vrv">${fmt(anchTotal)}</span></div>
          <div class="vr"><span class="vrl">Klej</span><span class="vrv">${fmt(adhesive)} kg</span></div>
          <div class="vr"><span class="vrl">Koszt EPS</span><span class="vrv g">${pln(cEPS)}</span></div>
        </div>
        <div class="ubar">
          <div class="ubl"><span>U</span><span style="color:${col};font-weight:700">${u.toFixed(3)} ${u <= 0.20 ? '✓' : '✗'}WT2021</span></div>
          <div class="ubt"><div class="ubf" style="width:${uPct(u)}%;background:linear-gradient(90deg,${col}55,${col})"></div></div>
        </div>`;
      cc.appendChild(div);
    });
  }

  // MAIN TABLE
  const tb = document.getElementById('tableBody');
  if (tb) {
    tb.innerHTML = '';
    THICK.forEach(t => {
      const u = calcU(t / 100, lambda, wallU0), col = uColor(u), cEPS = aW * t * pEps, rec = isRec(t);
      const tr = document.createElement('tr');
      if (t === selectedVariant) tr.style.background = 'rgba(232,84,26,.07)';
      else if (rec) tr.className = 'rr';
      tr.innerHTML = `<td><strong>${t} cm</strong></td><td>${fmt(aW, 1)}</td><td>${fmt(aW * t / 100, 2)}</td>
        <td>${fmt(anchTotal)}</td><td>${fmt(adhesive)}</td><td>${fmt(meshReinf)}</td><td>${fmt(meshM2, 1)}</td>
        <td style="color:${col};font-weight:700">${u.toFixed(3)}</td><td style="color:var(--grn)">${pln(cEPS)}</td>
        <td><span class="badge ${rec ? 'b-acc' : 'b-mut'}">${t === selectedVariant ? '✓ WYBRANY' : rec ? '★' : 'std'}</span></td>`;
      tb.appendChild(tr);
    });
  }

  // MATERIALS SECTION
  const ms = document.getElementById('materialsSection');
  if (ms) {
    const capName = { eps_bialy: 'styropianowa biała', eps_grafit: 'styropianowa grafitowa', welna: 'z wełny mineralnej' };
    const parapets = window._parapets || [];
    const rows = [
      { n: 'Płyty EPS', d: `λ=${lambda.toFixed(3)} — ${selectedVariant} cm`, q: `${fmt(aW, 1)} m²`, c: pln(selCostEPS) },
      { n: 'Masa klejąca do EPS', d: '~4 kg/m² — metoda obwod.-punkt.', q: `${fmt(adhesive)} kg`, c: pln(adhesive * pAdh) },
      { n: 'Masa zbrojąca', d: '~5,5 kg/m² — do wtapiania siatki', q: `${fmt(meshReinf)} kg`, c: pln(meshReinf * pMK) },
      { n: 'Siatka zbrojąca 145g', d: 'zakład min. 10 cm, z naddatkiem', q: `${fmt(meshM2, 1)} m²`, c: pln(meshM2 * pM) },
      { n: 'Łączniki mechaniczne', d: `${anch} szt./m² · ${gs('anchType')}`, q: `${fmt(anchTotal)} szt.`, c: pln(anchTotal * pAnc) },
      capTotal > 0 ? { n: 'Zaślepki łączników', d: `${capName[gs('capType')]} · Ø${gs('capDia')}mm`, q: `${fmt(capTotal)} szt.`, c: pln(capTotal * pCap) } : null,
      { n: 'Tynk elewacyjny', d: gs('plasterType').split('(')[0].trim(), q: `${fmt(plasterTot)} kg`, c: pln(plasterTot * pPl) },
      { n: 'Grunt pod tynk', d: `${primerRate} l/m²`, q: `${fmt(primerL, 1)} l`, c: pln(primerL * pPr) },
      primerSubL > 0 ? { n: 'Grunt podłoża', d: `${primerSubRate} l/m²`, q: `${fmt(primerSubL, 1)} l`, c: pln(primerSubL * pPrSub) } : null,
      bondTot > 0 ? { n: 'Masa sczepna', d: `${bondRate} kg/m²`, q: `${fmt(bondTot, 1)}`, c: pln(bondTot * pBond) } : null,
      paintL > 0 ? { n: 'Farba elewacyjna', d: `${paintRate} l/m²`, q: `${fmt(paintL, 1)} l`, c: pln(paintL * pPa) } : null,
      { n: 'Listwa startowa Al', d: `obwód budynku ${perim} mb`, q: `${starters} szt.`, c: pln(starters * pSt) },
      { n: 'Narożniki', d: gs('cornerType').replace(/_/g, ' '), q: `${fmt(cornersMb)} mb`, c: pln(cornersMb * pCo) },
      winStripMb > 0 ? { n: 'Listwa przyokienna', d: 'z uszczelką', q: `${fmt(winStripMb)} mb`, c: pln(winStripMb * pWS) } : null,
      flashMb > 0 ? { n: 'Obróbki blacharskie', d: 'ogniomury, attyki', q: `${flashMb} mb`, c: pln(flashMb * pFl) } : null,
      dilMb > 0 ? { n: 'Profile dylatacyjne', d: 'szczeliny dylatacyjne', q: `${dilMb} mb`, c: pln(dilMb * pDi) } : null,
      foilCount > 0 ? { n: 'Folie ochronne na okna', d: 'podczas tynkowania', q: `${foilCount} szt.`, c: pln(foilCount * pFoil) } : null,
      tapeWin > 0 ? { n: 'Taśma uszczelniająca okienna', d: 'niebieska/pomarańcz.', q: `${tapeWin} mb`, c: pln(tapeWin * pTW) } : null,
      tapeExp > 0 ? { n: 'Taśma rozprężna', d: 'pod parapet, narożniki', q: `${tapeExp} mb`, c: pln(tapeExp * pTE) } : null,
      tapeElew > 0 ? { n: 'Taśma elewacyjna ochronna', d: 'krawędzie EPS', q: `${tapeElew} mb`, c: pln(tapeElew * pTEl) } : null,
      tapeMal > 0 ? { n: 'Taśma malarska', d: 'tynkowanie i malowanie', q: `${tapeMal} mb`, c: pln(tapeMal * pTM) } : null,
      foamTotalCount > 0 ? { n: 'Pianka montażowa', d: foamItems.map(f => FOAM_TYPES[f.type]?.name.split('(')[0]).join(', '), q: `${foamTotalCount} szt.`, c: pln(foamTotalCost) } : null,
      parapets.length ? { n: `Parapety (${parapets.length} typy)`, d: parapets.map(p => p.name).join(', '), q: `${parapets.reduce((s, p) => p.count + s, 0)} szt.`, c: pln(parCost) } : null,
      ...getAllCustomItems().map(it => ({ n: '◆ ' + it.name, d: 'własna pozycja', q: `${fmt(it.qty, 2)} ${it.unit}`, c: pln(it.qty * it.price) })),
    ].filter(Boolean);
    ms.innerHTML = `<div class="card"><div class="mgrid">${rows.map(r => `<div class="mi"><h4>${r.n}</h4><p>${r.d}</p><div class="mq">${r.q}</div><div class="mc">${r.c ? '≈ ' + r.c : 'wg wariantu'}</div></div>`).join('')}</div></div>`;
  }

  // COST BOX
  const cs = document.getElementById('costSection');
  if (cs) {
    cs.innerHTML = `<div class="cost-box"><div class="cost-main">
      <div>
        <div style="font-size:.61rem;color:var(--mut);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px">EPS ${selectedVariant} cm · ${gs('mainShop')}</div>
        <div class="cost-total">${pln(selTotal)}</div>
        <div class="cost-sub">≈ ${pln(selTotal / area)} / m²</div>
      </div>
      <div class="cost-lines">
        <div class="cl"><span>Styropian EPS ${selectedVariant} cm</span><span>${pln(selCostEPS)}</span></div>
        <div class="cl"><span>Pozostałe materiały</span><span>${pln(costShared)}</span></div>
        <div class="cl"><span>Parapety</span><span>${pln(parCost)}</span></div>
        <div class="cl"><span>Prace dodatkowe</span><span>${pln(extrasCost)}</span></div>
        <div class="cl"><span>Własne pozycje</span><span>${pln(customCost)}</span></div>
        <div class="cl"><span>Rusztowanie</span><span>${pln(ruszTotal)}</span></div>
        <div class="cl"><span>Robocizna</span><span>${pln(laborCost)}</span></div>
        <div class="cl"><span>RAZEM netto</span><span>${pln(selTotal)}</span></div>
      </div>
    </div></div>`;
  }

  // COST TABLE
  const ctb = document.getElementById('costTableBody');
  if (ctb) {
    ctb.innerHTML = '';
    THICK.forEach(t => {
      const cEPS = aW * t * pEps;
      const total = cEPS + costShared + parCost + extrasCost + customCost + ruszTotal + laborCost;
      const tr = document.createElement('tr');
      if (t === selectedVariant) tr.style.background = 'rgba(232,84,26,.07)';
      else if (isRec(t)) tr.className = 'rr';
      tr.innerHTML = `<td><strong>${t} cm</strong></td><td style="color:var(--acc2)">${pln(cEPS)}</td>
        <td>${pln(costShared)}</td><td>${pln(extrasCost + parCost + customCost)}</td>
        <td>${pln(ruszTotal)}</td><td>${pln(laborCost)}</td>
        <td style="color:var(--grn);font-weight:700">${pln(total)}</td><td>${pln(total / area)}</td>`;
      ctb.appendChild(tr);
    });
  }

  // RUSZ STATS
  const re = document.getElementById('ruszStats');
  if (re) {
    const dz = ruszArea * ruszP * (ruszW / 4.33), mo = ruszArea * ruszMont * 2, si = ruszArea * ruszSiatka;
    re.innerHTML = `
      <div class="rst"><div class="lbl">Pow. rusztowania</div><div class="val">${fmt(ruszArea, 0)} m²</div></div>
      <div class="rst"><div class="lbl">Dzierżawa</div><div class="val">${pln(dz)}</div></div>
      <div class="rst"><div class="lbl">Montaż+demontaż</div><div class="val">${pln(mo)}</div></div>
      <div class="rst"><div class="lbl">Siatka ochronna</div><div class="val">${pln(si)}</div></div>
      <div class="rst" style="border-color:var(--acc)"><div class="lbl">ŁĄCZNIE</div><div class="val" style="color:var(--acc)">${pln(ruszTotal)}</div></div>`;
  }

  window.buildWycenaRows?.();
  window.autoSave?.();
}

Object.assign(window, { calc, debCalc, shopPrice });
