# RESEARCH.md — ElewacjaPro Audyt Branżowy
> Data: 2026-05-21 | Autor: Audyt techniczny v1.0

---

## 1.1 Branżowe kalkulatory ETICS w Polsce — analiza funkcji

### Przeanalizowane narzędzia:
- **TermoOrganika Kalkulator U** (termoorganika.pl)
- **Atlas ETICS System** (atlas.com.pl)
- **Bolix Doradca** (bolix.pl)
- **eStyropian Kalkulator kosztów** (estyropian.pl)
- **Styroneo Kalkulator systemów** (styroneo.pl)
- **Izotherm Kalkulator docieplenia** (izotherm.pl)
- **DekorLux Kalkulator ocieplenia** (dekorlux.pl)
- **Oferteo Kalkulator elewacji** (oferteo.pl)
- **Muratordom.pl** — porady i kalkulacje
- **Kanbudwawrzyniak.pl** — przewodnik techniczny

### Funkcje KTÓRE ElewacjaPro POSIADA:
✅ Kalkulator U (U-wartość izolacji)  
✅ Wybór grubości EPS i λ  
✅ Zużycia materiałów (klej, siatka, tynk, łączniki)  
✅ Wycena z podziałem na sekcje  
✅ Eksport PDF  
✅ Biblioteka materiałów z cenami  
✅ Obsługa wariantów EPS (10–30 cm)  
✅ Rusztowanie  
✅ Parapety  
✅ Łączniki mechaniczne  
✅ Porównanie cen (hurtownie)  
✅ Zarządzanie projektami (wiele projektów)  
✅ PWA / offline  

### Funkcje których ElewacjaPro NIE MA, a powinno mieć:

| # | Funkcja | Priorytet | Opis |
|---|---------|-----------|------|
| 1 | **Kalkulator VAT (8% vs 23%)** | Krytyczny | Usługi elewacyjne dla budownictwa mieszkaniowego: 8%; hale przemysłowe: 23%. Wycena musi informować o stawce |
| 2 | **Pola NIP/REGON zamawiającego i wykonawcy** | Wysoki | Wymagane prawnie na fakturze VAT; wycena jako pre-faktura powinna je zawierać |
| 3 | **Tryb "PDF dla klienta" vs "PDF wewnętrzny"** | Wysoki | Klient widzi cenę brutto bez marży; wykonawca widzi koszt + marżę + narzut |
| 4 | **Pole narzut/marża (%)** | Wysoki | Umożliwia kalkulację zysku wykonawcy (typowo 15–30% kosztów materiałów) |
| 5 | **Tryb degresji — rabaty wolumenowe** | Wysoki | Auto-rabat dla >300 m² (−3%), >500 m² (−5%), >1000 m² (−8%); standard w branży |
| 6 | **Lista zakupów z paletyzacją** | Wysoki | Ile worków/palet/rolek danego materiału; gotowa lista do hurtowni |
| 7 | **Wycena wariantowa porównawcza (obok siebie)** | Średni | 3 warianty (np. EPS biały 15 vs grafit 15 vs grafit 20) z różnicą ceny i czasu zwrotu |
| 8 | **Faktor sezonowości robocizny** | Średni | Zima (nov–mar): mnożnik 1.15–1.25 przez trudniejsze warunki; lato: 1.0 |
| 9 | **Kalkulator dojazdu** | Średni | km × stawka (2–4 zł/km) + noclegi + diety dla ekipy |
| 10 | **Undo/Redo historia (≥10 kroków)** | Średni | Wykonawcy często eksperymentują z cenami — "Cofnij" jest oczekiwane |
| 11 | **Tryb "wycena vs faktyczne"** | Średni | Pole "wykonano" obok "zaplanowano" — śledzenie odchyleń po realizacji |
| 12 | **Wariant ekspresowy vs standard** | Niski | Przyspieszony termin (+20% robocizna) vs standard |
| 13 | **Kalkulator FVAT z odwrotnym obciążeniem** | Niski | Odwrotne obciążenie (reverse charge) dla usług B2B w UE |
| 14 | **Sprawdzenie zgodności WT2021/WT2024** | Niski | Automatyczne oznaczenie czy grubość EPS spełnia Warunki Techniczne |
| 15 | **Eksport do Excela (XLSX)** | Niski | Zamiast/obok CSV — format preferowany przez inwestorów |
| 16 | **Integracja z GUS API** | Niski | Pobieranie danych firmy po NIP (GUS REGON API) |
| 17 | **Kalkulator izolacji poddasza i podłogi** | Niski | Rozszerzenie poza ściany zewnętrzne |
| 18 | **Mapa ciepłna kosztów** | Niski | Wizualizacja budynku z kolorami kosztu per strona (N/S/E/W) |
| 19 | **Kosztorys etapowany** | Niski | Podział prac na etapy z harmonogramem i płatnościami |
| 20 | **Notatki per projekt z datownikiem** | Niski | Dziennik ustaleń z klientem |

