game.Tile = function(x, y, type) {
  this.type = type || null;
  this.x = x;
  this.y = y;
  this.image = null;
  this.cropX = 0;
  this.cropY = 0;
  this.type = null;
  this.cropWidth = 32;
  this.cropHeight = 32;
  this.size = game.render.scale * 32;
  var self = this;
  this.setType = function(type) {
    self.type = type;
    switch(self.type) {
      case "floor":
        this.image = game.assets.sprite.floor;
        break;
      case "wall":
        this.image = game.assets.sprite.wall;
        break;
      case "upstairs":
        this.image = game.assets.sprite.upstairs;
        break;
      case "downstairs":
        this.image = game.assets.sprite.downstairs;
        break;
      case "chest":
        this.image = game.assets.sprite.chest;
        this.timeline = null;
        this.opened = false;
        this.message = false;
        break;
    }
  };
  if(type) this.setType(type);

};
