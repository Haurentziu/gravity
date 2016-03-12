var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
c.addEventListener("mousedown", getClickPosition, false)
ctx.fillStyle = "#000000";


//Universe proprities
var k = 0.5; //Universal gravitational constant
var step = 10; //The step of the simulation

var trailLength = 1000;


var bodies = [
	new Body(100, 450, 450,  0, 0),
//	new Body(0, 450, 150, .3, 0),
//	new Body(0, 450, 200, .4, 0),
	new Body(0, 450, 300, .6, 0),
]
 

window.onload = function(){
	setInterval(drawBodies, 10);
}

function drawBodies(){
	ctx.clearRect(0, 0, c.width, c.height);
	computePosition();
	for(var i = 0; i < bodies.length; i++){
		ctx.beginPath();
		ctx.arc(bodies[i].x,bodies[i].y,10,0,2*Math.PI);
		ctx.fill();
		drawBodyTrail(i);
	}

}

function drawBodyTrail(bodyId){
	var length = bodies[bodyId].positionsX.length-1;
	ctx.beginPath();
	for(var i = 0; i < length; i++){
		ctx.moveTo(bodies[bodyId].positionsX[i],bodies[bodyId].positionsY[i]);
		ctx.lineTo(bodies[bodyId].positionsX[i + 1],bodies[bodyId].positionsY[i + 1]);
	}
	ctx.stroke();
}


function computePosition(){
	for(var  i = 0; i < bodies.length; i++){
		var accX = 0, accY = 0;
		for(var j = 0; j < bodies.length; j++){
			if(i != j){
				var deltaX = bodies[j].x - bodies[i].x;
				var deltaY = -bodies[i].y + bodies[j].y;
				var d = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
				var acc = k*bodies[j].mass/(d*d);
				accX += acc*deltaX/d;
				accY += acc*deltaY/d;
			}
			 
		}
		bodies[i].velocityX += accX*step;
		bodies[i].velocityY += accY*step;

		bodies[i].x += bodies[i].velocityX*step;
		bodies[i].y += bodies[i].velocityY*step;
		bodies[i].addPosition();
	}
}

function getClickPosition(e){
	var x = e.x;
	var y = e.y;

	x -= c.offsetLeft;
	y -= c.offsetTop;

	var deltaX = x - bodies[0].x;
	var deltaY = bodies[0].y - y;
	var d = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
	var vel = Math.sqrt(k * bodies[0].mass / d);
	var velX = vel * deltaY/d;
	var velY = vel * deltaX/d;
	var body = new Body(0, x, y , velX, velY);
	bodies.push(body);
}