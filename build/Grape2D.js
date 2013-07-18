/**
 * @author rui_web@hotmail.com
 */

/**
 * This is the main namespace.
 * @namespace
 * @type {Object}
 * @public
 */
var Grape2D = {
	vernum: /*@#version.num*/ 0 /*@#version#*/ ,
	version: /*@#version.string*/ '' /*@#version#*/
};// https://gist.github.com/paulirish/1579671
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());/**
 * @author rui_web@hotmail.com (Rui Gil)
 */

/**
 * Browser independent utils
 *
 * @namespace
 */
Grape2D.utils = {
	/**
	 * Gets the document size, or by other words the size of the screen, as an object with width and height properties.
	 * This is the maximum size of the "drawing surface".
	 *
	 * @return {Object} the object with the width and height of the document
	 */
	getDocumentSize: function () {
		return {
			width: document.width || document.documentElement.clientWidth,
			height: document.height || document.documentElement.clientHeight
		};
	},

	/**
	 * This is a semi-polyfill to request an animation frame, since it only changes this function in case it exists or don't.
	 * This may be a ugly and a bad pratice, bad it's only executed once and gives more abstraction to the developer.
	 * Once executed it will also place a polyfill into Grape2D.utils.cancelAnimationFrame.
	 *
	 * These polyfills are adapted from Erik's Moller requestAnimationFrame polyfill and fixed by Paul Irish and Tino Zijdel {@link https://gist.github.com/paulirish/1579671}
	 *
	 * @param  {Object} w Window object. This object may or may not contain the requestAnimationFrame. If null then the global object window is taken.
	 */
	requestAnimationFrame: function (w) {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		var requestPolyfill = null;
		var cancelPolyfill = null;
		w = w || window;
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			requestPolyfill = window[vendors[x] + 'RequestAnimationFrame'];
			cancelPolyfill = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!requestPolyfill) {
			requestPolyfill = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!cancelPolyfill) {
			cancelPolyfill = function (id) {
				clearTimeout(id);
			};
		}

		Grape2D.utils.requestAnimationFrame = requestPolyfill;
		Grape2D.utils.cancelAnimationFrame = cancelPolyfill;
	},
	/**
	 * A semi-polyfill to cancel animations. Be aware that is function does nothing util the requestAnimationFrame polyfill is called. This makes sence because an animation should only be stopped when it's already runnning.
	 */
	cancelAnimationFrame: function () {}
};/**
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
	update: function () {
		var now = new Date().getTime(),
			t = now - this.lastFrame;

		this.frameCount++;
		this.timeEl++;

		if (this.timeEl >= 1000) {
			this.reset(now);
		}

		this.lastFrame = now;
		return t;
	},
	reset: function (time) {
		this.fps = this.frameCount;
		this.timeEl = 0;
		this.frameCount = 0;
		this.end = time;
	}
};/**
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
};/**
 * @author rui_web@hotmail.com (Rui Gil)
 */

/**
 * Describes a math vector in the cartesian space (2D).
 * This is also very useful and may be used to represent
 * points.
 *
 * @param  {number=} x the x component
 * @param  {number=} y the y component
 *
 * @constructor
 * @public
 */
