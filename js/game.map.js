game.map = {
  size: 64,
  tileSize: 32,
  minRoom: 5,
  maxRoom: 15,
  rooms: [],
  data: [],
  startX: 0,
  startY: 0,
  roomCount: 0,
  init: function() {
    this.generate();
  },
  generate: function() {
    this.data = [];
    this.rooms = [];
    this.roomCount = game.math.random(this.minRoom, this.maxRoom);
    var doesCollide = function(rooms, ignore) {
      for (var i = 0; i < rooms.length; i++) {
          if (i == ignore) continue;
          var check = this.rooms[i];
          if (!((room.x + room.width < check.x) || (room.x > check.x + check.width) || (room.y + room.height < check.y) || (room.y > check.y + check.height)))
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
        this.data[x][y] = {
          x: x,
          y: y,
          type: null,
          entity: null,
          cropX: 0};
      }
    }

    //Generate rooms
    for (var i = 0; i < this.roomCount; i++) {
      var x = game.math.random(1, this.size - this.maxRoom - 1);
      var y = game.math.random(1, this.size - this.maxRoom - 1);
      var width = game.math.random(this.minRoom, this.maxRoom);
      var height = game.math.random(this.minRoom, this.maxRoom);

      var room = {
        x: x,
        y: y,
        width: width,
        height: height,
      };

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
            this.data[x][y].type = 1;
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
        this.data[pointB.x][pointB.y].type = 1;
        //this.data[pointB.x + 1][pointB.y].type = 1;
        //this.data[pointB.x][pointB.y + 1].type = 1;
        //this.data[pointB.x + 1][pointB.y + 1].type = 1;
      }
    }

    //Place walls
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        if (this.data[x][y].type === 1) {
          for (var xx = x - 1; xx <= x + 1; xx++) {
            for (var yy = y - 1; yy <= y + 1; yy++) {
              //Wall
              if (this.data[xx][yy].type == null) {
                this.data[xx][yy].type = 2;
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
    this.data[this.startX][this.startY].entity = 3;

    //Place end
    var room = this.rooms[this.rooms.length - 1];
    var x = game.math.random(room.x, room.x + room.width);
    var y = game.math.random(room.y, room.y + room.height);
    this.data[x][y].entity = 4;

    //Place chests
    for (i = 1; i < this.roomCount - 1; i++) {
      var room = this.rooms[i];
      if(game.math.random(0,100) > 50) {
        //This spawns a game.math.random chest in the room at least 1 tile from cooridor
        //entrances so the player doesn't get blocked in by a chest
        var x = game.math.random(room.x + 1, room.x + room.width - 1);
        var y = game.math.random(room.y + 1, room.y + room.height - 1);
        this.data[x][y].entity = 5;
      }
    }

    //Auto Tile
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        if(this.data[x][y].type === 1) {
          var cropX = 0;
          if(typeof this.data[x][y-1] != "undefined")
            if (this.data[x][y-1].type === 1) cropX +=  1;
          if(typeof this.data[x+1] != "undefined")
            if(this.data[x+1][y].type === 1) cropX += 2;
          if(typeof this.data[x][y+1] != "undefined")
            if(this.data[x][y+1].type === 1) cropX += 4;
          if(typeof this.data[x-1] != "undefined")
            if(this.data[x-1][y].type === 1) cropX += 8;
          this.data[x][y].cropX = cropX;
        } else if(this.data[x][y].type === 2) {
          var cropX = 0;
          if(typeof this.data[x][y-1] != "undefined")
            if (this.data[x][y-1].type === 2) cropX +=  1;
          if(typeof this.data[x+1] != "undefined")
            if(this.data[x+1][y].type === 2) cropX += 2;
          if(typeof this.data[x][y+1] != "undefined")
            if(this.data[x][y+1].type === 2) cropX += 4;
          if(typeof this.data[x-1] != "undefined")
            if(this.data[x-1][y].type === 2) cropX += 8;
          this.data[x][y].cropX = cropX;
        }
      }
    }
  }
};
