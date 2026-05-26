// ════════════ FORMATOWANIE ════════════

export const fmt = (n, d = 0) =>
  (isFinite(n) ? n : 0).toLocaleString('pl-PL', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

export const pln = n => fmt(n, 0) + ' zł';

export const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
