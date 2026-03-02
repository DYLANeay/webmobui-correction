const toggleFavorite = (songItem, song, favorites) => {
	const isFavorite = songItem.getAttribute('favorite') == 'true';
	songItem.setAttribute('favorite', !isFavorite);

	if (isFavorite) {
		favorites.splice(favorites.indexOf(song.id), 1);
	} else {
		favorites.push(song.id);
	}
	localStorage.setItem('favorites', JSON.stringify(favorites));
};

export { toggleFavorite };
