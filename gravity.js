var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#000000";

var body = new Body(4, 100, 200, .2, .3);
console.log(body.mass);

var bodies = [];
var k = 10;
var step = 10;

window.onload = function(){

	bodies = [
		new Body(0, 350, 250, 0, 0),
		new Body(0, 150, 300, 0, 0),

		new Body(0, 450, 300, 0, 0),
		new Body(100, 450, 450, 0, 0),
	]
//	bodies[0].velocityX = Math.sqrt(k*100/150);
	console.log(bodies[0].velocityX);
	setInterval(drawBodies, 10);
}

function drawBodies(){
	ctx.clearRect(0, 0, c.width, c.height);
	computePosition();
	for(var i = 0; i < bodies.length; i++){
		ctx.beginPath();
		ctx.arc(bodies[i].x,bodies[i].y,10,0,2*Math.PI);
		ctx.fill();
	}
}



function computePosition(){
	for(var  i = 0; i < bodies.length; i++){
		var accX = 0, accY = 0;
		for(var j = 0; j < bodies.length; j++){
			if(i != j){
				var deltaX = bodies[j].x - bodies[i].x;
				var deltaY = bodies[j].y - bodies[i].y;
				var d = deltaX*deltaX + deltaY*deltaY;
				var acc = k*bodies[j].mass/d;
				var accOrientation = -Math.PI/2+Math.atan2(deltaY, deltaX);
				accX += acc*Math.cos(accOrientation);
				accY += acc*Math.sin(accOrientation);
			}

			bodies[i].x += step*bodies[i].velocityX + .5*accX*step*step;
			bodies[i].y += step*bodies[i].velocityY + .5*accY*step*step; 
		 
		}
	}
}




function Body(mass, x, y, velocityX, velocityY){
	this.mass = mass;
	this.x = x;
	this.y = y;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
}

