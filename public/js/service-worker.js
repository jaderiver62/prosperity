const APP_PREFIX = "ProsperityApp-";
const VERSION = "v01";
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = APP_PREFIX + "Data-" + VERSION;
const FILES_TO_CACHE = [
    "./index.html",
    "./css/sty;es/css",
    "./js/index.js",
    "./idb.js",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-512x512.png"
];
self.addEventListener("fetch", event => {
    // Fetches back end data and stores it in cache
    console.log("Fetch Request: " + event.request.url);
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
            .then(cache => {
                return fetch(event.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => cache.match(event.request));
            })
            // Otherwise get from the cache
            .catch(err => console.log(err))
        );
        return;
    }
    event.respondWith(
        fetch(event.request)
        .catch(() => {
            return caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    } else if (event.request.headers.get("accept").includes("text/html")) {
                        return caches.match("/index.html");
                    }
                })
        })
    );
});
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log("Installing Cache: " + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
        .then(keyList => {
            let cacheKeeplist = keyList.filter(key => key.indexOf(APP_PREFIX));
            // Only keep key's with the app's prefix
            cacheKeeplist.push(CACHE_NAME);
            // Add it to the keeplist
            return Promise.all(keyList.map((key, i) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log("Deleting Cache: " + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});
