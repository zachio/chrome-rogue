function Game() {
  //self supports the use of "this" inside methods.
  var self = this;

  //Exporting the canvas and default settings
  this.canvas = document.createElement("canvas");
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.canvas.style.backgroundColor = "black";
  this.canvas.style.cursor = "none";
  this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = false;

  //Arrays to store scripts and assets
  this.scripts = [];
  this.assets = {
    images: [],
    audio: []
  };

  //Game.load takes an array of assets such as scripts, images, and audio then loads them
  this.load = function(assets, callback) {
    var loadStart = Date.now();
    var loadCount = 0;
    if(assets.length) {
      for(var i = 0; i < assets.length; i++) {
        if(assets[i].search(".png") != -1) {
          var image = new Image();
          image.setAttribute("src", assets[i]);
          self.assets.images.push(image);
          image.onload = function() {
            loadCount++;
            if(loadCount === assets.length) finish();
          };
        } else if(assets[i].search(".mp3") != -1) {
          var audio = document.createElement("audio");
          audio.setAttribute("type","audio/mpeg");
  				audio.setAttribute("src", assets[i]);
          self.assets.audio.push(audio);
          loadCount++;
          if(loadCount === assets.length) finish();
        }
      }
    }
    var finish = function() {
      console.log("load time: ", Date.now() - loadStart, "ms");

      //Styling body element
      document.body.style.margin = 0;
      document.body.style.overflow = "hidden";

      document.body.appendChild(self.canvas);
      console.log(Map);
      window.onload = callback;
    };
  };

  //readjust the canvas size on resize of the window
  window.onresize = function() {
    self.canvas.width = window.innerWidth;
    self.canvas.height = window.innerHeight;
  };

  //Allows you to set the cursor type or turn it off
	this.cursor = function(bool, type) {
		if(bool) {
			document.body.style.cursor = type;
		} else {
			document.body.style.cursor = "none";
		}
	};

  // antialias allows you to toggle antialias of the canvas off and on
	this.antialias = function(bool) {
		return self.ctx.imageSmoothingEnabled = bool;
	};

  //FPS
  //Game.fps is the games fps value that updates every second
  this.fps = 0;
  var fps = {};
	fps.lastTime = 0;
	fps.timePerTick = 17;
	fps.lastUpdate = Date.now(); //This sets a time stamp every second to update the Game.fps
	fps.get = function(currentTime, lastTime) {
		var fps = 1000 / (currentTime - lastTime);
		return fps.toFixed();
	};
	fps.update = function() {
    var currentTime = Date.now();
		if(currentTime - fps.lastUpdate >= 1000) {
			self.fps = ~~(1000 / (currentTime - fps.lastTime));
			fps.lastUpdate = currentTime;
		}
		fps.timePerTick = currentTime - fps.lastTime;
		fps.lastTime = currentTime;
	};

  // speedPerSecond will calculate the distance to
	// travel in a tick to equal the speed in one second
	this.speedPerSecond = function(speed) {
		var delta = fps.timePerTick / 1000;
		return speed * delta;
	};

  //Message box
  this.messageBox = function(x, y, width, textArray) {
    var box = {
      x: x,
      y: y,
      width: width,
      height: textArray.length * 20 + 20,
    };
    self.ctx.fillStyle = "rgba(0,0,0,0.8)";
    self.ctx.fillRect(x, y, box.width, box.height);
    self.ctx.fillStyle = "white";
    for(var i = 0; i < textArray.length; i++) {
      self.ctx.fillText(textArray[i], x + 20, (y + 20 * i) + 20);
    }
  };

  //The main game loop
  var clearScreen = function(){
		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
	};
	this.loop = function (custom){
		requestAnimationFrame(function(){
			clearScreen();
			custom();
			fps.update();
			self.loop(custom);
		})
 	};
}
