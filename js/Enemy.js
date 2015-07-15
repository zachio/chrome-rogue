function Enemy(map, player) {
  this.enemies = [];
  this.Rat = function(x, y) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.speed = 0.1;
    this.direction = "right";
  };
  this.generate = function(map) {
    //Place rats
    for(var i = 0; i < map.rooms.length; i++) {
      var room = map.rooms[i];
      //2 out of 3 rooms get a filthy rat
      if(game.random(0, 100) > 25) {
        //This spawns a random rat in the room
        var x = game.random(room.x + 1, room.x + room.width);
        var y = game.random(room.y + 1, room.y + room.height);
        var rat = new this.Rat(x,y);
        this.enemies.push(rat);
      }
    }
  };
  this.render = function() {
    var rat = new Sprite(game.assets.images[6], 4, 0);
    var scale = map.tileSize * map.scale;
    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      var drawX = Math.floor(scale * enemy.x - player.x * scale + window.innerWidth / 2 - map.tileSize / 2);
      var drawY = Math.floor(scale * enemy.y - player.y * scale + window.innerHeight / 2 - map.tileSize / 2);
      game.ctx.drawImage(
        rat,
        drawX,
        drawY,
        scale,
        scale
      );
    }
  };
  this.update = function() {
    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      if(enemy.x - enemy.startX > 1 && enemy.direction == "right") {
        enemy.speed = -enemy.speed;
        enemy.direction = "left";
      } else if(enemy.x - enemy.startX < -1 && enemy.direction == "left") {
        enemy.speed = Math.abs(enemy.speed);
        enemy.direction = "right";
      }
      enemy.x += enemy.speed;
    }
  };
};
