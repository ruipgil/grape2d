/**
 * Text, where it's position relative to the renderer.
 *
 * @param {!Object} options Setup options.
 * @implements {Grape2D.IText}
 * @constructor
 */
Grape2D.AbsoluteText = function(options){
	Grape2D.IText.call(this);
	this.text = new Grape2D.Text(options);
};
Grape2D.AbsoluteText.prototype = Object.create(Grape2D.IText.prototype);
Grape2D.AbsoluteText.prototype.getText = function(){
	return this.text.getText();
};
Grape2D.AbsoluteText.prototype.setText = function(text){
	this.text.setText(text);
};

Grape2D.AbsoluteText.prototype.getColor = function(){
	return this.text.getColor();
};
Grape2D.AbsoluteText.prototype.setColor = function(color){
	this.text.setColor(color);
};

Grape2D.AbsoluteText.prototype.getSize = function(){
	return this.text.getSize();
};
Grape2D.AbsoluteText.prototype.setSize = function(size){
	this.text.getSize(size);
};

Grape2D.AbsoluteText.prototype.getFont = function(){
	return this.text.getFont();
};
Grape2D.AbsoluteText.prototype.setFont = function(font){
	this.text.setFont(font);
};

Grape2D.AbsoluteText.prototype.getWidth = function(){
	return this.text.getWidth();
};
Grape2D.AbsoluteText.prototype.setWidth = function(width){
	this.text.setWidth(width);
};
Grape2D.AbsoluteText.prototype.getHeight = function(){
	return this.text.getHeight();
};
Grape2D.AbsoluteText.prototype.setHeight = function(height){
	this.text.setHeight(height);
};

Grape2D.AbsoluteText.prototype.getHalfWidth = function(){
	return this.text.getHalfWidth();
};
Grape2D.AbsoluteText.prototype.getHalfHeight = function(){
	return this.text.getHalfHeight();
};

Grape2D.AbsoluteText.prototype.getPosition = function(){
	return this.text.getPosition();
};
Grape2D.AbsoluteText.prototype.setPosition = function(vector){
	this.text.setPosition(vector);
};
Grape2D.AbsoluteText.prototype.getBuffer = function(){
	return this.text.getBuffer();
};
Grape2D.AbsoluteText.prototype.render = function(renderer){
	renderer.renderAbsoluteText(this);
};