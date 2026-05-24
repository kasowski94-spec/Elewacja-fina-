// ════════════ STORAGE SERVICE — IndexedDB + localStorage ════════════

const DB_NAME = 'elewacjapro';
const DB_VER = 1;

let db = null;

export function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('projects'))
        d.createObjectStore('projects', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('settings'))
        d.createObjectStore('settings', { keyPath: 'key' });
    };
    req.onsuccess = e => { db = e.target.result; res(db); };
    req.onerror = () => rej(req.error);
  });
}

export async function idbSaveProjects(data) {
  try { localStorage.setItem('elewacjapro_v4', JSON.stringify(data)); } catch (e) {}
  if (!db) return;
  return new Promise(res => {
    const tx = db.transaction('projects', 'readwrite');
    const store = tx.objectStore('projects');
    store.clear();
    for (const [id, proj] of Object.entries(data)) {
      store.put({ id, ...proj });
    }
    tx.oncomplete = () => res();
    tx.onerror = () => res();
    tx.onabort = () => res();
  });
}

export async function idbLoadProjects() {
  if (!db) {
    try { return JSON.parse(localStorage.getItem('elewacjapro_v4') || '{}'); } catch (e) { return {}; }
  }
  return new Promise(res => {
    const tx = db.transaction('projects', 'readonly');
    const store = tx.objectStore('projects');
    const req = store.getAll();
    req.onsuccess = () => {
      const data = {};
      req.result.forEach(p => { const { id, ...rest } = p; data[id] = rest; });
      if (!Object.keys(data).length) {
        try {
          const ls = JSON.parse(localStorage.getItem('elewacjapro_v4') || '{}');
          Object.assign(data, ls);
        } catch (e) {}
      }
      res(data);
    };
    req.onerror = () => res({});
  });
}
