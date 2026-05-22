# DESIGN.md — ElewacjaPro Design System
> Wersja: 2026-05-21 | Audyt v1.0

---

## Kierunek wizualny

**ElewacjaPro** to aplikacja B2B dla profesjonalistów budowlanych. Design:
- **Dark-first** (ciemny motyw jako bazowy, jasny jako wariant)
- **Functional over decorative** (brak 3D, skeuomorfizmu)
- **Orange accent** — ciepły, energiczny, rozpoznawalny
- Inspiracje: Tailwind UI, Linear App, Vercel Dashboard

---

## Paleta kolorów

### Dark mode (bazowy):
```
--bg:      #0b0d14   Tło aplikacji (bardzo ciemny niebieski)
--sur:     #13151f   Powierzchnie drugiego planu
--card:    #1c1f2e   Karty i kontenery
--card2:   #232638   Podwyższone karty, inputy
```

### Accent (identyczny w obu motywach, lekko ciemniejszy w light):
```
--acc:     #e8541a   Główny akcent: spalony pomarańcz (CTA, aktywne stany)
--acc2:    #f5a623   Drugi akcent: ciepły bursztyn (highlights)
--acc3:    #3ecf8e   Trzeci akcent: teal (duplikat --grn)
```

### Tekst (dark):
```
--txt:     #eef0f6   Podstawowy tekst (prawie biały)
--mut:     #6b7491   Wyciszony tekst (slate gray)
--brd:     #252840   Kolor obramowania
```

### Semantyczne:
```
--red:     #f06a6a   Błąd / niebezpieczeństwo
--grn:     #3ecf8e   Sukces / pozytywne
--blu:     #5b9cf6   Informacja / secondary
--pur:     #a78bfa   Akcent / highlight
```

### Light mode override:
```
--bg:      #f5f6fa
--sur:     #ffffff
--card:    #ffffff
--card2:   #f0f1f7
--txt:     #1a1d2e
--brd:     #dde0f0
--acc:     #d94e18  (ciemniejszy dla lepszego kontrastu WCAG AA na białym)
```

---

## Typografia

| Rola | Font | Wagi | Użycie |
|------|------|------|--------|
| Nagłówki | **Syne** (Google Fonts) | 400, 600, 700, 800 | Nazwy zakładek, tytuły kart, logo |
| Ciało | **Inter** (Google Fonts) | 300, 400, 500, 600 | Tekst, etykiety, opisy |
| Liczby | Inter z `font-variant-numeric: tabular-nums` | 600, 700 | Ceny, wartości, live bar |

### Skala typograficzna:
```
4xl: 1.4rem  — główne sumy w wycenie
3xl: 1.2rem  — nagłówki kart (--font-head)
2xl: 1.0rem  — tytuły sekcji
xl:  0.9rem  — przyciski, etykiety form
lg:  0.85rem — tekst ciała
md:  0.78rem — podtytuły, opisy
sm:  0.72rem — hinty, podpisy, stopki
xs:  0.65rem — metadane, tagi
```

---

## Skala spacingu

```css
--sp1:  4px    Mikro (gap między inline elements)
--sp2:  8px    Mały (padding kompaktowy, gap w grid)
--sp3: 12px    Średni (padding kart mobilnych)
--sp4: 16px    Standard (padding kart, gap główny)
--sp5: 24px    Duży (odstępy sekcji)
--sp6: 32px    XL (marginesy między sekcjami)
```

---

## Promienie zaokrągleń

```css
--r:  10px   Małe elementy (input, badge, chip)
--r2: 14px   Karty, przyciski
--r3: 20px   Modals, overlay
--r4: 28px   Duże karty (onboarding)
```

---

## Cienie

```css
--shadow-sm: 0 1px 4px rgba(0,0,0,.18)    Subtelne uniesienie karty
--shadow-md: 0 4px 16px rgba(0,0,0,.25)   Modals, floating elements
--shadow-lg: 0 8px 32px rgba(0,0,0,.32)   Toast, install banner
```

---

## Komponenty

### Przyciski:
- `.btn` — secondary (outlined)
- `.btn.pri` — primary (filled, orange)
- `.btn.grn` — success (filled, green)
- `.btn.sm` — mały wariant (padding 4/9px)

### Karty:
- `.card` — standardowa karta z padding 14px
- `.vc` — karta wariantu EPS (klikalna, hover effect)
- `.mi` — mini karta materiału

### Formularze:
- `.ig` — input group (label + input/select)
- `.fg` — form grid `auto-fill minmax(160px, 1fr)`
- `.fg2` — gęstszy grid `minmax(140px, 1fr)`

### Live bar kafelki:
- `.lb-chip` — kafelek z etykietą i wartością
- `.lb-chip.active` — pomarańczowe obramowanie + pulsujący dot

### Wycena:
- `.wr` — wiersz wyceny (z edytowalnymi polami)
- `.wys-head` — nagłówek sekcji wyceny
- `.ws-box` — blok podsumowania

---

## Animacje i transitions

### Zasada prefers-reduced-motion:
Każda animacja jest otoczona:
```css
@media(prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important; transition-duration:.01ms !important;}
}
```

### Zdefiniowane keyframes:
```
tabFadeIn       — pojawianie się zakładki (opacity + translateY)
slideInRight    — slide-in z prawej
toastIn/Out     — toast slide from right
skeletonShimmer — shimmer na skeleton loaders
pulseAcc        — pulsowanie pomarańczowego dot w live bar
priceFlash      — mignięcie komórki ceny przy zmianie
sp              — obrót spinnera loading
```

### Transition timing:
- Interaktywne: `all .2s`
- Karty hover: `transform .15s ease, box-shadow .15s ease`
- Tab panels: `tabFadeIn .18s ease-out`
- Install banner: `.35s cubic-bezier(.34,1.56,.64,1)` (sprężyna)

---

## Ikony

Emoji jako ikony (brak zewnętrznych pakietów ikon):
- ⚙ Ustawienia / Dane
- 📦 EPS / Materiały
- 📚 Biblioteka
- 💰 Ceny
- 📄 Wycena / PDF
- 🔩 Łączniki
- 🪟 Parapety
- ➕ Dodatki
- ⋯ Więcej

---

## Responsywność

| Breakpoint | Zachowanie |
|-----------|-----------|
| >600px | Desktop/tablet: tabs-bar widoczny, bottom-nav ukryty |
| ≤600px | Mobile: bottom-nav widoczny, tabs-bar ukryty, grid 2-kolumnowy |
| ≤480px | Mobile small: library rows flexbox column |
| ≤380px | Mobile XS: wszystkie gridy 1-kolumnowe |
| ≤360px | Bardzo małe telefony: kompaktowe |

Safe area: `env(safe-area-inset-*)` dla notch/Dynamic Island.

---

## Dostępność (A11y)

- Kontrast WCAG AA: `--txt` (#eef0f6) na `--bg` (#0b0d14) = 14.3:1 ✅
- Kontrast WCAG AA: `--acc` (#e8541a) na `--bg` = 4.8:1 ✅ (marginalnie)
- Minimalne touch targets: 44×44px na mobile
- Aria labels na kluczowych elementach (live-bar, logo, modal)
- Font-size ≥ 16px na inputach iOS (anty-zoom)
- `prefers-reduced-motion` respektowany
