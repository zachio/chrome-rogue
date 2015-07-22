game.enemy = {
  enemies: [],
  init: function() {
    this.generate();
  },
  generate: function() {
    function Rat(x, y) {
      this.x = x;
      this.y = y;
      this.cropX = null;
      this.cropY = null;
      this.startX = x;
      this.speed = 5;
      this.facing = "right";
      this.directionPlayhead = Date.now();
      this.directionTimeline = game.math.random(1000, 2000);
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
      if(enemy.speed) {
        game.render.ctx.drawImage(
          game.assets.images[5],
          enemy.cropX,
          enemy.cropY,
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
      var speed = game.movement.speedPerSecond(enemy.speed);
      var playhead = Date.now() - this.timeline;
      if(playhead <= 100)
        enemy.cropX = 3 * 32;
      else if(playhead >= 100 && playhead <= 200)
        enemy.cropX = 4 * 32;
      else if(playhead >= 200 && playhead <= 300)
        enemy.cropX = 5 * 32;
      else if(playhead >= 300 && playhead <= 400)
        enemy.cropX = 4 * 32;
      else this.timeline = Date.now();
      //Enemy Direction
      switch(enemy.facing) {
        case "left":
          enemy.cropY = 1 * 32;
          if(!game.collision.detect(enemy, -speed, 0.9))
            enemy.x -= speed;
          else
            enemy.facing = "right";
          break;
        case "up":
          enemy.cropY = 3 * 32;
          if(!game.collision.detect(enemy, 0.9, -speed))
            enemy.y -= speed;
          else
            enemy.facing = "down";
          break;
        case "right":
          enemy.cropY = 2 * 32;
          if(!game.collision.detect(enemy, speed + 1, 0.9))
            enemy.x += speed;
          else
            enemy.facing = "left";
          break;
        case "down":
          enemy.cropY = 0 * 32;
          if(!game.collision.detect(enemy, 0.9, speed))
            enemy.y += speed;
          else
            enemy.facing = "up";
          break;
      }
      //Switch Direction
      if(Date.now() - enemy.directionPlayhead > enemy.directionTimeline) {
        var directions = ["left","up","right","down"];
        enemy.facing = directions[game.math.random(0,3)];
        enemy.directionPlayhead = Date.now();
        enemy.directionTimeline = game.math.random(1000, 2000);
      }
    }
  }
};
