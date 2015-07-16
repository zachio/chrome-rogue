game.sound = {
  //Creates sound snippets
  edit: function() {
    //Foot step snippet
    if(game.assets.audio[2].currentTime > 1.25) {
      game.assets.audio[2].pause();
      game.assets.audio[2].load();
    }
  }
};
