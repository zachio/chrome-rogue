game.map = {
  size: 64,
  tileSize: 32,
  minRoom: 5,
  maxRoom: 15,
  rooms: [],
  data: [],
  entities: [],
  startX: 0,
  startY: 0,
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
    this.data = [];
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

    //Generate map 2d array
    for(var x = 0; x < this.size; x++) {
      this.data[x] = [];
      for(var y = 0; y < this.size; y++) {
        //Add tile object
        this.data[x][y] = new game.Tile(x, y);
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
            this.data[x][y].setType("floor");
        }
      }
    }

    //Build Cooridors
    for(var i = 0; i < this.roomCount; i++) {
      var roomA = this.rooms[i];
      if(i < this.roomCount - 1) {
        var roomB = this.rooms[i + 1];
      } else {
        var roomB = this.rooms[0];
      }
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
        this.data[pointB.x][pointB.y].setType("floor");
      }
    }

    //Place walls
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        if (this.data[x][y].type === "floor") {
          for (var xx = x - 1; xx <= x + 1; xx++) {
            for (var yy = y - 1; yy <= y + 1; yy++) {
              //Wall
              if (this.data[xx][yy].type == null) {
                this.data[xx][yy].setType("wall");
              }
            }
          }
        }
      }
    }
    //Place start
    var room = this.rooms[0];
    this.startX = game.math.random(room.x, room.x + room.width);
    this.startY = game.math.random(room.y, room.y + room.height);
    this.entities.push(new game.Tile(this.startX, this.startY, "upstairs"));

    //Place end
    var room = this.rooms[this.rooms.length - 1];
    var endX = game.math.random(room.x, room.x + room.width);
    var endY = game.math.random(room.y, room.y + room.height);
    this.entities.push(new game.Tile(endX, endY, "downstairs"));

    //Place chests
    for (i = 1; i < this.roomCount - 1; i++) {
      var room = this.rooms[i];
      if(game.math.random(0,100) > 50) {
        //This spawns a game.math.random chest in the room at least 1 tile from cooridor
        //entrances so the player doesn't get blocked in by a chest
        var chestX = game.math.random(room.x + 1, room.x + room.width - 1);
        var chestY = game.math.random(room.y + 1, room.y + room.height - 1);
        this.entities.push(new game.Tile(chestX, chestY, "chest"));
      }
    }

    //Auto Tile floor
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        var tile = this.data[x][y];
        if(tile.type === "floor") {
          var cropX = 0;
          if(typeof this.data[x][y-1] != "undefined")
            if (this.data[x][y-1].type === "floor") cropX +=  1;
          if(typeof this.data[x+1] != "undefined")
            if(this.data[x+1][y].type === "floor") cropX += 2;
          if(typeof this.data[x][y+1] != "undefined")
            if(this.data[x][y+1].type === "floor") cropX += 4;
          if(typeof this.data[x-1] != "undefined")
            if(this.data[x-1][y].type === "floor") cropX += 8;
          tile.cropX = cropX * tile.cropWidth;
        }
      }
    }
  }
};
