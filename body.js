function Body(mass, x, y, velocityX, velocityY, color, size){
	this.mass = mass;
	this.x = x;
	this.y = y;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.positionsX = [];
	this.positionsY = [];
	this.accelerationX = 0;	
	this.accelerationY = 0;
	this.color = color;
	this.size = size;
}

Body.prototype.addPosition = function(){
	this.positionsX.push(this.x);
	this.positionsY.push(this.y);
	var length = this.positionsX.length;
	if(length > trailLength){
		for(var i = 0; i < length - trailLength; i++){
			this.positionsX.shift();
			this.positionsY.shift();
		}
	}

};

Body.prototype.update = function(step){
	this.velocityX += step * this.accelerationX;
	this.velocityY += step * this.accelerationY;

	this.x += this.velocityX * step;
	this.y += this.velocityY * step;
}


Body.prototype.resetAcceleration = function(){
	this.accelerationY = 0;
	this.accelerationX = 0;
}

Body.prototype.setPositions = function(positionsX, positionsY){
	this.positionsX = positionsX;
	this.positionsY = positionsY;
}

Body.prototype.setMass = function(mass){
	this.mass = mass;
}

Body.prototype.distanceToBody = function(body){
	return Math.sqrt((this.x - body.x) * (this.x - body.x) + (this.y - body.y) * (this.y - body.y));
} 

Body.prototype.distanceTo = function(posX, posY){
	return Math.sqrt((this.x - posX) * (this.x - posX) + (this.y - posY) * (this.y - posY));
}