game.collision = {
  detect: function(entity, x, y) {
    var entityX = Math.floor(entity.x + x);
    var entityY = Math.floor(entity.y + y);
    if(game.map.data[entityX][entityY].type === 1 && game.map.data[entityX][entityY].entity != 5) {
      return false;
    }
    return true;
  }
};
