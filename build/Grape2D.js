(function(){ try{ NODE = window; NODE = false; }catch(e){ NODE = true; }
/**
 * @type {!boolean}
 */
var NODE;
/**
 * This is the main namespace.
 * 
 * @namespace
 * @public
 */
var Grape2D = {
	/**
	 * Grape2D's version. It follows the {@link http://semver.org/} protocol.
	 *
	 * @type {string}
	 * @public
	 * @constant
	 */
	version: '1.3.0-alpha',
	/**
	 * Constant that indicates if its not running in the browser.
	 *   False if it's not, true if it is. This is "redeclared"
	 *   to avoid <code>variable NODE is undeclared</code>
	 *   type warnings at compile time.
	 *
	 * @type {!boolean}
	 * @public
	 */
	NODE: NODE,
	/**
	 * Window object. This is an empty object if the <code>window</code>
	 *   variable is not defined.
	 *
	 * @type {!(Object|Window)}
	 * @public
	 * @constant
	 */
	WINDOW: (NODE?{}:window),
};
/**
 * This is a modified version of the requestAnimationFrame and cancelAnimationFrame polyfill
 *   {@link https://gist.github.com/paulirish/1579671}
 *   {@link http://paulirish.com/2011/requestanimationframe-for-smart-animating/}
 *   {@link http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating}
 *   requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel.
 *   Under the MIT license.
 */
(function(w) {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
		w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
		w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!w.requestAnimationFrame) {
		w.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!w.cancelAnimationFrame){
		w.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}(Grape2D.WINDOW));
/**
 * Browser independent utils
 *
 * @namespace
 */
Grape2D.utils = {
	/**
	 * Gets the document size, or by other words the size of the screen,
	 *   as an object with width and height properties.
	 * This is the maximum size of the "drawing surface".
	 * 
	 * @return {!Object} the object with the width and height of the
	 *   document
	 * @public
	 * @static
	 */
	getDocumentSize: function() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	},
	/**
	 * Requests an animation frame.
	 *
	 * @param  {!Function} fn Callback function.
	 * @return {!number} Request ID.
	 * @public
	 * @static
	 */
	requestAnimationFrame: function(fn){
		if(Grape2D.NODE){
			return Grape2D.WINDOW.requestAnimationFrame(fn);
		}else{
			return requestAnimationFrame(fn);
		}
	},
	/**
	 * Cancels an animation frame request.
	 *
	 * @param  {!number} op Animation frame request ID.
	 * @public
	 * @static
	 * 
	 * @suppress {undefinedVars}
	 */
	cancelAnimationFrame: function(op){
		if(Grape2D.NODE){
			return Grape2D.WINDOW.cancelAnimationFrame(op);
		}else{
			return cancelAnimationFrame(op);
		}
	},
};
/**
 * Clock is used to keep count of the time elapse between
 *   game frames.
 *
 * @constructor
 */
Grape2D.utils.Clock = function () {
	this.frameCount = 0;
	this.start = new Date().getTime();
	this.end = this.start;
	this.lastFrame = this.start;
	this.fps = 0;
	this.timeEl = 0;
};

Grape2D.utils.Clock.prototype = {
	constructor: Grape2D.utils.Clock,
	/**
	 * Updates the game. Should be at the beggining
	 *   of the frame.
	 *
	 * @return {!number} Time, in miliseconds, elapsed
	 *   since the last update.
	 * @public
	 */
	update: function () {
		var now = new Date().getTime(),
			t = now - this.lastFrame;

		this.frameCount++;
		this.timeEl+=t;

		if (this.timeEl >= 1000) {
			this.reset(now);
		}

		this.lastFrame = now;
		return t;
	},
	/**
	 * Resets all properties, at least at each
	 *   second passed.
	 *
	 * @param  {!number} time Current time.
	 * @private
	 */
	reset: function (time) {
		this.fps = this.frameCount;
		this.timeEl = 0;
		this.frameCount = 0;
		this.end = time;
	},
	/**
	 * Gets the current time in miliseconds.
	 *
	 * @return {!number} Current time.
	 * @public
	 */
	getTime: function(){
		return new Date().getTime();
	},
	/**
	 * Gets the current fps count.
	 *
	 * @return {!number} Fps count.
	 * @public
	 */
	getFps: function(){
		return this.fps;
	}
};
/**
 * A synchronized clock can keep the same time generation as,
 *   for example, a remote server.
 *
 * @extends {Grape2D.utils.Clock}
 * @constructor
 */
Grape2D.utils.SynchronizedClock = function() {
	Grape2D.utils.Clock.call(this);
	/**
	 * Time diference between clocks.
	 *
	 * @type {!number}
	 * @private
	 */
	this.deltaSync = 0;
};

Grape2D.utils.SynchronizedClock.prototype = Object.create(Grape2D.utils.Clock.prototype);
/**
 * @override
 */
Grape2D.utils.SynchronizedClock.prototype.getTime = function() {
	return Grape2D.utils.Clock.prototype.getTime.call(this) - this.deltaSync;
};
/**
 * Synchronizes this clock with a remote clock, based on the
 *   time difference.
 *
 * @param  {!number} syncTime Time difference between clocks.
 * @public
 */
Grape2D.utils.SynchronizedClock.prototype.sync = function(syncTime) {
	this.deltaSync = syncTime;
};
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
/**
 * Describes a math vector in the cartesian space (2D).
 *   This is also very useful and may be used to represent
 *   points.
 *
 * @param  {number=} x The x component
 * @param  {number=} y The y component
 *
 * @constructor
 */
Grape2D.Vector = function(x, y) {
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
	 * Gets the x component of the vector.
	 *
	 * @return {!number} The x component.
	 * @public
	 */
	getX: function() {
		return this.x;
	},
	/**
	 * Sets the x component of the vector.
	 *
	 * @param  {!number} x The new value.
	 * @public
	 */
	setX: function(x) {
		this.x = x;
	},
	/**
	 * Gets the y component of the vector.
	 *
	 * @return {!number} The y component.
	 * @public
	 */
	getY: function() {
		return this.y;
	},
	/**
	 * Sets the y component of the vector.
	 *
	 * @param  {!number} y The new value.
	 * @public
	 */
	setY: function(y) {
		this.y = y;
	},
	/**
	 * Sets this vector with the same components of another one.
	 *
	 * @param  {!Grape2D.Vector} vector The vector to copy.
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	set: function(vector) {
		this.x = vector.x;
		this.y = vector.y;
		return this;
	},
	/**
	 * Adds the components of another vector to this.
	 *
	 * @param  {!Grape2D.Vector} vector The vector to add.
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	add: function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	},
	/**
	 * Subtracts the components of another vector to this.
	 *
	 * @param  {!Grape2D.Vector} vector The vector to subtract.
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	sub: function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	},
	/**
	 * Multiplies components by a scalar.
	 *
	 * @param  {!number} scalar The number to multiply.
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	multiplyByScalar: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	},
	/**
	 * Divides components by a scalar.
	 *
	 * @param  {!number} scalar The number to divide.
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	divideByScalar: function(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	},
	/**
	 * Inverts the components of the vector. It's the same as
	 *   multiply by -1.
	 *
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	negate: function() {
		return this.multiplyByScalar(-1);
	},
	/**
	 * Normalizes the vector. So that each component have a value
	 *   between 0 and 1.
	 *
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	normalize: function() {
		return this.divideByScalar(this.getMagnitude());
	},
	/**
	 * Gets the magnitude (length) of a vector.
	 *
	 * @return {!number} The magnitude of the vector.
	 * @public
	 */
	getMagnitude: function() {
		return Grape2D.Math.sqrt(this.x * this.x + this.y * this.y);
	},
	/**
	 * {@see Grape2D.Vector.getMagnitude}
	 * @public
	 */
	length: function() {
		return this.getMagnitude();
	},
	/**
	 * Gets the length of the vector, before the calculation of its
	 *   square root.
	 *
	 * @return {!number} The length squared.
	 * @public
	 */
	lengthSquared: function() {
		return this.x * this.x + this.y * this.y;
	},
	/**
	 * Gets the angle that the vector makes with the x axis.
	 *
	 * @return {!number} The angle.
	 * @public
	 */
	getAngle: function() {
		var angle = 1;
		if (this.y < 0) {
			angle = -1;
		}
		return Math.acos(this.x / this.length()) * angle;
	},
	/**
	 * Gets the dot product of this and another vector.
	 *
	 * @param  {!Grape2D.Vector} vector Another vector.
	 * @return {!number} The dot product.
	 * @public
	 */
	dot: function(vector) {
		return this.x * vector.x + this.y * vector.y;
	},
	/**
	 * Projects this vector into other. This operation
	 *   don't changes the values of the objects.
	 *
	 * @param  {!Grape2D.Vector} vector The vector to project onto.
	 * @return {!Grape2D.Vector} The vector resulting from the
	 *   projection.
	 * @public
	 */
	project: function(vector) {
		var dp = this.dot(vector),
			proj = new Grape2D.Vector();
		proj.x = dp * vector.x;
		proj.y = dp * vector.y;
		return proj;
	},
	/**
	 * Calculates the right normal of the vector.
	 *
	 * @return {!Grape2D.Vector} The right normal vector.
	 * @public
	 */
	rightNormal: function() {
		return new Grape2D.Vector(-this.y, this.x);
	},
	/**
	 * Checks if two vectors are parallel.
	 *
	 * @param  {!Grape2D.Vector} vector vector to check.
	 * @return {!boolean} true if the vector is parallel to
	 *   this one, false otherwise.
	 * @public
	 */
	isParallelTo: function(vector) {
		return Grape2D.Math.abs(vector.x) == Grape2D.Math.abs(this.x) && Grape2D.Math.abs(vector.y) == Grape2D.Math.abs(this.y);
	},
	/**
	 * Calculates the distance between this and another vector
	 *
	 * @param  {!Grape2D.Vector} vector The other vector.
	 * @return {!number} The distance.
	 * @public
	 */
	distanceTo: function(vector) {
		return Grape2D.Math.sqrt(Grape2D.Math.sq(vector.x - this.x) + Grape2D.Math.sq(vector.y - this.y));
	},
	/**
	 * Calculates the squared distace between this and another vector.
	 *
	 * @param  {!Grape2D.Vector} vector The other vector.
	 * @return {!number} The distance squared.
	 * @public
	 */
	sqDistanceTo: function(vector) {
		return vector.x * this.x + vector.y * this.y;
	},
	/**
	 * Positive distance between the x coordinates this vector an
	 *   another one.
	 *
	 * @param  {!Grape2D.Vector} vector A vector.
	 * @return {!number} Positive distance of the x coordinate.
	 * @public
	 */
	xDistanceTo: function(vector) {
		if (this.x > vector.x) {
			return Grape2D.Math.abs(this.x - vector.x);
		} else {
			return Grape2D.Math.abs(vector.x - this.x);
		}
	},
	/**
	 * Positive distance between the y coordinates this vector an
	 *   another one.
	 *
	 * @param  {!Grape2D.Vector} vector A vector.
	 * @return {!number} Positive distance of the y coordinate.
	 * @public
	 */
	yDistanceTo: function(vector) {
		if (this.y > vector.y) {
			return Grape2D.Math.abs(this.y - vector.y);
		} else {
			return Grape2D.Math.abs(vector.y - this.y);
		}
	},
	/**
	 * Checks if the components of one vector are equal to the
	 *   components to another one.
	 *
	 * @param  {!Grape2D.Vector} vector The other vector.
	 * @return {!boolean} True if they're components are not equal.
	 * @public
	 */
	equals: function(vector) {
		return this.x == vector.x && this.y == vector.y;
	},
	/**
	 * Creates a new vector with the same components.
	 *
	 * @return {!Grape2D.Vector} a new vector with the same components
	 *   as this one.
	 * @public
	 */
	clone: function() {
		return new Grape2D.Vector(this.x, this.y);
	},
	/**
	 * Creates a string for this class.
	 *
	 * @return {!string} A string representing this class.
	 * @public
	 */
	toString: function() {
		return "Grape2D.Vector (" + this.x + "," + this.y + ")";
	},
	/**
	 * Applies the result of a given function, where the component is
	 *   an argument, to the respective component. This can be useful
	 *   to minimize code or just simplify it. As an example, <code>
	 *   someVector.use(Grape.Math.sqrt)</code>
	 *
	 * @param  {!Function} fn A function that receives a number and
	 *   returns a number.
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	use: function(fn) {
		this.x = fn(this.x);
		this.y = fn(this.y);
		return this;
	},
	/**
	 * Resets the vector coordinates to 0.
	 *
	 * @return {!Grape2D.Vector} This vector.
	 * @public
	 */
	reset: function() {
		this.x = 0;
		this.y = 0;
		return this;
	},
	/**
	 * Gets the type of the object. This is used by the collision
	 *   dispatcher.
	 *
	 * @return {!string} Type.
	 */
	getStaticType: function() {
		return Grape2D.Vector.STATIC_TYPE;
	},
	/**
	 * Gets if both x and y coordinates are zero.
	 *
	 * @return {!boolean} True if the coordinates are zero.
	 * @public
	 */
	isZero: function() {
		return this.x == 0 && this.y == 0;
	}
};

/**
 * Creates a vector from two points (points are represented as vectors).
 *
 * @param  {!Grape2D.Vector} a One point.
 * @param  {!Grape2D.Vector} b Another point.
 * @return {!Grape2D.Vector} Vector with direction from a to b.
 * @public
 * @static
 */
Grape2D.Vector.createFromPoints = function(a, b) {
	return new Grape2D.Vector(b.x - a.x, b.y - a.y);
};
/**
 * Creates a vector from an angle and magnitude.
 *
 * @param  {!number} angle angle of the vector against the x axis.
 * @param  {!number} magnitude magnitude (length) of the vector.
 * @return {!Grape2D.Vector} vector with the given angle and magnitude.
 * @public
 * @static
 */
Grape2D.Vector.createFromAngle = function(angle, magnitude) {
	return new Grape2D.Vector(magnitude * Grape2D.Math.cos(angle), magnitude * Grape2D.Math.sin(angle));
};
/**
 * Linear interpolation between two vectors.
 *
 * @param  {!Grape2D.Vector} start Start interpolation position.
 * @param  {!Grape2D.Vector} end End interpolation position.
 * @param  {!number} prc Percentage of the interpolation.
 * @return {!Grape2D.Vector} Interpolated vector.
 * @public
 */
Grape2D.Vector.lerp = function(start, end, prc) {
	return start.clone().add(end.clone().sub(start).multiplyByScalar(prc));
};
/**
 * Type as a string.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.Vector.STATIC_TYPE = "Vector";
/**
 * Matrix defines a 3x3 matrix indicated to deal with 2D operations.
 *   If it's instantiated with no arguments then, it becomes the
 *   identity matrix.
 *
 * @param  {!number=} aa Element of the first row and first line.
 * @param  {!number=} ab Element of the second row and first line.
 * @param  {!number=} ac Element of the third row and first line.
 * @param  {!number=} ba Element of the first row and second line.
 * @param  {!number=} bb Element of the second row and second line.
 * @param  {!number=} bc Element of the third row and second line.
 * @param  {!number=} ca Element of the first row and third line.
 * @param  {!number=} cb Element of the second row and third line.
 * @param  {!number=} cc Element of the third row and third line.
 *
 * @constructor
 */
Grape2D.Matrix = function(aa, ab, ac, ba, bb, bc, ca, cb, cc) {
	/**
	 * Matrix elements.
	 *
	 * @type {!Array.<number>}
	 * @public
	 */
	this.v = [];
	if (aa !== undefined) {
		this.v = [aa, ab, ac, ba, bb, bc, ca, cb, cc];
	} else {
		this.identity();
	}
};

Grape2D.Matrix.prototype = {
	constructor: Grape2D.Matrix,
	/**
	 * Sets the matrix with new elements.
	 *
	 * @param  {!number=} aa Element of the first row and first line.
	 * @param  {!number=} ab Element of the second row and first line.
	 * @param  {!number=} ac Element of the third row and first line.
	 * @param  {!number=} ba Element of the first row and second line.
	 * @param  {!number=} bb Element of the second row and second line.
	 * @param  {!number=} bc Element of the third row and second line.
	 * @param  {!number=} ca Element of the first row and third line.
	 * @param  {!number=} cb Element of the second row and third line.
	 * @param  {!number=} cc Element of the third row and third line.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	set: function(aa, ab, ac, ba, bb, bc, ca, cb, cc) {
		var tv = this.v;
		tv[0] = tv[4] = tv[8] = 1;
		tv[1] = tv[2] = tv[3] = tv[5] = tv[6] = tv[7] = 0;
		return this;
	},
	/**
	 * Adds to this matrix another one.
	 *
	 * @param  {Grape2D.Matrix} matrix Matrix to add.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	add: function(matrix) {
		for (var i = 0; i < 9; i++)
			this.v[i] += matrix.v[i];
		return this;
	},
	/**
	 * Sets this matrix as the identity matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	identity: function() {
		this.v = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		return this;
	},
	/**
	 * Inverts the matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	invert: function() {
		var det = this.determinant(),
			v = this.v;
		this.v = [
			v[4] * v[8] - v[5] * v[7],
			v[2] * v[7] - v[1] * v[8],
			v[1] * v[5] - v[2] * v[4],

			v[5] * v[6] - v[8] * v[3],
			v[0] * v[8] - v[2] * v[6],
			v[2] * v[3] - v[0] * v[5],

			v[3] * v[7] - v[4] * v[6],
			v[1] * v[6] - v[0] * v[7],
			v[0] * v[4] - v[1] * v[3]
		];
		return this.multiplyByScalar(1 / det);
	},
	/**
	 * Computes the determinant of the matrix.
	 *
	 * @return {!number} Determinant.
	 * @public
	 */
	determinant: function() {
		var tv = this.v;
		return tv[0] * (tv[4] * tv[8] - tv[5] * tv[7]) - tv[1] * (tv[3] * tv[8] - tv[5] * tv[6]) + tv[2] * (tv[3] * tv[7] - tv[4] * tv[6]);
	},
	/**
	 * Multiplies by a vector. Since Grape2D doesn't support 3D vectors
	 *   the third element of the vector is 1.
	 *
	 * @param  {!Grape2D.Vector} v Vector to multiply by.
	 * @return {!Grape2D.Vector} A new vector, result of the
	 *   multiplication.
	 * @public
	 */
	multiplyByVector: function(v) {
		return new Grape2D.Vector(
			this.v[0] * v.getX() + this.v[1] * v.getY() + this.v[2],
			this.v[3] * v.getX() + this.v[4] * v.getY() + this.v[5]
		);
	},
	/**
	 * Multiplies by a scalar number.
	 *
	 * @param  {!number} scalar Scalar to multiply by.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	multiplyByScalar: function(scalar) {
		this.v[0] *= scalar;
		this.v[1] *= scalar;
		this.v[2] *= scalar;

		this.v[3] *= scalar;
		this.v[4] *= scalar;
		this.v[5] *= scalar;

		this.v[6] *= scalar;
		this.v[7] *= scalar;
		this.v[8] *= scalar;
		return this;
	},
	/**
	 * Multiplies by other matrix.
	 *
	 * @param  {!Grape2D.Matrix} matrix Matrix to multiply by.
	 * @return {!Grape2D.Matrix} The new matrix, result of the
	 *   multiplication.
	 * @public
	 */
	multiplyByMatrix: function(matrix) {
		var v = this.v,
			m = matrix.v,
			aa = v[0] * m[0] + v[1] * m[3] + v[2] * m[6],
			ab = v[0] * m[1] + v[1] * m[4] + v[2] * m[7],
			ac = v[0] * m[2] + v[1] * m[5] + v[2] * m[8],
			ba = v[3] * m[0] + v[4] * m[3] + v[5] * m[6],
			bb = v[3] * m[1] + v[4] * m[4] + v[5] * m[7],
			bc = v[3] * m[2] + v[4] * m[5] + v[5] * m[8],
			ca = v[6] * m[0] + v[7] * m[3] + v[8] * m[6],
			cb = v[6] * m[1] + v[7] * m[4] + v[8] * m[7],
			cc = v[6] * m[2] + v[7] * m[5] + v[8] * m[8];

		return new Grape2D.Matrix(
			aa, ab, ac,
			ba, bb, bc,
			ca, cb, cc
		);
	},
	/**
	 * Transposes the matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	transpose: function() {
		var tmp, m = this.v;
		tmp = m[1];
		m[1] = m[3];
		m[3] = tmp;
		tmp = m[2];
		m[2] = m[6];
		m[6] = tmp;
		tmp = m[5];
		m[5] = m[7];
		m[7] = tmp;

		return this;
	},
	/**
	 * Clones the matrix. Instantiating another one with the same
	 *   elements.
	 *
	 * @return {!Grape2D.Matrix} Equivalent matrix.
	 * @public
	 */
	clone: function() {
		return new Grape2D.Matrix(this.v[0], this.v[1], this.v[2], this.v[3], this.v[4], this.v[5], this.v[6], this.v[7], this.v[8]);
	},
	/**
	 * Represents the matrix as a string.
	 *
	 * @return {!string} Matrix as a string.
	 * @public
	 */
	toString: function() {
		return "Grape2D.Matrix\n" + this.v[0] + " " + this.v[1] + " " + this.v[2] + "\n" +
			this.v[3] + " " + this.v[4] + " " + this.v[5] + "\n" +
			this.v[6] + " " + this.v[7] + " " + this.v[8];
	}

};
/**
 * Renderers are used to render graphics to the screen.
 *
 * @class
 * @interface
 */
Grape2D.Renderer = function() {};

Grape2D.Renderer.prototype = {
	constructor: Grape2D.Renderer,
	/**
	 * Gets the renderer width.
	 *
	 * @return {!number} the width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width of the renderer.
	 *
	 * @return {!number} the half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width of the renderer and computes the half width.
	 *
	 * @param  {!number} width the width
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets the renderer height
	 *
	 * @return {!number} the height
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height of the renderer
	 *
	 * @return {!number} the half width
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height of the renderer and computes the half height.
	 *
	 * @param  {!number} height the new height
	 * @public
	 */
	setHeight: function(height) {},
	/**
	 * Renders a texture to a position on the renderer.
	 *
	 * @param  {!Grape2D.ITexture} texture The texture to render
	 * @param  {!Grape2D.Vector} position The position to render
	 * @public
	 */
	renderTexture: function(texture, position) {},
	/**
	 * Renders an object to the renderer.
	 *
	 * @param  {!Grape2D.Object2D} obj Object to render.
	 * @param  {!Grape2D.Camera} camera Camera to transform the coordinates.
	 * @public
	 */
	renderObject2D: function(obj, camera) {},
	/**
	 * Renders an network object to the renderer.
	 *
	 * @param  {!Grape2D.NetworkObject2D} obj Network object.
	 * @param  {!Grape2D.Vector} pos Lerped position of the object.
	 * @param  {!Grape2D.Camera} camera Camera to transform the coordinates.
	 * @public
	 */
	renderNetworkObject2D: function(obj, pos, camera) {},
	/**
	 * Renders an image to the screen
	 *
	 * @param  {!Image} image DOM image.
	 * @param  {!number} sx Start x coordinate of the image to render.
	 * @param  {!number} sy Start y coordinate of the image to render.
	 * @param  {!number} sw Width of the image to render.
	 * @param  {!number} sh Height of the image to render.
	 * @param  {!number} dx Start x coordinate in the renderer, for the image.
	 * @param  {!number} dy Start y coordinate in the renderer, for the image.
	 * @param  {!number} dw Width of the image in the renderer.
	 * @param  {!number} dh Height of the image in the renderer.
	 * @public
	 */
	renderImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {},
	/**
	 * Renders the wireframe of an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb The AABB to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the
	 *   coordinates.
	 * @public
	 */
	renderAABB: function(aabb, camera) {},
	/**
	 * Renders the wireframe of a circle.
	 *
	 * @param  {!Grape2D.Circle} circle Circle to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the
	 *   coordinates.
	 * @public
	 */
	renderCircle: function(circle, camera) {},
	/**
	 * Renders the wireframe of a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the
	 *   coordinates.
	 * @public
	 */
	renderPolygon: function(polygon, camera) {},
	/**
	 * Renders text to the renderer.
	 *
	 * @param  {!string} text Text to render.
	 * @param  {!Grape2D.Vector} position Top left corner of the text.
	 * @public
	 */
	renderText: function(text, position) {},
	/**
	 * Prepares a render cycle. This method should be called once, at
	 *   the begining of the rendering cycle.
	 * @public
	 */
	start: function() {},
	/**
	 * Commits everything to render. This method should be called once,
	 *   at the end of the rendering cycle.
	 * @public
	 */
	end: function() {},
	/**
	 * Appends the renderer to a DOM element.
	 *
	 * @param  {!Element} elm The element to append to.
	 * @public
	 */
	appendToDOMElement: function(elm) {},
	/**
	 * Gets the renderer DOM element.
	 *
	 * @return {!Element} Element
	 * @public
	 */
	getDOMElement: function() {},
	/**
	 * Sets a new stroke color.
	 *
	 * @param  {!string} color New color to use when stroking.
	 * @public
	 */
	setStrokeColor: function(color) {},
	/**
	 * Sets a new fill color.
	 *
	 * @param  {!string} color New color to use when filling.
	 * @public
	 */
	setFillColor: function(color) {},
	/**
	 * Renders a particle to the renderer.
	 *
	 * @param  {!Grape2D.Particle} particle Particle to render.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 */
	renderParticle: function(particle, camera) {},
	/**
	 * Sets the text font.
	 *
	 * @param {!string} font Text font.
	 * @public
	 */
	setTextFont: function(font) {},
	/**
	 * Renders a line segment to the renderer.
	 *
	 * @param  {!Grape2D.Vector} start Start position of the line.
	 * @param  {!Grape2D.Vector} end End position of the line.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 */
	renderLineSegment: function(start, end, camera) {},
	/**
	 * Renders a point to the renderer.
	 *
	 * @param  {!Grape2D.Vector} point Point position.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 */
	renderPoint: function(point, camera) {}
};
/**
 * This is a simple abstraction of the canvas object,
 *   may be used to do some optimizations.
 *
 * @constructor
 */
Grape2D.Canvas = function(options) {
	options = options || {};
	/**
	 * Canvas DOM element.
	 *
	 * @type {!Element}
	 * @private
	 */
	this.canvas = document.createElement("Canvas");
	this.canvas.width = options.width || 300;
	this.canvas.height = options.height || 150;
	/**
	 * Half width of the canvas.
	 *
	 * @type {!number}
	 * @private
	 */
	this.halfWidth = this.canvas.width / 2;
	/**
	 * Half height of the canvas.
	 *
	 * @type {!number}
	 * @private
	 */
	this.halfHeight = this.canvas.height / 2;
	/**
	 * Context of the canvas.
	 *
	 * @type {!CanvasRenderingContext2D}
	 * @private
	 */
	this.context = this.canvas.getContext("2d");
};

Grape2D.Canvas.prototype = {
	/**
	 * Gets canvas width.
	 *
	 * @return {!number} Canvas width.
	 */
	getWidth: function() {
		return this.canvas.width;
	},
	/**
	 * Gets canvas half width.
	 *
	 * @return {!number} Canvas half width.
	 */
	getHalfWidth: function() {
		return this.halfWidth;
	},
	/**
	 * Sets canvas width.
	 *
	 * @param  {!number} width New canvas width.
	 */
	setWidth: function(width) {
		this.canvas.width = width;
		this.halfWidth = width / 2;
	},
	/**
	 * Gets canvas height.
	 *
	 * @return {!number} Canvas height.
	 */
	getHeight: function() {
		return this.canvas.height;
	},
	/**
	 * Gets canvas half height.
	 *
	 * @return {!number} Canvas half height.
	 */
	getHalfHeight: function() {
		return this.halfHeight;
	},
	/**
	 * Sets canvas height.
	 *
	 * @param  {!number} height New canvas height.
	 */
	setHeight: function(height) {
		this.canvas.height = height;
		this.halfHeight = height / 2;
	},
	// Canvas element
	/**
	 * @public
	 */
	toDataURL: function(type, args) {
		return this.canvas.toDataURL(type, args);
	},
	/**
	 * Gets canvas context.
	 *
	 * @return {!CanvasRenderingContext2D} Canvas context.
	 */
	getContext: function() {
		return this.context;
	},
	// 2D Context
	/**
	 * Saves the state of the canvas.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	save: function() {
		this.context.save();
		return this;
	},
	/**
	 * Restores a saved state.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	restore: function() {
		this.context.restore();
		return this;
	},
	// Transformations
	/**
	 * Scales the canvas. Not the DOM element. Equivalent
	 *   to apply a scale matrix.
	 *
	 * @param  {!number} x X scale.
	 * @param  {!number} y Y scale.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	scale: function(x, y) {
		this.context.scale(x, y);
		return this;
	},
	/**
	 * Rotates the canvas. Not the DOM element. Equivalent
	 *   to apply a rotation matrix.
	 *
	 * @param  {!number} angle Angle to rotate.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	rotate: function(angle) {
		this.context.rotate(angle);
		return this;
	},
	/**
	 * Translate the canvas. Not the DOM element. Equivalent
	 *   to apply a translation matrix.
	 *
	 * @param  {!number} x Translation in the X axis.
	 * @param  {!number} y Translation in the Y axis.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	translate: function(x, y) {
		this.context.translate(x, y);
		return this;
	},
	/**
	 * Sets a transformation matrix.
	 *
	 * @param  {!number} m11 Element.
	 * @param  {!number} m12 Element.
	 * @param  {!number} m21 Element.
	 * @param  {!number} m22 Element.
	 * @param  {!number} dx Element.
	 * @param  {!number} dy Element.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	transform: function(m11, m12, m21, m22, dx, dy) {
		this.context.transform(m11, m12, m21, m22, dx, dy);
		return this;
	},
	// Image drawing
	/**
	 * Draws an image to the canvas.
	 *
	 * @param {!(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)}
	 *   image Image to draw.
	 * @param {!number} dx Destination x
	 * @param {!number} dy Destination y
	 * @param {!number} dw Destination width
	 * @param {!number} dh Destination height
	 * @param {!number} sx Source x
	 * @param {!number} sy Source y
	 * @param {!number} sw Source width
	 * @param {!number} sh Source height
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		return this;
	},
	// Compositing
	/**
	 * Sets the global alpha property.
	 *
	 * @param  {!number} value New alpha value.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setGlobalAlpha: function(value) {
		this.context.globalAlpha = value;
		return this;
	},
	/**
	 * Performs a composition operation, according to a flag. The
	 *   available flags are:
	 *   <ul>
	 *   <li>source-over
	 *   <li>source-in
	 *   <li>source-out
	 *   <li>source-atop
	 *   <li>destination-over
	 *   <li>destination-in
	 *   <li>destination-out
	 *   <li>destination-atop
	 *   <li>lighter
	 *   <li>copy
	 *   <li>xor
	 *
	 * @param  {!string} flag An valid flag.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	globalCompositeOperation: function(flag) {
		this.context.globalCompositeOperation = flag;
		return this;
	},
	// Lines
	/**
	 * Sets the line width
	 *
	 * @param  {!number} value New line width value.s
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setLineWidth: function(value) {
		this.context.lineWidth = value;
		return this;
	},
	/**
	 * Sets the type of line cap. The available options are:
	 *   <ul>
	 *   <li>butt
	 *   <li>round
	 *   <li>square
	 *
	 * @param  {!string} value A valid line cap option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setLineCap: function(value) {
		this.context.lineCap = value;
		return this;
	},
	/**
	 * Sets the line join. The available options are:
	 *   <ul>
	 *   <li>round
	 *   <li>bevel
	 *   <li>miter
	 *
	 * @param  {!string} value A valid line join option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setLineJoin: function(value) {
		this.context.lineJoin = value;
		return this;
	},
	/**
	 * Sets the miter limit.
	 *
	 * @param  {!number} value Miter limit value.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setMiterLimit: function(value) {
		this.context.miterLimit = value;
		return this;
	},
	/** Colors **/
	/**
	 * Sets the stroke style.
	 *
	 * @param  {!string} value Stroke color. In a valid CSS3 format.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setStrokeStyle: function(value) {
		this.context.strokeStyle = value;
		return this;
	},
	/**
	 * Sets the fill style.
	 *
	 * @param  {!string} value Fill color. In a valid CSS3 format.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setFillStyle: function(value) {
		this.context.fillStyle = value;
		return this;
	},
	/**
	 * Sets the shadow offset in the x axis.
	 *
	 * @param  {!number} value Shadow offset, at the x axis
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowOffsetX: function(value) {
		this.context.shadowOffsetX = value;
		return this;
	},
	/**
	 * Sets the shadow offset in the y axis.
	 *
	 * @param  {!number} value Shadow offset, at the y axis.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowOffsetY: function(value) {
		this.context.shadowOffsetY = value;
		return this;
	},
	/**
	 * Sets the shadow blur value.
	 *
	 * @param  {!number} value Shadow blur.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowBlur: function(value) {
		this.context.shadowBlur = value;
		return this;
	},
	/**
	 * Sets the shadow color.
	 *
	 * @param  {!string} value Shadow color in a valid CSS3 format.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowColor: function(value) {
		this.context.shadowColor = value;
		return this;
	},
	/**
	 * Creates a line gradient in the canvas.
	 *
	 * @param  {!number} x0 Start x.
	 * @param  {!number} y0 Start y.
	 * @param  {!number} x1 End x.
	 * @param  {!number} y1 End y.
	 * @return {?CanvasGradient} Result gradient.
	 */
	createLinearGradient: function(x0, y0, x1, y1) {
		return this.context.createLinearGradient(x0, y0, x1, y1);
	},
	/**
	 * Creates a radial gradient.
	 *
	 * @param  {!number} x0 X.
	 * @param  {!number} y0 Y.
	 * @param  {!number} r0 Radius.
	 * @param  {!number} x1 X.
	 * @param  {!number} y1 Y.
	 * @param  {!number} r1 Radius.
	 * @return {?CanvasGradient} Result gradient.
	 */
	createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
		return this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
	},
	/**
	 * Creates a pattern. There are 4 available options:
	 *   <ul>
	 *   <li>repeat
	 *   <li>repeat-x
	 *   <li>repeat-y
	 *   <li>no-repeat
	 *
	 * @param  {?(HTMLImageElement|HTMLCanvasElement)}
	 *   image Image
	 * @param  {!string} repetition Valid repetition.
	 * @return {?CanvasPattern} Result pattern.
	 */
	createPattern: function(image, repetition) {
		return this.context.createPattern(image, repetition);
	},
	// Paths
	/**
	 * Starts a path.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	beginPath: function() {
		this.context.beginPath();
		return this;
	},
	/**
	 * Closes a path.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	closePath: function() {
		this.context.closePath();
		return this;
	},
	/**
	 * Fills the canvas.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	fill: function() {
		this.context.fill();
		return this;
	},
	/**
	 * Stroke the canvas.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	stroke: function() {
		this.context.stroke();
		return this;
	},
	/**
	 * Clips the canvas
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	clip: function() {
		this.context.clip();
		return this;
	},
	/**
	 * Moves to a position to start a line/shape.
	 *
	 * @param  {!number} x X coordinate.
	 * @param  {!number} y Y coordinate.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	moveTo: function(x, y) {
		this.context.moveTo(x, y);
		return this;
	},
	/**
	 * Creates a line to a position.
	 *
	 * @param  {!number} x End x coordinate.
	 * @param  {!number} y End y coordinate.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	lineTo: function(x, y) {
		this.context.lineTo(x, y);
		return this;
	},
	/**
	 * Creates a quadratic curve.
	 *
	 * @param  {!number} cpx CPX.
	 * @param  {!number} cpy CPY
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	quadraticCurveTo: function(cpx, cpy, x, y) {
		this.context.quadraticCurveTo(cpx, cpy, x, y);
		return this;
	},
	/**
	 * Creates a bezier curve.
	 *
	 * @param  {!number} cp1x CP1X.
	 * @param  {!number} cp1y CP1Y.
	 * @param  {!number} cp2x CP2X.
	 * @param  {!number} cp2y CP2Y.
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		return this;
	},
	/**
	 * Creates an arc to a position.
	 *
	 * @param  {!number} x1 Start x.
	 * @param  {!number} y1 Start y.
	 * @param  {!number} x2 End x.
	 * @param  {!number} y2 End y.
	 * @param  {!number} radius Radius of the arc.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	arcTo: function(x1, y1, x2, y2, radius) {
		this.context.arcTo(x1, y1, x2, y2, radius);
		return this;
	},
	/**
	 * Creates an arc.
	 *
	 * @param  {!number} x Center x.
	 * @param  {!number} y Center y.
	 * @param  {!number} radius Arc radius.
	 * @param  {!number=} startAngle Start angle.
	 * @param  {!number=} endAngle End angle.
	 * @param  {!boolean=} CCW True for counter clock wise.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	arc: function(x, y, radius, startAngle, endAngle, CCW) {
		this.context.arc(x, y, radius, startAngle || 0, endAngle || Grape2D.Math.PIx2, CCW || false);
		return this;
	},
	/**
	 * Creates a rectangle.
	 *
	 * @param  {!number} x X coordinate of the top left corner.
	 * @param  {!number} y Y coordinate of the top left corner.
	 * @param  {!number} w Width of the rectangle.
	 * @param  {!number} h Height of the rectangle.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	rect: function(x, y, w, h) {
		this.context.rect(x, y, w, h);
		return this;
	},
	/**
	 * Checks if the point is in the current path.
	 *
	 * @param  {!number} x X coordinate.
	 * @param  {!number} y Y coordinate.
	 * @return {!boolean} True if it's in the path.
	 */
	isPointInPath: function(x, y) {
		return this.context.isPointInPath(x, y);
	},
	// Text
	/**
	 * Sets the font type.
	 *
	 * @param  {!string} font New font.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setFont: function(font) {
		this.context.font = font;
		return this;
	},
	/**
	 * Set the text align. The available options are:
	 *   <ul>
	 *   <li>start
	 *   <li>end
	 *   <li>left
	 *   <li>right
	 *   <li>center
	 *
	 * @param  {!string} value A valid align option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setTextAlign: function(value) {
		this.context.textAlign = value;
		return this;
	},
	/**
	 * Sets the baseline. The available options are:
	 *   <ul>
	 *   <li>top
	 *   <li>hanging
	 *   <li>middle
	 *   <li>alphabetic
	 *   <li>ideographic
	 *   <li>bottom
	 *
	 * @param  {!string} baseline A valid option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setTextBaseline: function(baseline) {
		this.context.textBaseline = baseline;
		return this;
	},
	/**
	 * Fills the text.
	 *
	 * @param  {!string} text Text to fill.
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	fillText: function(text, x, y) {
		this.context.fillText(text, x, y);
		return this;
	},
	/**
	 * Stroke text.
	 *
	 * @param  {!string} text Text to stroke.
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	strokeText: function(text, x, y) {
		this.context.strokeText(text, x, y);
		return this;
	},
	/**
	 * Measures a text.
	 *
	 * @param  {!string} text Text to measure.
	 * @return {?TextMetrics} Text metrics
	 */
	measureText: function(text) {
		return this.context.measureText(text);
	},
	// Rectangles
	/**
	 * Clears a rectangle.
	 *
	 * @param  {!number} x Start x.
	 * @param  {!number} y Start y.
	 * @param  {!number} w Width.
	 * @param  {!number} h Height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	clearRect: function(x, y, w, h) {
		this.context.clearRect(x, y, w, h);
		return this;
	},
	/**
	 * Fills a rectangle.
	 *
	 * @param  {!number} x Start x.
	 * @param  {!number} y Start y.
	 * @param  {!number} w Width.
	 * @param  {!number} h Height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	fillRect: function(x, y, w, h) {
		this.context.fillRect(x, y, w, h);
		return this;
	},
	/**
	 * Strokes a rectangle.
	 *
	 * @param  {!number} x Start x.
	 * @param  {!number} y Start y.
	 * @param  {!number} w Width.
	 * @param  {!number} h Height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	strokeRect: function(x, y, w, h) {
		this.context.strokeRect(x, y, w, h);
		return this;
	},
	/** Pixel manipulation **/
	/**
	 * Creates an image data.
	 *
	 * @param  {!number} sw Source width.
	 * @param  {!number} sh Source height.
	 * @return {?ImageData} Image data.
	 */
	createImageData: function(sw, sh) {
		return this.context.createImageData(sw, sh);
	},
	/**
	 * Gets canvas data as an image.
	 *
	 * @param  {!number} sx Source x.
	 * @param  {!number} sy Source y.
	 * @param  {!number} sw Source width.
	 * @param  {!number} sh Source height.
	 * @return {?ImageData} Image data.
	 */
	getImageData: function(sx, sy, sw, sh) {
		return this.context.getImageData(sx, sy, sw, sh);
	},
	/**
	 * Puts image data into the canvas.
	 *
	 * @param  {!ImageData} imageData Image data.
	 * @param  {!number} dx Destination x.
	 * @param  {!number} dy Destination y.
	 * @param  {!number} dirtyX Dirty x.
	 * @param  {!number} dirtyY Dirty y.
	 * @param  {!number} dirtyWidth Dirty width.
	 * @param  {!number} dirtyHeight Dirty height.
	 * @return {?Grape2D.Canvas} This canvas.
	 */
	putImageData: function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
		this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		return this;
	},
	/**
	 * Resizes the canvas.
	 *
	 * @param  {!number} w New width.
	 * @param  {!number} h New height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	resize: function(w, h) {
		this.setWidth(w);
		this.setHeight(h);
		return this;
	},
	/**
	 * Appends canvas to a DOM element.
	 *
	 * @param  {!Element} on Element to append to.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	appendOn: function(on) {
		on.appendChild(this.canvas);
		return this;
	},
	/**
	 * Clears the canvas.
	 */
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};
/**
 * This renders objects to a canvas object, with a 2D context. This
 *   method is not hardware accelerated by default, however is the
 *   most stable and cross-browser.
 *
 * @param  {Object=} options Options to setup the renderer.
 * @param  {!number=} options.width Width of the renderer.
 * @param  {!number=} options.height Height of the renderer.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.CanvasRenderer = function(options) {
	/**
	 * A canvas object
	 *
	 * @type {!Grape2D.Canvas}
	 * @private
	 */
	this.canvas = new Grape2D.Canvas(options);
};

