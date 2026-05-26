# ElewacjaPro

> Profesjonalny kalkulator i kosztorys ociepleń elewacji w systemie ETICS — od zużycia materiału po gotową ofertę PDF.

![Typ](https://img.shields.io/badge/typ-PWA-blue) ![Tryb](https://img.shields.io/badge/offline-tak-success) ![Android](https://img.shields.io/badge/Android-Capacitor-green) ![Wersja](https://img.shields.io/badge/wersja-1.0.0-orange)

ElewacjaPro to aplikacja działająca w przeglądarce (Progressive Web App) oraz — opcjonalnie —
jako natywna aplikacja na Androida. Pozwala policzyć zużycie materiałów, robociznę i pełny
kosztorys docieplenia budynku, a następnie wygenerować profesjonalne dokumenty PDF
(kosztorys, ofertę dla klienta, zamówienie materiałów).

---

## Kontekst i zamysł aplikacji

### Jaki problem rozwiązuje

Ręczne wyceny ociepleń elewacji są czasochłonne i podatne na błędy. Wykonawca musi pamiętać
o dziesiątkach pozycji: zużyciu kleju i masy zbrojącej na m², liczbie kołków na m², odpadzie
przy cięciu blachy parapetów, kosztach rusztowania, a na końcu o poprawnym rozdzieleniu stawek
VAT (8% na materiały w usłudze budowlanej, 23% na robociznę). Pomyłka w jednym współczynniku
potrafi zaniżyć lub zawyżyć ofertę o kilka tysięcy złotych.

ElewacjaPro porządkuje cały ten proces w jednym narzędziu: od wprowadzenia powierzchni elewacji,
przez automatyczne przeliczenie materiałów i robocizny na podstawie bazy cenowej, aż po
wygenerowanie dokumentu gotowego do przekazania klientowi lub dostawcy.

### Stadium rozwoju

Aplikacja jest w **wersji produkcyjnej (v1.0.0)** i jest **aktywnie rozwijana oraz audytowana**.
Dotychczas zrealizowano kompletny silnik obliczeń ETICS, bibliotekę materiałów z cenami rynkowymi,
eksport PDF oraz tryb offline. Przeprowadzono również audyt poprawności (VAT, persystencja danych)
i optymalizacje wydajności. Aktualna wersja umożliwia pełne kosztorysowanie projektu bez dostępu
do internetu. W kolejnych iteracjach planuje się m.in. synchronizację projektów w chmurze i
konfigurację buildu iOS (szczegóły w sekcji [Plan rozwoju](#plan-rozwoju-i-znane-ograniczenia)).

### Grupa docelowa

- Wykonawcy elewacji i ekipy ociepleniowe.
- Kosztorysanci i drobne firmy budowlane.
- Doradcy techniczni przygotowujący oferty dla inwestorów indywidualnych.

---

## Funkcjonalności

- 🧮 **Kalkulator ETICS** — automatyczne przeliczenie EPS, kleju, masy zbrojącej z siatką, tynku,
  gruntu, farby i kołków. Edytowalne wskaźniki zużycia (kg/m²) oraz objętość styropianu w m³.
- 📚 **Biblioteka materiałów i robocizny** — ceny rynkowe w trzech wariantach (niska / średnia /
  wysoka), kategorie, wyszukiwarka oraz ulubione pozycje.
- 💰 **Tryb netto / brutto** — poprawne rozdzielenie stawek VAT (8% materiały, 23% robocizna)
  oraz konfigurowalny narzut i oferta dla klienta.
- 📄 **Eksport PDF** — kosztorys, oferta dla klienta i zamówienie materiałów; generowane przez
  jsPDF z osadzoną czcionką obsługującą polskie znaki (działa offline).
- 🪟 **Moduł parapetów** — obliczenie rozwinięcia blachy, liczby arkuszy z zapasem na odpad,
  gięć i cięć oraz kosztu montażu.
- 🏗️ **Rusztowanie** — koszt dzierżawy, montażu i demontażu oraz siatki ochronnej.
- 🌡️ **Współczynnik U przegrody** — dobór grubości EPS i porównanie wariantów izolacyjności.
- 🔧 **Własne pozycje** — dowolne materiały lub prace dodawane w każdej sekcji kosztorysu.
- 💾 **Zarządzanie projektami** — automatyczny zapis, wczytywanie oraz eksport/import projektu
  do pliku JSON.
- 📲 **PWA offline** — instalacja na telefonie, pełne działanie bez internetu dzięki Service Workerowi.
- 🤖 **Build na Androida** — natywny pakiet APK budowany przez Capacitor.
- 🏪 **Porównywarka cen hurtowni** — przegląd i zestawienie cen z różnych źródeł.

---

## Dane techniczne

### Wymagania systemowe

| Zastosowanie | Wymaganie |
|--------------|-----------|
| Uruchomienie web (użytkownik) | Nowoczesna przeglądarka z obsługą **ES modules** i **Service Worker** (Chrome, Edge, Firefox, Safari). |
| Serwowanie lokalne (dev) | Dowolny serwer HTTP (`npx serve`, `python3 -m http.server`) — moduły ES nie działają z `file://`. |
| Build Android | `Node.js 18+`, `Android Studio`, `JDK 17`. |
| Pamięć / dysk | Minimalne; aplikacja jest lekka, dane przechowywane lokalnie w przeglądarce. |

### Technologie i biblioteki

- **Język:** JavaScript (ES2020, natywne moduły ES — bez frameworka frontendowego).
- **Generowanie PDF:** `jspdf` `^4.2.1` + osadzona czcionka (`pdf-font.js`).
- **Przechowywanie danych:** `IndexedDB` (projekty) + `localStorage` (ustawienia, ulubione).
- **Tryb offline:** Service Worker (`sw.js`) z precache rdzenia aplikacji i modułów.
- **Bundler (tylko Android):** `esbuild` `0.20.2`.
- **Wrapper natywny:** `@capacitor/core`, `@capacitor/android`, `@capacitor/filesystem`,
  `@capacitor/share` (`^6`).

### Architektura

- **Frontend webowy** w stylu SPA z zakładkami (`Ustawienia`, `Materiały`, `Warianty`,
  `Wycena`, `Ceny`, `Biblioteka`), ładowany jako natywne moduły ES — **bez kroku budowania
  dla wersji web**.
- **Offline-first PWA** — Service Worker buforuje wszystkie zasoby, dzięki czemu aplikacja
  startuje i liczy bez sieci.
- **Opcjonalny natywny Android** — ten sam kod web pakowany do WebView przez Capacitor
  (skrypt `android-setup.sh` tworzy bundle IIFE w katalogu `www/`).
- **Stan globalny** trzymany w `src/store/state.js`; moduły funkcji rejestrują swoje
  funkcje na obiekcie `window`, co eliminuje zależności cykliczne między modułami.

### Konfiguracja

Aplikacja **nie wymaga** zmiennych środowiskowych do działania — konfiguracja jest deklaratywna
i znajduje się w plikach:

- `manifest.json` — metadane PWA (nazwa, ikony, kolory motywu, skróty).
- `capacitor.config.json` — `appId`, `appName`, katalog web (`www`) dla buildu Android.
- `sw.js` — wersja cache i lista zasobów do precache.

Opcjonalnie można sparametryzować build własnym plikiem `.env` (nieobowiązkowy):

```dotenv
# .env — wszystkie wartości są OPCJONALNE; aplikacja działa bez tego pliku.

# Kolor motywu interfejsu (HEX), domyślnie #e8541a
APP_THEME_COLOR=#e8541a

# Źródło biblioteki jsPDF pobieranej do trybu offline podczas buildu Android
JSPDF_CDN_URL=https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js

# Port lokalnego serwera deweloperskiego
DEV_PORT=8080
```

---

## Instalacja i uruchomienie

### Web — Linux / macOS

```bash
# 1. Sklonuj repozytorium
git clone <adres-repozytorium>
cd Elewacja-fina-

# 2. (opcjonalnie) zainstaluj zależności — potrzebne tylko do buildu Android
npm install

# 3. Uruchom dowolny serwer HTTP (ES modules nie działają z file://)
npx serve .
#   lub:
python3 -m http.server 8080

# 4. Otwórz w przeglądarce
#   http://localhost:8080
```

### Web — Windows (PowerShell)

```powershell
git clone <adres-repozytorium>
cd Elewacja-fina-

npm install   # opcjonalnie, tylko dla buildu Android

# Serwer HTTP
npx serve .
#   lub, jeśli masz Pythona:
python -m http.server 8080

# Otwórz http://localhost:8080 w przeglądarce
```

### Android (Capacitor)

```bash
# Wymaga Node 18+, Android Studio i JDK 17
npm install

# Pełny przebieg: przygotowanie paczki web -> sync -> otwarcie w Android Studio
npm run build-android

# Kroki można też wykonać osobno:
npm run prepare-web   # tworzy katalog www/ (bundle esbuild + zasoby)
npm run sync          # npx cap sync android
npm run open-android  # npx cap open android
```

---

## Przykłady użycia

### Przykład 1 — uruchomienie lokalne i przygotowanie wyceny

```bash
$ cd Elewacja-fina-
$ python3 -m http.server 8080
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

Następnie w przeglądarce pod adresem `http://localhost:8080`:

1. Zakładka **Ustawienia** → wpisz powierzchnię elewacji (np. `350 m²`), grubość EPS i odpad.
2. Zakładka **Wycena** → aplikacja automatycznie wylicza materiały i robociznę z podziałem na sekcje.
3. Przełącz tryb **netto / brutto** i ustaw narzut dla klienta.
4. Kliknij **Eksport PDF**, aby pobrać ofertę.

Oczekiwany efekt: kompletny kosztorys z pozycjami materiałowymi i robocizną oraz podsumowaniem
(netto, VAT 8%/23%, brutto, oferta klienta).

### Przykład 2 — zbudowanie paczki web do aplikacji Android

```bash
$ npm run prepare-web

==> Tworzenie katalogu www/...
==> Budowanie bundla JS (esbuild — kompatybilnosc z Android WebView)...
    Bundle OK
==> Kopiowanie plikow web...
==> Pobieranie jsPDF lokalnie (dla trybu offline)...
    jsPDF pobrane OK
==> Patching www/index.html...
    Patching OK
==> Gotowe! Uruchom: npx cap sync android
```

Oczekiwany efekt: katalog `www/` z bundlem `app-bundle.js`, lokalną kopią jsPDF i poprawionym
`index.html` gotowym do pakowania przez Capacitor.

---

## Struktura projektu

```text
.
├── index.html              # Punkt wejścia web (ładuje src/main.js jako moduł ES)
├── sw.js                    # Service Worker — cache offline i precache zasobów
├── manifest.json            # Metadane PWA (ikony, kolory, skróty)
├── capacitor.config.json    # Konfiguracja buildu Android (appId, webDir)
├── android-setup.sh         # Skrypt przygotowujący katalog www/ dla Capacitor
├── jspdf.min.js             # Biblioteka generowania PDF (lokalnie, offline)
├── pdf-font.js              # Czcionka z polskimi znakami dla PDF
└── src/
    ├── main.js              # Importuje i inicjalizuje wszystkie moduły
    ├── data/                # Stałe konfiguracyjne i biblioteka cen materiałów/robocizny
    ├── store/               # Globalny stan aplikacji (state.js)
    ├── services/            # Warstwa danych — IndexedDB (storage.js)
    ├── utils/               # Funkcje pomocnicze (format, dom, math, debounce, download)
    └── features/            # Moduły funkcji:
        ├── calc.js          #   główny silnik obliczeń
        ├── wycena.js        #   tabela kosztorysu, VAT, narzut klienta
        ├── pdf.js           #   eksport dokumentów PDF
        ├── library.js       #   biblioteka materiałów i robocizny
        ├── parapets.js      #   moduł parapetów
        ├── anchors.js       #   kołki/łączniki i współczynnik U
        ├── foam.js          #   pianki montażowe
        ├── extras.js        #   prace dodatkowe
        ├── custom.js        #   własne pozycje użytkownika
        ├── prices.js        #   porównywarka cen hurtowni
        ├── projects.js      #   zapis/wczytanie/eksport projektów
        ├── router.js        #   nawigacja po zakładkach
        └── pwa.js           #   rejestracja Service Workera, obsługa offline
```

---

## Plan rozwoju i znane ograniczenia

### Dotychczas zrealizowano

- Kompletny silnik obliczeń ETICS z edytowalnymi wskaźnikami zużycia i objętością EPS w m³.
- Bibliotekę materiałów i robocizny z cenami rynkowymi oraz ulubionymi.
- Tryb netto/brutto, narzut i ofertę dla klienta.
- Eksport PDF (kosztorys, oferta, zamówienie) działający offline.
- Tryb offline (PWA) i opcjonalny build na Androida przez Capacitor.

### Napotkane problemy i ich rozwiązania

- **Wydajność renderowania** — render biblioteki miał złożoność O(n²) (wyszukiwanie pozycji
  w tablicy dla każdego elementu). Zamieniono na wyszukiwanie O(1) na strukturach `Set`,
  dodano debounce do wyszukiwarki, a duże skrypty PDF (~485 KB) blokujące pierwszy render
  oznaczono atrybutem `defer`. Scroll spy cache'uje wysokości pasków zamiast wymuszać reflow.
- **Poprawność VAT** — wyeliminowano podwójne naliczanie VAT, rozdzielono stawki 8% (materiały)
  i 23% (robocizna) zarówno w podsumowaniu na ekranie, jak i w PDF; zysk wykonawcy liczony jest
  zawsze od kwoty netto, niezależnie od trybu wyświetlania.
- **Trwałość danych** — naprawiono utratę pól projektu (wskaźniki zużycia kleju i siatki, narzut
  klienta, tryb cen) przy ponownym wczytaniu projektu.
- **Tryb offline** — do precache Service Workera dodano czcionkę PDF (`pdf-font.js`) oraz wszystkie
  moduły ES, dzięki czemu zainstalowana aplikacja startuje niezawodnie bez sieci.
- **Bezpieczeństwo** — nazwy pozycji wprowadzane przez użytkownika (i wczytywane z importu JSON)
  są escapowane (`escAttr`), co zabezpiecza przed atakami typu XSS.

### W kolejnych iteracjach planuje się

- Synchronizację projektów w chmurze (obecnie dane są wyłącznie lokalne na urządzeniu).
- Konfigurację buildu na iOS (obecnie nieskonfigurowany).
- Mechanizm aktualizacji cen hurtowni (obecnie wymaga ręcznej aktualizacji w bibliotece).

### Znane ograniczenia

- Brak backendu i kont użytkowników — dane nie są współdzielone między urządzeniami.
- Ceny w bibliotece mają charakter orientacyjny i wymagają okresowej aktualizacji.
- Eksport iOS nie jest jeszcze przygotowany.

---

## Licencja

`[Wpisz licencję]`

> Uwaga: repozytorium nie zawiera obecnie pliku `LICENSE`. Przed publikacją należy dodać wybraną
> licencję (np. MIT, Apache 2.0, GPL-3.0) i uzupełnić tę sekcję.
