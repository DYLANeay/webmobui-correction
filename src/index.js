// Elements
import './elements/artist-cover.js';
import './elements/song-item.js';
import './elements/spot-footer.js';
// Pages
import './pages/page-artists.js';
import './pages/page-home.js';
import './pages/page-player.js';
import './pages/page-songs.js';
import './pages/page-search.js';
import { initPlayer } from './pages/player.js';

// Search bar toggle
const searchButton = document.querySelector('#search-trigger');
const searchInput = document.querySelector('#search-input');

searchButton.addEventListener('click', () => {
	searchInput.classList.toggle('active');
	searchInput.focus();
});

searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		window.location.hash = `#search/${searchInput.value}`;
		searchInput.classList.remove('active');
		searchInput.value = '';
	}
});

const router = () => {
	const main = document.querySelector('main');
	const hashs = (window.location.hash || '#home').split('/');

	if (hashs[0] == '#home') main.innerHTML = '<page-home />';
	else if (hashs[0] == '#player') {
		main.innerHTML = '<page-player />';
		initPlayer();
	} else if (hashs[0] == '#artists' && hashs[1])
		main.innerHTML = `<page-artist-songs artist-id="${hashs[1]}" />`;
	else if (hashs[0] == '#search' && hashs[1])
		main.innerHTML = `<page-search-songs search-tag="${hashs[1]}" />`;
	else if (hashs[0] == '#artists' && !hashs[1])
		main.innerHTML = '<page-artists />';
};

window.addEventListener('hashchange', router);

router();
