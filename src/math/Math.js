/**
 * Math describes the namespace that holds math functions and constants. Optimizations or browser specific functions for math should be implemented in this namespace
 *
 * @namespace
 */
Grape2D.Math = {

	/**
	 * PI value, with a 15 decimal aproximation
	 *
	 * @type {number}
	 * @constant
	 */
	PI: 3.141592653589793,

	/**
	 * Two PI value, with a 15 decimal aproximation
	 *
	 * @type {number}
	 * @constant
	 */
	PIx2: 6.283185307179586,

	/**
	 * PI/2 value, with a 15 decimal aproximation
	 *
	 * @type {number}
	 * @constant
	 */
	PId2: 1.5707963267948966,

	/**
	 * PI/4 value, with a 15 decimal aproximation
	 *
	 * @type {number}
	 * @constant
	 */
	PId4: 0.7853981633974483,

	/**
	 * PI/6 value, with a 15 decimal aproximation
	 *
	 * @type {number}
	 * @constant
	 */
	PId6: 0.5235987755982988,

	/**
	 * PI/8 value, with a 15 decimal aproximation
	 *
	 * @type {number}
	 * @constant
	 */
	PId8: 0.39269908169872414,

	/**
	 * Returns the absolute value of a number
	 *
	 * @param {number} number
	 * @return {number} returns the absolute number
	 */
	abs: function (number) {
		return Math.abs(number);
	},
	/**
	 * Returns the floor of a number
	 *
	 * @param  {number} n the number
	 *
	 * @return {number} the floored number
	 */
	floor: function (n) {
		return~~ n;
	},
	/**
	 * Returns the ceil of a number
	 *
	 * @param  {number} n the number
	 *
	 * @return {number} the ceiled number
	 */
	ceil: function (n) {
		return Math.ceil(n);
	},
	/**
	 * Rounds a number to the unit
	 *
	 * @param  {number} n the number
	 *
	 * @return {number} the rounded number
	 */
	round: function (n) {
		return~~ (n + 0.5);
	},
	/**
	 * Get a random float
	 *
	 * @param  {number} min the min possible value between min and max,
	 *		if max is defined. If not than it's the max value, between
	 *		0 and min.
	 * @param  {number} max optional, the max possible value, between
	 *		min and max.
	 *
	 * @return {number} a random float number.
	 */
	randFloat: function (min, max) {
		if (!max) {
			return Math.random() * min;
		} else {
			return min + Math.random() * (max - min);
		}
	},
	/**
	 * Get a random float
	 *
	 * @param  {number} min the min possible value between min and max,
	 *		if max is defined. If not than it's the max value, between
	 *		0 and min.
	 * @param  {number} max optional, the max possible value, between
	 *		min and max.
	 *
	 * @return {number} a random integer number
	 */
	randInt: function (min, max) {
		return Grape2D.Math.floor(Grape2D.Math.randFloat(min, max) + 0.5);
	},
	/** @see Math.cos */
	cos: Math.cos,
	/** @see Math.sin */
	sin: Math.sin,
	/** @see Math.tan */
	tan: Math.tan,
	/** @see Math.sqrt */
	sqrt: Math.sqrt,

	/**
	 * Clamps a number.
	 *
	 * @param  {number} x - The number to clamp.
	 * @param  {number} min - Lower limmit.
	 * @param  {number} max - Upper limit.
	 *
	 * @return {number} A number between min and max.
	 */
	clamp: function (x, min, max) {
		return x < min ? min : (x > max ? max : x);
	},

	/**
	 * Checks if two bounderies are overlaping
	 *
	 * @param  {Object} a an object with min and max properties
	 * @param  {Object} b an object with min and max properties
	 *
	 * @return {(number|boolean)} false if they're not overlaping, number if they are
	 */
	overlaps: function (a, b) {
		if (a.min <= b.min) {
			return a.max - b.min;
		} else {
			return Grape2D.Math.overlaps(b, a);
		}
	},

	sq: function(n){
		return n*n;
	}
};