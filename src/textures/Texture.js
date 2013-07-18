/**
 * Texture represents an "image", ready to be rendered to
 *   a renderer, with high efficiency. The efficiency comes
 *   from the fact that a cached image can be renderer faster.
 *
 * @param {Object=} options Object with the options to instantiate a texture.
 * @param {Image=} options.image Loads a DOM image object to the buffer.
 *		This is the first choice, when providing other options.
 * @param {Grape2D.Texture=} options.useTexture With this method the
 *		same buffer is shared by the texture provided.
 *
 * @implements {Grape2D.ITexture}
 * @constructor
 */
Grape2D.Texture = function(options) {
	options = options || {};
	/**
	 * The width of the texture.
	 *
	 * @type {number}
	 * @private
	 */
	this.width = 2;
	/**
	 * The half width.
	 *
	 * @type {number}
	 * @private
	 */
	this.hwidth = 1;
	/**
	 * The height.
	 *
	 * @type {number}
	 * @private
	 */
	this.height = 2;
	/**
	 * The half width.
	 *
	 * @type {number}
	 * @private
	 */
	this.hheight = 1;

	/**
	 * The canvas buffer. It is always a 2D renderer.
	 *
	 * @type {Grape2D.CanvasRenderer}
	 * @private
	 */
	this.buffer = new Grape2D.CanvasRenderer();
	if (options.image) {
		this.bufferImage(options.image);
	} else if (options.useTexure) {
		this.buffer = options.useTexure;
	}

};

Grape2D.Texture.prototype = Object.create(Grape2D.ITexture);
/**
 * @override
 */
Grape2D.Texture.prototype.getWidth = function() {
	return this.width;
};
/**
 * @override
 */
Grape2D.Texture.prototype.getHeight = function() {
	return this.height;
};
/**
 * @override
 */
Grape2D.Texture.prototype.setWidth = function(width) {
	this.width = width;
	this.hwidth = this.width / 2;
};
/**
 * @override
 */
Grape2D.Texture.prototype.setHeight = function(height) {
	this.height = height;
	this.hheight = this.height / 2;
};
/**
 * @override
 */
Grape2D.Texture.prototype.getHalfWidth = function() {
	return this.hwidth;
};
/**
 * @override
 */
Grape2D.Texture.prototype.getHalfHeight = function() {
	return this.hheight;
};
/**
 * Gets the buffer of the texture.
 *
 * @return {?} The buffer.
 * @public
 */
Grape2D.Texture.prototype.getBuffer = function() {
	return this.buffer.canvas.canvas;
};
/**
 * Changes the internal buffer and load an image, with it's
 *   current dimensions. The dimensions.
 *
 * @param  {Image} image - The DOM image object with the image.
 *		The image must be loaded. Unexpected results if not.
 * @protected
 */
Grape2D.Texture.prototype.bufferImage = function(image) {
	this.setWidth(image.width);
	this.setHeight(image.height);

	this.buffer = new Grape2D.CanvasRenderer();
	this.buffer.renderImage(image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
};
/**
 * @override
 */
Grape2D.Texture.prototype.render = function(renderer, position){
	renderer.renderTexture(this, position);
};

/**
 * Creates a Texture and loads an image asynchronously.
 *
 * @param  {string} src - The complete path to the image.
 * @param  {Function} callback - A function to be called after the
 *		onload event of the image.
 *
 * @return {Grape2D.Texture} The texture object, initialy it has
 *		an empty buffer, the buffer will have the image only after
 *		the image has done loaded
 *
 * @static
 */
Grape2D.Texture.createFromImage = function(src, callback) {
	var image = new Image(),
		that = new Grape2D.Texture();

	image.onload = function(evt) {
		that.bufferImage(this);
		if (callback) {
			callback(that, this, evt);
		}
	};
	image.src = src;

	return that;
};