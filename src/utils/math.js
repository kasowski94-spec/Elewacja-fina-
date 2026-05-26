export function calcU(thickM, lambda, wallU0) {
  const R_si = 0.13, R_se = 0.04;
  const R_wall = wallU0 > 0 ? (1 / wallU0) - R_si - R_se : 0;
  const R_ins = lambda > 0 ? thickM / lambda : 0;
  return 1 / (R_si + R_wall + R_ins + R_se);
}
export function uColor(u) {
  if (u <= 0.20) return '#3ecf8e';
  if (u <= 0.30) return '#f5a623';
  return '#f06a6a';
}
export function uPct(u) {
  return Math.max(4, Math.min(100, (1 - u / 1.5) * 100));
}
export function isRec(t) {
  return t === 15 || t === 20;
}
