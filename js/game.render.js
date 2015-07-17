game.render = {
  canvas: document.createElement("canvas"),
  fps: 0,
  scale: 2,
  ctx: null,
  init: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.backgroundColor = "black";
    this.canvas.style.cursor = "none";
    this.ctx = this.canvas.getContext("2d");
  	this.ctx.imageSmoothingEnabled = false;
    //Styling body element
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";
  },
  messageBox: function(x, y, width, textArray) {
    var box = {
      x: x,
      y: y,
      width: width,
      height: textArray.length * 20 + 20,
    };
    this.ctx.fillStyle = "rgba(0,0,0,0.8)";
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
    for(var x = startRenderX; x < endRenderX; x++) {
      for(var y = startRenderY; y < endRenderY; y++) {
        var tile = game.map.data[x][y];
        var tileSize = game.map.tileSize * this.scale;
        var drawX = ~~(tileSize * tile.x - game.player.x * tileSize + window.innerWidth / 2 - game.map.tileSize / 2);
        var drawY = ~~(tileSize * tile.y - game.player.y * tileSize + window.innerHeight / 2 - game.map.tileSize / 2);
        //draw first layer
        switch(tile.type) {
          case 0:
            break;
          case 1:
            this.ctx.drawImage(
              game.assets.sprite.floor,
              tile.cropX * game.map.tileSize, 0,
              game.map.tileSize, game.map.tileSize,
              drawX, drawY,
              tileSize,
              tileSize
            );
            break;
          case 2:
            this.draw(game.assets.sprite.wall, drawX, drawY);
            break;
        }
        //draw second layer
        switch(tile.entity) {
          case 3:
            this.draw(game.assets.sprite.start, drawX, drawY);
          break;
          case 4:
            this.draw(game.assets.sprite.end, drawX,drawY)
            break;
          case 5:
            this.draw(game.assets.sprite.chest, drawX, drawY);
            break;
          case 6:
            this.draw(game.assets.sprite.rat, drawX, drawY);
            break;
        }
      }
    }
    game.enemy.render();
    game.player.render();
    game.render.messageBox(20, 20, 200,
      ["game.fps: " + game.render.fps,
      "game.player.x: " + ~~game.player.x,
      "game.player.y: " + ~~game.player.y,
      "game.muted (press M): " + game.music.muted,
      "game.level: " + game.level
    ]);
  }

};
