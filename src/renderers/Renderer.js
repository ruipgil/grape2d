/**
 * Renderers are used to render graphics to the screen.
 *
 * @interface
 */
Grape2D.Renderer = function() {};

Grape2D.Renderer.prototype = {
	constructor: Grape2D.Renderer,
	/**
	 * Gets the renderer width.
	 *
	 * @return {number} the width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width of the renderer.
	 *
	 * @return {number} the half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width of the renderer and computes the half width.
	 *
	 * @param  {number} width the width
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets the renderer height
	 *
	 * @return {number} the height
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height of the renderer
	 *
	 * @return {number} the half width
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height of the renderer and computes the half height.
	 *
	 * @param  {number} height the new height
	 * @public
	 */
	setHeight: function(height) {},
	/**
	 * Renders a texture to a position on the renderer.
	 *
	 * @param  {Grape2D.ITexture} texture the texture to render
	 * @param  {Grape2D.Vector} position the position to render
	 * @public
	 */
	renderTexture: function(texture, position) {},
	/**
	 * Renders an object to the renderer.
	 *
	 * @param  {!Grape2D.Object2D} obj Object to render.
	 * @param  {!Grape2D.Camera} camera Camera to transform the coordinates.
	 * @public
	 */
	renderObject2D: function(obj, camera) {},
	/**
	 * Renders an image to the screen
	 *
	 * @param  {!Image} image DOM image.
	 * @param  {!number} sx Start x coordinate of the image to render.
	 * @param  {!number} sy Start y coordinate of the image to render.
	 * @param  {!number} sw Width of the image to render.
	 * @param  {!number} sh Height of the image to render.
	 * @param  {!number} dx Start x coordinate in the renderer, for the image.
	 * @param  {!number} dy Start y coordinate in the renderer, for the image.
	 * @param  {!number} dw Width of the image in the renderer.
	 * @param  {!number} dh Height of the image in the renderer.
	 * @public
	 */
	renderImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {},
	/**
	 * Renders the wireframe of an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb The AABB to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the coordinates.
	 * @public
	 */
	renderAABB: function(aabb, camera) {},
	/**
	 * Renders the wireframe of a circle.
	 *
	 * @param  {!Grape2D.Circle} circle Circle to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the coordinates.
	 * @public
	 */
	renderCircle: function(circle, camera) {},
	/**
	 * Renders the wireframe of a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the coordinates.
	 * @public
	 */
	renderPolygon: function(polygon, camera) {},
	/**
	 * Renders text to the renderer.
	 *
	 * @param  {!string} text Text to render.
	 * @param  {!Grape2D.Vector} position Top left corner of the text.
	 * @public
	 */
	renderText: function(text, position) {},
	/**
	 * Prepares a render cycle. This method should be called once, at
	 *   the begining of the rendering cycle.
	 * @public
	 */
	start: function() {},
	/**
	 * Commits everything to render. This method should be called once,
	 *   at the end of the rendering cycle.
	 * @public
	 */
	end: function() {},
	/**
	 * Appends the renderer to a DOM element.
	 *
	 * @param  {!Element} elm The element to append to.
	 * @public
	 */
	appendToDOMElement: function(elm) {},
	/**
	 * Gets the renderer DOM element.
	 *
	 * @return {!Element} Element
	 * @public
	 */
	getDOMElement: function() {},
	/**
	 * Sets a new stroke color.
	 *
	 * @param  {string} color New color to use when stroking.
	 * @public
	 */
	setStrokeColor: function(color) {},
	/**
	 * Sets a new fill color.
	 *
	 * @param  {string} color New color to use when filling.
	 * @public
	 */
	setFillColor: function(color) {}
};