var roguelike = {
  game: {
    library: null,
    timer: Date.now(),
    images: [],
    initialize: function(canvas, images) {
      var map = roguelike.map;
      var player = roguelike.player;
      var game = this;
      this.library = new Game(canvas);
      this.library.load(images, function run() {
        map.generate();
        player.position();
        game.library.audio[0].setAttribute("loop","true");
        game.library.audio[0].play();
        game.library.loop(game.tick);
      });
    },
    render: function() {
      var map = roguelike.map;
      var player = roguelike.player;
      var game = roguelike.game;

      var drawRect = function(color, tile) {
        var x = ~~(map.tileSize * map.scale * tile.x - player.x * map.tileSize * map.scale + game.library.screen.width / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
        var y = ~~(map.tileSize * map.scale * tile.y - player.y * map.tileSize * map.scale + game.library.screen.height / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
        game.library.ctx.fillStyle = color;
        game.library.ctx.fillRect(
        x, y,
        map.tileSize * map.tileSize,
        map.tileSize * map.tileSize);
      };
      var drawImage = function(tile) {
        var x = ~~(map.tileSize * map.scale * tile.x - player.x * map.tileSize * map.scale + game.library.screen.width / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
        var y = ~~(map.tileSize * map.scale * tile.y - player.y * map.tileSize * map.scale + game.library.screen.height / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
        game.library.ctx.drawImage(
          tile.image,
          tile.cropX,
          tile.cropY,
          map.tileSize,
          map.tileSize,
          x, y,
          map.tileSize * map.scale,
          map.tileSize * map.scale
        );
      };
      drawFloor = function(tile) {
        var map = roguelike.map;
        var image = game.library.images[0];
        var cropX = 0.5 * map.tileSize;
        var cropY = 11.5 * map.tileSize;
        var x = ~~(map.tileSize * map.scale * tile.x - player.x * map.tileSize * map.scale + game.library.screen.width / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
        var y = ~~(map.tileSize * map.scale * tile.y - player.y * map.tileSize * map.scale + game.library.screen.height / 2 - map.tileSize * map.scale / 2 + map.tileSize / 2);
        game.library.ctx.drawImage(
          image,
          cropX,
          cropY,
          map.tileSize,
          map.tileSize,
          x, y,
          map.tileSize * map.scale,
          map.tileSize * map.scale
        );
      };
      var testRenderA = function() {
        var startRenderX = (~~(player.x - game.library.screen.width / 2 / map.tileSize) < 0)? 0 : ~~(player.x - game.library.screen.width / 2 / map.tileSize);
        var endRenderX = (~~(player.x + game.library.screen.width / 2 / map.tileSize + 2) > map.size)? map.size : ~~(player.x + game.library.screen.width / 2 / map.tileSize + 2);
        var startRenderY = (~~(player.y - game.library.screen.width / 2 / map.tileSize) < 0) ? 0 : ~~(player.y - game.library.screen.width / 2 / map.tileSize);
        var endRenderY = (~~(player.y + game.library.screen.width / 2 / map.tileSize + 2) > map.size)? map.size : ~~(player.y + game.library.screen.width / 2 / map.tileSize + 2);
        for(var x = startRenderX; x < endRenderX; x++) {
          for(var y = startRenderY; y < endRenderY; y++) {
            var tile = map.data[x][y];
            switch(tile.type) {
              //Nothing
              case 0:
                //drawRect("#351330", tile);
                break;
              //floor
              case 1:
                drawImage(tile);
                break;
              //Wall
              case 2:
                drawImage(tile);
                break;
              //start
              case 3:
                drawFloor(tile);
                drawImage(tile);
                break;
              case 4:
                drawFloor(tile);
                drawImage(tile);
                break;
            }

          }

        }
      };
      testRenderA();

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
  map: {
    size: 64,
    scale: 2,
    tileSize: 32,
    data: [],
    rooms: [],
    library: null,
    Tile: function(x, y, type) {
      var game = roguelike.game;
      var map = roguelike.map;
      this.x = x;
      this.y = y;
      this.type = type;
      this.cropX = null;
      this.cropY = null;

    },
    generate: function() {
      var game = roguelike.game;
      var self = this;
      var placeWalls =  function() {
        var map = roguelike.map;
        for (var x = 0; x < map.size; x++) {
          for (var y = 0; y < map.size; y++) {
            if (map.data[x][y].type === 1) {
              for (var xx = x - 1; xx <= x + 1; xx++) {
                for (var yy = y - 1; yy <= y + 1; yy++) {
                  //Wall
                  if (map.data[xx][yy].type == 0) map.data[xx][yy].type = 2;
                }
              }
            }
          }
        }
      };
      var placeRooms = function() {
        var map = roguelike.map;
        var room_count = map.rooms.length;
        for (i = 0; i < room_count; i++) {
          var room = map.rooms[i];
          for (var x = room.x; x < room.x + room.w; x++) {
            for (var y = room.y; y < room.y + room.h; y++) {
                //Floor
                map.data[x][y].type = 1;
            }
          }
        }
      };
      var buildCooridors = function() {
        var game = roguelike.game;
        var map = roguelike.map;
        var room_count = map.rooms.length;
        for(var i = 0; i < room_count; i++) {
          var roomA = map.rooms[i];
          if(i < room_count - 1) {
            var roomB = map.rooms[i + 1];
          } else {
            var roomB = map.rooms[0];
          }
          pointA = {
            x: game.library.random(roomA.x, roomA.x + roomA.w),
            y: game.library.random(roomA.y, roomA.y + roomA.h)
          };
          pointB = {
            x: game.library.random(roomB.x, roomB.x + roomB.w),
            y: game.library.random(roomB.y, roomB.y + roomB.h)
          };
          while((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
            if (pointB.x != pointA.x) {
              if (pointB.x > pointA.x) pointB.x--;
               else pointB.x++;
             } else if (pointB.y != pointA.y) {
                 if (pointB.y > pointA.y) pointB.y--;
                 else pointB.y++;
             }
            //Floor
            map.data[pointB.x][pointB.y].type = 1;
            map.data[pointB.x + 1][pointB.y].type = 1;
            map.data[pointB.x][pointB.y + 1].type = 1;
            map.data[pointB.x + 1][pointB.y + 1].type = 1;
          }
        }
      };
      var placeStart = function() {
        var map = roguelike.map;
        var room = map.rooms[0];
        var x = game.library.random(room.x, room.x + room.w);
        var y = game.library.random(room.y, room.y + room.h);
        map.data[x][y].type = 3;
      };
      var placeEnd = function() {
        var map = roguelike.map;
        var room = map.rooms[map.rooms.length - 1];
        var x = game.library.random(room.x, room.x + room.w);
        var y = game.library.random(room.y, room.y + room.h);
        console.log("map.data["+x+"]["+y+"]");
        map.data[x][y].type = 4;
      };

      var doesCollide = function(room, ignore) {
        for (var i = 0; i < self.rooms.length; i++) {
            if (i == ignore) continue;
            var check = self.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h)))
                return true;
        }

        return false;
      };


      //Generate map 2d array
      for(var x = 0; x < this.size; x++) {
        this.data[x] = [];
        for(var y = 0; y < this.size; y++) {
          this.data[x][y] = new this.Tile(x, y, 0);
        }
      }

      //room data
      var room_count = game.library.random(5, 15);
      var min_size = 5;
      var max_size = 15;

      //Generate rooms
      for (var i = 0; i < room_count; i++) {
        var room = {};

        room.x = game.library.random(1, this.size - max_size - 1);
        room.y = game.library.random(1, this.size - max_size - 1);
        room.w = game.library.random(min_size, max_size);
        room.h = game.library.random(min_size, max_size);

        if (doesCollide(room)) {
            i--;
            continue;
        }
        room.w--;
        room.h--;

        this.rooms.push(room);
      }

      // Place cooridors
      buildCooridors();

      //Place rooms on the map
      placeRooms();

      //Place start position
      placeStart();

      //Place end position
      placeEnd();

      //Place walls on the map
      placeWalls();

      //Update tile type and crop data
      for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
          var tile = this.data[x][y];
          switch(tile.type) {
            case 0:
              continue;
            case 1: // Floor
              tile.image = game.library.images[0];
              tile.cropX = 0.5 * this.tileSize;
              tile.cropY = 11.5 * this.tileSize;
              continue;
            case 2: // Wall
              tile.image = game.library.images[0];
              tile.cropX = 0.5 * this.tileSize;
              tile.cropY = 13.5 * this.tileSize;
              continue;
            case 3: // Start
              tile.image = game.library.images[2];
              tile.cropX = 13 * this.tileSize;
              tile.cropY = 0;
              break;
            case 4: // End
              tile.image = game.library.images[2];
              tile.cropX = 5 * this.tileSize;
              tile.cropY = 15 * this.tileSize;
              break;
          }
        }
      }
    }

  },
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
      this.x = room.x + room.w / 2 - 0.5;
      this.y = room.y + room.h / 2 - 0.5;
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

roguelike.game.initialize("canvas", ["assets/images/TileA4.png", "assets/images/characterDown.png","assets/images/dungeontileset.png", "assets/images/character-face.png","assets/audio/dungeon.mp3"]);
