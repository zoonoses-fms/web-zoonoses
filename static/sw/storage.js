let data = null;
let type = null;
let idb = null;

const IDB_NAME = 'zoonoses';
const IDB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!self.indexedDB) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('IndexedDB not supported');
    }

    const request = self.indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onerror = (event) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('DB error: ' + event.target.error);
    };

    request.onupgradeneeded = (event) => {};

    request.onsuccess = (event) => {
      resolve(event.target.result);
      idb = request.result;
    };
  });
};

openDB();

self.addEventListener('message', (event) => {
  if (
    Object.prototype.hasOwnProperty.call(event.data, 'data') &&
    Object.prototype.hasOwnProperty.call(event.data, 'type')
  ) {
    // receives form data from script.js upon submission
    data = event.data.data;
    type = event.data.type;
  }
});

self.addEventListener('fetch', function (event) {
  if (event.request.clone().method === 'PUT') {
    event.respondWith(
      fetch(event.request.clone()).catch(() => {
        // only save post requests in browser, if an error occurs
        savePostRequests(event.request.clone().url, data, type);
      })
    );
  }
});

function getObjectStore(storeName, mode) {
  return idb.transaction(storeName, mode).objectStore(storeName);
}
function savePostRequests(url, payload, type) {
  console.log(type);
  const request = getObjectStore(type, 'readwrite').add({
    url,
    payload,
    method: 'PUT',
  });
  request.onsuccess = function (event) {
    console.log('added to indexedb');
  };
  request.onerror = function (error) {
    console.error(error);
  };
}

navigator.serviceWorker.ready
  .then(function (registration) {
    console.log('Service Worker Ready');
    return registration.sync.register('sendFormData');
  })
  .then(function () {
    console.log('sync event registered');
  })
  .catch(function () {
    // system was unable to register for a sync,
    // this could be an OS-level restriction
    console.log('sync registration failed');
  });
