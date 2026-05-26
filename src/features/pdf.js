// ════════════ PDF / CSV EXPORT ════════════

import { THICK, SHOP_LABELS, MAT_SECTIONS, LABOR_SECTIONS } from '../data/constants.js';
import { wycenaRows, selectedVariant, projects, currentProject, priceMode } from '../store/state.js';
import { gv, gs, gvn } from '../utils/dom.js';
import { fmt } from '../utils/format.js';
import { dl } from '../utils/download.js';
import { calcU } from '../utils/math.js';

export function registerPdfFont(doc) {
  try {
    if (typeof PDF_FONT_REGULAR !== 'undefined') {
      doc.addFileToVFS('DejaVu.ttf', PDF_FONT_REGULAR);
      doc.addFont('DejaVu.ttf', 'DejaVu', 'normal');
    }
    if (typeof PDF_FONT_BOLD !== 'undefined') {
      doc.addFileToVFS('DejaVu-Bold.ttf', PDF_FONT_BOLD);
      doc.addFont('DejaVu-Bold.ttf', 'DejaVu', 'bold');
    }
    doc.setFont('DejaVu', 'normal');
    return true;
  } catch (e) { console.warn('Font PDF niedostępny, fallback helvetica', e); return false; }
}

export function pdfFontName() {
  return (typeof PDF_FONT_REGULAR !== 'undefined') ? 'DejaVu' : 'helvetica';
}

