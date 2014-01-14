/**
 * Renderers are used to render graphics to the screen.
 *
 * @class
 * @interface
 */
Grape2D.Renderer = function() {};

Grape2D.Renderer.prototype = {
	constructor: Grape2D.Renderer,
	/**
	 * Gets the renderer width.
	 *
	 * @return {!number} the width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width of the renderer.
	 *
	 * @return {!number} the half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width of the renderer and computes the half width.
	 *
	 * @param  {!number} width the width
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets the renderer height
	 *
	 * @return {!number} the height
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height of the renderer
	 *
	 * @return {!number} the half width
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height of the renderer and computes the half height.
	 *
	 * @param  {!number} height the new height
	 * @public
	 */
	setHeight: function(height) {},
	/**
	 * Renders a colored shape.
	 *
	 * @param  {!Grape2D.ColoredShape} shape The colored shape to render.
	 * @param  {!Grape2D.Camera} camera The camera to transform the colored shape.
	 * @public
	 */
	renderColoredShape: function(shape, camera){},
	/**
	 * Renders a texture to a position on the renderer.
	 *
	 * @param  {!Grape2D.ITexture} texture The texture to render
	 * @param  {!Grape2D.Vector} position The position to render
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
	 * Renders an network object to the renderer.
	 *
	 * @param  {!Grape2D.NetworkObject2D} obj Network object.
	 * @param  {!Grape2D.Vector} pos Lerped position of the object.
	 * @param  {!Grape2D.Camera} camera Camera to transform the coordinates.
	 * @public
	 */
	renderNetworkObject2D: function(obj, pos, camera) {},
	/**
	 * Renders the wireframe of an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb The AABB to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the
	 *   coordinates.
	 * @public
	 */
	renderAABB: function(aabb, camera) {},
	/**
	 * Renders the wireframe of a circle.
	 *
	 * @param  {!Grape2D.Circle} circle Circle to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the
	 *   coordinates.
	 * @public
	 */
	renderCircle: function(circle, camera) {},
	/**
	 * Renders the wireframe of a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the
	 *   coordinates.
	 * @public
	 */
	renderPolygon: function(polygon, camera) {},
	/**
	 * Renders text to the renderer.
	 *
	 * @param  {!(string|number)} text Text to render.
	 * @param  {!Grape2D.Vector} position Top left corner of the text.
	 * @public
	 */
	renderText: function(text, position) {},
	/**
	 * Prepares a render cycle. This method should be called once, at
	 *   the begining of the rendering cycle.
	 *
	 * @param {!Grape2D.Camera} camera Camera to render the scene.
	 * @public
	 */
	start: function(camera) {},
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
	 * Sets the coloring mode to stroke.
	 *
	 * @public
	 */
	setStrokeColorMode: function() {},
	/**
	 * Sets the coloring mode to fill.
	 *
	 * @public
	 */
	setFillColorMode: function(color) {},
	/**
	 * Sets the color current color, to be used in the
	 *   color mode.
	 *
	 * @param {!Grape2D.Color} color Color to be used.
	 * @public
	 */
	setColor: function(color){},
	/**
	 * Renders a particle to the renderer.
	 *
	 * @param  {!Grape2D.Particle} particle Particle to render.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 */
	renderParticle: function(particle, camera) {},
	/**
	 * Renders a line segment to the renderer.
	 *
	 * @param  {!Grape2D.Vector} start Start position of the line.
	 * @param  {!Grape2D.Vector} end End position of the line.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 */
	renderLineSegment: function(start, end, camera) {},
	/**
	 * Renders a point to the renderer.
	 *
	 * @param  {!Grape2D.Vector} point Point position.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 */
	renderPoint: function(point, camera) {}
};