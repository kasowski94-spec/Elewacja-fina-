// ════════════ GLOBALNY STAN APLIKACJI ════════════
// Centralny stan — mutowany przez feature modules

import { CUSTOM_TABS, PARAPET_DEFAULTS } from '../data/constants.js';

// Aktywny wariant grubości EPS
export let selectedVariant = 15;
export const setSelectedVariant = v => { selectedVariant = v; };

// Parapety
export let parapets = [];
export const setParapets = v => { parapets = v; };

// Źródła cen
export let priceSources = [];
export let priceCompData = null;
export const setPriceCompData = v => { priceCompData = v; };

// Projekty
export let projects = {};
export let currentProject = null;
export const setCurrentProject = id => { currentProject = id; };
export const setProjects = v => { projects = v; };

// Wiersze wyceny
export let wycenaRows = [];
export const setWycenaRows = v => { wycenaRows = v; };

// Ręczne nadpisania wyceny
export let wycenaManualEdits = {};
export const setWycenaManualEdits = v => { wycenaManualEdits = v; };

// Własne pozycje
export let customItems = {};
CUSTOM_TABS.forEach(t => { customItems[t] = []; });

// Pianki
export let foamItems = [{ type: 'niskoprezna', count: 4 }];
export const setFoamItems = v => { foamItems = v; };

// Biblioteka — tryb, filtr, ulubione
export let libMode = 'mat';
export let libCatActive = '';
export let favorites = [];
export let libPickerTarget = null;
export const setLibMode = v => { libMode = v; };
export const setLibCatActive = v => { libCatActive = v; };
export const setFavorites = v => { favorites = v; };
export const setLibPickerTarget = v => { libPickerTarget = v; };

// Data ostatniej aktualizacji cennika
export let lastPriceUpdate = null;
export const setLastPriceUpdate = v => { lastPriceUpdate = v; };

// Tryb wyświetlania cen biblioteki (netto / brutto)
export let priceMode = 'netto';
export const setPriceMode = v => { priceMode = v; };
