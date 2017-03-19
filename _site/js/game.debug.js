var game = game || {};

game.debug = {
  render: function() {
    game.render.messageBox(window.innerWidth - 220,20, 200,
      ["game.fps: " + game.render.fps,
      "game.player.x: " + ~~game.player.x,
      "game.player.y: " + ~~game.player.y,
      "game.muted (press M): " + game.music.muted,
      "game.level: " + game.level,
      "player.stamina: " + game.skill.stamina.level
    ]);
  }
};
