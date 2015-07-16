//Key Listeners
window.onresize = function() {
  game.render.canvas.width = window.innerWidth;
  game.render.canvas.height = window.innerHeight;
  game.render.ctx.imageSmoothingEnabled = false;
};
window.onkeydown = function (event) {
  switch (event.keyCode) {
     //Left
    case 37:
    case 65: // a
      game.player.facing = "left";
      game.player.moving.left = true;
      break;
     //Up
    case 38:
    case 87: // w
      game.player.facing = "up";
       game.player.moving.up = true;
       break;
     //Right
    case 39:
    case 68: // d
      game.player.facing = "right";
      game.player.moving.right = true;
      break;
     //Down
    case 40:
    case 83: // s
      game.player.facing = "down";
      game.player.moving.down = true;
      break;
    //options
    case 49: // 1

      break;
    case 50: // 2

      break;
    case 187: // + increase scale
      game.render.scale++;
      break;
    case 189: // - decrease scale
      game.render.scale--;
      break;
    case 32: // Space Action
      game.player.action();
      break;
    case 77:
      if(game.music.muted) {
        game.assets.audio[game.music.songSelect].play(); game.music.muted = false;
      } else {
        game.assets.audio[game.music.songSelect].pause(); game.music.muted = true;
      }
      break;
    case 16: // Shift to Sprint
      game.player.speed = 8;
      break;
    }
};
window.onkeyup = function (event) {
  switch (event.keyCode) {
    //Left
    case 37:
    case 65: // a
      game.player.moving.left = false;
      break;
    //Up
    case 38:
    case 87: // w
      game.player.moving.up = false;
      break;
    //Right
    case 39:
    case 68: // s
      game.player.moving.right = false;
      break;
    //Down
    case 40:
    case 83: // s
      game.player.moving.down = false;
      break;
    case 16: //Shift stop sprinting
      game.player.speed = 4;
      break;
  }
  if(game.player.moving.left) game.player.facing = "left";
  else if(game.player.moving.up) game.player.facing = "up";
  else if(game.player.moving.right) game.player.facing = "right";
  else if(game.player.moving.down) game.player.facing = "down";
};
