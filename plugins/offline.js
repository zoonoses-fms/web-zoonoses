import Vue from 'vue';
const IDB_NAME = process.env.IDB_NAME;
const IDB_VERSION = process.env.IDB_VERSION;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('IndexedDB not supported');
    }

    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onerror = (event) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('DB error: ' + event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('points')) {
        db.createObjectStore('points', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

openDB()
  .then((db) => {
    Vue.$idb = db;

  })
  .catch((error) => {
    console.error(error);
  });
