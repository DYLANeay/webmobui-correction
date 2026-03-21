// Custom events
const playClickEvent = new CustomEvent('play_click')
const favoriteClickEvent = new CustomEvent('favorite_click')

// Custom element
customElements.define('song-item', class extends HTMLElement {
  // Définit la liste des attributs qui seront observés et donc appelerons attributeChangedCallback
  // lorsqu'il y a une modification
  static observedAttributes = ['favorite', 'href', 'title']

  // Appelé lorsque que l'on insert l'élément dans le DOM, typiquement au moment de:
  // songList.appendChild(newElement)
  connectedCallback() {
    this.render()
  }

  // Appelé lorsque que l'on modifie un attribut présent dans observedAttributes, typiquement au moment de:
  // newElement.setAttribute('favorite', true)
  // newElement.setAttribute('favorite', false)
  attributeChangedCallback() {
    this.render()
  }

  // Methode "custom" pour faire le rendering. Nom arbitraire
  render() {
    // Attenion à bien tester 'true' et non pas true ! Ne pas oublier que les attributs
    // sont passés comme des chaines de caractères et non des objets
    const icon = this.getAttribute('favorite') == 'true' ? 'favorite' : 'favorite_border'

    // On agglomère le HTML
    this.innerHTML = `
    <a href="${this.getAttribute('href')}">
      <div class="list-item-title">${this.getAttribute('title')}</div>
      <div class="list-item-actions">
        <button type="button" class="icon-button favorite-button ">
          <span class="material-icons">${icon}</span>
        </button>
        <button type="button" class="icon-button play-button">
          <span class="material-icons">play_arrow</span>
        </button>
      </div>
    </a>`

    // Définition du custom event pour le bouton play
    this.querySelector('.play-button').addEventListener('click', () => {
      this.dispatchEvent(playClickEvent)
    })

    // Définition du custom event pour le bouton play
    this.querySelector('.favorite-button').addEventListener('click', () => {
      this.dispatchEvent(favoriteClickEvent)
    })
  }
})
