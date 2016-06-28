var c = document.getElementById("gravityCanvas");
var ctx = c.getContext("2d");

resizeCanvas();

c.addEventListener("mousedown", getDownPosition, false);
c.addEventListener("mouseup", getUpPosition, false);
c.addEventListener("mousemove", getMovePosition, false);

ctx.fillStyle = "#000000";

var FPS_MEAN_FRAMES = 20;

//Universe proprities
var k = 0.7; //Universal gravitational constant
var fps = 40; //fps

var timePerStep = 0.5; //biger -> less accurate
var stepsPerFrame = 15; //biger -> faster
var smoothingFactor = .1;

var lastUnix;
var cycles = 0;

var zoom = 1;

var trailLength = 2000;
var bodyMass = 100;
var bodyDensity = 0.01;

var beginX, beginY, endX = 0, endY = 0;
var isPressed = false;

var selectedBody = 0;
var isSelected = false;


var offsetX = 0;
var offsetY = 0;

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

var bodies = [];

window.onload = function(){
	reset();
	drawBodies();


    var gui = new dat.GUI();
    var objectFolder = gui.addFolder("Object Settings");
    var worldFolder = gui.addFolder("World Settings");

    objectFolder.open();
    worldFolder.open();

    objectFolder.add(this, "bodyMass").min(0).max(150).step(0.1);
    objectFolder.add(this, "bodyDensity").min(0).max(1).step(0.001);

	worldFolder.add(this, 'timePerStep').min(0).max(5).step(0.1);
	worldFolder.add(this, 'stepsPerFrame').min(0).max(30).step(0.1);
	worldFolder.add(this, 'k').min(0).max(2).step(0.01);
	worldFolder.add(this, 'smoothingFactor').min(0).max(1).step(0.001);
	worldFolder.add(this, 'trailLength').min(0).max(3000).step(1);
	worldFolder.add(this, 'reset');

}

function pickColor(){
	return Math.floor(Math.random() * colors.length);
}

function drawBodies(){
	if(isSelected){
		offsetX = c.width/2 - bodies[selectedBody].x;
		offsetY = c.height/2 - bodies[selectedBody].y;
	}


	if(cycles == FPS_MEAN_FRAMES){
		var fps = Math.floor(FPS_MEAN_FRAMES * 1000 / (Date.now() - lastUnix));
		lastUnix = Date.now();
		writeFPS(fps);
		cycles = 0;
	}
	else{
		cycles++
	}

	for(var i = 0; i < stepsPerFrame; i++){
		checkColisions();
		computePosition();
	}


	ctx.fillStyle = "#111111";
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
		ctx.arc(offsetX + bodies[i].x, offsetY + bodies[i].y, bodies[i].size, 0, 2*Math.PI);
		ctx.fill();
		drawBodyTrail(i);
	}

	requestAnimationFrame(drawBodies);

}


function writeFPS(fps){
	document.getElementById("fps").innerHTML = "FPS: " + fps;
	document.getElementById("number").innerHTML = "Number of Bodies: " + bodies.length;
	
}

function drawBodyTrail(bodyId){
	ctx.lineWidth = 2;
	var length = bodies[bodyId].positionsX.length-1;
	ctx.beginPath();
	for(var i = 0; i < length; i++){
		ctx.moveTo(offsetX + bodies[bodyId].positionsX[i], offsetY  + bodies[bodyId].positionsY[i]);
		ctx.lineTo(offsetX + bodies[bodyId].positionsX[i + 1], offsetY + bodies[bodyId].positionsY[i + 1]);
	}
	ctx.stroke();
}

function cloneBodies(array){
	var returnedArray = [];
	for(var  i = 0; i < array.length; i++){
		body = new Body(array[i].mass, array[i].x, array[i].y, array[i].velocityX, array[i].velocityY, array[i].color, array[i].size);
		body.setPositions(array[i].positionsX, array[i].positionsY);
		returnedArray.push(body);
	}
	return returnedArray;
}