Grape2D.Vector = function(x, y){
	/**
	 * The x component. The default value is 0.
	 *
	 * @private {number}
	 */
	this.x = x || 0;
	/**
	 * The y component. The default value is 0.
	 *
	 * @private {number}
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
	 * @return {number} y component
	 */
	getY: function(){
		return this.y;
	},
	/**
	 * Sets the x component of the vector
	 *
	 * @param  {number} y the new value
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
	 * Alias to {@link Grape2D.Vector#getMagnitude}
	 */
	length: function(){
		return this.getMagnitude();
	},
	/**
	 * Gets the length of the vector, before the calculation of its
	 *   square root.
	 *
	 * @return {number} The length squared.
	 */
	lengthSquared: function(){
		return this.x*this.x+this.y*this.y;
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
	sqDistanceTo: function(vector){
		return vector.x*this.x+vector.y*this.y;
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
 * @return {Grape2D.Vector} vector with direction from a to b.
 */
Grape2D.Vector.createFromPoints = function(a,b){
	return (new Grape2D.Vector(b.x-a.x, b.y-a.y));
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
};/**
 * Matrix defines a 3x3 matrix indicated to deal with 2D operations.
 *
 * @param  {number=} aa [description]
 * @param  {number=} ab [description]
 * @param  {number=} ac [description]
 * @param  {number=} ba [description]
 * @param  {number=} bb [description]
 * @param  {number=} bc [description]
 * @param  {number=} ca [description]
 * @param  {number=} cb [description]
 * @param  {number=} cc [description]
 *
 * @constructor
 */
Grape2D.Matrix = function(aa, ab, ac, ba, bb, bc, ca, cb, cc){
	/**
	 * Matrix elements.
	 *
	 * @type {Array.<number>}
	 * @private
	 */
	this.v = [];
	if(aa!==undefined){
		this.v = [ aa, ab, ac, ba, bb, bc, ca, cb, cc ];
	}else{
		this.identity();
	}
};

Grape2D.Matrix.prototype = {
	constructor: Grape2D.Matrix,
	set: function(aa, ab, ac, ba, bb, bc, ca, cb, cc){
		var tv = this.v;
		tv[0] = tv[4] = tv[8] = 1;
		tv[1] = tv[2] = tv[3] = tv[5] = tv[6] = tv[7] = 0;
		return this;
	},
	add: function(matrix){
		for(var i=0; i<9; i++)
			this.v[i]+=matrix.v[i];
		return this;
	},
	identity: function(){
		this.v = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
		return this;
	},
	invert: function(){
		var det = this.determinant(), v=this.v;
		this.v = [
			v[4]*v[8]-v[5]*v[7],
			v[2]*v[7]-v[1]*v[8],
			v[1]*v[5]-v[2]*v[4],

			v[5]*v[6]-v[8]*v[3],
			v[0]*v[8]-v[2]*v[6],
			v[2]*v[3]-v[0]*v[5],

			v[3]*v[7]-v[4]*v[6],
			v[1]*v[6]-v[0]*v[7],
			v[0]*v[4]-v[1]*v[3]
		];
		return this.multiplyByScalar(1/det);
	},
	determinant: function(){
		var tv = this.v;
		return tv[0]*(tv[4]*tv[8]-tv[5]*tv[7])-tv[1]*(tv[3]*tv[8]-tv[5]*tv[6])+tv[2]*(tv[3]*tv[7]-tv[4]*tv[6]);
	},
	multiplyByVector: function(v){
		return new Grape2D.Vector(
			this.v[0]*v.x+this.v[1]*v.y+this.v[2],
			this.v[3]*v.x+this.v[4]*v.y+this.v[5]
		);
	},
	multiplyByScalar: function(scalar){
		this.v[0]*=scalar;
		this.v[1]*=scalar;
		this.v[2]*=scalar;

		this.v[3]*=scalar;
		this.v[4]*=scalar;
		this.v[5]*=scalar;

		this.v[6]*=scalar;
		this.v[7]*=scalar;
		this.v[8]*=scalar;
		return this;
	},
	multiplyByMatrix: function(matrix){
		var v = this.v, m = matrix.v,
			aa = v[0]*m[0]+v[1]*m[3]+v[2]*m[6], ab = v[0]*m[1]+v[1]*m[4]+v[2]*m[7], ac = v[0]*m[2]+v[1]*m[5]+v[2]*m[8],
			ba = v[3]*m[0]+v[4]*m[3]+v[5]*m[6], bb = v[3]*m[1]+v[4]*m[4]+v[5]*m[7], bc = v[3]*m[2]+v[4]*m[5]+v[5]*m[8],
			ca = v[6]*m[0]+v[7]*m[3]+v[8]*m[6], cb = v[6]*m[1]+v[7]*m[4]+v[8]*m[7], cc = v[6]*m[2]+v[7]*m[5]+v[8]*m[8];

		return new Grape2D.Matrix(
			aa, ab, ac,
			ba, bb, bc,
			ca, cb, cc
		);
	},
	transpose: function(){
		var tmp, m = this.v;
		tmp = m[1]; m[1] = m[3]; m[3] = tmp;
		tmp = m[2]; m[2] = m[6]; m[6] = tmp;
		tmp = m[5]; m[5] = m[7]; m[7] = tmp;

		return this;
	},
	rotate: function(angle){
		return;
	},
	setRendererTransform: function(renderer){
		renderer.transform(this.v[0], this.v[1], this.v[2], this.v[3], this.v[4], this.v[5]);
	},
	clone: function(){
		return new Grape2D.Matrix(this.v[0], this.v[1], this.v[2], this.v[3], this.v[4], this.v[5], this.v[6], this.v[7], this.v[8]);
	},
	toString: function(){
		return "Grape2D.Matrix\n"+this.v[0]+" "+this.v[1]+" "+this.v[2]+"\n"+
			this.v[3]+" "+this.v[4]+" "+this.v[5]+"\n"+
			this.v[6]+" "+this.v[7]+" "+this.v[8];
	}

};/**
 * Renderers are used to render graphics to the screen.
 *
 * @interface
 */
Grape2D.Renderer = function() {};

Grape2D.Renderer.prototype = {
	constructor: Grape2D.Renderer,
	/**
	 * Gets the renderer width.
	 *
	 * @return {number} the width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width of the renderer.
	 *
	 * @return {number} the half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width of the renderer and computes the half width.
	 *
	 * @param  {number} width the width
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets the renderer height
	 *
	 * @return {number} the height
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height of the renderer
	 *
	 * @return {number} the half width
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height of the renderer and computes the half height.
	 *
	 * @param  {number} height the new height
	 * @public
	 */
	setHeight: function(height) {},
	/**
	 * Renders a texture to a position on the renderer.
	 *
	 * @param  {Grape2D.ITexture} texture the texture to render
	 * @param  {Grape2D.Vector} position the position to render
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
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the coordinates.
	 * @public
	 */
	renderAABB: function(aabb, camera) {},
	/**
	 * Renders the wireframe of a circle.
	 *
	 * @param  {!Grape2D.Circle} circle Circle to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the coordinates.
	 * @public
	 */
	renderCircle: function(circle, camera) {},
	/**
	 * Renders the wireframe of a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to render.
	 * @param  {!Grape2D.Camera} camera The camera to transfrom the coordinates.
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
	 * @param  {string} color New color to use when stroking.
	 * @public
	 */
	setStrokeColor: function(color) {},
	/**
	 * Sets a new fill color.
	 *
	 * @param  {string} color New color to use when filling.
	 * @public
	 */
	setFillColor: function(color) {}
};/**
 * This is a simple abstraction of the canvas object,
 * may be used to do some optimizations
 * @constructor
 */
Grape2D.Canvas = function(options) {
	if (!options) options = {};
	this.canvas = document.createElement("Canvas");
	this.canvas.width = this.width = options.width || 300;
	this.canvas.height = this.height = options.height || 150;
	this.halfWidth = this.width / 2;
	this.halfHeight = this.height / 2;
	this.context = this.getContext();
};

Grape2D.Canvas.prototype = {
	getWidth: function() {
		return this.width;
	},
	getHalfWidth: function() {
		return this.halfWidth;
	},
	setWidth: function(width) {
		this.canvas.width = this.width = width;
		this.halfWidth = this.width / 2;
	},
	getHeight: function() {
		return this.height;
	},
	getHalfHeight: function() {
		return this.halfHeight;
	},
	setHeight: function(height) {
		this.canvas.height = this.height = height;
		this.halfHeight = this.width / 2;
	},
	/** Canvas element **/
	toDataURL: function(type, args) {
		return this.context.toDataURL(type, args);
	},
	getContext: function() {
		return this.canvas.getContext("2d");
	},
	/** 2D Context **/
	save: function() {
		this.context.save();
		return this;
	},
	restore: function() {
		this.context.restore();
		return this;
	},
	/** Transformations **/
	scale: function(x, y) {
		this.context.scale(x, y);
		return this;
	},
	rotate: function(angle) {
		this.context.rotate(angle);
		return this;
	},
	translate: function(x, y) {
		this.context.translate(x, y);
		return this;
	},
	transform: function(m11, m12, m21, m22, dx, dy) {
		this.context.transform(m11, m12, m21, m22, dx, dy);
		return this;
	},
	/** Image drawing **/
	/**
	 * Draws an image to the canvas.
	 * @param image: HTMLImageElement, HTMLCanvasElement or HTMLVideoElement
	 * @param dx: destination x
	 * @param dy: destination y
	 * @param dw: destination width
	 * @param dh: destination height
	 * @param sx: source x
	 * @param sy: source y
	 * @param sw: source width
	 * @param sh: source height
	 */
	drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
	},
	/** Compositing **/
	setGlobalAlpha: function(value) {
		this.context.globalAlpha = value;
		return this;
	},
	globalCompositeOperation: function(flag) {
		this.context.globalCompositeOperation = flag;
		return this;
	},
	/** Lines **/
	setLineWidth: function(value) {
		this.context.lineWidth = value;
		return this;
	},
	setLineCap: function(value) {
		this.context.lineCap = value;
		return this;
	},
	setLineJoin: function(value) {
		this.context.lineJoin = value;
		return this;
	},
	setMiterLimit: function(value) {
		this.context.miterLimit = value;
		return this;
	},
	/** Colors **/
	setStrokeStyle: function(value) {
		this.context.strokeStyle = value;
		return this;
	},
	setFillStyle: function(value) {
		this.context.fillStyle = value;
		return this;
	},
	setShadowOffsetX: function(value) {
		this.context.shadowOffsetX = value;
		return this;
	},
	setShadowOffsetY: function(value) {
		this.context.shadowOffsetY = value;
		return this;
	},
	setShadowBlur: function(value) {
		this.context.shadowBlur = value;
		return this;
	},
	setShadowColor: function(value) {
		this.context.shadowColor = value;
		return this;
	},

	createLinearGradient: function(x0, y0, x1, y1) {
		return this.context.createLinearGradient(x0, y0, x1, y1);
	},
	createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
		return this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
	},
	createPattern: function(image, repetition) {
		return this.context.createPattern(image, repetition);
	},
	/** Paths **/
	beginPath: function() {
		this.context.beginPath();
		return this;
	},
	closePath: function() {
		this.context.closePath();
		return this;
	},
	fill: function() {
		this.context.fill();
		return this;
	},
	stroke: function() {
		this.context.stroke();
		return this;
	},
	clip: function() {
		this.context.clip();
		return this;
	},
	moveTo: function(x, y) {
		this.context.moveTo(x, y);
		return this;
	},
	lineTo: function(x, y) {
		this.context.lineTo(x, y);
		return this;
	},
	quadraticCurveTo: function(cpx, cpy, x, y) {
		this.context.quadraticCurveTo(cpx, cpy, x, y);
		return this;
	},
	bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		return this;
	},
	arcTo: function(x1, y1, x2, y2, radius) {
		this.context.arcTo(x1, y1, x2, y2, radius);
		return this;
	},
	arc: function(x, y, radius, startAngle, endAngle, CCW) {
		this.context.arc(x, y, radius, startAngle || 0, endAngle || Grape2D.Math.PIx2, CCW || false);
		return this;
	},
	rect: function(x, y, w, h) {
		this.context.rect(x, y, w, h);
		return this;
	},
	isPointInPath: function(x, y) {
		return this.context.isPointInPath(x, y);
	},
	/** Text **/
	setFont: function(font) {
		this.context.font = font;
		return this;
	},
	setTextAlign: function(value) {
		this.context.textAlign = value;
		return this;
	},
	setTextBaseline: function(baseline) {
		this.context.textBaseline = baseline;
		return this;
	},
	fillText: function(text, x, y, maxWidth) {
		this.context.fillText(text, x, y);
		return this;
	},
	strokeText: function(text, x, y, maxWidth) {
		this.context.strokeText(text, x, y);
		return this;
	},
	measureText: function(text) {
		return this.context.measureText(text);
	},
	/** Rectangles **/
	clearRect: function(x, y, w, h) {
		this.context.clearRect(x, y, w, h);
		return this;
	},
	fillRect: function(x, y, w, h) {
		this.context.fillRect(x, y, w, h);
		return this;
	},
	strokeRect: function(x, y, w, h) {
		this.context.strokeRect(x, y, w, h);
		return this;
	},
	/** Pixel manipulation **/
	createImageData: function(sw, sh) {
		return this.context.createImageData(sw, sh);
	},
	getImageData: function(imageData) {
		return this.context.getImageData(imageData);
	},
	putImageData: function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
		this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		return this;
	},
	resize: function(w, h) {
		this.width = this.canvas.width = w;
		this.height = this.canvas.height = h;
	},
	appendOn: function(on) {
		//this.canvas.style.position = 'absolute';
		on.appendChild(this.canvas);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.width, this.height);
	}
};/**
 * This renders objects to a canvas object, with a 2D context. This
 *   method is not hardware accelerated by default, however is the
 *   most stable and cross-browser.
 *
 * @param  {Object=} options Options to setup the renderer.
 * @param  {number=} options.width Width of the renderer.
 * @param  {number=} options.height Height of the renderer.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.CanvasRenderer = function(options) {
	/**
	 * A canvas object
	 *
	 * @type {Grape2D.Canvas}
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
Grape2D.CanvasRenderer.prototype.renderImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderAABB = function(aabb, camera) {
	var startPosition = aabb.getPosition().clone(),
		topLeft = startPosition.clone(),
		topRight = startPosition.clone(),
		bottomRight = startPosition.clone(),
		bottomLeft = startPosition;

	topLeft.x -= aabb.getHalfWidth();
	topLeft.y -= aabb.getHalfHeight();
	topLeft = camera.wcsToViewport(this, topLeft);

	topRight.x += aabb.getHalfWidth();
	topRight.y -= aabb.getHalfHeight();
	topRight = camera.wcsToViewport(this, topRight);

	bottomLeft.x -= aabb.getHalfWidth();
	bottomLeft.y += aabb.getHalfHeight();
	bottomLeft = camera.wcsToViewport(this, bottomLeft);

	bottomRight.x += aabb.getHalfWidth();
	bottomRight.y += aabb.getHalfHeight();
	bottomRight = camera.wcsToViewport(this, bottomRight);

	this.canvas.beginPath();
	this.canvas.moveTo(topLeft.x, topLeft.y);
	this.canvas.lineTo(topRight.x, topRight.y);
	this.canvas.lineTo(bottomRight.x, bottomRight.y);
	this.canvas.lineTo(bottomLeft.x, bottomLeft.y);
	this.canvas.lineTo(topLeft.x, topLeft.y);
	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderCircle = function(circle, camera) {
	var center = camera.wcsToViewport(this, circle.getPosition());

	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, circle.getRadius(), 0, Grape2D.Math.PIx2, false);

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
	this.canvas.strokeText(text, position.getX(), position.getY());
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
};/**
 * Only renders the wireframe of (the bounding box of)
 *   {@link Grape2D.Object2D}, using another {@link Grape2D.Renderer}, 
 *   such as {@link Grape2D.CanvasRenderer}. This class is a bridge, so in fact
 *   the renderer provided is the one that is being used.
 *
 * @param  {Grape2D.Renderer} renderer The renderer to use.
 * @implements {Grape2D.Renderer}s
 * @constructor
 */
