/**
 * Ray.
 *
 * @param  {!Grape2D.Vector} start Start of the ray.
 * @param  {!Grape2D.Vector} direction Direction of the ray.
 * @param  {!number} length Direction of the ray.
 * @constructor
 */
Grape2D.Ray = function(start, direction, length){
	/**
	 * Start position of the ray.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.start = new Grape2D.Vector().set(start);
	/**
	 * Direction of the ray.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.direction = new Grape2D.Vector().set(direction);
	/**
	 * Length of the ray.
	 *
	 * @type {!number}
	 * @private
	 */
	this.length = length;
	/**
	 * End position of the ray.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.end = direction.clone().multiplyByScalar(length).add(start);
};

Grape2D.Ray.prototype = {
	constructor: Grape2D.Ray,
	/**
	 * Gets the start position of the ray.
	 *
	 * @return {!Grape2D.Vector} Start of the ray.
	 * @public
	 */
	getStart: function(){
		return this.start;
	},
	/**
	 * Gets the direction of the ray.
	 *
	 * @return {!Grape2D.Vector} Direction of the ray.
	 * @public
	 */
	getDirection: function(){
		return this.direction;
	},
	/**
	 * Gets the length of the ray.
	 *
	 * @return {!number} Length of the ray.
	 * @public
	 */
	getLength: function(){
		return this.length;
	},
	/**
	 * Gets the end position of the ray. This is computed,
	 *   resulting from from the scalar multiplication
	 *   of the direction by the length, added by the start
	 *   position.
	 *
	 * @return {!Grape2D.Vector} End of the ray.
	 * @public
	 */
	getEnd: function(){
		return this.end;
	},
	/**
	 * Gets the static type
	 *
	 * @return {!string} Type.
	 * @public
	 */
	getStaticType: function(){
		return Grape2D.Ray.STATIC_TYPE;
	}
};
/**
 * Type.
 *
 * @constant {!string}
 * @static
 * @private
 */
Grape2D.Ray.STATIC_TYPE = "Ray";