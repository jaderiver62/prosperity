const { response } = require("express");

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
        }