# HANDOFF.md — ElewacjaPro Dokumentacja Techniczna
> Wersja: 2026-05-21 | Audyt v1.0

---

## Architektura

### Typ projektu
Single-page PWA, vanilla JavaScript (ES6+), brak frameworków, brak buildu.

### Struktura plików
```
index.html        234KB  — Cała aplikacja (HTML + inline CSS + inline JS)
sw.js               2KB  — Service Worker v6 (cache-first strategy)
manifest.json       3KB  — PWA manifest
pdf-font.js        75KB  — DejaVu TTF base64 (polskie znaki w PDF)
elewacja-*.png          — Ikony (72–512px + maskable)
elewacja-screen-*.png   — Screenshots dla install prompt
RESEARCH.md             — Wyniki audytu branżowego
DESIGN.md               — Design system z tokenami
HANDOFF.md              — Ten plik
CHANGELOG.md            — Historia zmian
AUDIT-REPORT.md         — Raport audytu
tests/calc-tests.js     — Testy jednostkowe (node:assert)
tests/manual-test.md    — Checklist testów manualnych
```

### Sekcje index.html
Plik jest monolit-em 4100+ linii. Wyraźne sekcje-banery komentarzami:
1. `<script>` blok 1 (linie ~1–200): BIBLIOTEKA MATERIAŁÓW I ROBOCIZNY
2. `<style>` (linie ~200–750): Cały CSS (zmienne, layout, responsywność)
3. `<script>` blok 2 (linie ~1320–3700): Główna logika (calc, PDF, storage)
4. HTML body (linie ~650–): Struktura 11 zakładek + modals
5. `<script>` blok 3 (linie ~3750–): PWA, IndexedDB, SW, install prompt, swipe

---

## Stan aplikacji (State Schema)

### Wersja schematu: 4 (2026-05-21)
```javascript
const PROJECT_SCHEMA_VER = 4;
```

### Struktura projektu:
```javascript
projects = {
  'proj_1234567890': {
    name: 'Nazwa projektu',
    data: { /* State object */ }
  }
}
```

### State object (schemaVer=4):
```javascript
{
  schemaVer: 4,
  
  // Parametry projektu
  area: 350,              // m² powierzchni elewacji
  waste: 5,               // % naddatek na odpady
  epsType: '0.033',       // λ (lambda) izolacji
  epsThick: '15',         // grubość EPS w cm (string)
  selectedVariant: 15,    // aktualnie wybrany wariant (number)
  mainShop: 'reczne',     // aktywna hurtownia
  
  // Ściana
  wallMat: 'cegla_pelna', // materiał ściany
  wallThick: 37,          // cm
  wallU0: 0.45,           // W/m²K bazowa transmitancja
  
  // Ceny (40+ pól, prefix p_)
  p_eps: 1.30,            // zł/m²/cm
  p_labor: 80,            // zł/m² robocizna
  // ... wszystkie PRICE_DEFS.id
  
  // Dane wyceny
  'wycena-klient': '',
  'wycena-adres': '',
  'wycena-data': '',
  'wycena-wyk': '',
  'wycena-nr': '',
  'wycena-termin': '',
  'wycena-notes': '',
  
  // NEW (schemaVer 3): VAT i NIP
  'wycena-vat': '8',             // stawka VAT: '0','8','23'
  'wycena-nip-klient': '',       // NIP zamawiającego
  'wycena-nip-wyk': '',          // NIP wykonawcy
  'wycena-narzut': '0',          // narzut wykonawcy w %
  
  // NEW (schemaVer 4): Degresja
  degression: {
    enabled: false,
    thresholds: [
      {from: 300, pct: 3},
      {from: 500, pct: 5},
      {from: 1000, pct: 8}
    ]
  },
  
  // Złożone obiekty
  parapets: [ /* array obiektów parapetu */ ],
  foamItems: [{type: 'niskoprezna', count: 4}],
  customItems: { materialy: [], parapety: [], ... },
  wycenaManualEdits: { 'eps|Styropian...': {qty, price, shop} },
  extras: { skucie: {on: false, qty: 350, p: 12}, ... },
  ruszEnabled: true,
  
  // Rusztowanie
  ruszW: 6,   // tygodnie dzierżawy
  ruszP: 8,   // zł/m²/tydzień
  ruszM: 12,  // zł/m² montaż
  ruszS: 4,   // zł/m² siatka
}
```

### Migracje:
```javascript
migrateState(st) — obsługuje schemaVer 1→4
// v1→v2: uzupełnienie pól parapetów
// v2→v3: dodanie vatRate, NIP, narzut
// v3→v4: dodanie degression
```

---

## Persistence

### IndexedDB (primary):
- DB: `elewacjapro` (version 1)
- Store `projects`: {id, name, data}
- Store `settings`: {key, value}

