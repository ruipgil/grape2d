/**
 * Shape is an abstract class that describes "physical", objects.
 *   The main objective of a Shape is to serve as a bounding box. It
 *   should play the main role when selecting the objects to render,
 *   when it comes to collision detection and/or to detect user
 *   interaction with an object.
 *
 * @param {!Grape2D.Vector=} options.position The position of the shape.
 * @implements {Grape2D.IShape}
 * @constructor
 */
Grape2D.Shape = function(options) {
	Grape2D.IShape.call(this);
	options = options || {};
	/**
	 * Shape's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @protected
	 */
	this.position = options.position || new Grape2D.Vector();
};

Grape2D.Shape.prototype = Object.create(Grape2D.IShape.prototype);
/**
 * @override
 */
Grape2D.Shape.prototype.getPosition = function() {
	return this.position;
};
/**
 * @override
 */
Grape2D.Shape.prototype.setPosition = function(position) {
	this.position.set(position);
};
/**
 * @override
 */
Grape2D.Shape.prototype.render = function(renderer, camera) {
	return;
};
/**
 * @override
 */
Grape2D.Shape.prototype.createBV = function(bvfactory) {
	return null;
};
/**
 * @override
 */
Grape2D.Shape.prototype.getStaticType = function() {
	return "";
};