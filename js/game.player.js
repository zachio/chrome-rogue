game.player = {
  attacking: false,
  attack: function() {
    if(!this.attacking) {
      game.sound.effects.swing.load();
      game.sound.effects.swing.play();
      this.attacking = true;
      this.attackTime = Date.now();
    }
  },
  x: 0,
  y: 0,
  moving: {
    left: false,
    up: false,
    right: false,
    down: false
  },
  facing: "down",
  speed: 4,
  size: 32,
  image: false,
  //timeline is used for animating the player
  timeline: Date.now(),
  attackTime: Date.now(),
  sprinting: false,
  init: function() {
    this.position(game.map.startX, game.map.startY);
  },
  position: function(x, y) {
    this.x = x;
    this.y = y;
  },
  render: function() {
    var centerX = window.innerWidth / 2 - this.size / 2;
    var centerY = window.innerHeight / 2 - this.size / 2;
    var cropX = 1 * 32;
    var cropY = 4 * 32;
    var playhead = Date.now() - this.timeline;
    var self = this;
    //Playing the animation frames
    var walkAnimation = function () {
      if(playhead < 250) {
        return 1 * 32;
      } else if(playhead >= 250 && playhead <= 500) {
        return 0 * 32;
      } else if(playhead > 500 && playhead <= 750) {
        return 1 * 32;
      } else if(playhead > 750 && playhead <= 1000) {
        return 2 * 32;
      } else {
        self.timeline = Date.now();
        return 1 * 32;
      }
    };
    var sprintAnimation = function () {
      if(playhead < 125) {
        return 1 * 32;
      } else if(playhead >= 125 && playhead <= 250) {
        return 0 * 32;
      } else if(playhead > 250 && playhead <= 375) {
        return 1 * 32;
      } else if(playhead > 375 && playhead <= 500) {
        return 2 * 32;
      } else {
        self.timeline = Date.now();
        return 1 * 32;
      }
    };
    //Walking Animation
    switch(this.facing) {
      case "left":
        cropX = (this.moving.left) ? walkAnimation() : 1 * 32;
        cropY = 5 * 32;
        break;
      case "up":
        cropX = (this.moving.up) ? walkAnimation() : 1 * 32;
        cropY = 7 * 32;
        break;
      case "right":
        cropX = (this.moving.right) ? walkAnimation() : 1 * 32;
        cropY = 6 * 32;
        break;
      case "down":
        cropX = (this.moving.down) ? walkAnimation() : 1 * 32;
        cropY = 4 * 32;
        break;
    }
    //Sprinting Animation
    if(this.sprinting) {
      switch(this.facing) {
        case "left":
          cropX = (this.moving.left) ? sprintAnimation() : 1 * 32;
          cropY = 5 * 32;
          break;
        case "up":
          cropX = (this.moving.up) ? sprintAnimation() : 1 * 32;
          cropY = 7 * 32;
          break;
        case "right":
          cropX = (this.moving.right) ? sprintAnimation() : 1 * 32;
          cropY = 6 * 32;
          break;
        case "down":
          cropX = (this.moving.down) ? sprintAnimation() : 1 * 32;
          cropY = 4 * 32;
          break;
      }
    }


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
    if(this.attacking){
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
        switch(this.facing) {
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

        if(this.facing != "down") {
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
    //Player animation
    game.render.ctx.drawImage(
      game.assets.images[1],
      cropX, cropY,
      32,
      32 - 1, //Minus one because it was clipping the below graphics
      centerX, centerY,
      this.size * game.render.scale,
      this.size * game.render.scale
    );

    //Attack animation in front of player
    if(drawAttack){
      if(this.attacking && this.facing === "down") {
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

  },

  tryMove: function() {
    var speed = game.movement.speedPerSecond(this.speed, game.time.tickDuration);
    //invert the speed so the player can fit through cooridors
    var modifier = -speed;

    //Left
    if(this.moving.left
      && !game.collision.detect(this,-modifier, 0.9)) {
      this.x -= speed;
    }
    //Up
    if(this.moving.up
      && !game.collision.detect(this, 0.5, -modifier + 0.6)) {
      this.y -= speed;
    }
    //Right
    if(this.moving.right
      && !game.collision.detect(this, modifier + 1, 0.9)) {
      this.x += speed;
    }
    //down
    if(this.moving.down
      && !game.collision.detect(this,0.5, modifier + 1.3)){
      this.y += speed;
    }
  },
  hasBeatStage: function (sound, enemy) {
    if(game.map.data[Math.round(this.x)][Math.round(this.y)].entity === 4 ) {
      sound.play();
      console.log("You win!");
      //Create new game.map
      game.map.generate();
      //Position player in first room
      this.position(game.map.startX, game.map.startY);
      enemy.enemies = [];
      enemy.generate(game.map);
      game.level++;
    }
  },
  //Player action
  action: function() {
    //Open chest
    switch(this.facing) {
      case "left":
        if(game.map.data[~~(this.x - 0.1)][~~this.y].entity === 5 || game.map.data[~~(this.x - 0.1)][~~this.y + 1].entity === 5) {
          console.log("chest opened");
        } else if(!this.attacking) {
          this.attack();
        }
        break;
      case "up":
        if(game.map.data[~~this.x][~~(this.y - 0.1)].entity === 5 || game.map.data[~~this.x + 1][~~(this.y - 0.1)].entity === 5) {
          console.log("chest opened");
        } else if(!this.attacking) {
          this.attack();
        }
        break;
      case "right":
        if(game.map.data[~~(this.x + 1.1)][~~this.y].entity === 5 || game.map.data[~~(this.x + 1.1)][~~this.y + 1].entity === 5) {
          console.log("chest opened");
        } else if(!this.attacking) {
          this.attack();
        }
        break;
      case "down":
        if(game.map.data[~~this.x][~~(this.y + 1.1)].entity === 5 || game.map.data[~~this.x + 1][~~(this.y + 1.1)].entity === 5) {
          console.log("chest opened");
        } else if(!this.attacking) {
          this.attack();
        }
        break;
    }
  }

  //Attack

};
