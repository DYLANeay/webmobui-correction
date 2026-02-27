import { getArtist, getArtistSongs } from './api.js';
import { initPlayer } from './pages/player.js';

const sections = document.querySelectorAll('section');

const showSection = (hash) => {
	const parts = hash.split('/');
	const sectionName = parts[0];
	const hasId = parts.length > 1 && parts[1];

	const targetSection =
		sectionName === 'artists' && hasId ? 'list' : sectionName;

	sections.forEach((section) => {
		if (section.id.includes(targetSection)) {
			section.style.display = 'flex';
		} else {
			section.style.display = 'none';
		}
	});
};

const renderArtistSongs = async (artistId) => {
	const artist = await getArtist(artistId);
	const songs = await getArtistSongs(artistId);

	const listSection = document.querySelector('#list-section');
	const title = listSection.querySelector('h4');
	title.textContent = `Artistes > ${artist.name}`;

	const list = listSection.querySelector('.list');
	list.innerHTML = songs
		.map(
			(song) => `
		<a href="#">
			<div class="list-item-title">${song.title}</div>
			<div class="list-item-actions">
				<button type="button" class="icon-button favorite-button">
					<span class="material-icons">playlist_add</span>
				</button>
				<button type="button" class="icon-button play-button">
					<span class="material-icons">play_arrow</span>
				</button>
			</div>
		</a>`,
		)
		.join('');
};

const formatHash = (hash) => hash.replace('#', '');

const handleRoute = (hash) => {
	showSection(hash);

	const parts = hash.split('/');
	if (parts[0] === 'artists' && parts[1]) {
		renderArtistSongs(parts[1]);
	}

	if (parts[0] === 'player' && parts[1] && parts[2]) {
		setTimeout(initPlayer());
	}
};

window.addEventListener('hashchange', () => {
	const hash = formatHash(window.location.hash);
	handleRoute(hash);
});

export { showSection, formatHash };
