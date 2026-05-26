#!/bin/bash
set -e

echo "=== ElewacjaPro Android Setup ==="

# 1. Utwórz katalog www
mkdir -p www

# 2. Zbuduj bundle JS (esbuild)
echo "Building JS bundle..."
npx esbuild src/main.js \
  --bundle \
  --format=iife \
  --global-name=App \
  --target=chrome80 \
  --outfile=app-bundle.js

# 3. Skopiuj pliki do www/
echo "Copying files to www/..."
rsync -av --exclude='node_modules' --exclude='www' --exclude='.git' \
  --exclude='android' --exclude='*.sh' \
  . www/

# 4. Pobierz jsPDF jeśli nie ma
if [ ! -f "www/jspdf.min.js" ]; then
  echo "Downloading jsPDF..."
  curl -L -o www/jspdf.min.js \
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" || \
    echo "WARNING: jsPDF download failed — app will use CDN fallback"
fi

# 5. Patch index.html dla Android WebView
echo "Patching index.html for Android..."
if [ -f "www/index.html" ]; then
  # Usuń Google Fonts (brak internetu w buildzie)
  sed -i 's|<link href="https://fonts.googleapis.com[^"]*" rel="stylesheet">||g' www/index.html
  # Zamień moduł ES na bundle IIFE
  sed -i 's|<script type="module" src="src/main.js"></script>|<script src="app-bundle.js"></script>|g' www/index.html
  echo "Patching done."
fi

echo "=== Setup complete! Run: npx cap sync android ==="
