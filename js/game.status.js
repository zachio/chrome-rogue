game.status = {
  isOn: false,
  render: function() {
    var fadeSpeed = game.movement.speedPerSecond(4);
    if(this.isOn) {
      this.opacity += (this.opacity <= 0.9) ? fadeSpeed : 0;
    }
    else {
        this.opacity -= (this.opacity <= 0) ? 0 : fadeSpeed;
        if(this.opacity < 0) this.opacity = 0;
    }
    game.render.ctx.save();
    game.render.ctx.globalAlpha = this.opacity;
    var
      boxPadding = 100,
      box = {
        x: boxPadding,
        y: boxPadding,
        width: window.innerWidth - boxPadding * 2,
        height: window.innerHeight - boxPadding * 2,
        color: "rgba(0,0,0,"+this.opacity+")",
        innerPadding: 30
      }


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
        color: "rgba(255,255,255,"+this.opacity+")",
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
      game.render.ctx.fillStyle = text.color;
      text.display();

    game.render.ctx.restore();
  },
  opacity: 0
};
