function Player(walkingSprite, ctx, mapData, speedPerSecond) {
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
    playerX = Math.round(self.x + x);
    playerY = Math.round(self.y + y);
    ctx.fillStyle = "red";
    ctx.fillRect(playerX,playerY, 2, 2);
    if(mapData[playerX][playerY].type === 1 && mapData[playerX][playerY].entity != 5) {
      return false;
    }
    return true;
  };
  this.tryMove = function() {
    var speed = speedPerSecond(self.speed);
    var offset = 0;
    //Left
    if(self.moving.left
      && !collision(-speed + offset, 0)
      && !collision(-speed + offset, 1)) {
      self.x -= speed;
    }
    //Up
    if(self.moving.up
      && !collision(0, -speed + offset)
      && !collision(1, -speed + offset)) {
      self.y -= speed;
    }
    //Right
    if(self.moving.right
      && !collision(speed - offset, 0)
      && !collision(speed - offset, 1)) {
      self.x += speed;
    }
    //down
    if(self.moving.down
      && !collision(0, speed - offset)
      && !collision(1, speed - offset)) {
      self.y += speed;
    }
  };

  //Player action
  this.action = function() {
    //Open chest
    switch(self.facing) {
      case "left":
        console.log("x:", ~~(self.x - 0.1), "y:",~~self.y);
        if(mapData[~~(self.x - 0.1)][~~self.y].entity === 5 || mapData[~~(self.x - 0.1)][~~self.y + 1].entity === 5) console.log("chest opened");
        break;
      case "up":
        if(mapData[~~self.x][~~(self.y - 0.1)].entity === 5 || mapData[~~self.x + 1][~~(self.y - 0.1)].entity === 5) console.log("chest opened");
        console.log("x:", ~~self.x, "y:",~~(self.y - 0.1));
        break;
      case "right":
        if(mapData[~~(self.x + 1.1)][~~self.y].entity === 5 || mapData[~~(self.x + 1.1)][~~self.y + 1].entity === 5) console.log("chest opened");
        console.log("x:", ~~(self.x + 1.1), "y:",~~self.y);
        break;
      case "down":
        if(mapData[~~self.x][~~(self.y + 1.1)].entity === 5 || mapData[~~self.x + 1][~~(self.y + 1.1)].entity === 5) console.log("chest opened");
        console.log("x:", ~~self.x, "y:",~~(self.y + 1.1));
        break;
    }
  };

}
