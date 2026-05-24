// ════════════ OBLICZENIA FIZYCZNE ════════════

/** Współczynnik U całej przegrody: 1/(1/u0 + t/lam) */
export const calcU = (t, lam, u0) => 1 / (1 / u0 + t / lam);

/** Kolor wskaźnika U */
export const uColor = u =>
  u <= 0.20 ? '#3ecf8e' : u <= 0.25 ? '#7eefc4' : u <= 0.30 ? '#f5a623' : '#f06a6a';

/** Procent paska postępu U (skala 0.10–0.65) */
export const uPct = u => Math.max(5, Math.min(100, Math.round((0.65 - u) / 0.55 * 100)));

/** Czy grubość jest rekomendowana (15 lub 20 cm) */
export const isRec = t => t === 15 || t === 20;
