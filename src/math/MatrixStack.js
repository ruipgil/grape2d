/**
 * Grape2D.MatrixStack class.
 *
 * @extends {Grape2D.IMatrix}
 * @constructor
 */
Grape2D.MatrixStack = function(){
	Grape2D.IMatrix.call(this);
	this.stack = [];
	this.identity = false;
	this.head = null;
};

Grape2D.MatrixStack.prototype = Object.create(Grape2D.IMatrix.prototype);
Grape2D.MatrixStack.prototype.push = function(matrix){
	if(this.identity){
		this.stack.push(new Grape2D.Matrix());
	}
	this.stack.push(matrix);
	this.head = matrix;
	return this;
};
Grape2D.MatrixStack.prototype.pushIdentity = function(){
	if(this.pushIdentity){
		var m = new Grape2D.Matrix();
		this.stack.push(m);
		this.head = m;
	}else{
		this.identity = true;
	}
	return this;
};
Grape2D.MatrixStack.prototype.pop = function(){
	if(this.identity){
		this.identity = false;
	}else{
		this.stack.pop();
		this.head = this.stack[this.stack.length-1];
	}
	return this;
};
Grape2D.MatrixStack.prototype.getHead = function(){
	if(this.identity){
		this.identity = false;
		this.push(new Grape2D.Matrix());
	}
	return this.head;
};
Grape2D.MatrixStack.prototype.translate = function(vector){
	if(this.identity){
		var m = Grape2D.Matrix.createFromTranslation(vector.getX(), vector.getY());
		this.identity = false;
		this.push(m);
	}else{
		this.head.translate(vector.getX(), vector.getY());
	}
	return this;
};
Grape2D.MatrixStack.prototype.scale = function(x, y){
	if(this.identity){
		this.identity = false;
		this.push(Grape2D.Matrix.createFromScale(x, y));
	}else{
		this.head.scale(x, y);
	}
	return this;
};
Grape2D.MatrixStack.prototype.rotate = function(angle){
	if(this.identity){
		this.identity = false;
		this.push(Grape2D.Matrix.createFromRotation(angle));
	}else{
		this.head.rotate(angle);
	}
	return this;
};
Grape2D.MatrixStack.prototype.reset = function(){
	this.stack = [];
	this.identity = false;
	this.head = null;
	return this;
};