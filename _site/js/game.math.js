game.math = {
  seed: Math.random(),
  random: function(min, max) {

    max = max || 1;
    min = min || 0;

    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;

    return Math.floor(rnd * (max - min)) + min;
  }
};
