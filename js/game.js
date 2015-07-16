'use strict'

var game = {
  require: function(scripts) {
    var start = Date.now();
    var loaded = 0;
    for(var i = 0; i < scripts.length; i++) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "js/game." + scripts[i] + ".js";
      script.onload = function() {
        loaded++;
        if(loaded === scripts.length) {
          console.log("Scripts loaded in", Date.now() - start, "ms");
          game.init();
        }
      };
      document.head.appendChild(script);
    }
  },
  init: function() {
    var loadingImg = this.assets.loadingImg;
    loadingImg.src = "assets/images/loading.gif";
    loadingImg.onload = function() {
      document.body.style.background = "rgb(25, 31, 38)";
      game.render.canvas.style.background = "rgb(25, 31, 38)";
      this.style.margin = "0 auto";
      this.style.display = "block";
      document.body.appendChild(this);
    };
    this.assets.load([
    "assets/images/TileA4.png",
    "assets/images/characterDown.png",
    "assets/images/dungeontileset.png",
    "assets/images/character-face.png",
    "assets/images/chest.png",
    "assets/images/rat.png",
    "assets/audio/dungeon.mp3",
    "assets/audio/little_miss_sunshine.mp3",
    "assets/audio/steps.mp3"], this.loop);
    this.render.init();
    this.map.generate();
    this.enemy.generate();
    this.player.position(this.map.startX, this.map.startY);
    this.music.play();
  },
  tick: function() {
    game.render.clearScreen();
    game.time.update();
    game.render.frame();
    game.update();
    requestAnimationFrame(game.tick);
  },
  loop: function() {
  	requestAnimationFrame(game.tick);
  },
  update: function() {
    this.player.tryMove();
    this.player.hasBeatStage(this.assets.audio[2], this.enemy);
    this.enemy.update();
    this.sound.edit();
  }
};
