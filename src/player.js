// Tag audio
const audioPlayer = document.querySelector('#audio-player')

// contiendra la liste des chansons en cours de lecture, afin de pouvoir se déplacer entre les chansons
let currentSongList = []
// La chanson en cours de lecture
let currentSong = null

// Lire une chanson sur laquelle on clique
const playSong = (song, songs) => {
  // On enregistre la chanson en cours de lecture
  currentSong = song

  // si un tableau est transmis, on le met à jour. Cela nous permet d'utiliser juste playSong(song) à l'interne,
  // sans devoir le repasser à chaque fois (depuis previous/next, par exemple)
  if (songs)
    currentSongList = songs

  // On donne l'url au player et démarre la lecture
  audioPlayer.src = song.audio_url
  audioPlayer.play()
}

// Lis la chanson suivante, d'après la chanson en cours
const playNextSong = () => {
  let newIndex = currentSongList.indexOf(currentSong) + 1
  // On s'assure qu'on n'arrive jamais en dehors du tableau et on reboucle sur le début
  if (newIndex == currentSongList.length)
    newIndex = 0

  playSong(currentSongList[newIndex])
}

// Lis la chanson précédente, d'après la chanson en cours
const playPreviousSong = () => {
  let newIndex = currentSongList.indexOf(currentSong) - 1

  if (newIndex == -1)
    newIndex = currentSongList.length - 1

  playSong(currentSongList[newIndex])
}

export { audioPlayer, playSong, currentSong, playNextSong, playPreviousSong }
