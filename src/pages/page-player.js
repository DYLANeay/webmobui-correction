import {
	audioPlayer,
	currentSong,
	playNextSong,
	playPreviousSong,
} from '../player.js';
import formatTimestamp from '../lib/formatTimestamp.js';

customElements.define(
	'page-player',
	class extends HTMLElement {
		connectedCallback() {
			this.innerHTML = `
      <div id="player">
        <div id="player-thumbnail">
          <!-- utiliser l'id de cet élément pour changer la cover de la chanson -->
          <img src="http://placecats.com/200/300" id="player-thumbnail-image" />
        </div>

        <div id="player-infos">
          <div id="player-infos-song">
            <span class="material-icons">music_note</span>
            <!-- utiliser l'id de cet élément pour changer le titre de la chanson -->
            <span id="player-infos-song-title">
              -
            </span>
          </div>

          <div id="player-infos-artist">
            <span class="material-icons">person</span>
            <!-- utiliser l'id de cet élément pour changer le nom de l'artiste -->
            <span id="player-infos-artist-name">
              -
            </span>
          </div>
        </div>

        <div id="player-controls">
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur précédent -->
          <button type="button" class="player-control player-control-small" id="player-control-previous">
            <span class="material-icons">skip_previous</span>
          </button>
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur play/pause -->
          <button type="button" class="player-control" id="player-control-play">
            <span class="material-icons">play_arrow</span>
          </button>
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur suivant -->
          <button type="button" class="player-control player-control-small" id="player-control-next">
            <span class="material-icons">skip_next</span>
          </button>
        </div>

        <div id="player-progress">
          <input type="range" id="player-progress-bar" />
          <div id="player-times">
            <!-- utiliser l'id de cet élément pour changer le temps écoulé -->
            <span id="player-time-current">--:--</span>
            <!-- utiliser l'id de cet élément pour changer la durée totale -->
            <span id="player-time-duration">--:--</span>
          </div>
        </div>
      </div>
      `;

			// On bind proprement le this
			this.updatePlayerInfos = this.updatePlayerInfos.bind(this);
			// Dès que le tag audio a chargé une nouvelle chanson, il y a potentiellement eu un
			// playSong qui a modifié le 'src'. Le tag va alors charger le mp3 et une fois fini,
			// il va nous avertir du chargement. Hop, mise à jour.
			audioPlayer.addEventListener('loadeddata', this.updatePlayerInfos);
			// A la création de la page player, on met également la UI à jour, car il se peut qu'une
			// chanson soit déjà en lecture en arrière-plan et qu'il faille juste récupérer la valeur
			// en cours
			this.updatePlayerInfos();

			// Play / Pause
			this.querySelector('#player-control-play').addEventListener(
				'click',
				() => {
					if (audioPlayer.paused) {
						audioPlayer.play();
					} else {
						audioPlayer.pause();
					}
				},
			);

			// Changer l'icône play/pause
			audioPlayer.addEventListener('play', () => {
				this.querySelector('#player-control-play .material-icons').textContent =
					'pause';
			});
			audioPlayer.addEventListener('pause', () => {
				this.querySelector('#player-control-play .material-icons').textContent =
					'play_arrow';
			});

			// déjà démarré avant que la page player soit créée)
			if (!audioPlayer.paused) {
				this.querySelector('#player-control-play .material-icons').textContent =
					'pause';
			}

			// Suivant / Précédent
			this.querySelector('#player-control-next').addEventListener(
				'click',
				() => {
					playNextSong();
				},
			);
			this.querySelector('#player-control-previous').addEventListener(
				'click',
				() => {
					playPreviousSong();
				},
			);

			// Mise à jour du temps et de la barre de progression
			audioPlayer.addEventListener('timeupdate', () => {
				this.querySelector('#player-time-current').textContent =
					formatTimestamp(audioPlayer.currentTime);
				const progress =
					(audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
				this.querySelector('#player-progress-bar').value = progress;
			});

			audioPlayer.addEventListener('loadedmetadata', () => {
				this.querySelector('#player-time-duration').textContent =
					formatTimestamp(audioPlayer.duration);

				this.querySelector('#player-time-duration').textContent =
					formatTimestamp(audioPlayer.duration);
				this.querySelector('#player-progress-bar').max = 100;
				this.querySelector('#player-progress-bar').value = 0;
			});

			// Barre de progression cliquable
			this.querySelector('#player-progress-bar').addEventListener(
				'input',
				(e) => {
					audioPlayer.currentTime =
						(e.target.value / 100) * audioPlayer.duration;
				},
			);

			// Chanson suivante automatiquement à la fin
			audioPlayer.addEventListener('ended', () => {
				playNextSong();
			});
		}

		updatePlayerInfos() {
			if (!currentSong) return;

			this.querySelector('#player-infos-song-title').innerText =
				currentSong.title;

			this.querySelector('#player-infos-artist-name').innerText =
				currentSong.artist.name;

			this.querySelector('#player-thumbnail-image').src =
				currentSong.artist.image_url;

			this.querySelector('#player-time-duration').textContent = formatTimestamp(
				audioPlayer.duration,
			);
¨		}
	},
);
