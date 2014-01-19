/**
 * Circle describes a circle shape. A circle is defined by
 *   it's radius.
 *
 * @param {!Object} options Setup options. See {@link Grape2D.Shape}
 * @param {?Grape2D.Vector} options.position The position of the
 *   polygon
 * @param {!number} options.radius Radius of the circle.
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.Circle = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Circle's radius.
	 *
	 * @type {!number}
	 * @private
	 */
	this.radius = options.radius;
};

Grape2D.Circle.prototype = Object.create(Grape2D.Shape.prototype);

/**
 * Gets the radius of the circle.
 *
 * @return {!number} The radius of the circle.
 * @public
 */
Grape2D.Circle.prototype.getRadius = function(){
	return this.radius;
};
/**
 * Sets the radius of the circle.
 *
 * @param  {!number} radius - The new radius of the circle
 * @public
 */
Grape2D.Circle.prototype.setRadius = function(radius){
	this.radius = radius;
};
/**
 * @override
 */
Grape2D.Circle.prototype.render = function(renderer){
	renderer.renderCircle(this);
};
/**
 * @override
 */
Grape2D.Circle.prototype.createBV = function(bvfactory){
	return bvfactory.createFromCircle(this);
};
/**
 * @override
 */
Grape2D.Circle.prototype.getStaticType = function(){
	return Grape2D.Circle.TYPE;
};
/**
 * Type of the shape.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.Circle.TYPE = "Circle";