---

## 1.2 Problemy wykonawców z istniejącymi kalkulatorami

Na podstawie: forum.muratordom.pl, budowadom.com.pl, termomodernizacja.pl, oferteo.pl, kanbudwawrzyniak.pl:

### Najczęstsze problemy z kalkulatorami:

1. **Brak obsługi VAT** — Wykonawcy regularnie błądzą czy zastosować 8% (budynki mieszkalne) czy 23% (inne). Kalkulatory zazwyczaj podają ceny netto.

2. **Zaniżone zużycia materiałów** — Popularne kalkulatory podają wartości laboratoryjne, a nie rzeczywiste (np. klej 2 kg/m² zamiast 4 kg/m²; siatka bez zakładu). Prowadzi to do niedoboru materiałów i dopłat.

3. **Brak obsługi budynków skomplikowanych geometrycznie** — Wnęki, wykusze, loggie, balkony wymagają dodatkowego naddatku materiałów (15–25% więcej niż prosta ściana).

4. **Brak kalkulacji dojazdu** — W wycenach pomijany; pojawia się jako "koszt dodatkowy" na końcu, niwecząc marżę.

5. **Brak uwzględnienia sezonowości** — Prace zimą są droższe (ogrodzenia, ogrzewanie, wolniejsze schnięcie tynku), a kalkulatory tego nie uwzględniają.

6. **Brak historii zmian** — Wykonawcy nie mogą wrócić do poprzedniej wersji wyceny po edycji.

7. **PDF "dla wszystkich"** — Klient widzi pełen kosztorys z cenami materiałów. Często to prowadzi do negocjacji po kosztach lub pominięcia wykonawcy.

8. **Brak rabatów wolumenowych** — Większość kalkulatorów nie obsługuje degresji cen dla dużych zamówień (>300 m²).

9. **Błędy w doborze łączników** — Głębokość kotwienia nieuwzględniająca grubości starych tynków i tynku wierzchniego.

10. **Brak uwzględnienia wastage przy parapetach** — Cięcia blachy generują 10–20% odpadów.

### Pułapki cenowe zgłaszane przez wykonawców:

- Ceny styropianu grafitowego podane jako "za m²" bez podania grubości — **mylące porównanie**
- Tynki: cena "za worek" różna od "za m²" — przy różnych zużyciach (2.5–6 kg/m²) wynik drastycznie różny
- Rusztowanie często liczone "za szt." zamiast "za m² × tygodnie" — błędy do 40% kosztu
- Siatka zbrojąca: cena m² vs cena kg — dla 145 g/m² to ok. 3.5 zł/m² vs ok. 3.5×6.9=ok. 24 zł/m² (mylenie jednostek)

---

## 1.3 Aktualne ceny rynkowe 2026

**Data aktualizacji:** 2026-05-21  
**Źródła:** Wyniki wyszukiwania z styro24.pl, styronet.pl, oferteo.pl, kanbudwawrzyniak.pl, budohurt.pl, ceneo.pl, muratorplus.pl

### Styropian EPS (cena za m² danej grubości):

| Materiał | Grubość | Low 2026 | Avg 2026 | High 2026 | Komentarz |
|----------|---------|----------|----------|-----------|-----------|
| EPS biały 040 | 10 cm | 14 | 17 | 21 | ekonomiczny |
| EPS biały 038 | 10 cm | 15 | 18 | 22 | standard |
| EPS biały 038 | 15 cm | 22 | 26 | 31 | +trend wzrostowy |
| EPS biały 038 | 20 cm | 29 | 34 | 40 | |
| EPS grafitowy 033 | 10 cm | 19 | 22 | 27 | Lambda Plus |
| EPS grafitowy 033 | 15 cm | 27 | 31 | 37 | popularny 2026 |
| EPS grafitowy 033 | 20 cm | 36 | 42 | 50 | |
| EPS grafitowy 031 | 15 cm | 32 | 38 | 45 | premium Lambda White |
| Wełna mineralna 15 cm | 15 cm | 52 | 65 | 82 | niepalna |

> **WNIOSEK:** Ceny w MATERIAL_LIBRARY są w normie ±10% dla większości pozycji. EPS grafitowy 031 premium może wymagać korekty w górę (+5–8%).

