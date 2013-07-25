/**
 * A field exerts forces onto a particle. It can attract or
 *   pull away particles, according to it's mass.
 *
 * @param  {!Object} options Setup options.
 * @param  {!number} options.mass Mass of the field.
 * @param  {!Grape2D.Vector} options.position Position of the field.
 *
 * @constructor
 */
Grape2D.Field = function(options) {
	/**
	 * Mass of the field.
	 *
	 * @type {!number}
	 * @private
	 */
	this.mass = options.mass;
	/**
	 * Position of the field.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = options.position;
};

Grape2D.Field.prototype = {
	constructor: Grape2D.Field,
	/**
	 * Gets the mass of the field.
	 *
	 * @return {!number} Mass of the field.
	 * @public
	 */
	getMass: function() {
		return this.mass;
	},
	/**
	 * Sets the mass of the field.
	 *
	 * @param  {!number} mass Mass of the field.
	 * @public
	 */
	setMass: function(mass) {
		this.mass = mass;
	},
	/**
	 * Gets the position of the field.
	 *
	 * @return {!Grape2D.Vector} Position of the field.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Sets the position of the field.
	 *
	 * @param  {!Grape2D.Vector} position Position of the field.
	 * @public
	 */
	setPosition: function(position) {
		this.position.set(position);
	},
	/**
	 * Computes the acceleration that this field makes in
	 *   a point.
	 *
	 * @param  {!Grape2D.Vector} position Position to calculate
	 *   the force.
	 * @return {!Grape2D.Vector} Acceleration at a point.
	 * @private
	 */
	computeAcceleration: function(position) {
		var v = this.position.clone().sub(position),
			force = this.mass / Grape2D.Math.pow(
				Grape2D.Math.sq(v.getX()) + Grape2D.Math.sq(v.getY()) + this.mass,
				1.5);
		return v.multiplyByScalar(force);
	}
};