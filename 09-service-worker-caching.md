# Service Worker et Stratégies de Cache

## Service Worker

### Qu'est-ce que c'est ?

Un **Service Worker** est un fichier JavaScript qui s'exécute **en arrière-plan**, séparément de la page web. Il agit comme un **proxy** entre le navigateur et le réseau : il intercepte toutes les requêtes et peut décider de les servir depuis le cache ou le réseau.

### Caractéristiques

- Fonctionne en **arrière-plan** (thread séparé)
- **Pas d'accès au DOM** (ne peut pas manipuler `document`)
- Fonctionne uniquement en **HTTPS** (ou localhost)
- Entièrement **asynchrone** (utilise des Promises)
- Peut intercepter les **requêtes réseau** (événement `fetch`)

### Cycle de vie

```
Installation → Activation → Idle (attente)
                               ↓
                    Fetch / Message / Terminated
```

1. **Installing** : le Service Worker est en cours d'installation
2. **Activated** : le SW est actif et contrôle les pages
3. **Idle** : en attente d'événements
4. **Fetch** : intercepte une requête réseau
5. **Terminated** : le navigateur peut arrêter le SW pour économiser des ressources

### Enregistrement du Service Worker

Dans `index.js` (ou le script principal) :

```js
// Vérifier que le navigateur supporte les Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker enregistré :', registration)
    })
    .catch((error) => {
      console.log('Erreur d\'enregistrement :', error)
    })
}
```

### Le fichier Service Worker (`sw.js`)

```js
const CACHE_NAME = 'app-cache-v1'

// Liste des fichiers à mettre en cache à l'installation
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/style.css',
  '/images/logo.png'
]

// ─── ÉVÉNEMENT INSTALL ───
// Se déclenche quand le SW est installé pour la première fois
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert')
        return cache.addAll(urlsToCache)
      })
  )
})

// ─── ÉVÉNEMENT ACTIVATE ───
// Se déclenche quand le SW est activé
// Bon moment pour nettoyer les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
})

// ─── ÉVÉNEMENT FETCH ───
// Se déclenche à chaque requête réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Stratégie choisie ici (voir ci-dessous)
  )
})
```

### `event.waitUntil()`

Dit au navigateur de **ne pas terminer** le Service Worker tant que la Promise passée n'est pas résolue. Crucial pour s'assurer que le cache est bien rempli avant que le SW ne devienne actif.

### `event.respondWith()`

Intercepte la requête et **fournit une réponse** (depuis le cache ou le réseau).

---

## Cache API

```js
// Ouvrir (ou créer) un cache
const cache = await caches.open('mon-cache')

// Ajouter un fichier au cache
await cache.add('/index.html')

// Ajouter plusieurs fichiers
await cache.addAll(['/index.html', '/style.css', '/app.js'])

// Stocker une paire requête/réponse manuellement
await cache.put(request, response)

// Chercher dans le cache
const response = await cache.match(request)

// Chercher dans TOUS les caches
const response = await caches.match(request)

// Supprimer un cache entier
await caches.delete('mon-cache')

// Lister tous les caches
const noms = await caches.keys()
```

---

## Stratégies de Cache

### 1. Cache Only (Cache uniquement)

Sert **toujours** depuis le cache. Ne fait jamais de requête réseau.

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
  )
})
```

**Usage :** fichiers statiques qui ne changent jamais.
**Problème :** si le fichier n'est pas en cache, erreur.

### 2. Network Only (Réseau uniquement)

Va **toujours** sur le réseau. N'utilise jamais le cache.

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
  )
})
```

**Usage :** données temps réel (API en direct).
**Problème :** ne fonctionne pas hors ligne.

### 3. Cache First (Cache d'abord)

Cherche dans le cache. Si trouvé → sert depuis le cache. Sinon → va sur le réseau et met en cache.

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si trouvé dans le cache, retourner
        if (response) {
          return response
        }
        // Sinon, aller sur le réseau
        return fetch(event.request).then((networkResponse) => {
          // Mettre en cache pour la prochaine fois
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
            return networkResponse
          })
        })
      })
  )
})
```

**Usage :** ressources qui changent rarement (CSS, images, polices).
**Avantage :** rapide + fonctionne hors ligne après le premier chargement.

### 4. Network First (Réseau d'abord)

Va sur le réseau. Si ça échoue → sert depuis le cache.

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Mettre à jour le cache avec la réponse fraîche
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
      })
      .catch(() => {
        // En cas d'erreur réseau, servir depuis le cache
        return caches.match(event.request)
      })
  )
})
```

**Usage :** données qui changent souvent mais doivent être dispo hors ligne (articles, API).
**Avantage :** données toujours fraîches quand en ligne, fallback hors ligne.

### 5. Stale While Revalidate (Servir le cache, rafraîchir en arrière-plan)

Sert **immédiatement** depuis le cache ET lance une requête réseau en parallèle pour **mettre à jour le cache** pour la prochaine fois.

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Lancer la requête réseau en parallèle
        const networkFetch = fetch(event.request).then((networkResponse) => {
          // Mettre à jour le cache en arrière-plan
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })
          return networkResponse
        })

        // Retourner le cache immédiatement, ou attendre le réseau
        return cachedResponse || networkFetch
      })
  )
})
```

**Usage :** contenu qui peut être légèrement périmé (avatar, profil).
**Avantage :** réponse instantanée + mise à jour en arrière-plan.

---

## Résumé des stratégies

| Stratégie | Priorité | Hors ligne | Fraîcheur |
|-----------|----------|------------|-----------|
| Cache Only | Cache | ✅ | ❌ Jamais mis à jour |
| Network Only | Réseau | ❌ | ✅ Toujours frais |
| Cache First | Cache → Réseau | ✅ | ⚠️ Cache peut être périmé |
| Network First | Réseau → Cache | ✅ (fallback) | ✅ Frais quand en ligne |
| Stale While Revalidate | Cache + Réseau en parallèle | ✅ | ⚠️ Frais au prochain chargement |

## Mise à jour du Service Worker

Quand on modifie `sw.js` :
1. Le navigateur détecte le changement
2. Le nouveau SW est **installé** mais reste en attente
3. Il n'est **activé** qu'une fois que tous les onglets utilisant l'ancien SW sont fermés
4. À l'activation, on nettoie les anciens caches (voir événement `activate`)

Pour forcer l'activation immédiate :

```js
self.addEventListener('install', (event) => {
  self.skipWaiting()  // Prend le contrôle immédiatement
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())  // Contrôle toutes les pages ouvertes
})
```
