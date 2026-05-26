// ════════════ PARAPETY ════════════

import { PARAPET_DEFAULTS, SHEET_TYPES } from '../data/constants.js';
import { parapets, setParapets } from '../store/state.js';
import { fmt, pln, escAttr } from '../utils/format.js';

export function parapetCalc(p) {
  const devMm = p.width + 2 * (p.bend || 0);
  const devM = devMm / 1000;
  const lenM = (p.length || 0) / 1000;
  const totalLenM = lenM * (p.count || 0);
  const areaM2 = devM * lenM * (p.count || 0);
  const sheetArea = ((p.sheetW || 1000) / 1000) * ((p.sheetL || 2000) / 1000);
  const sheetsNeeded = sheetArea > 0 ? Math.ceil(areaM2 / sheetArea * 1.1) : 0;
  const sheetCost = sheetsNeeded * (p.sheetPrice || 0);
  const bendsTotal = (p.bendsPer || 0) * (p.count || 0);
  const cutsTotal = (p.cutsPer || 0) * (p.count || 0);
  const bendCost = bendsTotal * (p.bendCost || 0);
  const cutCost = cutsTotal * (p.cutCost || 0);
  const laborCost = (p.laborPer || 0) * (p.count || 0);
  const total = sheetCost + bendCost + cutCost + laborCost;
  return { devMm, devM, totalLenM, areaM2, sheetArea, sheetsNeeded, sheetCost, bendsTotal, cutsTotal, bendCost, cutCost, laborCost, total };
}

export function parapetBoxHTML(p) {
  const cc = parapetCalc(p);
  return `
    <div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">Rozwinięcie szer. (${p.width}+2×${p.bend})</span><b>${cc.devMm} mm</b></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">Pole blachy</span><b>${cc.areaM2.toFixed(2)} m²</b></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">Arkusze (${cc.sheetArea.toFixed(2)} m²/ark + 10% odpad)</span><b style="color:var(--acc2)">${cc.sheetsNeeded} ark.</b></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">Koszt blachy</span><b>${pln(cc.sheetCost)}</b></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">Gięcia (${cc.bendsTotal}×) + cięcia (${cc.cutsTotal}×)</span><b>${pln(cc.bendCost + cc.cutCost)}</b></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">Robocizna montaż</span><b>${pln(cc.laborCost)}</b></div>
    <div style="display:flex;justify-content:space-between;margin-top:3px;padding-top:3px;border-top:1px solid var(--brd)"><span style="color:var(--txt);font-weight:600">Razem parapet</span><b style="color:var(--grn)">${pln(cc.total)}</b></div>`;
}

export function renderParapets() {
  const c = document.getElementById('parapetsContainer');
  if (!c) return;
  if (!parapets.length) {
    c.innerHTML = '<div style="font-size:.73rem;color:var(--mut);text-align:center;padding:18px">Brak parapetów. Kliknij "+ Dodaj parapet".</div>';
    renderParapetsSummary();
    return;
  }
  c.innerHTML = parapets.map((p, i) => {
    const cc = parapetCalc(p);
    return `
    <div class="sub-row">
      <button class="sub-del" onclick="window.removeParapet(${i})">✕</button>
      <div class="sub-title">Parapet #${i + 1}</div>
      <div class="fg fg2">
        <div class="ig"><label>Nazwa</label><input type="text" value="${escAttr(p.name)}" oninput="window.updParapet(${i},'name',this.value)"></div>
        <div class="ig"><label>Materiał blachy</label>
          <select onchange="window.updParapetMaterial(${i},this.value)">
            ${Object.entries(SHEET_TYPES).map(([k, v]) => `<option value="${k}" ${p.material === k ? 'selected' : ''}>${v.name}</option>`).join('')}
          </select>
        </div>
        <div class="ig"><label>Ilość (szt.)</label><input type="number" value="${p.count}" min="1" oninput="window.updParapet(${i},'count',+this.value)"></div>
        <div class="ig"><label>Szerokość parapetu (mm)</label><input type="number" value="${p.width}" min="100" max="800" oninput="window.updParapet(${i},'width',+this.value)"></div>
        <div class="ig"><label>Długość parapetu (mm)</label><input type="number" value="${p.length}" min="200" oninput="window.updParapet(${i},'length',+this.value)"></div>
        <div class="ig"><label>Zagięcia obróbcze (mm/str.)</label><input type="number" value="${p.bend}" min="0" max="200" oninput="window.updParapet(${i},'bend',+this.value)"><span class="hint">dodawane do rozwinięcia</span></div>
      </div>
      <div style="margin-top:9px;padding-top:8px;border-top:1px dashed var(--brd)">
        <div style="font-size:.62rem;color:var(--acc2);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Arkusz blachy</div>
        <div class="fg fg2">
          <div class="ig"><label>Wymiar arkusza — szer. (mm)</label><input type="number" value="${p.sheetW}" min="100" oninput="window.updParapet(${i},'sheetW',+this.value)"></div>
          <div class="ig"><label>Wymiar arkusza — dł. (mm)</label><input type="number" value="${p.sheetL}" min="100" oninput="window.updParapet(${i},'sheetL',+this.value)"></div>
          <div class="ig"><label>Cena arkusza (zł/szt.)</label><input type="number" id="parsheet-${i}" value="${p.sheetPrice}" min="0" step=".5" oninput="window.updParapet(${i},'sheetPrice',+this.value)"></div>
        </div>
      </div>
      <div style="margin-top:9px;padding-top:8px;border-top:1px dashed var(--brd)">
        <div style="font-size:.62rem;color:var(--acc2);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Gięcia i cięcia</div>
        <div class="fg fg2">
          <div class="ig"><label>Gięć / szt.</label><input type="number" value="${p.bendsPer}" min="0" oninput="window.updParapet(${i},'bendsPer',+this.value)"></div>
          <div class="ig"><label>Koszt 1 gięcia (zł)</label><input type="number" value="${p.bendCost}" min="0" step=".5" oninput="window.updParapet(${i},'bendCost',+this.value)"></div>
          <div class="ig"><label>Cięć / szt.</label><input type="number" value="${p.cutsPer}" min="0" oninput="window.updParapet(${i},'cutsPer',+this.value)"></div>
          <div class="ig"><label>Koszt 1 cięcia (zł)</label><input type="number" value="${p.cutCost}" min="0" step=".5" oninput="window.updParapet(${i},'cutCost',+this.value)"></div>
          <div class="ig"><label>Robocizna montaż (zł/szt.)</label><input type="number" value="${p.laborPer}" min="0" step=".5" oninput="window.updParapet(${i},'laborPer',+this.value)"></div>
        </div>
      </div>
      <div id="parcalc-${i}" style="margin-top:9px;background:var(--card);border-radius:8px;padding:8px 10px;font-size:.68rem;line-height:1.7">${parapetBoxHTML(p)}</div>
    </div>`;
  }).join('');
  renderParapetsSummary();
}