function computePosition(){
	for(var  i = 0; i < bodies.length; i++){
		bodies[i].resetAcceleration();
		for(var j = 0; j < bodies.length; j++){
			if(i != j){
				var deltaX = bodies[j].x - bodies[i].x;
				var deltaY = -bodies[i].y + bodies[j].y;
				var d = Math.sqrt(deltaX*deltaX + deltaY*deltaY) + smoothingFactor;
				var acc = k*bodies[j].mass/(d*d);
				bodies[i].accelerationX += acc*deltaX/d;
				bodies[i].accelerationY += acc*deltaY/d;
			}
		}
	
	}

	for(var i = 0; i < bodies.length; i++){
		bodies[i].update(timePerStep);
		bodies[i].addPosition();
	}

}

function checkColisions(){
	for(var i = 0; i < bodies.length; i++){
		for(var j = 0; j < bodies.length; j++){
			if(i!=j && bodies[i].distanceToBody(bodies[j]) < bodies[i].size + bodies[j].size){
				console.log("Colision!")
				var isSelectedBody = (selectedBody == i || selectedBody == j);
				if(bodies[i].mass > bodies[j].mass){
					bodies[i].mass += bodies[j].mass;
					if(isSelectedBody) selectedBody = i;
				//	bodies[i].size += bodies[j].size;
					bodies.splice(j, 1);
				}
				else{
					bodies[j].mass += bodies[i].mass;
					if(isSelectedBody) selectedBody = j;
				//	bodies[j].size += bodies[i].size;
					bodies.splice(i, 1);
				}
			}

		}
	}
}



function createProtoDisk(){
	for(var  i = 0; i < 10; i++){
		var x = Math.random() * c.width;
		var y = Math.random() * c.height;

		var d = Math.sqrt((c.width / 2 - x) * (c.width / 2 - x) + (c.height / 2 - y) * (c.height / 2 - y));
		var alpha = Math.atan2(c.height/2 - y, c.width / 2 - x);
		var vel = Math.sqrt(k * (bodies[0].mass) / d);

		var velX = vel * Math.sin(alpha);
		var velY = -vel * Math.cos(alpha);

	//	var velX = Math.random() / 50 - 1 / 100;
	//	var velY = Math.random() / 50 - 1 / 100;

		var mass = Math.random() * 5;

		body = new Body(2, x, y, velX, velY, colors[pickColor()], 10);
		bodies.push(body);
	}
}

function getDownPosition(e){
	var x = e.clientX - c.offsetLeft;
	var y = e.clientY - c.offsetTop;
	if(e.which == 1){
		isPressed = true;
		beginX = endX = x;
		beginY = endY = y;
	}

	if(e.which == 3){
		for(var i = 0; i < bodies.length; i++){
			if(bodies[i].distanceTo(x - offsetX, y - offsetY) < bodies[i].size){
				console.log(i);
				selectedBody = i;
				isSelected = true;
				break;
			}
		}
	}
}

function getMovePosition(e){
	if(isPressed){
		endX = e.clientX - c.offsetLeft;
		endY = e.clientY - c.offsetTop;
	}
}

function getUpPosition(e){
	endX = e.clientX - c.offsetLeft;
	endY = e.clientY - c.offsetTop;
	if(e.which == 1){
		isPressed = false;
		var velX = (endX - beginX)/500;
		var velY = (endY - beginY)/500;
		var size = Math.pow(bodyMass / bodyDensity, 1/3)
		body = new Body(bodyMass, beginX - offsetX, beginY - offsetY, velX, velY, colors[pickColor()], size);
		bodies.push(body);
	}
}


function resizeCanvas(){
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
}


function rad2deg(angle){
	return angle * 180 / Math.PI;
}

function reset(){
	bodies = [
	//	new Body(100, window.innerWidth/2, window.innerHeight/2,  0, 0, colors[0], 20),
	//	new Body(0, window.innerWidth/2, window.innerHeight/2 - 150, .6, 0, colors[4], 10),
	];
//	createProtoDisk();
}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 32) { 
        isSelected = false;
    } 
};