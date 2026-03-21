const BASE_URL = 'https://webmob-ui-22-spotlified.herokuapp.com'

const fetchJson = (url) => fetch(`${BASE_URL}${url}`).then((response) => response.json())

const getArtists = () => fetchJson('/api/artists')

const getSongs = (id) => fetchJson(`/api/artists/${id}/songs`)

const searchSongs = (id) => fetchJson(`/api/songs/search/${id}`)

const getSongDetails = (id) => fetchJson(`/api/songs/${id}`)

export { getArtists, getSongs, searchSongs, getSongDetails }