### Inne materiały ETICS:

| Materiał | Jedn. | Low | Avg | High | vs library |
|----------|-------|-----|-----|------|-----------|
| Klej do EPS 25 kg | worek | 36 | 44 | 54 | OK ±5% |
| Klej do siatki 25 kg | worek | 40 | 48 | 60 | OK ±5% |
| Siatka zbrojąca 145g/m² | m² | 2.5 | 3.5 | 5.0 | Biblioteka wymagała korekty |
| Tynk mineralny 25 kg | worek | 28 | 35 | 45 | OK |
| Tynk silikonowy 25 kg | worek | 170 | 250 | 480 | zależy od producenta |
| Tynk silikatowy 25 kg | worek | 160 | 220 | 350 | |
| Grunt pod tynk | l | 12 | 18 | 28 | |
| Łącznik PCV 160mm | szt. | 0.45 | 0.65 | 1.20 | OK |
| Listwa startowa Al 2m | szt. | 4.5 | 6.5 | 9.0 | |

### Robocizna ETICS 2026:

| Pozycja | Low | Avg | High | Komentarz |
|---------|-----|-----|------|-----------|
| Pełny ETICS (montaż+tynk) | 55 | 80 | 120 | Warszawa/Kraków: +20–30% |
| Samo ocieplenie (EPS+klej) | 30 | 45 | 65 | |
| Sama warstwa bazowa + siatka | 18 | 28 | 40 | |
| Tynk elewacyjny | 18 | 25 | 38 | |
| Rusztowanie rent per m²/tydzień | 6 | 8.5 | 12 | |
| Rusztowanie montaż | 10 | 14 | 20 | |

---

## 1.4 Trendy UI/UX 2026 dla aplikacji branżowych mobile-first

**Źródła:** midrocket.com, intuitia.tech, wearetenet.com, muz.li, elinext.com

### TOP 5 trendów wybranych dla ElewacjaPro:

#### 1. 🌙 Dark Mode 2.0 (ZASTOSOWAĆ)
- W 2026 ponad 80% użytkowników mobile korzysta z dark mode
- **Dark-first design**: projektuj ciemny motyw jako bazę, jasny jako wariant
- Automatyczna detekcja `prefers-color-scheme`
- **Relevancja dla ElewacjaPro:** Aplikacja jest już dark-first — trzeba dodać light mode dla starszych telefonów i użytku dziennego w terenie

#### 2. 📦 Bento Grid Layouts (ZASTOSOWAĆ)
- Modułowe kafelki asymetryczne zamiast flat list
- Apple, Samsung, Google stosują globalnie
- **Relevancja:** Live bar z 4–6 kafelkami podsumowującymi wycenę — zamiast poziomego paska

#### 3. ✨ Refined Glassmorphism (OPCJONALNE)
- Frosted glass na overlay cards, modals, navigation
- Nie agresywny — subtelny backdrop-filter: blur()
- **Relevancja:** Modals mogą zyskać na subtelnym glassmorphism

#### 4. 🎯 Micro-animations & Motion Design (ZASTOSOWAĆ)
- Tab transitions: slide/fade 150ms ease-out
- Button press: scale 0.97 + shadow
- Toast notifications: slide-in-right + fade-out
- Page-level transitions
- **Ważne:** `prefers-reduced-motion` jako gate

#### 5. 📊 Data Visualization w kontekście (ZASTOSOWAĆ)
- Małe, inline SVG bar/radial charts przy każdej liczbie
- Brak zewnętrznych bibliotek — pure SVG
- **Relevancja:** Wykres struktury kosztów (materiały vs robocizna vs rusztowanie) w zakładce Wycena

### Odrzucone trendy (nie pasują do ElewacjaPro):
- **Neumorphism** — zbyt delikatny, kiepski kontrast dla użytku w terenie
- **Skeuomorphism revival** — nie pasuje do profesjonalnego B2B
- **3D elements** — zbyt ciężkie na mobile, odwraca uwagę

---

## 1.5 Best Practices PWA 2026

**Źródła:** web.dev/learn/pwa, wirefuture.com, MDN, jsmanifest.com

### Wymagania manifestu:
- `id` — jednoznaczny identyfikator (✅ ElewacjaPro ma)
- `name` + `short_name` (✅ ma)
- `icons` — minimum 192x192 i 512x512 any + maskable (✅ ma)
- `screenshots` — dla "enhanced install UI" (✅ ma — 3 screenshoty)
- `display: "standalone"` lub `"minimal-ui"` (✅ ma)
- `start_url` — pełna ścieżka lub `./` (✅ ma)
- **BRAKUJE:** `display_override: ["window-controls-overlay"]` dla desktopowych PWA