//CanvasRenderer inherits from Renderer
Grape2D.CanvasRenderer.prototype = Object.create(Grape2D.Renderer.prototype);

/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getWidth = function() {
	return this.canvas.getWidth();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getHalfWidth = function() {
	return this.canvas.getHalfWidth();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setWidth = function(width) {
	this.canvas.setWidth(width);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getHeight = function() {
	return this.canvas.getHeight();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getHalfHeight = function() {
	return this.canvas.getHalfHeight();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setHeight = function(height) {
	this.canvas.setHeight(height);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderTexture = function(texture, position) {
	var scale = 1;
	this.canvas.drawImage(texture.getBuffer(), 0, 0, texture.getWidth(), texture.getHeight(), position.getX(), position.getY(), texture.getWidth() * scale, texture.getHeight() * scale);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderObject2D = function(obj, camera) {
	obj.getTexture().render(this, camera.wcsToViewport(this, obj.getTexturePosition()));
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderNetworkObject2D = function(obj, pos, camera) {
	obj.getTexture().render(this, camera.wcsToViewport(this, pos));
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderAABB = function(aabb, camera) {
	var topLeft = camera.wcsToViewport(this, aabb.getMin());
	this.canvas.strokeRect(topLeft.x, topLeft.y, aabb.getWidth() * camera.getScale().x, aabb.getHeight() * camera.getScale().y);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderCircle = function(circle, camera) {
	var center = camera.wcsToViewport(this, circle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, circle.getRadius() * camera.getScale().x, 0, Grape2D.Math.PIx2, false);
	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderPolygon = function(polygon, camera) {
	var center = polygon.getPosition(),
		temp = null,
		first = center.clone(),
		list = polygon.getVertexList();

	first = camera.wcsToViewport(this, first.add(list[0]));

	this.canvas.beginPath();

	this.canvas.moveTo(first.getX(), first.getY());
	for (var i = 1; i < list.length; i++) {
		temp = center.clone();
		temp = camera.wcsToViewport(this, temp.add(list[i]));
		this.canvas.lineTo(temp.getX(), temp.getY());
	}

	this.canvas.lineTo(first.getX(), first.getY());
	this.canvas.stroke();

};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderText = function(text, position) {
	this.canvas.fillText(text, position.getX(), position.getY());
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.start = function() {
	this.canvas.clear();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.end = function() {};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.appendToDOMElement = function(elm) {
	this.canvas.appendOn(elm);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.getDOMElement = function() {
	return this.canvas.canvas;
};
/**
 * Gets the 2D context of teh canvas element.
 *
 * @return {!CanvasRenderingContext2D} Canvas 2D context.
 * @public
 */
Grape2D.CanvasRenderer.prototype.getContext = function() {
	return this.canvas.context;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setStrokeColor = function(color) {
	this.canvas.setStrokeStyle(color);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setFillColor = function(color) {
	this.canvas.setFillStyle(color);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setTextFont = function(font) {
	this.canvas.setFont(font);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderParticle = function(particle, camera) {
	var center = camera.wcsToViewport(this, particle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 1, 0, Grape2D.Math.PIx2, false);
	this.canvas.fill();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderLineSegment = function(start, end, camera) {
	var s = camera.wcsToViewport(this, start),
		e = camera.wcsToViewport(this, end);
	this.canvas.beginPath();
	this.canvas.moveTo(s.getX(), s.getY());
	this.canvas.lineTo(e.getX(), e.getY());
	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderPoint = function(point, camera) {
	var center = camera.wcsToViewport(this, point);
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 2, 0, Grape2D.Math.PIx2, false);
	this.canvas.fill();
}
/**
 * Only renders the wireframe of (the bounding box of)
 *   {@link Grape2D.Object2D}, using another {@link Grape2D.Renderer},
 *   such as {@link Grape2D.CanvasRenderer}. This class is a bridge,
 *   so in fact the renderer provided is the one that is being used.
 *
 * @param  {!Grape2D.Renderer} renderer The renderer to use.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.WireframeRenderer = function(renderer) {
	/**
	 * Renderer to use as an helper.
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.renderer = renderer;
};

Grape2D.WireframeRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getWidth = function() {
	return this.renderer.getWidth();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHalfWidth = function() {
	return this.renderer.getHalfWidth();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setWidth = function(width) {
	this.renderer.setWidth(width);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHeight = function() {
	return this.renderer.getHeight();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHalfHeight = function() {
	return this.renderer.getHalfHeight();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setHeight = function(height) {
	this.renderer.setHeight(height);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderTexture = function(texture, position) {
	this.renderer.renderTexture(texture, position);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderObject2D = function(obj, camera) {
	this.renderPoint(obj.getPosition(), camera);
	obj.getBoundingBox().render(this, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderNetworkObject2D = function(obj, pos, camera) {
	this.renderPoint(obj.getPosition(), camera);
	obj.getBoundingBox().render(this, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.renderer.renderImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAABB = function(aabb, camera) {
	this.renderer.renderAABB(aabb, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderCircle = function(circle, camera) {
	this.renderer.renderCircle(circle, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPolygon = function(polygon, camera) {
	this.renderer.renderPolygon(polygon, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderText = function(text, position) {
	this.renderer.renderText(text, position);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.start = function() {
	this.renderer.start();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.end = function() {
	this.renderer.end();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.appendToDOMElement = function(elm) {
	this.renderer.appendToDOMElement(elm);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getDOMElement = function() {
	return this.renderer.getDOMElement();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setStrokeColor = function(color) {
	this.renderer.setStrokeColor(color);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setFillColor = function(color) {
	this.renderer.setFillColor(color);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setTextFont = function(font) {
	this.renderer.setTextFont(font);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderParticle = function(particle, camera) {
	this.renderer.renderParticle(particle, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderLineSegment = function(start, end, camera) {
	this.renderer.renderLineSegment(start, end, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPoint = function(point, camera) {
	this.renderer.renderPoint(point, camera);
};
/**
 * Processes objects. Visitor pattern.
 *
 * @interface
 */
Grape2D.Object2DProcessor = function() {};

Grape2D.Object2DProcessor.prototype = {
	constructor: Grape2D.Object2DProcessor,
	/**
	 * Processes an Object2D.
	 *
	 * @param  {!Grape2D.Object2D} object2d An Object2D.
	 * @public
	 */
	processObject2D: function(object2d) {},
	/**
	 * Processes an NetworkObject2D.
	 *
	 * @param  {!Grape2D.NetworkObject2D} networkObject2D A NetworkObject2D.
	 * @public
	 */
	processNetworkObject2D: function(networkObject2D) {}
};
/**
 * Object2D represents an object of the scene.
 *   An Object2D is a simple scene object which the main
 *   purpose is to render a texture at a position. More
 *   complex behaviors should be implemented by others
 *   objects that inherit from Object2D.
 *
 * @param {!Grape2D.Vector=} options.position The position of the shape
 * @param {!boolean=} options.visible True to render the object, false
 *		otherwise.
 * @param {!Grape2D.Texture} options.texture The texture of the object.
 * @param {!Grape2D.Vector=} options.textureOffset The offset position
 *		of the texture relative to the objects position.
 * @param {!Grape2D.Shape} options.boundingBox The primary use of the
 *		bounding box is to select the items to display in the renderer,
 *		other behaviors such as collision detection can be done with
 *		this property, in some simple cases. So the bounding box should
 *		bounded tightly to what's supposed to be seen.
 * @param {!Grape2D.Vector=} options.boundingBoxOffset The offset
 *		position of the bounding box relative to the objects position.
 * @param {!boolean=} options.castShadow Used by the IlluminatedRenderer
 *		to render this object shadow.
 * @param {!boolean=} options.receiveLight Used by the IlluminatedRenderer
 *		to render the objects texture with a light overlay, if set to true.
 *
 * @constructor
 */
Grape2D.Object2D = function (options) {

	/**
	 * Object's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = options.position || new Grape2D.Vector();

	/**
	 * Visible property.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.visible = options.visible || true;

	/**
	 * The texture of the object.
	 *
	 * @type {!Grape2D.Texture}
	 * @private
	 */
	this.texture = options.texture;
	/**
	 * The offset of the texture.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.textureOffset = options.textureOffset || new Grape2D.Vector();
	/**
	 * The position of the texture. It is computed from the object's position and the texture offset.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.texturePosition = new Grape2D.Vector();
	//computes the texture position.
	this.computeTexturePosition();
	/**
	 * Object's bounding box.
	 *
	 * @type {!Grape2D.Shape}
	 * @private
	 */
	this.boundingBox = options.boundingBox;
	/**
	 * Bounding box offset.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.boundingBoxOffset = options.boundingBoxOffset || new Grape2D.Vector();

	this.computeBoundingBoxPosition();

	/**
	 * Object cast shadow.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.castShadow = options.castShadow || false;
	/**
	 * Object can receive light.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.receiveLight = options.receiveLight || false;

};

Grape2D.Object2D.prototype = {
	constructor: Grape2D.Object2D,
	/**
	 * Checks if the object should be rendered.
	 *
	 * @return {!boolean} True if it can be rendered.
	 * @public
	 */
	isVisible: function () {
		return this.visible;
	},
	/**
	 * Sets if an object should be rendered.
	 *
	 * @param  {!boolean} visible True, so that it renders, false
	 *   otherwise.
	 * @public
	 */
	setVisible: function (visible) {
		this.visible = visible;
		return;
	},
	/**
	 * Gets the texture of the object.
	 *
	 * @return {!Grape2D.Texture} The texture of the object.
	 * @public
	 */
	getTexture: function () {
		return this.texture;
	},
	/**
	 * Sets the texture of the object.
	 *
	 * @param  {!Grape2D.Texture} texture The texture.
	 * @public
	 */
	setTexture: function (texture) {
		this.texture = texture;
		return;
	},
	/**
	 * Gets the bounding box of the object.
	 *
	 * @return {!Grape2D.Shape} The shape of the object.
	 * @public
	 */
	getBoundingBox: function () {
		return this.boundingBox;
	},
	/**
	 * Sets the bounding box of the object.
	 * Also, the position of the new bounding box, will be transformed
	 *   in the default offset of the bounding box.
	 *
	 * @param  {!Grape2D.Shape} boundingBox The bounding box.
	 * @public
	 */
	setBoundingBox: function (boundingBox) {
		this.boundingBox = boundingBox;
		this.computeBoundingBoxPosition();
		return;
	},
	/**
	 * Checks if the object can cast shadows.
	 *
	 * @return {!boolean} True if it cast shadows, false otherwise.
	 * @public
	 */
	canCastShadow: function () {
		return this.castShadow;
	},
	/**
	 * Sets if an object can cast shadows.
	 *
	 * @param  {!boolean} castShadow True to cast shadows, false
	 *   otherwise.
	 * @public
	 */
	setCastShadow: function (castShadow) {
		this.castShadow = castShadow;
		return;
	},
	/**
	 * Checks if an object can receive light.
	 *
	 * @return {!boolean} True if it receives light.
	 * @public
	 */
	canReceiveLight: function () {
		return this.receiveLight;
	},
	/**
	 * Sets if the object can receive light.
	 *
	 * @param  {!boolean} receiveLight True if it receives light.
	 * @public
	 */
	setReceiveLight: function (receiveLight) {
		this.receiveLight = receiveLight;
		return;
	},
	/**
	 * Gets the object position. Be careful, because it returns the
	 *   vector used by the object, and not a copy. Use it wisely.
	 *
	 * @return {!Grape2D.Vector} The position of the object.
	 * @public
	 */
	getPosition: function () {
		return this.position;
	},
	/**
	 * Sets the object position.
	 *
	 * @param  {!Grape2D.Vector} position The position of the object.
	 * @public
	 */
	setPosition: function (position) {
		this.position.set(position);
		this.computeBoundingBoxPosition();
		this.computeTexturePosition();
	},
	/**
	 * Sets the texture offset.
	 *
	 * @param  {!Grape2D.Vector} offset The offset of the texture, from
	 *   the object's position.
	 * @public
	 */
	setTextureOffset: function (offset) {
		this.textureOffset.set(offset);
		this.computeTexturePosition();
	},
	/**
	 * Gets the texture offset
	 *
	 * @return {!Grape2D.Vector} The texture offset.
	 * @public
	 */
	getTextureOffset: function () {
		return this.textureOffset;
	},
	/**
	 * Sets the bounding box offset.
	 *
	 * @param  {!Grape2D.Vector} offset The offset of the bounding
	 *   box, from the object's position.
	 * @public
	 */
	setBoundingBoxOffset: function (offset) {
		this.boundingBoxOffset.set(offset);
		this.computeBoundingBoxPosition();
	},
	/**
	 * Gets the bounding box offset
	 *
	 * @return {!Grape2D.Vector} The bounding box offset.
	 * @public
	 */
	getBoundingBoxOffset: function () {
		return this.boundingBoxOffset;
	},
	/**
	 * Computes the bounding box position, from the object's position
	 *   and bounding box offset.
	 * @protected
	 */
	computeBoundingBoxPosition: function () {
		this.boundingBox.setPosition(this.position);
		this.boundingBox.getPosition().add(this.boundingBoxOffset);
	},
	/**
	 * Gets the bounding box position.
	 *
	 * @return {!Grape2D.Vector} The center position of the bounding box.
	 * @public
	 */
	getBoundingBoxPosition: function () {
		return this.boundingBox.getPosition();
	},
	/**
	 * Computes the texture position of the object, from the object's
	 *   position and texture offset.
	 * @protected
	 */
	computeTexturePosition: function () {
		this.texturePosition.set(this.position).add(this.textureOffset);
	},
	/**
	 * Gets the texture position.
	 *
	 * @return {!Grape2D.Vector} The position of the texture
	 * @public
	 */
	getTexturePosition: function () {
		return this.texturePosition;
	},
	/**
	 * Renders the object to a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer The place to render the
	 *   object.
	 * @param  {!Grape2D.Camera} camera The camera, that will
	 *   transform the positions.
	 * @public
	 */
	render: function (renderer, camera) {
		renderer.renderObject2D(this, camera);
	},
	/**
	 * Updates the object. This method should be refined in further
	 *   subclasses if needed be.
	 *
	 * @param  {!number} dt Time interval.
	 * @param  {!Grape2D.Scene} scene Scene where this object is.
	 * @public
	 */
	update: function (dt, scene) {},
	/**
	 * Processes this object thought a processor. Same as a visitor
	 *   pattern.
	 *
	 * @param  {Grape2D.Object2DProcessor} processor A processor.
	 * @public
	 */
	process: function(processor) {
		processor.processObject2D(this);
	}
};
/**
 * This specifies an {@link Grape2D.Object2D} that is to be transmitted to the client or server, at any time.
 *
 * @param {!Object=} options Setup options. See {@link Grape2D.Object2D}.
 * @param {!(number|string)} options.id Object unique identifier.
 * @extends {Grape2D.Object2D}
 * @constructor
 */
Grape2D.NetworkObject2D = function(options) {
	Grape2D.Object2D.call(this, options);
	this.id = options.id || 0;
};

Grape2D.NetworkObject2D.prototype = Object.create(Grape2D.Object2D.prototype);
/**
 * @override
 */
Grape2D.NetworkObject2D.prototype.render = function(renderer, camera) {
	var networkClone = Grape2D.SnapshotManagerSingleton.getSnapshotNetworkObject2D(this.id);
	if (networkClone && !networkClone.getPosition().equals(this.getPosition())) {
		var lerp = Grape2D.Vector.lerp(this.getPosition(), networkClone.getPosition(), Grape2D.SnapshotManagerSingleton.getLerpPercent());
		this.renderInterpolate(renderer, camera, lerp);
	} else {
		Grape2D.Object2D.prototype.render.call(this, renderer, camera);
	}
};
/**
 * Renders an object in an interpolating position.
 *
 * @param  {!Grape2D.Renderer} renderer Renderer.
 * @param  {!Grape2D.Camera} camera Camera.
 * @param  {!Grape2D.Vector} lerpPosition Interpolating position.
 * @public
 */
Grape2D.NetworkObject2D.prototype.renderInterpolate = function(renderer, camera, lerpPosition) {
	renderer.renderNetworkObject2D(this, lerpPosition, camera);
};
/**
 * @override
 */
Grape2D.NetworkObject2D.prototype.process = function(processor) {
	processor.processNetworkObject2D(this);
};
/**
 * Gets the object's id.
 *
 * @return {!(number|string)} Object's id.
 * @public
 */
Grape2D.NetworkObject2D.prototype.getId = function() {
	return this.id;
};
/**
 * Sets the object's id.
 *
 * @param {!(number|string)} id Object's id.
 * @public
 */
Grape2D.NetworkObject2D.prototype.setId = function(id) {
	this.id = id;
};
/**
 * Creates a clone object to be passed through the network.
 *
 * @return {!Grape2D.SnapshotNetworkObject2D} Network clone.
 * @public
 */
Grape2D.NetworkObject2D.prototype.createNetworkClone = function() {
	return new Grape2D.SnapshotNetworkObject2D(this.id, this.getPosition().getX(), this.getPosition().getY());
};
/**
 * Shape is an abstract class that describes "physical", objects.
 *   The main objective of a Shape is to serve as a bounding box. It
 *   should play the main role when selecting the objects to render,
 *   when it comes to collision detection and/or to detect user
 *   interaction with an object.
 *
 * @param {!Grape2D.Vector=} options.position The position of the shape.
 *
 * @constructor
 */
Grape2D.Shape = function(options) {
	options = options || {};
	/**
	 * Shape's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @protected
	 */
	this.position = options.position || new Grape2D.Vector();
};

Grape2D.Shape.prototype = {
	constructor: Grape2D.Shape,
	/**
	 * Gets the position of the object.
	 *
	 * @return {!Grape2D.Vector} The center position of the shape.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Set the position of the shape.
	 *
	 * @param  {!Grape2D.Vector} position The new position of the shape.
	 * @public
	 */
	setPosition: function(position) {
		this.position.set(position);
	},
	/**
	 * Renders the wireframe of the shape.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer to render the
	 *   shape's wireframe.
	 * @param  {!Grape2D.Camera} camera The camera to transform the
	 *   positions.
	 * @public
	 */
	render: function(renderer, camera) {},
	/**
	 * Creates a bounding volume, based in this one and in a
	 *   {@link Grape2D.BVFactory}.
	 *
	 * @param  {!Grape2D.BVFactory} bvfactory The bounding volume
	 *   factory.
	 * @return {!Grape2D.Shape} The shape created by the
	 *   {@link Grape2D.BVFactory}.
	 * @public
	 */
	createBV: function(bvfactory) {},
	/**
	 * Gets teh static type of the shape. This method must be overriden,
	 *   for specific shapes.
	 *
	 * @return {!string} The type of the shape.
	 * @public
	 */
	getStaticType: function() {}
};
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
 * @return {!number} Minimum x coordinate.
 * @public
 */
Grape2D.AABB.prototype.getMinX = function() {
	return this.min.getX();
};
/**
 * Gets the minimum y coordinate of the AABB.
 *
 * @return {!number} Minimum y coordinate.
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
 * @return {!number} Maximum x coordinate.
 * @public
 */
Grape2D.AABB.prototype.getMaxX = function() {
	return this.max.getX();
};
/**
 * Gets the maximum y coordinate of the AABB.
 *
 * @return {!number} Maximum y coordinate.
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
/**
 * Circle describes a circle shape. A circle is defined by
 *   it's radius.
 *
 * @param {!Object} options Setup options. See {@link Grape2D.Shape}
 * @param {?Grape2D.Vector} options.position The position of the
 *   polygon
 * @param {!number} options.radius Radius of the circle.
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.Circle = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Circle's radius.
	 *
	 * @type {!number}
	 * @private
	 */
	this.radius = options.radius;
};

Grape2D.Circle.prototype = Object.create(Grape2D.Shape.prototype);

/**
 * Gets the radius of the circle.
 *
 * @return {!number} The radius of the circle.
 * @public
 */
Grape2D.Circle.prototype.getRadius = function(){
	return this.radius;
};
/**
 * Sets the radius of the circle.
 *
 * @param  {!number} radius - The new radius of the circle
 * @public
 */
Grape2D.Circle.prototype.setRadius = function(radius){
	this.radius = radius;
};
/**
 * @override
 */
Grape2D.Circle.prototype.render = function(renderer, camera){
	renderer.renderCircle(this, camera);
};
/**
 * @override
 */
Grape2D.Circle.prototype.createBV = function(bvfactory){
	return bvfactory.createFromCircle(this);
};
/**
 * @override
 */
Grape2D.Circle.prototype.getStaticType = function(){
	return Grape2D.Circle.TYPE;
};
/**
 * Type of the shape.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.Circle.TYPE = "Circle";
/**
 * Polygon describes a polygon shape. A list of vertexes should
 *   should be provided or set afterwards.
 *
 * @param {!Grape2D.Vector=} options.position The position of the polygon
 * @param {!Array.<!Grape2D.Vector>} options.vertexList A list with the
 *   vertexes of the polygon. They're position should be relative to the
 *   position. This means that a vertex at (0,0) is at the same position
 *   that <code>polygon.getPosition()</code>.
 *
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.Polygon = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Polygon's vertexes.
	 *
	 * @type {!Array.<!Grape2D.Vector>}
	 * @private
	 */
	this.vertexList = options.vertexList;
	/**
	 * Polygon's vertexes. Relative to the world.
	 *
	 * @type {!Array.<!Grape2D.Vector>}
	 * @private
	 */
	this.computedVertexList = [];
	this.computeVertexList();
};

Grape2D.Polygon.prototype = Object.create(Grape2D.Shape.prototype);

/**
 * Gets the list of vertexes.
 *
 * @return {!Array.<!Grape2D.Vector>} The array with the vertexes.
 * @public
 */
Grape2D.Polygon.prototype.getVertexList = function(){
	return this.vertexList;
};
/**
 * Sets a list of vertexes.
 *
 * @param  {!Array.<!Grape2D.Vector>} vertexList A list with the new
 *   vertexes.
 * @public
 */
Grape2D.Polygon.prototype.setVertexList = function(vertexList){
	this.vertexList = vertexList;
	this.computeVertexList();
};
/**
 * Gets the vertex list relative to the world.
 *
 * @return {!Array.<!Grape2D.Vector>} Array with the vertexes.
 * @public
 */
Grape2D.Polygon.prototype.getComputedVertexList = function(){
	return this.computedVertexList;
};
/**
 * @override
 */
Grape2D.Polygon.prototype.render = function(renderer, camera){
	renderer.renderPolygon(this, camera);
};
/**
 * @override
 */
Grape2D.Polygon.prototype.createBV = function(bvfactory){
	return bvfactory.createFromPolygon(this);
};
/**
 * @override
 */
Grape2D.Polygon.prototype.getStaticType = function(){
	return Grape2D.Polygon.TYPE;
};
/**
 * Computes the original vertex coordinates, to be relative to the
 *   world position.
 * 
 * @protected
 */
Grape2D.Polygon.prototype.computeVertexList = function(){
	this.computedVertexList = [];
	for(var i=0; i<this.vertexList.length; i++){
		this.computedVertexList.push(this.getPosition().clone().add(this.vertexList[i]));
	}
};
/**
 * @override
 */
Grape2D.Polygon.prototype.setPosition = function(vector){
	Grape2D.Shape.prototype.setPosition.call(this, vector);
	this.computeVertexList();
};
/**
 * Type of the shape.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.Polygon.TYPE = "Polygon";
/**
 * Particle.
 *
 * @param  {!Object=} options Setup options. See {@link Grape2D.Shape}
 * @param  {!Grape2D.Vector=} options.velocity Particle's velocity.
 * @param  {!Grape2D.Vector=} options.acceleration Particle's acceleration.
 * @param  {!number} options.lifeTime Particle's remaining time, in
 *   milliseconds.
 *
 * @extends {Grape2D.Shape}
 * @constructor
 */
Grape2D.Particle = function(options) {
	Grape2D.Shape.call(this, options);
	/**
	 * Velocity of the particle.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.velocity = options.velocity || new Grape2D.Vector();
	/**
	 * Acceleration of the particle.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.acceleration = options.acceleration || new Grape2D.Vector();
	/**
	 * Remaining life time of the particle in milliseconds.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lifeTime = options.lifeTime || 250;
	//console.log(this.lifeTime);
};

Grape2D.Particle.prototype = Object.create(Grape2D.Shape.prototype);
/**
 * Gets the particle velocity.
 *
 * @return {!Grape2D.Vector} Particle velocity.
 * @public
 */
Grape2D.Particle.prototype.getVelocity = function() {
	return this.velocity;
};
/**
 * Sets the particle velocity.
 *
 * @param  {!Grape2D.Vector} velocity Velocity of the particle.
 * @public
 */
Grape2D.Particle.prototype.setVelocity = function(velocity) {
	this.velocity.set(velocity);
};
/**
 * Gets the particle acceleration.
 *
 * @return {!Grape2D.Vector} Particle acceleration.
 * @public
 */
Grape2D.Particle.prototype.getAcceleration = function() {
	return this.velocity;
};
/**
 * Sets the particle acceleration.
 *
 * @param  {!Grape2D.Vector} acceleration Acceleration of the particle.
 * @public
 */
Grape2D.Particle.prototype.setAcceleration = function(acceleration) {
	this.acceleration.set(acceleration);
};
/**
 * Gets the particle remaining life time.
 *
 * @return {!number} Particle life time.
 * @public
 */
Grape2D.Particle.prototype.getLifeTime = function() {
	return this.lifeTime;
};
/**
 * Sets the particle remaining life time.
 *
 * @param  {!number} lifeTime Remaining life time of the particle.
 * @public
 */
Grape2D.Particle.prototype.setLifeTime = function(lifeTime) {
	this.lifeTime = lifeTime;
};
/**
 * @override
 */
Grape2D.Particle.prototype.render = function(renderer, camera) {
	renderer.renderParticle(this, camera);
};
/**
 * Checks if the particle is in the alive state.
 *
 * @return {!boolean} True if it's alive.
 * @public
 */
Grape2D.Particle.prototype.isAlive = function() {
	return this.lifeTime > 0;
};
/**
 * Checks if the particle is in the dead state.
 *
 * @return {!boolean} True if it's dead.
 * @public
 */
Grape2D.Particle.prototype.isDead = function() {
	return this.lifeTime <= 0;
};
/**
 * Revives the particle according to a set of properties.
 *
 * @param  {!Grape2D.Vector} position Position of the particle.
 * @param  {!Grape2D.Vector} velocity Velocity of the particle.
 * @param  {!number} lifeTime Remaining life time of the particle.
 * @public
 */
Grape2D.Particle.prototype.revive = function(position, velocity, lifeTime) {
	this.position.set(position);
	this.velocity.set(velocity);
	this.lifeTime = lifeTime;
	this.acceleration.reset();
};
/**
 * Submits the particle to the force of fields.
 *
 * @param  {!Array.<!Grape2D.Field>} fields Fields to submit.
 * @public
 */
Grape2D.Particle.prototype.submitToFields = function(fields) {
	var accel = new Grape2D.Vector();
	for (var i = 0; i < fields.length; i++) {
		accel.add(fields[i].computeAcceleration(this.position));
	}
	this.acceleration.set(accel);
};
/**
 * Updates the particle.
 *
 * @param  {!number} dt Time elapsed since the last update.
 * @param  {!Grape2D.Scene} scene Scene where the particle is.
 * @public
 */
Grape2D.Particle.prototype.update = function(dt, scene) {
	//simple euler integration.
	this.velocity.setX(this.velocity.getX() + this.acceleration.getX() * dt);
	this.velocity.setY(this.velocity.getY() + this.acceleration.getY() * dt);
	this.position.setX(this.position.getX() + this.velocity.getX() * dt);
	this.position.setY(this.position.getY() + this.velocity.getY() * dt);
	this.lifeTime -= dt;
};
/**
 * Ray.
 *
 * @param  {!Grape2D.Vector} start Start of the ray.
 * @param  {!Grape2D.Vector} direction Direction of the ray.
 * @param  {!number} length Direction of the ray.
 * @constructor
 */
Grape2D.Ray = function(start, direction, length){
	this.start = start;
	this.direction = direction;
	this.length = length;
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
/**
 * Particle system.
 *
 * @extends {Grape2D.Object2D}
 * @constructor
 */
Grape2D.ParticleSystem = function(){
	Grape2D.Object2D.call(this, {
		texture: new Grape2D.VoidTexture(),
		boundingBox: new Grape2D.AABB({
			width: 0,
			height: 0
		})
	});
	/**
	 * Emitters of particles of the system.
	 *
	 * @type {!Array.<!Grape2D.Emitter>}
	 * @private
	 */
	this.emitters = [];
	/**
	 * Fields that interact with the particles of the system.
	 *
	 * @type {!Array.<!Grape2D.Field>}
	 * @private
	 */
	this.fields = [];
	/**
	 * Value of the minimum x coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.minx = +Infinity;
	/**
	 * Value of the minimum y coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.miny = +Infinity;
	/**
	 * Value of the maximum x coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.maxx = -Infinity;
	/**
	 * Value of the maximum y coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.maxy = -Infinity;
};

Grape2D.ParticleSystem.prototype = Object.create(Grape2D.Object2D.prototype);
/**
 * Adds an emitter to the system.
 *
 * @param  {!Grape2D.Emitter} emitter Emitter to add.
 * @public
 */
Grape2D.ParticleSystem.prototype.addEmitter = function(emitter){
	emitter.setParticleSystem(this);
	this.emitters.push(emitter);
};
/**
 * Removes an emitter from the system.
 *
 * @param  {!Grape2D.Emitter} emitter An emitter that is in the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.removeEmitter = function(emitter){
	this.emitters.splice(this.emitters.indexOf(emitter), 1);
};
/**
 * Gets the emitter list.
 *
 * @return {!Array.<!Grape2D.Emitter>} Emitters of the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.getEmitters = function(){
	return this.emitters;
};
/**
 * Adds a field to the system.
 *
 * @param  {!Grape2D.Field} field Field to add.
 * @public
 */
Grape2D.ParticleSystem.prototype.addField = function(field){
	this.fields.push(field);
};
/**
 * Removes a field from the system.
 *
 * @param  {!Grape2D.Field} field A field that is in the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.removeField = function(field){
	this.fields.splice(this.fields.indexOf(field), 1);
};
/**
 * Gets the fields list.
 *
 * @return {!Array.<!Grape2D.Field>} Fields of the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.getFields = function(){
	return this.fields;
};
/**
 * @override
 */
Grape2D.ParticleSystem.prototype.update = function(dt, scene){
	this.minx = +Infinity;
	this.miny = +Infinity;
	this.maxx = -Infinity;
	this.maxy = -Infinity;
	for(var i=0; i<this.emitters.length;i++){
		this.emitters[i].update(dt, scene);
	}
	var w = this.maxx-this.minx,
		h = this.maxy-this.miny,
		center = new Grape2D.Vector(this.minx+w/2, this.miny+h/2),
		bbox = this.getBoundingBox();
	bbox.setWidth(w);
	bbox.setHeight(h);
	bbox.setPosition(center);
};
/**
 * Submits a particle to the system. This method is used mainly
 *   to keep an updated bounding box.
 *
 * @param  {!Grape2D.Particle} particle Particle inside the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.submitParticle = function(particle){
	var x = particle.getPosition().getX(),
		y = particle.getPosition().getY();
	if(this.minx>x){
		this.minx = x;
	}
	if(this.miny>y){
		this.miny = y;
	}
	if(this.maxx<x){
		this.maxx = x;
	}
	if(this.maxy<y){
		this.maxy = y;
	}
};
/**
 * @override
 */
Grape2D.ParticleSystem.prototype.getPosition = function(){
	return this.getBoundingBox().getPosition();
};
/**
 * @override
 */
Grape2D.ParticleSystem.prototype.render = function(renderer, camera){
	for(var i=0; i<this.emitters.length;i++){
		this.emitters[i].render(renderer, camera);
	}
	this.getBoundingBox().render(renderer, camera);
};

/**
 * Emits particles to the particle system.
 *
 * @param  {!Object} options Setup properties.
 * @param  {!Grape2D.Vector} options.position Position of the emitter,
 *   and initial position of the particles.
 * @param  {!Grape2D.Vector} options.velocity Initial velocity of the
 *   particles.The length of the vector indicated its speed. The angle
 *   indicates the angle.
 * @param  {!number=} options.speedVariation Variation of the length of
 *   the velocity vector. So that particles created have a speed
 *   between <code>velocity.length-speedVariation</code> and
 *   <code>velocity.length+speedVariation</code>.
 * @param  {!number=} options.spread Spread of particles relative to the
 * velocity angle. It should be in radius.
 * @param  {!number} options.particleLife Life of a particle in milliseconds.
 * @param  {!number=} options.particleLifeVariation Life variation of
 *   particles created, relative to the life property.
 * @param  {!number=} options.maxParticles Maximum number of particles
 *   that this emitter can have, dead or alive. Because the particles
 *   are instantiated at construction time.
 * @param  {!number=} options.rate Rate of particles emitted, per second.
 *
 * @constructor
 */
Grape2D.Emitter = function(options) {
	/**
	 * Position of the emitter and initial position of newly created or
	 *   revived particles.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = options.position;
	/**
	 * Initial velocity of the particles.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.velocity = options.velocity;
	/**
	 * Cached value, of the velocity angle.
	 *
	 * @type {!number}
	 * @private
	 */
	this.vAngle = this.velocity.getAngle();
	/**
	 * Cached value, of the magnitude of the velocity.
	 *
	 * @type {!number}
	 * @private
	 */
	this.vMagnitude = this.velocity.getMagnitude();
	/**
	 * Speed variation of created or revived particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.speedVariation = options.speedVariation || 0;
	/**
	 * Spread of the particles, in relation to the velocity vector.
	 *
	 * @type {!number}
	 * @private
	 */
	this.spread = options.spread || 0;
	/**
	 * Life of particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.particleLife = options.particleLife || 200;
	/**
	 * Life variation of particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.particleLifeVariation = options.particleLifeVariation || 0;
	/**
	 * Emitter maximum particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.maxParticles = options.maxParticles;
	/**
	 * Rate of particles to emit per second.
	 *
	 * @type {!number}
	 * @private
	 */
	this.rate = options.rate || 60;
	/**
	 * Rate of particles to emit per millisecond.
	 *
	 * @type {!number}
	 * @private
	 */
	this.mrate = this.rate / 1000;
	/**
	 * Particles of the emitter.
	 *
	 * @type {!Array.<!Grape2D.Particle>}
	 * @private
	 */
	this.particles = [];
	this.createParticles();
	/**
	 * Particle system associated with this emitter.
	 *
	 * @type {Grape2D.ParticleSystem}
	 * @private
	 */
	this.particleSystem = null;
	/**
	 * Number of particle rendered after each render cycle.
	 *
	 * @type {!number}
	 * @private
	 */
	this.renderedParticles = 0;
};

Grape2D.Emitter.prototype = {
	constructor: Grape2D.Emitter,
	/**
	 * Gets the position of the emitter.
	 *
	 * @return {!Grape2D.Vector} Position of the emitter.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Sets the position of the emitter.
	 *
	 * @param  {!Grape2D.Vector} position Position of the emitter.
	 * @public
	 */
	setPosition: function(position) {
		this.position.set(position);
	},
	/**
	 * Gets the velocity of the emitter.
	 *
	 * @return {!Grape2D.Vector} Velocity of the emitter.
	 * @public
	 */
	getVelocity: function() {
		return this.velocity;
	},
	/**
	 * Sets the velocity of the emitter.
	 *
	 * @param  {!Grape2D.Vector} velocity Velocity of the emitter.
	 * @public
	 */
	setVelocity: function(velocity) {
		this.velocity.set(velocity);
	},
	/**
	 * Gets the speed variation of the created particles.
	 *
	 * @return {!number} Speed variation.
	 * @public
	 */
	getSpeedVariation: function() {
		return this.speedVariation;
	},
	/**
	 * Sets the speed variation of the created particles.
	 *
	 * @param  {!number} speedVariation Speed variation.
	 * @public
	 */
	setSpeedVariation: function(speedVariation) {
		this.speedVariation = speedVariation;
	},
	/**
	 * Gets the spread of the created particles, relative to the
	 *   velocity vector angle.
	 *
	 * @return {!number} Spread of the created particles.
	 * @public
	 */
	getSpread: function() {
		return this.spread;
	},
	/**
	 * Sets the spread of the created particles, relative to the
	 *   velocity vector angle.
	 *
	 * @param  {!number} spread Spread of the created particles.
	 * @public
	 */
	setSpread: function(spread) {
		this.spread = spread;
	},
	/**
	 * Gets the particle life of the created particles.
	 *
	 * @return {!number} Particle life.
	 * @public
	 */
	getParticleLife: function() {
		return this.particleLife;
	},
	/**
	 * Sets the particle life of the created particles.
	 *
	 * @param  {!number} particleLife Particle life.
	 * @public
	 */
	setParticleLife: function(particleLife) {
		this.particleLife = particleLife;
	},
	/**
	 * Gets the particle life variation of the created particles,
	 *   relative to the particle life.
	 *
	 * @return {!number} Particle life variation.
	 * @public
	 */
	getParticleLifeVariation: function() {
		return this.particleLifeVariation;
	},
	/**
	 * Sets the particle life variation of the created particles,
	 *   relative to the particle life.
	 *
	 * @param  {!number} particleLifeVariation Particle life variation.
	 * @public
	 */
	setParticleLifeVariation: function(particleLifeVariation) {
		this.particleLifeVariation = particleLifeVariation;
	},
	/**
	 * Gets the rate that the emitter emits particles.
	 *
	 * @return {!number} Emission rate.
	 * @public
	 */
	getRate: function() {
		return this.rate;
	},
	/**
	 * Sets the rate that the emitter emits particles.
	 *
	 * @param  {!number} rate Emission rate.
	 * @public
	 */
	setRate: function(rate) {
		this.rate = rate;
	},
	/**
	 * Gets the particles associated with this emitter, they can be
	 *   either dead or alive.
	 *
	 * @return {!Array.<!Grape2D.Particle>} Particles.
	 * @public
	 */
	getParticles: function() {
		return this.particles;
	},
	/**
	 * Gets the particle system associated with this emitter.
	 *
	 * @return {?Grape2D.ParticleSystem} Particle system.
	 * @public
	 */
	getParticleSystem: function() {
		return this.particleSystem;
	},
	/**
	 * Sets the particle system associated with this emitter.
	 *
	 * @param  {!Grape2D.ParticleSystem} ps Particle system.
	 * @public
	 */
	setParticleSystem: function(ps) {
		this.particleSystem = ps;
	},
	/**
	 * Gets the number of particles rendered in the last call to the
	 *   {@link Grape2D.Emitter.render} method.
	 *
	 * @return {!number} Number of particles rendered.
	 */
	getRenderedParticles: function(){
		return this.renderedParticles;
	},
	/**
	 * Create particles. Up to the maximum number of particles of the
	 *   emitter.
	 *
	 * @protected
	 */
	createParticles: function() {
		for (var i = 0; i < this.maxParticles; i++) {
			this.particles.push(new Grape2D.Particle({
				position: this.position.clone(),
				velocity: Grape2D.Vector.createFromAngle(
					this.vAngle + Grape2D.Math.randFloat(-this.spread, this.spread),
					this.vMagnitude + Grape2D.Math.randFloat(-this.speedVariation, this.speedVariation)),
				lifeTime: -1
			}));
		}
	},
	/**
	 * Revives a particle according to the emitter properties.
	 *
	 * @param  {!Grape2D.Particle} particle Particle to revive.
	 * @protected
	 */
	reviveParticle: function(particle) {
		particle.revive(
			this.position,
			Grape2D.Vector.createFromAngle(this.vAngle + Grape2D.Math.randFloat(-this.spread, this.spread), this.vMagnitude + Grape2D.Math.randFloat(-this.speedVariation, this.speedVariation)),
			this.particleLife + Grape2D.Math.randInt(-this.particleLifeVariation, this.particleLifeVariation));

	},
	/**
	 * Updates an emitter. If there are particles dead, it revives them
	 *   according to the rate specified.
	 *   The emitter should have a particle system associated, if this
	 *   method is to be called, it could be done through <code>
	 *   emitter.setParticleSystem(particleSystem);</code>
	 *
	 * @param  {!number} dt Time elapsed since the last update.
	 * @param  {!Grape2D.Scene} scene Scene of the emitter.
	 * @public
	 */
	update: function(dt, scene) {
		var dead = [],
			rate = Grape2D.Math.floor(this.mrate * dt),
			fields = this.particleSystem.getFields(),
			particle;
		for (var i = 0; i < this.particles.length; i++) {
			particle = this.particles[i];
			if (particle.isDead()) {
				if (rate>=0) {
					this.reviveParticle(particle);
					rate--;
					this.particleSystem.submitParticle(particle);
				}
			} else {
				particle.submitToFields(fields);
				particle.update(dt, scene);
				this.particleSystem.submitParticle(particle);
			}
		}
	},
	/**
	 * Renders the particles into a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer Renderer.
	 * @param  {!Grape2D.Camera} camera Camera.
	 * @public
	 */
	render: function(renderer, camera) {
		this.renderedParticles = 0;
		for (var i = 0; i < this.particles.length; i++) {
			if (this.particles[i].isAlive()) {
				this.particles[i].render(renderer, camera);
				this.renderedParticles++;
			}
		}
	}
};
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
/**
 * Managers inputs, giving an easy to use interface.
 *   An input manager can only be listening to a single renderer
 *   at once.
 *
 * @param  {!Grape2D.Renderer} renderer Renderer to listen.
 * @constructor
 */
Grape2D.InputManager = function(renderer) {
	/**
	 * Mouse up callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseUp = [];
	/**
	 * Mouse down callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseDown = [];
	/**
	 * Mouse move callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseMove = [];
	/**
	 * Mouse over callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseOver = [];
	/**
	 * Mouse out callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseOut = [];
	/**
	 * Mouse wheel callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.mouseWheel = [];
	/**
	 * Click callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.click = [];
	/**
	 * Drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.drag = [];
	/**
	 * Start dragging position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.dragStart = new Grape2D.Vector();
	/**
	 * Dragging state.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.isDragging = false;
	/**
	 * Resize callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.resize = [];
	/**
	 * Key down callback stack.
	 *
	 * @type {!Object.<number, !Array.<Function>>}
	 * @private
	 */
	this.keyDown = {};
	/**
	 * Key up callback stack.
	 *
	 * @type {!Object.<number, !Array.<Function>>}
	 * @private
	 */
	this.keyUp = {};
	/**
	 * Key press callback stack.
	 *
	 * @type {!Object.<number, !Array.<Function>>}
	 * @private
	 */
	this.keyPress = {};
	/**
	 * Renderer
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.rendererBinding = renderer;
	//binds this input manager to the renderer.
	this.bindToRenderer(renderer);
};

Grape2D.InputManager.prototype = {
	constructor: Grape2D.InputManager,
	/**
	 * Binds the renderer to this input manager. Sets up helper functions
	 *   and callbacks.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer to listen.
	 * @public
	 */
	bindToRenderer: function(renderer) {
		//if there is a rendererBinding then remove events
		this.rendererBinding = renderer;
		/**
		 * DOM Element
		 *
		 * @type {!Element}
		 */
		var dom = this.rendererBinding.getDOMElement();
		var that = this;

		dom.addEventListener('mouseup', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseUp), false);
		dom.addEventListener('mousedown', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseDown), false);
		dom.addEventListener('mousemove', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseMove), false);
		dom.addEventListener('mouseover', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOver), false);
		dom.addEventListener('mouseout', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOut), false);
		dom.addEventListener('mousewheel', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseWheel), false);
		dom.addEventListener('click', Grape2D.InputManager.bindFn(this.rendererBinding, this.click), false);

		//add helper fns for drag
		this.addMouseDown(function(e) {
			that.dragStart.set(e.getPosition());
			that.isDragging = true;
		});
		this.addMouseMove(function(e) {
			if (that.isDragging) {
				var end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart),
					list = that.getDragBindStack();
				for (var i = 0; i < list.length; i++) {
					list[i](ev);
				}
				that.dragStart.set(end);
			}
		});
		this.addMouseUp(function(e) {
			that.isDragging = false;
		});
		this.addMouseOut(function(e) {
			that.isDragging = false;
		});
	},
	/**
	 * Gets the mouse up callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseUpBindStack: function() {
		return this.mouseUp;
	},
	/**
	 * Adds a callback to the mouse up event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseUp: function(callback) {
		this.mouseUp.push(callback);
	},
	/**
	 * Removes a callback from the mouse up callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseUp: function(callback) {
		var indx = this.mouseUp.indexOf(callback);
		if (indx >= 0) {
			this.mouseUp.splice(this.mouseUp.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse down callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseDownBindStack: function() {
		return this.mouseDown;
	},
	/**
	 * Adds a callback to the mouse down event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseDown: function(callback) {
		this.mouseDown.push(callback);
	},
	/**
	 * Removes a callback from the mouse down callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseDown: function(callback) {
		var indx = this.mouseDown.indexOf(callback);
		if (indx >= 0) {
			this.mouseDown.splice(this.mouseDown.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse move callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseMoveBindStack: function() {
		return this.mouseMove;
	},
	/**
	 * Adds a callback to the mouse move event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseMove: function(callback) {
		this.mouseMove.push(callback);
	},
	/**
	 * Removes a callback from the mouse move callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseMove: function(callback) {
		var indx = this.mouseMove.indexOf(callback);
		if (indx >= 0) {
			this.mouseMove.splice(this.mouseMove.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse over callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseOverBindStack: function() {
		return this.mouseOver;
	},
	/**
	 * Adds a callback to the mouse over event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseOver: function(callback) {
		this.mouseOver.push(callback);
	},
	/**
	 * Removes a callback from the mouse over callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseOver: function(callback) {
		var indx = this.mouseOver.indexOf(callback);
		if (indx >= 0) {
			this.mouseOver.splice(this.mouseOver.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse out callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseOutBindStack: function() {
		return this.mouseOut;
	},
	/**
	 * Adds a callback to the mouse out event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseOut: function(callback) {
		this.mouseOut.push(callback);
	},
	/**
	 * Removes a callback from the mouse out callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseOut: function(callback) {
		var indx = this.mouseOut.indexOf(callback);
		if (indx >= 0) {
			this.mouseOut.splice(this.mouseOut.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the mouse wheel callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getMouseWheelBindStack: function() {
		return this.mouseWheel;
	},
	/**
	 * Adds a callback to the mouse wheel event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addMouseWheel: function(callback) {
		this.mouseWheel.push(callback);
	},
	/**
	 * Removes a callback from the mouse wheel callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeMouseWheel: function(callback) {
		var indx = this.mouseWheel.indexOf(callback);
		if (indx >= 0) {
			this.mouseWheel.splice(this.mouseWheel.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the resize callback stack, that is binded to
	 *   the renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getResizeBindStack: function() {
		return this.resize;
	},
	/**
	 * Adds a callback to the resize event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addResize: function(callback) {
		this.resize.push(callback);
		Grape2D.InputManager.registerGlobalResize(callback);
	},
	/**
	 * Removes a callback from the resize callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeResize: function(key, callback) {
		var indx = this.resize.indexOf(callback);
		if (indx >= 0) {
			this.resize.splice(this.resize.indexOf(callback), 1);
		}
		Grape2D.InputManager.unregisterGlobalResize(callback);
	},
	/**
	 * Gets the key down callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Object.<number, !Array.<Function>>} Callback stack.
	 * @public
	 */
	getKeyDownBindStack: function() {
		return this.keyDown;
	},
	/**
	 * Adds a callback to the key down event.
	 *
	 * @param  {!number} key Key code that triggers the callback.
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addKeyDown: function(key, callback) {
		if (!this.keyDown[key]) {
			this.keyDown[key] = [];
		}
		this.keyDown[key].push(callback);
		Grape2D.InputManager.registerGlobalKeyDown(key, callback);
	},
	/**
	 * Removes a callback from the key down callback stack.
	 *
	 * @param  {!number} key Key code of the key that triggers the
	 *   callback.
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeKeyDown: function(key, callback) {
		if (!this.keyDown[key]) {
			return;
		}
		var indx = this.keyDown[key].indexOf(callback);
		if (indx >= 0) {
			this.keyDown[key].splice(indx, 1);
			Grape2D.InputManager.unregisterGlobalKeyDown(key, callback);
		}
	},
	/**
	 * Gets the key up callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Object.<number, !Array.<Function>>} Callback stack.
	 * @public
	 */
	getKeyUpBindStack: function() {
		return this.keyDown;
	},
	/**
	 * Adds a callback to the key up event.
	 *
	 * @param  {!number} key Key code that triggers the callback.
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addKeyUp: function(key, callback) {
		if (!this.keyUp[key]) {
			this.keyUp[key] = [];
		}
		this.keyUp[key].push(callback);
		Grape2D.InputManager.registerGlobalKeyUp(key, callback);
	},
	/**
	 * Removes a callback from the key up callback stack.
	 *
	 * @param  {!number} key Key code of the key that triggers the
	 *   callback.
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeKeyUp: function(key, callback) {
		if (!this.keyUp[key]) {
			return;
		}
		var indx = this.keyUp[key].indexOf(callback);
		if (indx >= 0) {
			this.keyUp[key].splice(indx, 1);
			Grape2D.InputManager.unregisterGlobalKeyUp(key, callback);
		}
	},
	/**
	 * Gets the key press callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Object.<number, !Array.<Function>>} Callback stack.
	 * @public
	 */
	getKeyPressBindStack: function() {
		return this.keyPress;
	},
	/**
	 * Adds a callback to the key press event.
	 *
	 * @param  {!number} key Key code that triggers the callback.
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addKeyPress: function(key, callback) {
		if (!this.keyPress[key]) {
			this.keyPress[key] = [];
		}
		this.keyPress[key].push(callback);
		Grape2D.InputManager.registerGlobalKeyPress(key, callback);
	},
	/**
	 * Removes a callback from the key press callback stack.
	 *
	 * @param  {!number} key Key code of the key that triggers the
	 *   callback.
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeKeyPress: function(key, callback) {
		if (!this.keyPress[key]) {
			return;
		}
		var indx = this.keyPress[key].indexOf(callback);
		if (indx >= 0) {
			this.keyPress[key].splice(indx, 1);
			Grape2D.InputManager.unregisterGlobalKeyPress(key, callback);
		}
	},
	/**
	 * Gets the drag callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getDragBindStack: function() {
		return this.drag;
	},
	/**
	 * Adds a callback to the drag event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addDrag: function(callback) {
		this.drag.push(callback);
	},
	/**
	 * Removes a callback from the drag callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeDrag: function(callback) {
		var indx = this.drag.indexOf(callback);
		if (indx >= 0) {
			this.drag.splice(this.drag.indexOf(callback), 1);
		}
	},
	/**
	 * Gets the click callback stack, that is binded to the
	 *   renderer.
	 *
	 * @return {!Array.<Function>} Callback stack.
	 * @public
	 */
	getClickBindStack: function() {
		return this.click;
	},
	/**
	 * Adds a callback to the click event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addClick: function(callback) {
		this.click.push(callback);
	},
	/**
	 * Removes a callback from the click callback stack.
	 *
	 * @param  {!Function} callback Function to remove
	 * @public
	 */
	removeClick: function(callback) {
		var indx = this.click.indexOf(callback);
		if (indx >= 0) {
			this.click.splice(this.click.indexOf(callback), 1);
		}
	}
};
/**
 * This function creates a callback function to be
 *   called when a keyboard event occurs.
 *
 * @param  {!Grape2D.Renderer} binding Renderer where the input
 *   manager is bound.
 * @param  {!Array.<Function>} stck List of references to an input
 *   manager callback stack.
 * @return {!Function} Callback to an event.
 * @protected
 * @static
 */
Grape2D.InputManager.bindFn = function(binding, stck) {
	var fn = function(ev) {
		var i = 0,
			evnt = new Grape2D.InputManagerMouseEvent(ev);
		for (; i < stck.length; i++) {
			stck[i](evnt);
		}
	};

	return fn;
};
/**
 * Registers a global callback function, to the resize event. A
 *   resize event is triggered by the window, not the renderer, binded.
 *
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalResize = function(callback) {
	Grape2D.InputManager.globalRegistry.resize.push(callback);
};
/**
 * Unregisters a global callback function, to the resize event, that
 *   has been already registered.
 *
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalResize = function(callback) {
	var indx = Grape2D.InputManager.globalRegistry.resize.indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.resize.splice(indx, 1);
	}
};
/**
 * Registers a global callback function, to the key down event. A
 *   key down event is triggered by the window, not the renderer,
 *   binded.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalKeyDown = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyDown[key]) {
		Grape2D.InputManager.globalRegistry.keyDown[key] = [];
	}
	Grape2D.InputManager.globalRegistry.keyDown[key].push(callback);
};
/**
 * Unregisters a global callback function, to the key down event, that
 *   has been already registered.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalKeyDown = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyDown[key]) {
		return;
	}
	var indx = Grape2D.InputManager.globalRegistry.keyDown[key].indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.keyDown[key].splice(indx, 1);
	}
};
/**
 * Registers a global callback function, to the key up event. A
 *   key up event is triggered by the window, not the renderer,
 *   binded.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalKeyUp = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyUp[key]) {
		Grape2D.InputManager.globalRegistry.keyUp[key] = [];
	}
	Grape2D.InputManager.globalRegistry.keyUp[key].push(callback);
};
/**
 * Unregisters a global callback function, to the key up event, that
 *   has been already registered.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalKeyUp = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyUp[key]) {
		return;
	}
	var indx = Grape2D.InputManager.globalRegistry.keyUp[key].indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.keyUp[key].splice(indx, 1);
	}
};
/**
 * Registers a global callback function, to the key press event. A
 *   key press event is triggered by the window, not the renderer,
 *   binded.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to register.
 * @private
 */
Grape2D.InputManager.registerGlobalKeyPress = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyPress[key]) {
		Grape2D.InputManager.globalRegistry.keyPress[key] = [];
	}
	Grape2D.InputManager.globalRegistry.keyPress[key].push(callback);
};
/**
 * Unregisters a global callback function, to the key press event, that
 *   has been already registered.
 *
 * @param  {!number} key Key code that triggers the callback.
 * @param  {!Function} callback Callback to unregister.
 * @private
 */
Grape2D.InputManager.unregisterGlobalKeyPress = function(key, callback) {
	if (!Grape2D.InputManager.globalRegistry.keyPress[key]) {
		return;
	}
	var indx = Grape2D.InputManager.globalRegistry.keyPress[key].indexOf(callback);
	if (indx >= 0) {
		Grape2D.InputManager.globalRegistry.keyPress[key].splice(indx, 1);
	}
};
/**
 * Returns a function that dispatches the callbacks associated with
 *   key codes.
 *
 * @param  {!Object.<number, Function>} stck Object with the callbacks
 *   associated with the key codes.
 * @return {!Function} Dispatcher function.
 * @private
 */
Grape2D.InputManager.keyDispatcher = function(stck) {
	var kDispFn = function(ev) {
		var key = ev.keyCode;
		if (stck[key]) {
			for (var i = 0; i < stck[key].length; i++) {
				stck[key][i](ev);
			}
		}
	};
	return kDispFn;
};
/**
 * Returns a function that dispatches the callbacks associated with
 *   resize event.
 *
 * @return {!Function} Dispatcher function.
 * @private
 */
Grape2D.InputManager.resizeDispatcher = function() {
	var rDispFn = function(ev) {
		for (var i = 0; i < Grape2D.InputManager.globalRegistry.resize.length; i++) {
			Grape2D.InputManager.globalRegistry.resize[i](ev);
		}
	};
	return rDispFn;
};
/**
 * Setups globals callbacks. It must be called once for this to work.
 *
 * @public
 */
Grape2D.InputManager.setupGlobals = function() {
	if (!Grape2D.NODE) {
		window.addEventListener('resize', Grape2D.InputManager.resizeDispatcher(), false);
		window.addEventListener('keyup', Grape2D.InputManager.keyDispatcher(Grape2D.InputManager.globalRegistry.keyUp), false);
		window.addEventListener('keydown', Grape2D.InputManager.keyDispatcher(Grape2D.InputManager.globalRegistry.keyDown), false);
		window.addEventListener('keypress', Grape2D.InputManager.keyDispatcher(Grape2D.InputManager.globalRegistry.keyPress), false);
	}
};
/**
 * Registry of non-specific events.
 *
 * @type {!Object.<string, !(Array.<!Function>|Object.<number, Function>)>}
 * @private
 * @static
 */
Grape2D.InputManager.globalRegistry = {
	resize: [],
	keyDown: {},
	keyUp: {},
	keyPress: {}
};
/**
 * Key map partially from {@link https://github.com/bitwalker/keys.js}
 *
 * @constant {!Object.<string, number>}
 * @public
 */
Grape2D.InputManager.KEY = {
	'A': 65,
	'B': 66,
	'C': 67,
	'D': 68,
	'E': 69,
	'F': 70,
	'G': 71,
	'H': 72,
	'I': 73,
	'J': 74,
	'K': 75,
	'L': 76,
	'M': 77,
	'N': 78,
	'O': 79,
	'P': 80,
	'Q': 81,
	'R': 82,
	'S': 83,
	'T': 84,
	'U': 85,
	'V': 86,
	'W': 87,
	'X': 88,
	'Y': 89,
	'Z': 90,
	'0': 48,
	'1': 49,
	'2': 50,
	'3': 51,
	'4': 52,
	'5': 53,
	'6': 54,
	'7': 55,
	'8': 56,
	'9': 57,
	'Numpad 0': 96,
	'Numpad 1': 97,
	'Numpad 2': 98,
	'Numpad 3': 99,
	'Numpad 4': 100,
	'Numpad 5': 101,
	'Numpad 6': 102,
	'Numpad 7': 103,
	'Numpad 8': 104,
	'Numpad 9': 105,
	'F1': 112,
	'F2': 113,
	'F3': 114,
	'F4': 115,
	'F5': 116,
	'F6': 117,
	'F7': 118,
	'F8': 119,
	'F9': 120,
	'F10': 121,
	'F11': 122,
	'F12': 123,
	'Backspace': 8,
	'Tab': 9,
	'Enter': 13,
	'SHIFT': 16,
	'CTRL': 17,
	'ALT': 18,
	'META': 91,
	'META_RIGHT': 93,
	'Caps Lock': 20,
	'Esc': 27,
	'Spacebar': 32,
	'Page Up': 33,
	'Page Down': 34,
	'End': 35,
	'Home': 36,
	'Left': 37,
	'Up': 38,
	'Right': 39,
	'Down': 40,
	'Insert': 45,
	'Delete': 46,
	'Num Lock': 144,
	'ScrLk': 145,
	'Pause/Break': 19,
};
//setup the global callbacks
Grape2D.InputManager.setupGlobals();
/**
 * Custom event.
 *
 * @param  {!Event} ev The DOM event.
 * @constructor
 */
Grape2D.InputManagerEvent = function(ev) {
	/**
	 * Raw event.
	 *
	 * @type {!Event}
	 * @private
	 */
	this.raw = ev;
};
Grape2D.InputManagerEvent.prototype = {
	constructor: Grape2D.InputManagerEvent,
	/**
	 * Gets the raw event.
	 *
	 * @return {!Event} The event fired.
	 * @public
	 */
	getRaw: function() {
		return this.raw;
	}
};
/**
 * Mouse event.
 *
 * @param  {!Event} rawEvent Raw DOM event.
 * @extends {Grape2D.InputManagerEvent}
 * @constructor
 */
Grape2D.InputManagerMouseEvent = function(rawEvent){
	Grape2D.InputManagerEvent.call(this, rawEvent);
	var bb = rawEvent.target.getBoundingClientRect();
	/**
	 * Place where the drag event happened. It should be a DOM element
	 *   associated with a {Grape2D.Renderer}.
	 *
	 * @type {EventTarget}
	 * @private
	 */
	this.target = rawEvent.target;
	/**
	 * Position relative to the renderer, where the event was triggered.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector(rawEvent.clientX-bb.left, rawEvent.clientY-bb.top);
	/**
	 * Button that was pressed to trigger the event.
	 * <ol>
	 * <li>Left button.
	 * <li>Mouse wheel.
	 * <li>Right button.
	 * </ol
	 *
	 * @type {!number}
	 * @private
	 */
	this.button = rawEvent.button;
	/**
	 * Mouse wheel value. This value is only used when the <code>
	 *   rawEvent.type == "mousewheel"</code>. If the value is
	 *   positive the wheel was moved upwards, if it's negative
	 *   the wheel was moved downwards.
	 *
	 * @type {!number}
	 * @private
	 */
	this.wheelDelta = 0;
	if(rawEvent.type == "mousewheel"){
		this.wheelDelta = rawEvent.wheelDelta;
	}
};
Grape2D.InputManagerMouseEvent.prototype = Object.create(Grape2D.InputManagerEvent.prototype);
/**
 * Gets the element where the event happened.
 *
 * @return {EventTarget} Element.
 * @public
 */
Grape2D.InputManagerMouseEvent.prototype.getTarget = function(){
	return this.target;
};
/**
 * Gets the position where the event was triggered.
 *
 * @return {!Grape2D.Vector} Position.
 * @public
 */
Grape2D.InputManagerMouseEvent.prototype.getPosition = function(){
	return this.position;
};
/**
 * Gets the wheel data.
 *
 * @return {!number} Wheel data.
 * @public
 */
Grape2D.InputManagerMouseEvent.prototype.getWheelDelta = function(){
	return this.wheelDelta;
};
/**
 * Drag event.
 *
 * @param  {!Event} rawEvent Raw DOM event.
 * @param  {!Grape2D.Vector} start Start position of the drag.
 * @extends {Grape2D.InputManagerEvent}
 * @constructor
 */
Grape2D.InputManagerDragEvent = function(rawEvent, start){
	Grape2D.InputManagerEvent.call(this, rawEvent);
	var bb = rawEvent.target.getBoundingClientRect();
	/**
	 * Element where the drag event happened. It should be a DOM element
	 *   associated with a {Grape2D.Renderer}.
	 *
	 * @type {EventTarget}
	 * @private
	 */
	this.target = rawEvent.target;
	/**
	 * Start position of the dragging event.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.start = new Grape2D.Vector().set(start);
	/**
	 * End position of the dragging event.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.end = new Grape2D.Vector(rawEvent.clientX-bb.left, rawEvent.clientY-bb.top);
	/**
	 * Difference between the end and the start position of the event.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.delta = this.end.clone().sub(this.start);
};
Grape2D.InputManagerDragEvent.prototype = Object.create(Grape2D.InputManagerEvent.prototype);
/**
 * Gets the element where the event happened.
 *
 * @return {EventTarget} Element.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getTarget = function(){
	return this.target;
};
/**
 * Gets the start position of the event.
 *
 * @return {!Grape2D.Vector} Start position.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getStart = function(){
	return this.start;
};
/**
 * Gets the end position of the event.
 *
 * @return {!Grape2D.Vector} End position.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getEnd = function(){
	return this.end;
};
/**
 * Gets the difference between end and start position.
 *
 * @return {!Grape2D.Vector} Difference of positions.
 * @public
 */
Grape2D.InputManagerDragEvent.prototype.getDelta = function(){
	return this.delta;
};
/**
 * An WASD controller is a top-level way to control input.
 *   This allows for a easier way to capture W, A, S, D keys.
 *   This is mostly used to control movement, so with that
 *   in mind, the keys pairs W and S can't have the same state
 *   at the same time, the same goes for the pair A and D.
 *   However it possible to have W with the same state as either
 *   A or D, but not both. Again, the same goes for S.
 *   If a key it's press, lets say W, and it's opposite is also
 *   pressed, in this case S, the controller keeps the state that
 *   indicated that W is pressed. But when the key W is lifted
 *   up (key up event), the controller waits for the next event,
 *   and S is not automatically press (for the controller).
 *
 * @param  {!Grape2D.Renderer} renderer Renderer to bind the events.
 * @constructor
 */
Grape2D.WASDController = function(renderer) {
	/**
	 * 'W' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.wLock = false;
	/**
	 * 'A' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.aLock = false;
	/**
	 * 'S' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.sLock = false;
	/**
	 * 'D' key is locked/pressed.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.dLock = false;
	/**
	 * Input manager.
	 *
	 * @type {!Grape2D.InputManager}
	 * @private
	 */
	this.im = new Grape2D.InputManager(renderer);
	var that = this;
	// W key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.W, function() {
		if (!that.sLock && !that.wLock) {
			that.w();
			that.wLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.W, function() {
		if(that.wLock){
			that.wUp();
		}
		that.wLock = false;
	});
	// S key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.S, function() {
		if (!that.wLock && !that.sLock) {
			that.s();
			that.sLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.S, function() {
		if(that.sLock){
			that.sUp();
		}
		that.sLock = false;
	});
	// A key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.A, function() {
		if (!that.dLock && !that.aLock) {
			that.a();
			that.aLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.A, function() {
		if(that.aLock){
			that.aUp();
		}
		that.aLock = false;
	});
	// D key handlers
	this.im.addKeyDown(Grape2D.InputManager.KEY.D, function() {
		if (!that.aLock && !that.dLock) {
			that.d();
			that.dLock = true;
		}
	});
	this.im.addKeyUp(Grape2D.InputManager.KEY.D, function() {
		if(that.dLock){
			that.dUp();
		}
		that.dLock = false;
	});
};

Grape2D.WASDController.prototype = {
	constructor: Grape2D.WASDController,
	/**
	 * Action for the 'W' key.
	 *
	 * @public
	 */
	w: function() {},
	/**
	 * Action for when the 'W' keys is released.
	 *
	 * @public
	 */
	wUp: function() {},
	/**
	 * Checks if the key 'W' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isW: function() {
		return this.wLock;
	},
	/**
	 * Action for the 'A' key.
	 *
	 * @public
	 */
	a: function() {},
	/**
	 * Action for when the 'A' keys is released.
	 *
	 * @public
	 */
	aUp: function() {},
	/**
	 * Checks if the key 'A' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isA: function() {
		return this.aLock;
	},
	/**
	 * Action for the 'S' key.
	 *
	 * @public
	 */
	s: function() {},
	/**
	 * Action for when the 'S' keys is released.
	 *
	 * @public
	 */
	sUp: function() {},
	/**
	 * Checks if the key 'S' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isS: function() {
		return this.sLock;
	},
	/**
	 * Action for the 'D' key.
	 *
	 * @public
	 */
	d: function() {},
	/**
	 * Action for when the 'D' keys is released.
	 *
	 * @public
	 */
	dUp: function() {},
	/**
	 * Checks if the key 'D' is pressed.
	 *
	 * @return {!boolean} True if it's pressed.
	 * @public
	 */
	isD: function() {
		return this.dLock;
	}
};
/**
 * Camera is used to select the objects to display in a scene.
 *   A camera doesn't rotate or scale objects in the x and y axis,
 *   only the coordinates are changed to the transformation defined.
 *
 * @param {!Object=} options Setup options.
 * @param {!Grape2D.Vector=} options.scale The scale to be applied. There
 *		are two ways to define the scale. This method is one, the other
 *		is defined it directly in the transformation. If the two are set,
 *		then the two are applied.
 * @param {!Grape2D.Vector=} options.lookAt Defines the (center) position,
 *		to where the camera is looking at.
 * @param {!Grape2D.Matrix=} options.transformation Transformation matrix
 *		to be applied to the object coordinates.
 * @constructor
 */
Grape2D.Camera = function(options) {
	options = options || {};
	/**
	 * Scale set by the user, should be defined in the matrix.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.scale = options.scale || new Grape2D.Vector(1, 1);
	/**
	 * The position to where the camera is looking at.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.lookAt = options.lookAt || new Grape2D.Vector();
	/**
	 * The transformation matrix to aply to the object coordinates.
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.transformation = options.transformation || new Grape2D.Matrix();

	/**
	 * Computed matrix
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.cM = new Grape2D.Matrix();
	/**
	 * Inverse of the computed matrix
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.icM = new Grape2D.Matrix();
	this.computeMatrix();
};

Grape2D.Camera.prototype = {
	constructor: Grape2D.Camera,
	/**
	 * Computes the matrix for better performances.
	 *
	 * @protected
	 */
	computeMatrix: function() {
		this.cM = this.transformation.clone();
		//This operations should work fine, and it avoids a multiplication
		//between the _cM matrix and a vector when converting coordinates
		this.cM.v[0] *= this.scale.getX();
		this.cM.v[1] *= this.scale.getX();
		this.cM.v[2] *= this.scale.getX();

		this.cM.v[3] *= this.scale.getY();
		this.cM.v[4] *= this.scale.getY();
		this.cM.v[5] *= this.scale.getY();

		this.icM = this.cM.clone().invert();
	},
	/**
	 * Applies the transformation, on a vector in the World Coordinate
	 * System (WCS), to get a vector in the Viewport (Renderer) Coordinate
	 * System (VSC).
	 *
	 * @param  {!Grape2D.Renderer} renderer The viewport.
	 * @param  {!Grape2D.Vector} vector Vector in the WCS.
	 * @return {!Grape2D.Vector} A vector in the VCS
	 * @public
	 */
	wcsToViewport: function(renderer, vector) {
		var v = this.cM.multiplyByVector(vector.clone().sub(this.getLookAt()));

		v.setX(v.getX()+renderer.getHalfWidth());
		v.setY(v.getY()+renderer.getHalfHeight());

		return v;
	},
	/**
	 * Applies the transformation, on a vector in the Viewport Coordinate
	 * System (VCS), to get a vector in the World Coordinate System (WSC).
	 *
	 * @param  {!Grape2D.Renderer} renderer The viewport.
	 * @param  {!Grape2D.Vector} vector Vector in the VCS.
	 * @return {!Grape2D.Vector} A vector in the WCS
	 * @public
	 */
	viewportToWcs: function(renderer, vector) {
		var v = vector.clone();

		v.setX(v.getX()-renderer.getHalfWidth());
		v.setY(v.getY()-renderer.getHalfHeight());

		v = this.icM.multiplyByVector(v).add(this.getLookAt());

		return v;
	},
	/**
	 * Sets a new scale.
	 *
	 * @param  {!Grape2D.Vector} scale The new scale.
	 * @public
	 */
	rescale: function(scale) {
		this.scale.set(scale);
		this.computeMatrix();
	},
	/**
	 * Sets the center position to where the camera is looking at.
	 *
	 * @param  {!Grape2D.Vector} position The new look at.
	 * @public
	 */
	setLookAt: function(position) {
		this.lookAt.set(position);
	},
	/**
	 * Gets the look at property.
	 *
	 * @return {!Grape2D.Vector} The look at.
	 */
	getLookAt: function() {
		return this.lookAt;
	},
	/**
	 * Gets the current scale. Scale defined in the transformation is
	 * not taken into account.
	 *
	 * @return {!Grape2D.Vector} Scale
	 */
	getScale: function() {
		return this.scale;
	},
	/**
	 * Creates a shape, based on the camera transformation and
	 *   renderer properties.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer.
	 * @return {!Grape2D.Shape} A bounding volume representing the
	 *   camera view region.
	 */
	computeShape: function(renderer) {
		var pos = new Grape2D.Vector().set(this.lookAt),
			w = renderer.getWidth() / this.scale.getX(),
			h = renderer.getHeight() / this.scale.getY();

		return new Grape2D.AABB({
			position: pos,
			width: w,
			height: h
		});
	}
};
/**
 * An aliasing camera avoid drawing objects in "half-points",
 *   for example an object to be drawn in the viewport at
 *   x=0.5 this camera will draw the object at floor(x).
 *
 * @param  {!Object} options Setup options. See {@link Grape2D.Camera}
 *   constructor for more details.
 * @extends {Grape2D.Camera}
 * @constructor
 */
Grape2D.AliasingCamera = function(options){
	Grape2D.Camera.call(this, options);
};

Grape2D.AliasingCamera.prototype = Object.create(Grape2D.Camera.prototype);
/**
 * Floors the components of the result of the
 *   {@link Grape2D.Camera.wcsToViewport} to avoid anti-aliasing by
 *   the renderer. However this method is more specific for the
 *   {@link Grape2D.CanvasRenderer}.
 *   
 * @override
 */
Grape2D.AliasingCamera.prototype.wcsToViewport = function(renderer, vector){
	return Grape2D.Camera.prototype.wcsToViewport.call(this, renderer, vector).use(Grape2D.Math.floor);
};
/**
 * Camera that follows an {@link Grape2D.Object2D}, this means that the camera is always looking at the object (the lookAt property is the same as the object)
 *
 * @param  {!Object} options Setup options. See {@link Grape2D.Camera}
 * @param  {!Grape2D.Object2D} options.objectToFollow Object to be followed by the camera.
 * @extends {Grape2D.Camera}
 * @constructor
 */
Grape2D.FollowingCamera = function(options){
	Grape2D.Camera.call(this, options);
	this.objectToFollow = options.objectToFollow;
};
Grape2D.FollowingCamera.prototype = Object.create(Grape2D.Camera.prototype);
/**
 * @override
 */
Grape2D.FollowingCamera.prototype.getLookAt = function(){
	return this.objectToFollow.getPosition();
};
/**
 * Gets the object to follow.
 *
 * @return {!Grape2D.Object2D} Object that is following.
 * @public
 */
Grape2D.FollowingCamera.prototype.getObjectToFollow = function(){
	return this.objectToFollow;
};
/**
 * Sets the object to follow.
 *
 * @param  {!Grape2D.Object2D} fo Object to follow.
 * @public
 */
Grape2D.FollowingCamera.prototype.setObjectToFollow = function(fo){
	this.objectToFollow = fo;
};

/**
 * Map describes the structure that holds the objects of a scene.
 *   It's an interface, so all implementation details should be
 *   described in higher level classes.
 *
 * @class
 * @interface
 */
Grape2D.Map = function(){};

Grape2D.Map.prototype = {
	constructor: Grape2D.Map,
	/**
	 * Adds an object to the map.
	 *
	 * @param  {!Grape2D.Object2D} obj2d - The object to e added.
	 * @public
	 */
	add: function(obj2d){},
	/**
	 * Removes an object from the map.
	 *
	 * @param  {!Grape2D.Object2D} obj2d - The object to remove.
	 * @public
	 */
	remove: function(obj2d){},
	/**
	 * Query the shape region, in this map.
	 *
	 * @param  {!Grape2D.Shape} shape - The shape to query.
	 * @return {!Array.<Grape2D.Object2D>} All the objects inside the shape.
	 * @public
	 */
	query: function(shape){},
	/**
	 * Query the point in this map.
	 *
	 * @param  {!Grape2D.Vector} vector - The vector to query.
	 * @return {!Array.<Grape2D.Object2D>} All objects that contains the point.
	 * @public
	 */
	queryPoint: function(vector){},
	/**
	 * Queries a ray against the map.
	 *
	 * @param  {!Grape2D.Vector} start Ray start position
	 * @param  {!Grape2D.Vector} direction Direction of the ray
	 * @param  {!number} length Maximum length of the ray.
	 * @return {?Grape2D.Object2D} Object that first encounters the ray.
	 * @public
	 */
	queryRay: function(start, direction, length){},
	/**
	 * Clears the map.
	 *
	 * @public
	 */
	clear: function(){},
	/**
	 * Updates all the objects of the map.
	 *
	 * @param  {!number} dt - Time elapsed.
	 * @param  {!Grape2D.Scene} scene - The scene, that the map represents.
	 * @public
	 */
	update: function(dt, scene){},
	/**
	 * Reconstructs the internal representatio of the map, if needed be.
	 *
	 * @public
	 */
	rebuild: function(){}
};
/**
 * SimpleMap, represents a proof of concept. This is a simple map,
 *   that just implements a simple array to store objects.
 *
 * @implements {Grape2D.Map}
 * @constructor
 */
Grape2D.SimpleMap = function() {
	/**
	 * Objects of the map.
	 *
	 * @type {!Array.<Grape2D.Object2D>}
	 * @private
	 */
	this.objs = [];
};

Grape2D.SimpleMap.prototype = Object.create(Grape2D.Map);

/**
 * @override
 */
Grape2D.SimpleMap.prototype.add = function(object) {
	this.objs.push(object);
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.remove = function(object) {
	this.objs.splice(this.objs.indexOf(object), 1);
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.query = function(region) {
	return this.objs;
};
/**
 * Not implemented.
 * @override
 */
Grape2D.SimpleMap.prototype.queryPoint = function(vector) {
	return this.objs;
};
/**
 * Not implemented.
 * @override
 */
Grape2D.SimpleMap.prototype.queryRay = function(start, direction, length) {
	return null;
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.clear = function() {
	this.objs = [];
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.update = function(dt, scene) {
	for (var i = 0; i < this.objs.length; i++) {
		this.objs[i].update(dt, scene);
	}
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.rebuild = function() {};
/**
 * Collides objects, and returns just if they're colliding, returning
 *   only a bollean giving no other information about the collision.
 *
 * @class
 * @interface
 */
Grape2D.CollisionChecker = function() {};

Grape2D.CollisionChecker.prototype = {
	constructor: Grape2D.CollisionChecker,
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb1 An AABB.
	 * @param  {!Grape2D.AABB} aabb2 The other AABB.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	aabbVsAabb: function(aabb1, aabb2) {},
	/**
	 * Collides an AABB against a Circle.
	 *
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	aabbVsCircle: function(aabb, circle) {},
	/**
	 * Collides an AABB against a Polygon.
	 *
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	aabbVsPolygon: function(aabb, polygon) {},
	/**
	 * Checks if a point is inside an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if the point is inside the AABB.
	 * @public
	 */
	aabbVsPoint: function(aabb, point) {},
	/**
	 * Checks if a ray intersects an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Ray} ray A ray.
	 * @return {!boolean} True if the ray intersects the polygon.
	 * @public
	 */
	aabbVsRay: function(aabb, ray){},
	/**
	 * Collides a Circle against an AABB.
	 *
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	circleVsAabb: function(circle, aabb) {},
	/**
	 * Collides a Circle against another Circle.
	 *
	 * @param  {!Grape2D.Circle} circle1 A circle.
	 * @param  {!Grape2D.Circle} circle2 Another cicle.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	circleVsCircle: function(circle1, circle2) {},
	/**
	 * Collides a Circle against a polygon.
	 *
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	circleVsPolygon: function(circle, polygon) {},
	/**
	 * Checks if a point is inside an Circle.
	 *
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if the point is inside the circle.
	 * @public
	 */
	circleVsPoint: function(circle, point) {},
	/**
	 * Checks if a ray intersects a circle.
	 *
	 * @param  {!Grape2D.Circle} circle A polygon.
	 * @param  {!Grape2D.Ray} ray A ray.
	 * @return {!boolean} True if the ray intersects the polygon.
	 * @public
	 */
	circleVsRay: function(circle, ray){},
	/**
	 * Collides a Polygon against an AABB.
	 *
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	polygonVsAabb: function(polygon, aabb) {},
	/**
	 * Collides a Polygon against a circle.
	 *
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	polygonVsCircle: function(polygon, circle) {},
	/**
	 * Collides a Polygon against another Polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon1 A polygon.
	 * @param  {!Grape2D.Polygon} polygon2 A polygon.
	 * @return {!boolean} True if they're colliding.
	 * @public
	 */
	polygonVsPolygon: function(polygon1, polygon2) {},
	/**
	 * Checks if a point is inside a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if the point is inside the polygon.
	 * @public
	 */
	polygonVsPoint: function(polygon, point) {},
	/**
	 * Checks if a ray intersects a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Ray} ray A ray.
	 * @return {!boolean} True if the ray intersects the polygon.
	 * @public
	 */
	polygonVsRay: function(polygon, ray){}
};
/* global Grape2D */
/**
 * This implements generic methods of the collision checker. Since
 *   from algorithm to algorithm only a few methods may be different.
 *   So only methods envolving polygons should be refined.
 *
 * @implements {Grape2D.CollisionChecker}
 * @constructor
 */
Grape2D.GenericCollisionChecker = function() {};
Grape2D.GenericCollisionChecker.prototype = Object.create(Grape2D.CollisionChecker);
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsAabb = function(aabb1, aabb2) {
	return Grape2D.Math.overlaps({
		min: aabb1.getMinX(),
		max: aabb1.getMaxX()
	}, {
		min: aabb2.getMinX(),
		max: aabb2.getMaxX()
	}) >= 0 && Grape2D.Math.overlaps({
		min: aabb1.getMinY(),
		max: aabb1.getMaxY()
	}, {
		min: aabb2.getMinY(),
		max: aabb2.getMaxY()
	}) >= 0;
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsCircle = function(aabb, circle) {
	var xC = Grape2D.Math.clamp(circle.getPosition().getX(), aabb.getMinX(), aabb.getMaxX()),
		yC = Grape2D.Math.clamp(circle.getPosition().getY(), aabb.getMinY(), aabb.getMaxY());
	return Grape2D.Math.sq(circle.getPosition().getX() - xC) + Grape2D.Math.sq(circle.getPosition().getY() - yC) <= Grape2D.Math.sq(circle.getRadius());
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsPoint = function(aabb, point) {
	return aabb.getMinX() <= point.getX() && aabb.getMaxX() >= point.getX() && aabb.getMinY() <= point.getY() && aabb.getMaxY() >= point.getY();
};
/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsRay = function(aabb, ray) {
	return false;
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsAabb = function(circle, aabb) {
	return this.aabbVsCircle(aabb, circle);
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsCircle = function(circle1, circle2) {
	return Grape2D.Math.sqrt(Grape2D.Math.sq(circle2.getPosition().getX() - circle1.getPosition().getX()) + Grape2D.Math.sq(circle2.getPosition().getY() - circle1.getPosition().getY())) <= (circle1.getRadius() + circle2.getRadius());
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsPoint = function(circle, point) {
	return Grape2D.Math.sqrt(Grape2D.Math.sq(circle.getPosition().getX() - point.getX()) + Grape2D.Math.sq(circle.getPosition().getY() - point.getY())) <= circle.getRadius();
};
/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsRay = function(circle, ray) {
	return false;
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsAabb = function(polygon, aabb) {
	return this.aabbVsPolygon(aabb, polygon);
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsCircle = function(polygon, circle) {
	return this.circleVsPolygon(circle, polygon);
};

/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsPolygon = function(aabb, polygon) {
	return false;
};
/**
 * Naive implementation.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsPolygon = function(circle, polygon) {
	var list = polygon.getComputedVertexList(),
		cPos = circle.getPosition(),
		r = Grape2D.Math.sq(circle.getRadius());
	for (var i = 0; i < list.length; i++) {
		if (list[i].sqDistanceTo(cPos) >= r) {
			return true;
		}
	}
	return false;
};
/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	return false;
};
/**
 * Algorithm based upon Walfram's Demonstration project.
 * {@link http://demonstrations.wolfram.com/AnEfficientTestForAPointToBeInAConvexPolygon/}
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsPoint = function(polygon, point) {
	var list = polygon.getVertexList(),
		tVertex = [],
		i, n;

	tVertex.push(list[0].clone().sub(point));
	for (i = 0, n = 0; i < tVertex.length; ++i) {
		n = (i + 1) % tVertex.length;
		if (n > 0) {
			tVertex.push(list[n].clone().sub(point));
		}
		if (tVertex[n].getX() * tVertex[i].getY() - tVertex[i].getX() * tVertex[n].getY()) {
			return false;
		}
	}
	return true;
};
/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsRay = function(polygon, ray) {
	return false;
};
/**
 * Concrete collision checker, that implements the SAT algorithm.
 *
 *
 * @extends {Grape2D.GenericCollisionChecker}
 * @constructor
 */
Grape2D.SATCollisionChecker = function() {};

Grape2D.SATCollisionChecker.prototype = Object.create(Grape2D.GenericCollisionChecker.prototype);

/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.aabbVsPolygon = function(aabb, polygon) {
	var aabbPolygon = new Grape2D.Polygon({
		vertexList: Grape2D.SATCollisionChecker.aabbToVertexList(aabb)
	});
	return this.polygonVsPolygon(aabbPolygon, polygon);
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	var axis = this.selectAxis(this.computeAxis(polygon1), this.computeAxis(polygon2)),
		p1Intv = this.computeIntervals(polygon1.getComputedVertexList(), axis),
		p2Intv = this.computeIntervals(polygon2.getComputedVertexList(), axis),
		overlap;

	for (var i = 0; i < axis.length; i++) {
		overlap = Grape2D.Math.overlaps(p1Intv[i], p2Intv[i]);
		if (overlap < 0) {
			return false;
		}
	}
	return true;
};
/**
 * Computes the axis of a polygon.
 *
 * @param  {!Grape2D.Polygon} polygon Polygon to compute the axis.
 * @return {!Array.<!Grape2D.Vector>} Array of vectors with the direction of
 *   the axis, perpendicular to the side, and normalized.
 * @public
 */
Grape2D.SATCollisionChecker.prototype.computeAxis = function(polygon) {
	var res = [],
		list = polygon.getComputedVertexList(),
		n, i;
	for (i = 0; i < list.length; i++) {
		n = (i + 1) % list.length;
		res.push(Grape2D.Vector.createFromPoints(list[i], list[n]).normalize().rightNormal());
	}
	return res;
};
/**
 * Select the unique axis in a list.
 *
 * @param  {!Array.<!Grape2D.Vector>} listA A list of axis.
 * @param  {!Array.<!Grape2D.Vector>} listB A list of axis.
 * @return {!Array.<!Grape2D.Vector>} All different axis that are in both
 *   params.
 * @public
 */
Grape2D.SATCollisionChecker.prototype.selectAxis = function(listA, listB) {
	var res = [],
		e;
	for (var i = 0; i < listA.length; i++) {
		res.push(listA[i]);
	}

	for (i = 0, e = true; i < listB.length; i++, e = true) {
		for (var j = 0; j < listA.length; j++) {
			if (res[j].isParallelTo(listB[i])) {
				e = false;
				break;
			}
		}
		if (e) {
			res.push(listB[i]);
		}
	}

	return res;
};
/**
 * Compute the interval that a set of vertexes represent, in an axis.
 *
 * @param  {!Array.<!Grape2D.Vector>} vertexList List of vertexes.
 * @param  {!Array.<!Grape2D.Vector>} axis Axis to receive the
 *   projection of the vertexes.
 * @return {!Object} An object with the properties <code>min</code> and
 *   <code>max</code>
 * @public
 */
Grape2D.SATCollisionChecker.prototype.computeIntervals = function(vertexList, axis) {
	var intrvByAxis = [],
		min = Infinity,
		max = -Infinity,
		aa, ab;

	for (var i = 0; i < axis.length; i++) {
		min = Infinity;
		max = -Infinity;
		for (var j = 0; j < vertexList.length; j++) {
			aa = vertexList[j].dot(axis[i]);
			ab = vertexList[(j + 1) % vertexList.length].dot(axis[i]);
			if (aa > max) {
				max = aa;
			}
			if (aa < min) {
				min = aa;
			}
			if (ab > max) {
				max = ab;
			}
			if (ab < min) {
				min = aa;
			}
		}
		intrvByAxis.push({
			min: min,
			max: max
		});
	}
	return intrvByAxis;
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.aabbVsRay = function(aabb, ray) {
	var rayAxis = ray.getDirection().rightNormal(),
		interval = {
			min: +Infinity,
			max: -Infinity
		}, temp, list = Grape2D.SATCollisionChecker.aabbToVertexList(aabb);
	for (var i = 0; i < list.length; i++) {
		temp = list[i].dot(rayAxis);
		if (temp > interval.max) {
			interval.max = temp;
		}
		if (temp < interval.min) {
			interval.min = temp;
		}
	}
	temp = ray.getStart().dot(rayAxis);
	if (interval.min <= temp && temp <= interval.max) {
		//debugger;
		var ix = ray.getStart().getX(),
			ax = ray.getEnd().getX(),
			iy = ray.getStart().getY(),
			ay = ray.getEnd().getY(),
			x, y;
		if (ix > ax) {
			x = {
				min: ax,
				max: ix
			};
		} else {
			x = {
				min: ix,
				max: ax
			};
		}
		if (iy > ay) {
			y = {
				min: ay,
				max: iy
			};
		} else {
			y = {
				min: iy,
				max: ay
			};
		}
		return Grape2D.Math.overlaps(x, {
			min: aabb.getMinX(),
			max: aabb.getMaxX()
		}) >= 0 && Grape2D.Math.overlaps(y, {
			min: aabb.getMinY(),
			max: aabb.getMaxY()
		}) >= 0;
	} else {
		return false;
	}
};
/**
 * A cached list of vertexes. This avoids the creation of a list
 *   and four {@link Grape2D.Vector}. This is shared with all
 *   instances of collision checker, parallel usage can produce
 *   unexpected results.
 *
 * @type {!Array.<!Grape2D.Vector>}
 * @private
 * @static
 */
Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST = [
	new Grape2D.Vector(),
	new Grape2D.Vector(),
	new Grape2D.Vector(),
	new Grape2D.Vector()
];
/**
 * Returns a vertex list, with length four, with vertexes of
 *   an AABB.
 *
 * @param  {!Grape2D.AABB} aabb An AABB.
 * @return {!Array.<!Grape2D.Vector>} Vertex list of an AABB.
 *   The result is {@link Grape2D.SATCollisionChecker#SHARED_AABB_TO_VERTEX_LIST}
 * @private
 */
Grape2D.SATCollisionChecker.aabbToVertexList = function(aabb) {
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[0].setX(aabb.getMinX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[0].setY(aabb.getMinY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[1].setX(aabb.getMinX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[1].setY(aabb.getMaxY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[2].setX(aabb.getMaxX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[2].setY(aabb.getMinY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[3].setX(aabb.getMaxX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[3].setY(aabb.getMaxY());
	return Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST;
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.circleVsRay = function(circle, ray) {
	var ptv = circle.getPosition().clone().sub(ray.getStart()),
		projv = ptv.dot(ray.getDirection()),
		closest;
	if (projv < 0) {
		closest = ray.getStart().clone();
	} else if (projv >= ray.getLength()) {
		closest = ray.getEnd().clone();
	} else {
		closest = ray.getDirection().clone().multiplyByScalar(projv).add(ray.getStart());
	}
	closest.negate().add(circle.getPosition());
	return closest.lengthSquared() <= Grape2D.Math.sq(circle.getRadius());
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.polygonVsRay = function(polygon, ray) {
	var direction = ray.getDirection(),
		rayAxis = direction.rightNormal(),
		polist = polygon.getComputedVertexList(),
		itv = {
			min: 0,
			max: 0
		}, pItv, temp, ia, ib;

	pItv = this.computeIntervals(polist, [rayAxis])[0];
	temp = ray.getStart().dot(rayAxis);
	if (pItv.min <= temp && temp <= pItv.max) {
		pItv = this.computeIntervals(polist, [direction])[0];
		ia = ray.getStart().dot(direction);
		ib = ray.getEnd().dot(direction);
		if (ia > ib) {
			itv.max = ia;
			itv.min = ib;
		} else {
			itv.max = ib;
			itv.min = ia;
		}
		return Grape2D.Math.overlaps(pItv, itv) >= 0;
	} else {
		return false;
	}
};
/**
 * Dispatch the collisions, providing a simple interface.
 *
 * @class
 */
Grape2D.CollisionDispatcher = {
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb1 An AABB.
	 * @param  {!Grape2D.AABB} aabb2 Another AABB.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsAabb: function(cchecker, aabb1, aabb2) {
		return cchecker.aabbVsAabb(aabb1, aabb2);
	},
	/**
	 * Collides an AABB against a Circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsCircle: function(cchecker, aabb, circle) {
		return cchecker.aabbVsCircle(aabb, circle);
	},
	/**
	 * Collides an AABB against a Polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsPolygon: function(cchecker, aabb, polygon) {
		return cchecker.aabbVsPolygon(aabb, polygon);
	},
	/**
	 * Checks if a point is inside an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if inside.
	 * @static
	 * @private
	 */
	aabbVsPoint: function(cchecker, aabb, point) {
		return cchecker.aabbVsPoint(aabb, point);
	},
	/**
	 * Checks if a ray intersects an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Ray} ray A ray.
	 * @return {!boolean} True if intersects.
	 * @static
	 * @private
	 */
	aabbVsRay: function(cchecker, aabb, ray) {
		return cchecker.aabbVsRay(aabb, ray);
	},
	/**
	 * Collides a Circle against an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	circleVsAabb: function(cchecker, circle, aabb) {
		return cchecker.circleVsAabb(circle, aabb);
	},
	/**
	 * Collides a Circle against another Circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle1 A circle.
	 * @param  {!Grape2D.Circle} circle2 A circle.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	circleVsCircle: function(cchecker, circle1, circle2) {
		return cchecker.circleVsCircle(circle1, circle2);
	},
	/**
	 * Collides a circle against a polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	circleVsPolygon: function(cchecker, circle, polygon) {
		return cchecker.circleVsPolygon(circle, polygon);
	},
	/**
	 * Checks if a point is inside a circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if inside.
	 * @static
	 * @private
	 */
	circleVsPoint: function(cchecker, circle, point) {
		return cchecker.circleVsPoint(circle, point);
	},
	/**
	 * Checks if a ray intersects a circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Ray} ray A ray.
	 * @return {!boolean} True if intersects.
	 * @static
	 * @private
	 */
	circleVsRay: function(cchecker, circle, ray) {
		return cchecker.circleVsRay(circle, ray);
	},
	/**
	 * Collides a polygon against an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	polygonVsAabb: function(cchecker, polygon, aabb) {
		return cchecker.polygonVsAabb(polygon, aabb);
	},
	/**
	 * Collides a polygon against a circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	polygonVsCircle: function(cchecker, polygon, circle) {
		return cchecker.polygonVsCircle(polygon, circle);
	},
	/**
	 * Collides a polygon against another polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon1 A polygon.
	 * @param  {!Grape2D.Polygon} polygon2 Another polygon.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	polygonVsPolygon: function(cchecker, polygon1, polygon2) {
		return cchecker.polygonVsPolygon(polygon1, polygon2);
	},
	/**
	 * Checks if a point is inside a polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if inside.
	 * @static
	 * @private
	 */
	polygonVsPoint: function(cchecker, polygon, point) {
		return cchecker.polygonVsPoint(polygon, point);
	},
	/**
	 * Checks if a ray intersects a polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Ray} ray A ray.
	 * @return {!boolean} True if intersects.
	 * @static
	 * @private
	 */
	polygonVsRay: function(cchecker, polygon, ray) {
		return cchecker.polygonVsRay(polygon, ray);
	},
	/**
	 * Object used to dispatch the collision.
	 *
	 * @type {!Object}
	 * @private
	 * @static
	 */
	dcache: {},
	/**
	 * Dispatches a collision between two primitives.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker A collision checker.
	 * @param  {!(Grape2D.Shape|Grape2D.Vector|Grape2D.Ray)} a Shape to test.
	 * @param  {!(Grape2D.Shape|Grape2D.Vector|Grape2D.Ray)} b Shape to collide with the first
	 *   one, or a point to check it it's inside.
	 * @return {!boolean} Result of the collision.
	 * @public
	 */
	dispatch: function(cchecker, a, b) {
		return Grape2D.CollisionDispatcher.dcache[a.getStaticType()][b.getStaticType()](cchecker, a, b);
	}
};

Grape2D.CollisionDispatcher.dcache = {
	"AABB": {
		"AABB": Grape2D.CollisionDispatcher.aabbVsAabb,
		"Circle": Grape2D.CollisionDispatcher.aabbVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.aabbVsPolygon,
		"Vector": Grape2D.CollisionDispatcher.aabbVsPoint,
		"Ray": Grape2D.CollisionDispatcher.aabbVsRay
	},
	"Circle": {
		"AABB": Grape2D.CollisionDispatcher.circleVsAabb,
		"Circle": Grape2D.CollisionDispatcher.circleVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.circleVsPolygon,
		"Vector": Grape2D.CollisionDispatcher.circleVsPoint,
		"Ray": Grape2D.CollisionDispatcher.circleVsRay
	},
	"Polygon": {
		"AABB": Grape2D.CollisionDispatcher.polygonVsAabb,
		"Circle": Grape2D.CollisionDispatcher.polygonVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.polygonVsPolygon,
		"Vector": Grape2D.CollisionDispatcher.polygonVsPoint,
		"Ray": Grape2D.CollisionDispatcher.polygonVsRay
	}
};
/**
 * Singleton to store the in-use collision checker strategy.
 *
 * @class
 */
Grape2D.CollisionCheckerSingleton = {
	/**
	 * Collision checker instance.
	 *
	 * @type {!Grape2D.CollisionChecker}
	 * @private
	 * @static
	 */
	instance: new Grape2D.SATCollisionChecker(),
	/**
	 * Gets the collision checker instance.
	 *
	 * @return {!Grape2D.CollisionChecker} The instance.
	 * @public
	 * @static
	 */
	getCollisionChecker: function(){
		return Grape2D.CollisionCheckerSingleton.instance;
	},
	/**
	 * Sets the collision checker instance.
	 *
	 * @param  {!Grape2D.CollisionChecker} instance The new instance.
	 * @public
	 * @static
	 */
	setCollisionChecker: function(instance){
		Grape2D.CollisionCheckerSingleton.instance = instance;
	},
	/**
	 * Collides two shpaes. It is syntax sugar for 
	 *   <code>shapeA.collide(Grape2D.CollisionCheckerSingleton.getInstance(),
	 *   shapeB);</code>
	 *
	 * @param  {!(Grape2D.Shape|Grape2D.Vector)} a Shape or point
	 * @param  {!(Grape2D.Shape|Grape2D.Vector)} b Another shape or point
	 * @return {!boolean} Result of the collision test.
	 * @public
	 * @static
	 */
	collide: function(a, b){
		return Grape2D.CollisionDispatcher.dispatch(Grape2D.CollisionCheckerSingleton.instance, a, b);
	}
};
/**
 * A bounding volume hierarchy (BVH) organizes a bounding volumes according
 *   to an hierarchy.
 *   
 * @extends {Grape2D.Map}
 * @class
 * @interface
 */
Grape2D.BVHTree = function(){};

Grape2D.BVHTree.prototype = Object.create(Grape2D.Map.prototype);
/**
 * With the top down approach the area of the bounding volume will reduce
 *   at every level.
 *
 * @param  {?Array.<Grape2D.Object2D>} objs List with objects. If objects are provided then tree will be build.
 *
 * @implements {Grape2D.BVHTree}
 * @constructor
 */
Grape2D.TopDownBVHTree = function(objs) {
	/**
	 * Objects of the tree
	 * @type {!Array.<Grape2D.Object2D>}
	 * @private
	 */
	this.objs = objs || [];
	/**
	 * The root node of the tree.
	 * @type {?Grape2D.TopDownBVHNode}
	 * @private
	 */
	this.rootNode = null;
	//builds the tree if needed be.
	if (this.objs.length) {
		this.rebuild();
	}
};

Grape2D.TopDownBVHTree.prototype = Object.create(Grape2D.BVHTree.prototype);
/**
 * (Re)Builds the tree, based on the objects present on the stack.
 *
 * @override
 */
Grape2D.TopDownBVHTree.prototype.rebuild = function() {
	this.rootNode = new Grape2D.TopDownBVHNode(null, this.objs);
};
/**
 * Adding objects to the tree will not cause it to rebuild.
 * @override
 */
Grape2D.TopDownBVHTree.prototype.add = function(obj) {
	this.objs.push(obj);
};
/**
 * Removing objects from the tree will not cause it to rebuild.
 * @override
 */
Grape2D.TopDownBVHTree.prototype.remove = function(obj) {
	this.objs.splice(this.objs.indexOf(obj), 1);
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.query = function(bv) {
	if (this.rootNode) {
		return this.rootNode.query(bv);
	} else {
		return [];
	}
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.queryPoint = function(vector) {
	if (this.rootNode) {
		return this.rootNode.query(vector);
	} else {
		return [];
	}
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.queryRay = function(ray) {
	if (this.rootNode) {
		return this.rootNode.queryRay(ray);
	} else {
		return null;
	}
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.clear = function() {
	this.objs = [];
	this.rootNode = null;
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.update = function(dt, scene) {
	for (var i = 0; i < this.objs.length; i++) {
		this.objs[i].update(dt, scene);
	}
};
/**
 * Gets the root node of the tree
 *
 * @return  {?Grape2D.TopDownBVHNode} Root node of the tree.
 * @public
 */
Grape2D.TopDownBVHTree.prototype.getRootNode = function() {
	return this.rootNode;
};
/**
 * Maximum depth of the tree.
 *
 * @constant {!number}
 * @public
 */
Grape2D.TopDownBVHTree.MAX_DEPTH = 5;
/**
 * Minimum of objects per leaf.
 * @constant {!number}
 * @public
 */
Grape2D.TopDownBVHTree.DEFAULT_PER_LEAF = 2;
/**
 * Node of a top down BVH.
 *
 * @param  {?Grape2D.TopDownBVHNode} parent Parent node, or null, it it's
 *   the root node.
 * @param  {!Array.<Grape2D.Object2D>} objects Objects to be added to the
 *   node.
 *
 * @constructor
 */
Grape2D.TopDownBVHNode = function(parent, objects) {
	/**
	 * Bounding volume.
	 *
	 * @type {!Grape2D.Shape}
	 * @private
	 */
	this.bv = Grape2D.BVFactorySingleton.getPlaceHolder();
	/**
	 * True if it's a leaf (end point of a tree), false if it's a node.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.leaf = false;
	/**
	 * Objects of a leaf.
	 *
	 * @type {!Array.<Grape2D.Object2D>}
	 * @private
	 */
	this.objects = [];

	/**
	 * Parent node.
	 *
	 * @type {?Grape2D.TopDownBVHNode}
	 * @private
	 */
	this.parent = parent;
	/**
	 * Left child of a node.
	 *
	 * @type {?Grape2D.TopDownBVHNode}
	 * @private
	 */
	this.left = null;
	/**
	 * Right child of a node.
	 *
	 * @type {?Grape2D.TopDownBVHNode}
	 * @private
	 */
	this.right = null;
	/**
	 * Depth of the current node.
	 *
	 * @type {!number}
	 * @private
	 */
	this.depth = parent ? parent.getDepth() + 1 : 0;
	//computes what kind of node this is,
	//and what to do with it.
	this.compute(objects);
};

Grape2D.TopDownBVHNode.prototype = {
	constructor: Grape2D.TopDownBVHNode,
	/**
	 * Makes this instance a leaf or a node.
	 *
	 * @param  {!Array.<Grape2D.Object2D>} objects List of objects
	 *   to separate through the node.
	 * @public
	 */
	compute: function(objects) {
		var i;
		if (objects.length <= Grape2D.TopDownBVHTree.DEFAULT_PER_LEAF || this.depth >= Grape2D.TopDownBVHTree.MAX_DEPTH) {
			//this instance will be a leaf
			this.leaf = true;
			for (i = 0; i < objects.length; i++) {
				this.objects.push(objects[i]);
			}
		} else {
			//this instance will be a node
			var r = Grape2D.BVHStrategySingleton.getStrategy().solve(objects),
				factory = Grape2D.BVFactorySingleton.getFactory();

			if (r.endState) {
				//nop it's a leaf after all.
				this.leaf = true;
				for (i = 0; i < objects.length; i++) {
					this.objects.push(objects[i]);
				}
				return;
			}

			this.bv = factory.merge(objects[0].getBoundingBox(), objects[1].getBoundingBox());
			for (i = 2; i < objects.length; i++) {
				this.bv = factory.merge(this.bv, objects[i].getBoundingBox());
			}

			this.left = new Grape2D.TopDownBVHNode(this, r.left);
			this.right = new Grape2D.TopDownBVHNode(this, r.right);
		}
	},
	/**
	 * Checks if it's a leaf
	 *
	 * @return {!boolean} True if it's a leaf.
	 * @public
	 */
	isLeaf: function() {
		return this.leaf;
	},
	/**
	 * Gets the bounding volume.
	 *
	 * @return {!Grape2D.Shape} The bounding volume.
	 * @public
	 */
	getBoundingVolume: function() {
		return this.bv;
	},
	/**
	 * Gets the parent.
	 *
	 * @return {?Grape2D.TopDownBVHNode} The parent, or null if it's the root.
	 * @public
	 */
	getParent: function() {
		return this.parent;
	},
	/**
	 * Gets the objects, if it's a leaf.
	 *
	 * @return {!Array.<Grape2D.Object2D>} List of the objects.
	 * @public
	 */
	getObjects: function() {
		return this.objects;
	},
	/**
	 * Gets the left side of the node.
	 *
	 * @return {?Grape2D.TopDownBVHNode} Left side node, or null, if it's a
	 *   leaf.
	 * @public
	 */
	getLeft: function() {
		return this.left;
	},
	/**
	 * Gets the right side of the node.
	 *
	 * @return {?Grape2D.TopDownBVHNode} Right side node, or null, if it's a
	 *   leaf.
	 * @public
	 */
	getRight: function() {
		return this.right;
	},
	/**
	 * Queries a shape or a point to find if it is colliding.
	 *   If so, returns the {@link Grape2D.Object2D} that are colliding with
	 *   the shape.
	 *
	 * @param  {!(Grape2D.Shape|Grape2D.Vector)} shape Shape of to query.
	 * @return {!Array.<Grape2D.Object2D>} Objects that are colliding with
	 *   the shape.
	 */
	query: function(shape) {
		var res = [],
			i;
		if (this.leaf) {
			for (i = 0; i < this.objects.length; i++) {
				if (Grape2D.CollisionCheckerSingleton.collide(this.objects[i].getBoundingBox(), shape)) {
					res.push(this.objects[i]);
				}
			}
		} else {
			if (Grape2D.CollisionCheckerSingleton.collide(this.bv, shape)) {
				var list = this.left.query(shape);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				list = this.right.query(shape);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				return res;
			}
		}
		return res;
	},
	queryRay: function(ray) {
		var i;
		if (this.leaf) {
			for (i = 0; i < this.objects.length; i++) {
				if (Grape2D.CollisionCheckerSingleton.collide(this.objects[i].getBoundingBox(), ray)) {
					return this.objects[i];
				}
			}
		} else {
			if (Grape2D.CollisionCheckerSingleton.collide(this.bv, ray)) {
				var res = this.left.queryRay(ray);
				if (res) {
					return res;
				}

				res = this.right.queryRay(ray);
				if (res) {
					return res;
				}
			}
		}
		return null;
	},
	/**
	 * Gets the depth of the node, in the context of the tree.
	 *
	 * @return {!number} Depth of the node.
	 */
	getDepth: function() {
		return this.depth;
	}
};
/**
 * A BVH Strategy is used to sort and divide objects according to a 
 *   set of rules.
 *
 * @class
 * @interface
 */
Grape2D.BVHStrategy = function(){};
Grape2D.BVHStrategy.prototype = {
	constructor: Grape2D.BVHStrategy,
	/**
	 * Applies the strategy to the a set of objects.
	 *
	 * @param  {!Array.<Grape2D.Object2D>} objects List of objects to
	 *   separate.
	 * @return {!Object} An object with left and right properties,
	 *   each property is an array, that contains {@link Grape2D.Object2D}
	 *   or are empty.
	 * @public
	 */
	solve: function(objects){}
};
/**
 * The median cut algorithm splits the set in two equal parts, along the
 *   selected axis. It creates a more balanced tree. However unbalanced
 *   trees perform better.
 *
 * @implements {Grape2D.BVHStrategy}
 * @constructor
 */
Grape2D.MedianCutBVHStrategy = function() {};

Grape2D.MedianCutBVHStrategy.prototype = Object.create(Grape2D.BVHStrategy.prototype);

/**
 * This heuristic does the follow:
 * <ol>
 * <li> Compute the bounding box of the set of AABB center points
 * <li> Choose the plane that splits the box in half along the longest
 *   axis
 * <li> Objects at the left of the axis will be places at the left side,
 *   the others at the right side.
 * <li> If the bounding box has width and height of 0 then a flag is set
 *   to indicate that the objects should stay at the same leaf.
 * Heuristic described by Gino van den Bergen (gino@dtecta.com), from his GDC
 *   conference titled "Physics for Game Programmers: Spatial Data Structures".
 * @override
 */
Grape2D.MedianCutBVHStrategy.prototype.solve = function(objects) {
	var result = {
		left: [],
		right: [],
		endState: false
	};

	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity,
		axis = 0,
		temp;


	for (var i = 0; i < objects.length; i++) {
		temp = objects[i].getBoundingBoxPosition();
		if (minX > temp.getX()) {
			minX = temp.getX();
		}
		if (maxX < temp.getX()) {
			maxX = temp.getX();
		}
		if (minY > temp.getY()) {
			minY = temp.getY();
		}
		if (maxY < temp.getY()) {
			maxY = temp.getY();
		}
	}

	if ((maxX - minX) === 0 && (maxY - minY) === 0) {
		result.endState = true;
		return result;
	}

	if ((Grape2D.Math.abs(maxX) - Grape2D.Math.abs(minX)) >= (Grape2D.Math.abs(maxY) - Grape2D.Math.abs(minY))) {
		axis = minX + Grape2D.Math.abs((maxX - minX) / 2);

		for (i = 0; i < objects.length; i++) {
			temp = objects[i].getBoundingBoxPosition();
			if (temp.getX() > axis) {
				result.right.push(objects[i]);
			} else {
				result.left.push(objects[i]);
			}
		}
	} else {
		axis = minY + Grape2D.Math.abs((maxY - minY) / 2);

		for (i = 0; i < objects.length; i++) {
			temp = objects[i].getBoundingBoxPosition();
			if (temp.getY() > axis) {
				result.right.push(objects[i]);
			} else {
				result.left.push(objects[i]);
			}
		}
	}
	return result;
};
/**
 * A singleton for BVH strategies.
 *
 * @class
 */
Grape2D.BVHStrategySingleton = {
	/**
	 * Strategy in use.
	 * 
	 * @type {!Grape2D.BVHStrategy}
	 * @private
	 * @static
	 */
	strategy: new Grape2D.MedianCutBVHStrategy(),
	/**
	 * Sets a strategy.
	 * 
	 * @param  {!Grape2D.BVHStrategy} strategy The new strategy.
	 * @static
	 * @public
	 */
	setStrategy: function(strategy){
		Grape2D.BVHStrategySingleton.strategy = strategy;
	},
	/**
	 * Gets the strategy.
	 * 
	 * @return {!Grape2D.BVHStrategy} The strategy
	 * @static
	 * @public
	 */
	getStrategy: function(){
		return Grape2D.BVHStrategySingleton.strategy;
	}
};
/**
 * Creates bounding volumes based in an input object.
 *
 * @class
 * @interface
 */
Grape2D.BVFactory = function() {};

Grape2D.BVFactory.prototype = {
	constructor: Grape2D.BVFactory,
	/**
	 * Creates a shape, based on the type set, from an {@link Grape2D.AABB}.
	 * 
	 * @param  {!Grape2D.AABB} aabb The object.
	 * @return {!Grape2D.Shape} Shape based on the type of the factory.
	 * @public
	 */
	createFromAABB: function(aabb) {},
	/**
	 * Creates a shape, based on the type set, from an {@link Grape2D.Circle}.
	 * 
	 * @param  {!Grape2D.Circle} circle The object.
	 * @return {!Grape2D.Shape} Shape based on the type of the factory.
	 * @public
	 */
	createFromCircle: function(circle) {},
	/**
	 * Creates a shape, based on the type set, from an {@link Grape2D.Polygon}.
	 * 
	 * @param  {!Grape2D.Polygon} polygon The object.
	 * @return {!Grape2D.Shape} Shape based on the type of the factory.
	 * @public
	 */
	createFromPolygon: function(polygon) {},
	/**
	 * Creates a shape for a scene, based on the renderer and the camera
	 *   being used.
	 *
	 * @param  {!Grape2D.Renderer} renderer Renderer to where the scene
	 *   will be rendered.
	 * @param  {!Grape2D.Camera} camera Camera that is capturing the scene.
	 * @return {!Grape2D.Shape} Shape based on the type of the factory.
	 * @public
	 */
	createSceneBV: function(renderer, camera) {},
	/**
	 * Returns a place holder shape, of the type of the factory.
	 *   It should only be used to avoid using <code>null</code> to represent
	 *   bounding volumes temporarily. Shouldn't create a new instance every
	 *   time this method is called.
	 *
	 * @return {!Grape2D.Shape} A shape has a place holder.
	 * @public
	 */
	getPlaceHolder: function(){}
};
/**
 * Creates bounding volumes based in an input object.
 *
 * @implements {Grape2D.BVFactory}
 * @constructor
 */
Grape2D.AabbBVFactory = function() {};

Grape2D.AabbBVFactory.prototype = Object.create(Grape2D.BVFactory.prototype);
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createFromAABB = function(aabb) {
	return aabb;
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createFromCircle = function(circle) {
	var w = circle.getRadius() * 2;
	return new Grape2D.AABB({
		position: circle.getPosition(),
		width: w,
		height: w
	});
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createFromPolygon = function(polygon) {
	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity,
		list = polygon.getVertexList(),
		temp, x, y;


	for (var i = 0; i < list.length; i++) {
		temp = list[i];
		if (minX > temp.getX()) {
			minX = temp.getX();
		}
		if (maxX < temp.getX()) {
			maxX = temp.getX();
		}
		if (minY > temp.getY()) {
			minY = temp.getY();
		}
		if (maxX < temp.getY()) {
			maxY = temp.getY();
		}
	}

	x = maxX - minX;
	y = maxY - minY;

	return new Grape2D.AABB({
		position: new Grape2D.Vector((x / 2) + x, (y / 2) + y),
		width: x,
		height: y
	});
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createSceneBV = function(renderer, camera) {
	return new Grape2D.AABB({
		position: camera.getLookAt(),
		width: renderer.getWidth() / camera.getScale().getX(),
		height: renderer.getHeight() / camera.getScale().getY()
	});
};
/**
 * Merge two AABBs into one, so that the one created bounds
 *   the other two.
 *
 * @param  {!Grape2D.AABB} aabb1 An AABB.
 * @param  {!Grape2D.AABB} aabb2 Another AABB.
 * @return {!Grape2D.AABB} An AABB that bounds the other two.
 */
Grape2D.AabbBVFactory.prototype.merge = function(aabb1, aabb2) {
	var ab1 = aabb1.createBV(this),
		ab2 = aabb2.createBV(this);
	var minx = Grape2D.Math.min(ab1.getMinX(), ab2.getMinX()),
		maxx = Grape2D.Math.max(ab1.getMaxX(), ab2.getMaxX()),
		miny = Grape2D.Math.min(ab1.getMinY(), ab2.getMinY()),
		maxy = Grape2D.Math.max(ab1.getMaxY(), ab2.getMaxY());
	return new Grape2D.AABB({
		minX: minx,
		minY: miny,
		maxX: maxx,
		maxY: maxy
	});
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.getPlaceHolder = function() {
	return Grape2D.AabbBVFactory.PLACE_HOLDER;
};
/**
 * Static palce holder for {@link Grape2D.AabbBVFactory.getPlaceHolder}
 *
 * @type {Grape2D.AABB}
 * @private
 * @static
 */
Grape2D.AabbBVFactory.PLACE_HOLDER = new Grape2D.AABB({
	width: 0,
	height: 0
});
/**
 * Holds the current bounding volume factory {@link Grape2D.BVFactory}
 *
 * @class
 */
Grape2D.BVFactorySingleton = {
	/**
	 * Factory being used.
	 * 
	 * @type {!Grape2D.BVFactory}
	 * @private
	 * @static
	 */
	bvfactory: new Grape2D.AabbBVFactory(),
	/**
	 * Gets the factory
	 * 
	 * @return {!Grape2D.BVFactory} A bounding volume factory instance.
	 * @public
	 * @static
	 */
	getFactory: function(){
		return Grape2D.BVFactorySingleton.bvfactory;
	},
	/**
	 * Sets the factory
	 * 
	 * @param  {!Grape2D.BVFactory} factory A bounding volume factory
	 *   instance.
	 * @public
	 * @static
	 */
	setFactory: function(factory){
		Grape2D.BVFactorySingleton.bvfactory = factory;
	},
	/**
	 * Sintax sugar for <code>shape.createBV(Grape2D.BVFactorySingleton.getFactory())</code>.
	 * 
	 * @param  {!Grape2D.Shape} shape Shape to create a bounding volume
	 * @return {!Grape2D.Shape} Bounding volume.
	 * @public
	 * @static
	 */
	create: function(shape){
		return shape.createBV(Grape2D.BVFactorySingleton.bvfactory);
	},
	/**
	 * Returns a place holder shape, of the type of the factory.
	 *   It should only be used to avoid using <code>null</code>
	 *
	 * @return {!Grape2D.Shape} A shape has a place holder.
	 * @public
	 * @static
	 */
	getPlaceHolder: function(){
		return Grape2D.BVFactorySingleton.bvfactory.getPlaceHolder();
	}
};
/**
 * Describes a texture.
 *
 * @class
 * @interface
 */
Grape2D.ITexture = function() {};

Grape2D.ITexture.prototype = {
	constructor: Grape2D.ITexture,
	/**
	 * Gets the width.
	 *
	 * @return {!number} Width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width.
	 *
	 * @return {!number} Half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width.
	 *
	 * @param  {!number} width New width.
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets height.
	 *
	 * @return {!number} Height.
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height.
	 *
	 * @return {!number} Half height.
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height.
	 *
	 * @param  {!number} height New height.
	 * @public
	 */
	setHeight: function(height) {},
	/**
	 * Renderers the texture to a renderer, based upon a camera.
	 *
	 * @param  {!Grape2D.Renderer} renderer Renderer to render the texture.
	 * @param  {!Grape2D.Vector} position Position to render the texture
	 *   in the renderer.
	 * @public
	 */
	render: function(renderer, position) {}
};
/**
 * Texture represents an "image", ready to be rendered to
 *   a renderer, with high efficiency. The efficiency comes
 *   from the fact that a cached image can be renderer faster.
 *
 * @param {!Object=} options Object with the options to instantiate a texture.
 * @param {!Image=} options.image Loads a DOM image object to the buffer.
 *		This is the first choice, when providing other options.
 * @param {!Grape2D.Texture=} options.useTexture With this method the
 *		same buffer is shared by the texture provided.
 *
 * @implements {Grape2D.ITexture}
 * @constructor
 */
Grape2D.Texture = function(options) {
	options = options || {};
	/**
	 * The width of the texture.
	 *
	 * @type {!number}
	 * @private
	 */
	this.width = 2;
	/**
	 * The half width.
	 *
	 * @type {!number}
	 * @private
	 */
	this.hwidth = 1;
	/**
	 * The height.
	 *
	 * @type {!number}
	 * @private
	 */
	this.height = 2;
	/**
	 * The half width.
	 *
	 * @type {!number}
	 * @private
	 */
	this.hheight = 1;

	/**
	 * The canvas buffer. It is always a 2D renderer.
	 *
	 * @type {!Grape2D.CanvasRenderer}
	 * @private
	 */
	this.buffer = new Grape2D.CanvasRenderer();
	if (options.image) {
		this.bufferImage(options.image);
	} else if (options.useTexure) {
		this.buffer = options.useTexure;
	}

};

Grape2D.Texture.prototype = Object.create(Grape2D.ITexture);
/**
 * @override
 */
Grape2D.Texture.prototype.getWidth = function() {
	return this.width;
};
/**
 * @override
 */
Grape2D.Texture.prototype.getHeight = function() {
	return this.height;
};
/**
 * @override
 */
Grape2D.Texture.prototype.setWidth = function(width) {
	this.width = width;
	this.hwidth = this.width / 2;
};
/**
 * @override
 */
Grape2D.Texture.prototype.setHeight = function(height) {
	this.height = height;
	this.hheight = this.height / 2;
};
/**
 * @override
 */
Grape2D.Texture.prototype.getHalfWidth = function() {
	return this.hwidth;
};
/**
 * @override
 */
Grape2D.Texture.prototype.getHalfHeight = function() {
	return this.hheight;
};
/**
 * Gets the buffer of the texture.
 *
 * @return {?} The buffer.
 * @public
 */
Grape2D.Texture.prototype.getBuffer = function() {
	return this.buffer.canvas.canvas;
};
/**
 * Changes the internal buffer and load an image, with it's
 *   current dimensions. The dimensions.
 *
 * @param  {!Image} image The DOM image object with the image.
 *		The image must be loaded. Unexpected results if not.
 * @protected
 */
Grape2D.Texture.prototype.bufferImage = function(image) {
	this.setWidth(image.width);
	this.setHeight(image.height);

	this.buffer = new Grape2D.CanvasRenderer();
	this.buffer.renderImage(image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
};
/**
 * @override
 */
Grape2D.Texture.prototype.render = function(renderer, position){
	renderer.renderTexture(this, position);
};
/**
 * Creates a Texture and loads an image asynchronously.
 *
 * @param  {!string} src - The complete path to the image.
 * @param  {!Function} callback - A function to be called after the
 *		onload event of the image.
 * @return {!Grape2D.Texture} The texture object, initialy it has
 *		an empty buffer, the buffer will have the image only after
 *		the image has done loaded.
 * @static
 */
Grape2D.Texture.createFromImage = function(src, callback) {
	var image = new Image(),
		that = new Grape2D.Texture();

	image.onload = function(evt) {
		that.bufferImage(this);
		if (callback) {
			callback(that, this, evt);
		}
	};
	image.src = src;

	return that;
};
/**
 * A void texture doesn't render any image, nor have any property.
 *
 * @implements {Grape2D.ITexture}
 * @constructor
 */
Grape2D.VoidTexture = function() {};

Grape2D.VoidTexture.prototype = Object.create(Grape2D.ITexture);
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getWidth = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getHalfWidth = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.setWidth = function(width){
	return;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getHeight = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getHalfHeight = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.setHeight = function(height){
	return;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.render = function(){
	return;
};
/**
 * Static void texture. Useful to spare memory.
 *
 * @type {Grape2D.VoidTexture}
 * @public
 * @constant
 */
Grape2D.VoidTexture.STATIC = new Grape2D.VoidTexture();
/**
 * A scene controls, at a high level, the running of the game.
 *   Being responsible for the updating and rendering.
 *   This is the component object of what is a composite pattern.
 *
 * @class
 * @interface
 */
Grape2D.Scene = function () {};

Grape2D.Scene.prototype = {
	constructor: Grape2D.Scene,
	/**
	 * Updates the scene.
	 *
	 * @param  {!number} dt Time elapsed since the last update.
	 * @public
	 */
	update: function (dt) {},
	/**
	 * Renders the scene to a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer Place to render the scene.
	 * @param  {!Grape2D.Camera} camera Camera to transform the coordinates
	 *   and to select the objects to be rendered.
	 * @public
	 */
	render: function (renderer, camera) {}
};
/**
 * SceneGroup allow to group scenes together.
 *   This is the composite object of the composite pattern.
 *
 * @implements {Grape2D.Scene}
 * @constructor
 */
Grape2D.SceneGroup = function () {
	/**
	 * Children of this scene.
	 * 
	 * @type {!Array.<Grape2D.Scene>}
	 * @private
	 */
	this.childs = [];
};

Grape2D.SceneGroup.prototype = Object.create(Grape2D.Scene.prototype);
/**
 * @override
 */
Grape2D.SceneGroup.prototype.update = function (dt) {
	for (var i = 0; i < this.childs.length; i++) {
		this.childs[i].update(dt);
	}
};
/**
 * @override
 */
Grape2D.SceneGroup.prototype.render = function (renderer, camera) {
	for (var i = 0; i < this.childs.length; i++) {
		this.childs[i].render(renderer, camera);
	}
};
/**
 * Adds a child scene.
 * 
 * @param  {!Grape2D.Scene} child Child scene.
 * @public
 */
Grape2D.SceneGroup.prototype.addChild = function (child) {
	this.childs.push(child);
};
/**
 * Removes a child scene.
 *
 * @param  {!Grape2D.Scene} child Child to remove.
 * @public
 */
Grape2D.SceneGroup.prototype.removeChild = function (child) {
	this.childs.splice(this.childs.indexOf(child), 1);
};
/**
 * SceneLayer allow to render objects and update them, the objects are
 *   store using a {@link Grape2D.Map}.
 *   This is the leaf object of the composite pattern.
 *
 * @implements {Grape2D.Scene}
 * @constructor
 */
Grape2D.SceneLayer = function(options) {
	options = options || {};
	/**
	 * Scene map.
	 *
	 * @type {!Grape2D.Map}
	 * @private
	 */
	this.map = options.map || new Grape2D.SimpleMap();
};

Grape2D.SceneLayer.prototype = Object.create(Grape2D.Scene.prototype);
/**
 * @override
 */
Grape2D.SceneLayer.prototype.update = function(dt) {
	this.map.update(dt);
};
/**
 * @override
 */
Grape2D.SceneLayer.prototype.render = function(renderer, camera) {
	var elms = this.map.query(Grape2D.BVFactorySingleton.getFactory().createSceneBV(renderer, camera));
	renderer.start();
	for (var i = 0; i < elms.length; i++) {
		elms[i].render(renderer, camera);
	}
	renderer.end();
};
/**
 * Gets the map being used.
 *
 * @return {!Grape2D.Map} The map.
 * @public
 */
Grape2D.SceneLayer.prototype.getMap = function() {
	return this.map;
};
/**
 * Interface that defines high level methods for a game.
 *
 * @class
 * @interface
 */
Grape2D.Game = function() {};

Grape2D.Game.prototype = {
	constructor: Grape2D.Game,
	/**
	 * Sets up the game. It should be executed before any other method.
	 *
	 * @public
	 */
	setup: function() {},
	/**
	 * Starts the animation process.
	 *
	 * @public
	 */
	start: function() {},
	/**
	 * Stop the animation process.
	 *
	 * @public
	 */
	stop: function() {},
	/**
	 * Renders what needed be, to the right places.
	 *
	 * @public
	 */
	render: function() {},
	/**
	 * Updates the game, between frames.
	 *
	 * @param  {!number} dt The miliseconds elapsed since the last
	 *   animation call.
	 *
	 * @public
	 */
	update: function(dt) {},
	/**
	 * Calls the others methods, and "prepare" the next frame.
	 *
	 * @public
	 */
	animate: function() {}
};
/**
 * Describes a simple game "scene", with the basics.
 *
 * @param  {!Grape2D.Renderer} renderer The renderer of the scene.
 * @param  {!Grape2D.Scene} scene A scene with a map.
 * @param  {!Grape2D.Camera} camera A camera to look at the scene.
 *
 * @implements {Grape2D.Game}
 * @constructor
 */
Grape2D.SimpleGame = function(renderer, scene, camera) {
	/**
	 * Camera of the scene.
	 *
	 * @type {!Grape2D.Camera}
	 * @private
	 */
	this.camera = camera;
	/**
	 * Clock to help updating at each frame.
	 *
	 * @type {!Grape2D.utils.Clock}
	 * @private
	 */
	this.clock = new Grape2D.utils.Clock();
	/**
	 * Renderer.
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.renderer = renderer;
	/**
	 * Scene.
	 *
	 * @type {!Grape2D.Scene}
	 * @private
	 */
	this.scene = scene;
	/**
	 * Request animation frame ID.
	 *
	 * @type {number}
	 * @private
	 */
	this.raf = -1;
};

Grape2D.SimpleGame.prototype = Object.create(Grape2D.Game.prototype);
/**
 * Gets the camera.
 *
 * @return {!Grape2D.Camera} The camera
 * @public
 */
Grape2D.SimpleGame.prototype.getCamera = function() {
	return this.camera;
};
/**
 * Gets the clock.
 *
 * @return {!Grape2D.utils.Clock} The clock.
 * @public
 */
Grape2D.SimpleGame.prototype.getClock = function() {
	return this.clock;
};
/**
 * Gets the renderer.
 *
 * @return {!Grape2D.Renderer} The renderer.
 * @public
 */
Grape2D.SimpleGame.prototype.getRenderer = function() {
	return this.renderer;
};
/**
 * Gets the scene.
 *
 * @return {!Grape2D.Scene} The scene.
 * @public
 */
Grape2D.SimpleGame.prototype.getScene = function() {
	return this.scene;
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.setup = function() {};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.start = function() {
	this.animate();
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.stop = function() {
	Grape2D.utils.cancelAnimationFrame(this.raf);
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.render = function() {
	this.scene.render(this.renderer, this.camera);
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.update = function(dt) {
	this.scene.update(dt);
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.animate = function() {
	var that = this,
		dt = this.clock.update();
	this.raf = Grape2D.utils.requestAnimationFrame(function() {
		that.animate();
	});
	this.update(dt);
	this.render();
	this.renderer.renderText("FPS: "+this.clock.fps, new Grape2D.Vector(10,10));
};
/**
 * WebSocket abstraction. This, unlike the browser implementation,
 *   doesn't (try to) establish the connection immediately. Instead
 *   the method <code>open()</code> must be called.
 *
 * @param {!Object} options Setup options.
 * @param {!string} options.address Address of the web socket server.
 * @param {!string=} options.protocol Web socket protocol.
 * @param {!Grape2D.utils.SynchronizedClock=} options.clock A clock, to
 *   to be synchronized with the clock of the server.
 *
 * @constructor
 */
Grape2D.WebSocket = function(options) {
	options = options || {};
	/**
	 * List of callback for the on message event.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.onmessageCallback = [];
	/**
	 * List of callback for the on close event.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.oncloseCallback = [];
	/**
	 * List of callback for the on open event.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.onopenCallback = [];
	/**
	 * List of callback for messages sent.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.onsendCallback = [];
	/**
	 * Web socket.
	 *
	 * @type {?WebSocket}
	 * @private
	 */
	this.ws = null;
	/**
	 * Address to connect.
	 *
	 * @type {!string}
	 * @private
	 */
	this.address = options.address;
	/**
	 * Connection's protocol.
	 *
	 * @type {(string|undefined)}
	 * @private
	 */
	this.protocol = options.protocol || undefined;
	/**
	 * Network metrics.
	 *
	 * @type {!Grape2D.WebSocketMetrics}
	 * @private
	 */
	this.metrics = new Grape2D.WebSocketMetrics(this, options.clock || undefined);
};

Grape2D.WebSocket.prototype = {
	constructor: Grape2D.WebSocket,
	/**
	 * Sends a message to the web socket.
	 *
	 * @param  {!string} msg Message to send.
	 * @public
	 */
	send: function(msg) {
		if (this.isOpen()) {
			this.ws.send(msg)
			for (var i = 0; i < this.onsendCallback.length; i++) {
				this.onsendCallback[i](msg);
			}
		}
	},
	/**
	 * Adds a callback for the sned event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnSend: function(callback) {
		this.onsendCallback.push(callback);
	},
	/**
	 * Removes a callback for the send event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnSend: function(callback) {
		var idx = this.onsendCallback.indexOf(callback);
		if (idx > -1) {
			this.onsendCallback.splice(idx, 1);
		}
	},
	/**
	 * Adds a callback for the on message event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnMessage: function(callback) {
		this.onmessageCallback.push(callback);
	},
	/**
	 * Removes a callback for the on message event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnMessage: function(callback) {
		var idx = this.onmessageCallback.indexOf(callback);
		if (idx > -1) {
			this.onmessageCallback.splice(idx, 1);
		}
	},
	/**
	 * Adds a callback for the on close event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnClose: function(callback) {
		this.oncloseCallback.push(callback);
	},
	/**
	 * Removes a callback for the on close event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnClose: function(callback) {
		var idx = this.oncloseCallback.indexOf(callback);
		if (idx > -1) {
			this.oncloseCallback.splice(idx, 1);
		}
	},
	/**
	 * Adds a callback for the on open event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnOpen: function(callback) {
		this.onopenCallback.push(callback);
	},
	/**
	 * Removes a callback for the on open event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnOpen: function(callback) {
		var idx = this.onopenCallback.indexOf(callback);
		if (idx > -1) {
			this.onopenCallback.splice(idx, 1);
		}
	},
	/**
	 * Closes the connection.
	 *
	 * @public
	 */
	close: function() {
		this.ws.close();
	},
	/**
	 * Opens the connection. This method must be called, for
	 *   the connection to be established.
	 *
	 * @public
	 */
	open: function() {
		var that = this;
		this.ws = new WebSocket(this.address, this.protocol);
		this.ws.onopen = function(event) {
			for (var i = 0; i < that.onopenCallback.length; i++) {
				that.onopenCallback[i](event);
			}
		};
		this.ws.onmessage = function(event) {
			for (var i = 0; i < that.onmessageCallback.length; i++) {
				that.onmessageCallback[i](event.data, event);
			}
		};
		this.ws.onclose = function(event) {
			for (var i = 0; i < that.oncloseCallback.length; i++) {
				that.oncloseCallback[i](event);
			}
		};
	},
	/**
	 * Gets the metrics of this web socket.
	 *
	 * @return {!Grape2D.WebSocketMetrics} Web socket's metrics.
	 * @public
	 */
	getMetrics: function() {
		return this.metrics;
	},
	/**
	 * Checks if the web socket is open.
	 *
	 * @return {!boolean} True if it's open.
	 * @public
	 */
	isOpen: function() {
		return this.ws.readyState == this.ws.OPEN;
	}
};
/**
 * WebSocketMetrics class.
 *
 * @param {!Grape2D.WebSocket} webSocket WebSocket to bind.
 * @param {!Grape2D.utils.SynchronizedClock=} syncClock A clock
 *   synchronized with the server.
 * @constructor
 */
Grape2D.WebSocketMetrics = function(webSocket, syncClock) {
	/**
	 * Web Socket binded.
	 *
	 * @type {!Grape2D.WebSocket}
	 * @public
	 */
	this.ws = webSocket;
	/**
	 * Accumulated ping.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingAc = 0;
	/**
	 * Ping responses received.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingSamplesReceived = 0;
	/**
	 * Accumulative clock synchronization.
	 *
	 * @type {!number}
	 * @private
	 */
	this.syncAc = 0;
	/**
	 * Ping samples to send to the server.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingSamples = 10;
	/**
	 * Last ping value registered.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingValue = 0;
	/**
	 * Last time the ping value was registered.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lastPing = 0;
	/**
	 * Total number of bytes sent.
	 *
	 * @type {!number}
	 * @private
	 */
	this.bytesSent = 0;
	/**
	 * Total number of bytes received.
	 *
	 * @type {!number}
	 * @private
	 */
	this.bytesReceived = 0;
	/**
	 * Time when the web socket was opened.
	 *
	 * @type {!number}
	 * @private
	 */
	this.start = 0;
	/**
	 * Bytes of the last message received.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lastReceived = 0;
	/**
	 * Bytes of the last message sent.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lastSent = 0;
	/**
	 * Synchronized clock with the server.
	 *
	 * @type {!Grape2D.utils.SynchronizedClock}
	 * @private
	 */
	this.syncClock = syncClock || new Grape2D.utils.SynchronizedClock();

	var that = this;
	this.ws.addOnOpen(function() {
		that.start = that.syncClock.getTime();
	});
	this.ws.addOnMessage(function(message) {
		var byteSize = message.length;
		that.bytesReceived += byteSize;
		that.lastReceived = byteSize;
		if (message.indexOf(Grape2D.WebSocketMetrics.PING_PREFIX) === 0) {
			that.pongReceived(message);
		}
	});
	this.ws.addOnSend(function(message) {
		var byteSize = message.length;
		that.bytesSent += byteSize;
		that.lastSent = byteSize;
	});
};

Grape2D.WebSocketMetrics.prototype = {
	constructor: Grape2D.WebSocketMetrics,
	/**
	 * Sends a ping message.
	 *
	 * @public
	 */
	ping: function() {
		this.pingStop = true;
		this.pingAc = 0;
		this.syncAc = 0;
		this.pongSamplesReceived = 0;
		var that = this;
		for (var i = this.pingSamples; i > 0; i--) {
			setTimeout(function() {
				that.ws.send(Grape2D.WebSocketMetrics.PING_PREFIX + " " + (new Date().getTime()));
			}, 20 * i);
		}
	},
	/**
	 * Sends back a pong message.
	 *
	 * @param  {!string} message Ping message, received.
	 * @public
	 */
	pong: function(message) {
		this.ws.send(message + " " + this.syncClock.getTime());
	},
	/**
	 * Pong message handler. This is used to calculate the ping
	 *   and synchronize the clock with the server.
	 *
	 * @param  {!string} message Pong response message.
	 * @public
	 */
	pongReceived: function(message) {
		var t4 = new Date().getTime(),
			d = message.split(" "),
			t1 = Number(d[1]),
			t2 = Number(d[2]),
			t3 = t2,
			theta, delta;
		theta = ((t2 - t1) + (t3 - t4)) * 0.5;
		delta = (t4 - t1);
		this.pingAc += delta;
		this.syncAc += theta - delta * 0.5;
		this.pingSamplesReceived++;
		this.lastPing = t4;
		if (this.pingSamplesReceived == this.pingSamples) {
			this.pingValue = Grape2D.Math.ceil(this.pingAc / this.pingSamples);
			this.pingSamplesReceived = 0;
			this.syncClock.sync(Grape2D.Math.floor(this.syncAc / this.pingSamples));
		}
	},
	/**
	 * Gets the network latency, in milliseconds.
	 *
	 * @return {!number} Ping value.
	 * @public
	 */
	getPing: function() {
		return this.pingValue;
	},
	/**
	 * Gets the last time a pong response was received.
	 *
	 * @return {!number} Timestamp, in milliseconds.
	 * @public
	 */
	getLastPing: function() {
		return this.lastPing;
	},
	/**
	 * Gets the number of bytes sent, on the last message.
	 *
	 * @return {!number} Bytes sent.
	 * @public
	 */
	getLastBytesSent: function() {
		return this.lastSent;
	},
	/**
	 * Gets the total number of bytes sent.
	 *
	 * @return {!number} Bytes sent.
	 * @public
	 */
	getBytesSent: function() {
		return this.bytesSent;
	},
	/**
	 * Gets the number of bytes sent per second. Average
	 *   between the total number of bytes sent and the
	 *   time since the web socket was open.
	 *
	 * @return {!number} Average bytes per second.
	 * @public
	 */
	getBytesSentPerSec: function() {
		return this.bytesSent / ((new Date().getTime()) - this.start);
	},
	/**
	 * Gets the number of bytes received, on the last message.
	 *
	 * @return {!number} Bytes received.
	 * @public
	 */
	getLastBytesReceived: function() {
		return this.lastReceived;
	},
	/**
	 * Gets the total number of bytes received.
	 *
	 * @return {!number} Bytes received.
	 * @public
	 */
	getBytesReceived: function() {
		return this.bytesSent;
	},
	/**
	 * Gets the number of bytes sent per second. Average
	 *   between the total number of bytes sent and the
	 *   time since the web socket was open.
	 *
	 * @return {!number} Average bytes per second.
	 * @public
	 */
	getBytesReceivedPerSec: function() {
		return this.bytesReceived / ((new Date().getTime()) - this.start);
	}
};
/**
 * Prefix of the ping message. Any message with this prefix
 *   is treated as a ping message.
 *
 * @type {!string}
 * @public
 * @constant
 */
Grape2D.WebSocketMetrics.PING_PREFIX = "'";
/**
 * This holds a limited history of snapshots received from
 *   the server. The snapshots are organized by the order
 *   received, and hold the current time when they were
 *   received.
 *
 * @param {!number=} cap Maximum number of entries on the
 *   history. The default value is 10.
 * @constructor
 */
Grape2D.SnapshotHistory = function(cap) {
	/**
	 * Maximum length of the history.
	 *
	 * @type {!number}
	 * @private
	 */
	this.cap = cap || 10;
	/**
	 * List with the history record.
	 *
	 * @type {!Array.<!Grape2D.Snapshot>}
	 * @private
	 */
	this.history = [];
};
Grape2D.SnapshotHistory.prototype = {
	constructor: Grape2D.SnapshotHistory,
	/**
	 * Adds a snapshot to the history. Discards the older one
	 *   if it has reached the entry limit.
	 *
	 * @param {!Grape2D.Snapshot} snapshot Snapshot received.
	 * @public
	 */
	add: function(snapshot) {
		if (this.history.length >= this.cap) {
			this.history.shift();
		}
		this.history.push(snapshot);
		this.history.sort(function(a, b){
			return a.getTime()-b.getTime();
		});
	},
	/**
	 * Gets the snapshot received immediately before a
	 *   given time.
	 *
	 * @param  {!number} time Reference time, in milliseconds.
	 * @return {?Grape2D.Snapshot} A string if it has found a valid
	 *   snapshot before the time, null otherwise.
	 * @public
	 */
	getBefore: function(time) {
		for (var i = this.history.length-1; i >= 0; i--) {
			if (this.history[i].getTime() < time) {
				return this.history[i];
			}
		}
		return null;
	},
	/**
	 * Gets the snapshot received immediately after a
	 *   given time.
	 *
	 * @param  {!number} time Reference time, in milliseconds.
	 * @return {?Grape2D.Snapshot} A string if it has found a valid
	 *   snapshot after the time, null otherwise.
	 * @public
	 */
	getAfter: function(time) {
		for (var i = 0; i < this.history.length; i++) {
			if (this.history[i].getTime() > time) {
				return this.history[i];
			}
		}
		return null;
	},
	/**
	 * Gets the history list.
	 *
	 * @return {!Array.<!Grape2D.Snapshot>} Snapshot
	 *   history record.
	 * @public
	 */
	getHistory: function() {
		return this.history;
	},
	/**
	 * Gets the limit of snapshots recorded.
	 *
	 * @return {!number} Maximum number of snapshots that can
	 *   be stored.
	 * @public
	 */
	getCap: function() {
		return this.cap;
	},
	/**
	 * Sets the limit of snapshots recorded. If the limit is lower
	 *   than the previous one, the record is adjusted to the correct
	 *   length if needed be.
	 *
	 * @param {!number} cap Maximum number of snapshots that can
	 *   be stored.
	 * @public
	 */
	setCap: function(cap) {
		this.cap = cap;
		while (this.history.length > this.cap) {
			this.history.shift();
		}
	}
};
/**
 * Simulates lag behavior, by delayed function calls.
 *
 * @param {!Object=} options Setup options.
 * @param {!number=} options.latency Desired based latency.
 * @param {!number=} options.variation Variation of the base
 *   latency. This will create an effective latency of <code>
 *   rand(latency-variation, latency+variation)</code>
 * @constructor
 */
Grape2D.LagSimulator = function(options) {
	options = options || {};
	/**
	 * Base latency.
	 *
	 * @type {!number}
	 * @private
	 */
	this.latency = options.latency || 0;
	/**
	 * Latency variation.
	 *
	 * @type {!number}
	 * @private
	 */
	this.variation = options.variation || 0;
};
Grape2D.LagSimulator.prototype = {
	constructor: Grape2D.LagSimulator,
	/**
	 * Gets the latency.
	 *
	 * @return {!number} Latency.
	 * @public
	 */
	getLatency: function(){
		return this.latency;
	},
	/**
	 * Sets the latency.
	 *
	 * @param {!number} latency Latency.
	 * @public
	 */
	setLatency: function(latency){
		this.latency = latency;
	},
	/**
	 * Gets the variation.
	 *
	 * @return {!number} Variation.
	 * @public
	 */
	getVariation: function(){
		return this.variation;
	},
	/**
	 * Sets the variation.
	 *
	 * @param {!number} variation Variation.
	 * @public
	 */
	setVariation: function(variation){
		this.variation = variation;
	},
	/**
	 * Simulates a lagged call to a function.
	 *
	 * @param  {!Function} fn Function to simulate
	 *   the lag.
	 * @public
	 */
	simulate: function(fn){
		var r = Grape2D.Math.randInt(this.latency-this.variation, this.latency+this.variation);
		setTimeout(function(){
			fn(r);
		}, r);
	}
};
/**
 * Snapshot manager.
 *
 * @param {!Grape2D.utils.Clock} clock A clock.
 * @param {!Grape2D.SnapshotHistory} history Snapshot buffer.
 * @param {!number} lerp Interpolation time, in millisecond.
 * @constructor
 */
Grape2D.SnapshotManager = function(clock, history, lerp) {
	/**
	 * Game clock.
	 *
	 * @type {!Grape2D.utils.Clock}
	 * @private
	 */
	this.clock = clock;
	/**
	 * Snapshot history.
	 *
	 * @type {!Grape2D.SnapshotHistory}
	 * @private
	 */
	this.history = history;
	/**
	 * Interpolation time between state and snapshot.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lerp = lerp || 100;
	/**
	 * Inverse of the interpolation time.
	 *
	 * @type {!number}
	 * @private
	 */
	this.iLerp = 1 / this.lerp;
	/**
	 * Current snapshot, being used.
	 *
	 * @type {?Grape2D.Snapshot}
	 * @private
	 */
	this.currentSnapshot = null;
	/**
	 * Interpolation percent, of the cycle.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lerpPercent = 0;
};
Grape2D.SnapshotManager.prototype = {
	constructor: Grape2D.SnapshotManager,
	/**
	 * Gets the current snapshot.
	 *
	 * @return {?Grape2D.Snapshot} Snapshot object.
	 * @public
	 */
	getSnapshot: function() {
		return this.currentSnapshot;
	},
	/**
	 * Gets a snapshot object by it's id.
	 *
	 * @param  {!(number|string)} id Object's id.
	 * @return {Grape2D.SnapshotNetworkObject2D} Object.
	 * @public
	 */
	getSnapshotNetworkObject2D: function(id) {
		return (this.currentSnapshot ? this.currentSnapshot[id] : null);
	},
	/**
	 * Gets the interpolation percentage.
	 *
	 * @return {!number} Number between 0 and 1.
	 * @public
	 */
	getLerpPercent: function() {
		return this.lerpPercent;
	},
	/**
	 * Method to set up the cycle.
	 *
	 * @public
	 */
	update: function() {
		var time = this.clock.getTime();
		this.currentSnapshot = this.history.getBefore(time);
		if (this.currentSnapshot) {
			this.lerpPercent = (time - this.lerp - this.currentSnapshot.getTime()) / this.iLerp;
		} else {
			this.lerpPercent = 0;
		}
	}
};
/**
 * Snapshot Manager Singleton.
 *
 * @class
 */
Grape2D.SnapshotManagerSingleton = {
	/**
	 * Snapshot Manager in use.
	 *
	 * @type {?Grape2D.SnapshotManager}
	 * @private
	 * @static
	 */
	instance: null,
	/**
	 * Sets a snapshot manager.
	 *
	 * @param {!Grape2D.SnapshotManager} instance Snapshot manager.
	 * @public
	 * @static
	 */
	setInstance: function(instance){
		Grape2D.SnapshotManagerSingleton.instance = instance;
	},
	/**
	 * Gets the snapshot manager.
	 *
	 * @return {?Grape2D.SnapshotManager} Snapshot manager.
	 * @public
	 * @static
	 */
	getInstance: function(){
		return Grape2D.SnapshotManagerSingleton.instance;
	},
	/**
	 * Gets a snapshot object by it's id. A snapshot manager must be set before.
	 *
	 * @param {!(number|string)} id Object's id.
	 * @return {?Grape2D.SnapshotNetworkObject2D} Object with the id.
	 * @public
	 * @static
	 */
	getSnapshotNetworkObject2D: function(id){
		return Grape2D.SnapshotManagerSingleton.instance.getSnapshotNetworkObject2D(id);
	},
	/**
	 * Gets the current interpolation percentage.
	 *
	 * @return {!number} Percentage, between 0 and 1.
	 * @public
	 * @static
	 */
	getLerpPercent: function(){
		return Grape2D.SnapshotManagerSingleton.instance.getLerpPercent();
	},
	/**
	 * Updates the current snapshot manager.
	 *
	 * @public
	 * @static
	 */
	update: function(){
		Grape2D.SnapshotManagerSingleton.instance.update();
	}
};
/**
 * Represents a simplified version of a network object.
 *   To be converted to or from a snapshot.
 *
 * @param {!(number|string)} id Object unique identifier.
 * @param {!number} posX The x coordinate, of the position.
 * @param {!number} posY The y coordinate, of the position.
 * @constructor
 */
Grape2D.SnapshotNetworkObject2D = function(id, posX, posY) {
	/**
	 * Unique object id.
	 *
	 * @type {!(number|string)}
	 * @private
	 */
	this.id = id;
	/**
	 * Object's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector(posX, posY);
};

Grape2D.SnapshotNetworkObject2D.prototype = {
	constructor: Grape2D.SnapshotNetworkObject2D,
	/**
	 * Gets object's id.
	 *
	 * @return {!(number|string)} Object id.
	 * @public
	 */
	getId: function() {
		return this.id;
	},
	/**
	 * Gets object's position.
	 *
	 * @return {!Grape2D.Vector} Object position.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Updates the corresponding {@link Grape2D.NetworkObject2D},
	 *   with the data of this one.
	 *
	 * @param  {!Object=} param An arbitrary object.
	 * @public
	 */
	updateNetworkObject2D: function(param) {
		/*var nob = Grape2D.NetworkObject2DBase.get(this.id);
		if (nob) {
			nob.setPosition(this.position);
		}*/
	}
};
/**
 * Grape2D.SnapshotEvent class.
 *
 * @param {!(number|string)} id Event unique identifier.
 * @constructor
 */
Grape2D.SnapshotEvent = function(id) {
	/**
	 * Event unique identifier.
	 *
	 * @type {!(number|string)}
	 * @private
	 */
	this.id = id;
};

Grape2D.SnapshotEvent.prototype = {
	constructor: Grape2D.SnapshotEvent,
	/**
	 * Gets the event id.
	 *
	 * @return {!(number|string)} Event id.
	 * @public
	 */
	getId: function() {
		return this.id;
	},
	/**
	 * Fires the event.
	 *
	 * @param {!Object=} param An arbitrary object.
	 * @public
	 */
	fire: function(param) {}
};
/**
 * Snapshot class.
 *
 * @param {!number} time Time of the snapshot.
 * @param {!Array.<!Grape2D.SnapshotEvent>=} events List of events in
 *   the snapshots.
 * @param {!Object.<!(number|string), !Grape2D.SnapshotNetworkObject2D>=} networkObjects List
 *   of objects in the snapshot.
 * @constructor
 */
Grape2D.Snapshot = function(time, events, networkObjects) {
	/**
	 * Snapshot time.
	 *
	 * @type {!number}
	 * @private
	 */
	this.time = time;
	/**
	 * Snapshot events.
	 *
	 * @type {!Array.<!Grape2D.SnapshotEvent>}
	 * @private
	 */
	this.events = events || [];
	/**
	 * Snapshot objects.
	 *
	 * @type {!Object.<!(number|string), !Grape2D.SnapshotNetworkObject2D>}
	 * @private
	 */
	this.networkObjects = networkObjects || {};
};

Grape2D.Snapshot.prototype = {
	constructor: Grape2D.Snapshot,
	/**
	 * Adds an event to the snapshot.
	 *
	 * @param {!Grape2D.SnapshotEvent} event Snapshot event.
	 * @public
	 */
	addEvent: function(event) {
		this.events.push(event);
	},
	/**
	 * Adds an object to the snapshot.
	 *
	 * @param {!Grape2D.SnapshotNetworkObject2D} sno2d Snapshot object.
	 * @public
	 */
	addSnapshotNetworkObject2D: function(sno2d) {
		this.networkObjects[sno2d.getId()] = sno2d;
	},
	/**
	 * Gets the snapshot time.
	 *
	 * @return {!number} Time.
	 * @public
	 */
	getTime: function() {
		return this.time;
	},
	/**
	 * Gets the snapshot events.
	 *
	 * @return {!Array.<!Grape2D.SnapshotEvent>} Snapshot events.
	 * @public
	 */
	getEvents: function() {
		return this.events;
	},
	/**
	 * Gets an object
	 *
	 * @param  {!(number|string)} id Object's id.
	 * @return {!(Grape2D.SnapshotNetworkObject2D|undefined)} Object.
	 */
	getSnapshotNetworkObject2D: function(id) {
		return this.networkObjects[id];
	},
	/**
	 * Fires the events.
	 *
	 * @param  {!Object=} param An arbitrary object to be passed. Since
	 *   events can be used widely an object with the necessary
	 *   information may be passed.
	 * @public
	 */
	fireEvents: function(param) {
		for(var i=0; i<this.events.length; i++){
			this.events[i].fire(param);
		}
	},
	/**
	 * Updates the {@link Grape2D.NetworkObject2D}s of this snapshot.
	 *
	 * @param  {!Object=} param An arbitrary object to be passed.
	 * @public
	 */
	updateNetworkObject2D: function(param){
		for(var x in this.networkObjects){
			this.networkObjects[x].updateNetworkObject2D(param);
		}
	},
	/**
	 * Dispatches the tasks of this snapshot, by firing the events and
	 *   updating {@link Grape2D.NetworkObject2D}s.
	 *
	 * @param  {!Object=} eventsParam Arbitrary object. To be passed to
	 *   {@link Grape2D.Snapshot.fireEvents}.
	 * @param  {!Object=} objsParam Arbitrary object. To be passed to
	 *   {@link Grape2D.Snapshot.fireEvents}.
	 * @public
	 */
	dispatch: function(eventsParam, objsParam){
		this.fireEvents(eventsParam);
		this.updateNetworkObject2D(objsParam);
	}
};
/**
 * Dispatches messages by callback function if they match the
 *   correspondent regular expression.
 *
 * @constructor
 */
Grape2D.utils.MessageDispatcher = function() {
	this.stack = [];
};

Grape2D.utils.MessageDispatcher.prototype = {
	constructor: Grape2D.utils.MessageDispatcher,
	/**
	 * Adds callback for a message that returns <code>true</code>
	 *   in the test of the regular expression.
	 *
	 * @param {!RegExp} regex Regular expression to match.
	 * @param {function(!string, !Object=)} callback Function to be
	 *   called when the message matches the regular expression.
	 * @public
	 */
	add: function(regex, callback) {
		this.stack.push({
			regex: regex,
			callback: callback
		});
	},
	/**
	 * Removes a callback.
	 *
	 * @param  {!RegExp} regex Regular expression associated with the
	 *   callback to remove.
	 * @public
	 */
	remove: function(regex) {
		var rs = regex.toString();
		for (var i = 0; i < this.stack.length; i++) {
			if (this.stack[i].regex.toString() == rs) {
				this.stack.splice(i, 1);
			}
		}
	},
	/**
	 * Dispatches the callbacks associated with the regular expressions
	 *   matching the message.
	 *
	 * @param  {!string} message Message to be dispatched.
	 * @param  {!Object=} param Additional arguments to be passed
	 *   through.
	 * @public
	 */
	dispatch: function(message, param) {
		var current;
		for (var i = 0; i < this.stack.length; i++) {
			current = this.stack[i];
			if (current.regex.test(message)) {
				this.stack[i].callback(message, param);
			}
		}
	}
};
/**
 * Timer class. This is not handling double calls or more for long intervals.
 *
 * @constructor
 */
Grape2D.utils.TimerDispatcher = function() {
	/**
	 * Internal representation of the callbacks and internal timers.
	 *
	 * @type {!Array.<Object.<!string,!(number|Function|boolean)>>}
	 * @private
	 */
	this.tm = [];
};

Grape2D.utils.TimerDispatcher.prototype = {
	constructor: Grape2D.utils.TimerDispatcher,
	/**
	 * Adds.
	 *
	 * @param {!number} interv Time interval between calls, in milliseconds.
	 * @param {Function} callback Function to be called after the interval has run out.
	 * @param {!boolean=} remove True to remove after it has been called one time.
	 * @public
	 */
	add: function(interv, callback, remove) {
		var storedObj = {
			interval: interv,
			callback: callback,
			remaining: interv,
			remove: remove || false
		};
		this.tm.push(storedObj);
	},
	/**
	 * Dispatches the calls if its time for it, or updates the internal timers, preparing for the next update.
	 *
	 * @param  {!number} dt Delta time, since the last dispatch call.
	 * @public
	 */
	dispatch: function(dt) {
		var current;
		var remove = [];
		for (var i = 0; i < this.tm.length; i++) {
			current = this.tm[i];
			if (current.remaining <= dt) {
				current.callback();
				if (current.remove) {
					remove.push(i);
				} else {
					current.remaining = Grape2D.Math.clamp(current.interval - (current.remaining - dt), 0, current.interval);
				}
			} else {
				current.remaining -= dt;
			}
		}
		for (i = 0; i < remove.length; i++) {
			this.tm.splice(remove[i], 1);
		}
	}
};
/**
 * Constant that represents a second.
 *
 * @type {!number}
 * @constant
 * @public
 */
Grape2D.utils.TimerDispatcher.SECOND = 1000;
/**
 * Constant that represents a minute.
 *
 * @type {!number}
 * @constant
 * @public
 */
Grape2D.utils.TimerDispatcher.MINUTE = Grape2D.utils.TimerDispatcher.SECOND * 60;
/**
 * Constant that represents an hour.
 *
 * @type {!number}
 * @constant
 * @public
 */
Grape2D.utils.TimerDispatcher.HOUR = Grape2D.utils.TimerDispatcher.MINUTE * 60;
Grape2D.TopDownBVHTreeDebugger = {
	renderNode: function(node, renderer, camera) {
		node.getBoundingVolume().render(renderer, camera);
		renderer.renderText(node.getDepth(), camera.wcsToViewport(renderer, node.getBoundingVolume().getPosition()));
		if (node.getLeft()) {
			renderer.setStrokeColor("rgba(0,255,0,0.6)");
			Grape2D.TopDownBVHTreeDebugger.renderNode(node.getLeft(), renderer, camera);
			renderer.setStrokeColor("rgba(0,0,0,1)");
		}
		if (node.getRight()) {
			renderer.setStrokeColor("rgba(0,0,255,0.6)");
			Grape2D.TopDownBVHTreeDebugger.renderNode(node.getRight(), renderer, camera);
			renderer.setStrokeColor("rgba(0,0,0,1)");
		}
	},
	render: function(tree, renderer, camera) {
		if (tree.getRootNode()) {
			Grape2D.TopDownBVHTreeDebugger.renderNode(tree.getRootNode(), renderer, camera);
		}
	}
};
/**
 * Debugs the network data income and outcome, by rendering
 *   that information to the renderer.
 *
 * @class
 */
Grape2D.utils.NetworkDebugger = {
	/**
	 * Position of the ping information.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	pingPos: new Grape2D.Vector(85, 20),
	/**
	 * Position of the last income data size.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	inPos: new Grape2D.Vector(20, 35),
	/**
	 * Position of the income rate of data.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	inRatePos: new Grape2D.Vector(88, 35),
	/**
	 * Position of the last outcome data size.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	outPos: new Grape2D.Vector(20, 50),
	/**
	 * Position of the outcome rate of data.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	outRatePos: new Grape2D.Vector(88, 50),
	/**
	 * Debug text font.
	 *
	 * @type {!string}
	 * @public
	 * @static
	 */
	textFont: "13px Consolas",
	/**
	 * Renders the information to a renderer.
	 *
	 * @param  {!Grape2D.WebSocket} webSocket Web socket to debug.
	 * @param  {!Grape2D.Renderer} renderer Renderer to render the
	 *   debug information.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 * @static
	 */
	render: function(webSocket, renderer, camera) {
		var metrics = webSocket.getMetrics();
		renderer.setTextFont(Grape2D.utils.NetworkDebugger.textFont);
		renderer.renderText("ping: " + metrics.getPing() + " ms", Grape2D.utils.NetworkDebugger.pingPos);
		renderer.renderText("in : " + metrics.getLastBytesReceived(), Grape2D.utils.NetworkDebugger.inPos);
		renderer.renderText(Grape2D.Math.roundTwo(metrics.getBytesReceivedPerSec()) + " k/s", Grape2D.utils.NetworkDebugger.inRatePos);
		renderer.renderText("out: " + metrics.getLastBytesSent(), Grape2D.utils.NetworkDebugger.outPos);
		renderer.renderText(Grape2D.Math.roundTwo(metrics.getBytesSentPerSec()) + " k/s", Grape2D.utils.NetworkDebugger.outRatePos);
	}
};
if(NODE){module.exports = Grape2D;}else{window.Grape2D = Grape2D}})()