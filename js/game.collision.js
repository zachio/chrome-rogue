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
    console.log("is chest?");
    switch(game.player.facing) {
      case "left":
        if(game.map.data[Math.floor(game.player.x - 0.1)][Math.floor(game.player.y)].entity === 5
        || game.map.data[Math.floor(game.player.x - 0.1)][Math.floor(game.player.y + 1)].entity === 5) return true;
        break;
      case "up":
        if(game.map.data[Math.floor(game.player.x)][Math.floor(game.player.y - 0.1)].entity === 5
        || game.map.data[Math.floor(game.player.x + 1)][Math.floor(game.player.y)].entity === 5) return true;
        break;
      case "right":
        if(game.map.data[Math.floor(game.player.x + 1.1)][Math.floor(game.player.y)].entity === 5
      || game.map.data[Math.floor(game.player.x + 1.1)][Math.floor(game.player.y + 1)].entity === 5) return true;
        break;
      case "down":
        if(game.map.data[Math.floor(game.player.x)][Math.floor(game.player.y + 1.1)].entity === 5
        || game.map.data[Math.floor(game.player.x + 1)][Math.floor(game.player.y + 1.1)].entity === 5) return true;
        break;
      default:
        console.log("false");
        return false;
    }

  }
};
