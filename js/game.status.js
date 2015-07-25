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
          "Experience: " + game.player.exp,
          "Items:"
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
      for(var prop in game.item) {
        if(game.item[prop]) {
          text.content.push(prop + " " + game.item[prop]);
        }

      }
      game.render.ctx.font = "20px Arial";
      game.render.ctx.fillStyle = text.color;
      text.display();

    game.render.ctx.restore();

    //Player Quick Stats
    this.quickStats();
  },
  opacity: 0,
  quickStats: function() {
    var ctx = game.render.ctx;
    var bar = {
      width: 100,
      height: 10,
      x: 60,
      y: 71
    };
    var lineHeight = 20;
    game.render.messageBox(20,20,200,["Chrome", "Level: " + game.player.level, "HP:", "S:"]);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "red";
    ctx.fillRect(bar.x, bar.y, bar.width * game.player.hp / game.player.hpMax, bar.height);
    ctx.strokeRect(bar.x, bar.y , bar.width, bar.height);
    ctx.fillStyle = "lime";
    ctx.fillRect(bar.x, bar.y + lineHeight, bar.width * game.skill.stamina.cooldown / game.skill.stamina.max, bar.height);
    ctx.strokeRect(bar.x, bar.y + lineHeight, bar.width, bar.height);
  }
};
