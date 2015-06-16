function Game(canvasID) {
	//Take out body spacing and silly side bars
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	document.body.style.overflow = "hidden";
	document.body.style.cursor = "none";


	//Allows you to set the cursor type or turn it off
	this.cursor = function(bool, type) {
		if(bool) {
			document.body.style.cursor = type;
		} else {
			document.body.style.cursor = "none";
		}
	}

	// antialias allows you to toggle antialias of the canvas off and on
	this.antialias = function(bool) {
		return this.ctx.imageSmoothingEnabled = bool;
	}

	//Importing the Game object for function use
	var self = this;

	this.canvas = document.getElementById(canvasID);
	this.ctx = this.canvas.getContext("2d");


	this.screen = {};
	this.screen.adjust=function (){
		self.screen.width = window.innerWidth;
		self.screen.height = window.innerHeight;
		self.canvas.width = self.screen.width;
		self.canvas.height = self.screen.height;
		self.ctx.imageSmoothingEnabled = false;
	}

	this.canvas.style.backgroundColor = "black";

	//Canvas size updates when window size changes
	window.onresize = function(){self.screen.adjust()};
	this.screen.adjust();

	//Turning antialias off by default
	this.ctx.imageSmoothingEnabled = false;

	var clearScreen = function(){
		self.ctx.clearRect(0, 0, self.screen.width, self.screen.height);
	};

	//Export FPS
	this.fps = 0;

	//FPS Private stuff
	var fps = {};
	fps.currentTime = new Number();
	fps.lastTime = 0;
	fps.timePerTick = 17;
	fps.updateTime = Date.now(); //This sets a time stamp every second to update the Game.fps
	fps.get = function(currentTime, lastTime) {
		var fps = 1000 / (currentTime - lastTime);
		return fps.toFixed();
	};
	fps.update = function() {
		fps.currentTime = Date.now();
		if(fps.currentTime - fps.updateTime >= 1000) {
			self.fps = fps.get(fps.currentTime, fps.lastTime);
			fps.updateTime = fps.currentTime;
		}
		fps.timePerTick = fps.currentTime - fps.lastTime;
		fps.lastTime = fps.currentTime;
	};

	// speedPerSecond will calculate the distance to
	// travel in a tick to equal the speed in one second
	this.speedPerSecond = function(speed) {
		var delta = fps.timePerTick / 1000;
		return speed * delta;
	};

	this.random = function(min, max) {
		return ~~(Math.random() * (max - min)) + min;
	};

	this.textBox = function(x, y, width, textArray) {
		var box = {
			x: x,
			y: y,
			width: width,
			height: textArray.length * 20 + 20,
		};
		this.ctx.fillStyle = "rgba(0,0,0,0.8)";
		this.ctx.fillRect(x, y, box.width, box.height);
		this.ctx.fillStyle = "white";
		for(var i = 0; i < textArray.length; i++) {
			this.ctx.fillText(textArray[i], x + 20, (y + 20 * i) + 20);
		}
	};

	this.images = [];
	this.audio = [];

	this.load = function(assets, callback) {
		var loadCount = 0;
		for(var i = 0; i < assets.length; i++) {
			if(assets[i].search(".png") != -1) {
				var image = new Image();
				image.src = assets[i];
				this.images.push(image);
				image.onload = function() {
					loadCount++;
					if(loadCount == assets.length) callback();
				};
			} else if(assets[i].search(".mp3") != -1) {
				var audio = document.createElement("audio");
				audio.setAttribute("type","audio/mpeg");
				audio.setAttribute("src", assets[i]);
				this.audio.push(audio);
				loadCount++;
				if(loadCount == assets.length) callback();
				}
			}
	};



	//This starts the main game loop
	this.loop = function (custom){
		requestAnimationFrame(function(){
			clearScreen();
			custom();
			fps.update();
			self.loop(custom);
		})
 	};

}
