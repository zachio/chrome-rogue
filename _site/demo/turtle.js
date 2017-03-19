module.exports = function(x,y) { 
	this.x = x
	this.y = y
	this.degrees = 0
	this.pd = true
	this.turn = function (deg) {
		this.degrees += deg
	}
	this.mv = function (d, ctx, canvas) {
		var radians = this.degrees * Math.PI / 180
		var x = d*Math.cos(radians)
		var y = d*Math.sin(radians)

		if (this.pd){
			ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
			ctx.beginPath()
			ctx.moveTo(this.x, this.y)
			ctx.lineTo(this.x + x, this.y + y)
			ctx.stroke()			
		}

		this.x += x
		this.y += y
		this.toroid(canvas)
	}
	this.toroid = function(canvas) {
		if (this.x < 0) {
			this.x = canvas.width
		}
		if (this.y < 0) {
			this.y = canvas.height
		}
		if (this.x > canvas.width) {
			this.x = 0
		}
		if (this.y > canvas.height) {
			this.y = 0
		}
	}
}