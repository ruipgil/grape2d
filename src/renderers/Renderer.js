/**
 * @author rui_web@hotmail.com (Rui Gil)
 */

/**
 * Renderers are used to render graphics to the screen.
 *
 * @param  {Object} options [description]
 * @constructor
 * @public
 *
 * @abstract
 */
Grape2D.Renderer = function (options) {
	/**
	 * The width of the renderer.
	 * This is a cached value.
	 * The width is supposed to be an int
	 *
	 * @type {number}
	 * @private
	 */
	this.width = 1;
	/**
	 * The half width of the renderer. This is a cached value. The
	 * half width is supposed to be an int
	 *
	 * @type {number}
	 * @private
	 */
	this.halfWidth = 1;
	/**
	 * The height of the renderer.
	 * This is a cached value.
	 * The height is supposed to be an int
	 *
	 * @type {number}
	 * @private
	 */
	this.height = 1;
	/**
	 * The half height of the renderer.
	 * This is a cached value.
	 * The half width is supposed to be an int
	 *
	 * @type {number}
	 * @private
	 */
	this.halfHeight = 1;

	/**
	 * The color to use, when clearing the canvas.
	 *
	 * @type {number}
	 * @private
	 */
	this.clearColor = 0x000000;

	/**
	 * Sets the opacity of the objects to render.
	 * Values are between 0 and 255. Being 0 totally opaque (concrete
	 * renderer may choose not to render the object), 
	 *
	 * @type {number}
	 * @private
	 */
	this.opacity = 0xff;

	//sets the properties according to the constrains
	this.setWidth(options.width || 1);
	this.setHeight(options.height || 1);
};

Grape2D.Renderer.prototype = {
	constructor: Grape2D.Renderer,
	/**
	 * Gets the renderer width.
	 *
	 * @return {number} the width
	 */
	getWidth: function () {
		return this.width;
	},
	/**
	 * Gets the half width of the renderer.
	 *
	 * @return {number} the half width
	 */
	getHalfWidth: function () {
		return this.halfWidth;
	},
	/**
	 * Sets the width of the renderer and computes the half width.
	 *
	 * @param  {number} width the width
	 */
	setWidth: function (width) {
		this.width = Grape2D.Math.floor(width);
		this.halfWidth = this.width >> 1;
		return;
	},
	/**
	 * Gets the renderer height
	 *
	 * @return {number} the height
	 */
	getHeight: function () {
		return this.height;
	},
	/**
	 * Gets the half height of the renderer
	 *
	 * @return {number} the half width
	 */
	getHalfHeight: function () {
		return this.halfHeight;
	},
	/**
	 * Sets the height of the renderer and computes the half height.
	 *
	 * @param  {number} height the new height
	 */
	setHeight: function (height) {
		this.height = Grape2D.Math.floor(height);
		this.halfHeight = this.height >> 1;
		return;
	},
	/**
	 * Gets the clear color.
	 *
	 * @return {number} the clear color
	 */
	getClearColor: function(){
		return this.clearColor;
	},
	/**
	 * Sets the color to clear the scene.
	 *
	 * @param  {number} color The color.
	 */
	setClearColor: function(color){
		this.clearColor = color;
		return;
	},
	/**
	 * Gets the alpha component that is being added to the objects rendered.
	 *
	 * @return {number} A number between 0 and 255.
	 */
	getOpacity: function(){
		return this.opacity;
	},
	/**
	 * Sets the opacity (alpha component) of the object that are gonna be
	 * rendered.
	 *
	 * @param  {number} opacity A number between 0 (transparent) and 255 (opaque).
	 */
	setOpacity: function(opacity){
		this.opacity = opacity;
		return;
	},
	/**
	 * Renders a shape outline.
	 *
	 * @param  {Grape2D.Shape} shape The shape to render
	 * @param  {Grape2D.Vector} position The position to render
	 * @abstract
	 */
	renderShape: function (shape, position) {},
	/**
	 * Renders a shape with a fill color. Similar to {@link Grape2D.Renderer.renderShape}, but fills the shape and don't renders the outline.
	 *
	 * @param  {Grape2D.Shape} material The shape to render.
	 * @param  {number} position The color to fill the shape.
	 * @abstract
	 */
	renderColoredShape: function (shape, color, position) {},
	/**
	 * Renders a texture.
	 *
	 * @param  {Grape2D.Texture} texture the texture to render
	 * @param  {Grape2D.Vector} position the position to render
	 * @abstract
	 */
	renderTexture: function (texture, position) {},
	/**
	 * Prepares a render cycle.
	 * @abstract
	 */
	start: function(){},
	/**
	 * Commits everything to render.
	 * @abstract
	 */
	end: function(){}
};