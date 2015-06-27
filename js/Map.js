function Map(size, tileSize, scale, min_room, max_room) {
  this.size = size;
  this.tileSize = tileSize;
  this.scale = scale;
  var self = this;
  this.rooms = [];
  this.data = [];

  var Tile = function(x, y, type) {
    var self = this;
    this.x = x;
    this.y = y;
    this.type = type;
    this.entity = null;
    this.cropX = 0;
  };
  var Room = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  var random = function(min, max) {
    return ~~(Math.random() * (max - min)) + min;
  };
  var doesCollide = function(room, ignore) {
    for (var i = 0; i < self.rooms.length; i++) {
        if (i == ignore) continue;
        var check = self.rooms[i];
        if (!((room.x + room.width < check.x) || (room.x > check.x + check.width) || (room.y + room.height < check.y) || (room.y > check.y + check.height)))
            return true;
    }

    return false;
  };

  //room data
  var room_min_size = random(min_room, max_room);
  var room_max_size = random(min_room, max_room);
  var room_count = random(min_room, max_room);

  //Generate map 2d array
  for(var x = 0; x < size; x++) {
    this.data[x] = [];
    for(var y = 0; y < size; y++) {
      this.data[x][y] = new Tile(x, y, 0);
    }
  }

  //room data
  var room_count = random(5, 15);
  var min_size = 5;
  var max_size = 15;

  //Generate rooms
  for (var i = 0; i < room_count; i++) {

    var x = random(1, this.size - max_size - 1);
    var y = random(1, this.size - max_size - 1);
    var width = random(min_size, max_size);
    var height = random(min_size, max_size);

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
  var room_count = this.rooms.length;
  for (i = 0; i < room_count; i++) {
    var room = this.rooms[i];
    for (var x = room.x; x < room.x + room.width; x++) {
      for (var y = room.y; y < room.y + room.height; y++) {
          this.data[x][y].type = 1;
      }
    }
  }

  //Build Cooridors
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
            if (this.data[xx][yy].type == 0) this.data[xx][yy].type = 2;
          }
        }
      }
    }
  }
  //Place start
  var room = this.rooms[0];
  var x = random(room.x, room.x + room.width);
  var y = random(room.y, room.y + room.height);
  this.data[x][y].entity = 3;

  //Place end
  var room = this.rooms[this.rooms.length - 1];
  var x = random(room.x, room.x + room.width);
  var y = random(room.y, room.y + room.height);
  this.data[x][y].entity = 4;

  //Place chests
  for (i = 1; i < room_count - 1; i++) {
    var room = this.rooms[i];
    if(random(0,100) > 50) {
      //This spawns a random chest in the room at least 1 tile from cooridor
      //entrances so the player doesn't get blocked in by a chest
      var x = random(room.x + 1, room.x + room.width - 1);
      var y = random(room.y + 1, room.y + room.height - 1);
      console.log("x: ", x, "y: ", y);
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


};
