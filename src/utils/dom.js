// ════════════ DOM HELPERS ════════════

/** Odczytuje wartość liczbową z <input>, zwraca 0 gdy NaN/brak */
export const gv = id => {
  const el = document.getElementById(id);
  if (!el) return 0;
  const v = parseFloat(el.value);
  return (isNaN(v) || !isFinite(v)) ? 0 : v;
};

/** Odczytuje wartość tekstową z elementu */
export const gs = id => document.getElementById(id)?.value || '';

/** Odczytuje liczbę z <select>, z fallbackiem gdy brak/NaN */
export const gsn = (id, def) => {
  const x = parseFloat(gs(id));
  return isNaN(x) ? def : x;
};

/** Odczytuje liczbę z <input>, z fallbackiem gdy brak/NaN */
export const gvn = (id, def) => {
  const el = document.getElementById(id);
  if (!el) return def;
  const x = parseFloat(el.value);
  return isNaN(x) ? def : x;
};

/** Walidacja pól liczbowych — zwraca tablicę etykiet błędnych pól */
export function validateInputs() {
  const issues = [];
  document.querySelectorAll('input[type=number]').forEach(el => {
    el.classList.remove('input-error');
    if (el.closest('.wr,.sub-row,.we-row')) return;
    if (el.value === '') return;
    const v = parseFloat(el.value);
    const min = el.min !== '' ? parseFloat(el.min) : null;
    const max = el.max !== '' ? parseFloat(el.max) : null;
    let bad = false;
    if (isNaN(v) || !isFinite(v)) { bad = true; }
    else if (min !== null && v < min) { bad = true; }
    else if (max !== null && v > max) { bad = true; }
    if (bad) {
      el.classList.add('input-error');
      const lbl = el.closest('.ig')?.querySelector('label')?.textContent
        || el.getAttribute('title') || el.id || 'pole liczbowe';
      issues.push(lbl);
    }
  });
  return issues;
}
