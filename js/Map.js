function Map(size, min_room, max_room) {
  var self = this;
  this.rooms = [];
  this.data = [];
  this.size = size;
  this.Tile = function(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.cropX = null;
    this.cropY = null;
  };
  var random = function(min, max) {
    return ~~(Math.random() * (max - min)) + min;
  };
  //room data
  var room_min_size = random(min_room, max_room);
  var room_max_size = random(min_room, max_room);
  var room_count = random(min_room, max_room);


  //Generate map 2d array
  for(var x = 0; x < size; x++) {
    this.data[x] = [];
    for(var y = 0; y < size; y++) {
      this.data[x][y] = new this.Tile(x, y, 0);
    }
  }

  function doesCollide(room, ignore) {
    for (var i = 0; i < room_count; i++) {
        //if (i == ignore) continue;
        var check = self.rooms[i];
        if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h)))
            return true;
    }
    return false;
  }
  var separateRooms = function() {
    for(var i = 0; i < self.rooms.length; i++) {
        var room = self.rooms[i];
        if (doesCollide(room)) {
            i--;
            continue;
        }
        room.w--;
        room.h--;
      };
    }

  //Generate rooms
  for (var i = 0; i < room_count; i++) {
    var room = {};

    room.x = random(1, size - room_max_size - 1);
    room.y = random(1, size - room_max_size - 1);
    room.w = random(room_min_size, room_max_size);
    room.h = random(room_min_size, room_max_size);

    room.w--;
    room.h--;

    this.rooms.push(room);
  }
  //separateRooms();

  // Place cooridors
  for(var i = 0; i < room_count; i++) {
    var roomA = this.rooms[i];
    if(i < room_count - 1) {
      var roomB = this.rooms[i + 1];
    } else {
      var roomB = this.rooms[0];
    }
    pointA = {
      x: random(roomA.x, roomA.x + roomA.w),
      y: random(roomA.y, roomA.y + roomA.h)
    };
    pointB = {
      x: random(roomB.x, roomB.x + roomB.w),
      y: random(roomB.y, roomB.y + roomB.h)
    };
    console.log(pointA);
    console.log(pointB);
    while((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
      if (pointB.x != pointA.x) {
        if (pointB.x > pointA.x) pointB.x--;
         else pointB.x++;
       } else if (pointB.y != pointA.y) {
           if (pointB.y > pointA.y) pointB.y--;
           else pointB.y++;
       }
      //Floor
      this.data[pointB.x][pointB.y].type = 1;
      this.data[pointB.x + 1][pointB.y].type = 1;
      this.data[pointB.x][pointB.y + 1].type = 1;
      this.data[pointB.x + 1][pointB.y + 1].type = 1;
    }
  }

  //Place rooms on the map
  for (i = 0; i < room_count; i++) {
    var room = this.rooms[i];
    for (var x = room.x; x < room.x + room.w; x++) {
      for (var y = room.y; y < room.y + room.h; y++) {
        //Floor
        this.data[x][y].type = 1;
      }
    }
  }

  //Place start position
  var room = this.rooms[0];
  var x = random(room.x, room.x + room.w);
  var y = random(room.y, room.y + room.h);
  this.data[x][y].type = 3;

  //Place end position
  var room = this.rooms[this.rooms.length - 1];
  var x = random(room.x, room.x + room.w);
  var y = random(room.y, room.y + room.h);
  this.data[x][y].type = 4;

  //Place walls on the map
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      if (this.data[x][y].type === 1) {
        for (var xx = x - 1; xx <= x + 1; xx++) {
          for (var yy = y - 1; yy <= y + 1; yy++) {
            //Wall
            console.log("x: " + x);
            console.log("y: " + y);
            if (this.data[xx][yy].type == 0) this.data[xx][yy].type = 2;
          }
        }
      }
    }
  }

  //Update tile type and crop data
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var tile = this.data[x][y];
      switch(tile.type) {
        case 0:
          continue;
        case 1: // Floor
          //tile.image = game.library.images[0];
          tile.cropX = 0.5 * this.tileSize;
          tile.cropY = 11.5 * this.tileSize;
          continue;
        case 2: // Wall
          //tile.image = game.library.images[0];
          tile.cropX = 0.5 * this.tileSize;
          tile.cropY = 13.5 * this.tileSize;
          continue;
        case 3: // Start
          //tile.image = game.library.images[2];
          tile.cropX = 13 * this.tileSize;
          tile.cropY = 0;
          break;
        case 4: // End
          //tile.image = game.library.images[2];
          tile.cropX = 5 * this.tileSize;
          tile.cropY = 15 * this.tileSize;
          break;
      }
    }
  }
}