export function recalcParapet(i) {
  const box = document.getElementById('parcalc-' + i);
  if (box && parapets[i]) box.innerHTML = parapetBoxHTML(parapets[i]);
  renderParapetsSummary();
  window.debCalc?.();
}

export function updParapet(i, k, v) {
  parapets[i][k] = v;
  recalcParapet(i);
}

export function updParapetMaterial(i, v) {
  parapets[i].material = v;
  if (SHEET_TYPES[v]) {
    parapets[i].sheetPrice = SHEET_TYPES[v].sheetPrice;
    const inp = document.getElementById('parsheet-' + i);
    if (inp) inp.value = SHEET_TYPES[v].sheetPrice;
  }
  recalcParapet(i);
}

export function addParapet(d = null) {
  const p = { ...PARAPET_DEFAULTS, name: 'Parapet typ ' + (parapets.length + 1), ...(d || {}) };
  parapets.push(p);
  renderParapets();
  window.calc?.();
}

export function removeParapet(i) {
  parapets.splice(i, 1);
  renderParapets();
  window.calc?.();
}

export function renderParapetsSummary() {
  const el = document.getElementById('parapetsSummary');
  if (!el) return;
  if (!parapets.length) { el.innerHTML = '<div style="font-size:.71rem;color:var(--mut)">Brak parapetów.</div>'; return; }
  let sheets = 0, bends = 0, cuts = 0, total = 0, lenM = 0;
  parapets.forEach(p => {
    const cc = parapetCalc(p);
    sheets += cc.sheetsNeeded; bends += cc.bendsTotal;
    cuts += cc.cutsTotal; total += cc.total; lenM += cc.totalLenM;
  });
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(95px,1fr));gap:10px">
    <div><div style="font-size:.6rem;color:var(--mut)">Typy</div><div style="font-family:var(--font-head);font-size:1.1rem;color:var(--acc2)">${parapets.length}</div></div>
    <div><div style="font-size:.6rem;color:var(--mut)">Długość</div><div style="font-family:var(--font-head);font-size:1.1rem;color:var(--acc2)">${lenM.toFixed(1)} mb</div></div>
    <div><div style="font-size:.6rem;color:var(--mut)">Arkusze</div><div style="font-family:var(--font-head);font-size:1.1rem;color:var(--acc2)">${sheets}</div></div>
    <div><div style="font-size:.6rem;color:var(--mut)">Gięcia</div><div style="font-family:var(--font-head);font-size:1.1rem;color:var(--acc2)">${bends}</div></div>
    <div><div style="font-size:.6rem;color:var(--mut)">Cięcia</div><div style="font-family:var(--font-head);font-size:1.1rem;color:var(--acc2)">${cuts}</div></div>
    <div><div style="font-size:.6rem;color:var(--mut)">Koszt</div><div style="font-family:var(--font-head);font-size:1.1rem;color:var(--grn)">${pln(total)}</div></div>
  </div>`;
}

export function getParapetsCost() {
  return parapets.reduce((s, p) => parapetCalc(p).total + s, 0);
}

Object.assign(window, {
  addParapet, removeParapet, updParapet, updParapetMaterial,
  recalcParapet, renderParapets, getParapetsCost, parapetCalc,
});
