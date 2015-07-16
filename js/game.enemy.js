game.enemy = {
  enemies: [],
  Rat: function(x, y) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.speed = 0.1;
    this.direction = "right";
  },
  generate: function(map) {
    //Place rats
    for(var i = 0; i < game.map.rooms.length; i++) {
      var room = game.map.rooms[i];
      //2 out of 3 rooms get a filthy rat
      if(game.math.random(0, 100) > 25) {
        //This spawns a random rat in the room
        var x = game.math.random(room.x + 1, room.x + room.width);
        var y = game.math.random(room.y + 1, room.y + room.height);
        var rat = new this.Rat(x,y);
        this.enemies.push(
          {x: x, y: y, startX: x, speed: 0.1, direction: "right"});
      }
    }
  },
  render: function() {
    var rat = game.assets.sprite.rat;
    var scale = game.map.tileSize * game.render.scale;
    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      var drawX = Math.floor(scale * enemy.x - game.player.x * scale + window.innerWidth / 2 - game.map.tileSize / 2);
      var drawY = Math.floor(scale * enemy.y - game.player.y * scale + window.innerHeight / 2 - game.map.tileSize / 2);
      game.render.ctx.drawImage(
        rat,
        drawX,
        drawY,
        scale,
        scale
      );
    }
  },
  update: function() {
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
  }
};
