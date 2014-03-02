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
Grape2D.WireframeRenderer.prototype.renderObject2D = function(obj) {
	this.renderPoint(obj.getPosition());
	obj.getBoundingBox().render(this);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderNetworkObject2D = function(obj, pos) {
	this.renderPoint(obj.getPosition());
	obj.getBoundingBox().render(this);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAABB = function(aabb) {
	this.renderer.renderAABB(aabb);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderCircle = function(circle) {
	this.renderer.renderCircle(circle);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPolygon = function(polygon) {
	this.renderer.renderPolygon(polygon);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderText = function(text) {
	this.renderer.renderText(text);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAbsoluteText = function(absoluteText) {
	this.renderer.renderText(absoluteText);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.start = function(camera) {
	this.renderer.start(camera);
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
Grape2D.WireframeRenderer.prototype.renderColoredShape = function(shape) {
	this.renderer.renderColoredShape(shape);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderParticle = function(particle) {
	this.renderer.renderParticle(particle);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderLineSegment = function(start, end) {
	this.renderer.renderLineSegment(start, end);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPoint = function(point) {
	this.renderer.renderPoint(point);
};