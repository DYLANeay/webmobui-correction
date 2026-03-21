import { getSongDetails } from '../api.js'
import { playSong } from '../player.js'

customElements.define("page-song-details", class extends HTMLElement {
  connectedCallback() {
    const songId = this.getAttribute('song-id')

    getSongDetails(songId).then((song) => {

      this.innerHTML = `
        <h4>
          ${song.title}
          <button type="button" class="standalone-play-button">
            <span class="material-icons">play_arrow</span>
          </button>
        </h4>
        <h5>${song.artist.name}</h5>
        <p>${song.lyrics}</p>
        `

      const bouton = this.querySelector('button')

      // Même si la chanson est toute seule, il faut quand même passer un tableau
      // pour le contexte des previous/next, on crée donc un tableau d'un seul élément
      // à la volée
      bouton.addEventListener('click', () => playSong(song, [song]))

      // Comment pourrait-on faire pour que le bouton se mette à jour avec le bon icône ? :)
    })
  }
})
