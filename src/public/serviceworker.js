const CACHE_NAME = 'moncache';

self.addEventListener('fetch', (event) => {
	// Ignorer les requêtes internes de Vite (HMR, timestamps, etc.)
	const url = new URL(event.request.url);
	if (url.searchParams.has('t') || url.pathname.startsWith('/@')) return;

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			const fetchPromise = fetch(event.request)
				.then((networkResponse) => {
					// On ne met en cache que les réponses valides
					if (networkResponse?.status === 200) {
						const responseClone = networkResponse.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(event.request, responseClone);
						});
					}
					return networkResponse;
				})
				.catch((error) => {
					// Si réseau HS et pas de cache, on propage l'erreur
					if (!cachedResponse) {
						throw error;
					}
				});

			// SWR = on renvoie le cache tout de suite si dispo,
			// sinon on attend le réseau
			return cachedResponse || fetchPromise;
		}),
	);
});

self.addEventListener('install', (event) => {
	// On peut pré-cacher des ressources ici si besoin
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				// '/index.html',
				// '/css/index.css',
				// '/js/index.js',
				// '/js/player.js',
				// '/manifest.webmanifest',
			]);
		}),
	);
});

self.addEventListener('activate', () => {});
