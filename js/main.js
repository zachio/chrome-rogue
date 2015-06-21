  var roguelike = {
    game: {
      library: null,
      timer: Date.now(),
      tilesets: {},
      audio: [],
      sprites: [],
      autotile: true,
      walls: true,
      muted: false,
      initialize: function(canvas, images) {
        var map = roguelike.map;
        var player = roguelike.player;
        var game = this;
        this.library = new Game(canvas);
        this.library.load(images, function run() {
          player.position();
          game.library.audio[1].setAttribute("loop","true");
          game.library.audio[1].play();
          //Prerender sprites
          //Nothing
          game.sprites[0] = new Sprite();
          //Floor
          game.sprites[1] = new Sprite(game.library.images[0], 0.5, 11.5);
          //Wall
          game.sprites[2] = new Sprite(game.library.images[0], 0.5, 13.5);
          //Start
          game.sprites[3] = new Sprite(game.library.images[2], 13, 0);
          //End
          game.sprites[4] = new Sprite(game.library.images[2], 5, 15);
          //chest
          game.sprites[5] = new Sprite(game.library.images[4], 6, 4);

          // Ground sprite sheet
          game.tilesets.floor = new TileSheet(game.library.images[0], map.tileSize, 0, 10);

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
            var tileSize = map.tileSize * map.scale;
            var drawX = ~~(tileSize * tile.x - player.x * tileSize + game.library.screen.width / 2 - map.tileSize / 2);
            var drawY = ~~(tileSize * tile.y - player.y * tileSize + game.library.screen.height / 2 - map.tileSize / 2);
            switch(tile.type) {
              //Auto tile bam
              case 1:
                if(game.autotile){
                  game.library.ctx.drawImage(
                    game.tilesets.floor,
                    tile.cropX * map.tileSize, 0,
                    map.tileSize, map.tileSize,
                    drawX, drawY,
                    tileSize,
                    tileSize
                  );
                } else {
                  game.library.ctx.drawImage(
                    game.sprites[1],
                    drawX, drawY,
                    tileSize,
                    tileSize
                    );
                }
                break;
              default:
                if(game.walls) {
                  game.library.ctx.drawImage(
                    game.sprites[tile.type],
                    drawX, drawY,
                    tileSize,
                    tileSize
                );
                }
                break;
            }
            if(tile.entity) {
              game.library.ctx.drawImage(
                game.sprites[tile.entity],
                drawX, drawY,
                tileSize,
                tileSize
              );
            }

          }
        }
        player.render();
        game.library.textBox(20, 20, 200,
          ["game.library.fps: " + game.library.fps,
          "player.x: " + ~~player.x,
          "player.y: " + ~~player.y,
          "game.autotile (press 1): " + game.autotile,
          "game.muted (press M): " + game.muted
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
        playerX = ~~(player.x + x);
        playerY = ~~(player.y + y);
        if(map.data[playerX][playerY].type === 1 && map.data[playerX][playerY].entity != 5) {
          return false;
        }
        return true;
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
      },
      action: function() {
        var map = roguelike.map;
        //Open chest
        switch(this.facing) {
          case "left":
            console.log("x:", ~~(this.x - 0.1), "y:",~~this.y);
            if(map.data[~~(this.x - 0.1)][~~this.y].entity === 5) console.log("chest opened");
            break;
          case "up":
            if(map.data[~~this.x][~~(this.y - 0.1)].entity === 5) console.log("chest opened");
            console.log("x:", ~~this.x, "y:",~~(this.y - 0.1));
            break;
          case "right":
            if(map.data[~~(this.x + 1.1)][~~this.y].entity === 5) console.log("chest opened");
            console.log("x:", ~~(this.x + 1.1), "y:",~~this.y);
            break;
          case "down":
            if(map.data[~~this.x][~~this.y + 1.1].entity === 5) console.log("chest opened");
            console.log("x:", ~~this.x, "y:",~~(this.y + 1.1));
            break;
        }

      }
    }
  };

  //Key Listeners
  window.onkeydown = function (event) {
    var player = roguelike.player;
    var game = roguelike.game;
    var map = roguelike.map;
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
          game.library.audio[1].play(); game.muted = false;
        } else {
          game.library.audio[1].pause(); game.muted = true;
        }

        break;

   }
   if(player.moving.left && player.moving.up) player.facing = "up"
  };
  window.onkeyup = function (event) {
    var player = roguelike.player;
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

  roguelike.game.initialize("canvas",
  ["assets/images/TileA4.png",
  "assets/images/characterDown.png",
  "assets/images/dungeontileset.png",
  "assets/images/character-face.png",
  "assets/images/chest.png",
  "assets/audio/dungeon.mp3",
  "assets/audio/little_miss_sunshine.mp3"]);
