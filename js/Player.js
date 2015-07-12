function Player(walkingSprite, ctx, map, speedPerSecond) {
  var self = this;
  var timeline = Date.now();
  self.x = 0;
  self.y = 0;
  self.moving = {
    left: false,
    up: false,
    right: false,
    down: false
  };
  this.facing = "down";
  this.speed = 4;
  this.size = 32;
  this.scale = 2;
  this.level = 0;
  this.sprite = {
    walking: walkingSprite
  };
  this.position = function(x, y) {
    self.x = x;
    self.y = y;
  };
  this.render = function() {
    var centerX = window.innerWidth / 2 - self.size / 2;
    var centerY = window.innerHeight / 2 - self.size / 2;
    var cropX = 1 * 32;
    var cropY = 4 * 32;
    var playhead = Date.now() - timeline;
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
        timeline = Date.now();
        return 1 * 32;
      }
    };
    switch(self.facing) {
      case "left":
        cropX = (self.moving.left) ? walkAnimation() : 1 * 32;
        cropY = 5 * 32;
        break;
      case "up":
        cropX = (self.moving.up) ? walkAnimation() : 1 * 32;
        cropY = 7 * 32;
        break;
      case "right":
        cropX = (self.moving.right) ? walkAnimation() : 1 * 32;
        cropY = 6 * 32;
        break;
      case "down":
        cropX = (self.moving.down) ? walkAnimation() : 1 * 32;
        cropY = 4 * 32;
        break;
    }
    ctx.drawImage(
      self.sprite.walking,
      cropX, cropY,
      32,
      32 - 1, //Minus one because it was clipping the below graphics
      centerX, centerY,
      self.size * self.scale,
      self.size * self.scale
    );
  };

  // Collsion testing
  var collision = function(x, y) {
    playerX = ~~(self.x + x);
    playerY = ~~(self.y + y);
    if(map.data[playerX][playerY].type === 1 && map.data[playerX][playerY].entity != 5) {
      return false;
    }
    return true;
  };
  this.tryMove = function() {
    var speed = speedPerSecond(self.speed);
    var modifier = -speed;

    //Left
    if(self.moving.left
      && !collision(-modifier, 0.5)) {
      self.x -= speed;
    }
    //Up
    if(self.moving.up
      && !collision(0.5, -modifier)) {
      self.y -= speed;
    }
    //Right
    if(self.moving.right
      && !collision(modifier + 1, 0.5)) {
      self.x += speed;
    }
    //down
    if(self.moving.down
      && !collision(0.5, modifier + 1)){
      self.y += speed;
    }
  };

  this.hasBeatStage = function () {
    if(map.data[Math.round(self.x)][Math.round(self.y)].entity === 4 ) {
      console.log("You win!");
      //Create new map
      map.generate(64, 32, 2, 5, 15);
      //Position player in first room
      var room = map.rooms[0];
      self.position(room.x + room.width / 2 - 0.5, room.y + room.height / 2 - 0.5);
    }
  }

  //Player action
  this.action = function() {
    //Open chest
    switch(self.facing) {
      case "left":
        console.log("x:", ~~(self.x - 0.1), "y:",~~self.y);
        if(map.data[~~(self.x - 0.1)][~~self.y].entity === 5 || map.data[~~(self.x - 0.1)][~~self.y + 1].entity === 5) {
          console.log("chest opened");
        }
        break;
      case "up":
        if(map.data[~~self.x][~~(self.y - 0.1)].entity === 5 || map.data[~~self.x + 1][~~(self.y - 0.1)].entity === 5) {
          console.log("chest opened");
        }
        break;
      case "right":
        if(map.data[~~(self.x + 1.1)][~~self.y].entity === 5 || map.data[~~(self.x + 1.1)][~~self.y + 1].entity === 5) {
          console.log("chest opened");
        };
        break;
      case "down":
        if(map.data[~~self.x][~~(self.y + 1.1)].entity === 5 || map.data[~~self.x + 1][~~(self.y + 1.1)].entity === 5) {
          console.log("chest opened");
        }
        break;
    }
  };

}
