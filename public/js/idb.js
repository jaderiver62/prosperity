// IndexedDB initialization

const {
    response
} = require("express");

let database;

const request = indexedDB.open("prosperity_app", 1);

request.onupgradeneeded = event => {
    database = event.target.result;
    database.createObjectStore("prosperity_transaction", {
        autoIncrement: true
    });
};

request.onsuccess = event => {
    database = event.target.result;
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
    const transaction = database.transaction(["prosperity_transaction"], "readwrite");
    // Start transaction on the database
    const prosperityObjectStore = transaction.objectStore("prosperity_transaction");
    // Access objects in store
    prosperityObjectStore.add(record);
    // Put record in store
};

const uploadTranscations = () => {
    // When online, upload new records
    const transaction = database.transaction(["prosperity_transaction"], "readwrite");
    // Start transaction on the database
    const prosperityObjectStore = transaction.objectStore("prosperity_transaction");
    const getAll = prosperityObjectStore.getAll();
    // Retrieve all records in store
    getAll.onsuccess = () => {

        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, *?*",
                        "Content-Type": "application/json"
                    }
                })
                .then(serverResponse => serverResponse.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = database.transaction(["prosperity_transaction"], "readwrite");
                    const budgetObjectStore = transaction.objectStore("prosperity_transaction");
                    budgetObjectStore.clear();
                    // All items in store are cleared out
                })
                .catch(err => console.log(err));
        }
    };
};
window.addEventListener("online", uploadTranscations);
// Listen for the application getting online again