async function savePDF(doc, filename) {
  // ── Ścieżka 1: Capacitor native Android/iOS ──────────────────
  if (window.Capacitor?.isNativePlatform?.()) {
    const FS = window.Capacitor?.Plugins?.Filesystem;
    const SH = window.Capacitor?.Plugins?.Share;
    if (FS && SH) {
      try {
        const base64 = doc.output('datauristring').split(',')[1];
        await FS.writeFile({ path: filename, data: base64, directory: 'CACHE' });
        const { uri } = await FS.getUri({ path: filename, directory: 'CACHE' });
        await SH.share({ title: filename, url: uri, dialogTitle: 'Zapisz lub udostępnij PDF' });
        return;
      } catch (e) {
        const msg = (e?.message || '').toLowerCase();
        if (msg.includes('cancel') || msg.includes('dismiss') || msg.includes('abort')) return;
        console.error('Capacitor PDF share error:', e);
        window.showToast?.('Błąd zapisu PDF: ' + (e?.message || e));
        return;
      }
    }
    // Pluginy niezainstalowane — fallback do Web Share
  }

  // ── Ścieżka 2: Web Share API z plikiem (Android 10+, Chrome 86+) ─
  try {
    if (navigator.share && typeof navigator.canShare === 'function') {
      const blob = doc.output('blob');
      const file = new File([blob], filename, { type: 'application/pdf' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return;
      }
    }
  } catch (e) {
    if (e.name === 'AbortError') return;
    console.warn('Web Share failed, next fallback', e);
  }

  // ── Ścieżka 3: doc.save() — przeglądarka desktopowa ──────────
  doc.save(filename);
}

export async function exportPDF(mode = 'full') {
  if (typeof window.jspdf === 'undefined') { window.showToast?.('jsPDF niedostępny — spróbuj ponownie') || alert('jsPDF niedostępny'); return; }
  try {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  registerPdfFont(doc);
  const FONT = pdfFontName();
  const projName = projects[currentProject]?.name || 'Projekt';
  const kl = document.getElementById('wycena-klient')?.value || '—';
  const ad = document.getElementById('wycena-adres')?.value || '—';
  const dt = document.getElementById('wycena-data')?.value || new Date().toLocaleDateString('pl-PL');
  const wy = document.getElementById('wycena-wyk')?.value || '—';
  const nr = document.getElementById('wycena-nr')?.value || '';
  const termin = document.getElementById('wycena-termin')?.value || '—';
  const nt = document.getElementById('wycena-notes')?.value || '';

  const rows = mode === 'materialy' ? wycenaRows.filter(r => MAT_SECTIONS.includes(r.section)) : wycenaRows;
  const docTitle = mode === 'materialy' ? 'ZESTAWIENIE MATERIAŁÓW — ETICS' : 'WYCENA ROBÓT ELEWACYJNYCH — SYSTEM ETICS';

  doc.setFillColor(18, 21, 31); doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(232, 84, 26); doc.setFont(FONT, 'bold'); doc.setFontSize(20);
  doc.text('ElewacjaPro', 14, 15);
  doc.setTextColor(245, 166, 35); doc.setFontSize(9.5);
  doc.text(docTitle, 14, 23);
  doc.setTextColor(160, 165, 185); doc.setFont(FONT, 'normal'); doc.setFontSize(7.5);
  doc.text(`Projekt: ${projName}  ·  EPS ${selectedVariant} cm  ·  Cennik: ${SHOP_LABELS[gs('mainShop')] || gs('mainShop')}  ·  Data: ${dt}${nr ? '  ·  Nr: ' + nr : ''}`, 14, 31);
  if (mode === 'materialy') doc.text('Wariant: tylko materiały (bez robocizny i rusztowania)', 14, 36);

  doc.setFillColor(245, 246, 250); doc.rect(0, 40, 210, 28, 'F');
  doc.setDrawColor(225, 227, 235); doc.line(105, 43, 105, 65);
  doc.setFont(FONT, 'bold'); doc.setFontSize(7); doc.setTextColor(120, 125, 140);
  doc.text('ZAMAWIAJĄCY', 14, 47); doc.text('WYKONAWCA', 112, 47);
  doc.setFont(FONT, 'normal'); doc.setFontSize(8.5); doc.setTextColor(45, 50, 65);
  doc.text(kl, 14, 53);
  doc.text(doc.splitTextToSize('Adres: ' + ad, 90)[0], 14, 59);
  doc.text(wy, 112, 53);
  doc.text('Termin: ' + termin, 112, 59);
  doc.setFontSize(7.5); doc.setTextColor(110, 115, 130);
  doc.text(`Powierzchnia elewacji: ${gvn('area', 0)} m²   ·   Wariant EPS: ${selectedVariant} cm`, 14, 65);

  const SECTIONS_LABELS = {
    eps: 'A · Izolacja termiczna EPS', kleje: 'B · Kleje, masy, siatka', tynk: 'C · Tynk, farba, grunty',
    lacze: 'D · Łączniki i zaślepki', profile: 'E · Profile, listwy', parapety: 'F · Parapety i obróbki',
    tasmy: 'G · Taśmy, folie, pianka', custom_mat: 'H · Własne materiały',
    labor: 'I · Robocizna montażowa', rusz: 'J · Rusztowanie', prace: 'K · Prace dodatkowe', custom_rob: 'L · Własne prace',
  };
  const COL = { lp: 9, name: 15, unit: 118, qty: 134, price: 152, total: 200 };
  let y = 76;
  const drawTableHeader = () => {
    doc.setFillColor(28, 31, 46); doc.rect(8, y - 5, 194, 7, 'F');
    doc.setTextColor(245, 166, 35); doc.setFont(FONT, 'bold'); doc.setFontSize(7);
    doc.text('Lp', COL.lp, y - 0.5, { align: 'center' });
    doc.text('Pozycja / opis', COL.name, y - 0.5);
    doc.text('Jedn.', COL.unit, y - 0.5);
    doc.text('Ilość', COL.qty, y - 0.5, { align: 'right' });
    doc.text('Cena', COL.price, y - 0.5, { align: 'right' });
    doc.text('Wartość', COL.total, y - 0.5, { align: 'right' });
    y += 4;
  };
  drawTableHeader();

  let total = 0, currentSec = '', secTotal = 0;
  const flushSecTotal = () => {
    if (currentSec && secTotal > 0) {
      doc.setFont(FONT, 'bold'); doc.setFontSize(7); doc.setTextColor(232, 84, 26);
      doc.text('Suma ' + (SECTIONS_LABELS[currentSec] || currentSec).split(' · ')[0] + ': ' + fmt(secTotal, 0) + ' zł', COL.total, y + 1, { align: 'right' });
      y += 5;
    }
  };
  rows.forEach(r => {
    if (y > 272) { doc.addPage(); y = 20; drawTableHeader(); }
    if (r.section !== currentSec) {
      flushSecTotal();
      currentSec = r.section; secTotal = 0;
      y += 3;
      if (y > 272) { doc.addPage(); y = 20; drawTableHeader(); }
      doc.setFillColor(238, 240, 247); doc.rect(8, y - 3.5, 194, 6, 'F');
      doc.setTextColor(60, 65, 90); doc.setFont(FONT, 'bold'); doc.setFontSize(7.5);
      doc.text(SECTIONS_LABELS[r.section] || r.section, COL.name, y + 0.3);
      y += 5;
    }
    const tot = (r.qty || 0) * (r.price || 0); total += tot; secTotal += tot;
    const nameLines = doc.splitTextToSize(r.name.replace('◆ ', '').replace('◆', '*'), 98);
    const descLines = r.desc ? doc.splitTextToSize(r.desc, 98) : [];
    const rowH = Math.max(6, nameLines.length * 3.6 + (descLines.length ? descLines.length * 3 + 1 : 0));
    if (y + rowH > 278) { doc.addPage(); y = 20; drawTableHeader(); }
    doc.setDrawColor(232, 234, 240); doc.line(8, y + rowH - 1.5, 202, y + rowH - 1.5);
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(40, 44, 58);
    doc.text(String(r.lp), COL.lp, y + 2, { align: 'center' });
    nameLines.forEach((ln, k) => doc.text(ln, COL.name, y + 2 + k * 3.6));
    if (descLines.length) {
      doc.setFontSize(6.5); doc.setTextColor(130, 135, 150);
      descLines.forEach((ln, k) => doc.text(ln, COL.name, y + 2 + nameLines.length * 3.6 + k * 3));
    }
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(40, 44, 58);
    doc.text(r.unit, COL.unit, y + 2);
    doc.text(fmt(r.qty, 2), COL.qty, y + 2, { align: 'right' });
    doc.text(fmt(r.price, 2), COL.price, y + 2, { align: 'right' });
    doc.setFont(FONT, 'bold'); doc.setTextColor(20, 24, 38);
    doc.text(fmt(tot, 0) + ' zł', COL.total, y + 2, { align: 'right' });
    y += rowH;
  });
  flushSecTotal();

  y += 6; if (y > 250) { doc.addPage(); y = 24; }
  const isBruttoPDF = priceMode === 'brutto';
  // W trybie brutto ceny wierszy już zawierają VAT — nie dodawaj ponownie
  const displayBrutto = isBruttoPDF ? total : total * 1.08;
  const boxH = mode === 'materialy' ? (isBruttoPDF ? 20 : 26) : (isBruttoPDF ? 26 : 34);
  doc.setFillColor(18, 21, 31); doc.roundedRect(108, y, 94, boxH, 2, 2, 'F');
  doc.setTextColor(200, 205, 220); doc.setFont(FONT, 'normal'); doc.setFontSize(8.5);
  let yy = y + 8;
  if (mode === 'full') {
    const matT = rows.filter(r => MAT_SECTIONS.includes(r.section)).reduce((s, r) => s + (r.qty || 0) * (r.price || 0), 0);
    const labT = rows.filter(r => LABOR_SECTIONS.includes(r.section)).reduce((s, r) => s + (r.qty || 0) * (r.price || 0), 0);
    doc.text('Materiały:', 114, yy); doc.text(fmt(matT, 0) + ' zł', 196, yy, { align: 'right' }); yy += 5.5;
    doc.text('Robocizna i usługi:', 114, yy); doc.text(fmt(labT, 0) + ' zł', 196, yy, { align: 'right' }); yy += 5.5;
    doc.text(isBruttoPDF ? 'Razem brutto:' : 'Razem netto:', 114, yy); doc.text(fmt(total, 0) + ' zł', 196, yy, { align: 'right' }); yy += 5.5;
    if (!isBruttoPDF) { doc.text('VAT ~8%:', 114, yy); doc.text(fmt(total * 0.08, 0) + ' zł', 196, yy, { align: 'right' }); yy += 6.5; }
    else { yy += 1; }
  } else {
    doc.text(isBruttoPDF ? 'Materiały brutto:' : 'Materiały netto:', 114, yy); doc.text(fmt(total, 0) + ' zł', 196, yy, { align: 'right' }); yy += 5.5;
    if (!isBruttoPDF) { doc.text('VAT 8%:', 114, yy); doc.text(fmt(total * 0.08, 0) + ' zł', 196, yy, { align: 'right' }); yy += 6.5; }
    else { yy += 1; }
  }
  doc.setTextColor(245, 166, 35); doc.setFont(FONT, 'bold'); doc.setFontSize(11);
  doc.text(mode === 'materialy' ? 'BRUTTO:' : 'RAZEM BRUTTO:', 114, yy);
  doc.text(fmt(displayBrutto, 0) + ' zł', 196, yy, { align: 'right' });

  if (nt) {
    let ny = y + boxH + 8; if (ny > 262) { doc.addPage(); ny = 24; }
    doc.setTextColor(90, 95, 110); doc.setFont(FONT, 'bold'); doc.setFontSize(8);
    doc.text('Uwagi:', 14, ny);
    doc.setFont(FONT, 'normal');
    doc.splitTextToSize(nt, 180).forEach((ln, k) => doc.text(ln, 14, ny + 5 + k * 4));
  }

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setTextColor(150, 155, 170); doc.setFont(FONT, 'normal'); doc.setFontSize(6.5);
    doc.text(`ElewacjaPro · ${new Date().toLocaleDateString('pl-PL')} · ${mode === 'materialy' ? 'Zestawienie materiałów' : 'Pełna wycena'}`, 14, 292);
    doc.text(`Strona ${p} / ${pages}`, 196, 292, { align: 'right' });
  }

  const suffix = mode === 'materialy' ? '_MATERIALY' : '_WYCENA';
  await savePDF(doc, `${projName.replace(/\s+/g, '_')}_EPS${selectedVariant}cm${suffix}.pdf`);
  } catch (e) {
    console.error('exportPDF error', e);
    window.showToast?.('Błąd PDF: ' + e.message) || alert('Błąd PDF: ' + e.message);
  }
}

