# Custom Elements (Composants Web)

## Concept

Les **Custom Elements** permettent de créer ses propres balises HTML réutilisables. C'est un standard du navigateur (pas un framework).

Il y a deux types de composants :
- **Pages** : affichage + logique de chargement de données
- **Éléments** : affichage pur (reçoivent des données via attributs)

## Créer un Custom Element

### Structure de base

```js
class MonComposant extends HTMLElement {
  // Appelé quand l'élément est ajouté au DOM
  connectedCallback() {
    this.innerHTML = `<h1>Bonjour !</h1>`
  }
}

// Enregistrer le composant — le nom DOIT contenir un tiret
customElements.define("mon-composant", MonComposant)
```

**Règle importante :** le nom du tag doit **obligatoirement contenir un tiret** (`-`) pour le distinguer des balises HTML natives.

### Utilisation dans le HTML

```html
<mon-composant></mon-composant>
```

Ou dynamiquement en JS :

```js
const element = document.createElement('mon-composant')
document.querySelector('main').appendChild(element)
```

## Attributs

### Passer des données via attributs

```html
<blog-post cover="image.jpg" title="Mon Article"></blog-post>
```

```js
class BlogPost extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="${this.getAttribute("cover")}" />
      <div>${this.getAttribute("title")}</div>
    `
  }
}

customElements.define("blog-post", BlogPost)
```

### Attributs observés (réactifs)

Pour réagir aux changements d'attributs **après** la création :

```js
class BlogPost extends HTMLElement {
  // Déclarer quels attributs observer
  static observedAttributes = ['cover', 'title']

  // Appelé quand l'élément est ajouté au DOM
  connectedCallback() {
    this.render()
  }

  // Appelé quand un attribut observé change
  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="${this.getAttribute("cover")}" />
      <div>${this.getAttribute("title")}</div>
    `
  }
}

customElements.define("blog-post", BlogPost)
```

**`attributeChangedCallback(name, oldValue, newValue)`** reçoit :
- `name` : le nom de l'attribut qui a changé
- `oldValue` : l'ancienne valeur
- `newValue` : la nouvelle valeur

## Exemple complet : Song Item

```js
class SongItem extends HTMLElement {
  static observedAttributes = ['cover', 'title', 'artist']

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="song-item">
        <img src="${this.getAttribute("cover")}" alt="cover" />
        <div class="song-info">
          <span class="song-title">${this.getAttribute("title")}</span>
          <span class="song-artist">${this.getAttribute("artist")}</span>
        </div>
        <button class="play-button">
          <span class="material-icons">play_arrow</span>
        </button>
      </div>
    `
  }
}

customElements.define("song-item", SongItem)
```

## Créer des éléments dynamiquement à partir de données API

```js
const displaySongs = async () => {
  const songs = await loadSongs()
  const container = document.querySelector('.songs-list')

  songs.forEach(song => {
    const songElement = document.createElement('song-item')
    songElement.setAttribute('cover', song.cover)
    songElement.setAttribute('title', song.title)
    songElement.setAttribute('artist', song.artist.name)
    container.appendChild(songElement)
  })
}
```

## Page comme Custom Element

```js
class PageSongs extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `<div class="loading">Chargement...</div>`

    const songs = await loadSongs()

    this.innerHTML = `
      <h1>Chansons</h1>
      <div class="songs-list"></div>
    `

    const list = this.querySelector('.songs-list')
    songs.forEach(song => {
      const el = document.createElement('song-item')
      el.setAttribute('title', song.title)
      el.setAttribute('cover', song.cover)
      list.appendChild(el)
    })
  }
}

customElements.define("page-songs", PageSongs)
```
