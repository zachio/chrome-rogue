'use strict'

var game = {
  level: 1,
  load: function(scripts, callback) {
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
          callback();
        }
      };
      document.head.appendChild(script);
    }
  },
  loadScreen: function(image) {
    image.src = "assets/images/loading.gif";
    image.onload = function() {
      document.body.style.background = "rgb(25, 31, 38)";
      game.render.canvas.style.background = "rgb(25, 31, 38)";
      this.style.margin = "0 auto";
      this.style.display = "block";
      document.body.appendChild(this);
      image = this;
    };
  },
  init: function() {
    var loadImg = new Image();
    this.loadScreen(loadImg);
    this.load([
      "assets",
      "collision",
      "combat",
      "enemy",
      "listeners",
      "map",
      "math",
      "misc",
      "movement",
      "music",
      "player",
      "render",
      "sound",
      "status",
      "Tile",
      "time"
    ], function() {
      game.assets.load(init);
    });
    var init = function() {
      //Automagically call init with new game parts
      for(var prop in game) {
        if(game[prop].hasOwnProperty('init')) {
          game[prop].init();
        }
      }
      loadImg.style.display = "none";
      game.loop();
    };

  },
  tick: function() {
    game.time.update();
    game.render.clearScreen();
    game.render.frame();
    if(!game.paused) {
      game.update();
    }
    requestAnimationFrame(game.tick);
  },
  loop: function() {
  	requestAnimationFrame(game.tick);
  },
  paused: false,
  update: function() {
    this.player.update();
    this.combat.update();
    this.enemy.update();
    this.sound.update();
  }
};
