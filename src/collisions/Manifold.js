/**
 * Manifold class.
 *
 * @param {!Grape2D.Object2D} a Object.
 * @param {!Grape2D.Object2D} b Object.
 * @constructor
 */
Grape2D.Manifold = function(a, b) {
	/**
	 * Object.
	 *
	 * @type {!Grape2D.Object2D}
	 * @private
	 */
	this.a = a;
	/**
	 * Object.
	 *
	 * @type {!Grape2D.Object2D}
	 * @private
	 */
	this.b = b;
	/**
	 * Penetration between the two
	 *   {@link Grape2D.Object}s bounding box
	 *   ({@link Grape2D.Shape}).
	 *
	 * @type {!number}
	 * @private
	 */
	this.penetration = 0;
	/**
	 * Normal of the intersection of the two
	 *   {@link Grape2D.Shape}.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.normal = new Grape2D.Vector();
};

Grape2D.Manifold.prototype = {
	constructor: Grape2D.Manifold,
	/**
	 * Gets the first object.
	 *
	 * @return {!Grape2D.Object2D} First object.
	 * @public
	 */
	getA: function() {
		return this.a;
	},
	/**
	 * Sets the first object.
	 *
	 * @param {!Grape2D.Object2D} a First object.
	 * @public
	 */
	setA: function(a) {
		this.a = a;
	},
	/**
	 * Gets the second object.
	 *
	 * @return {!Grape2D.Object2D} Second object.
	 * @public
	 */
	getB: function() {
		return this.b;
	},
	/**
	 * Sets the second object.
	 *
	 * @param {!Grape2D.Object2D} b Second object.
	 * @public
	 */
	setB: function(b) {
		this.b = b;
	},
	/**
	 * Gets the penetration between the two objects.
	 *   This only returns the stored information,
	 *   no calculation is done by this method.
	 *
	 * @return {!number} Penetration distance.
	 * @public
	 */
	getPenetration: function() {
		return this.penetration;
	},
	/**
	 * Sets the penetration between the two objects.
	 *
	 * @param {!number} penetration Penetration
	 *   distance.
	 * @public
	 */
	setPenetration: function(penetration) {
		this.penetration = penetration;
	},
	/**
	 * Gets the normal of the penetration of between
	 *   the two objects.
	 *
	 * @return {!Grape2D.Vector} Normal vector.
	 * @public
	 */
	getNormal: function() {
		return this.normal;
	},
	/**
	 * Sets the normal of the penetration of between
	 *   the two objects.
	 *
	 * @param {!Grape2D.Vector} normal Normal vector.
	 * @public
	 */
	setNormal: function(normal) {
		this.normal.set(normal);
	},
	/**
	 * Inverts the manifold. It changes the objects
	 *   a and b, and changes the direction of the
	 *   normal.
	 *
	 * @return {!Grape2D.Manifold} This manifold.
	 * @public
	 */
	invert: function(){
		var temp = this.a;
		this.a = this.b;
		this.b = temp;
		this.normal.negate();
		return this;
	}
};