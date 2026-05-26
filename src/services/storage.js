const DB_NAME = 'elewacjapro';
const DB_VER  = 1;
const STORE   = 'projects';
let _db = null;

export function openDB() {
  return new Promise((res, rej) => {
    if (_db) { res(_db); return; }
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
    req.onsuccess = e => { _db = e.target.result; res(_db); };
    req.onerror = () => rej(req.error);
  });
}

export function idbSaveProjects(projects) {
  if (!_db) return;
  try {
    const tx = _db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(projects, 'all');
  } catch (e) {}
}

export function idbLoadProjects() {
  return new Promise(res => {
    if (!_db) { res({}); return; }
    try {
      const tx = _db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get('all');
      req.onsuccess = () => {
        const data = req.result;
        if (data && typeof data === 'object') { res(data); return; }
        try {
          const s = localStorage.getItem('elewacjapro_v4');
          res(s ? JSON.parse(s) : {});
        } catch { res({}); }
      };
      req.onerror = () => res({});
    } catch { res({}); }
  });
}
