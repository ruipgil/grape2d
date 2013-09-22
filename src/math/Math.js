/**
 * Math describes the namespace that holds math functions and
 *   constants. Optimizations or browser specific functions for math
 *   sshould be implemented in this namespace.
 *   A lot of material collected from {@link http://mudcu.be/journal/2011/11/bitwise-gems-and-other-optimizations/}.
 *
 * @namespace
 */
Grape2D.Math = {
	/**
	 * Value of the Euler's number.
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	E: Math.E,
	/**
	 * Value of the square root of two.
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	SQRT2: Math.SQRT2,
	/**
	 * Value of the square root of half.
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	SQRT1_2: Math.SQRT1_2,
	/**
	 * Value of .
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	LN2: Math.LN2,
	/**
	 * Value of .
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	LN10: Math.LN10,
	/**
	 * Value of .
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	LOG2E: Math.LOG2E,
	/**
	 * Value of .
	 * 
	 * @type {!number}
	 * @public
	 * @constant
	 */
	LOG10E: Math.LOG10E,
	/**
	 * PI value.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PI: Math.PI,
	/**
	 * Two PI value. Alias to <code>PI*2</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PIx2: Math.PI*2,
	/**
	 * PI/2 value. Alias to <code>PI/2</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId2: Math.PI/2,
	/**
	 * PI/4 value. Alias to <code>PI/4</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId4: Math.PI/4,
	/**
	 * PI/6 value. Alias to <code>PI/6</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId6: Math.PI/6,
	/**
	 * PI/8 value. Alias to <code>PI/8</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId8: Math.PI/8,
	/**
	 * Returns the absolute value of a number
	 *
	 * @param {!number} n Number to get the absolute.
	 * @return {!number} The absolute number.
	 * @public
	 * @static
	 */
	abs: function(n) {
		return n > 0 ? n : -n;
	},
	/**
	 * Returns the floor of a number
	 *
	 * @param  {!number} n Number to floor.
	 * @return {!number} Floored number.
	 * @public
	 * @static
	 */
	floor: function(i) {
		//return n + (n < 0 ? -1 : 0) >> 0;
		return ((i>0)?~~i:((i==~~i)?i:(~~i-1)));
	},
	/**
	 * Returns the ceil of a number
	 *
	 * @param  {!number} n Number to ceil.
	 * @return {!number} Ceiled number.
	 * @public
	 * @static
	 */
	ceil: function(a) {
		//return n + (n <= 0 ? 0 : 1) >> 0;
		return~~a == a ? a : a < 0 ? ~~a : ~~a + 1;
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
		return n + (n < 0 ? -0.5 : 0.5)>>0;
	},
	/**
	 * Rounds a number to the first decimal.
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
	 * Rounds a number to the second decimal.
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
	 * Rounds a number to the third decimal.
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
	 * Rounds a number to the fourth decimal.
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
	 * Rounds a number to the nth decimal.
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
	 * Generates a random float.
	 *
	 * @param  {!number} min Min possible value between min and
	 *   max, if max is defined. If not than it's the max value,
	 *   between 0 and min.
	 * @param  {!number=} max Max possible value, between min
	 *   and max.
	 * @return {!number} A random float number.
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
	 * Generates a random integer.
	 *
	 * @param  {!number} min Min possible value between min and max,
	 *   if max is defined. If not than it's the max value, between
	 *   0 and min.
	 * @param  {!number=} max Max possible value, between min and max.
	 * @return {!number} A random integer number
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
	/**
	 * Gets the minimum of two numbers.
	 *
	 * @param  {!number} a Number.
	 * @param  {!number} b Number.
	 * @return {!number} The minimum of the two.
	 * @public
	 * @static
	 */
	min: function(a, b){
		return (a < b) ? a : b;
	},
	/**
	 * Gets the maximum of two numbers.
	 *
	 * @param  {!number} a Number.
	 * @param  {!number} b Number.
	 * @return {!number} The maximum of the two.
	 * @public
	 * @static
	 */
	max: function(a, b){
		return (a > b) ? a : b;
	},
	/**
	 * Clamps a number.
	 *
	 * @param  {!number} x The number to clamp.
	 * @param  {!number} min Lower limit.
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