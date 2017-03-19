var game = game || {};

game.combat = {
  coolDown: Date.now(),
  detect: function() {
    var reach = 0.2;
    var isEnemy = function(x1, x2, y1, y2) {
      if(enemy.x <= game.player.x + x1
        && enemy.x >= game.player.x + x2
        && enemy.y <= game.player.y + y1
        && enemy.y >= game.player.y + y2) {
          return true;
        }
    };
    var sound = function() {
      game.sound.effects.hit.pause();
      game.sound.effects.hit.load();
      game.sound.effects.hit.play();
    };
    var kill = function(dir) {
      sound();
      if(enemy.speed) {
        game.player.exp += 10;
        enemy.blood = dir;
      }
      enemy.speed = 0;
    };
    //Attack!
    for(var i = 0; i < game.enemy.enemies.length; i++) {
      var enemy = game.enemy.enemies[i];
      switch(game.player.facing) {
        case "left":
          if(isEnemy(-reach, -reach - 2, 0.5, -0.5)) {
            kill("left");

          }
          break;
        case "up":
          if(isEnemy(0.5, -0.5, -reach, -reach - 2)) {
            kill("up");
          }
          break;
        case "right":
          if(isEnemy(reach + 2, reach, 0.5, -0.5)) {
            kill("right");
          }
          break;
        case "down":
          if(isEnemy(0.5, -0.5, reach + 2, reach)) {
            kill("down");
          }
          break;
      }
    }
  },
  isAttacking: false,
  strike: function() {
    if(!this.isAttacking && !game.paused) {
      this.sound();
      this.isAttacking = true;
      this.animate = true;
      this.coolDown = Date.now();
      this.detect();
    }
  },
  sound: function() {
    game.sound.effects.swing.load();
    game.sound.effects.swing.play();
  },
  render: function(centerX, centerY) {
    if(this.isAttacking) {
      var imageSize = 96 * game.render.scale;
      game.render.ctx.save();
      switch(game.player.facing) {
        case "left":
          game.render.ctx.translate(
            centerX,
            centerY - imageSize / 2);
            game.render.ctx.rotate(0.75);
          break;
        case "up":
          game.render.ctx.translate(
            centerX + imageSize * 0.9,
            centerY);
          game.render.ctx.rotate(2.333);
          break;
        case "right":
          game.render.ctx.translate(
            centerX + imageSize * 0.4,
            centerY - imageSize / 2);
            game.render.ctx.rotate(0.75);
          break;
        case "down":
          game.render.ctx.translate(
            centerX + imageSize * 0.9,
            centerY + imageSize / 2);
          game.render.ctx.rotate(2.333);
          break;
      }

      //Strike animation overlay player when facing down
      if(this.animate) {
        game.render.ctx.drawImage(
          game.assets.images[6],
          this.cropX, this.cropY,
          this.cropSize, this.cropSize,
          0,
          0,
          imageSize, imageSize
        );
      }
      game.render.ctx.restore();
    }
  },
  update: function() {
    //Attacking Animation
    if(this.isAttacking) {
      var timeline = Date.now() - this.coolDown;
      if(timeline < 150) cropX = 0 * 32;
      if(timeline <= 25) {
        this.cropX = 0;
      } else if (timeline >= 25 && timeline <= 50 ) {
        this.cropX = this.cropSize;
      } else if (timeline >= 50 && timeline <= 75 ) {
        this.cropX = this.cropSize * 2;
      } else if (timeline >= 75 && timeline <= 100 ) {
        this.cropX = this.cropSize * 3;
      } else if (timeline >= 125 && timeline <= 150) {
        this.cropX = this.cropSize * 4;
      } else {
        this.animate = false;
      }
    }
  },
  cropX: null,
  cropY: null,
  cropSize: 192,
  animate: true
};
