/**
 * This renders objects to a canvas object, with a 2D context. This
 *   method is not hardware accelerated by default, however is the
 *   most stable and cross-browser.
 *
 * @param  {Object=} options Options to setup the renderer.
 * @param  {number=} options.width Width of the renderer.
 * @param  {number=} options.height Height of the renderer.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.CanvasRenderer = function(options) {
	/**
	 * A canvas object
	 *
	 * @type {Grape2D.Canvas}
	 */
	this.canvas = new Grape2D.Canvas(options);
};

//CanvasRenderer inherits from Renderer
Grape2D.CanvasRenderer.prototype = Object.create(Grape2D.Renderer.prototype);

/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getWidth = function() {
	return this.canvas.getWidth();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getHalfWidth = function() {
	return this.canvas.getHalfWidth();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setWidth = function(width) {
	this.canvas.setWidth(width);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getHeight = function() {
	return this.canvas.getHeight();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getHalfHeight = function() {
	return this.canvas.getHalfHeight();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setHeight = function(height) {
	this.canvas.setHeight(height);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderTexture = function(texture, position) {
	var scale = 1;
	this.canvas.drawImage(texture.getBuffer(), 0, 0, texture.getWidth(), texture.getHeight(), position.getX(), position.getY(), texture.getWidth() * scale, texture.getHeight() * scale);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderObject2D = function(obj, camera) {
	obj.getTexture().render(this, camera.wcsToViewport(this, obj.getTexturePosition()));
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderAABB = function(aabb, camera) {
	var startPosition = aabb.getPosition().clone(),
		topLeft = startPosition.clone(),
		topRight = startPosition.clone(),
		bottomRight = startPosition.clone(),
		bottomLeft = startPosition;

	topLeft.x -= aabb.getHalfWidth();
	topLeft.y -= aabb.getHalfHeight();
	topLeft = camera.wcsToViewport(this, topLeft);

	topRight.x += aabb.getHalfWidth();
	topRight.y -= aabb.getHalfHeight();
	topRight = camera.wcsToViewport(this, topRight);

	bottomLeft.x -= aabb.getHalfWidth();
	bottomLeft.y += aabb.getHalfHeight();
	bottomLeft = camera.wcsToViewport(this, bottomLeft);

	bottomRight.x += aabb.getHalfWidth();
	bottomRight.y += aabb.getHalfHeight();
	bottomRight = camera.wcsToViewport(this, bottomRight);

	this.canvas.beginPath();
	this.canvas.moveTo(topLeft.x, topLeft.y);
	this.canvas.lineTo(topRight.x, topRight.y);
	this.canvas.lineTo(bottomRight.x, bottomRight.y);
	this.canvas.lineTo(bottomLeft.x, bottomLeft.y);
	this.canvas.lineTo(topLeft.x, topLeft.y);
	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderCircle = function(circle, camera) {
	var center = camera.wcsToViewport(this, circle.getPosition());

	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, circle.getRadius(), 0, Grape2D.Math.PIx2, false);

	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderPolygon = function(polygon, camera) {
	var center = polygon.getPosition(),
		temp = null,
		first = center.clone(),
		list = polygon.getVertexList();

	first = camera.wcsToViewport(this, first.add(list[0]));
	this.canvas.beginPath();
	this.canvas.moveTo(first.getX(), first.getY());
	for (var i = 1; i < list.length; i++) {
		temp = center.clone();
		temp = camera.wcsToViewport(this, temp.add(list[i]));
		this.canvas.lineTo(temp.getX(), temp.getY());
	}

	this.canvas.lineTo(first.getX(), first.getY());
	this.canvas.stroke();

};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderText = function(text, position) {
	this.canvas.strokeText(text, position.getX(), position.getY());
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.start = function() {
	this.canvas.clear();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.end = function() {};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.appendToDOMElement = function(elm) {
	this.canvas.appendOn(elm);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getDOMElement = function() {
	return this.canvas.canvas;
};
/**
 * Gets the 2D context of teh canvas element.
 *
 * @return {!CanvasRenderingContext2D} Canvas 2D context.
 */
Grape2D.CanvasRenderer.prototype.getContext = function() {
	return this.canvas.context;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setStrokeColor = function(color) {
	this.canvas.setStrokeStyle(color);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setFillColor = function(color) {
	this.canvas.setFillStyle(color);
};