game.player.attack = {
  cooldown: Date.now(),
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
      game.sound.effects.hit.load();
      game.sound.effects.hit.play();
    };
    var kill = function() {
      sound();
      enemy.speed = 0;
    };
    for(var i = 0; i < game.enemy.enemies.length; i++) {
      var enemy = game.enemy.enemies[i];
      switch(game.player.facing) {
        case "left":
          if(isEnemy(-reach, -reach - 2, 0.5, -0.5)) {
            kill();
          }
          break;
        case "up":
          if(isEnemy(0.5, -0.5, -reach, -reach - 2)) {
            kill();
          }
          break;
        case "right":
          if(isEnemy(reach + 2, reach, 0.5, -0.5)) {
            kill();
          }
          break;
        case "down":
          if(isEnemy(0.5, -0.5, reach + 2, reach)) {
            kill();
          }
          break;
      }
    }
  },
  isAttacking: false,
  strike: function() {
    if(!this.isAttacking) {
      this.sound();
      this.isAttacking = true;
      this.attackTime = Date.now();
      this.detect();
    }
  },
  sound: function() {
    game.sound.effects.swing.load();
    game.sound.effects.swing.play();
  },
  render: function(centerX, centerY) {
    //Attacking Animation
    var attack = {
      cropX: 0,
      cropY: 0,
      cropSize: 192,
      size: 96 * game.render.scale,
      offsetX: 0,
      offsetY: 0
    }
    var drawAttack = true;
    if(this.isAttacking) {
      var timeline = Date.now() - this.attackTime;
      if(timeline < 150) cropX = 0 * 32;
      if(timeline <= 25) {
        attack.cropX = 0;
      } else if (timeline >= 25 && timeline <= 50 ) {
        attack.cropX = attack.cropSize;
      } else if (timeline >= 50 && timeline <= 75 ) {
        attack.cropX = attack.cropSize * 2;
      } else if (timeline >= 75 && timeline <= 100 ) {
        attack.cropX = attack.cropSize * 3;
      } else if (timeline >= 125 && timeline <= 150) {
        attack.cropX = attack.cropSize * 4;
      } else {
        drawAttack = false;
      }

      if(drawAttack) {
        game.render.ctx.save();
        switch(game.player.facing) {
          case "left":
            game.render.ctx.translate(
              centerX,
              centerY - attack.size / 2);
              game.render.ctx.rotate(0.75);
            break;
          case "up":
            game.render.ctx.translate(
              centerX + attack.size * 0.9,
              centerY);
            game.render.ctx.rotate(2.333);
            break;
          case "right":
            game.render.ctx.translate(
              centerX + attack.size * 0.4,
              centerY - attack.size / 2);
              game.render.ctx.rotate(0.75);
            break;
        }

        if(game.player.facing != "down") {
          game.render.ctx.drawImage(
            game.assets.images[6],
            attack.cropX, attack.cropY,
            attack.cropSize, attack.cropSize,
            0,
            0,
            attack.size, attack.size
          );
        }
        game.render.ctx.restore();
      }
    }

    //Attack animation in front of player
    if(drawAttack){
      if(this.isAttacking && game.player.facing === "down") {
        game.render.ctx.save();
        game.render.ctx.translate(
          centerX + attack.size * 0.9,
          centerY + attack.size * 0.5);
        game.render.ctx.rotate(2.333);
        game.render.ctx.drawImage(
          game.assets.images[6],
          attack.cropX, attack.cropY,
          attack.cropSize, attack.cropSize,
          0,
          0,
          attack.size, attack.size
        );
        game.render.ctx.restore();
      }
    }
  }
};
