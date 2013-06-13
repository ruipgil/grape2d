/**
 * @author rui_web@hotmail.com (Rui Gil)
 */

/**
 * Describes a math vector in the cartesian space (2D).
 * This is also very useful and may be used to represent
 * points.
 *
 * @param  {number} x the x component
 * @param  {number} y the y component
 *
 * @constructor
 * @public
 */
Grape2D.Vector = function(x, y){
	/**
	 * The x component. The default value is 0.
	 *
	 * @type {number}
	 * @private
	 */
	this.x = x || 0;
	/**
	 * The y component. The default value is 0.
	 *
	 * @type {number}
	 * @private
	 */
	this.y = y || 0;
};

Grape2D.Vector.prototype = {
	constructor: Grape2D.Vector,
	/**
	 * Gets the x component of the vector
	 *
	 * @return {number} the x component
	 */
	getX: function(){
		return this.x;
	},
	/**
	 * Sets the x component of the vector
	 *
	 * @param  {number} x the new value
	 */
	setX: function(x){
		this.x = x;
	},
	/**
	 * Gets the y component of the vector
	 *
	 * @return {number} the y component
	 */
	getY: function(){
		return this.y;
	},
	/**
	 * Sets the x component of the vector
	 *
	 * @param  {number} x the new value
	 */
	setY: function(y){
		this.y = y;
	},
	/**
	 * Sets this vector with the same component of another one.
	 *
	 * @param  {Grape2D.Vector} vector the vector to copy
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	set: function(vector){
		this.x = vector.x;
		this.y = vector.y;
		return this;
	},
	/**
	 * Adds the components of another vector to this.
	 *
	 * @param  {Grape2D.Vector} vector the vector to add
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	add: function(vector){
		this.x += vector.x;
		this.y += vector.y;
		return this;
	},
	/**
	 * Subtracts the components of another vector to this.
	 *
	 * @param  {Grape2D.Vector} vector the vector to subtract
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	sub: function(vector){
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	},
	/**
	 * Multiplies components by a scalar
	 *
	 * @param  {number} scalar the number to multiply
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	multiplyByScalar: function(scalar){
		this.x *= scalar;
		this.y *= scalar;
		return this;
	},
	/**
	 * Divides components by a scalar
	 *
	 * @param  {number} scalar the number to divide
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	divideByScalar: function(scalar){
		this.x /= scalar;
		this.y /= scalar;
		return this;
	},
	/**
	 * Inverts the components of the vector. It's the same as
	 *   multiply by -1.
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	negate: function(){
		return this.multiplyByScalar(-1);
	},
	/**
	 * Normalizes the vector. So that each component have a value
	 *   between 0 and 1.
	 *
	 * @return {Grape2D.Vector} this vector
	 */
	normalize: function(){
		return this.divideByScalar(this.getMagnitude());
	},
	/**
	 * Gets the magnitude (length) of a vector.
	 *
	 * @return {number} the magnitude of the vector.
	 */
	getMagnitude: function(){
		return Grape2D.Math.sqrt(this.x*this.x+this.y*this.y);
	},
	/**
	 * Gets the angle that the vector makes with the x axis
	 *
	 * @return {number} the angle
	 */
	getAngle: function(){
		var angle = 1;
		if(this.y<0){
			angle = -1;
		}
		return Math.acos(this.x/this.length())*angle;
	},
	/**
	 * Gets the dot product of this and another vector.
	 *
	 * @param  {Grape2D.Vector} vector another vector
	 *
	 * @return {number} the dot product
	 */
	dot: function(vector){
		return this.x*vector.x+this.y*vector.y;
	},
	/**
	 * Projects this vector into other. This operation
	 *   don't changes the values of the objects.
	 *
	 * @param  {Grape2D.Vector} vector the vector to project onto
	 *
	 * @return {Grape2D.Vector} the vector resulting from the projection.
	 */
	project: function(vector){
		var dp = this.dot(vector),
			proj = new Grape2D.Vector();
		proj.x = dp*vector.x;
		proj.y = dp*vector.y;
		return proj;
	},
	/**
	 * Calculates the right normal of the vector.
	 *
	 * @return {Grape2D.Vector} the right normal vector
	 */
	rightNormal: function(){
		return new Grape2D.Vector(-this.y, this.x);
	},
	/**
	 * Checks if two vectors are parallel.
	 *
	 * @param  {Grape2D.Vector} vector vector to check
	 *
	 * @return {boolean} true if the vector is parallel to 
	 *   this one, false otherwise
	 */
	isParallelTo: function(vector){
		return Grape2D.Math.abs(vector.x) == Grape2D.Math.abs(this.x) && Grape2D.Math.abs(vector.y) == Grape2D.Math.abs(this.x);
	},
	/**
	 * Calculates the distance between this and another vector
	 *
	 * @param  {Grape2D.Vector} vector the other vector
	 *
	 * @return {number} the distance
	 */
	distanceTo: function(vector){
		return Grape2D.Math.sqrt(vector.x*this.x+vector.y*this.y);
	},
	/**
	 * Checks if the components of one vector are equal to the components to another one.
	 *
	 * @param  {Grape2D.Vector} vector the other vector
	 *
	 * @return {boolean} true if they're components are not equal
	 */
	equals: function(vector){
		return this.x == vector.x && this.y == vector.y;
	},
	/**
	 * Creates a new vector with the same components.
	 *
	 * @return {Grape2D.Vector} a new vector with the same components as this one.
	 */
	clone: function(){
		return new Grape2D.Vector(this.x, this.y);
	},
	/**
	 * Creates a string for this class.
	 *
	 * @return {string} a string representing this class
	 */
	toString: function(){
		return "Grape2D.Vector ("+this.x+","+this.y+")";
	},
	/**
	 * Applies the result of a given function, where the component is an argument, to the respective component.
	 * This can be useful to minimize code or just simplify it. As an example, {@linkcode someVector.use(Grape.Math.sqrt)}
	 *
	 * @param  {Function} fn a function that receives a number and returns a number.
	 *
	 * @return {Grape2D.Vector} this vector.
	 */
	use: function(fn){
		this.x = fn(this.x);
		this.y = fn(this.y);
		return this;
	}
};

/**
 * Creates a vector from two points (points are represented as vectors).
 *
 * @param  {Grape2D.Vector} a one point
 * @param  {Grape2D.Vector} b another point
 *
 * @return {Grape2D.Vector} vector with direction from a to b, normalized.
 */
Grape2D.Vector.createFromPoints = function(a,b){
	return (new Grape2D.Vector(b.x-a.x, b.y-a.y)).normalize();
};
/**
 * Creates a vector from an angle and magnitude.
 *
 * @param  {number} angle angle of the vector against the x axis.
 * @param  {number} magnitude magnitude (length) of the vector.
 *
 * @return {Grape2D.Vector} vector with the given angle and magnitude.
 */
Grape2D.Vector.createFromAngle = function(angle, magnitude){
	return new Grape2D.Vector(magnitude*Grape2D.Math.cos(angle), magnitude*Grape2D.Math.sin(angle));
};