import { getSongs, searchSongs } from '../api.js'
import { playSong } from '../player.js'
import { getFavorites, isFavorite, addFavorite, removeFavorite } from '../favorites.js'

// Classe de base pour l'affichage des chansons d'un endpoint
class PageSongsBase extends HTMLElement {
  // Utilisé pour stocker les chansons une fois téléchargées
  songs = null

  // Cette méthode doit retourner une promise pour récupérer les chansons
  getSongsData() {
    // please implement me
    // Ex: return getSongs(...)
  }

  // Cette méthode retourne le titre
  getTitle() {
    // please implement me
    // Ex: return 'Un titre'
  }

  // Affichage
  connectedCallback() {
    this.getSongsData()
      .then((songs) => {
        this.songs = songs
        this.innerHTML = `
          <h4>
          </h4>

          <div class="list">
          </div>
        `
        this.querySelector('h4').innerText = this.getTitle()
        const songList = this.querySelector('.list')

        if (songs.length == 0)
          songList.innerText = 'Aucun résultat'

        // Itérer le tableau d'artistes reçus et créer les éléments correspondants
        songs.forEach((song) => {
          const songItem = document.createElement('song-item')
          songItem.setAttribute('href', `#songs/${song.id}`)
          songItem.setAttribute('title', song.title)
          songItem.setAttribute('favorite', isFavorite(song))
          songItem.addEventListener('play_click', () => playSong(song, songs))
          songItem.addEventListener('favorite_click', () => {
            if (isFavorite(song)) {
              removeFavorite(song)
              songItem.setAttribute('favorite', false)
            } else {
              addFavorite(song)
              songItem.setAttribute('favorite', true)
            }
          })
          songList.append(songItem)
        })
      })
  }
}

// Liste les chansons d'un artiste
customElements.define("page-artist-songs", class extends PageSongsBase {
  getSongsData() {
    const artistId = this.getAttribute('artist-id')
    return getSongs(artistId)
  }

  getTitle() {
    return `Artistes > ${this.songs[0].artist.name}`
  }
})

// Liste les résultats de recherche pour une query donnée
customElements.define("page-search-songs", class extends PageSongsBase {
  getSongsData() {
    const query = this.getAttribute('query')
    return searchSongs(query)
  }

  getTitle() {
    const query = this.getAttribute('query')
    return `Résultats pour : ${query}`
  }
})

// Liste les résultats de recherche pour une query donnée
customElements.define("page-favorites", class extends PageSongsBase {
  // ajouté async ici pour que la fonction soit thenable
  async getSongsData() {
    return getFavorites()
  }

  getTitle() {
    return `Favoris`
  }
})
