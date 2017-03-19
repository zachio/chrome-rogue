game.music = {
  songs: null,
  init: function() {
    this.songs = [
      game.assets.audio[0],
      game.assets.audio[1],
      game.assets.audio[6]
    ];
    for(var i = 0; i < this.songs.length; i++){
      this.songs[i].loop = true;
    }
    this.play();
  },
  songSelect: 0,
  muted: false,
  play: function() {
    this.songSelect = game.math.random(0, this.songs.length);
    this.songs[this.songSelect].play();
  }
};
