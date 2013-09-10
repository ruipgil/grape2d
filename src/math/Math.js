/**
 * Math describes the namespace that holds math functions and
 *   constants. Optimizations or browser specific functions for math
 *   sshould be implemented in this namespace.
 *
 * @namespace
 */
Grape2D.Math = {

	/**
	 * PI value, with a 15 decimal aproximation
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PI: 3.141592653589793,

	/**
	 * Two PI value, with a 15 decimal aproximation
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PIx2: 6.283185307179586,

	/**
	 * PI/2 value, with a 15 decimal aproximation
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId2: 1.5707963267948966,

	/**
	 * PI/4 value, with a 15 decimal aproximation
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId4: 0.7853981633974483,

	/**
	 * PI/6 value, with a 15 decimal aproximation
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId6: 0.5235987755982988,

	/**
	 * PI/8 value, with a 15 decimal aproximation
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId8: 0.39269908169872414,

	/**
	 * Returns the absolute value of a number
	 *
	 * @param {!number} number
	 * @return {!number} returns the absolute number
	 * @public
	 * @static
	 */
	abs: function(number) {
		return Math.abs(number);
	},
	/**
	 * Returns the floor of a number
	 *
	 * @param  {!number} n the number
	 * @return {!number} the floored number
	 * @public
	 * @static
	 */
	floor: function(n) {
		return~~ n;
	},
	/**
	 * Returns the ceil of a number
	 *
	 * @param  {!number} n the number
	 * @return {!number} the ceiled number
	 */
	ceil: function(n) {
		return Math.ceil(n);
	},
	/**
	 * Rounds a number to the unit.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	round: function(n) {
		if (n >= 0) {
			return~~ (n + 0.5);
		} else {
			return~~ (n - 0.5);
		}
	},
	/**
	 * Rounds a number to first decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundOne: function(n){
		return Grape2D.Math.round(n*10)*0.1;
	},
	/**
	 * Rounds a number to second decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundTwo: function(n){
		return Grape2D.Math.round(n*100)*0.01;
	},
	/**
	 * Rounds a number to third decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundThree: function(n){
		return Grape2D.Math.round(n*1000)*0.001;
	},
	/**
	 * Rounds a number to fourth decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundFour: function(n){
		return Grape2D.Math.round(n*10000)*0.0001;
	},
	/**
	 * Rounds a number to nth decimal.
	 *
	 * @param  {!number} number Number to round.
	 * @param  {!number} n Decimals to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundN: function(number, n){
		var f = Grape2D.Math.pow(2, 10);
		return Grape2D.Math.round(n*f)/f;
	},
	/**
	 * Get a random float
	 *
	 * @param  {!number} min the min possible value between min and
	 *   max, if max is defined. If not than it's the max value,
	 *   between 0 and min.
	 * @param  {?number} max optional, the max possible value, between
	 *   min and max.
	 * @return {!number} a random float number.
	 * @public
	 * @static
	 */
	randFloat: function(min, max) {
		if (!max) {
			return Math.random() * min;
		} else {
			return min + Math.random() * (max - min);
		}
	},
	/**
	 * Get a random float
	 *
	 * @param  {!number} min the min possible value between min and max,
	 *   if max is defined. If not than it's the max value, between
	 *   0 and min.
	 * @param  {?number} max optional, the max possible value, between
	 *   min and max.
	 * @return {!number} a random integer number
	 * @public
	 * @static
	 */
	randInt: function(min, max) {
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
	/** @see Math.pow */
	pow: Math.pow,
	/** @see Math.min */
	min: Math.min,
	/** @see Math.max */
	max: Math.max,

	/**
	 * Clamps a number.
	 *
	 * @param  {!number} x The number to clamp.
	 * @param  {!number} min Lower limmit.
	 * @param  {!number} max Upper limit.
	 * @return {!number} A number between min and max.
	 * @public
	 * @static
	 */
	clamp: function(x, min, max) {
		return x < min ? min : (x > max ? max : x);
	},

	/**
	 * Checks if two bounderies are overlaping
	 *
	 * @param  {!Object} a an object with min and max properties
	 * @param  {!Object} b an object with min and max properties
	 * @return {!number} A positive number if they're overlaping. Zero
	 *   if they're just in touch, negative number if they're not
	 *   overlaping.
	 * @public
	 * @static
	 */
	overlaps: function(a, b) {
		if (a.min <= b.min) {
			return a.max - b.min;
		} else {
			return Grape2D.Math.overlaps(b, a);
		}
	},
	/**
	 * Squares a number.
	 *
	 * @param  {!number} n Number to square
	 * @return {!number} NUmber squared
	 * @public
	 * @static
	 */
	sq: function(n) {
		return n * n;
	}
};