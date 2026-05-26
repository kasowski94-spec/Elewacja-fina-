// ════════════ ELEWACJAPRO — ENTRY POINT ════════════
// ES Module entry: imports all feature modules which register themselves on window

import { CUSTOM_TABS } from './data/constants.js';
import { customItems } from './store/state.js';
import { parapets } from './store/state.js';
import { foamItems } from './store/state.js';

// Wire state arrays to window-accessible references (wycena.js and calc.js use window._*)
// These are live-binding proxies so mutations stay in sync
Object.defineProperty(window, '_parapets', { get: () => parapets, configurable: true });
Object.defineProperty(window, '_foamItems', { get: () => foamItems, configurable: true });

// Initialize customItems tabs
CUSTOM_TABS.forEach(t => { if (!customItems[t]) customItems[t] = []; });

// ── Data / Utils (no side effects) ──
import './data/library.js';
import './utils/format.js';
import './utils/dom.js';
import './utils/math.js';
import './utils/debounce.js';
import './utils/download.js';

// ── Services ──
import './services/storage.js';

// ── Feature modules (each calls Object.assign(window, {...}) at module level) ──
import './features/foam.js';
import './features/parapets.js';
import './features/extras.js';
import './features/custom.js';
import './features/anchors.js';
import './features/library.js';
import './features/prices.js';
import './features/projects.js';
import './features/wycena.js';
import './features/calc.js';
import './features/router.js';
import './features/pdf.js';

// ── PWA (last: contains async startup IIFE that uses all above) ──
import './features/pwa.js';
