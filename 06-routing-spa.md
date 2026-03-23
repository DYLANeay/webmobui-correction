# Routing et SPA (Single Page Application)

## Concept de SPA

Une **Single Page Application** est une application web qui charge une seule page HTML et met à jour dynamiquement le contenu **sans recharger la page**. La navigation se fait côté client (JavaScript).

## Routing par Hash

Le **hash** (`#`) dans l'URL permet de naviguer sans recharger la page :

```
https://monsite.com/#home
https://monsite.com/#artists
https://monsite.com/#artists/12
https://monsite.com/#search/dynoro
```

**Pourquoi le hash ?**
- Le navigateur ne recharge pas la page quand le hash change
- Le hash est accessible via `window.location.hash`
- L'événement `hashchange` se déclenche automatiquement

## Router V1 : Click listeners (déconseillé)

```js
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const page = e.target.getAttribute('href')
    navigateTo(page)
  })
})
```

**Problèmes du V1 :**
- Il faut intercepter **chaque** lien manuellement
- Casse le clic droit → "Ouvrir dans un nouvel onglet"
- Invasif : modifie le comportement natif des liens
- Mauvais pour le SEO

## Router V2 : hashchange (recommandé)

### Principe

1. Les liens utilisent des `href` avec des hash : `<a href="#artists">Artistes</a>`
2. On écoute l'événement `hashchange` sur `window`
3. Une fonction router analyse le hash et affiche le contenu correspondant

### Implémentation complète

```js
const router = () => {
  const main = document.querySelector('main')
  const hashes = (window.location.hash || '#home').split('/')
  const hash = hashes[0]

  // Vider le contenu précédent
  main.innerHTML = ''

  if (hash === '#home' || hash === '') {
    // Page d'accueil
    const page = document.createElement('page-home')
    main.appendChild(page)

  } else if (hash === '#songs') {
    // Liste des chansons
    const page = document.createElement('page-songs')
    main.appendChild(page)

  } else if (hash === '#artists' && hashes[1]) {
    // Détail d'un artiste (ex: #artists/12)
    const page = document.createElement('page-artist')
    page.setAttribute('artist-id', hashes[1])
    main.appendChild(page)

  } else if (hash === '#artists') {
    // Liste des artistes
    const page = document.createElement('page-artists')
    main.appendChild(page)

  } else if (hash === '#search' && hashes[1]) {
    // Résultats de recherche (ex: #search/dynoro)
    const page = document.createElement('page-search')
    page.setAttribute('query', decodeURIComponent(hashes[1]))
    main.appendChild(page)
  }
}

// Écouter les changements de hash
window.addEventListener('hashchange', router)

// Appeler le router une fois au chargement initial
router()
```

### Parsing de l'URL

```js
// Exemple : window.location.hash = '#artists/12'
const hashes = window.location.hash.split('/')
// hashes = ['#artists', '12']
// hashes[0] = '#artists'  → la route
// hashes[1] = '12'        → le paramètre
```

### Navigation HTML

```html
<nav>
  <a href="#home">Accueil</a>
  <a href="#songs">Chansons</a>
  <a href="#artists">Artistes</a>
</nav>

<main>
  <!-- Le contenu est injecté ici par le router -->
</main>
```

### Navigation programmatique

```js
// Changer de page depuis le JavaScript
window.location.hash = '#artists/42'

// Pour la recherche, encoder les caractères spéciaux
const query = "rock & roll"
window.location.hash = '#search/' + encodeURIComponent(query)
// Résultat : #search/rock%20%26%20roll
```

## Avantages du Router V2

| Aspect | V1 (click) | V2 (hashchange) |
|--------|-----------|-----------------|
| Clic droit | ❌ Cassé | ✅ Fonctionne |
| Bouton retour | ❌ Ne marche pas | ✅ Fonctionne |
| Partage d'URL | ❌ Impossible | ✅ L'URL reflète la page |
| SEO | ❌ Mauvais | ✅ Meilleur |
| Invasivité | ❌ Très invasif | ✅ Peu invasif |

## Recherche avec le Router

### Barre de recherche

```html
<form id="search-form">
  <input type="text" id="search-input" placeholder="Rechercher..." />
  <button type="submit">Rechercher</button>
</form>
```

```js
const form = document.querySelector('#search-form')
const input = document.querySelector('#search-input')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const query = input.value.trim()
  if (query) {
    window.location.hash = '#search/' + encodeURIComponent(query)
  }
})
```

### Page de recherche

```js
class PageSearch extends HTMLElement {
  async connectedCallback() {
    const query = this.getAttribute('query')
    const results = await searchSongs(query)

    this.innerHTML = `
      <h1>Résultats pour "${query}"</h1>
      <div class="results"></div>
    `

    const container = this.querySelector('.results')
    results.forEach(song => {
      const el = document.createElement('song-item')
      el.setAttribute('title', song.title)
      el.setAttribute('cover', song.cover)
      container.appendChild(el)
    })
  }
}

customElements.define("page-search", PageSearch)
```