### Service Worker patterns 2026:
- **Cache-first dla statycznych assetów** (✅ ma)
- **Network-first dla dynamic data** (✅ ma)
- **pdf-font.js MUSI być w CORE cache** (❌ brakuje — krytyczny bug)
- **Stale-while-revalidate** dla ikon — bardziej agresywne cache (opcjonalne)
- **Background sync** dla offline-first apps (opcjonalnie)

### Install Prompt UX:
- Nie show immediately — poczekaj na engaged user (✅ ma 3s delay + pwa-dismissed)
- Podaj kontekst "dlaczego warto" w bannerze (✅ ma)
- Zapamiętaj dismissed state (✅ ma)

### Offline UX:
- Offline indicator (✅ ma — `#offline-chip`)
- Graceful degradation dla AI features (✅ ma)
- Offline fallback HTML (✅ ma)

---

## 1.6 Wymogi prawne wycen budowlanych w Polsce

**Źródła:** rentools.pl, poradnikprzedsiebiorcy.pl, nfg.pl, fakturaxl.pl, muratordom.pl

### VAT w budownictwie — zasady 2025/2026:

| Sytuacja | Stawka VAT | Warunek |
|---------|-----------|---------|
| Roboty budowlane w budynkach mieszkalnych (dom jednorodzinny ≤300 m²) | **8%** | Budownictwo objęte SPM (Społecznym Programem Mieszkaniowym) |
| Roboty w mieszkaniu ≤150 m² | **8%** | Lokal mieszkalny w budynku wielorodzinnym |
| Budynki mieszkalne jednorodzinne >300 m² | **23%** | Przekroczenie limitu SPM |
| Roboty w budynkach komercyjnych, halach, przemyśle | **23%** | Poza budownictwem mieszkaniowym |
| Sprzedaż materiałów przez hurtownię | **23%** | Materiały kupowane przez wykonawcę |
| Usługi ETICS jako "termomodernizacja" | **8%** | Jeśli obiekt mieszkalny spełnia kryteria SPM |

### Co MUSI być na wycenie/fakturze budowlanej:
1. ✅ Data wystawienia
2. ✅ Numer dokumentu
3. ✅ Dane sprzedawcy (wykonawcy): imię/nazwisko lub nazwa firmy, adres, NIP
4. ✅ Dane nabywcy (zamawiającego): imię/nazwisko lub nazwa, adres, NIP (jeśli podatnik VAT)
5. ✅ Opis usługi / specyfikacja robót
6. ✅ Ilość, jednostka miary
7. ✅ Cena netto
8. ✅ Stawka VAT i kwota VAT
9. ✅ Cena brutto
10. ✅ Sposób i termin płatności (na fakturze)
11. ❌ **Brakuje w PDF ElewacjaPro:** Pole NIP zamawiającego i wykonawcy
12. ❌ **Brakuje:** Opcja wyboru stawki VAT (8%/23%) z uzasadnieniem

### Faktura uproszczona:
- Do 450 zł brutto — nie wymaga danych nabywcy
- Powyżej — pełna faktura z NIP

### Wycena pre-kontraktowa (nie faktura):
- Nie musi zawierać NIP, ale dobrą praktyką jest uwzględnienie
- Powinna zawierać termin ważności oferty
- Powinna zawierać warunki płatności (zaliczka, rozliczenie etapowe)

---

## Podsumowanie — Priorytety dla ElewacjaPro

### Pilne (Faza 3 implementacja):
1. ✅ VAT 8%/23% z wyborem + NIP w PDF
2. ✅ Tryb PDF "dla klienta" (bez marży) vs "wewnętrzny" (z marżą)
3. ✅ Pole narzut/marża
4. ✅ Lista zakupów z paletyzacją
5. ✅ Degresja rabatowa (wolumenowe)

### Ważne (implementacja w ramach Fazy 3/4):
6. ✅ Dark/Light mode z auto-detekcją
7. ✅ Bento live bar
8. ✅ Microanimacje z prefers-reduced-motion
9. ✅ Onboarding (pierwsze uruchomienie)

### Odłożone (FUTURE):
- Kalkulator dojazdu
- Undo/redo historia
- Sezonowość robocizny (mnożnik)
- Wariant ekspresowy
- Wycena wariantowa 3-kolumnowa
- Integracja GUS API

---

*Raport wygenerowany: 2026-05-21 w ramach kompleksowego audytu ElewacjaPro*
