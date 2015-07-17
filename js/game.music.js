game.music = {
  songs: [],
  init: function() {
    this.songs.push(game.assets.audio[0], game.assets.audio[1]);
    for(var i = 0; i < this.songs.length; i++){
      this.songs[i].loop = true;
    }
    this.play();
  },
  songSelect: 0,
  muted: false,
  play: function() {
    this.songSelect = game.math.random(0, this.songs.length);
    game.assets.audio[this.songSelect].loop = true;
    game.assets.audio[this.songSelect].play();
  }
};
