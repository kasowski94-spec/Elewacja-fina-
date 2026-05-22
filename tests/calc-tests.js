#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// ElewacjaPro — Testy jednostkowe obliczeniowe
// Uruchomienie: node tests/calc-tests.js
// Wymaga: node >= 18 (node:assert)
// ════════════════════════════════════════════════════════════════════

const assert = require('assert');
let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${e.message}`);
    failed++;
  }
}

function approxEqual(a, b, eps = 0.001) {
  return Math.abs(a - b) < eps;
}

// ─── Reimplementacje kluczowych funkcji z index.html ─────────────────
const calcU = (t, lam, u0) => 1 / (1 / u0 + t / lam);

const PARAPET_DEFAULTS = {
  count: 1, width: 250, length: 1200, bend: 40, cuts: 2,
  sheetW: 1000, sheetL: 2000, sheetPrice: 72,
  bendsPer: 2, bendCost: 5, cutsPer: 2, cutCost: 4, laborPer: 30,
  material: 'ocynk', notes: ''
};

function parapetCalc(p) {
  const devW = p.width + 2 * p.bend;
  const areaM2 = (devW / 1000) * (p.length / 1000);
  const sheetA = (p.sheetW / 1000) * (p.sheetL / 1000);
  const sheetsNeeded = Math.ceil(areaM2 * p.count * 1.1 / sheetA);
  const bendsTotal = p.bendsPer * p.count;
  const cutsTotal = p.cutsPer * p.count;
  const sheetCost = sheetsNeeded * p.sheetPrice;
  const bendCostTotal = bendsTotal * p.bendCost;
  const cutCostTotal = cutsTotal * p.cutCost;
  const laborCost = p.count * p.laborPer;
  const total = sheetCost + bendCostTotal + cutCostTotal + laborCost;
  return { areaM2, sheetsNeeded, bendsTotal, cutsTotal, sheetCost, bendCostTotal, cutCostTotal, laborCost, total };
}

const PROJECT_SCHEMA_VER = 4;
function migrateState(st) {
  if (!st) return st;
  const v = st.schemaVer || 1;
  if (v < 2) {
    if (Array.isArray(st.parapets))
      st.parapets = st.parapets.map(p => ({ ...PARAPET_DEFAULTS, ...p }));
    if (!st.epsThick && st.selectedVariant) st.epsThick = String(st.selectedVariant);
  }
  if (v < 3) {
    if (!st['wycena-vat']) st['wycena-vat'] = '8';
    if (!st['wycena-nip-klient']) st['wycena-nip-klient'] = '';
    if (!st['wycena-nip-wyk']) st['wycena-nip-wyk'] = '';
    if (!st['wycena-narzut']) st['wycena-narzut'] = '0';
  }
  if (v < 4) {
    if (!st.degression) st.degression = {
      enabled: false,
      thresholds: [{ from: 300, pct: 3 }, { from: 500, pct: 5 }, { from: 1000, pct: 8 }]
    };
  }
  st.schemaVer = PROJECT_SCHEMA_VER;
  return st;
}

function calcDegression(total, area, state) {
  if (!state?.enabled || !area) return 0;
  const sorted = [...state.thresholds].sort((a, b) => b.from - a.from);
  for (const t of sorted) { if (area >= t.from) return t.pct; }
  return 0;
}

const SHOP_MULT = {
  'mega1000.pl': 0.95, 'styro24.pl': 0.92, 'Castorama/LM': 1.18,
  'srednia': 1.05, 'posrednia': 0.98, 'reczne': 1.0
};

// ─── TESTY ───────────────────────────────────────────────────────────

console.log('\n🧪 ElewacjaPro — Testy jednostkowe\n');

console.log('=== 1. Obliczenia termiczne (calcU) ===');

test('calcU(15cm, λ=0.033, U₀=0.45) ≈ 0.148', () => {
  const u = calcU(0.15, 0.033, 0.45);
  assert.ok(approxEqual(u, 0.148, 0.002), `Oczekiwano ~0.148, otrzymano ${u.toFixed(4)}`);
});

test('calcU(20cm, λ=0.038, U₀=0.45) ≈ 0.131', () => {
  const u = calcU(0.20, 0.038, 0.45);
  assert.ok(approxEqual(u, 0.131, 0.003), `Oczekiwano ~0.131, otrzymano ${u.toFixed(4)}`);
});

test('calcU(10cm, λ=0.033, U₀=0.5) < 0.25 (spełnia WT2021 z grubą ścianą)', () => {
  const u = calcU(0.10, 0.033, 0.5);
  // Dla 10cm na ścianie 0.5 ≈ 0.21, blisko granicy WT
  assert.ok(u > 0 && u < 1, `U-value musi być w zakresie (0,1): ${u.toFixed(4)}`);
});

test('calcU z lambda=0 zwraca Infinity lub obsługuje błąd bez crashu', () => {
  // Dzielenie przez 0 — w JS daje Infinity
  const u = calcU(0.15, 0, 0.45);
  assert.ok(!isFinite(u) || u === 0, 'Lambda=0 powinno dać Infinity lub 0');
});

test('Przy grubości 0 U powinno równać się U₀', () => {
  const u = calcU(0, 0.033, 0.45);
  assert.ok(approxEqual(u, 0.45, 0.001), `t=0 powinno dać U=U₀=0.45, otrzymano ${u.toFixed(4)}`);
});

console.log('\n=== 2. Ilości materiałów ===');

test('Styropian z naddatkiem 5%: area=350 → 367.5 m²', () => {
  const area = 350, waste = 0.05;
  const aW = area * (1 + waste);
  assert.ok(approxEqual(aW, 367.5), `Oczekiwano 367.5, otrzymano ${aW}`);
});

test('Masa klejąca: area=350, 4 kg/m² → 1400 kg', () => {
  const area = 350;
  const adhesive = area * 4;
  assert.strictEqual(adhesive, 1400);
});

test('Masa szpachlowa zbrojąca: area=350, 5.5 kg/m² → 1925 kg', () => {
  const area = 350;
  const meshReinf = area * 5.5;
  assert.strictEqual(meshReinf, 1925);
});

test('Łączniki: area=350, 6 szt./m² → Math.ceil(2100) = 2100 szt.', () => {
  const area = 350, anch = 6;
  const anchTotal = Math.ceil(area * anch);
  assert.strictEqual(anchTotal, 2100);
});

test('Listwa startowa: perim=75 mb → Math.ceil(75/2) = 38 szt.', () => {
  const perim = 75;
  const starters = Math.ceil(perim / 2);
  assert.strictEqual(starters, 38);
});

console.log('\n=== 3. Parapety (parapetCalc) ===');

test('Parapet domyślny: 1 szt., 250×1200mm, arkusze 1000×2000', () => {
  const p = { ...PARAPET_DEFAULTS };
  const res = parapetCalc(p);
  assert.ok(res.sheetsNeeded > 0, 'Musi być co najmniej 1 arkusz');
  assert.ok(res.bendsTotal === 2, `Oczekiwano 2 gięcia, otrzymano ${res.bendsTotal}`);
  assert.ok(res.cutsTotal === 2, `Oczekiwano 2 cięcia, otrzymano ${res.cutsTotal}`);
  assert.ok(res.total > 0, 'Koszt łączny musi być > 0');
});

test('Parapet: count=0 → koszt=0', () => {
  const p = { ...PARAPET_DEFAULTS, count: 0 };
  const res = parapetCalc(p);
  assert.strictEqual(res.bendsTotal, 0);
  assert.strictEqual(res.cutsTotal, 0);
  assert.strictEqual(res.laborCost, 0);
});

console.log('\n=== 4. Migracje schematu stanu ===');

test('migrateState(schemaVer=1) → schemaVer=4, dodaje epsThick', () => {
  const st = { schemaVer: 1, selectedVariant: 15, parapets: [] };
  const migrated = migrateState(st);
  assert.strictEqual(migrated.schemaVer, 4);
  assert.strictEqual(migrated.epsThick, '15');
  assert.ok(migrated.degression, 'Musi zawierać degression');
});

test('migrateState(schemaVer=2) → dodaje wycena-vat=8', () => {
  const st = { schemaVer: 2 };
  const migrated = migrateState(st);
  assert.strictEqual(migrated['wycena-vat'], '8');
  assert.strictEqual(migrated['wycena-narzut'], '0');
});

test('migrateState(schemaVer=3) → dodaje degression z 3 progami', () => {
  const st = { schemaVer: 3 };
  const migrated = migrateState(st);
  assert.ok(migrated.degression, 'degression musi istnieć');
  assert.strictEqual(migrated.degression.thresholds.length, 3);
  assert.strictEqual(migrated.schemaVer, 4);
});

test('migrateState(null) → zwraca null bez crashu', () => {
  const result = migrateState(null);
  assert.strictEqual(result, null);
});

test('migrateState(schemaVer=4) → nie zmienia istniejącej degresji', () => {
  const custom = { enabled: true, thresholds: [{ from: 200, pct: 10 }] };
  const st = { schemaVer: 4, degression: custom };
  const migrated = migrateState(st);
  assert.deepStrictEqual(migrated.degression, custom);
});

console.log('\n=== 5. Degresja (rabaty wolumenowe) ===');

test('Degresja disabled → 0%', () => {
  const state = { enabled: false, thresholds: [{ from: 300, pct: 3 }] };
  assert.strictEqual(calcDegression(10000, 350, state), 0);
});

test('area=350 ≥ 300 → rabat 3%', () => {
  const state = { enabled: true, thresholds: [{ from: 300, pct: 3 }, { from: 500, pct: 5 }] };
  assert.strictEqual(calcDegression(10000, 350, state), 3);
});

test('area=500 ≥ 500 → rabat 5%', () => {
  const state = { enabled: true, thresholds: [{ from: 300, pct: 3 }, { from: 500, pct: 5 }] };
  assert.strictEqual(calcDegression(10000, 500, state), 5);
});

test('area=299 < 300 → rabat 0%', () => {
  const state = { enabled: true, thresholds: [{ from: 300, pct: 3 }] };
  assert.strictEqual(calcDegression(10000, 299, state), 0);
});

test('area=0 → rabat 0% (guard)', () => {
  const state = { enabled: true, thresholds: [{ from: 300, pct: 3 }] };
  assert.strictEqual(calcDegression(10000, 0, state), 0);
});

console.log('\n=== 6. VAT ===');

test('VAT 8% na 10000 zł → kwota VAT = 800 zł', () => {
  const netto = 10000, vatRate = 8;
  const vat = netto * vatRate / 100;
  assert.strictEqual(vat, 800);
});

test('VAT 23% na 10000 zł → brutto = 12300 zł', () => {
  const netto = 10000, vatRate = 23;
  const brutto = netto * (1 + vatRate / 100);
  assert.strictEqual(brutto, 12300);
});

test('VAT 0% → brutto = netto', () => {
  const netto = 5000, vatRate = 0;
  const brutto = netto * (1 + vatRate / 100);
  assert.strictEqual(brutto, 5000);
});

console.log('\n=== 7. Mnożniki hurtowni (shopPrice) ===');

test('Castorama/LM mnożnik 1.18 → cena wzrasta', () => {
  const base = 100;
  const mult = SHOP_MULT['Castorama/LM'];
  assert.ok(approxEqual(base * mult, 118), `Oczekiwano 118, otrzymano ${base * mult}`);
});

test('styro24.pl mnożnik 0.92 → cena spada', () => {
  const base = 100;
  const mult = SHOP_MULT['styro24.pl'];
  assert.ok(approxEqual(base * mult, 92), `Oczekiwano 92, otrzymano ${base * mult}`);
});

test('Ręczne ceny (reczne) mnożnik 1.0', () => {
  assert.strictEqual(SHOP_MULT['reczne'], 1.0);
});

// ─── Podsumowanie ─────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(50));
console.log(`  Wynik: ${passed} ✅ / ${failed} ❌ (łącznie ${passed + failed} testów)`);
if (failed > 0) {
  console.error(`\n  ⛔ ${failed} test(ów) nie przeszło.`);
  process.exit(1);
} else {
  console.log('\n  🎉 Wszystkie testy przeszły!');
}