### localStorage (fallback + dodatkowe):
- `elewacjapro_v4` — backup projektów (JSON)
- `elewacjapro_fav` — ulubione elementy biblioteki
- `elewacjapro_apikey` — klucz API Anthropic (opcjonalny)
- `pwa-dismissed` — odrzucenie banera instalacji
- `onboarding-done` — odrzucenie onboardingu
- `elewacja-theme` — motyw: 'dark' | 'light' | 'auto'

---

## Kluczowe funkcje

### Obliczenia:
```javascript
calcU(t_m, lambda, u0)  // U-value izolowanej ściany
calc()                   // główna kalkulacja (wywoływana via debCalc())
buildWycenaRows()        // buduje wycenaRows[] — serce kosztorysu
shopPrice(baseId)        // cena z mnożnikiem hurtowni
parapetCalc(p)           // arkusze/gięcia/cięcia dla parapetu
calcDegression(total, area, state) // % rabatu wolumenowego
```

### PDF:
```javascript
exportPDF(mode)
// mode: 'full' = wewnętrzny (z narzutem)
// mode: 'klient' = dla klienta (bez narzutu)
// mode: 'materialy' = tylko sekcje A-H

exportOrderPDF(mode)
// mode: 'order' = zamówienie z cenami
// mode: 'inquiry' = zapytanie bez cen
```

### State:
```javascript
collectState()           // zbiera stan do JSON
migrateState(st)         // migruje starsze wersje
applyState(st)           // aplikuje JSON do formularzy
saveProjects()           // zapis IndexedDB + localStorage
loadProject(id)          // wczytuje projekt
```

### UI:
```javascript
swTab(name)              // przełącza zakładkę główną
activateSub(tab, subId)  // przełącza podzakładkę
showToast(msg, dur)      // toast notification
toggleTheme()            // dark/light mode toggle
showOnboarding()         // onboarding overlay
```

---

## Jak rozszerzać MATERIAL_LIBRARY

Każdy wpis ma strukturę:
```javascript
{
  id: 'unikalne_id_snake_case',   // WYMAGANE — klucz do PRICE_LIBRARY_MAP
  cat: 'kategoria',               // string z MAT_CATEGORIES
  name: 'Pełna nazwa materiału',  // wyświetlana w UI
  unit: 'm²',                     // m², mb, szt, kg, l, worek, m3, ark
  low: 24,                        // najniższa cena rynkowa
  avg: 27,                        // średnia cena rynkowa
  high: 30,                       // najwyższa cena rynkowa
  lambda: 0.038,                  // opcjonalne — dla izolacji
  note: 'komentarz'               // opcjonalny opis
}
```

Kategorie materiałów: `MAT_CATEGORIES` (styropian, kleje, siatki, tynki, grunty, lacze, zaslepki, profile, tasmy, pianki, parapety, blacha)

## Jak rozszerzać LABOR_LIBRARY

Identyczna struktura, bez `lambda`. Kategorie: `LABOR_CATEGORIES` (przygotowanie, ocieplenie, wykonczenie, kompleksowe, detale, rusztowanie)

## Jak rozszerzać PRICE_DEFS

```javascript
{
  id: 'p_nowy_material',     // musi mieć prefix p_
  lbl: 'Etykieta w UI',
  def: 0.0,                  // wartość domyślna
  hint: 'wskazówka użytkownika'
}
```

Następnie dodaj do:
1. `PRICE_LIBRARY_MAP` — powiązanie z MATERIAL_LIBRARY
2. `buildWycenaRows()` — użycie w wierszu wyceny
3. `calc()` — użycie w kalkulacji

---

## Service Worker

Cache v6 (`elewacja-v6`):
- CORE: `./, index.html, manifest.json, pdf-font.js`
- FONTS: CDN (Google Fonts, cdnjs, gstatic)
- Strategia: cache-first dla CORE, network-first dla fontów
- Fallback offline: index.html dla nawigacji HTML

Aktualizacja: zmień `CACHE = 'elewacja-v7'` (i podobnie FONTS).

---

## Deployment

### GitHub Pages:
1. Wszystkie pliki w katalogu głównym repozytorium
2. Settings → Pages → Source: main / (root)
3. Dostęp: `https://[username].github.io/[repo]/`
4. HTTPS automatyczny (wymagany dla Service Worker)

### APK przez PWABuilder:
1. Otwórz `https://pwabuilder.com`
2. Wklej URL GitHub Pages
3. Wybierz "Android" → "APK"
4. Pobierz i podpisz APK

---

## Znane ograniczenia

- Brak undo/redo (nie zaimplementowane — kompleksowe)
- AI price comparison wymaga klucza Anthropic API (opcjonalne)
- Tynki silikonowe i kolorowe: szeroki przedział cenowy (170–480 zł/worek) — użytkownik musi podać własną cenę
- PDF generowany wyłącznie po stronie klienta — brak serwera
