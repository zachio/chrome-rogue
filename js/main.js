'use strict'

//Game will prepare a canvas to draw on and set it to full screen
var game = new Game();

//Game.load will load the assets and calls the main function when the assets are ready to use
game.load([
"assets/images/TileA4.png",
"assets/images/characterDown.png",
"assets/images/dungeontileset.png",
"assets/images/character-face.png",
"assets/images/chest.png",
"assets/images/loading.gif",
"assets/images/rat.png",
"assets/audio/dungeon.mp3",
"assets/audio/little_miss_sunshine.mp3",
"assets/audio/steps.mp3"], main);

//main is the game loop that draws and updates the game
function main() {
  var songs = [
    game.assets.audio[0],
    game.assets.audio[1]
  ];
  var sounds = [
    game.assets.audio[2]
  ];
  sounds[0].loop = false;

  var enemy = {
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
    },
    render: function() {
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


  // This plays a random song
  game.songSelect = Math.floor(Math.random() * songs.length);
  songs[game.songSelect].play();

  //Map will generate a random dungeon and has scale data
  var map = new Map(64, 32, 2, 5, 15);

enemy.generate(map);


  //Player will set the player graphics and collision detection
  var player = new Player(game.assets.images[1], game.ctx, map, game.speedPerSecond);

  //Position player in first room
  var room = map.rooms[0];
  player.position(map.startX, map.startY);

  //Graphical
  var sprite = {
    floor: new TileSheet(game.assets.images[0], map.tileSize, 0, 10),
    wall: new Sprite(game.assets.images[0], 0.5, 13.5),
    start: new Sprite(game.assets.images[2], 13, 0),
    end: new Sprite(game.assets.images[2], 5, 15),
    chest: new Sprite(game.assets.images[4], 6, 4),
    rat: new Sprite(game.assets.images[6], 4, 0)
  };
  var draw = function(sprite, x, y) {
    game.ctx.drawImage(
      sprite,
      x, y,
      map.tileSize * map.scale,
      map.tileSize * map.scale
    );
  };
  var render = function() {
    var startRenderX = (~~(player.x - window.innerWidth / 2 / map.tileSize) < 0)? 0 : ~~(player.x - window.innerWidth / 2 / map.tileSize);
    var endRenderX = (~~(player.x + window.innerWidth / 2 / map.tileSize + 2) > map.size)? map.size : ~~(player.x + window.innerWidth / 2 / map.tileSize + 2);
    var startRenderY = (~~(player.y - window.innerWidth / 2 / map.tileSize) < 0) ? 0 : ~~(player.y - window.innerWidth / 2 / map.tileSize);
    var endRenderY = (~~(player.y + window.innerWidth / 2 / map.tileSize + 2) > map.size)? map.size : ~~(player.y + window.innerWidth / 2 / map.tileSize + 2);
    for(var x = startRenderX; x < endRenderX; x++) {
      for(var y = startRenderY; y < endRenderY; y++) {
        var tile = map.data[x][y];
        var tileSize = map.tileSize * map.scale;
        var drawX = ~~(tileSize * tile.x - player.x * tileSize + window.innerWidth / 2 - map.tileSize / 2);
        var drawY = ~~(tileSize * tile.y - player.y * tileSize + window.innerHeight / 2 - map.tileSize / 2);
        //draw first layer
        switch(tile.type) {
          case 0:
            break;
          case 1:
            game.ctx.drawImage(
              sprite.floor,
              tile.cropX * map.tileSize, 0,
              map.tileSize, map.tileSize,
              drawX, drawY,
              tileSize,
              tileSize
            );
            break;
          case 2:
            draw(sprite.wall, drawX, drawY);
            break;
        }
        //draw second layer
        switch(tile.entity) {
          case 3:
            draw(sprite.start, drawX, drawY);
          break;
          case 4:
            draw(sprite.end, drawX,drawY)
            break;
          case 5:
            draw(sprite.chest, drawX, drawY);
            break;
          case 6:
            draw(sprite.rat, drawX, drawY);
            break;
        }
      }
    }
    enemy.render();
    player.render();
    game.messageBox(20, 20, 200,
      ["game.fps: " + game.fps,
      "player.x: " + ~~player.x,
      "player.y: " + ~~player.y,
      "game.autotile (press 1): " + game.autotile,
      "game.muted (press M): " + game.muted
    ]);
  };

  var update = function() {
    player.tryMove();
    player.hasBeatStage(sounds[0]);
    enemy.update();
    if(sounds[0].currentTime > 1.25) {
      sounds[0].pause();
      sounds[0].load();
    }
  };

  var tick = function() {
    render();
    update();
  };

  game.loop(tick);

  //Key Listeners
  window.onkeydown = function (event) {
    switch (event.keyCode) {
       //Left
      case 37:
      case 65: // a
        player.facing = "left";
        player.moving.left = true;
        break;
       //Up
      case 38:
      case 87: // w
        player.facing = "up";
         player.moving.up = true;
         break;
       //Right
      case 39:
      case 68: // d
        player.facing = "right";
        player.moving.right = true;
        break;
       //Down
      case 40:
      case 83: // s
        player.facing = "down";
        player.moving.down = true;
        break;
      //options
      case 49: // 1 toggle autotile
        game.autotile = (game.autotile) ? false : true;
        break;
      case 50: // 2 toggle walls
        game.walls = (game.walls) ? false : true;
        break;
      case 187: // + increase scale
        map.scale++;
        break;
      case 189: // - decrease scale
        map.scale--;
        break;
      case 32: // Space Action
        player.action();
        break;
      case 77:
        if(game.muted) {
          game.assets.audio[game.songSelect].play(); game.muted = false;
        } else {
          game.assets.audio[game.songSelect].pause(); game.muted = true;
        }
        break;

   }
  };
  window.onkeyup = function (event) {
    switch (event.keyCode) {
      //Left
      case 37:
      case 65: // a
        player.moving.left = false;
        break;
      //Up
      case 38:
      case 87: // w
        player.moving.up = false;
        break;
      //Right
      case 39:
      case 68: // s
        player.moving.right = false;
        break;
      //Down
      case 40:
      case 83: // s
        player.moving.down = false;
        break;
    }
    if(player.moving.left) player.facing = "left";
    else if(player.moving.up) player.facing = "up";
    else if(player.moving.right) player.facing = "right";
    else if(player.moving.down) player.facing = "down";
  };
}
