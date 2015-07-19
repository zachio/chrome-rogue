game.enemy = {
  enemies: [],
  init: function() {
    this.generate();
  },
  generate: function() {
    function Rat(x, y) {
      this.x = x;
      this.y = y;
      this.startX = x;
      this.speed = 5;
      this.facing = "right";
    }
    //Place rats
    for(var i = 0; i < game.map.rooms.length; i++) {
      var room = game.map.rooms[i];
      //2 out of 3 rooms get a filthy rat
      if(game.math.random(0, 100) > 25) {
        //This spawns a random rat in the room
        var x = game.math.random(room.x + 1, room.x + room.width);
        var y = game.math.random(room.y + 1, room.y + room.height);
        this.enemies.push(new Rat(x, y));
      }
    }
  },
  timeline: Date.now(),
  render: function() {
    var rat = game.assets.sprite.rat;
    var scale = game.map.tileSize * game.render.scale;

    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      var rat = (enemy.speed) ? game.assets.sprite.rat : game.assets.images[7];
      var drawX = Math.floor(scale * enemy.x - game.player.x * scale + window.innerWidth / 2 - game.map.tileSize / 2);
      var drawY = Math.floor(scale * enemy.y - game.player.y * scale + window.innerHeight / 2 - game.map.tileSize / 2);
      var cropY = 0;
      var cropX = 0;
      var playhead = Date.now() - this.timeline;
      if(playhead <= 100)
        cropX = 3 * 32;
      else if(playhead >= 100 && playhead <= 200)
        cropX = 4 * 32;
      else if(playhead >= 200 && playhead <= 300)
        cropX = 5 * 32;
      else if(playhead >= 300 && playhead <= 400)
        cropX = 4 * 32;
      else this.timeline = Date.now();
      switch(enemy.facing) {
        case "left":
          cropY = 1 * 32;
          break;
        case "right":
          cropY = 2 * 32;
          break;
      }
      if(enemy.speed) {
        game.render.ctx.drawImage(
          game.assets.images[5],
          cropX,
          cropY,
          32, 32,
          drawX,
          drawY,
          scale,
          scale
        );
      } else {
        game.render.ctx.drawImage(
          rat,
          drawX,
          drawY,
          scale,
          scale
        );
      }

    }
  },
  update: function() {
    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      if(enemy.x - enemy.startX > 1 && enemy.facing == "right") {
        enemy.speed = -enemy.speed;
        enemy.facing = "left";
      } else if(enemy.x - enemy.startX < -1 && enemy.facing == "left") {
        enemy.speed = Math.abs(enemy.speed);
        enemy.facing = "right";
      }
      enemy.x += game.movement.speedPerSecond(enemy.speed, game.time.tickDuration);
    }
  }
};
