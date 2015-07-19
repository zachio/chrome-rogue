game.collision = {
  detect: function(entity, x, y) {
    var entityX = Math.floor(entity.x + x);
    var entityY = Math.floor(entity.y + y);
    if(game.map.data[entityX][entityY].type === 1 && game.map.data[entityX][entityY].entity != 5) {
      return false;
    }
    return true;
  },
  isChest: function() {
    if(game.map.data[~~(game.player.x - 0.1)][~~game.player.y].entity === 5 || game.map.data[~~(game.player.x - 0.1)][~~game.player.y + 1].entity === 5
      || game.map.data[~~game.player.x][~~(game.player.y - 0.1)].entity === 5 || game.map.data[~~game.player.x + 1][~~(game.player.y - 0.1)].entity === 5
      || game.map.data[~~(game.player.x + 1.1)][~~game.player.y].entity === 5 || game.map.data[~~(game.player.x + 1.1)][~~game.player.y + 1].entity === 5
      || game.map.data[~~game.player.x][~~(game.player.y + 1.1)].entity === 5 || game.map.data[~~game.player.x + 1][~~(game.player.y + 1.1)].entity === 5) {
      return true;
    } else {
      return false;
    }
  }
};
