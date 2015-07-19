game.player.status = {
  isOn: false,
  render: function() {
    var
      boxPadding = 100,
      box = {
        x: boxPadding,
        y: boxPadding,
        width: window.innerWidth - boxPadding * 2,
        height: window.innerHeight - boxPadding * 2,
        color: "rgba(0,0,0,0.9)",
        innerPadding: 30
      }

    if(this.isOn){
      game.render.ctx.fillStyle = box.color;
      game.render.ctx.fillRect(box.x, box.y, box.width, box.height);
      //Render profile pic
      game.render.ctx.drawImage(
        game.assets.images[3],
        0, 0,
        95, 95,
        boxPadding + box.innerPadding,
        boxPadding + box.innerPadding,
        95 * game.render.scale,
        95 * game.render.scale
      );

      //Render text
      var text = {
        y: boxPadding + box.innerPadding + 110 * game.render.scale,
        lineHeight: 30,
        content: [
          "Name: Chrome",
          "Level: " + game.level,
          "Experience: " + game.player.exp
        ],
        display: function() {
          for(var i = 0; i < this.content.length; i++) {
            game.render.ctx.fillText(
              this.content[i],
              boxPadding + box.innerPadding,
              this.y
            );
            this.y += this.lineHeight;
          }
        }
      };
      game.render.ctx.font = "20px Arial";
      game.render.ctx.fillStyle = "white";
      text.display();

    }
  }
};
