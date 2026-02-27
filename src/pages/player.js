import { getSongs } from '../api.js';
import formatTimestamp from '../lib/formatTimestamp.js';

let songs = [];
let currentIndex = 0;

const loadSong = (index) => {
	const song = songs[index];
	const audio = document.querySelector('#audio-player');

	audio.src = song.audio_url;
	document.querySelector('#player-infos-song-title').textContent = song.title;
	document.querySelector('#player-infos-artist-name').textContent =
		song.artist.name;
	document.querySelector('#player-thumbnail-image').src = song.artist.image_url;

	audio.play();
};

const initPlayer = async () => {
	const hashs = window.location.hash.split('/');
	if (hashs[0] !== '#player') return;

	const artistId = hashs[1];
	const songIndex = parseInt(hashs[2]) || 0;
	if (!artistId) return;

	const audio = document.querySelector('#audio-player');
	if (!audio) return;

	const fetchedSongs = await getSongs(artistId);

	songs = fetchedSongs;
	currentIndex = songIndex;
	loadSong(currentIndex);

	// Play / Pause
	document
		.querySelector('#player-control-play')
		.addEventListener('click', () => {
			if (audio.paused) {
				audio.play();
			} else {
				audio.pause();
			}
		});

	// Changer l'icône play/pause
	audio.addEventListener('play', () => {
		document.querySelector('#player-control-play .material-icons').textContent =
			'pause';
	});

	audio.addEventListener('pause', () => {
		document.querySelector('#player-control-play .material-icons').textContent =
			'play_arrow';
	});

	// Suivant
	document
		.querySelector('#player-control-next')
		.addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % songs.length;
			loadSong(currentIndex);
		});

	// Précédent
	document
		.querySelector('#player-control-previous')
		.addEventListener('click', () => {
			currentIndex = (currentIndex - 1 + songs.length) % songs.length;
			loadSong(currentIndex);
		});

	// Mise à jour du temps et de la barre de progression
	audio.addEventListener('timeupdate', () => {
		document.querySelector('#player-time-current').textContent =
			formatTimestamp(audio.currentTime);
		const progress = (audio.currentTime / audio.duration) * 100 || 0;
		document.querySelector('#player-progress-bar').value = progress;
	});

	audio.addEventListener('loadedmetadata', () => {
		document.querySelector('#player-time-duration').textContent =
			formatTimestamp(audio.duration);
		document.querySelector('#player-progress-bar').max = 100;
		document.querySelector('#player-progress-bar').value = 0;
	});

	// Barre de progression cliquable
	document
		.querySelector('#player-progress-bar')
		.addEventListener('input', (e) => {
			audio.currentTime = (e.target.value / 100) * audio.duration;
		});

	// Chanson suivante automatiquement à la fin
	audio.addEventListener('ended', () => {
		currentIndex = (currentIndex + 1) % songs.length;
		loadSong(currentIndex);
	});
};

export { initPlayer };
