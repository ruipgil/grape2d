/**
 * AABB (standing for Axis Align Bounding Box), represents
 *   rectangular shapes.
 *
 * @param {!Object} options Setup options. See {@link Grape2D.Shape}
 * @param {?Grape2D.Vector} options.position - The position of the
 *   polygon.
 * @param {!number} options.width Width of the AABB.
 * @param {!number} options.height Height of the AABB.
 *
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.AABB = function(options) {
	Grape2D.Shape.call(this, options);
	/**
	 * Minimum coordinates of the AABB. This is the same as the top
	 *   left corner.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.min = new Grape2D.Vector();
	/**
	 * Maximum coordinates of the AABB. This is the same as the bottom
	 *   right corner.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.max = new Grape2D.Vector();
	if (options.width && options.height) {
		this.setWidth(options.width);
		this.setHeight(options.height);
	} else {
		var pos = this.getPosition();

		this.min.setX(options.minX);
		this.min.setY(options.minY);
		this.max.setX(options.maxX);
		this.max.setY(options.maxY);

		pos.setX(options.minX + (this.max.getX() - this.min.getX()) / 2);
		pos.setY(options.minY + (this.max.getY() - this.min.getY()) / 2);
	}
};

Grape2D.AABB.prototype = Object.create(Grape2D.Shape.prototype);
/**
 * Gets the top left corner coordinates of the AABB.
 *
 * @return {!Grape2D.Vector} Top left corner.
 * @public
 */
Grape2D.AABB.prototype.getMin = function() {
	return this.min;
};
/**
 * Gets the minimum x coordinate of the AABB.
 *
 * @return {!Grape2D.Vector} Minimum x coordinate.
 * @public
 */
Grape2D.AABB.prototype.getMinX = function() {
	return this.min.getX();
};
/**
 * Gets the minimum y coordinate of the AABB.
 *
 * @return {!Grape2D.Vector} Minimum y coordinate.
 * @public
 */
Grape2D.AABB.prototype.getMinY = function() {
	return this.min.getY();
};
/**
 * Gets the bottom right corner coordinates of the AABB.
 *
 * @return {!Grape2D.Vector} Bottom right corner.
 * @public
 */
Grape2D.AABB.prototype.getMax = function() {
	return this.max;
};
/**
 * Gets the maximum x coordinate of the AABB.
 *
 * @return {!Grape2D.Vector} Maximum x coordinate.
 * @public
 */
Grape2D.AABB.prototype.getMaxX = function() {
	return this.max.getX();
};
/**
 * Gets the maximum y coordinate of the AABB.
 *
 * @return {!Grape2D.Vector} Maximum y coordinate.
 * @public
 */
Grape2D.AABB.prototype.getMaxY = function() {
	return this.max.getY();
};
/**
 * Gets the width of the AABB.
 *
 * @return {!number} The width of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getWidth = function() {
	return Grape2D.Math.abs(this.max.getX() - this.min.getX());
};
/**
 * Gets the height of the AABB.
 *
 * @return {!number} The height of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getHeight = function() {
	return Grape2D.Math.abs(this.max.getY() - this.min.getY());
};
/**
 * Gets the half width (width/2) of the AABB.
 *
 * @return {!number} Half width of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getHalfWidth = function() {
	return this.getWidth() / 2;
};
/**
 * Gets the half height (height/2) of the AABB.
 *
 * @return {!number} Half height of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getHalfHeight = function() {
	return this.getHeight() / 2;
};
/**
 * Sets the width of the AABB.
 *
 * @param  {!number} width The width of the AABB.
 * @public
 */
Grape2D.AABB.prototype.setWidth = function(width) {
	var hw = width / 2;
	this.min.setX(this.getPosition().getX() - hw);
	this.max.setX(this.getPosition().getX() + hw);
};
/**
 * Sets the height of the AABB.
 *
 * @param  {!number} height The height of the AABB.
 * @public
 */
Grape2D.AABB.prototype.setHeight = function(height) {
	var hh = height / 2;
	this.min.setY(this.getPosition().getY() - hh);
	this.max.setY(this.getPosition().getY() + hh);
};
/**
 * @override
 */
Grape2D.AABB.prototype.render = function(renderer, camera) {
	renderer.renderAABB(this, camera);
};
/**
 * @override
 */
Grape2D.AABB.prototype.createBV = function(bvfactory) {
	return bvfactory.createFromAABB(this);
};
/**
 * @override
 */
Grape2D.AABB.prototype.getStaticType = function() {
	return Grape2D.AABB.TYPE;
};
/**
 * @override
 */
Grape2D.AABB.prototype.setPosition = function(position) {
	var diff = position.clone().sub(this.getPosition());
	this.min.add(diff);
	this.max.add(diff);
	Grape2D.Shape.prototype.setPosition.call(this, position);
};
/**
 * Type of the shape.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.AABB.TYPE = "AABB";