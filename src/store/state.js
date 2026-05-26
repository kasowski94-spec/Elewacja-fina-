// ════════════ GLOBAL STATE ════════════

export let projects = {};
export let currentProject = null;
export let selectedVariant = 15;
export let parapets = [];
export let foamItems = [{ type: 'niskoprezna', count: 4 }];
export let customItems = { ustawienia: [], materialy: [], parapety: [], dodatki: [], lacze: [] };
export let wycenaRows = [];
export let wycenaManualEdits = {};
export let priceSources = [];
export let priceCompData = null;
export let lastPriceUpdate = null;
export let libMode = 'mat';
export let libCatActive = '';
export let favorites = [];
export let libPickerTarget = null;
export let priceMode = 'netto';
export let clientMargin = 0;

export function setProjects(v) { projects = v; }
export function setCurrentProject(v) { currentProject = v; }
export function setSelectedVariant(v) { selectedVariant = v; }
export function setParapets(v) { parapets = v; }
export function setFoamItems(v) { foamItems = v; }
export function setWycenaRows(v) { wycenaRows = v; }
export function setWycenaManualEdits(v) { wycenaManualEdits = v; }
export function setPriceCompData(v) { priceCompData = v; }
export function setLastPriceUpdate(v) { lastPriceUpdate = v; }
export function setLibMode(v) { libMode = v; }
export function setLibCatActive(v) { libCatActive = v; }
export function setFavorites(v) { favorites = v; }
export function setLibPickerTarget(v) { libPickerTarget = v; }
export function setPriceMode(v) { priceMode = v; }
export function setClientMargin(v) { clientMargin = v; }
