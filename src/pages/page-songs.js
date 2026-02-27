import { getSongs } from '../api.js';

customElements.define(
	'page-artist-songs',
	class extends HTMLElement {
		connectedCallback() {
			const artistId = this.getAttribute('artist-id');

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
				songs.forEach((song, index) => {
					songList.innerHTML += `<song-item title="${song.title}" />`;
				});

				// Ajouter les listeners sur les boutons play
				songList.querySelectorAll('.play-button').forEach((button, index) => {
					button.addEventListener('click', () => {
						window.location.hash = `#player/${artistId}/${index}`;
					});
				});
			});
		}
	},
);
