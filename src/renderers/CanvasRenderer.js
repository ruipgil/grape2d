/**
 * This renders objects to a canvas object, with a 2D context. This
 *   method is not hardware accelerated by default, however is the
 *   most stable and cross-browser.
 *
 * @param  {Object=} options Options to setup the renderer.
 * @param  {!number=} options.width Width of the renderer.
 * @param  {!number=} options.height Height of the renderer.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.CanvasRenderer = function(options) {
	/**
	 * A canvas object
	 *
	 * @type {!Grape2D.Canvas}
	 * @private
	 */
	this.canvas = new Grape2D.Canvas(options);
	/**
	 * The default color.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = new Grape2D.Color();
	if(options && options.color){
		this.color.set(options.color);
	}
	/**
	 * Current color mode.
	 *
	 * @type {!function(!Grape2D.Color):Grape2D.Canvas}
	 * @private
	 */
	this.colorMode = this.canvas.fill;

	var that = this;
	this.init();
	this.canvas.addEventListener("resize", function(){
		that.init();
	});
};

//CanvasRenderer inherits from Renderer
Grape2D.CanvasRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
Grape2D.CanvasRenderer.prototype.init = function() {
	this.canvas.translate(this.canvas.getHalfWidth(), this.canvas.getHalfHeight());
};
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
Grape2D.CanvasRenderer.prototype.renderColoredShape = function(shape, camera) {
	this.setColor(shape.getColor());
	shape.getShape().render(this, camera);
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
Grape2D.CanvasRenderer.prototype.renderNetworkObject2D = function(obj, pos, camera) {
	obj.getTexture().render(this, camera.wcsToViewport(this, pos));
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderAABB = function(aabb, camera) {
	var topLeft = camera.wcsToViewport(this, aabb.getMin());
	this.canvas.strokeRect(topLeft.x, topLeft.y, aabb.getWidth() * camera.getScale().x, aabb.getHeight() * camera.getScale().y);
	this.colorMode(this.color);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderCircle = function(circle, camera) {
	var center = camera.wcsToViewport(this, circle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, circle.getRadius() * camera.getScale().x, 0, Grape2D.Math.PIx2, false);
	this.colorMode();
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
	this.colorMode();

};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderText = function(text, position) {
	this.canvas.fillText(text, position.getX(), position.getY());
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.start = function() {
	//this.canvas.clear();
	this.canvas.clearRect(-this.canvas.getHalfWidth(), -this.canvas.getHalfHeight(), this.canvas.getWidth(), this.canvas.getHeight());
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
 * @public
 */
Grape2D.CanvasRenderer.prototype.getContext = function() {
	return this.canvas.context;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setStrokeColorMode = function() {
	this.colorMode = this.canvas.stroke;
	return this;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setFillColorMode = function() {
	this.colorMode = this.canvas.fill;
	return this;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setColor = function(color) {
	this.color.set(color);
	this.canvas.setFillColor(this.color);
	this.canvas.setStrokeColor(this.color);
	return this;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderParticle = function(particle, camera) {
	var center = camera.wcsToViewport(this, particle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 1, 0, Grape2D.Math.PIx2, false);
	this.colorMode();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderLineSegment = function(start, end, camera) {
	var s = camera.wcsToViewport(this, start),
		e = camera.wcsToViewport(this, end);
	this.canvas.beginPath();
	this.canvas.moveTo(s.getX(), s.getY());
	this.canvas.lineTo(e.getX(), e.getY());
	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderPoint = function(point, camera) {
	var center = camera.wcsToViewport(this, point);
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 2, 0, Grape2D.Math.PIx2, false);
	this.canvas.fill();
};