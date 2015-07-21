game.map = {
  size: 64,
  tileSize: 32,
  minRoom: 5,
  maxRoom: 15,
  rooms: [],
  layer: [[],[]],
  entities: [],
  entranceX: 0,
  entranceY: 0,
  exitX: 0,
  exitY: 0,
  roomCount: 0,
  init: function() {
    this.generate();
  },
  //Searches for an entity
  search: function(type, x, y) {
    for(var i = 0; i < this.entities.length; i++) {
      if(this.entities[i].type === type && this.entities[i].x === x && this.entities[i].y === y) {
        return true;
      }
    }
    return false;
  },
  generate: function() {
    this.layer = [[],[]];
    this.rooms = [];
    this.roomCount = game.math.random(this.minRoom, this.maxRoom);

    function Room(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    var doesCollide = function(rooms, ignore) {
      for (var i = 0; i < rooms.length; i++) {
          if (i == ignore) continue;
            var check = this.rooms[i];
          if (!((room.x + room.width < check.x)
          || (room.x > check.x + check.width)
          || (room.y + room.height < check.y)
          || (room.y > check.y + check.height)))
            return true;
      }
      return false;
    };

    //room data
    var room_min_size = game.math.random(this.minRoom, this.maxRoom);
    var room_max_size = game.math.random(this.minRoom, this.maxRoom);

    //Generate map layers
    for(var lvl = 0; lvl < this.layer.length; lvl++) {
      for(var x = 0; x < this.size; x++) {
        this.layer[lvl][x] = [];
        for(var y = 0; y < this.size; y++) {
          //Add tile object
          this.layer[lvl][x][y] = new game.Tile(x, y);
        }
      }
    }

    //Generate rooms
    for (var i = 0; i < this.roomCount; i++) {
      var x = game.math.random(1, this.size - this.maxRoom - 1);
      var y = game.math.random(1, this.size - this.maxRoom - 1);
      var width = game.math.random(this.minRoom, this.maxRoom);
      var height = game.math.random(this.minRoom, this.maxRoom);

      var room = new Room(x, y, width, height);

      if (doesCollide(room)) {
          i--;
          continue;
      }
      room.width--;
      room.height--;

      this.rooms.push(room);
    }

    //Place rooms
    for (i = 0; i < this.roomCount; i++) {
      var room = this.rooms[i];
      for (var x = room.x; x < room.x + room.width; x++) {
        for (var y = room.y; y < room.y + room.height; y++) {
            this.layer[0][x][y].setType("floor");
        }
      }
    }

    //Build Cooridors
    for(var i = 0; i < this.roomCount - 1; i++) {
      var roomA = this.rooms[i];
      var roomB = this.rooms[i + 1];

      pointA = {
        x: game.math.random(roomA.x, roomA.x + roomA.width),
        y: game.math.random(roomA.y, roomA.y + roomA.height)
      };
      pointB = {
        x: game.math.random(roomB.x, roomB.x + roomB.width),
        y: game.math.random(roomB.y, roomB.y + roomB.height)
      };

      while((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
        if (pointB.x != pointA.x) {
          if (pointB.x > pointA.x) pointB.x--;
           else pointB.x++;
         } else if (pointB.y != pointA.y) {
             if (pointB.y > pointA.y) pointB.y--;
             else pointB.y++;
         }
        this.layer[0][pointB.x][pointB.y].setType("floor");
      }
    }

    //Place walls
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        if (this.layer[0][x][y].type === "floor") {
          for (var xx = x - 1; xx <= x + 1; xx++) {
            for (var yy = y - 1; yy <= y + 1; yy++) {
              //Wall
              if (this.layer[0][xx][yy].type == null) {
                this.layer[0][xx][yy].setType("wall");
              }
            }
          }
        }
      }
    }
    //Place start
    var room = this.rooms[0];
    this.entranceX = game.math.random(room.x + 1, room.x + room.width - 1);
    this.entranceY = game.math.random(room.y + 1, room.y + room.height - 1);
    if(game.level) this.layer[1][this.entranceX][this.entranceY].setType("upstairs");

    //Place end
    var room = this.rooms[this.rooms.length - 1];
    this.exitX = game.math.random(room.x + 1, room.x + room.width - 1);
    this.exitY = game.math.random(room.y + 1, room.y + room.height - 1);
    this.layer[1][this.exitX][this.exitY].setType("downstairs");

    //Place chests
    var chests = [];
    //Makes sure there is at least one chest
    var room = this.rooms[game.math.random(0,this.roomCount - 1)];
    var chestX = game.math.random(room.x + 1, room.x + room.width - 1);
    var chestY = game.math.random(room.y + 1, room.y + room.height - 1);
    this.layer[1][chestX][chestY].setType("chest");
    chests.push(this.layer[1][chestX][chestY]);
    for (i = 1; i < this.roomCount - 1; i++) {
      var room = this.rooms[i];
      if(game.math.random(0,100) > 50) {
        //This spawns a game.math.random chest in the room at least 1 tile from cooridor
        //entrances so the player doesn't get blocked in by a chest
        var chestX = game.math.random(room.x + 1, room.x + room.width - 1);
        var chestY = game.math.random(room.y + 1, room.y + room.height - 1);
        if(this.layer[1][chestX][chestY].type != "chest") {
          this.layer[1][chestX][chestY].setType("chest");
          chests.push(this.layer[1][chestX][chestY]);
        }
      }
    }
    //Place key in a random chest
    chests[game.math.random(0, chests.length - 1)].item = {name: "key", quanity: 1};

    //Auto Tile floor
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        var tile = this.layer[0][x][y];
        if(tile.type === "floor") {
          var cropX = 0;
          if(typeof this.layer[0][x][y-1] != "undefined")
            if (this.layer[0][x][y-1].type === "floor") cropX +=  1;
          if(typeof this.layer[0][x+1] != "undefined")
            if(this.layer[0][x+1][y].type === "floor") cropX += 2;
          if(typeof this.layer[0][x][y+1] != "undefined")
            if(this.layer[0][x][y+1].type === "floor") cropX += 4;
          if(typeof this.layer[0][x-1] != "undefined")
            if(this.layer[0][x-1][y].type === "floor") cropX += 8;
          tile.cropX = cropX * tile.cropWidth;
        }
      }
    }
  },
  update: function() {
    for(var x = 0; x < this.size; x++) {
      for(var y = 0; y < this.size; y++) {
        var tile = this.layer[1][x][y];
        switch(tile.type) {
          case "chest":
            var playhead = Date.now() - tile.timeline;
            if(playhead < 500) {
              if(playhead <= 100) {
                tile.cropY = 1 * 32;
              } else if(playhead <= 200) {
                tile.cropY = 2 * 32;
              } else if(playhead <= 300) {
                tile.cropY = 3 * 32;
              } else if(playhead <= 400) {
                if(tile.item) {
                  game.render.alert(["You found a " + tile.item.name]);
                  game.item[tile.item.name] += tile.item.quanity;
                } else {
                  game.render.alert(["You found nothing."]);
                }
              }
            }
            break;
        }

      }
    }
  }
};
