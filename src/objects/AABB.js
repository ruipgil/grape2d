/**
 * Creates a new aabb instance.
 * @classdesc AABB (standing for Axis Align Bounding Box), represent
 *            rectangular shapes.
 *
 * @param {?Grape2D.Vector} options.position - The position of the polygon
 * @param {!number} options.width - Width of the AABB.
 * @param {!number} options.height - Height of the AABB.
 *
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.AABB = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Shape's width.
	 *
	 * @type {number}
	 * @private
	 */
	this.width = options.width;
	/**
	 * Shape's half width.
	 *
	 * @type {number}
	 * @private
	 */
	this.hwidth = this.width/2;
	/**
	 * Shapes's height.
	 *
	 * @type {number}
	 * @private
	 */
	this.height = options.height;
	/**
	 * Shapes's half height.
	 *
	 * @type {number}
	 * @private
	 */
	this.hheight = this.height/2;
};

Grape2D.AABB.prototype = Object.create(Grape2D.Shape.prototype);
/**
 * Gets the width of the AABB.
 *
 * @return {number} The width of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getWidth = function(){
	return this.width;
};
/**
 * Gets the height of the AABB.
 *
 * @return {number} The height of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getHeight = function(){
	return this.height;
};
/**
 * Gets the half width (width/2) of the AABB.
 *
 * @return {number} Half width of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getHalfWidth = function(){
	return this.hwidth;
};
/**
 * Gets the half height (height/2) of the AABB.
 *
 * @return {number} Half height of the AABB.
 * @public
 */
Grape2D.AABB.prototype.getHalfHeight = function(){
	return this.hheight;
};
/**
 * Sets the width of the AABB.
 *
 * @param  {number} width - The width of the AABB.
 * @public
 */
Grape2D.AABB.prototype.setWidth = function(width){
	this.width = width;
	this.hwidth = this.width/2;
};
/**
 * Sets the height of the AABB.
 *
 * @param  {number} height - The height of the AABB.
 * @public
 */
Grape2D.AABB.prototype.setHeight = function(height){
	this.height = height;
	this.hheight = this.height;
};
/**
 * @see Grape2D.Shape#render
 */
Grape2D.AABB.prototype.render = function(renderer, camera){
	renderer.renderAABB(this, camera);
};
/**
 * @override
 */
Grape2D.AABB.prototype.createBV = function(bvfactory){
	return bvfactory.createFromAABB(this);
};
/**
 * @override
 */
Grape2D.AABB.prototype.getStaticType = function(){
	return Grape2D.AABB.TYPE;
};
Grape2D.AABB.TYPE = "AABB";