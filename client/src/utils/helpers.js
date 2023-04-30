// Helper function that takes in a name(string) and adds an s to the end if count !== 1
export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
}

// Accesses the indexDB and creates object stores and uses the object stores
export function idbPromise(storeName, method, object) {
  // We return a promise to handle async operations
  return new Promise((resolve, reject) => {
    // opens the shop-shop DB from indexedDB
    const request = window.indexedDB.open('shop-shop', 1);
    // inits a few variables for later setting
    let db, tx, store;
    // when request is built, set up the products, categories, and cart object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };
    // if there was an error opening the db, console log
    request.onerror = function (e) {
      console.log('There was an error');
    };
    // on success, change db to request.result (the database in question?)
    // tx is set to db.transaction(the store in question, readwrite)
    // store is set to the transaction's object store
    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log('error', e);
      };

      // switch statment that handles the various methods
      switch (method) {
        // change the object in question and resolve the promise
        case 'put':
          store.put(object);
          resolve(object);
          break;
        // get the objects in question and resolve the promise
        case 'get':
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        // delete the object in question
        case 'delete':
          store.delete(object._id);
          break;
        // handle default
        default:
          console.log('No valid method');
          break;
      }

      // once transaction is complete, close the DB
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
