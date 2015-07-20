game.player = {
  x: 0,
  y: 0,
  cropX: null,
  cropY: null,
  exp: 0,
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
    var self = this;
    var drawPlayer = function() {
      //Player animation
      game.render.ctx.drawImage(
        game.assets.images[1],
        self.cropX, self.cropY,
        32,
        32 - 1, //Minus one because it was clipping the below graphics
        centerX, centerY,
        self.size * game.render.scale,
        self.size * game.render.scale
      );
    };
    if(game.combat.isAttacking) {
      if(this.facing === "down") {
        drawPlayer();
        game.combat.render(centerX, centerY);
      } else {
        game.combat.render(centerX, centerY);
        drawPlayer();
      }
    } else {
      drawPlayer();
    }
  },
  update: function() {
    var self = this;
    this.cropX = 1 * 32;
    this.cropY = 4 * 32;
    var playhead = Date.now() - this.timeline;

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
        this.cropX = (this.moving.left) ? walkAnimation() : 1 * 32;
        this.cropY = 5 * 32;
        break;
      case "up":
        this.cropX = (this.moving.up) ? walkAnimation() : 1 * 32;
        this.cropY = 7 * 32;
        break;
      case "right":
        this.cropX = (this.moving.right) ? walkAnimation() : 1 * 32;
        this.cropY = 6 * 32;
        break;
      case "down":
        this.cropX = (this.moving.down) ? walkAnimation() : 1 * 32;
        this.cropY = 4 * 32;
        break;
    }
    //Sprinting Animation
    if(this.sprinting) {
      switch(this.facing) {
        case "left":
          this.cropX = (this.moving.left) ? sprintAnimation() : 1 * 32;
          this.cropY = 5 * 32;
          break;
        case "up":
          this.cropX = (this.moving.up) ? sprintAnimation() : 1 * 32;
          this.cropY = 7 * 32;
          break;
        case "right":
          this.cropX = (this.moving.right) ? sprintAnimation() : 1 * 32;
          this.cropY = 6 * 32;
          break;
        case "down":
          this.cropX = (this.moving.down) ? sprintAnimation() : 1 * 32;
          this.cropY = 4 * 32;
          break;
      }
    }
    if(Date.now() - game.combat.coolDown < 200) this.cropX = 0;
    var speed = game.movement.speedPerSecond(this.speed);
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
  openChest: function() {
    var chestSound = function() {
      game.sound.effects.chest.load();
      game.sound.effects.chest.play();
    };
    switch(this.facing) {
      case "left":
        if(game.map.search("chest", ~~(this.x - 0.1), ~~this.y) || game.map.search("chest", ~~(this.x - 0.1), ~~this.y + 1)) {
          console.log("chest opened");
          chestSound();
        }
        break;
      case "up":
        if(game.map.search("chest", ~~this.x, ~~(this.y - 0.1)) || game.map.search("chest", ~~this.x + 1, ~~(this.y - 0.1))) {
          console.log("chest opened");
          chestSound();
        }
        break;
      case "right":
        if(game.map.search("chest", ~~(this.x + 1.1), ~~this.y) || game.map.search("chest", ~~(this.x + 1.1), ~~this.y + 1)) {
          console.log("chest opened");
          chestSound();
        }
        break;
      case "down":
        if(game.map.search("chest", ~~this.x, ~~(this.y + 1.1)) || game.map.search("chest", ~~this.x + 1, ~~(this.y + 1.1))) {
          console.log("chest opened");
          chestSound();
        }
        break;
    }
  }
};
