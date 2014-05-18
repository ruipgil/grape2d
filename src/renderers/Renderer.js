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
	 * @public
	 */
	renderColoredShape: function(shape){},
	/**
	 * Renders a texture to a position on the renderer.
	 *
	 * @param  {!Grape2D.ITexture} texture The texture to render
	 * @param  {!Grape2D.Vector} position The position to render
	 * @public
	 */
	renderTexture: function(texture, position) {},
	/**
	 * Renders an entity to the renderer. Specifically a
	 *   {@see Grape2D.REntity}.
	 *
	 * @param  {!Grape2D.REntity} entity Entity to render.
	 * @public
	 */
	renderREntity: function(entity) {},
	/**
	 * Renders the wireframe of an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb The AABB to render.
	 * @public
	 */
	renderAABB: function(aabb) {},
	/**
	 * Renders the wireframe of a circle.
	 *
	 * @param  {!Grape2D.Circle} circle Circle to render.
	 * @public
	 */
	renderCircle: function(circle) {},
	/**
	 * Renders the wireframe of a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to render.
	 * @public
	 */
	renderPolygon: function(polygon) {},
	/**
	 * Renders text to the renderer.
	 *
	 * @param  {!Grape2D.Text} text Text to render.
	 * @public
	 */
	renderText: function(text) {},
	/**
	 * Renders text, on a position absolute to the renderer.
	 *
	 * @param  {!Grape2D.AbsoluteText} text Text to render.
	 * @public
	 */
	renderAbsoluteText: function(text) {},
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
	 * @public
	 */
	//renderParticle: function(particle) {},
	/**
	 * Renders a line segment to the renderer.
	 *
	 * @param  {!Grape2D.Vector} start Start position of the line.
	 * @param  {!Grape2D.Vector} end End position of the line.
	 * @public
	 */
	renderLineSegment: function(start, end) {},
	/**
	 * Renders a point to the renderer.
	 *
	 * @param  {!Grape2D.Vector} point Point position.
	 * @public
	 */
	renderPoint: function(point) {},
};