const request = indexedDB.open('migration-demo', 7);
let db;

request.onblocked = () => {
  console.log('Upgrade blocked');
};

request.onsuccess = () => {
  console.log('Upgrade completed');
};

request.onupgradeneeded = (event) => {
  db = event.target.result;

  db.onversionchange = () => {
    console.log('Version change detected');
  };
  const transaction = event.target.transaction;
  if (!db.objectStoreNames.contains('todos')) {
    db.createObjectStore('todos', {
      keyPath: 'id'
    });
  }

  if (!db.objectStoreNames.contains('users')) {
    db.createObjectStore('users', {
      keyPath: 'id'
    });
  }

  const store = transaction.objectStore('todos');
  if (!store.indexNames.contains('statusIndex')) {
    store.createIndex('statusIndex', 'status');
  }
};
