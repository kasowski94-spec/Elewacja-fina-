# CHANGELOG.md — ElewacjaPro
> Format: Keep a Changelog | Semantic Versioning

---

## [2.0.0] — 2026-05-21 — Kompleksowy audyt + redesign

### Fixed
- **CRITICAL**: Błędna ścieżka ikony `icons/icon-192.png` → `elewacja-icon-192.png` (katalog `icons/` nie istnieje)
- **CRITICAL**: Błędna ścieżka `icons/icon-96.png` → `elewacja-icon-96.png` w install bannerze
- **CRITICAL**: `pdf-font.js` nie był w SW CORE — generowanie PDF offline nie działało (brak polskiej czcionki)
- **UX**: Brak animacji przy przełączaniu zakładek — dodano `tabFadeIn`
- **UX**: Brak trybu jasnego — dodano light mode z auto-detekcją

### Added
- **NEW**: Dark/Light mode z przełącznikiem 🌙/☀️ w topbarze, zapamiętany w localStorage
- **NEW**: Wybór stawki VAT (0% / 8% / 23%) w zakładce Wycena z informacją kiedy stosować
- **NEW**: Pola NIP zamawiającego i wykonawcy (wyświetlane w PDF)
- **NEW**: Pole narzut wykonawcy (%) — ukryte w PDF "dla klienta", widoczne w "wewnętrznym"
- **NEW**: Tryb PDF "dla klienta" (`exportPDF('klient')`) — bez narzutu, tytuł "OFERTA CENOWA"
- **NEW**: Tryb PDF "wewnętrzny" (`exportPDF('full')`) — z narzutem w podsumowaniu
- **NEW**: Degresja rabatowa (rabaty wolumenowe) — konfigurowalny system progów (schemaVer 4)
- **NEW**: `calcDegression()` i `getActiveDegressionThreshold()` — funkcje degresji
- **NEW**: Logo SVG w topbarze (zastąpiło tekstowe "ElewacjaPro")
- **NEW**: Theme toggle `#theme-toggle` w topbarze
- **NEW**: Onboarding overlay — 3 kroki, pojawia się tylko raz (localStorage `onboarding-done`)
- **NEW**: CSS Light mode variables (`:root.light-mode`)
- **NEW**: `prefers-reduced-motion` — wszystkie animacje wyłączane gdy użytkownik tego wymaga
- **NEW**: Mikroanimacje: `tabFadeIn`, `slideInRight`, `toastIn/Out`, `pulseAcc`, `skeletonShimmer`
- **NEW**: Toast nowy styl `.pwa-toast-inner` (success/error variants)
- **NEW**: Empty state CSS `.empty-state`
- **NEW**: Skeleton loader CSS `.skeleton`
- **NEW**: Spacing tokens: `--sp1` do `--sp6`
- **NEW**: Shadow tokens: `--shadow-sm/md/lg`
- **NEW**: Dodatkowy radius token `--r4: 28px`
- **NEW**: Dwa nowe kafelki w live barze: VAT i Cena/m²
- **NEW**: Bento live bar — subtelne ulepszenia stylów kafelków
- **NEW**: Testy jednostkowe `tests/calc-tests.js` — 28 testów (node:assert)
- **NEW**: Manual test checklist `tests/manual-test.md` — 30 testów
- **NEW**: `RESEARCH.md` — wyniki audytu branżowego (ceny, trendy, funkcje, prawo)
- **NEW**: `DESIGN.md` — design system z tokenami CSS
- **NEW**: `HANDOFF.md` — dokumentacja techniczna
- **NEW**: `CHANGELOG.md` — ten plik

### Changed
- **SW**: Bump wersji `elewacja-v5` → `elewacja-v6` (wymusza odświeżenie cache)
- **SW**: Dodano `./pdf-font.js` do CORE cache
- **Schema**: PROJECT_SCHEMA_VER `2` → `4` (dwa nowe kroki migracji)
- **migrateState()**: Rozszerzono o kroki v2→v3 (VAT/NIP) i v3→v4 (degresja)
- **collectState()**: Dodano pola `wycena-vat`, `wycena-nip-klient`, `wycena-nip-wyk`, `wycena-narzut`, `degression`
- **updateWycenaSummary()**: Dynamiczny VAT z wyboru, narzut, degresja, nowe kafelki live bar
- **exportPDF()**: Obsługa mode='klient', dynamiczny VAT, NIP w bloku danych, narzut w podsumowaniu
- **Topbar logo**: Tekst "ElewacjaPro" zastąpiony przez SVG logo
- **Live bar**: Rozszerzony o 2 dodatkowe kafelki (VAT, Cena/m²)
- **PDF buttons**: Nowy układ z podziałem "dla klienta" / "wewnętrzny" / "materiały"
- **README.md**: Zaktualizowany (był prawie pusty — 16 bajtów)

### Schema Migration
```
v1 → v2: uzupełnienie PARAPET_DEFAULTS, epsThick z selectedVariant
v2 → v3: wycena-vat='8', wycena-nip-klient='', wycena-nip-wyk='', wycena-narzut='0'
v3 → v4: degression={enabled:false, thresholds:[{from:300,pct:3},...]}}
```
Projekty ze schemaVer 1, 2, 3 ładują się poprawnie.

---

## [1.0.0] — 2026-05-18 — Initial release

### Added
- Kalkulator ETICS z 11 zakładkami
- Biblioteka 123 materiałów + 40 pozycji robocizny
- Wycena sekcjonowana A–L z PDF export
- Obsługa parapetów, łączników, rusztowania
- Zarządzanie projektami (IndexedDB + localStorage)
- PWA (Service Worker v5, manifest, install prompt)
- Porównanie cen między hurtowniami
- AI price updates (Anthropic API, opcjonalne)
- Eksport CSV, JSON
