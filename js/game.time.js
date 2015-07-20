game.time = {
  lastTick: Date.now(),
	tickDuration: 17,
	fpsUpdate: Date.now(), //This sets a time stamp every second to update the Game.fps
	get: function(currentTime, lastTime) {
		var fps = 1000 / (currentTime - lastTime);
		return fps.toFixed();
	},
	update: function() {
    var currentTime = Date.now();
		if(currentTime - this.fpsUpdate >= 1000) {
			game.render.fps = Math.floor(1000 / (currentTime - this.lastTick));
			this.fpsUpdate = currentTime;
		}
		this.tickDuration = currentTime - this.lastTick;
    if(this.tickDuration > 1000) this.tickDuration = 17;
		this.lastTick = currentTime;
	}
};
