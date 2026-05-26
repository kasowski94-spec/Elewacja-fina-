// ════════════ PROJEKTY ════════════

import { CUSTOM_TABS, PROJECT_SCHEMA_VER, PARAPET_DEFAULTS } from '../data/constants.js';
import {
  projects, setProjects, currentProject, setCurrentProject,
  customItems, foamItems, setFoamItems, parapets, setParapets,
  wycenaManualEdits, setWycenaManualEdits, selectedVariant,
} from '../store/state.js';
import { idbSaveProjects } from '../services/storage.js';
import { gs } from '../utils/dom.js';
import { PRICE_DEFS } from '../data/constants.js';
import { EXTRAS_DEF } from '../data/constants.js';

export function saveProjects() {
  idbSaveProjects(projects);
  try { localStorage.setItem('elewacjapro_v4', JSON.stringify(projects)); } catch (e) {}
}

export function refreshProjectSelect() {
  const sel = document.getElementById('project-select');
  if (!sel) return;
  const keys = Object.keys(projects);
  sel.innerHTML = keys.length
    ? keys.map(id => `<option value="${id}" ${id === currentProject ? 'selected' : ''}>${projects[id].name}</option>`).join('')
    : '<option>Brak</option>';
}

export function renderProjectList() {
  const c = document.getElementById('proj-list');
  if (!c) return;
  const keys = Object.keys(projects);
  c.innerHTML = keys.length
    ? keys.map(id => `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--brd)">
        <span style="font-size:.79rem">${projects[id].name}</span>
        <div style="display:flex;gap:6px">
          <button class="btn sm" onclick="window.loadProject('${id}');window.closeModal('modal-proj')">Otwórz</button>
          <button class="btn sm" style="color:var(--red)" onclick="window.deleteProject('${id}')">Usuń</button>
        </div></div>`).join('')
    : '<div style="font-size:.71rem;color:var(--mut)">Brak projektów.</div>';
}

