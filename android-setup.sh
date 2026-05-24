#!/usr/bin/env bash
# Przygotowuje katalog www/ z plikami web do Capacitor
set -e

echo "==> Tworzenie katalogu www/..."
rm -rf www
mkdir -p www

echo "==> Kopiowanie plikow web..."
rsync -av \
  --exclude='node_modules/' \
  --exclude='android/' \
  --exclude='ios/' \
  --exclude='www/' \
  --exclude='.git/' \
  --exclude='android-setup.sh' \
  --exclude='package.json' \
  --exclude='package-lock.json' \
  --exclude='capacitor.config.json' \
  --exclude='*.sh' \
  . www/

echo "==> Pobieranie jsPDF lokalnie (dla trybu offline)..."
JSPDF_URL="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
curl -fsSL "$JSPDF_URL" -o www/jspdf.min.js \
  && echo "    jsPDF pobrane OK" \
  || { echo "    BLAD: Nie udalo sie pobrac jsPDF"; exit 1; }

echo "==> Patching www/index.html — zamiana CDN na lokalne pliki..."
# Zamien blokujacy CDN jsPDF na lokalny plik (brak dostepu do sieci w WebView = timeout)
sed -i 's|<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>|<script src="./jspdf.min.js"></script>|g' www/index.html
# Google Fonts blokuje renderowanie bez internetu — usun (app uzywa fallback font)
sed -i 's|<link href="https://fonts.googleapis.com/[^"]*" rel="stylesheet">||g' www/index.html
echo "    Patching OK"

echo "==> Gotowe! Uruchom: npx cap sync android"
