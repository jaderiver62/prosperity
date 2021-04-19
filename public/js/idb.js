// IndexedDB initialization

let db;

const request = indexedDB.open("prosperity_app", 1);

request.onupgradeneeded = event => {
    db = event.target.result;
    db.createObjectStore("prosperity_transaction", {
        autoIncrement: true
    });
};

request.onsuccess = event => {
    db = event.target.result;
    // If application is online, send data to the API
    if (navigator.onLine) {
        uploadTranscations();
    }
};

request.onerror = event => {
    // Console log errors
    console.log(event.target.errorCode);
};

const saveRecord = record => {
    // Store records from offline functionality
    // Start transaction on the database
    // Access objects in store
    // Put record in store
    const transaction = db.transaction(["prosperity_transaction"], "readwrite");
    const prosperityObjectStore = transaction.objectStore("prosperity_transaction");
};