Grape2D.WireframeRenderer = function (renderer) {
	this.renderer = renderer;
};

Grape2D.WireframeRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getWidth = function(){
	return this.renderer.getWidth();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHalfWidth = function(){
	return this.renderer.getHalfWidth();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setWidth = function(width){
	this.renderer.setWidth(width);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHeight = function(){
	return this.renderer.getHeight();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getHalfHeight = function(){
	return this.renderer.getHalfHeight();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setHeight = function(height){
	this.renderer.setHeight(height);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderTexture = function (texture, position) {
	this.renderer.renderTexture(texture, position);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderObject2D = function (obj, camera) {
	//debugger;
	var objCenter = camera.wcsToViewport(this, obj.getPosition());

	this.renderer.canvas.fillRect(objCenter.x, objCenter.y, 2, 2);

	obj.getBoundingBox().render(this, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.renderer.renderImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAABB = function (aabb, camera) {
	this.renderer.renderAABB(aabb, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderCircle = function (circle, camera) {
	this.renderer.renderCircle(circle, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPolygon = function (polygon, camera) {
	this.renderer.renderPolygon(polygon, camera);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderText = function (text, position) {
	this.renderer.renderText(text, position);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.start = function () {
	this.renderer.start();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.end = function () {
	this.renderer.end();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.appendToDOMElement = function (elm) {
	this.renderer.appendToDOMElement(elm);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.getDOMElement = function () {
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
};/* global Grape2D */
/**
 * Managers inputs.
 *
 * @param  {!Grape2D.Renderer} renderer Renderer to listen.
 *
 * @constructor
 */
Grape2D.InputManager = function(renderer) {

	this.mouseUp = [];
	this.mouseDown = [];
	this.mouseMove = [];
	this.mouseOver = [];
	this.mouseOut = [];
	this.mouseWheel = [];
	this.resize = [];
	/**
	 * Renderer
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.rendererBinding = renderer;
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

		dom.addEventListener('mouseup', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseUp), false);
		dom.addEventListener('mousedown', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseDown), false);
		dom.addEventListener('mousemove', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseMove), false);
		dom.addEventListener('mouseover', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOver), false);
		dom.addEventListener('mouseout', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseOut), false);
		dom.addEventListener('mousewheel', Grape2D.InputManager.bindFn(this.rendererBinding, this.mouseWheel), false);
		dom.addEventListener('resize', Grape2D.InputManager.bindFn(this.rendererBinding, this.resize), false);

		//add fns for click and drag

		//register them globally
		//Grape2D.InputManager.registerGlobal('keydown', Grape2D.InputManager.clickBind(this));
		/*dom.addEventListener('keydown', Grape2D.InputManager.clickBind(this));
		dom.addEventListener('keyup', Grape2D.InputManager.clickBind(this));
		dom.addEventListener('keypress', Grape2D.InputManager.clickBind(this));*/
	},
	getMouseUpBindStack: function() {
		return this.mouseUp;
	},
	addMouseUp: function(callback) {
		this.mouseUp.push(callback);
	},
	removeMouseUp: function(callback) {
		var indx = this.mouseUp.indexOf(callback);
		if (indx >= 1) {
			this.mouseUp.splice(this.mouseUp.indexOf(callback), 1);
		}
	},
	getMouseDownBindStack: function() {
		return this.mouseDown;
	},
	addMouseDown: function(callback) {
		this.mouseDown.push(callback);
	},
	removeMouseDown: function(callback) {
		var indx = this.mouseDown.indexOf(callback);
		if (indx >= 1) {
			this.mouseDown.splice(this.mouseDown.indexOf(callback), 1);
		}
	},
	getMouseMoveBindStack: function() {
		return this.mouseMove;
	},
	addMouseMove: function(callback) {
		this.mouseMove.push(callback);
	},
	removeMouseMove: function(callback) {
		var indx = this.mouseMove.indexOf(callback);
		if (indx >= 1) {
			this.mouseMove.splice(this.mouseMove.indexOf(callback), 1);
		}
	},
	getMouseOverBindStack: function() {
		return this.mouseOver;
	},
	addMouseOver: function(callback) {
		this.mouseOver.push(callback);
	},
	removeMouseOver: function(callback) {
		var indx = this.mouseOver.indexOf(callback);
		if (indx >= 1) {
			this.mouseOver.splice(this.mouseOver.indexOf(callback), 1);
		}
	},
	getMouseOutBindStack: function() {
		return this.mouseOut;
	},
	addMouseOut: function(callback) {
		this.mouseOut.push(callback);
	},
	removeMouseOut: function(callback) {
		var indx = this.mouseOut.indexOf(callback);
		if (indx >= 1) {
			this.mouseOut.splice(this.mouseOut.indexOf(callback), 1);
		}
	},
	getMouseWheelBindStack: function() {
		return this.mouseWheel;
	},
	addMouseWheel: function(callback) {
		this.mouseWheel.push(callback);
	},
	removeMouseWheel: function(callback) {
		var indx = this.mouseWheel.indexOf(callback);
		if (indx >= 1) {
			this.mouseWheel.splice(this.mouseWheel.indexOf(callback), 1);
		}
	},
	getResizeBindStack: function() {
		return this.resize;
	},
	addResize: function(callback) {
		this.resize.push(callback);
	},
	removeResize: function(callback) {
		var indx = this.resize.indexOf(callback);
		if (indx >= 1) {
			this.resize.splice(this.resize.indexOf(callback), 1);
		}
	}

};

Grape2D.InputManager.bindFn = function(binding, stck) {
	var fn = function(ev) {
		var i = 0,
			evnt = new Grape2D.InputManagerEvent(binding, ev);
		for (; i < stck.length; i++) {
			stck[i](evnt);
		}
	};

	return fn;
};

Grape2D.InputManager.globalRegistry = {
	keyDown: {},
	keyUp: {},
	keyPress: {}
};/**
 * Event.
 *
 * @param  {Event} ev The DOM event.
 * @param  {Grape2D.Renderer} bind Renderer where the event happened.
 * @constructor
 */
Grape2D.InputManagerEvent = function(bind, ev) {
	this.raw = ev;
	this.bind = bind
};

Grape2D.InputManagerEvent.prototype = {
	constructor: Grape2D.InputManagerEvent,
	getRaw: function() {
		return this.raw;
	}
};/**
 * Camera is used to select the objects to display in a scene.
 *   A camera doesn't rotate or scale objects in the x and y axis,
 *   only the coordinates are changed to the transformation defined.
 *
 * @param {Grape2D.Vector} options.scale - The scale to be applied. There
 *		are two ways to define the scale. This method is one, the other
 *		is defined it directly in the transformation. If the two are set,
 *		then the two are applied.
 * @param {Grape2D.Vector} options.lookAt - Defines the (center) position,
 *		to where the camera is looking at.
 * @param {Grape2D.Matrix} options.transformation - Transformation matrix
 *		to be applied to the object coordinates.
 *
 * @constructor
 */
Grape2D.Camera = function (options) {
	/**
	 * Scale relative to the camera initialization.
	 *
	 * @type {Grape2D.Vector}
	 * @private
	 */
	this.rscale = new Grape2D.Vector(1, 1);
	/**
	 * Scale set by the user, should be defined in the matrix.
	 *
	 * @type {Grape2D.Vector}
	 * @private
	 */
	this.scale = options.scale || new Grape2D.Vector(1, 1);
	/**
	 * The position to where the camera is looking at.
	 *
	 * @type {Grape2D.Vector}
	 * @private
	 */
	this.lookAt = options.lookAt || new Grape2D.Vector();
	/**
	 * The transformation matrix to aply to the object coordinates.
	 *
	 * @type {Grape2D.Matrix}
	 * @private
	 */
	this.transformation = options.transformation || new Grape2D.Matrix();

	/**
	 * Computed matrix
	 *
	 * @type {Grape2D.Matrix}
	 * @private
	 */
	this.cM = new Grape2D.Matrix();
	/**
	 * Inverse of the computed matrix
	 *
	 * @type {Grape2D.Matrix}
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
	computeMatrix: function () {
		this.cM = this.transformation.clone();
		//This operations should work fine, and it avoids a multiplication
		//between the _cM matrix and a vector when converting coordinates
		this.cM.v[0] *= this.scale.x * this.rscale.x;
		this.cM.v[1] *= this.scale.x * this.rscale.x;
		this.cM.v[2] *= this.scale.x * this.rscale.x;

		this.cM.v[3] *= this.scale.y * this.rscale.y;
		this.cM.v[4] *= this.scale.y * this.rscale.y;
		this.cM.v[5] *= this.scale.y * this.rscale.y;

		this.icM = this.cM.clone().invert();
	},
	/**
	 * Applies the transformation, on a vector in the World Coordinate
	 * System (WCS), to get a vector in the Viewport (Renderer) Coordinate
	 * System (VSC).
	 *
	 * @param  {Grape2D.Renderer} renderer - The viewport.
	 * @param  {Grape2D.Vector} vector - Vector in the WCS.
	 *
	 * @return {Grape2D.Vector} A vector in the VCS
	 * @public
	 */
	wcsToViewport: function (renderer, vector) {
		var v = this.cM.multiplyByVector(vector.clone().sub(this.lookAt));

		v.x += renderer.getHalfWidth();
		v.y += renderer.getHalfHeight();

		return v;
	},
	/**
	 * Applies the transformation, on a vector in the Viewport Coordinate
	 * System (VCS), to get a vector in the World Coordinate System (WSC).
	 *
	 * @param  {Grape2D.Renderer} renderer - The viewport.
	 * @param  {Grape2D.Vector} vector - Vector in the VCS.
	 *
	 * @return {Grape2D.Vector} A vector in the WCS
	 * @public
	 */
	viewportToWcs: function (renderer, vector) {
		var v = vector.clone();

		v.x -= renderer.getHalfWidth();
		v.y -= renderer.getHalfWidth();

		v = this.icM.multiplyByVector(v).sub(this.lookAt);

		return v;
	},
	/**
	 * Sets a new scale.
	 *
	 * @param  {Grape2D.Vector} scale - The new scale.
	 * @public
	 */
	rescale: function (scale) {
		this.rscale.x = scale.x / this.scale.x;
		this.rscale.y = scale.y / this.scale.y;
		this.computeMatrix();
	},
	/**
	 * Sets the center position to where the camera is looking at.
	 *
	 * @param  {Grape2D.Vector} position - The new look at.
	 * @public
	 */
	setLookAt: function (position) {
		this.lookAt.set(position);
	},
	/**
	 * Gets the look at property.
	 *
	 * @return {Grape2D.Vector} The look at.
	 */
	getLookAt: function () {
		return this.lookAt;
	},
	/**
	 * Gets the current scale. Scale defined in the transformation is
	 * not taken into account.
	 *
	 * @return {Grape2D.Vector} Scale
	 */
	getScale: function () {
		return this.scale;
	},
	/**
	 * Creates a shape, based on the camera transformation and 
	 *   renderer properties.
	 *
	 * @param  {Grape2D.Renderer} renderer The renderer.
	 *
	 * @return {Grape2D.Shape} A bounding volume representing the 
	 *   camera view region.
	 */
	computeShape: function (renderer) {
		var pos = new Grape2D.Vector().set(this.lookAt),
			w = renderer.getWidth()/this.scale.x,
			h = renderer.getHeight()/this.scale.y;

		return new Grape2D.AABB({
			position: pos,
			width: w,
			height: h
		});
	}
};/**
 * [ description]
 *
 * @param  {[type]} options [description]
 *
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
 * @override
 */
Grape2D.AliasingCamera.prototype.wcsToViewport = function(renderer, vector){
	return Grape2D.Camera.prototype.wcsToViewport.call(this, renderer, vector).use(Grape2D.Math.floor);
};/**
 * @classdesc Map describes the structure that holds the objects of a scene.
 *            It's an interface, so all implementation details should be
 *            described in higher level classes.
 *
 * @interface
 * @class
 */
Grape2D.Map = function(){};

Grape2D.Map.prototype = {
	constructor: Grape2D.Map,
	/**
	 * Adds an object to the map.
	 *
	 * @param  {Grape2D.Object2D} obj2d - The object to e added.
	 *
	 * @public
	 */
	add: function(obj2d){},
	/**
	 * Removes an object from the map.
	 *
	 * @param  {Grape2D.Object2D} obj2d - The object to remove.
	 *
	 * @public
	 */
	remove: function(obj2d){},
	/**
	 * Query the shape region, in this map.
	 *
	 * @param  {Grape2D.Shape} shape - The shape to query.
	 *
	 * @return {Array.<Grape2D.Object2D>} All the objects inside the shape.
	 *
	 * @public
	 */
	query: function(shape){},
	/**
	 * Query the point in this map.
	 *
	 * @param  {Grape2D.Vector} vector - The vector to query.
	 *
	 * @return {Array.<Grape2D.Object2D>} All objects that contains the point.
	 *
	 * @public
	 */
	queryPoint: function(vector){},
	/**
	 * Clears the map.
	 *
	 * @public
	 */
	clear: function(){},
	/**
	 * Updates all the objects of the map.
	 *
	 * @param  {number} dt - Time elapsed.
	 * @param  {Grape2D.Scene} scene - The scene, that the map represents.
	 *
	 * @public
	 */
	update: function(dt, scene){}
};/**
 * @classdesc SimpleMap, represents a proof of concept. This is a simple map,
 *            that just implements a simple array to store objects.
 *
 * @implements {Grape2D.Map}
 * @constructor
 */
Grape2D.SimpleMap = function () {
	/**
	 * Objects of the map.
	 * @private {Array.<Grape2D.Object2D>}
	 */
	this.objs = [];
};

Grape2D.SimpleMap.prototype = Object.create(Grape2D.Map);

/**
 * @override
 */
Grape2D.SimpleMap.prototype.add = function (object) {
	this.objs.push(object);
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.remove = function (object) {
	this.objs.splice(this.objs.indexOf(object), 1);
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.query = function (region) {
	return this.objs;
};
/**
 * Not implemented.
 * @override
 */
Grape2D.SimpleMap.prototype.queryPoint = function (vector) {
	return this.objs;
};
/**
 * Not implemented.
 * @override
 */
Grape2D.SimpleMap.prototype.clear = function () {
	this.objs = [];
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.update = function (dt, scene) {
	for (var i = 0; i < this.objs.length; i++) {
		this.objs[i].update(dt, scene);
	}
};/**
 * Collides objects, and returns just if they're colliding, giving
 *   no other information.
 *
 * @interface
 */
Grape2D.CollisionChecker = function() {};

Grape2D.CollisionChecker.prototype = {
	constructor: Grape2D.CollisionChecker,
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {Grape2D.AABB} aabb1 An AABB.
	 * @param  {Grape2D.AABB} aabb2 The other AABB.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	aabbVsAabb: function(aabb1, aabb2) {},
	/**
	 * Collides an AABB against a Circle.
	 *
	 * @param  {Grape2D.AABB} aabb An AABB.
	 * @param  {Grape2D.Circle} circle A circle.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	aabbVsCircle: function(aabb, circle) {},
	/**
	 * Collides an AABB against a Polygon.
	 *
	 * @param  {Grape2D.AABB} aabb An AABB.
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	aabbVsPolygon: function(aabb, polygon) {},
	/**
	 * Checks if a point is inside an AABB.
	 *
	 * @param  {Grape2D.AABB} aabb An AABB.
	 * @param  {Grape2D.Vector} point A point.
	 *
	 * @return {boolean} True if the point is inside the AABB.
	 */
	aabbVsPoint: function(aabb, point) {},
	/**
	 * Collides a Circle against an AABB.
	 *
	 * @param  {Grape2D.Circle} circle A circle.
	 * @param  {Grape2D.AABB} aabb An AABB.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	circleVsAabb: function(circle, aabb) {},
	/**
	 * Collides a Circle against another Circle.
	 *
	 * @param  {Grape2D.Circle} circle1 A circle.
	 * @param  {Grape2D.Circle} circle2 Another cicle.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	circleVsCircle: function(circle1, circle2) {},
	/**
	 * Collides a Circle against a polygon.
	 *
	 * @param  {Grape2D.Circle} circle A circle.
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	circleVsPolygon: function(circle, polygon) {},
	/**
	 * Checks if a point is inside an Circle.
	 *
	 * @param  {Grape2D.Circle} circle A circle.
	 * @param  {Grape2D.Vector} point A point.
	 *
	 * @return {boolean} True if the point is inside the circle.
	 */
	circleVsPoint: function(circle, point) {},
	/**
	 * Collides a Polygon against an AABB.
	 *
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 * @param  {Grape2D.AABB} aabb An AABB.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	polygonVsAabb: function(polygon, aabb) {},
	/**
	 * Collides a Polygon against a circle.
	 *
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 * @param  {Grape2D.Circle} circle A circle.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	polygonVsCircle: function(polygon, circle) {},
	/**
	 * Collides a Polygon against another Polygon.
	 *
	 * @param  {Grape2D.Polygon} polygon1 A polygon.
	 * @param  {Grape2D.Polygon} polygon2 A polygon.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	polygonVsPolygon: function(polygon1, polygon2) {},
	/**
	 * Checks if a point is inside a polygon.
	 *
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 * @param  {Grape2D.Vector} point A point.
	 *
	 * @return {boolean} True if the point is inside the polygon.
	 */
	polygonVsPoint: function(polygon, point) {}

};/**
 * This implements generic methods of the collision controlle. Since
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
	return Grape2D.Math.abs(aabb2.getPosition().getX() - aabb1.getPosition().getX()) <= (aabb1.getHalfWidth() + aabb2.getHalfWidth()) &&
		Grape2D.Math.abs(aabb2.getPosition().getY() - aabb1.getPosition().getY()) <= (aabb1.getHalfHeight() + aabb2.getHalfHeight());
};

/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsPoint = function(aabb, point) {
	return Grape2D.Math.abs(aabb.getPosition().getX() - point.getX()) <= aabb.getHalfWidth() && Grape2D.Math.abs(aabb.getPosition().getY() - point.getY()) <= aabb.getHalfHeight();
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
Grape2D.GenericCollisionChecker.prototype.aabbVsCircle = function(aabb, circle) {
	var xC = Grape2D.Math.clamp(circle.getPosition().getX(), aabb.getPosition().getX() - aabb.getHalfWidth(), aabb.getPosition().getX() + aabb.getHalfWidth()),
		yC = Grape2D.Math.clamp(circle.getPosition().getY(), aabb.getPosition().getY() - aabb.getHalfWidth(), aabb.getPosition().getY() + aabb.getHalfWidth());
	return Grape2D.Math.sq(circle.getPosition().getX() - xC) + Grape2D.Math.sq(circle.getPosition().getY() - yC) >= Grape2D.Math.sq(circle.getRadius());
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
	var list = polygon.getVertexList(),
		cPos = circle.getPosition(),
		r = Grape2D.Math.sq(circle.getRadius());
	for (var i = 0; i < list.length; i++) {
		if (list[i].sqDistanceTo(cPos) <= r) {
			return false;
		}
	}
	return true;
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
 * <link>http://demonstrations.wolfram.com/AnEfficientTestForAPointToBeInAConvexPolygon/</link>
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
};/**
 * Concrete collision checker, that implements the SAT algorithm.
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
	return false;
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	var axis = this.selectAxis(this.computeAxis(polygon1.getVertexList()), this.computeAxis(polygon2.getVertexList())),
		p1Intv = this.computeIntervals(polygon1.getVertexList(), axis),
		p2Intv = this.computeIntervals(polygon2.getVertexList(), axis),
		overlap;

	for (var i = 0; i < axis.length; i++) {
		overlap = Grape2D.Math.overlaps(p1Intv, p2Intv);
		if (overlap < 0) {
			return false;
		}
	}
	return true;
};
Grape2D.SATCollisionChecker.prototype.computeAxis = function(polygon) {
	var res = [],
		list = polygon.getVertexList(),
		n, i;
	for (i = 0; i < list.length; i++) {
		n = (i + 1) % list.length;
		res.push(Grape2D.Vector.createFromPoints(list[i], list[n]).normalize().rightNormal());
	}
	return res;
};
Grape2D.SATCollisionChecker.prototype.selectAxis = function(listA, listB) {
	var res = [],
		e;
	for (var i = 0; i < listA.length; i++) {
		res.push(listA);
	}

	for (i = 0, e = true; i < res.length; i++, e = true) {
		for (var j = 0; j < listB.length; j++) {
			if (res[i].isParallelTo(listB[j])) {
				e = false;
			}
		}
		if (e) {
			res.push(listB[i]);
		}
	}

	return res;
};
/**
 * [ description]
 *
 * @param  {Array.<Grape2D.Vector>} vertexList [description]
 * @param  {Array.<Grape2D.Vector>} axis [description]
 *
 * @return {[type]} [description]
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

Grape2D.SATCollisionChecker.aabbAxis = [new Grape2D.Vector(1, 0), new Grape2D.Vector(0, 1)];/**
 * Dispatch the collisions, providing a simple interface.
 *
 * @class
 */
Grape2D.CollisionDispatcher = {
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {Grape2D.AABB} aabb1 An AABB.
	 * @param  {Grape2D.AABB} aabb2 Another AABB.
	 * @return {boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsAabb: function(cchecker, aabb1, aabb2) {
		return cchecker.aabbVsAabb(aabb1, aabb2);
	},
	aabbVsCircle: function(cchecker, aabb, circle) {
		return cchecker.aabbVsCircle(aabb, circle);
	},
	aabbVsPolygon: function(cchecker, aabb, polygon) {
		return cchecker.aabbVsPolygon(aabb, polygon);
	},
	aabbVsPoint: function(cchecker, aabb, point) {
		return cchecker.aabbVsPoint(aabb, point);
	},

	circleVsAabb: function(cchecker, circle, aabb) {
		return cchecker.circleVsAabb(circle, aabb);
	},
	circleVsCircle: function(cchecker, circle1, circle2) {
		return cchecker.circleVsCircle(circle1, circle2);
	},
	circleVsPolygon: function(cchecker, circle, polygon) {
		return cchecker.aabbVsPolygon(circle, polygon);
	},
	circleVsPoint: function(cchecker, circle, point) {
		return cchecker.circleVsPoint(circle, point);
	},

	polygonVsAabb: function(cchecker, polygon, aabb) {
		return cchecker.polygonVsAabb(polygon, aabb);
	},
	polygonVsCircle: function(cchecker, polygon, circle) {
		return cchecker.polygonVsCircle(polygon, circle);
	},
	polygonVsPolygon: function(cchecker, polygon1, polygon2) {
		return cchecker.polygonVsPolygon(polygon1, polygon2);
	},
	polygonVsPoint: function(cchecker, polygon, point) {
		return cchecker.aabbVsPolygon(polygon, point);
	},
	dcache: {},
	dispatch: function(cchecker, a, b) {
		return Grape2D.CollisionDispatcher.dcache[a.getStaticType()][b.getStaticType()](cchecker, a, b);
	}
};

Grape2D.CollisionDispatcher.dcache = {
	"AABB": {
		"AABB": Grape2D.CollisionDispatcher.aabbVsAabb,
		"Circle": Grape2D.CollisionDispatcher.aabbVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.aabbVsPolygon,
		"Point": Grape2D.CollisionDispatcher.aabbVsPoint
	},
	"Circle": {
		"AABB": Grape2D.CollisionDispatcher.circleVsAabb,
		"Circle": Grape2D.CollisionDispatcher.circleVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.circleVsPolygon,
		"Point": Grape2D.CollisionDispatcher.circleVsPoint
	},
	"Polygon": {
		"AABB": Grape2D.CollisionDispatcher.polygonVsAabb,
		"Circle": Grape2D.CollisionDispatcher.polygonVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.polygonVsPolygon,
		"Point": Grape2D.CollisionDispatcher.polygonVsPoint
	}
}/**
 * Singleton to store the in use collision checker strategy.
 *
 * @class
 */
Grape2D.CollisionCheckerSingleton = {
	/**
	 * Collision checker instance.
	 *
	 * @private {Grape2D.CollisionChecker}
	 * @static
	 */
	instance: new Grape2D.GenericCollisionChecker(),
	/**
	 * Gets the collision checker instance.
	 *
	 * @return {Grape2D.CollisionChecker} The instance.
	 * @public
	 * @static
	 */
	getCollisionChecker: function(){
		return Grape2D.CollisionCheckerSingleton.instance;
	},
	/**
	 * Sets the collision checker instance.
	 *
	 * @param  {Grape2D.CollisionChecker} instance The new instance.
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
	 * @param  {Grape2D.Shape} a Shape
	 * @param  {Grape2D.Shape} b Another shape
	 *
	 * @return {boolean} Result of the collision test.
	 * @public
	 * @static
	 */
	collide: function(a, b){
		return Grape2D.CollisionDispatcher.dispatch(Grape2D.CollisionCheckerSingleton.instance, a, b);
	},
	contains: function(a, p){}
};/**
 * A bounding volume hierarchy (BVH) organizes a bounding volumes according
 *   to an hierarchy.
 * @interface
 * @extends {Grape2D.Map}
 * @class
 */
Grape2D.BVHTree = function(){};

Grape2D.BVHTree.prototype = Object.create(Grape2D.Map.prototype);/**
 * With the top down approach the area of the bounding volume will reduce
 *   at every level.
 *
 * @param  {?Array.<Grape2D.Object2D>} objs List with objects. If objects are provided then tree will be build.
 *
 * @constructor
 * @implements {Grape2D.BVHTree}
 */
Grape2D.TopDownBVHTree = function(objs){
	/**
	 * Objects of the tree
	 * @private {Array.<Grape2D.Object2D>}
	 */
	this.objs = objs || [];
	/**
	 * The root node of the tree.
	 * @private {Grape2D.TopDownBVHNode}
	 */
	this.rootNode = null;
	//builds the tree if needed be.
	if(this.objs.length){
		this.rebuild();
	}
};

Grape2D.TopDownBVHTree.prototype = Object.create(Grape2D.BVHTree.prototype);

Grape2D.TopDownBVHTree.prototype.rebuild = function(){
	this.rootNode = new Grape2D.TopDownBVHNode(null, this.objs);
};
/**
 * Adding objects to the tree will not cause it to rebuild.
 * @override
 */
Grape2D.TopDownBVHTree.prototype.add = function(obj){
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
	return this.rootNode.query(bv);
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.queryPoint = function(vector) {
	return this.rootNode.queryPoint(vector);
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.clear = function(){
	this.objs = [];
	this.rootNode = null;
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.update = function(dt, scene){
	for(var i=0; i<this.objs.length; i++){
		this.objs[i].update(dt, scene);
	}
};/**
 * Node of a top down BVH.
 *
 * @param  {?Grape2D.TopDownBVHNode} parent Parent node, or null, it it's
 *   the root node.
 * @param  {Array.<Grape2D.Object2D>} objects Objects to be added to the
 *   node.
 *
 * @constructor
 */
Grape2D.TopDownBVHNode = function(parent, objects) {
	/**
	 * Bounding volume.
	 * @private {Grape2D.Shape}
	 */
	this.bv = null;
	/**
	 * True if it's a leaf (end point of a tree), false if it's a node.
	 * @private {boolean}
	 */
	this.leaf = false;
	/**
	 * Objects of a leaf
	 * @private {Array.<Grape2D.Object2D>}
	 */
	this.objects = [];

	/**
	 * Parent node.
	 * @private {?Grape2D.TopDownBVHNode}
	 */
	this.parent = parent;
	/**
	 * Left child of a node.
	 * @private {?Grape2D.TopDownBVHNode}
	 */
	this.left = null;
	/**
	 * Right child of a node.
	 * @private {?Grape2D.TopDownBVHNode}
	 */
	this.right = null;

	this.depth = parent?parent.getDepth()+1:0;
	//debugger;
	this.compute(objects);
};

Grape2D.TopDownBVHNode.prototype = {
	constructor: Grape2D.TopDownBVHNode,
	/**
	 * Makes this instance a leaf or a node.
	 *
	 * @param  {Array.<Grape2D.Object2D>} objects List of objects to separate
	 *   through the node.
	 *
	 * @public
	 */
	compute: function(objects) {

		if (objects.length <= Grape2D.TopDownBVHNode.DEFAULT_PER_LEAF || this.depth >= Grape2D.TopDownBVHNode.MAX_DEPTH) {
			//this instance will be a leaf
			this.leaf = true;
			for (var i = 0; i < objects.length; i++) {
				this.objects.push(objects[i]);
			}
		} else {
			//this instance will be a node
			var r = Grape2D.BVHStrategySingleton.getStrategy().solve(objects),
				factory = Grape2D.BVFactorySingleton.getFactory();

			this.bv = factory.merge(objects[0].getBoundingBox(), objects[1].getBoundingBox());
			for (var i = 2; i < objects.length; i++) {
				this.bv = factory.merge(this.bv, objects[i].getBoundingBox());
			}

			this.left = new Grape2D.TopDownBVHNode(this, r.left);
			this.right = new Grape2D.TopDownBVHNode(this, r.right);
		}
	},
	/**
	 * Checks if it's a leaf
	 *
	 * @return {boolean} True if it's a leaf.
	 * @public
	 */
	isLeaf: function() {
		return this.leaf;
	},
	/**
	 * Gets the bounding volume.
	 *
	 * @return {Grape2D.Shape} The bounding volume.
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
	 * @return {Array.<Grape2D.Object2D>} List of the objects.
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
		return this.left;
	},
	query: function(shape) {
		var res = [],
			i;
		if (this.leaf) {
			for (i = 0; i < this.objects.length; i++) {
				if (Grape2D.CollisionCheckerSingleton.collide(shape, this.objects[i].getBoundingBox())) {
					res.push(this.objects[i]);
				}
			}
		} else {
			if (Grape2D.CollisionCheckerSingleton.collide(shape, this.bv)) {
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
	queryPoint: function(vector) {
		var res = [],
			i;
		if (this.leaf) {
			for (i = 0; i < this.objects.length; i++) {
				if (Grape2D.CollisionCheckerSingleton.contains(vector, this.objects[i].getBoundingBox())) {
					res.push(this.objects[i]);
				}
			}
		} else {
			if (Grape2D.CollisionCheckerSingleton.contains(vector, this.bv)) {
				var list = this.left.queryPoint(vector);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				list = this.right.queryPoint(vector);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				return res;
			} else {
				return res;
			}
		}
	},
	getDepth: function(){
		return this.depth;
	}
};

/**
 * Minimum of objects per leaf.
 * @constant {number}
 */
Grape2D.TopDownBVHNode.DEFAULT_PER_LEAF = 2;

Grape2D.TopDownBVHNode.MAX_DEPTH = 50;/**
 * A BVH Strategy is used to sort and divide objects according to a 
 *   set of rules.
 *
 * @interface
 * @class
 */
Grape2D.BVHStrategy = function(){};
Grape2D.BVHStrategy.prototype = {
	constructor: Grape2D.BVHStrategy,
	/**
	 * Applies the strategy to the a set of objects.
	 *
	 * @param  {Array.<Grape2D.Object2D>} objects List of objects to
	 *   separate.
	 *
	 * @return {Object} An object with left and right properties,
	 *   each property is an array, that contains {@link Grape2D.Object2D}
	 *   or are empty.
	 * @public
	 */
	solve: function(objects){}
};/**
 * The median cut algorithm splits the set in two equal parts, along the
 *   selected axis. It creates a more balanced tree. However unbalanced
 *   trees perform better.
 * @implements {Grape2D.BVHStrategy}
 * @constructor
 */
Grape2D.MedianCutBVHStrategy = function () {};

Grape2D.MedianCutBVHStrategy.prototype = Object.create(Grape2D.BVHStrategy.prototype);

/**
 * This heuristic does the follow:
 * <ol>
 * <li> Compute the bounding box of the set of AABB center points
 * <li> Choose the plane that splits the box in half along the longest
 *   axis
 * <li> Objects at the left of the axis will be places at the left side,
 *   the others at the right side.
 * <ol>
 * Heuristic described by Gino van den Bergen (gino@dtecta.com), from his GDC conference titled "Physics for Game Programmers:
Spatial Data Structures".
 * @override
 */
Grape2D.MedianCutBVHStrategy.prototype.solve = function (objects) {
	var result = {
		left: [],
		right: []
	};

	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity,
		axis = 0,
		temp;


	for(var i=0; i<objects.length; i++){
		temp = objects[i].getBoundingBoxPosition();
		if(minX>temp.getX()){
			minX = temp.getX();
		}
		if(maxX<temp.getX()){
			maxX = temp.getX();
		}
		if(minY>temp.getY()){
			minY = temp.getY();
		}
		if(maxY<temp.getY()){
			maxY = temp.getY();
		}
	}

	if( (minX+maxX)>=(minY+maxY) ){
		axis = (maxX+minX)/2;

		for(i=0; i<objects.length; i++){
			temp = objects[i].getBoundingBoxPosition();
			if(temp.getX()>axis){
				result.right.push(objects[i]);
			}else{
				result.left.push(objects[i]);
			}
		}
	}else{
		axis = (maxY+minY)/2;

		for(i=0; i<objects.length; i++){
			temp = objects[i].getBoundingBoxPosition();
			if(temp.getY()>axis){
				result.right.push(objects[i]);
			}else{
				result.left.push(objects[i]);
			}
		}
	}
	return result;
};/**
 * A singleton for BVH strategies.
 *
 * @class
 */
Grape2D.BVHStrategySingleton = {
	/**
	 * Strategy.
	 * @private {Grape2D.BVHStrategy}
	 * @static
	 */
	strategy: new Grape2D.MedianCutBVHStrategy(),
	/**
	 * Sets a strategy.
	 * @param  {Grape2D.BVHStrategy} strategy The new strategy.
	 * @static
	 * @public
	 */
	setStrategy: function(strategy){
		Grape2D.BVHStrategySingleton.strategy = strategy;
	},
	/**
	 * Gets the strategy.
	 * @return {Grape2D.BVHStrategy} The strategy
	 * @static
	 * @public
	 */
	getStrategy: function(){
		return Grape2D.BVHStrategySingleton.strategy;
	}
};/**
 * Creates bounding volumes based in an input object.
 * @class
 * @interface
 */
Grape2D.BVFactory = function() {};

Grape2D.BVFactory.prototype = {
	constructor: Grape2D.BVFactory,
	/**
	 * Creates a shape, based on the type set, from an {@link Grape2D.AABB}.
	 * @param  {Grape2D.AABB} aabb The object.
	 * @return {Grape2D.Shape} Shape based on the type.
	 * @public
	 */
	createFromAABB: function(aabb) {},
	/**
	 * Creates a shape, based on the type set, from an {@link Grape2D.Circle}.
	 * @param  {Grape2D.Circle} circle The object.
	 * @return {Grape2D.Shape} Shape based on the type.
	 * @public
	 */
	createFromCircle: function(circle) {},
	/**
	 * Creates a shape, based on the type set, from an {@link Grape2D.Polygon}.
	 * @param  {Grape2D.Polygon} polygon The object.
	 * @return {Grape2D.Shape} Shape based on the type.
	 * @public
	 */
	createFromPolygon: function(polygon) {},

	createSceneBV: function(renderer, camera) {}
};/**
 * Creates bounding volumes based in an input object.
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

Grape2D.AabbBVFactory.prototype.createSceneBV = function(renderer, camera) {
	return new Grape2D.AABB({
		position: camera.getLookAt(),
		width: renderer.getWidth()/camera.getScale().getX(),
		height: renderer.getHeight()/camera.getScale().getY()
	});
};

Grape2D.AabbBVFactory.prototype.merge = function(aabb1, aabb2) {
	//bdebugger;
	var dx = aabb2.getPosition().getX() - aabb1.getPosition().getX(),
		dy = aabb2.getPosition().getY() - aabb1.getPosition().getY(),
		w, h, temp,
		position = new Grape2D.Vector();

	if ((Grape2D.Math.abs(dx) + aabb2.getHalfWidth()) <= aabb1.getHalfWidth()) {
		w = aabb1.getWidth();
		position.setX(aabb1.getPosition().getX());
	} else {
		w = Grape2D.Math.abs(dx) + aabb2.getHalfWidth() + aabb1.getHalfWidth();
		if (aabb1.getPosition().getX() >= aabb2.getPosition().getX()) {
			temp = aabb1.getPosition().getX() + aabb1.getHalfWidth() - (w / 2);
		} else {
			temp = aabb1.getPosition().getX() - aabb1.getHalfWidth() + (w / 2);
		}
		position.setX(temp);
	}

	if ((Grape2D.Math.abs(dy) + aabb2.getHalfHeight()) <= aabb1.getHalfHeight()) {
		h = aabb1.getHeight();
		position.setY(aabb1.getPosition().getY());
	} else {
		h = Grape2D.Math.abs(dy) + aabb2.getHalfHeight() + aabb1.getHalfHeight();
		if (aabb1.getPosition().getY() >= aabb2.getPosition().getY()) {
			temp = aabb1.getPosition().getY() + aabb1.getHalfHeight() - (h / 2);
		} else {
			temp = aabb1.getPosition().getY() - aabb1.getHalfHeight() + (h / 2);
		}
		position.setY(temp);
	}

	return new Grape2D.AABB({
		width: w,
		height: h,
		position: position
	});
};/**
 * Holds the current bounding volume factory {@link Grape2D.BVFactory}
 *
 * @class
 */
Grape2D.BVFactorySingleton = {
	/**
	 * Factory being used.
	 * @private {Grape2D.BVFactory}
	 * @static
	 */
	bvfactory: new Grape2D.AabbBVFactory(),
	/**
	 * Gets the factory
	 * @return {Grape2D.BVFactory} A bounding volume factory instance.
	 * @public
	 * @static
	 */
	getFactory: function(){
		return Grape2D.BVFactorySingleton.bvfactory;
	},
	/**
	 * Sets the factory
	 * @param  {Grape2D.BVFactory} factory A bounding volume factory instance.
	 * @public
	 * @static
	 */
	setFactory: function(factory){
		Grape2D.BVFactorySingleton.bvfactory = factory;
	},
	/**
	 * Sintax sugar for <code>shape.createBV(Grape2D.BVFactorySingleton.getFactory())</code>.
	 * @param  {Grape2D.Shape} shape Shape to create a bounding volume
	 * @return {Grape2D.Shape} Bounding volume.
	 * @public
	 * @static
	 */
	create: function(shape){
		return shape.createBV(Grape2D.BVFactorySingleton.bvfactory);
	}
};/**
 * Describes a texture.
 *
 * @interface
 */
Grape2D.ITexture = function() {};

Grape2D.ITexture.prototype = {
	constructor: Grape2D.ITexture,
	/**
	 * Gets the width.
	 *
	 * @return {number} Width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width.
	 *
	 * @return {number} Half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width.
	 *
	 * @param  {number} width New width.
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets height.
	 *
	 * @return {number} Height.
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height.
	 *
	 * @return {number} Half height.
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height.
	 *
	 * @param  {number} height New height.
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
};/**
 * Texture represents an "image", ready to be rendered to
 *   a renderer, with high efficiency. The efficiency comes
 *   from the fact that a cached image can be renderer faster.
 *
 * @param {Object=} options Object with the options to instantiate a texture.
 * @param {Image=} options.image Loads a DOM image object to the buffer.
 *		This is the first choice, when providing other options.
 * @param {Grape2D.Texture=} options.useTexture With this method the
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
	 * @type {number}
	 * @private
	 */
	this.width = 2;
	/**
	 * The half width.
	 *
	 * @type {number}
	 * @private
	 */
	this.hwidth = 1;
	/**
	 * The height.
	 *
	 * @type {number}
	 * @private
	 */
	this.height = 2;
	/**
	 * The half width.
	 *
	 * @type {number}
	 * @private
	 */
	this.hheight = 1;

	/**
	 * The canvas buffer. It is always a 2D renderer.
	 *
	 * @type {Grape2D.CanvasRenderer}
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
 * @param  {Image} image - The DOM image object with the image.
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
 * @param  {string} src - The complete path to the image.
 * @param  {Function} callback - A function to be called after the
 *		onload event of the image.
 *
 * @return {Grape2D.Texture} The texture object, initialy it has
 *		an empty buffer, the buffer will have the image only after
 *		the image has done loaded
 *
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
};/**
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
};/**
 * @author rui_web@hotmail.com (Rui Gil)
 */
/**
 * Constructs a new instance of Object2D.
 *
 * @classdesc Object2D represents an object of the scene.
 *            An Object2D is a simple scene object which the main
 *            purpose is to render a texture at a position. More
 *            complex behaviors should be implemented by others
 *            objects that inherit from Object2D.
 *
 * @param {?Grape2D.Vector} options.position - The position of the shape
 * @param {?boolean} options.visible - True to render the object, false
 *		otherwise.
 * @param {!Grape2D.Texture} options.texture - The texture of the object.
 * @param {?Grape2D.Vector} options.textureOffset - The offset position
 *		of the texture relative to the objects position.
 * @param {!Grape2D.Shape} options.boundingBox - The primary use of the
 *		bounding box is to select the items to display in the renderer,
 *		other behaviors such as collision detection can be done with
 *		this property, in some simple cases.
 * @param {?Grape2D.Vector} options.boundingBoxOffset - The offset
 *		position of the bounding box relative to the objects position.
 * @param {?boolean} options.castShadow - Used by the IlluminatedRenderer
 *		to render this object shadow.
 * @param {?boolean} options.receiveLight - Used by the IlluminatedRenderer
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
	 * @type {boolean}
	 * @private
	 */
	this.visible = options.visible || true;

	/**
	 * The texture of the object.
	 *
	 * @type {Grape2D.Texture}
	 * @private
	 */
	this.texture = options.texture;
	/**
	 * The offset of the texture.
	 *
	 * @type {Grape2D.Vector}
	 * @private
	 */
	this.textureOffset = options.textureOffset || new Grape2D.Vector();
	/**
	 * The position of the texture. It is computed from the object's position and the texture offset.
	 *
	 * @type {Grape2D.Vector}
	 * @private
	 */
	this.texturePosition = new Grape2D.Vector();
	//computes the texture position.
	this.computeTexturePosition();
	/**
	 * Object's bounding box.
	 *
	 * @type {Grape2D.Shape}
	 * @private
	 */
	this.boundingBox = options.boundingBox;
	/**
	 * Bounding box offset.
	 *
	 * @type {Grape2D.Vector}
	 * @private
	 */
	this.boundingBoxOffset = options.boundingBoxOffset || new Grape2D.Vector();

	this.computeBoundingBoxPosition();

	/**
	 * Object cast shadow.
	 *
	 * @type {boolean}
	 * @private
	 */
	this.castShadow = options.castShadow || false;
	/**
	 * Object can receive light.
	 *
	 * @type {boolean}
	 * @private
	 */
	this.receiveLight = options.receiveLight || false;

};

Grape2D.Object2D.prototype = {
	constructor: Grape2D.Object2D,
	/**
	 * Checks if the object should be rendered.
	 *
	 * @return {boolean} True if it can be rendered.
	 */
	isVisible: function () {
		return this.visible;
	},
	/**
	 * Sets if an object should be rendered.
	 *
	 * @param  {boolean} visible True, so that it renders, false otherwise.
	 */
	setVisible: function (visible) {
		this.visible = visible;
		return;
	},
	/**
	 * Gets the material of the object.
	 *
	 * @return {Grape2D.Texture} The material of the object.
	 */
	getTexture: function () {
		return this.texture;
	},
	/**
	 * Sets the material of the object.
	 *
	 * @param  {Grape2D.Texture} texture The material.
	 */
	setTexture: function (texture) {
		this.texture = texture;
		return;
	},
	/**
	 * Gets the bounding box of the object.
	 *
	 * @return {Grape2D.Shape} The shape of the object.
	 */
	getBoundingBox: function () {
		return this.boundingBox;
	},
	/**
	 * Sets the bounding box of the object.
	 * Also, the position of the new bounding box, will be transformed
	 *   in the default offset of the bounding box.
	 *
	 * @param  {Grape2D.Shape} boundingBox The bounding box.
	 */
	setBoundingBox: function (boundingBox) {
		this.boundingBox = boundingBox;
		//this.boundingBoxOffset.set(boundingBox.getPosition());
		this.computeBoundingBoxPosition();
		return;
	},
	/**
	 * Checks if the object can cast shadows.
	 *
	 * @return {boolean} True if it cast shadows, false otherwise.
	 */
	canCastShadow: function () {
		return this.castShadow;
	},
	/**
	 * Sets if an object can cast shadows.
	 *
	 * @param  {boolean} castShadow True to cast shadows, false otherwise.
	 */
	setCastShadow: function (castShadow) {
		this.castShadow = castShadow;
		return;
	},
	/**
	 * Checks if an object can receive light.
	 *
	 * @return {boolean} True if it receives light.
	 */
	canReceiveLight: function () {
		return this.receiveLight;
	},
	/**
	 * Sets if the object can receive light.
	 *
	 * @param  {boolean} receiveLight True if it receives light.
	 */
	setReceiveLight: function (receiveLight) {
		this.receiveLight = receiveLight;
		return;
	},
	/**
	 * Gets the object position. Be careful, because it returns the vector used by the object, and not a copy. Use it wisely.
	 *
	 * @return {Grape2D.Vector} The position of the object.
	 */
	getPosition: function () {
		return this.position;
	},
	/**
	 * Sets the object position.
	 *
	 * @param  {Grape2D.Vector} position The position of the object.
	 */
	setPosition: function (position) {
		this.position.set(position);
		this.computeBoundingBoxPosition();
		this.computeTexturePosition();
	},
	/**
	 * Sets the texture offset.
	 *
	 * @param  {Grape2D.Vector} offset - The offset of the texture, from the object's position.
	 *
	 * @public
	 */
	setTextureOffset: function (offset) {
		this.textureOffset.set(offset);
		this.computeTexturePosition();
	},
	/**
	 * Gets the texture offset
	 *
	 * @return {Grape2D.Vector} The texture offset.
	 */
	getTextureOffset: function () {
		return this.textureOffset;
	},
	/**
	 * Sets the bounding box offset.
	 *
	 * @param  {Grape2D.Vector} offset - The offset of the bounding box, from the object's position.
	 *
	 * @public
	 */
	setBoundingBoxOffset: function (offset) {
		this.boundingBoxOffset.set(offset);
		this.computeBoundingBoxPosition();
	},
	/**
	 * Gets the bounding box offset
	 *
	 * @return {Grape2D.Vector} The bounding box offset.
	 */
	getBoundingBoxOffset: function () {
		return this.boundingBoxOffset;
	},
	/**
	 * Computes the bounding box position, from the object's position and bounding box offset.
	 * @protected
	 */
	computeBoundingBoxPosition: function () {
		this.boundingBox.setPosition(this.position);
		this.boundingBox.getPosition().add(this.boundingBoxOffset);
	},
	/**
	 * Gets the bounding box position.
	 *
	 * @return {Grape2D.Vector} The center position of the bounding box.
	 * @public
	 */
	getBoundingBoxPosition: function () {
		return this.boundingBox.getPosition();
	},
	/**
	 * Computes the texture position of the object, from the object's position and texture offset.
	 * @protected
	 */
	computeTexturePosition: function () {
		this.texturePosition.set(this.position).add(this.textureOffset);
	},
	/**
	 * Gets the texture position.
	 *
	 * @return {Grape2D.Vector} The position of the texture
	 * @public
	 */
	getTexturePosition: function () {
		return this.texturePosition;
	},
	/**
	 * Renders the object to a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer - The place to render the object.
	 * @param  {!Grape2D.Camera} camera - The camera, that will transform the positions.
	 *
	 * @public
	 */
	render: function (renderer, camera) {
		renderer.renderObject2D(this, camera);
	},
	/**
	 * Updates the object.
	 *
	 * @param  {number} dt - Time interval.
	 * @param  {Grape2D.Scene} scene - Scene where this object is.
	 *
	 * @public
	 */
	update: function (dt, scene) {}
};/**
 * Abstract class to shapes.
 * @classdesc Shape is an abstract class that describes "physical", objects.
 *            The main objective of a Shape is to serve as a bounding box. It
 *            should play the main role when selecting the objects to render,
 *            when it comes to collision detection and/or to detect user
 *            interaction with an object.
 *
 * @param {?Grape2D.Vector} options.position - The position of the shape.
 * 
 * @constructor
 */
Grape2D.Shape = function (options) {
	options = options || {};
	/**
	 * Shape's position.
	 *
	 * @type {Grape2D.Vector}
	 * @protected
	 */
	this.position = options.position || new Grape2D.Vector();
};

Grape2D.Shape.prototype = {
	constructor: Grape2D.Shape,
	/**
	 * Gets the position of the object.
	 *
	 * @return {Grape2D.Vector} The center position of the shape.
	 * @public
	 */
	getPosition: function(){
		return this.position;
	},
	/**
	 * Set the position of the shape.
	 *
	 * @param  {Grape2D.Vector} position - The new position of the shape
	 *
	 * @public
	 */
	setPosition: function(position){
		this.position.set(position);
	},
	/**
	 * Renders the wireframe of the shape.
	 *
	 * @param  {Grape2D.Vector} renderer - The renderer to render the shape's wireframe.
	 * @param  {Grape2D.Camera} camera - The camera to transform the positions.
	 *
	 * @public
	 */
	render: function (renderer, camera) {},
	/**
	 * Creates a bounding volume, based in this one and in a {@link Grape2D.BVFactory}
	 *
	 * @param  {Grape2D.BVFactory} bvfactory The bounding volume factory
	 *
	 * @return {Grape2D.Shape} The shape created by the {@link Grape2D.BVFactory}
	 */
	createBV: function(bvfactory){},
	getStaticType: function(){}
};/**
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
Grape2D.AABB.TYPE = "AABB";/**
 * Creates a new circle instance.
 * @classdesc Circle describes a circle shape. A circle is defined by
 *            it's radius.
 *
 * @param {?Grape2D.Vector} options.position - The position of the polygon
 * @param {!number} options.radius - radius of the circle.
 *
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.Circle = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Circle's radius.
	 *
	 * @type {number}
	 * @private
	 */
	this.radius = options.radius;
};

Grape2D.Circle.prototype = Object.create(Grape2D.Shape.prototype);

/**
 * Gets the radius of the circle.
 *
 * @return {number} The radius of the circle.
 * @public
 */
Grape2D.Circle.prototype.getRadius = function(){
	return this.radius;
};
/**
 * Sets the radius of the circle.
 *
 * @param  {number} radius - The new radius of the circle
 * @public
 */
Grape2D.Circle.prototype.setRadius = function(radius){
	this.radius = radius;
};
/**
 * @see Grape2D.Shape#render
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
Grape2D.Circle.TYPE = "Circle";/**
 * Creates a new polygon instance.
 * @classdesc Polygon describes a polygon shape. A list of vertexes should
 *            should be provided or set afterwards.
 *
 * @param {?Grape2D.Vector} options.position - The position of the polygon
 * @param {!Array.<Grape2D.Vector>} options.vertexList - A list with the
 *			vertexes of the polygon.
 *
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.Polygon = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Polygon's vertexes.
	 *
	 * @type {Array.<Grape2D.Vector>}
	 * @private
	 */
	this.vertexList = options.vertexList;
};

Grape2D.Polygon.prototype = Object.create(Grape2D.Shape.prototype);

/**
 * Gets the list of vertexes.
 *
 * @return {Array.<Grape2D.Vector>} The array with the vertexes.
 * @public
 */
Grape2D.Polygon.prototype.getVertexList = function(){
	return this.vertexList;
};
/**
 * Sets a list of vertexes.
 *
 * @param  {Array.<Grape2D.Vector>} vertexList - A list with the new vertexes.
 * @public
 */
Grape2D.Polygon.prototype.setVertexList = function(vertexList){
	this.vertexList = vertexList;
};
/**
 * @see Grape2D.Shape#render
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
Grape2D.Polygon.TYPE = "Polygon";/**
 * A scene controls, at a high level, the running of the game.
 * Being responsible for the updating and rendering.
 * This is the component object of what is a composite pattern.
 * @interface
 * @class
 */
Grape2D.Scene = function () {};

Grape2D.Scene.prototype = {
	constructor: Grape2D.Scene,
	/**
	 * Updates the scene.
	 *
	 * @param  {number} dt Time elapsed since the last update.
	 * @public
	 */
	update: function (dt) {},
	/**
	 * Renders the scene to a renderer.
	 *
	 * @param  {Grape2D.Renderer} renderer Place to render the scene.
	 * @param  {Grape2D.Camera} camera Camera to transform the coordinates
	 *   and to select the objects to be rendered.
	 * @public
	 */
	render: function (renderer, camera) {}
};/**
 * SceneGroup allow to group scenes together.
 * This is the composite object of the composite pattern.
 *
 * @constructor
 * @implements {Grape2D.Scene}
 */
Grape2D.SceneGroup = function () {
	/**
	 * Children of this scene.
	 * @type {Array.<Grape2D.Scene>}
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
 * Adds a child scene
 * @param  {Grape2D.Scene} child Child scene.
 * @public
 */
Grape2D.SceneGroup.prototype.addChild = function (child) {
	this.childs.push(child);
};
/**
 * Removes a child scene.
 *
 * @param  {Grape2D.Scene} child Child to remove.
 */
Grape2D.SceneGroup.prototype.removeChild = function (child) {
	this.childs.splice(this.childs.indexOf(child), 1);
};/**
 * SceneLayer allow to render objects and update them, the objects are
 *   store using a {@link Grape2D.Map}.
 * This is the leaf object of the composite pattern.
 *
 * @constructor
 * @implements {Grape2D.Scene}
 */
Grape2D.SceneLayer = function(options) {
	options = options || {};
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
 * @return {Grape2D.Map} The map.
 * @public
 */
Grape2D.SceneLayer.prototype.getMap = function() {
	return this.map;
};/**
 * Interface that defines high level methods for a game.
 *
 * @interface
 */
Grape2D.Game = function() {};

Grape2D.Game.prototype = {
	constructor: Grape2D.Game,
	/**
	 * Sets up the game. It should be executed before any other method.
	 */
	setup: function() {},
	/**
	 * Starts the animation process.
	 */
	start: function() {},
	/**
	 * Stop the animation process.
	 */
	stop: function() {},
	/**
	 * Renders what needed be, to the right places.
	 */
	render: function() {},
	/**
	 * Updates the game, between frames.
	 *
	 * @param  {number} dt The miliseconds elapsed since the last
	 *   animation call.
	 */
	update: function(dt) {},
	/**
	 * Calls the others methods, and "prepare" the next frame.
	 */
	animate: function() {}
};/**
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
	//cancelAnimationFrame();
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
	var that = this;
	webkitRequestAnimationFrame(function() {
		that.animate();
	});
	this.update(this.clock.update());
	this.render();
};