game.math = {
  random: function(min, max) {
    return ~~(Math.random() * (max - min)) + min;
  }
};
