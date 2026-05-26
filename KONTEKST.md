# Kontekst pracy — ElewacjaPro

Dokument streszcza dotychczasowy rozwój aplikacji oraz wprowadzone zmiany. Ma służyć jako
punkt odniesienia dla dalszej pracy — zachowuje sens i spójność decyzji bez powtarzania
pełnego kodu. Wszystkie prace prowadzone są na gałęzi `claude/android-app-setup-files-G9h7Z`.

## Czym jest aplikacja

ElewacjaPro to PWA (z opcjonalnym buildem Android przez Capacitor) do kosztorysowania ociepleń
elewacji w systemie ETICS. Napisana w natywnych modułach ES (bez frameworka i bez kroku
budowania dla wersji web). Stan globalny w `src/store/state.js`; moduły funkcji rejestrują się
na `window` (brak zależności cyklicznych). Persystencja: IndexedDB + localStorage. Tryb offline:
Service Worker (`sw.js`). PDF: jsPDF 4.2.1 + osadzona czcionka (`pdf-font.js`).

Kluczowe założenia obliczeń:
- `priceMode`: `netto` (domyślnie) lub `brutto`.
- VAT: materiały 8% (`VAT_MAT = 1.08`), robocizna 23% (`VAT_LABOR = 1.23`).
- `buildWycenaRows()` buduje 12 sekcji kosztorysu; `mkRow()` nakłada VAT wg trybu.
- Objętość EPS: `area × (1+odpad) × grubość_cm / 100` [m³].

## Historia zmian (chronologicznie)

### 1. Naprawy netto/brutto i PDF (wcześniejsze sesje)
- Poprawiono błąd kopiowania obiektów w `addLp` psujący przełącznik netto/brutto.
- Generowanie PDF przeniesione na jsPDF 4.2.1.

### 2. Edycja zużycia materiałów + EPS w m³
- Dodane edytowalne wskaźniki: `adhesiveRate` (masa klejąca, domyślnie 4,0 kg/m²) oraz
  `meshRate` (masa zbrojąca + siatka, domyślnie 5,5 kg/m²).
- Sekcja kleju (`kleje`) liczona z tych wskaźników zamiast wartości zaszytych w kodzie.
- Dodany wskaźnik objętości EPS w m³ (badge przy podsumowaniu sekcji + opis w wierszu).

### 3. Audyt techniczny / sprzątanie kodu
- Usunięto martwy kod: `SUBTABS_MAP` (duplikat z `router.js`), lokalną kopię `WALL_LAMBDA`,
  `foamItemsEl`, nieużywany `frag`.
- Wydzielono wspólne stałe do `src/data/constants.js`: `VAT_MAT`, `VAT_LABOR`,
  `MAT_SECTIONS`, `LABOR_SECTIONS`, `RUSZ_OVERHANG`, `WALL_LAMBDA`.
- Naprawiono import `COMMON_ITEMS` w `custom.js` (był błędny `typeof`, zawsze fałszywy w ESM).
- Dodano helper `escAttr()` w `format.js` i zastosowano go przy nazwach pozycji (ochrona XSS).
- Service Worker bumpnięty do v11: do precache dodano `pdf-font.js` (wcześniej brak →
  PDF offline używał fallbacku Helvetica).

### 4. Krytyczna ocena (weryfikacja zgłoszeń agentów)
Część zgłoszeń okazała się **fałszywymi alarmami** i NIE wymaga zmian:
- Konwersja VAT ręcznych edycji wg `savedMode` — poprawna i dwukierunkowa.
- Układ netto→VAT→brutto w panelu klienta — standardowa faktura.
- VAT 23% w PDF zamówienia do dostawcy — poprawny (inny kontekst niż usługa budowlana 8%).
- Indeksy `onclick` w `custom.js` — niwelowane pełnym re-renderem `innerHTML`.

### 5. Optymalizacje wydajności (O1–O7)
- **O1:** `defer` na `jspdf.min.js` i `pdf-font.js` — 485 KB nie blokuje pierwszego renderu.
- **O2:** debounce 280 ms na wyszukiwarce biblioteki (`libSearch`).
- **O3:** `LABOR_IDS` (Set) + `FAV_SET` w `library.js` — render z O(n²) do O(1) na pozycję.
- **O4:** `row._gi` zamiast `newRows.indexOf(row)` — eliminuje ~600 iteracji na przebudowę.
- **O5:** debounce `calc()` z 160 ms na 300 ms (~45% mniej przeliczeń przy pisaniu).
- **O6:** cache wysokości topbar/subbar w scroll spy (`invalidateScrollCache()`) — bez reflow.
- **O7:** `structuredClone()` zamiast `JSON.parse(JSON.stringify())` w autosave.

### 6. Pełny audyt + naprawy (B1–B4, R1–R3)
Błędy poprawności:
- **B1 (WYSOKIE):** `collectState()` nie zapisywał `adhesiveRate`, `meshRate`, `clientMargin`,
  `priceMode` — po wczytaniu projektu wracały do domyślnych. Dodano zapis i przywracanie w
  `collectState()` / `applyState()`.
- **B2 (WYSOKIE):** PDF pełnego kosztorysu liczył płaskie 8% VAT od całości (z robocizną),
  zaniżając brutto. Teraz rozdziela: materiały 8% + robocizna 23% (zgodnie z ekranem).
- **B3 (ŚREDNIE):** „Zysk" liczony od brutto w trybie brutto dawał różne wartości zależnie od
  trybu. Teraz zawsze od netto.
- **B4 (NISKIE):** zaszyte `1.18` zastąpione stałą `RUSZ_OVERHANG`.

Odporność:
- **R1:** Service Worker (v12) precache'uje wszystkie 23 moduły ES — niezawodny start offline.
- **R2:** autoSave na ścieżce `calc()` debounce'owany (1 s) — koniec pełnego zapisu
  IndexedDB+localStorage przy każdym przeliczeniu.
- **R3:** `escAttr()` na polach liczbowych/jednostkach w `custom.js` (spójność/defensywa).

### 7. Dokumentacja
- Utworzono pełny `README.md` (konkretny dla ElewacjaPro, po polsku): kontekst, funkcje,
  dane techniczne, instalacja (web + Android), przykłady, struktura, plan rozwoju, licencja
  (`[Wpisz licencję]` — brak pliku `LICENSE`).

## Znane sprawy otwarte / do uwagi
- `setSelectedVariant` jest używane w `applyState()` (gałąź `selectedVariant`), ale nie jest
  importowane; gałąź jest jednak zabezpieczona warunkiem `window.__AppData` (nigdy nie
  wykonywana) — latentne, poza zakresem dotychczasowych prac.
- Brak backendu / synchronizacji w chmurze (dane lokalne na urządzeniu).
- Build iOS nieskonfigurowany.
- Ceny hurtowni wymagają ręcznej aktualizacji.
- Brak pliku `LICENSE` — do uzupełnienia przed publikacją.

## Decyzje produktowe (potwierdzone z użytkownikiem)
- Zysk wykonawcy liczony **zawsze od netto** (VAT to przelew do US, nie zysk).
- Zakres napraw audytowych: błędy poprawności **oraz** usprawnienia odporności.
- README: dokument **konkretny** dla ElewacjaPro, w języku **polskim**.
