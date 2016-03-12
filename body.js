function Body(mass, x, y, velocityX, velocityY, color, size){
	this.mass = mass;
	this.x = x;
	this.y = y;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.positionsX = [];
	this.positionsY = [];
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