export function newProjectModal() {
  renderProjectList();
  document.getElementById('modal-proj').classList.remove('hidden');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

export function saveNewProject() {
  const name = document.getElementById('proj-name-input')?.value?.trim();
  if (!name) { alert('Wpisz nazwę projektu.'); return; }
  const id = 'proj_' + Date.now();
  projects[id] = { name, data: collectState() };
  saveProjects();
  setCurrentProject(id);
  refreshProjectSelect();
  closeModal('modal-proj');
}

export function deleteProject(id) {
  if (!confirm('Usunąć "' + projects[id]?.name + '"?')) return;
  delete projects[id];
  saveProjects();
  if (currentProject === id) setCurrentProject(Object.keys(projects)[0] || null);
  refreshProjectSelect();
  renderProjectList();
}

export function collectState() {
  const fields = [
    'area','waste','epsType','epsThick','mainShop','wallMat','wallThick','wallU0',
    'groundType','primerSubType','bondType','plasterType','paintType','primerRate',
    'buildH','windZone','anchPerM2','anchType','anchDia','capType','capDia',
    'cornerType','winStripType','foilCount','tapeWin','tapeExp','tapeElew','tapeMal',
    'perim','winPerim','flashMb','dilMb','ancEps','ancSubst','ancTynk','ancWarst',
    'kolekType','kolekLen','kolekPrice','ruszW','ruszP','ruszM','ruszS',
    'wycena-klient','wycena-adres','wycena-data','wycena-wyk','wycena-nr','wycena-termin','wycena-notes',
    ...PRICE_DEFS.map(p => p.id),
  ];
  const st = {};
  fields.forEach(f => { const el = document.getElementById(f); if (el) st[f] = el.value; });
  st.ruszEnabled = document.getElementById('rusz-toggle')?.checked !== false;
  st.selectedVariant = selectedVariant;
  st.parapets = JSON.parse(JSON.stringify(parapets));
  st.foamItems = JSON.parse(JSON.stringify(foamItems));
  st.customItems = JSON.parse(JSON.stringify(customItems));
  st.wycenaManualEdits = JSON.parse(JSON.stringify(wycenaManualEdits));
  st.extras = EXTRAS_DEF.reduce((o, e) => {
    o[e.id] = {
      on: document.getElementById('ext_' + e.id)?.checked,
      qty: document.getElementById('ext_qty_' + e.id)?.value,
      p: document.getElementById('ext_p_' + e.id)?.value,
    };
    return o;
  }, {});
  st.schemaVer = PROJECT_SCHEMA_VER;
  return st;
}

export function migrateState(st) {
  if (!st) return st;
  const v = st.schemaVer || 1;
  if (v < 2) {
    if (Array.isArray(st.parapets))
      st.parapets = st.parapets.map(p => ({ ...PARAPET_DEFAULTS, ...p }));
    if (!st.epsThick && st.selectedVariant) st.epsThick = String(st.selectedVariant);
  }
  st.schemaVer = PROJECT_SCHEMA_VER;
  return st;
}

export function applyState(st) {
  if (!st) return;
  st = migrateState(st);

  if (st.kolekType) {
    const kt = document.getElementById('kolekType');
    if (kt) kt.value = st.kolekType;
  }
  if (typeof window.updKolekOptions === 'function') window.updKolekOptions();

  Object.keys(st).forEach(f => {
    if (f === 'schemaVer') return;
    if (f === 'ruszEnabled') {
      const el = document.getElementById('rusz-toggle'); if (el) el.checked = st[f] !== false;
      const el2 = document.getElementById('rusz-toggle2'); if (el2) el2.checked = st[f] !== false;
      return;
    }
    if (f === 'selectedVariant') {
      const { THICK } = window.__AppData || {};
      if (THICK) { const t = THICK.includes(st[f]) ? st[f] : 15; setSelectedVariant(t); }
      return;
    }
    if (f === 'parapets') {
      setParapets((st[f] || []).map(p => ({ ...PARAPET_DEFAULTS, ...p })));
      if (typeof window.renderParapets === 'function') window.renderParapets();
      return;
    }
    if (f === 'foamItems') {
      setFoamItems(st[f] || [{ type: 'niskoprezna', count: 4 }]);
      if (typeof window.renderFoam === 'function') window.renderFoam();
      return;
    }
    if (f === 'customItems') {
      const ci = st[f] || {};
      CUSTOM_TABS.forEach(t => {
        customItems[t] = ci[t] || [];
        if (typeof window.renderCustom === 'function') window.renderCustom(t);
      });
      return;
    }
    if (f === 'wycenaManualEdits') {
      setWycenaManualEdits(st[f] || {});
      return;
    }
    if (f === 'extras') {
      EXTRAS_DEF.forEach(e => {
        const d = st.extras?.[e.id];
        if (!d) return;
        const el = document.getElementById('ext_' + e.id);
        if (el) { el.checked = d.on; document.getElementById('exrow_' + e.id)?.classList.toggle('active', d.on); }
        const q = document.getElementById('ext_qty_' + e.id); if (q && d.qty) q.value = d.qty;
        const p = document.getElementById('ext_p_' + e.id); if (p && d.p) p.value = d.p;
      });
      return;
    }
    const el = document.getElementById(f);
    if (el) el.value = st[f];
  });

  const et = document.getElementById('epsThick');
  if (et) et.value = String(selectedVariant);
  if (typeof window.updateWallU === 'function') window.updateWallU();
  if (typeof window.recAnchors === 'function') window.recAnchors(true);
  if (typeof window.calcAnchor === 'function') window.calcAnchor();
  if (typeof window.calc === 'function') window.calc();
}

export function loadProject(id) {
  if (!id || !projects[id]) return;
  setCurrentProject(id);
  setWycenaManualEdits({});
  applyState(projects[id].data);
}

export function autoSave() {
  if (!currentProject) return;
  projects[currentProject] = {
    name: projects[currentProject]?.name || 'Projekt',
    data: collectState(),
  };
  saveProjects();
}

export function exportProjectJSON() {
  const id = currentProject;
  const proj = projects[id];
  if (!proj) { window.showToast?.('Brak projektu do eksportu'); return; }
  const data = { version: '1.0', app: 'ElewacjaPro', exported: new Date().toISOString(), ...proj };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (proj.name || 'projekt').replace(/\s+/g, '_') + '_elewacja.json';
  a.click();
  URL.revokeObjectURL(url);
  window.showToast?.('📦 Projekt wyeksportowany');
}

export function importProjectJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    window.showToast?.('❌ Plik za duży (limit 5 MB)');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object') throw new Error('zła struktura');
      if (!data.name && !data.data) { window.showToast?.('❌ Nieprawidłowy plik projektu'); return; }
      const id = 'proj_' + Date.now();
      const { version, app, exported, ...projData } = data;
      let pd = projData.data || projData;
      if (pd && typeof pd === 'object') pd = migrateState(pd);
      else pd = null;
      projects[id] = {
        name: String(projData.name || 'Import ' + new Date().toLocaleDateString('pl')).slice(0, 80),
        data: pd,
      };
      saveProjects();
      refreshProjectSelect();
      loadProject(id);
      window.showToast?.('✅ Projekt wczytany: ' + projects[id].name);
    } catch (err) {
      window.showToast?.('❌ Błąd wczytywania pliku JSON');
    }
  };
  reader.readAsText(file, 'UTF-8');
  event.target.value = '';
}

Object.assign(window, {
  newProjectModal, closeModal, saveNewProject, deleteProject,
  loadProject, autoSave, exportProjectJSON, importProjectJSON,
  migrateState,
});
