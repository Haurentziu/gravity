var c = document.getElementById("gravityCanvas");
var ctx = c.getContext("2d");

resizeCanvas();

c.addEventListener("mousedown", getDownPosition, false);
c.addEventListener("mouseup", getUpPosition, false);
c.addEventListener("mousemove", getMovePosition, false);

ctx.fillStyle = "#000000";


//Universe proprities
var k = 0.7; //Universal gravitational constant
var fps = 40; //fps
var step = 2; //the step of the simulation
var smoothingFactor = .01;

var trailLength = 500;

var beginX, beginY, endX = 0, endY = 0;
var isPressed = false;

var colors = [
	"#e57373",
	"#F48FB1",
	"#BA68C8",
	"#9575CD",
	"#7986CB",
	"#64B5F6",
	"#4FC3F7",
	"#4DD0E1",
	"#4DB6AC",
	"#81C784",
	"#AED581",
	"#DCE775",
	"#FFF176",
	"#FFD54F",
	"#FFB74D",
	"#FF8A65",
	"#A1887F",
	"#90A4AE",
];

var bodies = [
	new Body(100, window.innerWidth/2, window.innerHeight/2,  0, 0, colors[0], 20),
	new Body(0, window.innerWidth/2, window.innerHeight/2 - 150, .6, 0, colors[4], 10),
];
 

window.onload = function(){
	tooglePanel();
	setInterval(drawBodies, 1000/fps);
	setInterval(computePosition, step);

}

function pickColor(){
	return Math.floor(Math.random() * colors.length);
}

function drawBodies(){
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, c.width, c.height);

	if(isPressed){
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FFFFFF";
		var alpha = Math.atan2(beginY - endY, beginX - endX);
		ctx.moveTo(beginX, beginY);
		ctx.lineTo(endX, endY);
		ctx.lineTo(endX - 30*Math.sin(-alpha - Math.PI/3), endY - 30*Math.cos(-alpha - Math.PI/3));
		ctx.moveTo(endX, endY);
		ctx.lineTo(endX - 30*Math.sin(Math.PI - alpha + Math.PI/3), endY - 30*Math.cos(Math.PI - alpha + Math.PI/3));
		ctx.stroke();
	}

	for(var i = 0; i < bodies.length; i++){

		ctx.fillStyle = bodies[i].color;
		ctx.strokeStyle = bodies[i].color;
		ctx.beginPath();
		ctx.arc(bodies[i].x,bodies[i].y,bodies[i].size,0,2*Math.PI);
		ctx.fill();
		drawBodyTrail(i);
	}

}

function drawBodyTrail(bodyId){
	ctx.lineWidth = 2;
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
				var d = Math.sqrt(deltaX*deltaX + deltaY*deltaY) + smoothingFactor;
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

function getDownPosition(e){
	var x = e.clientX - c.offsetLeft;
	var y = e.clientY - c.offsetTop;

	isPressed = true;
	beginX = endX = x;
	beginY = endY = y;
}

function getMovePosition(e){
	if(isPressed){
		endX = e.clientX - c.offsetLeft;
		endY = e.clientY - c.offsetTop;
	}
}

function getUpPosition(e){
	isPressed = false;
	endX = e.clientX - c.offsetLeft;
	endY = e.clientY - c.offsetTop;
	var velX = (endX - beginX)/500;
	var velY = (endY - beginY)/500;
	body = new Body(0, beginX, beginY, velX, velY, colors[pickColor()], 10);
	bodies.push(body);
	console.log("Created body");
	console.log(bodies[0]);
}


function resizeCanvas(){
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
}