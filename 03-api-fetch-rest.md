# API, Fetch et REST

## API REST

### Qu'est-ce qu'une API REST ?

Une **API** (Application Programming Interface) est une interface qui permet à des programmes de communiquer entre eux. **REST** (Representational State Transfer) est un style d'architecture pour les APIs web.

### Structure des endpoints

```
GET /api/songs              → Liste toutes les chansons
GET /api/songs/:id          → Récupère une chanson par son ID
GET /api/artists            → Liste tous les artistes
GET /api/artists/:id        → Récupère un artiste par son ID
GET /api/songs/search/:query → Recherche des chansons
```

`:id` et `:query` sont des **paramètres dynamiques** remplacés par des valeurs réelles :
```
GET /api/songs/42           → Chanson avec l'ID 42
GET /api/songs/search/dynoro → Recherche "dynoro"
```

## Fetch API

### Qu'est-ce que Fetch ?

`fetch()` est une fonction native du navigateur pour faire des **requêtes HTTP**. Elle retourne une **Promise**.

### Promises (Promesses)

Une Promise représente une valeur qui sera disponible **dans le futur** :
- **pending** : en attente
- **fulfilled** : résolue (succès)
- **rejected** : rejetée (erreur)

### Syntaxe avec async/await (recommandée)

```js
async function loadJson(url) {
  const response = await fetch(url)     // Attend la réponse HTTP
  const parsedJson = await response.json() // Attend le parsing du JSON
  return parsedJson
}

// Utilisation
const songs = await loadJson('/api/songs')
```

**`async`** : déclare que la fonction est asynchrone et retourne une Promise.
**`await`** : met en pause l'exécution jusqu'à ce que la Promise soit résolue.

### Syntaxe avec .then() (alternative)

```js
const loadJson = (url) => fetch(url).then((response) => response.json())

// Utilisation
loadJson('/api/songs').then((songs) => {
  console.log(songs)
})
```

### L'objet Response

```js
const response = await fetch('/api/songs')

response.status      // 200, 404, 500...
response.ok          // true si status 200-299
response.json()      // Parse le body en JSON (retourne une Promise)
response.text()      // Récupère le body en texte brut
```

### Exemple complet : API Client

```js
// api.js
const BASE_URL = 'https://mon-api.com'

export const loadSongs = async () => {
  const response = await fetch(`${BASE_URL}/api/songs`)
  return await response.json()
}

export const loadSong = async (id) => {
  const response = await fetch(`${BASE_URL}/api/songs/${id}`)
  return await response.json()
}

export const loadArtist = async (id) => {
  const response = await fetch(`${BASE_URL}/api/artists/${id}`)
  return await response.json()
}

export const searchSongs = async (query) => {
  const response = await fetch(`${BASE_URL}/api/songs/search/${encodeURIComponent(query)}`)
  return await response.json()
}
```

### encodeURIComponent

Encode les caractères spéciaux pour les URLs :

```js
encodeURIComponent("rock & roll")  // "rock%20%26%20roll"
encodeURIComponent("café")         // "caf%C3%A9"
```

**Toujours utiliser `encodeURIComponent()`** quand on insère des données utilisateur dans une URL.
