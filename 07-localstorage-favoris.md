# Web Storage API et Favoris

## Web Storage API

### Deux types de stockage

| | `localStorage` | `sessionStorage` |
|---|---|---|
| **Durée** | Persistant (survit à la fermeture du navigateur) | Session uniquement (supprimé à la fermeture de l'onglet) |
| **Portée** | Partagé entre tous les onglets du même domaine | Un seul onglet |
| **Cas d'usage** | Préférences, favoris, thème | Données temporaires de session |

### Méthodes disponibles

```js
// Stocker une valeur
localStorage.setItem('cle', 'valeur')

// Récupérer une valeur
const valeur = localStorage.getItem('cle')  // 'valeur' ou null si inexistant

// Supprimer une valeur
localStorage.removeItem('cle')

// Tout supprimer
localStorage.clear()
```

**Même API pour `sessionStorage` :**
```js
sessionStorage.setItem('cle', 'valeur')
sessionStorage.getItem('cle')
```

### Limitation importante : tout est stocké en String !

```js
localStorage.setItem('age', 25)
localStorage.getItem('age')  // '25' ← c'est une STRING, pas un nombre !

localStorage.setItem('actif', true)
localStorage.getItem('actif')  // 'true' ← STRING aussi !

localStorage.setItem('data', { nom: 'Alice' })
localStorage.getItem('data')  // '[object Object]' ← INUTILISABLE !
```

### Solution : JSON.stringify / JSON.parse

```js
// Fonctions utilitaires (helpers)
const setItem = (id, value) => localStorage.setItem(id, JSON.stringify(value))
const getItem = (id) => localStorage.getItem(id) && JSON.parse(localStorage.getItem(id))
const removeItem = (id) => localStorage.removeItem(id)
```

**Explication du `&&` dans `getItem` :**
- Si `localStorage.getItem(id)` retourne `null` (clé inexistante), on retourne `null` directement
- Sinon, on parse le JSON
- Cela évite `JSON.parse(null)` qui retourne `null` mais c'est une bonne pratique défensive

### Utilisation des helpers

```js
// Stocker un objet
setItem('user', { nom: 'Alice', age: 30 })

// Récupérer l'objet
const user = getItem('user')  // { nom: 'Alice', age: 30 }

// Stocker un tableau
setItem('scores', [100, 200, 300])

// Récupérer le tableau
const scores = getItem('scores')  // [100, 200, 300]
```

## Système de Favoris

### Implémentation

```js
// Clé unique pour les favoris dans localStorage
const FAVORITES_KEY = 'favorites'

// Ajouter un favori
const addFavorite = (id, song) => {
  const favorites = getItem(FAVORITES_KEY) || {}
  favorites[id] = song
  setItem(FAVORITES_KEY, favorites)
}

// Récupérer un favori
const getFavorite = (id) => {
  const favorites = getItem(FAVORITES_KEY) || {}
  return favorites[id] || null
}

// Supprimer un favori
const removeFavorite = (id) => {
  const favorites = getItem(FAVORITES_KEY) || {}
  delete favorites[id]
  setItem(FAVORITES_KEY, favorites)
}

// Récupérer tous les favoris
const getAllFavorites = () => {
  return getItem(FAVORITES_KEY) || {}
}

// Vérifier si une chanson est en favori
const isFavorite = (id) => {
  return getFavorite(id) !== null
}
```

### Structure des données dans localStorage

```json
{
  "favorites": {
    "42": { "title": "In My Mind", "artist": "Dynoro", "cover": "cover.jpg" },
    "15": { "title": "Blinding Lights", "artist": "The Weeknd", "cover": "cover2.jpg" }
  }
}
```

### Bouton favori dans un composant

```js
class SongItem extends HTMLElement {
  connectedCallback() {
    const songId = this.getAttribute('song-id')
    const isFav = isFavorite(songId)

    this.innerHTML = `
      <div class="song-item">
        <span>${this.getAttribute('title')}</span>
        <button class="fav-button">
          <span class="material-icons">${isFav ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>
    `

    this.querySelector('.fav-button').addEventListener('click', () => {
      if (isFavorite(songId)) {
        removeFavorite(songId)
      } else {
        addFavorite(songId, {
          title: this.getAttribute('title'),
          artist: this.getAttribute('artist'),
          cover: this.getAttribute('cover')
        })
      }
      // Re-render pour mettre à jour l'icône
      this.connectedCallback()
    })
  }
}
```

### Page des favoris

```js
class PageFavorites extends HTMLElement {
  connectedCallback() {
    const favorites = getAllFavorites()
    const entries = Object.entries(favorites)

    this.innerHTML = `
      <h1>Mes Favoris (${entries.length})</h1>
      <div class="favorites-list"></div>
    `

    const list = this.querySelector('.favorites-list')
    entries.forEach(([id, song]) => {
      const el = document.createElement('song-item')
      el.setAttribute('song-id', id)
      el.setAttribute('title', song.title)
      el.setAttribute('artist', song.artist)
      el.setAttribute('cover', song.cover)
      list.appendChild(el)
    })
  }
}

customElements.define("page-favorites", PageFavorites)
```
