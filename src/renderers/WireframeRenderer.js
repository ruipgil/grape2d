/**
 * Only renders the wireframe of (the bounding box of)
 *   {@link Grape2D.Object2D}, using another {@link Grape2D.Renderer},
 *   such as {@link Grape2D.CanvasRenderer}. This class is a bridge,
 *   so in fact the renderer provided is the one that is being used.
 *
 * @param  {!Grape2D.Renderer} renderer The renderer to use.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.WireframeRenderer = function(renderer) {
	/**
	 * Renderer to use as an helper.
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.renderer = renderer;
};

Grape2D.WireframeRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getWidth = function() {
	return this.renderer.getWidth();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHalfWidth = function() {
	return this.renderer.getHalfWidth();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setWidth = function(width) {
	this.renderer.setWidth(width);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHeight = function() {
	return this.renderer.getHeight();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHalfHeight = function() {
	return this.renderer.getHalfHeight();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setHeight = function(height) {
	this.renderer.setHeight(height);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderTexture = function(texture, position) {
	this.renderer.renderTexture(texture, position);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderObject2D = function(obj, camera) {
	this.renderPoint(obj.getPosition(), camera);
	obj.getBoundingBox().render(this, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderNetworkObject2D = function(obj, pos, camera) {
	this.renderPoint(obj.getPosition(), camera);
	obj.getBoundingBox().render(this, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAABB = function(aabb, camera) {
	this.renderer.renderAABB(aabb, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderCircle = function(circle, camera) {
	this.renderer.renderCircle(circle, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPolygon = function(polygon, camera) {
	this.renderer.renderPolygon(polygon, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderText = function(text, position) {
	this.renderer.renderText(text, position);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.start = function() {
	this.renderer.start();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.end = function() {
	this.renderer.end();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.appendToDOMElement = function(elm) {
	this.renderer.appendToDOMElement(elm);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getDOMElement = function() {
	return this.renderer.getDOMElement();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setStrokeColorMode = function() {
	this.renderer.setStrokeColorMode();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setFillColorMode = function() {
	this.renderer.setFillColorMode();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setColor = function(color) {
	this.renderer.setColor(color);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderColoredShape = function(shape, camera) {
	this.renderer.renderColoredShape(shape, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderParticle = function(particle, camera) {
	this.renderer.renderParticle(particle, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderLineSegment = function(start, end, camera) {
	this.renderer.renderLineSegment(start, end, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPoint = function(point, camera) {
	this.renderer.renderPoint(point, camera);
};