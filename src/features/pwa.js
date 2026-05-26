// ════════════ PWA: SW, INSTALL, OFFLINE, TOAST, NAV ════════════

import { TABS_ORDER, CUSTOM_TABS } from '../data/constants.js';
import { projects, currentProject, setProjects, setCurrentProject } from '../store/state.js';
import { openDB, idbLoadProjects } from '../services/storage.js';

// ── Toast ──
export function showToast(msg, dur = 3000) {
  let el = document.getElementById('pwa-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pwa-toast';
    el.style.cssText = 'position:fixed;bottom:calc(80px + var(--safe-bot));left:50%;transform:translateX(-50%) translateY(20px);background:var(--card2);color:var(--txt);border:1px solid var(--brd);border-radius:25px;padding:10px 20px;font-size:.8rem;font-weight:600;z-index:600;opacity:0;transition:all .3s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.4);max-width:90vw;text-align:center;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(10px)';
  }, dur);
}

// ── Haptic ──
export function haptic(pattern = [10]) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// ── Online/Offline ──
function updateOnlineStatus() {
  document.body.classList.toggle('offline', !navigator.onLine);
}
window.addEventListener('online', () => { updateOnlineStatus(); showToast('🌐 Połączono z internetem'); });
window.addEventListener('offline', () => { updateOnlineStatus(); showToast('📵 Tryb offline — dane zapisane lokalnie'); });
updateOnlineStatus();

// ── Service Worker ──
let swReg = null;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      swReg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      console.log('SW registered:', swReg.scope);
      swReg.addEventListener('updatefound', () => {
        const nw = swReg.installing;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            document.getElementById('update-banner')?.classList.add('show');
          }
        });
      });
    } catch (e) { console.warn('SW failed:', e); }
  });
}

export function updateApp() {
  if (swReg?.waiting) swReg.waiting.postMessage('skipWaiting');
  window.location.reload();
}

// ── Install Banner ──
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const dismissed = localStorage.getItem('pwa-dismissed');
  if (!dismissed) setTimeout(() => document.getElementById('install-banner')?.classList.add('show'), 3000);
});
window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner')?.classList.remove('show');
  showToast('✅ Aplikacja zainstalowana');
});

// ── Bottom Nav ──
export function bnActive(btn) {
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

export function showMoreTabs() {
  document.getElementById('more-sheet').style.transform = 'translateY(0)';
  document.getElementById('more-overlay').style.display = 'block';
}

export function hideMore() {
  document.getElementById('more-sheet').style.transform = 'translateY(100%)';
  document.getElementById('more-overlay').style.display = 'none';
}

// ── Swipe Gestures ──
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!e.changedTouches[0]) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.8) return;
  const target = e.target;
  if (target.closest('input,select,textarea,.wr,.we-row')) return;
  const active = document.querySelector('.tab-panel.active');
  if (!active) return;
  const cur = active.id.replace('tab-', '');
  const idx = TABS_ORDER.indexOf(cur);
  if (idx < 0) return;
  if (dx < -60 && idx < TABS_ORDER.length - 1) { window.swTab?.(TABS_ORDER[idx + 1]); haptic([5]); }
  if (dx > 60 && idx > 0) { window.swTab?.(TABS_ORDER[idx - 1]); haptic([5]); }
}, { passive: true });

// ── Topbar height CSS var ──
function updateTopbarH() {
  const tb = document.getElementById('topbar');
  if (tb) document.documentElement.style.setProperty('--topbar-h', tb.offsetHeight + 'px');
}

// ── Async Startup ──
(async () => {
  await openDB();
  const saved = await idbLoadProjects();
  if (Object.keys(saved).length) Object.assign(projects, saved);
  if (!Object.keys(projects).length) {
    const id = 'proj_default';
    projects[id] = { name: 'Projekt domyślny', data: null };
    window.saveProjects?.();
  }
  setCurrentProject(Object.keys(projects)[0]);
  window.refreshProjectSelect?.();
  const st = projects[currentProject]?.data;
  if (st) window.applyState?.(st);
  else { window.updateWallU?.(); window.recAnchors?.(); }
  const _et = document.getElementById('epsThick');
  if (_et) {
    const { selectedVariant } = await import('../store/state.js');
    _et.value = String(selectedVariant);
  }
  window.renderFoam?.();
  window.calcAnchor?.();
  window.renderFallback?.();
  window.calc?.();
  window.renderParapets?.();
  CUSTOM_TABS.forEach(t => window.renderCustom?.(t));
  window.buildExtras?.();
  window.renderLaborLibrary?.();
  window.loadFavorites?.();
  window.renderLibCatFilter?.();
  window.renderLibrary?.();
  window.updKolekOptions?.();
  window.updatePriceDate?.();

  const params = new URLSearchParams(window.location.search);
  if (params.get('action') === 'new') window.newProjectModal?.();
  if (params.get('tab')) window.swTab?.(params.get('tab'));

  showToast('ElewacjaPro gotowy' + (navigator.onLine ? ' 🌐' : ' 📵 offline'));
})();

Object.assign(window, { showToast, haptic, updateApp, bnActive, showMoreTabs, hideMore });

// ── DOMContentLoaded init ──
document.addEventListener('DOMContentLoaded', () => {
  window.buildPricesGrid?.();
  window.renderSources?.();
  const dtEl = document.getElementById('wycena-data');
  if (dtEl) dtEl.value = new Date().toISOString().split('T')[0];
  updateTopbarH();
  window.addEventListener('resize', updateTopbarH);
  if (typeof ResizeObserver !== 'undefined') {
    const tb = document.getElementById('topbar');
    if (tb) new ResizeObserver(updateTopbarH).observe(tb);
  }
  window.buildSubtabs?.('ustawienia');

  // Install banner buttons
  const banner = document.getElementById('install-banner');
  document.getElementById('ib-install')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    banner?.classList.remove('show');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (outcome === 'accepted') showToast('✅ ElewacjaPro zainstalowano!');
  });
  document.getElementById('ib-dismiss')?.addEventListener('click', () => {
    banner?.classList.remove('show');
    localStorage.setItem('pwa-dismissed', '1');
  });

  // Sync bottom nav with swTab
  const TAB_PARENT = {
    porownanie: 'ceny',
    biblioteka: null,
    parapety: null,
    dodatki: null,
    lacze: null,
    rusztowanie: null,
  };
  const origSwTab = window.swTab;
  if (origSwTab) {
    window.swTab = function (name) {
      origSwTab(name);
      document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
      const bnBtn = document.querySelector(`#bottom-nav .bn-item[data-tab="${name}"]`);
      if (bnBtn) {
        bnBtn.classList.add('active');
      } else if (Object.prototype.hasOwnProperty.call(TAB_PARENT, name)) {
        const parentTab = TAB_PARENT[name];
        if (parentTab) {
          document.querySelector(`#bottom-nav .bn-item[data-tab="${parentTab}"]`)?.classList.add('active');
        } else {
          document.getElementById('bn-more')?.classList.add('active');
        }
      }
      hideMore();
      window.scrollTo(0, 0);
    };
  }

  // calc wrapper — autosave indicator
  const origCalc = window.calc;
  if (origCalc) {
    window.calc = function () {
      origCalc();
      const chip = document.getElementById('chip-total');
      if (chip) {
        chip.style.borderColor = 'var(--grn)';
        setTimeout(() => { chip.style.borderColor = 'var(--acc)'; }, 400);
      }
    };
  }
});
