import { getSongs } from '../api.js';
import { playSong } from '../player.js';
import { toggleFavorite } from '../utils.js';

customElements.define(
	'page-artist-songs',
	class extends HTMLElement {
		connectedCallback() {
			const artistId = this.getAttribute('artist-id');

			const favorites = [];

			getSongs(artistId).then((songs) => {
				this.innerHTML = `
          <h4>
            Artistes > ${songs[0].artist.name}
          </h4>

          <div class="list">
          </div>
        `;
				const songList = this.querySelector('.list');
				// Itérer le tableau d'artistes reçus et créer les éléments correspondants

				if (localStorage.getItem('favorites') !== null) {
					const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
					favorites.push(...storedFavorites);
				}
				songs.forEach((song) => {
					const songItem = document.createElement('song-item');
					songItem.setAttribute('title', song.title);
					if (favorites.includes(song.id)) {
						songItem.setAttribute('favorite', 'true');
					}
					songItem.addEventListener('play-song', () => playSong(song, songs));
					songItem.addEventListener('toggle-favorite', () =>
						toggleFavorite(songItem, song, favorites),
					);
					songList.append(songItem);
				});
			});
		}
	},
);
