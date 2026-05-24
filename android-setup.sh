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
if [ ! -f "www/jspdf.min.js" ]; then
  curl -fsSL "$JSPDF_URL" -o www/jspdf.min.js \
    && echo "    jsPDF pobrane OK" \
    || echo "    UWAGA: Nie udalo sie pobrac jsPDF — upewnij sie ze masz internet"
else
  echo "    jsPDF juz istnieje — pomijam"
fi

echo "==> Gotowe! Uruchom: npx cap sync android"
