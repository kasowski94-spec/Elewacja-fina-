// ════════════ ŁĄCZNIKI MECHANICZNE ════════════

import { THICK, WALL_LAMBDA } from '../data/constants.js';
import { MATERIAL_LIBRARY } from '../data/library.js';
import { selectedVariant, setSelectedVariant } from '../store/state.js';
import { gv, gs } from '../utils/dom.js';
import { fmt } from '../utils/format.js';

export function updateWallU() {
  const mat = gs('wallMat'), thick = gv('wallThick') / 100;
  const hint = document.getElementById('wallUhint');
  if (mat === 'inne') { if (hint) hint.textContent = 'Wpisz U₀ ręcznie'; window.calc?.(); return; }
  const lam = WALL_LAMBDA[mat];
  if (!lam) { window.calc?.(); return; }
  const U0 = 1 / (0.13 + thick / lam + 0.04);
  const el = document.getElementById('wallU0');
  if (el) el.value = U0.toFixed(3);
  if (hint) hint.textContent = `U₀ ≈ ${U0.toFixed(3)} (λ=${lam})`;
  window.calc?.();
}

export function recAnchors(keepManual) {
  const h = gv('buildH') || 9;
  const wf = parseFloat(gs('windZone')) || 1;
  const base = h <= 20 ? 6 : h <= 60 ? 8 : 10;
  const auto = Math.min(16, Math.ceil(base * wf));
  const el = document.getElementById('anchPerM2');
  if (el && !keepManual) el.value = auto;
  calcAnchor();
  window.calc?.();
}

export function calcAnchor() {
  const eps = gv('ancEps') || 15;
  const subst = gv('ancSubst') || 50;
  const tynk = gv('ancTynk') || 10;
  const warst = gv('ancWarst') || 5;
  const total = eps * 10 + tynk + warst + subst;
  const rnd = Math.ceil(total / 10) * 10;
  const dia = gs('anchDia') || '10';

  const res = document.getElementById('anchorResult');
  if (res) res.innerHTML = `
    <div style="background:var(--card2);border-radius:8px;padding:10px 12px">
      <div style="font-size:.7rem;color:var(--mut);margin-bottom:5px">Obliczona długość minimalna:</div>
      <div style="font-family:var(--font-head);font-size:1.45rem;font-weight:800;color:var(--acc2)">${total} mm
        <span style="font-size:.85rem;color:var(--mut)">→ wybierz <strong style="color:var(--acc)">${rnd} mm</strong></span></div>
      <div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:6px">
        <span style="font-size:.65rem;color:var(--mut)">EPS: <b style="color:var(--txt)">${eps * 10}mm</b></span>
        <span style="font-size:.65rem;color:var(--mut)">Tynk: <b style="color:var(--txt)">${tynk}mm</b></span>
        <span style="font-size:.65rem;color:var(--mut)">Zbroj.: <b style="color:var(--txt)">${warst}mm</b></span>
        <span style="font-size:.65rem;color:var(--mut)">Zakotw.: <b style="color:var(--txt)">${subst}mm</b></span>
        <span style="font-size:.65rem;color:var(--mut)">Średnica: <b style="color:var(--txt)">${dia === '60' ? 'talerz 90mm' : dia + 'mm'}</b></span>
      </div>
    </div>`;

  const tbody = document.getElementById('anchorTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    const ty = gv('ancTynk') || 10, wa = gv('ancWarst') || 5;
    const area = gv('area') || 350, a = gv('anchPerM2') || 6;
    THICK.forEach(t => {
      tbody.innerHTML += `<tr><td><strong>${t} cm</strong></td>${[50, 80, 60, 100].map(s => `<td>${Math.ceil((t * 10 + ty + wa + s) / 10) * 10} mm</td>`).join('')}<td>${fmt(Math.ceil(area * a))}</td></tr>`;
    });
  }

  const lbl = document.getElementById('ancTypeLbl');
  const m = { stal: 'Stalowy ocynkowany', poliamid: 'Poliamidowy', termo: 'Z wkładką termiczną' };
  if (lbl) lbl.textContent = m[gs('anchType')] || 'Stalowy';

  autoPickKolek();
}

export function setVariant(t) {
  if (!THICK.includes(t)) t = 15;
  setSelectedVariant(t);
  const et = document.getElementById('epsThick'); if (et && +et.value !== t) et.value = t;
  const ae = document.getElementById('ancEps'); if (ae && +ae.value !== t) ae.value = t;
  calcAnchor();
  window.calc?.();
}

export function kolekListFor(type) {
  const prefix = type === 'pcv' ? 'kolek_pcv_' : type === 'met' ? 'kolek_met_' : 'kolek_termo_';
  return MATERIAL_LIBRARY.filter(x => x.id.startsWith(prefix));
}

export function updKolekOptions() {
  const type = gs('kolekType') || 'pcv';
  const sel = document.getElementById('kolekLen');
  if (!sel) return;
  const prevId = sel.value;
  const list = kolekListFor(type);
  sel.innerHTML = list.map(x => {
    const mm = x.id.replace(/\D/g, '');
    return `<option value="${x.id}">${mm} mm — ${x.note || ''}</option>`;
  }).join('');
  if (list.some(x => x.id === prevId)) sel.value = prevId;
  else autoPickKolek();
  updKolekPrice();
}

export function autoPickKolek() {
  const sel = document.getElementById('kolekLen');
  if (!sel || !sel.options.length) return;
  const eps = gv('ancEps') || selectedVariant;
  const subst = gv('ancSubst') || 50;
  const tynk = gv('ancTynk') || 10;
  const warst = gv('ancWarst') || 5;
  const need = eps * 10 + tynk + warst + subst;
  let best = sel.options[sel.options.length - 1].value, bestMm = Infinity;
  for (const o of sel.options) {
    const mm = parseInt(o.value.replace(/\D/g, ''), 10) || 0;
    if (mm >= need && mm < bestMm) { bestMm = mm; best = o.value; }
  }
  sel.value = best;
}

export function updKolekPrice() {
  const id = gs('kolekLen');
  const it = MATERIAL_LIBRARY.find(x => x.id === id);
  const el = document.getElementById('kolekPrice');
  const hint = document.getElementById('kolekHint');
  if (it && el) {
    el.value = it.avg;
    if (hint) hint.textContent = `rynkowo ${fmt(it.low, 2)}–${fmt(it.high, 2)} zł — ${it.name}`;
  }
  const pAnch = document.getElementById('p_anchor');
  if (pAnch && el) pAnch.value = el.value;
  window.calc?.();
}

Object.assign(window, {
  updateWallU, recAnchors, calcAnchor, setVariant,
  kolekListFor, updKolekOptions, autoPickKolek, updKolekPrice,
});
