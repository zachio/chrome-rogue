//make canvas global to pollute that namespace!
canvas = document.body.appendChild(document.createElement('canvas'))
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20

turtles = []

ctx = canvas.getContext('2d')

var startTime = Date.now()

var Turtle = require("./turtle.js")

addTurtle = function(x,y){
	turtles.push(new Turtle(x,y))
}

var render = function() {
    requestAnimationFrame(render)
    turtles.forEach(function (t) {
    	t.update()
    })
}

render();

addTurtle(20,20);
Turtle.prototype.update = function(){
	var angle = (Date.now()-startTime)/200
	if (angle > 40) startTime = Date.now()
	this.mv(10, ctx, canvas)
	this.turn(angle)
}

//try altering prototpye from console
//ex: http://imgur.com/9O9NklU
