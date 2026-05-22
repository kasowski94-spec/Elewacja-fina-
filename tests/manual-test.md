# ElewacjaPro — Manual Test Checklist
> Wersja: 2026-05-21 | Audyt v1.0

Przed każdym deploymentem przejdź przez tę listę. Checkbox = test zaliczony.

## A. PODSTAWOWE OBLICZENIA

- [ ] **A1** Wpisz area=350, waste=5%, EPS biały 038, wallU0=0.45 → live bar pokazuje łączną kwotę > 0
- [ ] **A2** Zmień grubość EPS na 15cm (klik kafelka) → U-value w kafelku ≈ 0.148, kolor zielony (≤0.20)
- [ ] **A3** Zmień EPS na 5cm → U-value czerwony (> 0.30) i symbol ✗WT2021
- [ ] **A4** Ustaw area=0 → pojawia się baner walidacji, live bar nie pokazuje ujemnych/NaN wartości
- [ ] **A5** Ustaw area=10000 → obliczenia kończą się bez freezeu / długiego czekania

## B. BIBLIOTEKA MATERIAŁÓW

- [ ] **B1** Zakładka Biblioteka → widoczne kategorie materiałów i robocizny
- [ ] **B2** Wyszukaj "styropian" → lista filtruje się na bieżąco
- [ ] **B3** Kliknij gwiazdkę przy materiale → pojawia się w zakładce Ulubione
- [ ] **B4** Przeładuj stronę → ulubione zachowane (localStorage)

## C. CENY

- [ ] **C1** Zakładka Ceny → grid z polami cenowymi wypełniony
- [ ] **C2** Kliknij chip ceny (np. low/avg/high) → pole automatycznie się wypełnia, live bar aktualizuje
- [ ] **C3** Kliknij "Wybierz z biblioteki" → modal z filtrowaniem, kliknięcie ceny ją aplikuje
- [ ] **C4** Wybierz sklep "mega1000.pl" → cena w wycenie zmienia się (mnożnik 0.95)

## D. PARAPETY

- [ ] **D1** Zakładka Parapety → Dodaj parapet → pojawia się wiersz konfiguracyjny
- [ ] **D2** Zmień szerokość/długość parapetu → koszt przelicza się na bieżąco
- [ ] **D3** Usuń parapet → znika z listy i sumy wyceny

## E. WYCENA

- [ ] **E1** Zakładka Wycena → tabela z sekcjami A–L widoczna
- [ ] **E2** Ręcznie edytuj ilość w dowolnym wierszu → ikona edycji, suma sekcji aktualizuje
- [ ] **E3** Kliknij "Reset" → ręczne zmiany usunięte, wartości automatyczne przywrócone
- [ ] **E4** Wybierz VAT 8% → w podsumowaniu widoczne: netto, VAT 8%, brutto
- [ ] **E5** Zmień VAT na 23% → kwoty aktualizują się natychmiast
- [ ] **E6** Wpisz NIP zamawiającego 000-000-00-00 → pole przyjmuje wartość

## F. MARŻA I DEGRESJA

- [ ] **F1** Wpisz narzut 20% → w podsumowaniu pojawia się linia "Z narzutem 20% (PDF wewnętrzny): X zł"
- [ ] **F2** Ustaw area=500 → wycena automatycznie sugeruje degresję (jeśli włączona)

## G. EKSPORT PDF

- [ ] **G1** Kliknij "PDF klientowi" → pobiera się plik PDF
- [ ] **G2** Otwórz PDF → polskie znaki ą ę ś ź ż ó ć ń ł wyświetlają się poprawnie
- [ ] **G3** Otwórz PDF → długa nazwa projektu nie wychodzi poza komórkę
- [ ] **G4** Kliknij "PDF wewnętrzny" → tytuł dokumentu różni się ("WEWNĘTRZNA")
- [ ] **G5** Kliknij "PDF materiały" → dokument zawiera tylko sekcje A–H (bez robocizny)
- [ ] **G6** PDF klientowi NIE zawiera wiersza "Z narzutem" (narzut ukryty)

## H. PROJEKTY I ZAPIS

- [ ] **H1** Kliknij "+" nowy projekt → modal z polem nazwy
- [ ] **H2** Wpisz nazwę i zapisz → projekt pojawia się w dropdown
- [ ] **H3** Zmień coś w projekcie → poczekaj 1s → przeładuj stronę → dane zachowane
- [ ] **H4** Wczytaj projekt z dropdown → wszystkie pola wypełnione
- [ ] **H5** Eksportuj projekt jako JSON → pobiera się plik JSON
- [ ] **H6** Importuj ten sam JSON → dane wczytane poprawnie

## I. PWA / OFFLINE

- [ ] **I1** Zainstaluj aplikację (przycisk "Zainstaluj") → ikona na pulpicie/home screen
- [ ] **I2** Odłącz internet → aplikacja działa offline
- [ ] **I3** Offline → PDF generuje się (pdf-font.js w cache)
- [ ] **I4** Wróć online → toast "Połączono z internetem"

## J. TRYB JASNY/CIEMNY

- [ ] **J1** Kliknij ikonę 🌙 w topbarze → zmienia się na ☀️, tło strony jasne
- [ ] **J2** Przeładuj stronę → tryb jasny zachowany (localStorage)
- [ ] **J3** Kliknij ☀️ → wraca tryb ciemny

## K. ONBOARDING

- [ ] **K1** Wyczyść localStorage (`localStorage.removeItem('onboarding-done')`) → przeładuj → po 1.5s pojawia się overlay onboardingu
- [ ] **K2** Kliknij "Dalej →" → zmienia krok (3 kroki łącznie)
- [ ] **K3** Na ostatnim kroku "Zacznij!" → overlay znika
- [ ] **K4** Przeładuj → overlay NIE pojawia się ponownie

## L. MOBILNE / UX

- [ ] **L1** Na telefonie (≤600px) → widoczny dolny pasek nawigacyjny
- [ ] **L2** Kliknięcie zakładki w dolnym pasku → nawigacja działa
- [ ] **L3** Kliknij "⋯ Więcej" → sheet z dodatkowymi opcjami
- [ ] **L4** Pola input na iOS (Safari) → NIE powiększa widoku przy focus (font-size: 16px)
- [ ] **L5** Swipe lewo/prawo między zakładkami → nawigacja gestowa

## M. EDGE CASES

- [ ] **M1** Bardzo długa nazwa klienta (100 znaków) w PDF → tekst zawijany, nie wychodzi poza stronę
- [ ] **M2** Projekt bez parapetów → sekcja F w wycenie pusta lub ukryta
- [ ] **M3** Cena = 0 dla materiału → wartość wiersza = 0 zł, brak NaN
- [ ] **M4** Ujemna wartość w polu ilości (ręczna edycja) → obliczenia nie crashują
- [ ] **M5** Prywatne okno (Private Browsing) → aplikacja działa (IndexedDB niedostępne → localStorage fallback)

## N. WALIDACJA TECHNICZNA

- [ ] **N1** Otwórz DevTools → brak błędów JavaScript w konsoli przy normalnym użyciu
- [ ] **N2** DevTools → Application → Service Worker → Status "Activated and is running"
- [ ] **N3** DevTools → Application → Cache Storage → cache elewacja-v6 zawiera pdf-font.js
- [ ] **N4** Lighthouse → PWA score ≥ 90 (installable, offline support, icons)
- [ ] **N5** DevTools → manifest.json → wszystkie ikony dostępne (brak 404)

---
**Łącznie testów:** ~30  
**Po zaliczeniu:** Można deployować na GitHub Pages.
