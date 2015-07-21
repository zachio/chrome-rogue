game.render = {
  canvas: document.createElement("canvas"),
  fps: 0,
  scale: 2,
  ctx: null,
  init: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.backgroundColor = "black";
    this.ctx = this.canvas.getContext("2d");
  	this.ctx.imageSmoothingEnabled = false;
    //Styling body element
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";
  },
  messageBox: function(x, y, width, textArray, fontStyle, textAlign) {
    var box = {
      x: x,
      y: y,
      width: width,
      height: textArray.length * 20 + 20,
    };
    this.ctx.font = fontStyle || "10px Arial";
    this.ctx.textAlign = textAlign || "left";
    this.ctx.fillStyle = "rgba(0,0,0,0.9)";
    this.ctx.fillRect(x, y, box.width, box.height);
    this.ctx.fillStyle = "white";
    for(var i = 0; i < textArray.length; i++) {
      this.ctx.fillText(textArray[i], x + 20, (y + 20 * i) + 20);
    }

  },
  clearScreen: function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
  draw: function(sprite, x, y) {
    this.ctx.drawImage(
      sprite,
      x, y,
      game.map.tileSize * this.scale,
      game.map.tileSize * this.scale
    );
  },
  frame: function() {
    //Draw Map
    var startRenderX = (~~(game.player.x - window.innerWidth / 2 / game.map.tileSize) < 0)? 0 : ~~(game.player.x - window.innerWidth / 2 / game.map.tileSize);
    var endRenderX = (~~(game.player.x + window.innerWidth / 2 / game.map.tileSize + 2) > game.map.size)? game.map.size : ~~(game.player.x + window.innerWidth / 2 / game.map.tileSize + 2);
    var startRenderY = (~~(game.player.y - window.innerWidth / 2 / game.map.tileSize) < 0) ? 0 : ~~(game.player.y - window.innerWidth / 2 / game.map.tileSize);
    var endRenderY = (~~(game.player.y + window.innerWidth / 2 / game.map.tileSize + 2) > game.map.size)? game.map.size : ~~(game.player.y + window.innerWidth / 2 / game.map.tileSize + 2);
    for(var lvl = 0; lvl < game.map.layer.length; lvl++) {
      for(var x = startRenderX; x < endRenderX; x++) {
        for(var y = startRenderY; y < endRenderY; y++) {
          var tile = game.map.layer[lvl][x][y];
          var drawX = ~~(tile.size * tile.x - game.player.x * tile.size + window.innerWidth / 2 - game.map.tileSize / 2);
          var drawY = ~~(tile.size * tile.y - game.player.y * tile.size + window.innerHeight / 2 - game.map.tileSize / 2);
          if(tile.type) {
            this.ctx.drawImage(
              tile.image,
              tile.cropX, tile.cropY,
              tile.cropWidth, tile.cropHeight,
              drawX, drawY,
              tile.size, tile.size
            );
          }
        }
      }
    }

    game.enemy.render();
    game.player.render();
    this.messageBox(20, 20, 200,
      ["game.fps: " + game.render.fps,
      "game.player.x: " + ~~game.player.x,
      "game.player.y: " + ~~game.player.y,
      "game.muted (press M): " + game.music.muted,
      "game.level: " + game.level
    ]);
    game.status.render();
    if(game.message) this.alert();
    if(game.paused) this.pause();
  },
  pause: function() {
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "rgba(0,0,0,0.9)";
    this.ctx.fillRect(window.innerWidth / 2 - 200 / 2, window.innerHeight / 2 - 50 / 2, 200,50);
    this.ctx.fillStyle = "white";
    this.ctx.fillText("PAUSE", window.innerWidth / 2, window.innerHeight / 2 + 5);
  },
  alert: function() {
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "rgba(0,0,0,0.9)";
    this.ctx.fillRect(window.innerWidth / 2 - 400 / 2, window.innerHeight / 2 - 200 / 2, 400,200);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.message , window.innerWidth / 2, window.innerHeight / 2 + 5);
  },
  message: ""

};
