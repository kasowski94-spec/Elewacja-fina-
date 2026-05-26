export function fmt(n, d = 0) {
  if (n == null || isNaN(n)) return '0';
  return Number(n).toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function pln(n) {
  if (n == null || isNaN(n)) return '0 zł';
  return Number(n).toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' zł';
}
