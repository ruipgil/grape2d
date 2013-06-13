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
	 * Renders a square
	 *
	 * @param  {Grape2D.Vector} topLeft the position of the top left corner
	 * @param  {Grape2D.Vector} topRight the position of the top right corner
	 * @param  {Grape2D.Vector} bottomRight the position of the bottom right corner
	 * @param  {Grape2D.Vector} bottomLeft the position of the bottom left corner
	 * @abstract
	 */
	renderRect: function (topLeft, topRight, bottomRight, bottomLeft) {},
	/**
	 * Renders a polygon.
	 * There are various geometric figures that can be represented by a polygon, such as rectangles and triangles. However if new instances needed be created to call this method then the usage of polygon is not recommended.
	 *
	 * @param  {Array.<Grape2D.Vector>} vertex an array with the vertex of a concave polygon
	 * @abstract
	 */
	renderPolygon: function (vertex) {},
	/**
	 * Renders a triangle.
	 *
	 * @param  {Grape2D.Vector} v1 the first vertex
	 * @param  {Grape2D.Vector} v2 the second vertex
	 * @param  {Grape2D.Vector} v3 the third vertex
	 * @abstract
	 */
	renderTriangle: function (v1, v2, v3) {},
	renderColoredMaterial: function (material, position) {},
	/**
	 * Renders a texture.
	 *
	 * @param  {Grape2D.Texture} texture the texture to render
	 * @param  {Grape2D.Vector} position the position to render
	 * @abstract
	 */
	renderTexture: function (texture, position) {}
};