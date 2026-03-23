# Événements et Pattern Observer

## Le Pattern Observer

Le pattern Observer définit une relation entre :
- Un **Observable** (sujet) : celui qui **émet** des événements → `dispatchEvent`
- Un **Observer** (observateur) : celui qui **écoute** des événements → `addEventListener`

```
Observable  ──── dispatchEvent() ────►  Observer
(émet)                                  (écoute avec addEventListener)
```

## addEventListener (écouter un événement)

```js
// Syntaxe : element.addEventListener('nom_evenement', callback)

const bouton = document.querySelector('#mon-bouton')
bouton.addEventListener('click', (event) => {
  console.log('Bouton cliqué !')
})
```

### Événements natifs courants
- `click` : clic souris
- `submit` : soumission de formulaire
- `input` : saisie dans un champ
- `change` : changement de valeur
- `keydown` / `keyup` : touche clavier
- `hashchange` : changement du hash dans l'URL

## dispatchEvent (émettre un événement)

```js
// Créer un événement personnalisé
const monEvent = new CustomEvent('mon_evenement')

// Émettre l'événement depuis un élément
element.dispatchEvent(monEvent)
```

## preventDefault()

Empêche le **comportement par défaut** du navigateur :

```js
// Empêcher un lien de naviguer
lien.addEventListener('click', (e) => {
  e.preventDefault()
  // Faire autre chose...
})

// Empêcher un formulaire de se soumettre
form.addEventListener('submit', (e) => {
  e.preventDefault()
  // Traiter les données manuellement...
})
```

## Custom Events avec Custom Elements

### Exemple complet : SongItem avec événement play

```js
// Créer l'événement une seule fois
const playEvent = new CustomEvent('play_click')

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
        <img src="${this.getAttribute("cover")}" />
        <span>${this.getAttribute("title")}</span>
        <span>${this.getAttribute("artist")}</span>
        <button class="play-button">
          <span class="material-icons">play_arrow</span>
        </button>
      </div>
    `

    // Écouter le clic sur le bouton play
    const playButton = this.querySelector('.play-button')
    playButton.addEventListener('click', (e) => {
      e.preventDefault()
      // Émettre l'événement personnalisé depuis le composant
      this.dispatchEvent(playEvent)
    })
  }
}

customElements.define("song-item", SongItem)
```

### Écouter l'événement depuis l'extérieur

```js
const songElement = document.createElement('song-item')
songElement.setAttribute('title', 'Ma chanson')

// Observer : écouter l'événement personnalisé
songElement.addEventListener('play_click', () => {
  console.log('L\'utilisateur veut jouer cette chanson !')
  // Lancer la lecture audio...
})

container.appendChild(songElement)
```

### Passer des données avec CustomEvent

```js
// Émettre avec des données
const playEvent = new CustomEvent('play_click', {
  detail: { songId: 42, title: 'Ma chanson' }
})
this.dispatchEvent(playEvent)

// Recevoir les données
element.addEventListener('play_click', (e) => {
  console.log(e.detail.songId)   // 42
  console.log(e.detail.title)    // "Ma chanson"
})
```

## Le Player Audio (balise `<audio>`)

### Propriétés et méthodes

```js
const audio = document.querySelector('audio')

// Méthodes
audio.play()              // Lancer la lecture
audio.pause()             // Mettre en pause

// Propriétés
audio.src = 'chanson.mp3' // Changer la source
audio.paused              // true si en pause (lecture seule)
audio.currentTime         // Position actuelle en secondes (lecture/écriture)
audio.duration            // Durée totale en secondes (lecture seule)
```

### Événements audio

```js
audio.addEventListener('play', () => {
  console.log('Lecture démarrée')
})

audio.addEventListener('ended', () => {
  console.log('Lecture terminée')
})

audio.addEventListener('durationchange', () => {
  console.log('Durée :', audio.duration)
})

audio.addEventListener('timeupdate', () => {
  console.log('Position :', audio.currentTime)
  // Se déclenche régulièrement pendant la lecture
  // Utile pour mettre à jour une barre de progression
})
```

### Exemple : Player complet

```html
<audio id="player"></audio>
<button id="play-pause">Play</button>
<input type="range" id="progress" min="0" max="100" value="0" />
```

```js
const audio = document.querySelector('#player')
const playPauseBtn = document.querySelector('#play-pause')
const progress = document.querySelector('#progress')

// Play / Pause
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play()
    playPauseBtn.textContent = 'Pause'
  } else {
    audio.pause()
    playPauseBtn.textContent = 'Play'
  }
})

// Mise à jour de la barre de progression
audio.addEventListener('timeupdate', () => {
  const pourcentage = (audio.currentTime / audio.duration) * 100
  progress.value = pourcentage
})

// Changer la position en cliquant sur la barre
progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration
})
```
