
game.assets = {
  files: [
  "assets/images/TileA4.png",
  "assets/images/characterDown.png",
  "assets/images/dungeontileset.png",
  "assets/images/character-face.png",
  "assets/images/chest.png",
  "assets/images/rat.png",
  "assets/images/sword.png",
  "assets/images/deadrat.png",
  "assets/audio/dungeon.mp3",
  "assets/audio/little_miss_sunshine.mp3",
  "assets/audio/steps.mp3",
  "assets/audio/step.mp3",
  "assets/audio/swing.mp3",
  "assets/audio/hit.mp3",
  "assets/audio/caverns.mp3",
  "assets/audio/chest.mp3",
  "assets/audio/grunt.mp3",
  "assets/audio/scream.mp3"],
  images: [],
  audio: [],
  sprite: {},
  loadingImg: new Image(),
  load: function(callback) {
    var loadStart = Date.now();
    var loadCount = 0;
    var self = this;
    if(this.files.length) {
      for(var i = 0; i < this.files.length; i++) {
        if(this.files[i].search(".png") != -1 || this.files[i].search(".gif") != -1) {
          var image = new Image();
          image.setAttribute("src", this.files[i]);
          this.images.push(image);
          image.onload = function() {
            loadCount++;
            if(loadCount === self.files.length) finish(self.sprite);
          };
        } else if(this.files[i].search(".mp3") != -1) {
          var audio = document.createElement("audio");
          audio.setAttribute("type","audio/mpeg");
  				audio.setAttribute("src", this.files[i]);
          this.audio.push(audio);
          loadCount++;
          if(loadCount === this.files.length) finish(self.sprite);
        }
      }
      function TileSheet(image, tilesize, cropX, cropY) {
        var canvas = document.createElement("canvas");
        canvas.width = tilesize * 16;
        canvas.height = tilesize;
        var ctx = canvas.getContext("2d");
        var left = {
          top: {x: cropX, y: cropY + 1},
          side: {x: cropX, y: cropY + 1.5},
          bottom: {x: cropX, y: cropY + 2.5}
        };
        var top = {
          left: {x: cropX + 0.5, y: cropY + 1},
          right: {x: cropX + 1, y: cropY + 1}
        };
        var right = {
          top: {x: cropX + 1.5, y: cropY + 1},
          side: {x: cropX + 1.5, y: cropY + 1.25},
          bottom: {x: cropX + 1.5, y: cropY + 2.5}
        };
        var bottom = {
          left: {x: cropX + 0.5, y: cropY + 2.5},
          right: {x: cropX + 1, y: cropY + 2.5}
        };
        var inside = {
          left: {x: cropX + 0.5 ,y: cropY + 1.5 },
          right: {x: cropX + 1 ,y: cropY + 1.5 },
          };
        var drawTile = function(crop1, crop2, crop3, crop4) {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = tilesize;
          canvas.height = tilesize;
          ctx.drawImage(image,
            crop1.x * tilesize,
            crop1.y * tilesize,
            tilesize / 2, tilesize / 2,
            0, 0,
            tilesize / 2, tilesize / 2);
          ctx.drawImage(image,
            crop2.x * tilesize,
            crop2.y * tilesize,
            tilesize / 2, tilesize / 2,
            tilesize / 2, 0,
            tilesize / 2, tilesize / 2
          );
          ctx.drawImage(image,
            crop3.x * tilesize,
            crop3.y * tilesize,
            tilesize / 2, tilesize / 2,
            0, tilesize / 2,
            tilesize / 2, tilesize / 2
          );
          ctx.drawImage(image,
            crop4.x * tilesize,
            crop4.y * tilesize,
            tilesize / 2, tilesize / 2,
            tilesize / 2, tilesize / 2,
            tilesize / 2, tilesize / 2
          );
          return canvas;
        };
        var tile = null;
        for(var x = 0; x < 16; x++) {
          switch(x) {
            case 0:
              tile = drawTile(left.top, right.top, left.bottom, right.bottom);
              break;
            case 1:
              tile = drawTile(left.side, right.side, left.bottom, right.bottom);
              break;
            case 2:
              tile = drawTile(left.top, top.left, left.bottom, bottom.right);
              break;
            case 3:
              tile = drawTile(left.side, inside.right, left.bottom, bottom.right);
              break;
            case 4:
              tile = drawTile(left.top, right.top, left.side, right.side);
              break;
            case 5:
              tile = drawTile(left.side, right.side, left.side, right.side);
              break;
            case 6:
              tile = drawTile(left.top, top.left, left.side, inside.right);
              break;
            case 7:
              tile = drawTile(left.side, {x: left.side.x + 0.5,y: left.side.y}, {x: left.side.x, y: left.side.y + 0.5}, {x: left.side.x + 0.5, y: left.side.y + 0.5});
              break;
            case 8:
              tile = drawTile(top.left, right.top, bottom.left, right.bottom);
              break;
            case 9:
              tile = drawTile(inside.left, right.side, bottom.right, right.bottom);
              break;
            case 10:
              tile = drawTile(top.left, top.right, bottom.left, bottom.right);
              break;
            case 11:
              tile = drawTile(inside.left, inside.right, bottom.left, bottom.right);
              break;
            case 12:
              tile = drawTile(top.left, right.top, inside.left, right.side);
              break;
            case 13:
              tile = drawTile(inside.left, right.side, {x: inside.left.x, y: inside.left.y + 0.5}, {x: right.side.x, y: right.side.y + 0.5});
              break;
            case 14:
              tile = drawTile(top.left, top.right, inside.left, inside.right);
              break;
            case 15:
              tile = drawTile(inside.left, inside.right, {x: inside.left.x, y: inside.left.y + 0.5}, {x: inside.right.x, y: inside.right.y + 0.5});
              break;
          }
          ctx.drawImage(tile, x * tilesize, 0);
        }
        return canvas;
      }
      function Sprite(image, cropX1, cropY1, cropX2, cropY2, cropX3, cropY3, cropX4, cropY4) {
        var canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        cropX1 *= 32;
        cropY1 *= 32;
        if(typeof cropX2 != "undefined") {
          cropX2 *= 32;
          cropY2 *= 32;
          cropX3 *= 32;
          cropY3 *= 32;
          cropX4 *= 32;
          cropY4 *= 32;
        }
        var ctx = canvas.getContext("2d");
        //Check if sprite is nothing
        if(typeof image == "undefined") {
          ctx.fillStyle = "black";
          ctx.fillRect(0,0,32,32);
        } else {
          ctx.drawImage(image, cropX1, cropY1, 16, 16, 0, 0, 16, 16); //Top left

          //Check if other crops are set if not just do standard crop
          if(typeof cropX2 == "undefined") {
            ctx.drawImage(image, cropX1 + 16, cropY1, 16, 16, 16, 0, 16, 16); //Top right
            ctx.drawImage(image, cropX1, cropY1 + 16, 16, 16, 0, 16, 16, 16); //Bottom left
            ctx.drawImage(image, cropX1 + 16, cropY1 + 16, 16, 16, 16, 16, 16, 16); //Bottom Right
          } else {
            ctx.drawImage(image, cropX2, cropY2, 16, 16, 16, 0, 16, 16);//Top right
            ctx.drawImage(image, cropX3, cropY3, 16, 16, 0, 16, 16, 16);//Bottom left
            ctx.drawImage(image, cropX4, cropY4, 16, 16, 16, 16, 16, 16);//Bottom Right
          }
        }
        return canvas;
      }
      function Canvas(image, cropX, cropY, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width * 32;
        canvas.height = height * 32;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          cropX * 32, cropY * 32,
          canvas.width, canvas.height,
          0, 0,
          canvas.width, canvas.height
        );
        return canvas;
      }
      var finish = function() {
        console.log("load time: ", Date.now() - loadStart, "ms");
        self.sprite = {
            floor: new TileSheet(game.assets.images[0], game.map.tileSize, 0, 10),
            wall: new Sprite(game.assets.images[0], 0.5, 13.5),
            upstairs: new Sprite(game.assets.images[2], 13, 0),
            downstairs: new Sprite(game.assets.images[2], 5, 15),
            chest: Canvas(game.assets.images[4], 6, 4, 1, 4),
            rat: new Sprite(game.assets.images[5], 4, 0),
            deadrat: new Sprite(game.assets.images[5], 3, 0),
        };
        self.loadingImg.style.display = "none";
        document.body.appendChild(game.render.canvas);
        callback();
      }
    }
  }
};
