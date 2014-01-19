/**
 * A shape that can be rendered with a color. This is particulary useful for debug, and is best way to renderer a shape with color with the {@link Grape2D.WireframeRenderer}.
 *
 * @param {!Grape2D.IShape} options.shape Shape to be colored.
 * @param {!Grape2D.Color=} options.color Shape's rendering color.
 * @implements {Grape2D.IShape}
 * @constructor
 */
Grape2D.ColoredShape = function(options) {
	Grape2D.IShape.call(this);
	/**
	 * Color of the shape.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = options.color || new Grape2D.Color();
	/**
	 * Shape.
	 *
	 * @type {!Grape2D.IShape}
	 * @private
	 */
	this.shape = options.shape;
};
Grape2D.ColoredShape.prototype = Object.create(Grape2D.IShape.prototype);
/**
 * Gets the color.
 *
 * @return {!Grape2D.Color} Color.
 * @public
 */
Grape2D.ColoredShape.prototype.getColor = function(){
	return this.color;
};
/**
 * Sets the color.
 *
 * @param {!Grape2D.Color} color Color.
 * @public
 */
Grape2D.ColoredShape.prototype.setColor = function(color){
	this.color = color;
};
/**
 * Gets the shape.
 *
 * @return {!Grape2D.IShape} Shape.
 * @public
 */
Grape2D.ColoredShape.prototype.getShape = function() {
	return this.shape;
};
/**
 * Sets the shape.
 *
 * @param {!Grape2D.Shape} shape Shape.
 * @public
 */
Grape2D.ColoredShape.prototype.setShape = function(shape) {
	this.shape = shape;
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.getPosition = function() {
	return this.shape.getPosition();
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.setPosition = function(position) {
	this.shape.setPosition(position);
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.render = function(renderer) {
	renderer.renderColoredShape(this);
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.createBV = function(bvfactory) {
	return this.shape.createBV(bvfactory);
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.getStaticType = function() {
	return Grape2D.ColoredShape.TYPE;
};
Grape2D.ColoredShape.TYPE = "COLOREDSHAPE";