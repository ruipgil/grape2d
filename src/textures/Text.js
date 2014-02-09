/**
 * Represents text to be rendered.
 * This is class stores the text, a style, and a
 *   {@see Grape2D.Texture} as it's buffer. Then at rendering time, 
 *   the heavy work is has been done. However performance issues 
 *   will be noted if at every frame the text is changed, because it
 *   will be needed to rebuild both the Canvas and the WebGL Buffer.
 *
 * @param {!Object} options Setup arguments.
 * @param {!string} options.text Initial text.
 * @param {!Grape2D.Vector=} options.position Texture position.
 * @param {!number} options.size Text size, in px.
 * @param {!string} options.font Text font.
 *
 * @implements {Grape2D.ITexture}
 * @constructor
 */
Grape2D.Text = function(options) {
	Grape2D.ITexture.call(this);
	/**
	 * Text string.
	 *
	 * @type {!string}
	 * @private
	 */
	this.text = options.text || "";
	/**
	 * Top left position of the text.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector();
	if(options.position){
		this.setPosition(options.position);
	}
	/**
	 * Text buffer.
	 *
	 * @type {!Grape2D.Texture}
	 * @private
	 */
	this.buffer = new Grape2D.Texture();
	/**
	 * Text size.
	 *
	 * @type {!number}
	 * @private
	 */
	this.size = options.size || 10;
	/**
	 * Text font.
	 *
	 * @type {!string}
	 * @private
	 */
	this.font = options.font || "sans-serif";
	/**
	 * Text color.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = options.color || new Grape2D.Color();
	this.refreshBuffer();
};
Grape2D.Text.prototype = Object.create(Grape2D.ITexture.prototype);
/**
 * Gets the text.
 *
 * @return {!string} Text string.
 * @public
 */
Grape2D.Text.prototype.getText = function(){
	return this.text;
};
/**
 * Gets text rendering position.
 *
 * @return {!Grape2D.Vector} Start rendering position.
 * @public
 */
Grape2D.Text.prototype.getPosition = function(){
	return this.position;
};
/**
 * Gets the text buffer.
 *
 * @return {!Grape2D.Texture} Text buffer.
 * @public
 */
Grape2D.Text.prototype.getBuffer = function(){
	return this.buffer;
};
/**
 * @override
 */
Grape2D.Text.prototype.getWidth = function(){
	return this.buffer.getWidth();
};
/**
 * @override
 */
Grape2D.Text.prototype.getHeight = function(){
	return this.buffer.getHeight();
};
/**
 * @override
 */
Grape2D.Text.prototype.getHalfWidth = function(){
	return this.buffer.getHalfWidth();
};
/**
 * @override
 */
Grape2D.Text.prototype.getHalfHeight = function(){
	return this.buffer.getHalfHeight();
};
/**
 * Sets text. Computes the buffer. 
 *
 * @param {!number} text Text to set.
 * @public
 */
Grape2D.Text.prototype.setText = function(text){
	this.text = text;
	this.refreshBuffer();
};
/**
 * Refresh text buffer.
 *
 * @private
 */
Grape2D.Text.prototype.refreshBuffer = function(){
	var lines = this.text.split("\n"),
		width = -Infinity,
		buffer = this.buffer.buffer;

	buffer.clear();
	buffer.setFont(this.size+"px "+this.font);
	for(var l=0, line; line=lines[l++];){
		width = Math.max(buffer.measureText(line).width, width);
	}
	width = Grape2D.Math.nextPowerOfTwo(width);
	var h = Grape2D.Math.nextPowerOfTwo(lines.length*this.size*1.2);
	buffer.setWidth(width);
	this.buffer.setWidth(width);
	buffer.setHeight(h);
	this.buffer.setHeight(h);

	buffer.setFont(this.size+"px "+this.font);
	buffer.setFillStyle(this.color);
	buffer.setStrokeStyle(this.color);

	for(l=0; line=lines[l++];){
		buffer.fillText(line, 0, l*this.size);
	}
};
/**
 * Sets text's position.
 *
 * @param {!Grape2D.Vector} position Text new position.
 * @public
 */
Grape2D.Text.prototype.setPosition = function(position){
	this.position.set(position);
};
/**
 * Sets text color.
 *
 * @param {!Grape2D.Color} color Color of the text.
 * @public
 */
Grape2D.Text.prototype.setColor = function(color){
	this.color.set(color);
	this.refreshBuffer();
};
/**
 * Gets text's color.
 *
 * @return {!Grape2D.Color} Text color.
 * @public
 */
Grape2D.Text.prototype.getColor = function(){
	return this.color;
};
/**
 * Sets text size.
 *
 * @param {!number} size Size of the text in pixels.
 * @public
 */
Grape2D.Text.prototype.setSize = function(size){
	this.size = size;
	this.refreshBuffer();
};
/**
 * Gets text's size.
 *
 * @return {!number} Text size.
 * @public
 */
Grape2D.Text.prototype.getSize = function(){
	return this.size;
};
/**
 * Sets text font.
 *
 * @param {!string} font Font of the text.
 * @public
 */
Grape2D.Text.prototype.setFont = function(font){
	this.font = font;
	this.refreshBuffer();
};
/**
 * Gets text's font.
 *
 * @return {!string} Text font.
 * @public
 */
Grape2D.Text.prototype.getFont = function(){
	return this.font;
};
/**
 * @override
 */
Grape2D.Text.prototype.render = function(renderer){
	renderer.renderText(this);
};
/**
 * Gets the text size. This is an experimental method.
 *
 * @param  {!string} text Text string.
 * @param  {!string} font Font of the text.
 * @return {!Object.<!string, !number>} Object with width and height properties, those of the text.
 * @public
 * @static
 */
Grape2D.Text.getTextSize = function(text, font){
	text = text.replace("\n", "<br>");
	var elm = document.createElement("span");
	elm.innerHTML = text;
	elm.style.font = font;
	elm.hidden = true;
	document.body.appendChild(elm);
	document.body.removeChild(elm);
	return {
		width: elm.offsetWidth,
		height: elm.offsetHeight
	};
};