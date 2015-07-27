game.skill = {
  stamina: {
    level: 1,
    exp: 0,
    expMax: 10000,
    max: 1000,
    cooldown: Date.now(),
    levelUp: function() {
      game.sound.effects.level.play();
      this.level++;
      this.expMax += this.expMax * 0.1;
      this.max += this.max * 0.1;
    }
  }
};
