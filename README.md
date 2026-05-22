# ElewacjaPro — Kalkulator ETICS

Profesjonalny kalkulator materiałów i kosztów dla systemów ociepleń elewacji (ETICS). PWA, działa offline, eksport PDF.

## Funkcje

- 🧱 Kalkulacja materiałów: styropian, kleje, siatka, tynk, łączniki, parapety, rusztowanie
- 📊 Porównanie 11 wariantów grubości EPS (5–30 cm) z wartościami U
- 📄 Eksport PDF: wycena dla klienta, wewnętrzna (z narzutem), zestawienie materiałów
- 📦 Lista zakupów z paletyzacją
- 💰 Obsługa VAT 8%/23%, NIP zamawiającego i wykonawcy
- 📚 Biblioteka 123 materiałów + 40 pozycji robocizny z cenami low/avg/high
- 💾 Projekty zapisywane lokalnie (IndexedDB + localStorage)
- 🌙 Dark/Light mode z auto-detekcją systemu
- 📱 PWA — instalacja jako apka, działa offline

## Uruchomienie lokalne

Brak buildu — otwórz `index.html` bezpośrednio lub przez serwer:

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# Następnie otwórz: http://localhost:8080
```

> Service Worker wymaga HTTPS lub `localhost`.

## Testy jednostkowe

```bash
node tests/calc-tests.js
```

Oczekiwany wynik: `28 ✅ / 0 ❌`

## Deploy na GitHub Pages

1. Wypchnij wszystkie pliki do gałęzi `main`
2. Settings → Pages → Source: Deploy from a branch → `main` / `(root)`
3. URL: `https://[username].github.io/[repo-name]/`

## APK przez PWABuilder

1. Uruchom aplikację na GitHub Pages (HTTPS)
2. Wejdź na [pwabuilder.com](https://pwabuilder.com)
3. Wklej URL → "Start" → zakładka "Android" → "APK"
4. Pobierz i podpisz APK (potrzebny Java/keytool)

## Struktura plików

```
index.html          Cała aplikacja (HTML + CSS + JS inline, ~234KB)
sw.js               Service Worker v6 (cache-first)
manifest.json       PWA manifest
pdf-font.js         DejaVu TTF base64 (polskie znaki PDF)
elewacja-*.png      Ikony (72–512px + maskable)
elewacja-screen-*.png  Screenshots instalacji
tests/              Testy jednostkowe i checklist manualny
RESEARCH.md         Audyt branżowy (ceny, funkcje, prawo)
DESIGN.md           Design system (kolory, typografia, spacing)
HANDOFF.md          Dokumentacja techniczna dla developera
CHANGELOG.md        Historia zmian
AUDIT-REPORT.md     Raport audytu 2026-05-21
```

## Stan danych

Schemat projektów wersja 4. Migracje obsługują projekty v1–v3.
Dane przechowywane w IndexedDB (głównie) + localStorage (fallback).

## Licencja

Prywatny projekt. Wszelkie prawa zastrzeżone.
