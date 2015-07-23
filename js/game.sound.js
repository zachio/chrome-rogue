game.sound = {
  effects: {
    step: null,
    swing: null,
    hit: null,
    chest: null,
    grunt: null,
    scream: null
  },
  timeline: Date.now(),
  init: function() {
    this.effects.step = game.assets.audio[3];
    this.effects.swing = game.assets.audio[4];
    this.effects.hit = game.assets.audio[5];
    this.effects.chest = game.assets.audio[7];
    this.effects.grunt = game.assets.audio[8];
    this.effects.scream = game.assets.audio[9];
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
