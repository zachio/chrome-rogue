game.music = {
  songs: [
    game.assets.audio[0],
    game.assets.audio[1],
  ],
  songSelect: 0,
  muted: false,
  play: function() {
    this.songSelect = game.math.random(0, this.songs.length);
    game.assets.audio[this.songSelect].loop = true;
    game.assets.audio[this.songSelect].play();
  }
};
