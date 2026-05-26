// ════════════ ENTRY POINT ════════════

import './features/router.js';
import './features/calc.js';
import './features/anchors.js';
import './features/foam.js';
import './features/parapets.js';
import './features/extras.js';
import './features/custom.js';
import './features/prices.js';
import './features/wycena.js';
import './features/pwa.js';
import './features/pdf.js';
import './features/projects.js';
import './features/library.js';
import { parapets, foamItems } from './store/state.js';

// Expose arrays for use by legacy window.calc references
Object.defineProperty(window, '_parapets', { get: () => parapets });
Object.defineProperty(window, '_foamItems', { get: () => foamItems });

// Expose AppData for applyState
window.__AppData = {
  get THICK() { return window.__THICK; }
};
import { THICK } from './data/constants.js';
window.__THICK = THICK;
