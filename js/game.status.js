game.status = {
  isOn: false,
  padding: 100,
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

      //Render first Column
      var text = {
        y: boxPadding + box.innerPadding + 110 * game.render.scale,
        lineHeight: 30,
        color: "rgba(255,255,255,"+this.opacity+")",
        content: [
          "Name: Chrome",
          "Level: " + game.level,
          "Experience: " + game.player.exp,
          "Stamina: " + game.skill.stamina.level
        ],
        display: function(content, x) {
          var y = boxPadding + box.innerPadding + 110 * game.render.scale;
          for(var i = 0; i < content.length; i++) {
            game.render.ctx.fillText(
              content[i],
              x, y
            );
            y += this.lineHeight;
          }
        }
      };


      game.render.ctx.font = "20px Arial";
      game.render.ctx.fillStyle = text.color;
      //Display Stats
      text.display(text.content, boxPadding + box.innerPadding);

      //Display Items
      var items = ["Items"];
      for(var prop in game.item) {
        if(game.item[prop]) {
          items.push(prop + " x " + game.item[prop]);
        }
      }
      text.display(
        items,
        boxPadding + box.innerPadding + 200 * game.render.scale);
      this.selector.render();


    game.render.ctx.restore();

    //Player Quick Stats
    this.quickStats();
  },
  selector: {
    playhead: Date.now(),
    x: 100 + 30 + 180 * game.render.scale,
    y: 100 + 30 + 110 * game.render.scale + 30,
    yTop: 100 + 30 + 110 * game.render.scale + 30,
    timeline: 500,
    currentItem: 0,
    render: function() {
      var
        isItems = false,
        items = ["Items"];
      for(var prop in game.item) {
        if(game.item[prop]) {
          items.push(prop + " x " + game.item[prop]);
          isItems = true;
        }
      }
      //Display item selector
      if(Date.now() - this.playhead <= this.timeline / 2 && isItems){
        game.render.ctx.fillText(">", this.x, this.y);
      }
      else if(Date.now() - this.playhead > this.timeline) {
        this.playhead = Date.now();
      }
    },
    move: function(dir) {
      var items = ["Items"];
      var hasItem = false;
      var typeCount = 0;
      for(var prop in game.item) {
        if(game.item[prop]) {
          items.push(prop + " x " + game.item[prop]);
          hasItem = true;
          typeCount++;
        }
      }
      if(hasItem) {
        game.sound.effects.beep.load();
        game.sound.effects.beep.play();
        switch(dir) {
          case "up":
            console.log("up");
            if(this.y > this.yTop) {
              this.y -= 30;
              --this.currentItem;
            }
            break;
          case "down":
            console.log("down");
            if(this.currentItem < typeCount - 1) {
              this.y += 30;
              ++this.currentItem;
            }
            break;
        }
      }
    },
    useItem: function() {
      var items = [];
      for(var prop in game.item) {
        if(game.item[prop]) {
          items.push(prop);
        }
      }
      switch(items[this.currentItem]) {
        case "potion":
          game.sound.effects.potion.load();
          game.sound.effects.potion.play();
          --game.item[items[this.currentItem]];
          if(game.player.hpMax - game.player.hp >= 5)
            game.player.hp += 5;
          else
            game.player.hp += game.player.hpMax - game.player.hp;
          //Update selector
          if(!game.item[items[this.currentItem]] && items.length > 1) {
            this.y -= 30;
            --this.currentItem;
          }
          break;
        default:
          break;
      }
    },
    update: function() {
      if(!game.item[items[this.currentItem]] && items.length > 1) {
        this.y -= 30;
        --this.currentItem;
      }
    };
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
