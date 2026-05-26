export function gv(id) {
  const el = document.getElementById(id);
  return el ? parseFloat(el.value) || 0 : 0;
}
export function gs(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}
export function gsn(id, fallback = 0) {
  const el = document.getElementById(id);
  return el ? (parseFloat(el.value) || fallback) : fallback;
}
export function gvn(id, fallback = 0) {
  const el = document.getElementById(id);
  return el ? (parseFloat(el.value) || fallback) : fallback;
}
export function validateInputs() {
  const required = ['area', 'waste', 'perim', 'winPerim', 'p_labor'];
  const issues = [];
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const v = parseFloat(el.value);
    if (isNaN(v) || v < 0) { el.classList.add('input-error'); issues.push(id); }
    else { el.classList.remove('input-error'); }
  });
  return issues;
}