export function buildOrderItems() {
  return wycenaRows
    .filter(r => MAT_SECTIONS.includes(r.section) && (r.qty || 0) > 0)
    .map(r => ({ name: r.name.replace('◆ ', ''), unit: r.unit, qty: r.qty, price: r.price, total: (r.qty || 0) * (r.price || 0), section: r.section }));
}

export async function exportOrderPDF(mode = 'order') {
  if (typeof window.jspdf === 'undefined') { window.showToast?.('jsPDF niedostępny — spróbuj ponownie') || alert('jsPDF niedostępny'); return; }
  const items = buildOrderItems();
  if (!items.length) {
    window.showToast?.('Brak pozycji materiałowych. Uzupełnij dane projektu.') || alert('Brak pozycji materiałowych.');
    return;
  }
  try {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  registerPdfFont(doc);
  const FONT = pdfFontName();
  const isOrder = mode === 'order';
  const projName = projects[currentProject]?.name || 'Projekt';
  const kl = document.getElementById('wycena-klient')?.value || '—';
  const ad = document.getElementById('wycena-adres')?.value || '—';
  const wy = document.getElementById('wycena-wyk')?.value || '';
  const nr = document.getElementById('wycena-nr')?.value || '';
  const today = new Date().toLocaleDateString('pl-PL');
  const docNo = isOrder ? (nr ? 'ZAM/' + nr : 'ZAM/' + new Date().getFullYear() + '/' + String(Date.now()).slice(-4))
    : ('ZAP/' + new Date().getFullYear() + '/' + String(Date.now()).slice(-4));

  doc.setFillColor(18, 21, 31); doc.rect(0, 0, 210, 38, 'F');
  doc.setTextColor(232, 84, 26); doc.setFont(FONT, 'bold'); doc.setFontSize(20);
  doc.text('ElewacjaPro', 14, 15);
  doc.setTextColor(245, 166, 35); doc.setFontSize(11);
  doc.text(isOrder ? 'ZAMÓWIENIE MATERIAŁÓW' : 'ZAPYTANIE OFERTOWE — MATERIAŁY', 14, 24);
  doc.setTextColor(160, 165, 185); doc.setFont(FONT, 'normal'); doc.setFontSize(8);
  doc.text(`Nr: ${docNo}   ·   Data: ${today}   ·   Projekt: ${projName}`, 14, 31);

  doc.setFillColor(245, 246, 250); doc.rect(0, 38, 210, 30, 'F');
  doc.setDrawColor(225, 227, 235); doc.line(105, 41, 105, 65);
  doc.setFont(FONT, 'bold'); doc.setFontSize(7); doc.setTextColor(120, 125, 140);
  doc.text(isOrder ? 'ZAMAWIAJĄCY' : 'KUPUJĄCY', 14, 45);
  doc.text(isOrder ? 'DOSTAWCA / HURTOWNIA' : 'ADRESAT ZAPYTANIA', 112, 45);
  doc.setFont(FONT, 'normal'); doc.setFontSize(8.5); doc.setTextColor(45, 50, 65);
  doc.text(wy || kl, 14, 51);
  doc.setFontSize(7.5); doc.setTextColor(100, 105, 120);
  doc.splitTextToSize('Budowa: ' + ad, 88).forEach((ln, k) => doc.text(ln, 14, 57 + k * 4));
  doc.setFontSize(8.5); doc.setTextColor(45, 50, 65);
  doc.text('.................................................', 112, 52);
  doc.setFontSize(7); doc.setTextColor(150, 155, 170);
  doc.text('(nazwa hurtowni — do uzupełnienia)', 112, 57);

  const cols = isOrder ? { lp: 9, name: 15, unit: 120, qty: 140, price: 160, total: 200 } : { lp: 9, name: 15, unit: 130, qty: 155, offer: 200 };
  let y = 78;
  const drawHead = () => {
    doc.setFillColor(28, 31, 46); doc.rect(8, y - 5, 194, 7, 'F');
    doc.setTextColor(245, 166, 35); doc.setFont(FONT, 'bold'); doc.setFontSize(7);
    doc.text('Lp', cols.lp, y - 0.5, { align: 'center' });
    doc.text('Materiał', cols.name, y - 0.5);
    doc.text('Jedn.', cols.unit, y - 0.5);
    doc.text('Ilość', cols.qty, y - 0.5, { align: 'right' });
    if (isOrder) { doc.text('Cena', cols.price, y - 0.5, { align: 'right' }); doc.text('Wartość', cols.total, y - 0.5, { align: 'right' }); }
    else { doc.text('Oferta dostawcy', cols.offer, y - 0.5, { align: 'right' }); }
    y += 4;
  };
  drawHead();
  let total = 0;
  items.forEach((it, i) => {
    const nameLines = doc.splitTextToSize(it.name, isOrder ? 100 : 108);
    const rowH = Math.max(6, nameLines.length * 3.8);
    if (y + rowH > 274) { doc.addPage(); y = 20; drawHead(); }
    if (i % 2 === 0) { doc.setFillColor(244, 245, 250); doc.rect(8, y - 2.5, 194, rowH, 'F'); }
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(40, 44, 58);
    doc.text(String(i + 1), cols.lp, y + 1.5, { align: 'center' });
    nameLines.forEach((ln, k) => doc.text(ln, cols.name, y + 1.5 + k * 3.8));
    doc.text(it.unit, cols.unit, y + 1.5);
    doc.setFont(FONT, 'bold');
    doc.text(fmt(it.qty, 2), cols.qty, y + 1.5, { align: 'right' });
    if (isOrder) {
      doc.setFont(FONT, 'normal'); doc.text(fmt(it.price, 2), cols.price, y + 1.5, { align: 'right' });
      doc.setFont(FONT, 'bold'); doc.setTextColor(20, 24, 38);
      doc.text(fmt(it.total, 0) + ' zł', cols.total, y + 1.5, { align: 'right' });
      total += it.total;
    } else {
      doc.setDrawColor(200, 203, 212); doc.text('................', cols.offer, y + 1.5, { align: 'right' });
    }
    y += rowH;
  });
  doc.setDrawColor(210, 213, 222); doc.line(8, y, 202, y);

  y += 8; if (y > 250) { doc.addPage(); y = 24; }
  if (isOrder) {
    const vat = total * 0.23;
    doc.setFillColor(18, 21, 31); doc.roundedRect(120, y, 82, 24, 2, 2, 'F');
    doc.setFont(FONT, 'normal'); doc.setFontSize(8.5); doc.setTextColor(200, 205, 220);
    doc.text('Wartość netto:', 125, y + 7); doc.text(fmt(total, 0) + ' zł', 197, y + 7, { align: 'right' });
    doc.text('VAT 23%:', 125, y + 13); doc.text(fmt(vat, 0) + ' zł', 197, y + 13, { align: 'right' });
    doc.setFont(FONT, 'bold'); doc.setFontSize(10.5); doc.setTextColor(245, 166, 35);
    doc.text('BRUTTO:', 125, y + 20); doc.text(fmt(total + vat, 0) + ' zł', 197, y + 20, { align: 'right' });
    doc.setFont(FONT, 'normal'); doc.setFontSize(6.5); doc.setTextColor(140, 145, 160);
    doc.text('Ceny orientacyjne wg cennika aplikacji — do potwierdzenia przez dostawcę.', 14, y + 6);
    y += 30;
  } else {
    doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor(70, 75, 90);
    doc.text('Prosimy o przedstawienie oferty cenowej (netto) oraz informacji o dostępności', 14, y);
    doc.text('i terminie dostawy dla powyższych pozycji.', 14, y + 5);
    y += 14;
  }

  if (y > 250) { doc.addPage(); y = 24; }
  doc.setFont(FONT, 'normal'); doc.setFontSize(7.5); doc.setTextColor(110, 115, 130);
  if (isOrder) {
    doc.text('Termin dostawy: ........................', 14, y);
    doc.text('Adres dostawy: ........................', 14, y + 7);
    doc.text('Sposób płatności: ........................', 14, y + 14);
  } else {
    doc.text('Termin ważności oferty: ........................', 14, y);
    doc.text('Możliwy termin dostawy: ........................', 14, y + 7);
  }
  doc.setDrawColor(180, 184, 194); doc.line(125, y + 18, 197, y + 18);
  doc.setFontSize(7); doc.setTextColor(150, 155, 170);
  doc.text(isOrder ? 'Podpis zamawiającego' : 'Podpis / pieczęć dostawcy', 161, y + 22, { align: 'center' });

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setTextColor(150, 155, 170); doc.setFont(FONT, 'normal'); doc.setFontSize(6.5);
    doc.text(`ElewacjaPro · ${today} · ${isOrder ? 'Zamówienie materiałów' : 'Zapytanie ofertowe'} · ${docNo}`, 14, 292);
    doc.text(`Strona ${p} / ${pages}`, 196, 292, { align: 'right' });
  }
  await savePDF(doc, `${projName.replace(/\s+/g, '_')}_${isOrder ? 'ZAMOWIENIE' : 'ZAPYTANIE'}.pdf`);
  } catch (e) {
    console.error('exportOrderPDF error', e);
    window.showToast?.('Błąd PDF: ' + e.message) || alert('Błąd PDF: ' + e.message);
  }
}

