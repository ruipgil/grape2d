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
	this.text = "";
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
}
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
 * Gets text exact width.
 *
 * @return {!number} Text exact width.
 * @public
 */
Grape2D.Text.prototype.getWidth = function(){
	return this.width;
};
/**
 * Gets text approximate height, by multiplying the font height by 1.5
 *
 * @return {!number} Text approxima height.
 * @public
 */
Grape2D.Text.prototype.getHeight = function(){
	return this.height;
};
/**
 * Sets text. Computes the buffer. 
 *
 * @param {!number} text Text to set.
 * @public
 */
Grape2D.Text.prototype.setText = function(text){
	/*var lines = text.split("\n"),
		width = -Infinity,
		buffer = this.buffer.buffer;
	buffer.clear();
	for(var l=0, line, tw; line=lines[l++];){
		width = Grape2D.Max(buffer.measureText(line).width, width);
		buffer.fillText(line, 0, l*this.size*1.5);
	}
	this.height = lines.length*this.size*1.5;
	this.width = width;
	this.buffer.setWidth(this.width);
	this.buffer.setHeight(this.height);
	this.text = text;*/
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


Grape2D.Text.prototype.setColor = function(color){
	this.color.set(color);
	this.buffer.setColor(this.color);
};
Grape2D.Text.prototype.getColor = function(){
	return this.color;
};
Grape2D.Text.prototype.setSize = function(size){
	this.size = size;
	this.buffer.setFont(this.size+"px "+this.font);
};
Grape2D.Text.prototype.getSize = function(){
	return this.size;
};
Grape2D.Text.prototype.setFont = function(font){
	this.font = font;
	this.buffer.setFont(this.size+"px "+this.font);
};
Grape2D.Text.prototype.getFont = function(){
	return this.font;
};


/**
 * @override
 */
Grape2D.Text.prototype.render = function(renderer){
	renderer.renderText(this);
};