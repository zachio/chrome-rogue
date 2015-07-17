game.sound = {
  effects: {
    step: null
  },
  timeline: Date.now(),
  init: function() {
    this.effects.step = game.assets.audio[3];
    //this.effects.step.volume = 0.5;
    for(var prop in this.effects) {
      this.effects[prop].loop = false;
    }
  },
  //Creates sound snippets
  update: function() {
    //Foot step snippet
    if(game.assets.audio[2].currentTime > 1.25) {
      game.assets.audio[2].pause();
      game.assets.audio[2].load();
    }
    //Sprint
    var time = Date.now();
    if(game.player.sprinting
      && time - this.timeline >= 200) {
      if(game.player.moving.left || game.player.moving.up || game.player.moving.right || game.player.moving.down) {
        this.effects.step.load();
        this.effects.step.play();
        this.timeline = time;
      }
    }
  }
};