export function exportOrderCSV(mode = 'order') {
  const items = buildOrderItems();
  if (!items.length) { alert('Brak pozycji materiałowych do eksportu.'); return; }
  const isOrder = mode === 'order';
  const h = isOrder ? ['Lp', 'Materiał', 'Jednostka', 'Ilość', 'Cena netto', 'Wartość netto']
    : ['Lp', 'Materiał', 'Jednostka', 'Ilość', 'Cena oferowana', 'Dostępność'];
  const rows = items.map((it, i) => isOrder
    ? [i + 1, it.name, it.unit, fmt(it.qty, 2), fmt(it.price, 2), fmt(it.total, 2)]
    : [i + 1, it.name, it.unit, fmt(it.qty, 2), '', '']);
  dl([h, ...rows].map(r => r.join(';')).join('\n'),
    (isOrder ? 'zamowienie_' : 'zapytanie_') + (projects[currentProject]?.name || 'projekt').replace(/\s+/g, '_') + '.csv');
}

export function exportCSV() {
  const area = gv('area') || 350, waste = gv('waste') / 100, lambda = parseFloat(gs('epsType')) || 0.033, u0 = gv('wallU0') || 0.45;
  const aW = area * (1 + waste), anch = gv('anchPerM2') || 6;
  const h = ['Grubosc cm', 'EPS m2', 'EPS m3', 'Laczniki', 'Klej kg', 'Zbr kg', 'Siatka m2', 'U', 'WT2021'];
  const rows = THICK.map(t => { const u = calcU(t / 100, lambda, u0); return [t, aW.toFixed(1), (aW * t / 100).toFixed(2), Math.ceil(area * anch), Math.ceil(area * 4), Math.ceil(area * 5.5), aW.toFixed(1), u.toFixed(3), u <= 0.20 ? 'TAK' : 'NIE']; });
  dl([h, ...rows].map(r => r.join(';')).join('\n'), 'warianty.csv');
}

export function exportCSVFull() {
  const h = ['Lp', 'Nazwa', 'Jedn', 'Ilosc', 'Cena', 'Hurtownia', 'Wartosc'];
  const rows = wycenaRows.map(r => [r.lp, r.name, r.unit, r.qty, (r.price || 0).toFixed(2), r.shop, ((r.qty || 0) * (r.price || 0)).toFixed(2)]);
  dl([h, ...rows].map(r => r.join(';')).join('\n'), 'wycena_pelna.csv');
}

Object.assign(window, {
  exportPDF, exportOrderPDF, exportOrderCSV, exportCSV, exportCSVFull,
  buildOrderItems, registerPdfFont, pdfFontName,
});
