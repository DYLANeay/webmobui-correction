import { searchSongs } from '../api.js';
import { playSong } from '../player.js';
import { toggleFavorite } from '../utils.js';

customElements.define(
	'page-search-songs',
	class extends HTMLElement {
		connectedCallback() {
			const searchTag = this.getAttribute('search-tag');

			const favorites = [];

			searchSongs(searchTag).then((songs) => {
				this.innerHTML = `
          <h4>
            Recherche > ${searchTag}
          </h4>

          <div class="list">
          </div>
        `;
				const songList = this.querySelector('.list');

				if (localStorage.getItem('favorites') !== null) {
					const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
					favorites.push(...storedFavorites);
				}
				songs.forEach((song) => {
					const songItem = document.createElement('song-item');
					songItem.setAttribute('title', song.title);
				if (song.artist?.name) songItem.setAttribute('artist', song.artist.name);
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
