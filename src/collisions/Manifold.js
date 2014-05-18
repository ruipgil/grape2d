/**
 * Manifold class.
 *
 * @param {!Grape2D.IEntity} a Entity.
 * @param {!Grape2D.IEntity} b Entity.
 * @constructor
 */
Grape2D.Manifold = function(a, b) {
	/**
	 * Entity.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.a = a;
	/**
	 * Entity.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.b = b;
	/**
	 * Penetration between the two
	 *   {@link Grape2D.IEntity}s bounding box
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
	 * Gets the first entity.
	 *
	 * @return {!Grape2D.IEntity} First entity.
	 * @public
	 */
	getA: function() {
		return this.a;
	},
	/**
	 * Sets the first entity.
	 *
	 * @param {!Grape2D.IEntity} a First entity.
	 * @public
	 */
	setA: function(a) {
		this.a = a;
	},
	/**
	 * Gets the second entity.
	 *
	 * @return {!Grape2D.IEntity} Second entity.
	 * @public
	 */
	getB: function() {
		return this.b;
	},
	/**
	 * Sets the second entity.
	 *
	 * @param {!Grape2D.IEntity} b Second entity.
	 * @public
	 */
	setB: function(b) {
		this.b = b;
	},
	/**
	 * Gets the penetration between the two entities.
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
	 * Sets the penetration between the two entities.
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
	 *   the two entities.
	 *
	 * @return {!Grape2D.Vector} Normal vector.
	 * @public
	 */
	getNormal: function() {
		return this.normal;
	},
	/**
	 * Sets the normal of the penetration of between
	 *   the two entities.
	 *
	 * @param {!Grape2D.Vector} normal Normal vector.
	 * @public
	 */
	setNormal: function(normal) {
		this.normal.set(normal);
	},
	/**
	 * Inverts the manifold. It changes the entities
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