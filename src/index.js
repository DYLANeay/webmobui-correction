// Elements
import './elements/artist-cover.js';
import './elements/search-bar.js';
import './elements/song-item.js';
import './elements/spot-footer.js';
// Pages
import './pages/page-artists.js';
import './pages/page-home.js';
import './pages/page-player.js';
import './pages/page-songs.js';
import './pages/page-song-details.js';

const router = () => {
	const main = document.querySelector('main');
	const hashs = (window.location.hash || '#home').split('/');

	if (hashs[0] == '#home') main.innerHTML = '<page-home />';
	else if (hashs[0] == '#player') main.innerHTML = '<page-player />';
	else if (hashs[0] == '#search' && hashs[1])
		main.innerHTML = `<page-search-songs query="${hashs[1]}" />`;
	else if (hashs[0] == '#songs' && hashs[1])
		main.innerHTML = `<page-song-details song-id="${hashs[1]}" />`;
	else if (hashs[0] == '#artists' && hashs[1])
		main.innerHTML = `<page-artist-songs artist-id="${hashs[1]}" />`;
	else if (hashs[0] == '#artists' && !hashs[1])
		main.innerHTML = '<page-artists />';
	else if (hashs[0] == '#favorites') main.innerHTML = '<page-favorites />';
};

window.addEventListener('hashchange', router);

router();
