require(
  ["js/Game.js",
  "js/Map.js",
  "js/Sprite.js"],
  main
  );

function main() {
  var roguelike = {
    game: {
      library: null,
      timer: Date.now(),
      tilesets: [],
      audio: [],
      sprites: [],
      initialize: function(canvas, images) {
        var map = roguelike.map;
        var player = roguelike.player;
        var game = this;
        this.library = new Game(canvas);
        this.library.load(images, function run() {
          player.position();
          game.library.audio[1].setAttribute("loop","true");
          //game.library.audio[1].play();
          //Prerender sprites
          //Nothing
          game.sprites[0] = new Sprite();
          //Floor
          game.sprites[1] = new Sprite(game.library.images[0], 0.5 * map.tileSize, 11.5 * map.tileSize);
          //Wall
          game.sprites[2] = new Sprite(game.library.images[0], 0.5 * map.tileSize, 13.5 * map.tileSize);
          //Start
          game.sprites[3] = new Sprite(game.library.images[2], 13 * map.tileSize, 0);
          //End
          game.sprites[4] = new Sprite(game.library.images[2], 5 * map.tileSize, 15 * map.tileSize);
          game.library.loop(game.tick);
        });

      },
      render: function() {
        var map = roguelike.map;
        var player = roguelike.player;
        var game = roguelike.game;
        var startRenderX = (~~(player.x - game.library.screen.width / 2 / map.tileSize) < 0)? 0 : ~~(player.x - game.library.screen.width / 2 / map.tileSize);
        var endRenderX = (~~(player.x + game.library.screen.width / 2 / map.tileSize + 2) > map.size)? map.size : ~~(player.x + game.library.screen.width / 2 / map.tileSize + 2);
        var startRenderY = (~~(player.y - game.library.screen.width / 2 / map.tileSize) < 0) ? 0 : ~~(player.y - game.library.screen.width / 2 / map.tileSize);
        var endRenderY = (~~(player.y + game.library.screen.width / 2 / map.tileSize + 2) > map.size)? map.size : ~~(player.y + game.library.screen.width / 2 / map.tileSize + 2);
        for(var x = startRenderX; x < endRenderX; x++) {
          for(var y = startRenderY; y < endRenderY; y++) {
            var tile = map.data[x][y];
            var drawX = ~~(map.tileSize * map.scale * tile.x - player.x * map.tileSize * map.scale + game.library.screen.width / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
            var drawY = ~~(map.tileSize * map.scale * tile.y - player.y * map.tileSize * map.scale + game.library.screen.height / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
            if(tile.type === 3 || tile.type === 4 ) {
              game.library.ctx.drawImage(
                game.sprites[1],
                drawX, drawY,
                map.tileSize * map.scale,
                map.tileSize * map.scale
              );
            }
            game.library.ctx.drawImage(
              game.sprites[tile.type],
              drawX, drawY,
              map.tileSize * map.scale,
              map.tileSize * map.scale
            );
          }
        }
        player.render();
        game.library.textBox(20, 20, 200,
          ["game.library.fps: " + game.library.fps,
          "player.x: " + ~~player.x,
          "player.y: " + ~~player.y,
          "player.collision: " + player.collision(0,0),
          "player.facing: " + player.facing
        ]);
      },
      update: function() {
        var player = roguelike.player;
        player.tryMove();
      },
      tick: function() {
        var game = roguelike.game;
        game.render();
        game.update();
      }
    },
    map: new Map(64, 32, 2, 5, 15),
    player: {
      moving: {
        left: false,
        up: false,
        right: false,
        down: false
      },
      facing: "down",
      speed: 4,
      size: 32,
      x: 0,
      y: 0,
      image: null,
      render: function() {
        var game = roguelike.game;
        var map = roguelike.map;
        var image = game.library.images[1];
        var ctx = game.library.ctx;
        var centerX = ~~game.library.canvas.width / 2 - map.tileSize / 2;
        var centerY = ~~game.library.canvas.height / 2 - map.tileSize / 2;
        var cropX = 1 * map.tileSize;
        var cropY = 4 * map.tileSize;
        var walkAnimation = function () {
          if(timer < 250) {
            return 1 * map.tileSize;
          } else if(timer >= 250 && timer <= 500) {
            return 0 * map.tileSize;
          } else if(timer > 500 && timer <= 750) {
            return 1 * map.tileSize;
          } else if(timer > 750 && timer <= 1000) {
            return 2 * map.tileSize;
          } else {
            game.timer = Date.now();
            return 1 * map.tileSize;
          }
        }
        var timer = Date.now() - game.timer;
        switch(this.facing) {
          case "left":
            cropX = (this.moving.left) ? walkAnimation() : 1 * map.tileSize;
            cropY = 5 * map.tileSize;
            break;
          case "up":
            cropX = (this.moving.up) ? walkAnimation() : 1 * map.tileSize;
            cropY = 7 * map.tileSize;
            break;
          case "right":
            cropX = (this.moving.right) ? walkAnimation() : 1 * map.tileSize;
            cropY = 6 * map.tileSize;
            break;
          case "down":
            cropX = (this.moving.down) ? walkAnimation() : 1 * map.tileSize;
            cropY = 4 * map.tileSize;
            break;
        }
        ctx.drawImage(
          image,
          cropX, cropY,
          map.tileSize,
          map.tileSize - 1, //Minus one because it was clipping the below graphics
          centerX, centerY,
          map.tileSize * map.scale,
          map.tileSize * map.scale
        );
      },
      position: function() {
        var map = roguelike.map;
        var room = map.rooms[0];
        this.x = room.x + room.width / 2 - 0.5;
        this.y = room.y + room.height / 2 - 0.5;
      },
      collision: function(x, y) {
        var map = roguelike.map;
        var player = roguelike.player;
        playerX = Math.floor(player.x + x);
        playerY = Math.floor(player.y + y);
        if(map.data[playerX][playerY].type === 1 || map.data[playerX][playerY].type === 3 || map.data[playerX][playerY].type === 4) {
          return false;
        } else {
          return true;
        }
      },
      tryMove: function() {
        var game = roguelike.game;
        var map = roguelike.map;
        var speed = game.library.speedPerSecond(this.speed);
        //Left
        if(this.moving.left
          && !this.collision(-speed, 0)
          && !this.collision(-speed, 1)) {
          this.x -= speed;
        }
        //Up
        if(this.moving.up
          && !this.collision(0, -speed)
          && !this.collision(1, -speed)) {
          this.y -= speed;
        }
        //Right
        if(this.moving.right
          && !this.collision(speed + 1, 0)
          && !this.collision(speed + 1, 1)) {
          this.x += speed;
        }
        //down
        if(this.moving.down
          && !this.collision(0, speed + 1)
          && !this.collision(1, speed + 1)) {
          this.y += speed;
        }
      }
    }
  };

  //Key Listeners
  window.onkeydown = function (event) {
    var player = roguelike.player;
    switch (event.keyCode) {
     //Left
     case 37:
      player.facing = "left";
      player.moving.left = true;
      break;
     //Up
     case 38:
      player.facing = "up";
       player.moving.up = true;
       break;
     //Right
     case 39:
      player.facing = "right";
      player.moving.right = true;
      break;
     //Down
     case 40:
      player.facing = "down";
      player.moving.down = true;
      break;
   }
   if(player.moving.left && player.moving.up) player.facing = "up"
  };
  window.onkeyup = function (event) {
    var player = roguelike.player;
    switch (event.keyCode) {
      //Left
      case 37:
        player.moving.left = false;
        break;
      //Up
      case 38:
        player.moving.up = false;
        break;
      //Right
      case 39:
        player.moving.right = false;
        break;
      //Down
      case 40:
        player.moving.down = false;
        break;
    }
    if(player.moving.left) player.facing = "left";
    else if(player.moving.up) player.facing = "up";
    else if(player.moving.right) player.facing = "right";
    else if(player.moving.down) player.facing = "down";
  };

  roguelike.game.initialize("canvas",
  ["assets/images/TileA4.png",
  "assets/images/characterDown.png",
  "assets/images/dungeontileset.png",
  "assets/images/character-face.png",
  "assets/audio/dungeon.mp3",
  "assets/audio/little_miss_sunshine.mp3"]);
}
