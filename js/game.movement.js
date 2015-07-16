game.movement = {
  // speedPerSecond will calculate the distance to
	// travel in a tick to equal the speed in one second
	speedPerSecond: function(speed, timePerTick) {
		var delta = timePerTick / 1000;
		return speed * delta;
	}
};
