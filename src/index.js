// Elements
import './elements/artist-cover.js';
import './elements/song-item.js';
import './elements/spot-footer.js';
// Pages
import './pages/page-artists.js';
import './pages/page-home.js';
import './pages/page-player.js';
import './pages/page-songs.js';
import { initPlayer } from './pages/player.js';

const router = () => {
	const main = document.querySelector('main');
	const hashs = (window.location.hash || '#home').split('/');

	if (hashs[0] == '#home') main.innerHTML = '<page-home />';
	else if (hashs[0] == '#player') {
		main.innerHTML = '<page-player />';
		initPlayer();
	}
	else if (hashs[0] == '#artists' && hashs[1])
		main.innerHTML = `<page-artist-songs artist-id="${hashs[1]}" />`;
	else if (hashs[0] == '#artists' && !hashs[1])
		main.innerHTML = '<page-artists />';
};

window.addEventListener('hashchange', router);

router();
