// ════════════ ŁĄCZNIKI ════════════

import { THICK, WALL_LAMBDA } from '../data/constants.js';
import { selectedVariant, setSelectedVariant } from '../store/state.js';
import { calcU } from '../utils/math.js';
import { fmt } from '../utils/format.js';
import { MATERIAL_LIBRARY } from '../data/library.js';

export function updateWallU() {
  const mat = document.getElementById('wallMat')?.value;
  const thick = parseFloat(document.getElementById('wallThick')?.value) || 25;
  const hint = document.getElementById('wallUhint');
  const u0el = document.getElementById('wallU0');
  const wd = WALL_LAMBDA[mat];
  if (!wd || wd.lambda === null) { if (hint) hint.textContent = 'Wpisz U₀ ręcznie'; return; }
  const R_wall = (thick / 100) / wd.lambda;
  const u0 = 1 / (0.13 + R_wall + 0.04);
  if (u0el) u0el.value = u0.toFixed(2);
  if (hint) hint.textContent = `U₀ ≈ ${u0.toFixed(2)} (${wd.desc})`;
  if (typeof window.debCalc === 'function') window.debCalc();
}

export function recAnchors(skipCalc = false) {
  const h = parseFloat(document.getElementById('buildH')?.value) || 9;
  const wz = parseFloat(document.getElementById('windZone')?.value) || 1.0;
  let base = 4;
  if (h > 20) base = 6;
  else if (h > 12) base = 5;
  const rec = Math.ceil(base * wz);
  const el = document.getElementById('anchPerM2');
  if (el && !el.dataset.manual) el.value = rec;
  calcAnchor();
  if (!skipCalc && typeof window.debCalc === 'function') window.debCalc();
}

export function calcAnchor() {
  const eps = parseFloat(document.getElementById('ancEps')?.value || document.getElementById('epsThick')?.value) || selectedVariant;
  const subst = parseFloat(document.getElementById('ancSubst')?.value) || 50;
  const tynk = parseFloat(document.getElementById('ancTynk')?.value) || 10;
  const warst = parseFloat(document.getElementById('ancWarst')?.value) || 5;
  const totalMm = eps * 10 + tynk + warst + subst;
  const res = document.getElementById('anchorResult');
  if (res) {
    res.innerHTML = `<div style="background:var(--card2);border:1px solid var(--brd);border-radius:8px;padding:10px 12px;font-size:.72rem">
      <b style="color:var(--acc2)">Wymagana długość łącznika: ${totalMm} mm</b><br>
      <span style="color:var(--mut)">EPS ${eps}cm = ${eps*10}mm + tynk ${tynk}mm + zbrojenie ${warst}mm + zakotwienie ${subst}mm</span>
    </div>`;
  }
  const lbl = document.getElementById('ancTypeLbl');
  if (lbl) lbl.textContent = document.getElementById('anchType')?.selectedOptions[0]?.text || '';

  const tb = document.getElementById('anchorTableBody');
  if (tb) {
    const substVals = [50, 80, 60, 100];
    const anch = parseFloat(document.getElementById('anchPerM2')?.value) || 6;
    const area = parseFloat(document.getElementById('area')?.value) || 350;
    tb.innerHTML = THICK.map(t => {
      const len = substVals.map(s => t * 10 + tynk + warst + s);
      return `<tr ${t === selectedVariant ? 'style="background:rgba(232,84,26,.07)"' : ''}>
        <td><b>${t} cm</b></td>${len.map(l => `<td>${l} mm</td>`).join('')}
        <td style="color:var(--acc2)">${Math.ceil(area * anch)}</td></tr>`;
    }).join('');
  }
}

export function setVariant(t) {
  setSelectedVariant(t);
  const el = document.getElementById('epsThick');
  if (el) el.value = String(t);
  const el2 = document.getElementById('ancEps');
  if (el2) el2.value = String(t);
  calcAnchor();
  updKolekOptions();
  document.querySelectorAll('.vc').forEach(c => {
    const isSelected = parseInt(c.querySelector('.vt')?.textContent) === t;
    c.classList.toggle('sel', isSelected);
  });
  if (typeof window.calc === 'function') window.calc();
}

export function kolekListFor(type) {
  const prefixes = { pcv: 'kolek_pcv_', met: 'kolek_met_', termo: 'kolek_termo_' };
  const prefix = prefixes[type] || 'kolek_pcv_';
  return MATERIAL_LIBRARY.filter(it => it.id.startsWith(prefix))
    .map(it => {
      const mm = parseInt(it.id.replace(prefix, ''));
      return { mm, name: it.name, low: it.low, avg: it.avg, high: it.high };
    })
    .sort((a, b) => a.mm - b.mm);
}

export function updKolekOptions() {
  const type = document.getElementById('kolekType')?.value || 'pcv';
  const sel = document.getElementById('kolekLen');
  if (!sel) return;
  const list = kolekListFor(type);
  const eps = selectedVariant;
  const tynk = parseFloat(document.getElementById('ancTynk')?.value) || 10;
  const warst = parseFloat(document.getElementById('ancWarst')?.value) || 5;
  const subst = parseFloat(document.getElementById('ancSubst')?.value) || 50;
  const need = eps * 10 + tynk + warst + subst;
  sel.innerHTML = list.map(k =>
    `<option value="${k.mm}" ${k.mm >= need && (list.find(x=>x.mm>=need)?.mm===k.mm) ? 'selected' : ''}>${k.mm} mm — ${k.name}</option>`
  ).join('');
  updKolekPrice();
}

export function autoPickKolek() {
  updKolekOptions();
}

export function updKolekPrice() {
  const type = document.getElementById('kolekType')?.value || 'pcv';
  const len = parseInt(document.getElementById('kolekLen')?.value) || 200;
  const prefixes = { pcv: 'kolek_pcv_', met: 'kolek_met_', termo: 'kolek_termo_' };
  const id = (prefixes[type] || 'kolek_pcv_') + len;
  const it = MATERIAL_LIBRARY.find(x => x.id === id);
  const price = document.getElementById('kolekPrice');
  const hint = document.getElementById('kolekHint');
  if (it && price) {
    price.value = it.avg.toFixed(2);
    if (hint) hint.textContent = `rynkowa: ${fmt(it.low,2)}–${fmt(it.high,2)} zł/szt.`;
  } else if (hint) {
    hint.textContent = 'brak w bibliotece';
  }
  if (typeof window.debCalc === 'function') window.debCalc();
}

Object.assign(window, {
  updateWallU, recAnchors, calcAnchor, setVariant,
  kolekListFor, updKolekOptions, autoPickKolek, updKolekPrice,
});
