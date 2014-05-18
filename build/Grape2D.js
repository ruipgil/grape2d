(function(){
"use strict";
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
	NODE: false,
	/**
	 * Window object. This is an empty object if the <code>window</code>
	 *   variable is not defined.
	 *
	 * @type {!(Object|Window)}
	 * @public
	 */
	WINDOW: {},
};
/**
 * Sets up Grape2D for node.js or browser environment,
 *   by setting Grape2D's global variables.
 *   Inspired in underscore.js {@link https://github.com/jashkenas/underscore/blob/08d88b33359b26996fc06f5cc6bf84b4a7afe2d3/underscore.js}.
 *
 * @suppress {undefinedVars}
 */
(function() {
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Grape2D;
		}
		exports.Grape2D = Grape2D;
		Grape2D.NODE = true;
		Grape2D.WINDOW = {};
	} else {
		window.Grape2D = Grape2D;
		Grape2D.NODE = false;
		Grape2D.WINDOW = window;
	}
})();

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

	if (!w.cancelAnimationFrame) {
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
			return window.requestAnimationFrame(fn);
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
			return window.cancelAnimationFrame(op);
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
	},
	/**
	 * Gets the current frame count.
	 *
	 * @return {!number} Frame count.
	 * @public
	 */
	getFrameCount: function(){
		return this.frameCount;
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
 * A UUID generator.
 * Found at {@link http://note19.com/2007/05/27/javascript-guid-generator/}
 * 
 * @constructor
 */
Grape2D.utils.UUIDGenerator = function() {};
Grape2D.utils.UUIDGenerator.prototype = {
	constructor: Grape2D.utils.UUIDGenerator,
	/**
	 * Generates a random string.
	 *
	 * @return {!string} UUID chunk.
	 * @protected
	 */
	s4: function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	},
	/**
	 * Generates a proper UUID.
	 *
	 * @return {!string} UUID.
	 * @public
	 */
	generate: function() {
		return (this.s4()+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+this.s4()+this.s4());
	}
};
/**
 * A singleton of the UUID generator in use.
 * The default instance is {@see Grape2D.utils.UUIDGenerator}.
 * 
 * @class
 */
Grape2D.utils.UUIDGeneratorSingleton = {
	/**
	 * Instance in use.
	 *
	 * @type {?}
	 * @private
	 * @static
	 */
	instance: new Grape2D.utils.UUIDGenerator(),
	/**
	 * Gets the instance to generate UUID's.
	 *
	 * @return {?} Instance being used to generate the UUID's.
	 * @public
	 * @static
	 */
	getInstance: function(){
		return Grape2D.utils.UUIDGeneratorSingleton.instance;
	},
	/**
	 * Sets the instance to generate UUID's.
	 *
	 * @param {?} generator Some object with the function <code>
	 *   generate</code>.
	 * @public
	 * @static
	 */
	setInstance: function(generator){
		Grape2D.utils.UUIDGeneratorSingleton.instance = generator;
	},
	/**
	 * Generates a UUID. This is a short-cut to <code>
	 *   Grape2D.utils.UUIDGeneratorSingleton.getInstance().generate()
	 *   </code>.
	 *
	 * @return {!string} UUID.
	 * @public
	 * @static
	 */
	generate: function(){
		return Grape2D.utils.UUIDGeneratorSingleton.instance.generate();
	}
};
/**
 * A rgba color.
 *
 * @param {Array.<!number>=} color Color representation as a number array, with four components; red, green, blue and alpha. If this form is too restrictive, consider using the methods to set the color from different formats.
 * @constructor
 */
Grape2D.Color = function(color) {
	this.color = new Float32Array(color || [0,0,0,1]);
};

Grape2D.Color.prototype = {
	constructor: Grape2D.Color,
	getRaw: function(){
		return this.color;
	},
	getR: function(){
		return this.color[0];
	},
	getG: function(){
		return this.color[1];
	},
	getB: function(){
		return this.color[2];
	},
	getA: function(){
		return this.color[3];
	},
	setR: function(red){
		this.color[0] = red;
	},
	setG: function(green){
		this.color[1] = green;
	},
	setB: function(blue){
		this.color[2] = blue;
	},
	setA: function(alpha){
		this.color[3] = alpha;
	},
	set: function(color){
		this.setR(color.getR());
		this.setG(color.getG());
		this.setB(color.getB());
		this.setA(color.getA());
	},
	toString: function(){
		return "rgba("+this.getR()+","+this.getG()+","+this.getB()+","+this.getA()+")";
	}
};

Grape2D.Color.RGB_A_REG_EXP = /rgb[a]?\([\s]*(\d{1,3})[\s]*,[\s]*(\d{1,3})[\s]*,[\s]*(\d{1,3})[\s]*(?:,[\s]*(1|(:?0\.[0-9]+)|0)[\s]*)?\)[;]?/i;
/**
 * Creates a color from a rgb representation.
 *
 * @param  {!string} string Color in the rgb format.
 * @return {!Grape2D.Color} Color.
 * @public
 * @static
 */
Grape2D.Color.createFromRgb = function(string){
	var rg = Grape2D.Color.RGB_A_REG_EXP.exec(string);
	return new Grape2D.Color([parseInt(rg[1], 10), parseInt(rg[2], 10), parseInt(rg[3], 10), 1]);
};
/**
 * Creates a color from a rgba representation.
 *
 * @param  {!string} string Color in the rgba format.
 * @return {!Grape2D.Color} Color.
 * @public
 * @static
 */
Grape2D.Color.createFromRgba = function(string){
	var rg = Grape2D.Color.RGB_A_REG_EXP.exec(string);
	return new Grape2D.Color([parseInt(rg[1], 10), parseInt(rg[2], 10), parseInt(rg[3], 10), parseInt(rg[4], 10)]);
};
/**
 * Creates a color from an hexadecimal representation.
 *
 * @param  {!string} string Color in the hexadecimal format.
 * @return {!Grape2D.Color} Color.
 * @public
 * @static
 */
Grape2D.Color.createFromHex = function(string){
	return new Grape2D.Color([parseInt(string.substr(1,2), 16), parseInt(string.substr(3,2), 16), parseInt(string.substr(5,2), 16), 1]);
};
/**
 * Creates a {@see Grape2D.Color} from an arbitrary string.
 * The available string types are <ul>
 * <li>The hexadecimal (CSS) representation: #AF04D1
 * <li>The rgb representation: rgb(0, 76, 6)
 * <li>The rgba representation: rgba(0, 76, 6, 0.908)
 * The last two are, somewhat, error tolerant.
 *
 * @param  {!string} string String representation.
 * @return {?Grape2D.Color} Color class, from the representation. It
 *   will return null if the string can't parsed.
 * @public
 * @static
 */
Grape2D.Color.createFromString = function(string){
	var color = null;
	if(string.charAt(0) == "#"){
		color = Grape2D.Color.createFromHex(string);
	}else if(string.substr(0,4) == "rgba"){
		color = Grape2D.Color.createFromRgba(string);
	}else if(string.substr(0,3) == "rgb"){
		color = Grape2D.Color.createFromRgb(string);
	}
	return color;
};
/**
 * Red color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.RED = [255,0,0, 1];
/**
 * Green color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GREEN = [0,255,0, 1];
/**
 * Blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.BLUE = [0,0,255, 1];
/**
 * Black color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.BLACK = [0,0,0, 1];
/**
 * White color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.WHITE = [255,255,255, 1];
/**
 * Yellow color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.YELLOW = [255,255,0, 1];
/**
 * Orange color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.ORANGE = [255,128,0, 1];
/**
 * Ivory color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.IVORY = [255,255,240, 1];
/**
 * Beige color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.BEIGE = [245, 245, 220, 1];
/**
 * Wheat color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.WHEAT = [245,222,179, 1];
/**
 * Tan color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.TAN = [210,180,140, 1];
/**
 * Khaki color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.KHAKI = [195,176,145, 1];
/**
 * Silver color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.Silver = [192,192,192, 1];
/**
 * Gray color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GRAY = [128,128,128, 1];
/**
 * Charcoal color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CHARCOAL = [70,70,70, 1];
/**
 * Navy blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.NAVY_BLUE = [0,0,128, 1];
/**
 * Royal blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.ROYAL_BLUE = [8,76,158, 1];
/**
 * Medium blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.MEDIUM_BLUE = [0,0,205, 1];
/**
 * Azure color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.AZURE = [0,127,255, 1];
/**
 * Cyan color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CYAN = [0,255,255, 1];
/**
 * Aquamarine color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.AQUAMARINE = [127,255,212, 1];
/**
 * Teal color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.TEAL = [0, 128, 128, 1];
/**
 * Forest green color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.FOREST_GREEN = [34, 139, 34, 1];
/**
 * Olive color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.OLIVE = [128, 128, 0, 1];
/**
 * Chartreuse color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CHARTREUSE = [127, 255, 0, 1];
/**
 * Lime color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.LIME = [191, 255, 0, 1];
/**
 * Golden color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GOLDEN = [255, 215, 0, 1];
/**
 * Goldenrod color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GOLDENROD = [218, 165, 32, 1];
/**
 * Coral color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CORAL = [255, 127, 80, 1];
/**
 * Salmon color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.SALMON = [250, 128, 114, 1];
/**
 * Hot pink color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.HOT_PINK = [252, 15, 192, 1];
/**
 * Fuchsia color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.FUCHSIA = [255, 119, 255, 1];
/**
 * Puce color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.PUCE = [204, 136, 153, 1];
/**
 * Mauve color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.MAUVE = [224, 176, 255, 1];
/**
 * Lavender color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.LAVENDER = [181, 126, 220, 1];
/**
 * Plum color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.PLUM = [132, 49, 121, 1];
/**
 * Indigo color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.INDIGO = [75,0,130, 1];
/**
 * Maroon color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.MAROON = [128, 0, 0, 1];
/**
 * Crimson color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CRIMSON = [220, 20, 60, 1];
/**
 * Math describes the namespace that holds math functions and
 *   constants. Optimizations or browser specific functions for math
 *   should be implemented in this namespace.
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
	PIx2: Math.PI * 2,
	/**
	 * PI/2 value. Alias to <code>PI/2</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId2: Math.PI / 2,
	/**
	 * PI/4 value. Alias to <code>PI/4</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId4: Math.PI / 4,
	/**
	 * PI/6 value. Alias to <code>PI/6</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId6: Math.PI / 6,
	/**
	 * PI/8 value. Alias to <code>PI/8</code>.
	 *
	 * @type {!number}
	 * @public
	 * @constant
	 */
	PId8: Math.PI / 8,
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
	floor: function(n) {
		return ((n > 0) ? ~~n : ((n == ~~n) ? n : (~~n - 1)));
	},
	/**
	 * Returns the of a positive number.
	 *
	 * @param  {!number} n Number to floor.
	 * @return {!number} Floored number.
	 * @public
	 * @static
	 */
	floorPositive: function(n){
		return ~~n;
	},
	/**
	 * Returns the ceil of a number
	 *
	 * @param  {!number} n Number to ceil.
	 * @return {!number} Ceiled number.
	 * @public
	 * @static
	 */
	ceil: function(n) {
		return~~ n == n ? n : n < 0 ? ~~n : ~~n + 1;
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
		return n + (n < 0 ? -0.5 : 0.5) >> 0;
	},
	/**
	 * Rounds a number to the first decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundOne: function(n) {
		return Grape2D.Math.round(n * 10) * 0.1;
	},
	/**
	 * Rounds a number to the second decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundTwo: function(n) {
		return Grape2D.Math.round(n * 100) * 0.01;
	},
	/**
	 * Rounds a number to the third decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundThree: function(n) {
		return Grape2D.Math.round(n * 1000) * 0.001;
	},
	/**
	 * Rounds a number to the fourth decimal.
	 *
	 * @param  {!number} n Number to round.
	 * @return {!number} Rounded number.
	 * @public
	 * @static
	 */
	roundFour: function(n) {
		return Grape2D.Math.round(n * 10000) * 0.0001;
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
	roundN: function(number, n) {
		var f = Grape2D.Math.pow(10, n);
		return Grape2D.Math.round(number * f) / f;
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
	min: function(a, b) {
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
	max: function(a, b) {
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
		return x <= min ? min : (x > max ? max : x);
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
			return b.max - a.min;
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
	},
	/**
	 * Checks whether or not a number is power of two.
	 *
	 * @param  {!number} x Number to check.
	 * @return {!(boolean|number)} True if it's power of two. Zero if
	 *   the param is zero. False otherwise.
	 * @public
	 * @static
	 */
	isPowerOfTwo: function(x){
		return x && !(x & (x - 1));
	},
	/**
	 * Gets the next integer that is power of two.
	 * Credits to Sean Eron Anderson at {@link http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2}
	 *
	 * @param  {!number} v Value.
	 * @return {!number} Next power of two.
	 * @public
	 * @static
	 */
	nextPowerOfTwo: function(v){
		v--;
		v |= v >> 1;
		v |= v >> 2;
		v |= v >> 4;
		v |= v >> 8;
		v |= v >> 16;
		v++;
		return v;
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
	setXY: function(x, y){
		this.x = x;
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
		if(this.x>0){
			return Math.atan(this.y/this.x);
		}else{
			return Math.PI-Math.atan(this.y/this.x);
		}
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
	 * Calculates the left normal of the vector.
	 *
	 * @return {!Grape2D.Vector} The left normal vector.
	 * @public
	 */
	leftNormal: function() {
		return new Grape2D.Vector(this.y, -this.x);
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
		return Grape2D.Math.sq(vector.x - this.x) + Grape2D.Math.sq(vector.y - this.y);
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
 * Grape2D.IMatrix class.
 *
 * @constructor
 */
Grape2D.IMatrix = function() {};

Grape2D.IMatrix.prototype = {
	constructor: Grape2D.IMatrix
};
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
	 * @type {!Float32Array}
	 * @public
	 */
	this.v = new Float32Array(9);
	if (aa !== undefined) {
		this.v[0] = aa;
		this.v[1] = ab;
		this.v[2] = ac;
		this.v[3] = ba;
		this.v[4] = bb;
		this.v[5] = bc;
		this.v[6] = ca;
		this.v[7] = cb;
		this.v[8] = cc;
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
		tv[0] = aa;
		tv[1] = ab;
		tv[2] = ac;

		tv[3] = ba;
		tv[4] = bb;
		tv[5] = bc;

		tv[6] = ca;
		tv[7] = cb;
		tv[8] = cc;

		return this;
	},
	/**
	 * Sets this matrix, from another one.
	 *
	 * @param {!Grape2D.Matrix} matrix Matrix to use.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	setFromMatrix: function(matrix){
		var mv = matrix.v;
		return this.set(
			mv[0], mv[1], mv[2],
			mv[3], mv[4], mv[5],
			mv[6], mv[7], mv[8]);
	},
	/**
	 * Adds to this matrix another one.
	 *
	 * @param  {Grape2D.Matrix} matrix Matrix to add.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	add: function(matrix) {
		for (var i = 0; i < 9; i++){
			this.v[i] += matrix.v[i];
		}
		return this;
	},
	/**
	 * Sets this matrix as the identity matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	identity: function() {
		var tv = this.v;
		tv[0] = tv[4] = tv[8] = 1;
		tv[1] = tv[2] = tv[3] = tv[5] = tv[6] = tv[7] = 0;
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
		this.v = new Float32Array([
			v[4] * v[8] - v[5] * v[7],
			v[2] * v[7] - v[1] * v[8],
			v[1] * v[5] - v[2] * v[4],

			v[5] * v[6] - v[8] * v[3],
			v[0] * v[8] - v[2] * v[6],
			v[2] * v[3] - v[0] * v[5],

			v[3] * v[7] - v[4] * v[6],
			v[1] * v[6] - v[0] * v[7],
			v[0] * v[4] - v[1] * v[3]
		]);
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
	 * Multiplies this matrix by other matrix, and where the
	 *   result is stored in this one.
	 *
	 * @param  {!Grape2D.Matrix} matrix Matrix to multiply by.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	selfMultiplyByMatrix: function(matrix) {
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

		this.set(
			aa, ab, ac,
			ba, bb, bc,
			ca, cb, cc);
		return this;
	},
	/**
	 * Translates this matrix.
	 *
	 * @param  {!number} x Translation in the x axis.
	 * @param  {!number} y Translation in the y axis.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	translate: function(x, y) {
		this.v[2] = this.v[0] * x + this.v[1] * y + this.v[2];
		this.v[5] = this.v[3] * x + this.v[4] * y + this.v[5];
		return this;
	},
	/**
	 * Scales this matrix.
	 *
	 * @param  {!number} x Scale in the x axis.
	 * @param  {!number} y Scale in the y axis.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	scale: function(x, y) {
		var v = this.v;
		v[0] *= x;
		v[1] *= y;
		v[3] *= x;
		v[4] *= y;
		v[6] *= x;
		v[7] *= y;
		return this;
	},
	/**
	 * Rotates this matrix.
	 *
	 * @param  {!number} angle Angle to rotate.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	rotate: function(angle) {
		var c = Grape2D.Math.cos(angle),
			s = Grape2D.Math.sin(angle),
			v = this.v,
			aa = v[0] * c + v[1] * s,
			ab = -v[0] * s + v[1] * s,
			ba = v[3] * c + v[4] * s,
			bb = -v[3] * s + v[4] * s,
			ca = v[6] * c + v[7] * s,
			cb = -v[6] * s + v[7] * s;
		v[0] = aa;
		v[1] = ab;
		v[3] = ba;
		v[4] = bb;
		v[6] = ca;
		v[7] = cb;
		return this;
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
	},
	/**
	 * Gets the raw representation of the matrix.
	 *
	 * @return {!Float32Array} Matrix, as an array of length of 3.
	 * @public
	 */
	getRaw: function() {
		return this.v;
	}
};
/**
 * Creates a translation matrix.
 *
 * @param  {!number} x Translation in the x axis.
 * @param  {!number} y Translation in the y axis.
 * @return {!Grape2D.Matrix} Transformation matrix.
 * @public
 */
Grape2D.Matrix.createFromTranslation = function(x, y) {
	return new Grape2D.Matrix(
		1, 0, x,
		0, 1, y,
		0, 0, 1);
};
/**
 * Creates a scale matrix.
 *
 * @param  {!number} x Scale in the x axis.
 * @param  {!number} y Scale in the y axis.
 * @return {!Grape2D.Matrix} Scale matrix.
 * @public
 */
Grape2D.Matrix.createFromScale = function(x, y) {
	return new Grape2D.Matrix(
		x, 0, 0,
		0, y, 0,
		0, 0, 1);
};
/**
 * Creates a rotation matrix.
 *
 * @param  {!number} angle Angle to rotate.
 * @return {!Grape2D.Matrix} Rotation matrix.
 * @public
 */
Grape2D.Matrix.createFromRotation = function(angle) {
	var c = Grape2D.Math.cos(angle),
		s = Grape2D.Math.sin(angle);
	return new Grape2D.Matrix(
		c, -s, 0,
		s, c, 0,
		0, 0, 1);
};
/**
 * Grape2D.MatrixStack class.
 *
 * @extends {Grape2D.IMatrix}
 * @constructor
 */
Grape2D.MatrixStack = function(){
	Grape2D.IMatrix.call(this);
	this.stack = [];
	this.identity = false;
	this.head = null;
};

Grape2D.MatrixStack.prototype = Object.create(Grape2D.IMatrix.prototype);
Grape2D.MatrixStack.prototype.push = function(matrix){
	if(this.identity){
		this.stack.push(new Grape2D.Matrix());
	}
	this.stack.push(matrix);
	this.head = matrix;
	return this;
};
Grape2D.MatrixStack.prototype.pushIdentity = function(){
	if(this.pushIdentity){
		var m = new Grape2D.Matrix();
		this.stack.push(m);
		this.head = m;
	}else{
		this.identity = true;
	}
	return this;
};
Grape2D.MatrixStack.prototype.pop = function(){
	if(this.identity){
		this.identity = false;
	}else{
		this.stack.pop();
		this.head = this.stack[this.stack.length-1];
	}
	return this;
};
Grape2D.MatrixStack.prototype.getHead = function(){
	if(this.identity){
		this.identity = false;
		this.push(new Grape2D.Matrix());
	}
	return this.head;
};
Grape2D.MatrixStack.prototype.translate = function(vector){
	if(this.identity){
		var m = Grape2D.Matrix.createFromTranslation(vector.getX(), vector.getY());
		this.identity = false;
		this.push(m);
	}else{
		this.head.translate(vector.getX(), vector.getY());
	}
	return this;
};
Grape2D.MatrixStack.prototype.scale = function(x, y){
	if(this.identity){
		this.identity = false;
		this.push(Grape2D.Matrix.createFromScale(x, y));
	}else{
		this.head.scale(x, y);
	}
	return this;
};
Grape2D.MatrixStack.prototype.rotate = function(angle){
	if(this.identity){
		this.identity = false;
		this.push(Grape2D.Matrix.createFromRotation(angle));
	}else{
		this.head.rotate(angle);
	}
	return this;
};
Grape2D.MatrixStack.prototype.reset = function(){
	this.stack = [];
	this.identity = false;
	this.head = null;
	return this;
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
	 * Renders a colored shape.
	 *
	 * @param  {!Grape2D.ColoredShape} shape The colored shape to render.
	 * @public
	 */
	renderColoredShape: function(shape){},
	/**
	 * Renders a texture to a position on the renderer.
	 *
	 * @param  {!Grape2D.ITexture} texture The texture to render
	 * @param  {!Grape2D.Vector} position The position to render
	 * @public
	 */
	renderTexture: function(texture, position) {},
	/**
	 * Renders an entity to the renderer. Specifically a
	 *   {@see Grape2D.REntity}.
	 *
	 * @param  {!Grape2D.REntity} entity Entity to render.
	 * @public
	 */
	renderREntity: function(entity) {},
	/**
	 * Renders the wireframe of an AABB.
	 *
	 * @param  {!Grape2D.AABB} aabb The AABB to render.
	 * @public
	 */
	renderAABB: function(aabb) {},
	/**
	 * Renders the wireframe of a circle.
	 *
	 * @param  {!Grape2D.Circle} circle Circle to render.
	 * @public
	 */
	renderCircle: function(circle) {},
	/**
	 * Renders the wireframe of a polygon.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to render.
	 * @public
	 */
	renderPolygon: function(polygon) {},
	/**
	 * Renders text to the renderer.
	 *
	 * @param  {!Grape2D.Text} text Text to render.
	 * @public
	 */
	renderText: function(text) {},
	/**
	 * Renders text, on a position absolute to the renderer.
	 *
	 * @param  {!Grape2D.AbsoluteText} text Text to render.
	 * @public
	 */
	renderAbsoluteText: function(text) {},
	/**
	 * Prepares a render cycle. This method should be called once, at
	 *   the begining of the rendering cycle.
	 *
	 * @param {!Grape2D.Camera} camera Camera to render the scene.
	 * @public
	 */
	start: function(camera) {},
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
	 * Sets the coloring mode to stroke.
	 *
	 * @public
	 */
	setStrokeColorMode: function() {},
	/**
	 * Sets the coloring mode to fill.
	 *
	 * @public
	 */
	setFillColorMode: function(color) {},
	/**
	 * Sets the color current color, to be used in the
	 *   color mode.
	 *
	 * @param {!Grape2D.Color} color Color to be used.
	 * @public
	 */
	setColor: function(color){},
	/**
	 * Renders a particle to the renderer.
	 *
	 * @param  {!Grape2D.Particle} particle Particle to render.
	 * @public
	 */
	//renderParticle: function(particle) {},
	/**
	 * Renders a line segment to the renderer.
	 *
	 * @param  {!Grape2D.Vector} start Start position of the line.
	 * @param  {!Grape2D.Vector} end End position of the line.
	 * @public
	 */
	renderLineSegment: function(start, end) {},
	/**
	 * Renders a point to the renderer.
	 *
	 * @param  {!Grape2D.Vector} point Point position.
	 * @public
	 */
	renderPoint: function(point) {},
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
	 * @param  {!Grape2D.Color} color Stroke color.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setStrokeStyle: function(color) {
		this.context.strokeStyle = color.toString();
		return this;
	},
	/**
	 * Sets the fill style.
	 *
	 * @param  {!Grape2D.Color} color Fill color.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setFillStyle: function(color) {
		this.context.fillStyle = color.toString();
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
	 * @param  {!Grape2D.Color} color Shadow color.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowColor: function(color) {
		this.context.shadowColor = color.toString();
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
	},
	/**
	 * Adds an event listener to the DOM element.
	 *
	 * @param {!string} on Event to listen.
	 * @param {!Function} callback Event callback.
	 * @param {!boolean=} bubble Event bubbles.
	 */
	addEventListener: function(on, callback, bubble){
		this.canvas.addEventListener(on, callback, bubble || false);
	},
	/**
	 * Set the style of the DOM element.
	 *
	 * @param {!Object.<!string, !(number|string)>} style Object where
	 *   the key corresponds to the CSS name.
	 * @public
	 */
	setStyle: function(style){
		for(var i in style){
			this.canvas.style[i] = style[i];
		}
	},
	getRaw: function(){
		return this.canvas;
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
 * @param  {!Grape2D.Color=} options.clearColor Clear color.
 *
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.CanvasRenderer = function(options) {
	options = options || {};
	/**
	 * A canvas object
	 *
	 * @type {!Grape2D.Canvas}
	 * @private
	 */
	this.canvas = new Grape2D.Canvas(options);
	/**
	 * The default color.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = new Grape2D.Color();
	if (options.color) {
		this.color.set(options.color);
	}
	/**
	 * Current color mode.
	 *
	 * @type {!string}
	 * @private
	 */
	this.colorMode = "fill";

	/**
	 * Renderers clear color.
	 *
	 * @type {!Grape2D.Canvas}
	 * @private
	 */
	this.clearColorCanvas = new Grape2D.Canvas({
		width: this.getWidth(),
		height: this.getHeight()
	});
	this.setClearColor(options.clearColor || new Grape2D.Color());

	/**
	 * Current camera.
	 *
	 * @type {?Grape2D.Camera}
	 * @private
	 */
	this.camera = null;

	this.rawCamera = new Grape2D.Camera({
		transformation: Grape2D.Matrix.createFromTranslation(-this.getHalfWidth(), -this.getHalfHeight())
	});

	this.modelView = new Grape2D.MatrixStack();

	var that = this;
	this.init();
	this.canvas.addEventListener("resize", function() {
		that.init();
	});
};

//CanvasRenderer inherits from Renderer
Grape2D.CanvasRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
Grape2D.CanvasRenderer.prototype.init = function() {
	this.canvas.translate(this.canvas.getHalfWidth(), this.canvas.getHalfHeight());
};
Grape2D.CanvasRenderer.prototype.setClearColor = function(color) {
	console.log(color+"");
	this.clearColorCanvas.setFillStyle(color);
	this.clearColorCanvas.fillRect(0, 0, this.clearColorCanvas.getWidth(), this.clearColorCanvas.getHeight());
};
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
	this.clearColorCanvas.setWidth(width);
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
	this.clearColorCanvas.setHeight(height);
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderColoredShape = function(coloredShape) {
	this.setColor(coloredShape.getColor());
	coloredShape.getShape().render(this);
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
Grape2D.CanvasRenderer.prototype.renderREntity = function(entity) {
	/*this.modelView.pushIdentity().translate(entity.getTexturePosition());
	entity.getTexture().render(this, this.camera.wcsToVcs(entity.getTexturePosition(), this.modelView.getHead()));*/
	this.modelView.pushIdentity().translate(entity.getPosition()).translate(entity.getTextureOffset());
	entity.getTexture().render(this, this.camera.wcsToVcs(entity.getPosition(), this.modelView.getHead()));
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderAABB = function(aabb) {
	this.canvas.beginPath();
	var first = this.camera.wcsToVcs(aabb.getMin()),
		temp;
	this.canvas.moveTo(first.getX(), first.getY());
	temp = this.camera.wcsToVcs(new Grape2D.Vector(aabb.getMaxX(), aabb.getMinY()));
	this.canvas.lineTo(temp.getX(), temp.getY());
	temp = this.camera.wcsToVcs(aabb.getMax());
	this.canvas.lineTo(temp.getX(), temp.getY());
	temp = this.camera.wcsToVcs(new Grape2D.Vector(aabb.getMinX(), aabb.getMaxY()));
	this.canvas.lineTo(temp.getX(), temp.getY());
	this.canvas.lineTo(first.getX(), first.getY());
	this.canvas[this.colorMode]();

};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderCircle = function(circle) {
	var center = this.camera.wcsToVcs(circle.getPosition()),
		rr = this.camera.getProjection().multiplyByVector(new Grape2D.Vector(circle.getRadius(), circle.getRadius()));

	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, Grape2D.Math.floor(rr.getX()), 0, Grape2D.Math.PIx2, false);
	this.canvas[this.colorMode]();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderPolygon = function(polygon) {
	var center = polygon.getPosition(),
		temp = null,
		first = center.clone(),
		list = polygon.getVertexList();

	first = this.camera.wcsToVcs(first.add(list[0]));

	this.canvas.beginPath();

	this.canvas.moveTo(first.getX(), first.getY());
	for (var i = 1; i < list.length; i++) {
		temp = center.clone();
		temp = this.camera.wcsToVcs(temp.add(list[i]));
		this.canvas.lineTo(temp.getX(), temp.getY());
	}

	this.canvas.lineTo(first.getX(), first.getY());
	//sets color TODO
	this.canvas[this.colorMode]();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderText = function(text) {
	this.renderTexture(text.getBuffer(), text.getPosition());
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderAbsoluteText = function(text) {
	var camera = this.camera;
	this.camera = this.rawCamera;
	//debugger;
	this.renderTexture(text.getBuffer(), this.camera.wcsToVcs(text.getPosition()));
	this.camera = camera;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.start = function(camera) {
	this.canvas.clearRect(-this.canvas.getHalfWidth(), -this.canvas.getHalfHeight(), this.canvas.getWidth(), this.canvas.getHeight());
	this.camera = camera;
	this.modelView.reset();
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
	this.clearColorCanvas.setStyle({
		"top": this.canvas.getRaw().offsetTop+"px",
		"left": this.canvas.getRaw().offsetLeft+"px",
		"position": "absolute",
		"z-index": "-1"
	});
	this.clearColorCanvas.appendOn(elm);
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
Grape2D.CanvasRenderer.prototype.setStrokeColorMode = function() {
	this.colorMode = "stroke";
	return this;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setFillColorMode = function() {
	this.colorMode = "fill";
	return this;
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.setColor = function(color) {
	this.color.set(color);
	this.canvas.setFillStyle(this.color);
	this.canvas.setStrokeStyle(this.color);
	return this;
};
/**
 * /override
 *
Grape2D.CanvasRenderer.prototype.renderParticle = function(particle) {
	var center = this.camera.wcsToVcs(particle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 1, 0, Grape2D.Math.PIx2, false);
	//sets color TODO
	this.canvas[this.colorMode]();
};*/
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderLineSegment = function(start, end) {
	var s = this.camera.wcsToVcs(start),
		e = this.camera.wcsToVcs(end);
	this.canvas.beginPath();
	this.canvas.moveTo(s.getX(), s.getY());
	this.canvas.lineTo(e.getX(), e.getY());
	this.canvas.stroke();
};
/**
 * @override
 */
Grape2D.CanvasRenderer.prototype.renderPoint = function(point) {
	var center = this.camera.wcsToVcs(point);
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 2, 0, Grape2D.Math.PIx2, false);
	this.canvas.fill();
};
Grape2D.CanvasRenderer.CIRCLE_PRECISION = 32;
/**
 * This is an higher level abstraction of a WebGKProgram. To be
 *   created it needs a vertex shader and a fragment shader. After
 *   that it needs to be compiled by a WebGLRendering context. At
 *   compiling it does "lower-level" compiling operations, it also
 *   extracts the uniforms and attributes to create the right setter
 *   functions for them. Making it very easy to send information to
 *   the shaders. There are some kind of limitations that comes form
 *   this:<ul>
 *   <li> Any mat3 passed should be transposed, since Grape2D's
 *     representation of matrix is row-major where WebGL is
 *     column-major.
 *   <li> mat2 and mat4 are not supported as uniforms. A "built-in"
 *     function is provided so to cast a mat3 matrix (without being
 *     transposed) to a mat4 matrix, in the vertex shader. The
 *     function is <code>grape2DMatrixToMat4</code> and receives a
 *     mat3 and returns a mat4.
 *   <li> Matrices are not supported as attributes.
 *   </ul>
 *
 * @param {!string} vertexShaderStr Vertex shader as a string.
 * @param {!string} fragmentShaderStr Fragment shader as a string.
 *
 * @constructor
 */
Grape2D.WebGLProgram = function(vertexShaderStr, fragmentShaderStr) {
	/**
	 * Compiled raw WebGL program. Its <code>null</code> if there was
	 *   some error
	 *
	 * @type {WebGLProgram}
	 * @private
	 */
	this.compiled = null;
	/**
	 * WebGL context associated with this program. May change after
	 *   the implementation of shared resources.
	 *
	 * @type {WebGLRenderingContext}
	 * @private
	 */
	this.gl = null;

	/**
	 * Vertex shader.
	 *
	 * @type {!string}
	 * @private
	 */
	this.vertexShader = vertexShaderStr;
	/**
	 * Fragment shader.
	 *
	 * @type {!string}
	 * @private
	 */
	this.fragmentShader = fragmentShaderStr;

	/**
	 * Cached locations and setting functions of the uniforms and
	 *   attributes of the program.
	 *
	 * @type {!Object.<!string, !Object.<!string, ?>>}
	 * @private
	 */
	this.cache = {
		uniform: {},
		attribute: {}
	};
};

Grape2D.WebGLProgram.prototype = {
	constructor: Grape2D.WebGLProgram,
	/**
	 * Compiles a single shader.
	 *
	 * @param  {!string} shaderStr Shader string.
	 * @param  {!WebGLRenderingContext} gl WebGL context.
	 * @param  {!number} type Type of the shader.
	 *
	 * @return {!WebGLShader}
	 * @protected
	 */
	compileShader: function(shaderStr, gl, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, shaderStr);
		gl.compileShader(shader);
		return shader;
	},
	/**
	 * Sets a uniform variable.
	 *
	 * @param {!string} name Uniform name.
	 * @param {!number} a First argument.
	 * @param {!number} b Second argument.
	 * @param {!number} c Third argument.
	 * @param {!number} d Fourth argument.
	 * @public
	 */
	setUniform: function(name, a, b, c, d) {
		this.cache.uniform[name].set(a, b, c, d);
	},
	/**
	 * Sets an attribute variable.
	 *
	 * @param {!string} name Name of the attribute.
	 * @param {!number} a First argument.
	 * @param {!number} b Second argument.
	 * @param {!number} c Third argument.
	 * @param {!number} d Fourth argument.
	 * @public
	 */
	setAttribute: function(name, a, b, c, d) {
		this.cache.attribute[name].set(a, b, c, d);
	},
	/**
	 * Compiles each shader, and a program with the two of them, also
	 *   generates the setting functions for each attribute and uniform.
	 *
	 * @param  {!WebGLRenderingContext} gl WebGL context.
	 * @return {?Grape2D.WebGLProgram} This program, if the compilation
	 *   when on without trouble, null otherwise.
	 * @public
	 */
	compile: function(gl) {
		var shaderProgram = gl.createProgram();
		var vs = Grape2D.WebGLProgram.G2D_SPECIFIC_FN +
			this.vertexShader;
		var wShader = vs + this.fragmentShader;

		gl.attachShader(shaderProgram, this.compileShader(vs, gl, gl.VERTEX_SHADER));
		gl.attachShader(shaderProgram, this.compileShader(this.fragmentShader, gl, gl.FRAGMENT_SHADER));
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			throw new Error("Couldn't initialize the shader program");
		} else {
			this.gl = gl;
		}
		this.compiled = shaderProgram;

		this.compileSetters(wShader);

		return this;
	},
	/**
	 * Checks if the program was compiled.
	 *
	 * @return {!boolean}
	 * @public
	 */
	isCompiled: function() {
		return this.compile != null;
	},
	/**
	 * Makes the associated WebGL context use this program.
	 *
	 * @return {!Grape2D.WebGLProgram} This object.
	 * @public
	 */
	use: function() {
		this.gl.useProgram(this.compiled);
		for (var i in this.cache.attribute) {
			this.gl.enableVertexAttribArray(this.cache.attribute[i].id);
		}
		return this;
	},
	unuse: function() {
		for (var i in this.cache.attribute) {
			this.gl.disableVertexAttribArray(this.cache.attribute[i].id);
		}
		return this;
	},
	/**
	 * Gets the location of an uniform, given it's name.
	 *
	 * @param  {!string} uniform Uniform's name.
	 * @return {?number} Uniform id, null if it doesn't exist.
	 * @public
	 */
	getUniformLocation: function(uniform) {
		return this.cache.uniform[uniform].id;
	},
	/**
	 * Gets the location of an attribute, given it's name.
	 *
	 * @param  {!string} attribute Attributes's name.
	 * @return {?number} Attribute's id, null if it doesn't exist.
	 * @public
	 */
	getAttributeLocation: function(attribute) {
		return this.cache.attribute[attribute].id;
	}
};
/**
 * Compile set functions of the uniforms and attributes.
 *
 * @param  {!string} wShader String with the declaration of the uniforms and attributes.
 * @public
 */
Grape2D.WebGLProgram.prototype.compileSetters = function(wShader) {
	var gl = this.gl,
		asso = this.buildAssociationObject(),
		rg = /(attribute|uniform) ((?:(?:(?:[i|b])?vec|mat)(?:[2|3|4]))|int|unsigned int|float|bool|sampler2D|samplerCube) ([\w|\d|_]+);/g,
		result,
		id = null,
		type, varName, varType;
	while ((result = rg.exec(wShader)) !== null) {
		type = result[1];
		varType = result[2];
		varName = result[3];
		if (type == "attribute") {
			id = gl.getAttribLocation(this.compiled, varName);
		} else {
			id = gl.getUniformLocation(this.compiled, varName);
		}
		this.cache[type][varName] = {
			set: asso[type][varType](id),
			id: id
		};
	}
};
/**
 * Builds an association object, where the first keys represent the
 *   type (an attribute or an uniform) and the second keys represent
 *   the uniform/attribute type. The result is a function that should
 *   be called with an attribute/uniform id. That call will return the
 *   set function for that uniform/attribute.
 *
 * @return {!Object.<!string, !Object.<!string, !function( (WebGLUniformLocation|number) ):function(!(number|Grape2D.Matrix), ...[number])>>} The
 *   association object.
 * @public
 */
Grape2D.WebGLProgram.prototype.buildAssociationObject = function() {
	var gl = this.gl,
		u1i = function(id) {
			return function(value) {
				gl.uniform1i(id, value);
			};
		},
		u4vi = function(id) {
			return function(v1, v2, v3, v4) {
				gl.uniform4i(id, v1, v2, v3, v4);
			};
		},
		u3vi = function(id) {
			return function(v1, v2, v3) {
				gl.uniform3i(id, v1, v2, v3);
			};
		},
		u2vi = function(id) {
			return function(v1, v2) {
				gl.uniform2i(id, v1, v2);
			};
		},

		genErrorMsg = function(msg) {
			return function(id) {
				throw new Error("[id:" + id + "] " + msg);
			};
		},

		avaa1 = function(id) {
			//gl.enableVertexAttribArray(id);
			return function(stride, offset) {
				gl.vertexAttribPointer(id, 1, gl.FLOAT, false, stride || 0, offset || 0);
			};
		},
		avaa2 = function(id) {
			//gl.enableVertexAttribArray(id);
			return function(stride, offset) {
				gl.vertexAttribPointer(id, 2, gl.FLOAT, false, stride || 0, offset || 0);
			};
		},
		avaa3 = function(id) {
			//gl.enableVertexAttribArray(id);
			return function(stride, offset) {
				gl.vertexAttribPointer(id, 3, gl.FLOAT, false, stride || 0, offset || 0);
			};
		},
		avaa4 = function(id) {
			//gl.enableVertexAttribArray(id);
			return function(stride, offset) {
				gl.vertexAttribPointer(id, 4, gl.FLOAT, false, stride || 0, offset || 0);
			};
		};
	return {
		"uniform": {
			"vec4": function(id) {
				return function(v1, v2, v3, v4) {
					gl.uniform4f(id, v1, v2, v3, v4);
				};
			},
			"vec3": function(id) {
				return function(v1, v2, v3) {
					gl.uniform3f(id, v1, v2, v3);
				};
			},
			"vec2": function(id) {
				return function(v1, v2) {
					gl.uniform2f(id, v1, v2);
				};
			},
			"bvec4": u4vi,
			"bvec3": u3vi,
			"bvec2": u2vi,
			"ivec4": u4vi,
			"ivec3": u3vi,
			"ivec2": u2vi,

			"mat4": genErrorMsg("This version of Grape2D doesn't support mat4 uniforms."),
			"mat3": function(id) {
				return function(matrix) {
					gl.uniformMatrix3fv(id, false, matrix.getRaw());
				};
			},
			"mat2": genErrorMsg("This version of Grape2D doesn't support mat3 uniforms."),

			"float": function(id) {
				return function(value) {
					gl.uniform1f(id, value);
				};
			},
			"bool": u1i,
			"int": u1i,
			"unsigned int": u1i,
			"sampler2D": u1i,
			"samplerCube": u1i,
		},
		"attribute": {
			"vec4": avaa4,
			"vec3": avaa3,
			"vec2": avaa2,

			"bvec4": avaa4,
			"bvec3": avaa3,
			"bvec2": avaa2,

			"ivec4": avaa4,
			"ivec3": avaa3,
			"ivec2": avaa2,

			"mat4": genErrorMsg("This version of Grape2D doesn't support mat4 attributes."),
			"mat3": genErrorMsg("This version of Grape2D doesn't support mat3 attributes."),
			"mat2": genErrorMsg("This version of Grape2D doesn't support mat2 attributes."),

			"float": avaa1,
			"bool": avaa1,
			"int": avaa1,
			"unsigned int": avaa1,
			"sampler2D": avaa1,
			"samplerCube": avaa1
		}
	};
};
/**
 * Creates the default color program, to be used when filling or
 *   stroking shapes.
 *
 * @return {!Grape2D.WebGLProgram} WebGL color program.
 * @public
 * @static
 */
Grape2D.WebGLProgram.createColorDefault = function() {
	return new Grape2D.WebGLProgram(Grape2D.WebGLProgram.DEFAULT_COLOR_VS, Grape2D.WebGLProgram.DEFAULT_COLOR_FS);
};
/**
 * Creates the deafult texture program, to be used when drawing
 *   textures.
 *
 * @return {!Grape2D.WebGLProgram} WebGL texture program.
 * @public
 * @static
 */
Grape2D.WebGLProgram.createTextureDefault = function() {
	return new Grape2D.WebGLProgram(Grape2D.WebGLProgram.DEFAULT_TEXTR_VS, Grape2D.WebGLProgram.DEFAULT_TEXTR_FS);
};
/**
 * Default color vertex shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_COLOR_VS = [
	"varying vec4 vColor;",
	"varying vec2 vTextureCoord;",

	"uniform mat3 rendererProjectionMatrix;",
	"uniform mat3 cameraProjectionMatrix;",
	"uniform mat3 modelViewMatrix;",
	"uniform mat3 projectionMatrix;",
	"uniform vec2 cameraPosition;",

	"uniform vec4 vertexColor;",
	"attribute vec2 vertexPosition;",

	"void main(void) {",
	"gl_PointSize = 2.0;",
	"gl_Position = ",
	"grape2DMatrixToMat4(rendererProjectionMatrix) * ",
	"grape2DMatrixToMat4(cameraProjectionMatrix) * ",
	"grape2DMatrixToMat4(modelViewMatrix) * ",
	"vec4(vertexPosition-cameraPosition, 0.0, 1.0);",
	"vColor = vertexColor;",
	"}"
].join("\n");
/**
 * Default color fragment shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_COLOR_FS = [
	"precision mediump float;",
	"varying vec4 vColor;",

	"void main(void) {",
	"gl_FragColor = vColor;",
	"}"
].join("\n");
/**
 * Default texture vertex shader.
 * This code may have a flaw somewhere, because, of the multiplication
 *   by two that needs to be done to render textures correctly.
 *   There is still room for improvement over this method.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_TEXTR_VS = [
	"varying vec4 vColor;",
	"varying vec2 vTextureCoord;",

	"uniform mat3 rendererProjectionMatrix;",
	"uniform mat3 cameraProjectionMatrix;",
	"uniform mat3 modelViewMatrix;",
	"uniform vec2 cameraPosition;",

	"attribute vec2 textureCoord;",
	"attribute vec2 vertexPosition;",

	"vec4 vPos;",
	"vec4 center;",
	"mat4 renderer2x;",

	"void main(void) {",
	"renderer2x = grape2DMatrixToMat4(rendererProjectionMatrix) * ",
		"mat4(2.0, 0.0, 0.0, 0.0,  0.0, 2.0, 0.0, 0.0,  0.0, 0.0, 1.0, 0.0,  0.0, 0.0, 0.0, 1.0);",
	"center = renderer2x * ",
		"grape2DMatrixToMat4(cameraProjectionMatrix) * ",
		"grape2DMatrixToMat4(modelViewMatrix) * ",
		"vec4(-cameraPosition, 0.0, 1.0);",

	"vPos = renderer2x * vec4(vertexPosition, 0.0, 1.0);",

	"gl_Position = vPos+center;",
	"vTextureCoord = textureCoord;",
	"}"
].join("\n");
/**
 * Default texture fragment shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_TEXTR_FS = [
	"precision mediump float;",
	"varying vec2 vTextureCoord;",
	"uniform sampler2D uSampler;",

	"void main(void) {",
	"gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.t, vTextureCoord.s));",
	"}"
].join("\n");
/**
 * A vertex shader function that transforms {@link Grape2D.Matrix}
 *   into a valid GLSL 4x4 matrix representation. Basically what it is
 *   it  creates a mat4 matrix with the {@link Grape2D.Matrix}
 *   transposed, and with the translation defined.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.G2D_SPECIFIC_FN = [
	"mat4 grape2DMatrixToMat4(mat3 m){",
	"return mat4(m[0][0], m[1][0], 0, m[2][0], m[0][1], m[1][1], 0, m[2][1], 0, 0, 1, 0, m[0][2], m[1][2], 0, m[2][2]);",
	"}"
].join("\n");
/**
 * This renders the objects to a canvas element, with a WebGL context.
 *   This method is hardware accelerated, and should be much faster
 *   than it counter part {@link Grape2D.CanvasRenderer}.
 *
 * @param {Object.<!number,?>=} options Setup options.
 * @param {!number=} options.width Width of the renderer.
 * @param {!number=} options.height Height of the renderer.
 * @param {!Grape2D.Color=} options.clearColor Clear color of the
 *   renderer.
 * @param {!boolean=} options.depthBuffer Enables depth buffer.
 * @param {!Grape2D.WebGLProgram=} options.colorShaderProgram Color
 *   program to be used to render {@link Grape2D.IShape}'s. If none is
 *   provided <code>Grape2D.WebGLProgram.createColorDefault()</code>
 *   is used.
 * @param {!Grape2D.WebGLProgram=} options.textureShaderProgram Color
 *   program to be used to render {@link Grape2D.ITexture}'s. If none
 *   is provided <code>Grape2D.WebGLProgram.createTextureDefault()
 *   </code> is used.
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.WebGLRenderer = function(options) {
	options = options || {};
	/**
	 * Width of the renderer. The default value is 800.
	 *
	 * @type {!number}
	 * @private
	 */
	this.width = options.width || 800;
	/**
	 * Height of the renderer. The default value is 600.
	 *
	 * @type {!number}
	 * @private
	 */
	this.height = options.height || 600;
	/**
	 * Raw canvas DOM element.
	 *
	 * @type {!Element}
	 * @protected
	 */
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;

	/**
	 * WebGL context.
	 *
	 * @type {!WebGLRenderingContext}
	 */
	this.gl = this.canvas.getContext("webgl");

	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.enable(this.gl.BLEND);

	/**
	 * Renderer's clear color.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.clearColor = options.clearColor || new Grape2D.Color();
	this.gl.clearColor(this.clearColor.getR(), this.clearColor.getG(), this.clearColor.getB(), this.clearColor.getA());

	/**
	 * Clear flag. This allows to switch choose between painter's or
	 *   z-buffer algorithm.
	 *
	 * @type {!number}
	 * @private
	 */
	this.clearFlag = options.depthBuffer ? (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) : this.gl.COLOR_BUFFER_BIT;

	/**
	 * General purpose buffer.
	 *
	 * @type {!WebGLBuffer}
	 * @private
	 */
	this.buffer = this.gl.createBuffer();

	/**
	 * Shader program in use.
	 *
	 * @type {Grape2D.WebGLProgram}
	 * @private
	 */
	this.shaderProgram = null;
	/**
	 * The shader program to be used to render textures.
	 *
	 * @type {!Grape2D.WebGLProgram}
	 * @private
	 */
	this.textureShaderProgram = (options.textureShaderProgram || Grape2D.WebGLProgram.createTextureDefault()).compile(this.gl);
	/**
	 * The shader program to be used to render shapes.
	 *
	 * @type {!Grape2D.WebGLProgram}
	 * @private
	 */
	this.colorShaderProgram = (options.colorShaderProgram || Grape2D.WebGLProgram.createColorDefault()).compile(this.gl);

	/**
	 * Model view matrix stack.
	 *
	 * @type {!Grape2D.MatrixStack}
	 * @private
	 */
	this.modelView = new Grape2D.MatrixStack();
	/**
	 * Renderer's projection matrix. This is calculated when the
	 *   renderer is created and whenever it's resized.
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.projection = new Grape2D.Matrix();

	/**
	 * Color mode represents a fill or stroke mode to be applied when
	 *   rendering/coloring the next {@link Grape2D.IShape}.
	 *
	 * @type {!number}
	 * @private
	 */
	this.colorMode = this.gl.LINE_LOOP;
	/**
	 * The current color to be used in the color mode.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = new Grape2D.Color([0, 0, 0, 1]);

	/**
	 * The current camera in use.
	 *
	 * @type {Grape2D.Camera}
	 * @private
	 */
	this.camera = null;

	this.rawCamera = new Grape2D.Camera({
		transformation: Grape2D.Matrix.createFromTranslation(-this.getHalfWidth(), -this.getHalfHeight())
	});

	//adds the default event listener
	var that = this;
	this.canvas.addEventListener("resize", function() {
		that.updateProjection();
	}, false);

	this.updateProjection();
};
Grape2D.WebGLRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
/**
 * Sets the clear color.
 *
 * @param {Grape2D.Color} color Clear color.
 * @public
 */
Grape2D.WebGLRenderer.prototype.setClearColor = function(color) {
	this.clearColor.set(color);
};
/**
 * Updates the projection matrix.
 *
 * @public
 */
Grape2D.WebGLRenderer.prototype.updateProjection = function() {
	this.projection = Grape2D.Matrix.createFromScale(2 / this.width, -2 / this.height);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getWidth = function() {
	return this.width;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getHalfWidth = function() {
	return this.width / 2;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setWidth = function(width) {
	this.width = width;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getHeight = function() {
	return this.height;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getHalfHeight = function() {
	return this.height / 2;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setHeight = function(height) {
	this.height = height;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderColoredShape = function(shape) {
	return;
};
/**
 * Generates a texture buffer. And stores it in the texture.
 *
 * @param  {!Grape2D.Texture} texture Texture to generate the buffer
 * @private
 */
Grape2D.WebGLRenderer.prototype.generateTextureBuffer = function(texture) {
	var gl = this.gl,
		buffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, buffer);

	gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	if(!Grape2D.Math.isPowerOfTwo(texture.getWidth()) && !Grape2D.Math.isPowerOfTwo(texture.getWidth())){
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.getBuffer());

	texture.setGlBuffer(buffer);
};
/**
 * Changes the current program.
 *
 * @param  {!Grape2D.WebGLProgram} program Program to use.
 * @public
 */
Grape2D.WebGLRenderer.prototype.changeProgram = function(program) {
	if(this.shaderProgram === program){
		return;
	}
	if(this.shaderProgram){
		this.shaderProgram.unuse();
	}
	program.use();
	this.shaderProgram = program;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderTexture = function(texture) {
	this.changeProgram(this.textureShaderProgram);
	var scale = 1,
		w = texture.getWidth(),
		h = texture.getHeight();
	var gl = this.gl;
	//texture mapping buffer
	var vertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
	//to cache
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	]), gl.STATIC_DRAW);

	if (!texture.glBuffer) {
		this.generateTextureBuffer(texture);
	}
	//object position
	var vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, 0,
		0, h,
		w, h,
		w, 0
	]), gl.STATIC_DRAW);

	var vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	//to cache
	var vertexIndices = [
		0, 1, 2, 0, 2, 3
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	this.shaderProgram.setAttribute("vertexPosition");

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
	this.shaderProgram.setAttribute("textureCoord");

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.glBuffer);
	this.shaderProgram.setUniform("uSampler", 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	this.setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderREntity = function(entity) {
	this.modelView.pushIdentity().translate(entity.getPosition()).translate(entity.getTextureOffset());
	entity.getTexture().render(this);
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderAABB = function(aabb) {
	this.changeProgram(this.colorShaderProgram);
	var hw = aabb.getHalfWidth(),
		hh = aabb.getHalfHeight(),
		temp = [
			//1,1
			hw, hh,
			//1,-1
			hw, -hh,
			//-1,-1
			-hw, -hh,
			//-1,1
			-hw, hh
		];
	this.modelView.pushIdentity().translate(aabb.getPosition());
	this.lineRender(new Float32Array(temp), 4);
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderCircle = function(circle) {
	//TODO : have a pre-computed circle, and just scale it properly before draw
	this.changeProgram(this.colorShaderProgram);
	var n = Grape2D.WebGLRenderer.CIRCLE_PRECISION,
		g, n1 = 1 / n,
		temp = [];
	for (var i = 0; i < n; i++) {
		g = (i * n1) * Grape2D.Math.PIx2;
		temp.push(circle.radius * Math.cos(g), circle.radius * Math.sin(g));
	}
	this.modelView.pushIdentity().translate(circle.getPosition());
	this.lineRender(new Float32Array(temp), n);
	this.modelView.pop();
	this.renderPoint(circle.getPosition());
};
/**
 * This is the generic, lower level, method to render shapes.
 *
 * @param  {!Array.<!number>} vertexList Vertex coordinates, it
 *   contains coordinate pairs. The first is the x coordinate and the
 *   second the y coordinate. And the number of number pairs should be
 *   a multiple of two.
 * @param  {!number} n Number of verteces.
 * @param  {!number} flag Draw flag.
 * @protected
 */
Grape2D.WebGLRenderer.prototype.lineRender = function(vertexList, n, flag) {
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexList, this.gl.STATIC_DRAW);
	this.shaderProgram.setAttribute("vertexPosition");
	this.setMatrixUniforms();
	this.shaderProgram.setUniform("vertexColor", this.color.getR(), this.color.getG(), this.color.getB(), this.color.getA());
	this.gl.drawArrays(this.gl.LINE_LOOP, 0, n);
};
/**
 * Sets matrix uniforms.
 *
 * @protected
 */
Grape2D.WebGLRenderer.prototype.setMatrixUniforms = function() {
	this.shaderProgram.setUniform("rendererProjectionMatrix", this.projection);
	this.shaderProgram.setUniform("cameraProjectionMatrix", this.camera.getProjection());
	this.shaderProgram.setUniform("modelViewMatrix", this.modelView.getHead());
	this.shaderProgram.setUniform("cameraPosition", this.camera.getLookAt().getX(), this.camera.getLookAt().getY());
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderPolygon = function(polygon) {
	this.changeProgram(this.colorShaderProgram);
	this.modelView.pushIdentity().translate(polygon.getPosition());
	var polyVert = polygon.getVertexList(),
		l = polyVert.length,
		verteces = [];
	for (var i = 0; i < l; i++) {
		verteces.push(polyVert[i].getX(), polyVert[i].getY());
	}
	this.lineRender(new Float32Array(verteces), l);
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderText = function(text) {
	this.modelView.pushIdentity().translate(text.getPosition());
	this.renderTexture(text.getBuffer());
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderAbsoluteText = function(text) {
	var camera = this.camera;
	this.camera = this.rawCamera;

	this.modelView.pushIdentity().translate(text.getPosition());
	this.renderTexture(text.getBuffer());
	this.modelView.pop();

	this.camera = camera;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.start = function(camera) {
	this.gl.viewport(0, 0, this.width, this.height);
	this.gl.clear(this.clearFlag);

	this.camera = camera;

	this.modelView.reset().pushIdentity();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.end = function() {};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.appendToDOMElement = function(elm) {
	elm.appendChild(this.canvas);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getDOMElement = function() {
	return this.canvas;
};
/**
 * Gets the 2D context of teh canvas element.
 *
 * @return {!CanvasRenderingContext2D} Canvas 2D context.
 * @public
 */
Grape2D.WebGLRenderer.prototype.getContext = function() {
	return this.gl;
};
/**
 * Gets the color in use.
 *
 * @return {!Grape2D.Color} Color.
 * @public
 */
Grape2D.WebGLRenderer.prototype.getColor = function() {
	return this.color;
};
/**
 * Sets the color to be used.
 *
 * @param {!Grape2D.Color} color Color to be used.
 * @public
 */
Grape2D.WebGLRenderer.prototype.setColor = function(color) {
	this.color.set(color);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setStrokeColorMode = function() {
	this.colorMode = this.gl.LINE_LOOP;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setFillColorMode = function() {};
/**
 * @override
 */
//Grape2D.WebGLRenderer.prototype.renderParticle = function(particle) {
	/*var center = camera.wcsToViewport(this, particle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 1, 0, Grape2D.Math.PIx2, false);
	this.canvas.fill();*/
//};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderLineSegment = function(start, end) {
	this.changeProgram(this.colorShaderProgram);
	var verteces = new Float32Array([start.getX(), start.getY(), end.getX(), end.getY()]);
	this.lineRender(verteces, 2, this.gl.LINES);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderPoint = function(point) {
	this.changeProgram(this.colorShaderProgram);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([point.getX(), point.getY()]), this.gl.STATIC_DRAW);
	this.shaderProgram.setAttribute("vertexPosition");
	this.shaderProgram.setUniform("vertexColor", this.color.getR(), this.color.getG(), this.color.getB(), this.color.getA());
	this.setMatrixUniforms();
	this.gl.drawArrays(this.gl.POINTS, 0, 1);
};
/**
 * Circle precision. Still not fully implemented.
 *
 * @type {!number}
 * @public
 * @constant
 */
Grape2D.WebGLRenderer.CIRCLE_PRECISION = 32;
/**
 * Only renders the wireframe of (the bounding box of)
 *   {@link Grape2D.IEntity}, using another {@link Grape2D.Renderer},
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
Grape2D.WireframeRenderer.prototype.renderREntity = function(entity) {
	this.renderPoint(entity.getPosition());
	entity.getBoundingBox().render(this);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAABB = function(aabb) {
	this.renderer.renderAABB(aabb);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderCircle = function(circle) {
	this.renderer.renderCircle(circle);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPolygon = function(polygon) {
	this.renderer.renderPolygon(polygon);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderText = function(text) {
	this.renderer.renderText(text);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderAbsoluteText = function(absoluteText) {
	this.renderer.renderText(absoluteText);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.start = function(camera) {
	this.renderer.start(camera);
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
Grape2D.WireframeRenderer.prototype.setStrokeColorMode = function() {
	this.renderer.setStrokeColorMode();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setFillColorMode = function() {
	this.renderer.setFillColorMode();
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.setColor = function(color) {
	this.renderer.setColor(color);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderColoredShape = function(shape) {
	this.renderer.renderColoredShape(shape);
};
/**
 * /override
 *
Grape2D.WireframeRenderer.prototype.renderParticle = function(particle) {
	this.renderer.renderParticle(particle);
};*/
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderLineSegment = function(start, end) {
	this.renderer.renderLineSegment(start, end);
};
/**
 * @override
 */
Grape2D.WireframeRenderer.prototype.renderPoint = function(point) {
	this.renderer.renderPoint(point);
};
/**
 * Interface for shape definition.
 * 
 * @class
 * @interface
 */
Grape2D.IShape = function() {};
Grape2D.IShape.prototype = {
	constructor: Grape2D.IShape,
	/**
	 * Gets the position of the object.
	 *
	 * @return {!Grape2D.Vector} The center position of the shape.
	 * @public
	 */
	getPosition: function() {},
	/**
	 * Set the position of the shape.
	 *
	 * @param  {!Grape2D.Vector} position The new position of the shape.
	 * @public
	 */
	setPosition: function(position) {},
	/**
	 * Renders the shape.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer to render the
	 *   shape's wireframe.
	 * @public
	 */
	render: function(renderer) {},
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
 * Shape is an abstract class that describes "physical", objects.
 *   The main objective of a Shape is to serve as a bounding box. It
 *   should play the main role when selecting the objects to render,
 *   when it comes to collision detection and/or to detect user
 *   interaction with an object.
 *
 * @param {!Grape2D.Vector=} options.position The position of the shape.
 * @implements {Grape2D.IShape}
 * @constructor
 */
Grape2D.Shape = function(options) {
	Grape2D.IShape.call(this);
	options = options || {};
	/**
	 * Shape's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @protected
	 */
	this.position = new Grape2D.Vector();
	if(options.position){
		this.position.set(options.position);
	}
};

Grape2D.Shape.prototype = Object.create(Grape2D.IShape.prototype);
/**
 * @override
 */
Grape2D.Shape.prototype.getPosition = function() {
	return this.position;
};
/**
 * @override
 */
Grape2D.Shape.prototype.setPosition = function(position) {
	this.position.set(position);
};
/**
 * @override
 */
Grape2D.Shape.prototype.render = function(renderer) {
	return;
};
/**
 * @override
 */
Grape2D.Shape.prototype.createBV = function(bvfactory) {
	return null;
};
/**
 * @override
 */
Grape2D.Shape.prototype.getStaticType = function() {
	return "";
};
/**
 * A shape that can be rendered with a color. This is particulary useful for debug, and is best way to renderer a shape with color with the {@link Grape2D.WireframeRenderer}.
 *
 * @param {!Grape2D.IShape} options.shape Shape to be colored.
 * @param {!Grape2D.Color=} options.color Shape's rendering color.
 * @implements {Grape2D.IShape}
 * @constructor
 */
Grape2D.ColoredShape = function(options) {
	Grape2D.IShape.call(this);
	/**
	 * Color of the shape.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = options.color || new Grape2D.Color();
	/**
	 * Shape.
	 *
	 * @type {!Grape2D.IShape}
	 * @private
	 */
	this.shape = options.shape;
};
Grape2D.ColoredShape.prototype = Object.create(Grape2D.IShape.prototype);
/**
 * Gets the color.
 *
 * @return {!Grape2D.Color} Color.
 * @public
 */
Grape2D.ColoredShape.prototype.getColor = function(){
	return this.color;
};
/**
 * Sets the color.
 *
 * @param {!Grape2D.Color} color Color.
 * @public
 */
Grape2D.ColoredShape.prototype.setColor = function(color){
	this.color = color;
};
/**
 * Gets the shape.
 *
 * @return {!Grape2D.IShape} Shape.
 * @public
 */
Grape2D.ColoredShape.prototype.getShape = function() {
	return this.shape;
};
/**
 * Sets the shape.
 *
 * @param {!Grape2D.Shape} shape Shape.
 * @public
 */
Grape2D.ColoredShape.prototype.setShape = function(shape) {
	this.shape = shape;
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.getPosition = function() {
	return this.shape.getPosition();
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.setPosition = function(position) {
	this.shape.setPosition(position);
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.render = function(renderer) {
	renderer.renderColoredShape(this);
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.createBV = function(bvfactory) {
	return this.shape.createBV(bvfactory);
};
/**
 * @override
 */
Grape2D.ColoredShape.prototype.getStaticType = function() {
	return Grape2D.ColoredShape.TYPE;
};
Grape2D.ColoredShape.TYPE = "COLOREDSHAPE";
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
Grape2D.AABB.prototype.render = function(renderer) {
	renderer.renderAABB(this);
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
Grape2D.Circle.prototype.render = function(renderer){
	renderer.renderCircle(this);
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
Grape2D.Polygon.prototype.render = function(renderer){
	renderer.renderPolygon(this);
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
Grape2D.Ray.createFromPoints = function(start, end){
	var direction = end.clone().sub(start).normalize();
	return new Grape2D.Ray(start, direction, start.distanceTo(end));
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
 * An entity interface is any object, in a 2D space and bounded by a
 *   shape.
 *
 * @class
 * @interface
 */
Grape2D.IEntity = function() {};
Grape2D.IEntity.prototype = {
	constructor: Grape2D.IEntity,
	/**
	 * Gets the position.
	 *
	 * @return {!Grape2D.Vector} Central position.
	 * @public
	 */
	getPosition: function(){},
	/**
	 * Sets the position.
	 *
	 * @param {!Grape2D.Vector} position Position.
	 * @public
	 */
	setPosition: function(position){},
	/**
	 * Gets the bounding box.
	 *
	 * @return {!Grape2D.IShape} Bounding box.
	 * @public
	 */
	getBoundingBox: function(){},
	/**
	 * Sets the bounding box.
	 *
	 * @param {!Grape2D.IShape} boundingBox Bounding box.
	 * @public
	 */
	setBoundingBox: function(boundingBox){},
	/**
	 * Gets the bounding box offset.
	 *
	 * @return {!Grape2D.Vector} Offset.
	 * @public
	 */
	getBoundingBoxOffset: function(){},
	/**
	 * Sets the bounding box offset.
	 *
	 * @param {!Grape2D.Vector} boundingBoxOffset Offset.
	 * @public
	 */
	setBoundingBoxOffset: function(boundingBoxOffset){},
	/**
	 * Updates the entity.
	 *
	 * @param  {!number} dt Time difference since the last update.
	 * @public
	 */
	update: function(dt) {},
	/**
	 * Processes this entity in a given processor.
	 *
	 * @param  {!Grape2D.IEntityProcessor} processor Processor.
	 * @public
	 */
	process: function(processor){}
};
/**
 * @class
 * @interface
 */
Grape2D.IEntityProcessor = function() {};
Grape2D.IEntityProcessor.prototype = {
	constructor: Grape2D.IEntityProcessor,
	/**
	 * Processes an {@see Grape2D.Entity}.
	 *
	 * @param  {!Grape2D.Entity} entity Entity to process.
	 * @public
	 */
	processEntity: function(entity) {},
	/**
	 * Processes an {@see Grape2D.REntity}.
	 *
	 * @param  {!Grape2D.REntity} rentity Entity to process.
	 * @public
	 */
	processREntity: function(rentity) {},
	/**
	 * Processes an {@see Grape2D.NetworkEntity}.
	 *
	 * @param  {!Grape2D.Entity} nentity Entity to process.
	 * @public
	 */
	processNetworkEntity: function(nentity) {}
};
/**
 * @extends {Grape2D.IEntity}
 * @class
 * @interface
 */
Grape2D.RenderableEntity = function() {
	Grape2D.IEntity.call(this);
};
Grape2D.RenderableEntity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * Gets the render position.
 *
 * @return {!Grape2D.Vector} Render position.
 * @public
 */
Grape2D.RenderableEntity.prototype.getRenderPosition = function() {};
/**
 * An entity is an object with a 2D position and a position.
 * Essentially it's the basic information of an object. By itself it
 *   shouldn't rendered. To render it use a wrapper, such as
 *   {@see Grape2D.REntity}.
 *   This present in the client-side and in the server-side. While the
 *   {@see Grape2D.REntity} is only present in the client-side. This
 *   way things stay uncoupled and there isn't any unnecessary
 *   instances in either side.
 *
 * @param {!Object} options Setup options.
 * @param {!Grape2D.Vector=} options.position Center position of the
 *   entity. The default position is the origin (0,0). It will copy
 *   the object.
 * @param {!Grape2D.IShape} options.boundingBox Bounding box of the
 *   object. It's used to check for collisions. The position of the
 *   shape should always be <code>position+offset</code>.
 * @param {!Grape2D.Vector=} options.boundingBoxOffset The offset of
 *   the bounding box, relative to the entity center. The default
 *   offset is none (0,0). It will copy the object.
 *
 * @implements {Grape2D.RenderableEntity}
 * @constructor
 */
Grape2D.Entity = function(options) {
	/**
	 * Central position of the entity.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector();
	if(options.position){
		this.position.set(options.position);
	}
	/**
	 * Bounding box.
	 *
	 * @type {!Grape2D.IShape}
	 * @private
	 */
	this.boundingBox = options.boundingBox;
	/**
	 * Bounding box offset, relative to the central position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.boundingBoxOffset = new Grape2D.Vector();
	if(options.boundingBoxOffset){
		this.boundingBoxOffset.set(options.boundingBoxOffset);
	}

	this.computeBoundingBoxPosition();
};
Grape2D.Entity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * @override
 */
Grape2D.Entity.prototype.getRenderPosition = function(){
	return this.position;
};
/**
 * @override
 */
Grape2D.Entity.prototype.getPosition = function(){
	return this.position;
};
/**
 * @override
 */
Grape2D.Entity.prototype.setPosition = function(position){
	this.position.set(position);
};
/**
 * @override
 */
Grape2D.Entity.prototype.getBoundingBox = function(){
	return this.boundingBox;
};
/**
 * @override
 */
Grape2D.Entity.prototype.setBoundingBox = function(boundingBox){
	this.boundingBox = boundingBox;
	this.computeBoundingBoxPosition();
};
/**
 * @override
 */
Grape2D.Entity.prototype.getBoundingBoxOffset = function(){
	return this.boundingBoxOffset;
};
/**
 * @override
 */
Grape2D.Entity.prototype.setBoundingBoxOffset = function(boundingBoxOffset){
	this.boundingBoxOffset.set(boundingBoxOffset);
	this.computeBoundingBoxPosition();
};
/**
 * Computes the bounding box position.
 *
 * @private
 */
Grape2D.Entity.prototype.computeBoundingBoxPosition = function(){
	this.boundingBox.setPosition(this.position.clone().add(this.boundingBoxOffset));
};
/**
 * @override
 */
Grape2D.Entity.prototype.update = function(dt){};
/**
 * @override
 */
Grape2D.Entity.prototype.process = function(processor){
	processor.processEntity(this);
};
/**
 * A REntity is an {@see Grape2D.IEntity} that can be rendered in to a
 *   {@see Grape2D.Renderer}.
 * It uses the entity's position as the texture position, and it can
 *   be offsetted. Queries may be performed in the entity's bounding
 *   box to select it or not for rendering.
 *
 * @param {!Object} options Setup options.
 * @param {!Grape2D.RenderableEntity} options.entity Entity to render.
 * @param {!Grape2D.Texture} options.texture Texture to use.
 * @param {!Grape2D.Vector=} options.textureOffset The offset of the
 *   texture, relative to the entity's center. The default
 *   offset is none (0,0). It will copy the object.
 *
 * @implements {Grape2D.IEntity}
 * @constructor
 */
Grape2D.REntity = function(options) {
	/**
	 * Entity.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.entity = options.entity;
	/**
	 * Texture to render.
	 *
	 * @type {!Grape2D.Texture}
	 * @private
	 */
	this.texture = options.texture;
	/**
	 * Texture offset.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.textureOffset = new Grape2D.Vector();
	if(options.textureOffset){
		this.textureOffset.set(options.textureOffset);
	}
};
Grape2D.REntity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * Renders the entity to a renderer.
 *
 * @param  {!Grape2D.Renderer} renderer Target render.
 * @public
 */
Grape2D.REntity.prototype.render = function(renderer){
	renderer.renderREntity(this);
};
/**
 * Gets the entity to use to render.
 *
 * @return {!Grape2D.IEntity} Entity.
 * @public
 */
Grape2D.REntity.prototype.getEntity = function(){
	return this.entity;
};
/**
 * Sets the entity to use to render.
 *
 * @param {!Grape2D.IEntity} entity Entity.
 * @public
 */
Grape2D.REntity.prototype.setEntity = function(entity){
	this.entity = entity;
};
/**
 * Gets the texture.
 *
 * @return {!Grape2D.ITexture} Texture.
 * @public
 */
Grape2D.REntity.prototype.getTexture = function(){
	return this.texture;
};
/**
 * Sets the texture to render.
 *
 * @param {!Grape2D.ITexture} texture Texture.
 * @public
 */
Grape2D.REntity.prototype.setTexture = function(texture){
	this.texture = texture;
};
/**
 * Gets the texture's offset.
 *
 * @return {!Grape2D.Vector} Offset.
 * @public
 */
Grape2D.REntity.prototype.getTextureOffset = function(){
	return this.textureOffset;
};
/**
 * Sets the texture's offset.
 *
 * @param {!Grape2D.Vector} textureOffset Offset.
 * @public
 */
Grape2D.REntity.prototype.setTextureOffset = function(textureOffset){
	this.textureOffset = textureOffset;
};
/**
 * @override
 */
Grape2D.REntity.prototype.getPosition = function(){
	return this.entity.getRenderPosition();
};
/**
 * @override
 */
Grape2D.REntity.prototype.setPosition = function(position){
	return this.entity.setPosition(position);
};
/**
 * @override
 */
Grape2D.REntity.prototype.getBoundingBox = function(){
	return this.entity.getBoundingBox();
};
/**
 * @override
 */
Grape2D.REntity.prototype.setBoundingBox = function(boundingBox){
	return this.entity.setBoundingBox(boundingBox);
};
/**
 * @override
 */
Grape2D.REntity.prototype.getBoundingBoxOffset = function(){
	return this.entity.getBoundingBoxOffset();
};
/**
 * @override
 */
Grape2D.REntity.prototype.setBoundingBoxOffset = function(boundingBoxOffset){
	return this.entity.setBoundingBoxOffset(boundingBoxOffset);
};
/**
 * @override
 */
Grape2D.REntity.prototype.update = function(dt){
	this.entity.update(dt);
};
/**
 * @override
 */
Grape2D.REntity.prototype.process = function(processor){
	processor.processREntity(this);
};
/**
 * An network entity interface is any entity that can be exchanged
 *   between two endpoints.
 * A network entity is identified by an UUID.
 *
 * @extends {Grape2D.RenderableEntity}
 * @class
 * @interface
 */
Grape2D.INetworkEntity = function() {};
Grape2D.INetworkEntity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * Gets the UUID of the entity.
 *
 * @return {!string} UUID of the entity.
 * @public
 */
Grape2D.INetworkEntity.prototype.getUUID = function() {};
/**
 * Updates itself, for optimal performance it should only be used once,
 *   when using a snapshot with the information about this entity.
 *
 * @public
 */
Grape2D.INetworkEntity.prototype.updateNetworkProperties = function() {};
/**
 * Container for a {@see Grape2D.Entity}, to be exchanged between
 *   two endpoints in a network.
 *
 * @param {!Grape2D.IEntity} entity Entity.
 *
 * @implements {Grape2D.INetworkEntity}
 * @constructor
 */
Grape2D.NetworkEntity = function(entity, uuid) {
	/**
	 * Entity.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.entity = entity;
	/**
	 * Entity's UUID.
	 * 
	 * @type {!string}
	 * @private
	 */
	this.uuid = uuid || Grape2D.utils.UUIDGeneratorSingleton.generate();
	/**
	 * Position to render the entity in a interpolate position.
	 * This position should be consistent with the last snapshot with
	 *   information about this entity.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.interpolatingPosition = new Grape2D.Vector();
};
Grape2D.NetworkEntity.prototype = Object.create(Grape2D.INetworkEntity.prototype);
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getUUID = function(){
	return this.uuid;
};
/**
 * Gets the non-network entity.
 *
 * @return {!Grape2D.IEntity} Entity.
 * @public
 */
Grape2D.NetworkEntity.prototype.getEntity = function(){
	return this.entity;
};
/**
 * Sets the non-network entity to be wrapped by this class.
 *
 * @param {!Grape2D.IEntity} entity Entity.
 * @public
 */
Grape2D.NetworkEntity.prototype.setEntity = function(entity){
	this.entity = entity;
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getRenderPosition = function(){
	return Grape2D.Vector.lerp(this.getPosition(), this.interpolatingPosition, Grape2D.SnapshotManagerSingleton.getLerpPercent());
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getPosition = function(){
	return this.entity.getPosition();
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.setPosition = function(position){
	return this.entity.setPosition(position);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getBoundingBox = function(){
	return this.entity.getBoundingBox();
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.setBoundingBox = function(boundingBox){
	return this.entity.setBoundingBox(boundingBox);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getBoundingBoxOffset = function(){
	return this.entity.getBoundingBoxOffset();
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.setBoundingBoxOffset = function(boundingBoxOffset){
	return this.entity.setBoundingBoxOffset(boundingBoxOffset);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.update = function(dt){};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.updateNetworkProperties = function() {
	var entity = Grape2D.SnapshotManagerSingleton.getNetworkEntity(this.getEntity());
	this.interpolatingPosition.setXY(entity.position.x, entity.position.y);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.process = function(processor){
	processor.processNetworkEntity(this);
};
/**
 * Decodes a snapshot on the client side.
 * This is the default and should be used mainly as an example, since
 *   it only supports few features of entity, and it has steps that
 *   are not necessary. Take for example the method
 *   <code>createNetworkEntity</code>, that in this case creates a
 *   duplicate object of the first, however in a custom implementation
 *   JSON may not be used, or the keys may have diferent names than
 *   a simple representation of the object.
 * Decodes a snapshot created by {@see Grape2D.DefaultSnapshotEncoder}.
 *   The JSON needs:
 *   <ul>
 *     <li>to have a vector of entities UUID's to add to the
 *       {@see Grape2D.INetworkMap};</li>
 *     <li>to have the UUID's to remove from the client's
 *       {@see Grape2D.INetworkMap};</li>
 *     <li>to have a JSON object with {@see Grape2D.NetworkEntity},
 *       where the key's are strings and are the entity UUID, and the
 *       value should be the entity serialized.</li>
 *   </ul>
 *
 * @constructor
 */
Grape2D.DefaultSnapshotDecoder = function(){
	/**
	 * Entities decoded from the snapshot.
	 *
	 * @type {!Object.<!string, !Object.<!string, !Object.<!string, !number>>>}
	 * @private
	 */
	this.entities = {};
	/**
	 * Events. 
	 *
	 * @type {!Array.<!Object.<!string, !(number|string)>>}
	 * @private
	 */
	this.events = [];
	/**
	 * Snapshot time.
	 *
	 * @type {!number}
	 * @private
	 */
	this.time = 0;
};

Grape2D.DefaultSnapshotDecoder.prototype = {
	constructor: Grape2D.DefaultSnapshotDecoder
};
/**
 * Decodes the snapshot, and stores it internally. If another one was
 *   decoded previouslly it will be lost.
 *
 * @param  {!string} snapshot Snapshot to be decoded.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.decode = function(snapshot) {
	this.entities = {};
	this.events = [];
	this.time = 0;

	var decoded = JSON.parse(snapshot),
		events = decoded.events,
		entities = decoded.entities;

	this.time = decoded.time;

	for(var i in entities){
		this.entities[i] = this.createNetworkEntity(entities[i]);
	}

	for(var j=0, nevent; nevent=events[j++];){
		this.events.push(this.createNetworkEvent(nevent));
	}
};
/**
 * Creates a network entity.
 *
 * @param  {!Object.<!string, !Object.<!string, !number>>} entity
 *   Entity serialized.
 * @return {!Object.<!string, !Object.<!string, !number>>} Entity
 *   simple representation.
 * @private
 */
Grape2D.DefaultSnapshotDecoder.prototype.createNetworkEntity = function(entity) {
	return {
		position: {
			x: entity.position.x,
			y: entity.position.y
		}
	};
};
/**
 * Creates a network event.
 *
 * @param  {!Object.<!string, !(number|string)>} nevent
 *   Serialized event.
 * @return {!Object.<!string, !(number|string)>} Event simple
 *   representation.
 * @private
 */
Grape2D.DefaultSnapshotDecoder.prototype.createNetworkEvent = function(nevent) {
	return {
		type: nevent.type,
		data: nevent.data
	};
};
/**
 * Gets the network entities.
 *
 * @return {!Object.<!string, !Object.<!string, !Object.<!string, !number>>>}
 *   Network entities decoded.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getNetworkEntities = function() {
	return this.entities;
};
/**
 * Gets the network events.
 *
 * @return {!Array.<!Object.<!string, !(number|string)>>} Events.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getNetworkEvents = function() {
	return this.events;
};
/**
 * Gets the time of the snapshot.
 *
 * @return {!number} Time of the snapshot.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getTime = function() {
	return this.time;
};
/**
 * Creates an object with the result of the decoding.
 * It object contains:<ul>
 *   <li>time : time of the snapshot</li>
 *   <li>networkEvents : network events in the snapshot</li>
 *   <li>networkEntities : network entities in the snapshot</li>
 * </ul>
 *
 * @return {!Object.<!string, !(Object|Array|number)>} The object
 *   described above.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getResultPacked = function(){
	return {
		time: this.time,
		networkEvents: this.events,
		networkEntities: this.entities
	};
};
/**
 * Encodes stuff and creates a snapshot.
 *
 * @param {!Grape2D.utils.Clock} clock Clock to get the time.
 *
 * @implements {Grape2D.IEntityProcessor}
 * @constructor
 */
Grape2D.DefaultSnapshotEncoder = function(clock) {
	/**
	 * Clock to use.
	 *
	 * @type {!Grape2D.utils.Clock}
	 * @private
	 */
	this.clock = clock;
	/**
	 * Network events.
	 *
	 * @type {!Array.<!Object.<!string, !(string|number)>>}
	 * @private
	 */
	this.events = [];
	/**
	 * Simple version of network entities.
	 *
	 * @type {!Object.<!string, !Object.<!string, !Object.<!string, !number>>>}
	 * @private
	 */
	this.entities = {};
};
Grape2D.DefaultSnapshotEncoder.prototype = Object.create(Grape2D.IEntityProcessor.prototype);
/**
 * Clears the data from the last snapshot.
 *
 * @public
 */
Grape2D.DefaultSnapshotEncoder.prototype.start = function() {
	this.events = [];
	this.entities = {};
};
/**
 * The snapshot encoder doesn't support {@see Grape2D.Entity}.
 * 
 * @override
 */
Grape2D.DefaultSnapshotEncoder.prototype.processEntity = function(entity) {};
/**
 * The {@see Grape2D.REntity} may contain a {@see Grape2D.NetworkEntity}.
 * 
 * @override
 */
Grape2D.DefaultSnapshotEncoder.prototype.processREntity = function(entity) {
	entity.process(this);
};
/**
 * Creates a simple version of the given network entity and add's it
 *   to the pool. In a custom implementation it may instead serialize
 *   and then add it to the pool of entities.
 * 
 * @override
 */
Grape2D.DefaultSnapshotEncoder.prototype.processNetworkEntity = function(nentity) {
	this.entities[nentity.getUUID()] = {
		position: {
			x: nentity.getPosition().getX(),
			y: nentity.getPosition().getY(),
		}
	};
};
/**
 * Creates a simple version of the given network event and adds it to
 *   the pool. In a custom implementation it may instead serialize
 *   and then add it to the pool of entities.
 *
 * @param {!Object.<!string, !(string|number)>} nevent Network event.
 * @public
 */
Grape2D.DefaultSnapshotEncoder.prototype.addNetworkEvent = function(nevent) {
	this.events.push(nevent);
};
/**
 * Gets the snapshot encoded. It also destroys the snapshot
 *   information.
 *
 * @return {!string} Snapshot encoded.
 * @public
 */
Grape2D.DefaultSnapshotEncoder.prototype.getSnapshotEncoded = function() {
	var result = JSON.stringify({
		time: this.clock.getTime(),
		networkEvents: this.events,
		NetworkEntities: this.entities
	});
	this.events = [];
	this.entities = {};
	return result;
};
/**
 * This holds a limited history of snapshots received from the server.
 *   The snapshots are organized by the order received, and hold the
 *   current time when they were received.
 *
 * @param {!number=} cap Maximum number of entries on the history. The
 *   default value is 10.
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
	 * @type {!Array.<!Object>}
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
	 * @param {!Object} snapshot Snapshot received.
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
	 * @return {?Object} A string if it has found a valid
	 *   snapshot before the time, null otherwise.
	 * @public
	 */
	getBefore: function(time) {
		for (var i = this.history.length-1; i >= 0; i--) {
			if (this.history[i].time < time) {
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
	 * @return {?Object} A string if it has found a valid
	 *   snapshot after the time, null otherwise.
	 * @public
	 */
	getAfter: function(time) {
		for (var i = 0; i < this.history.length; i++) {
			if (this.history[i].time > time) {
				return this.history[i];
			}
		}
		return null;
	},
	/**
	 * Gets the history list.
	 *
	 * @return {!Array.<!Object>} Snapshot
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
	 * @type {?Object}
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
	 * @return {?Object} Snapshot object.
	 * @public
	 */
	getSnapshot: function() {
		return this.currentSnapshot;
	},
	/**
	 * Gets a network entity by it's id.
	 *
	 * @param  {!string} id Object's id.
	 * @return {?Grape2D.INetworkEntity} Network entity, if there's one,
	 *   or either null or undefined if there's none.
	 * @public
	 */
	getNetworkEntity: function(id) {
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
			this.lerpPercent = (time - this.lerp - this.currentSnapshot.getTime()) / this.iLerp; //TOFIX?
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
	 * Gets a snapshot object by it's id. A snapshot manager must be
	 *   set before.
	 *
	 * @param {!string} id Network entity's id.
	 * @return {?Object} Network entity.
	 * @public
	 * @static
	 */
	getNetworkEntity: function(id){
		return Grape2D.SnapshotManagerSingleton.instance.getNetworkEntity(id);
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
	 * Start drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.dragStartClbk = [];
	/**
	 * Drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.drag = [];
	/**
	 * Stop drag callback stack.
	 *
	 * @type {!Array.<Function>}
	 * @private
	 */
	this.dragStop = [];
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
		var dragExecuted = false;
		this.addMouseMove(function(e) {
			if (that.isDragging) {
				var end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart),
					list = that.getDragBindStack();
				for (var i = 0; i < list.length; i++) {
					list[i](ev);
				}
				that.dragStart.set(end);
				if(!dragExecuted){
					var startList = that.dragStartClbk;
					for(var j=0; j<startList.length; j++){
						startList[j](ev);
					}
				}
				dragExecuted = true;
			}
		});
		this.addMouseUp(function(e) {
			if(that.isDragging && dragExecuted){
				var list = that.dragStop,
					end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart);
				for(var i=0; i<list.length; i++){
					list[i](ev);
				}
			}
			that.isDragging = false;
			dragExecuted = false;
		});
		this.addMouseOut(function(e) {
			if(that.isDragging && dragExecuted){
				var list = that.dragStop,
					end = new Grape2D.Vector(e.getRaw().pageX, e.getRaw().pageY),
					ev = new Grape2D.InputManagerDragEvent(e.getRaw(), that.dragStart);
				for(var i=0; i<list.length; i++){
					list[i](ev);
				}
			}
			that.isDragging = false;
			dragExecuted = false;
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
	 * Adds a callback to be executed after the drag event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addDragStart: function(callback) {
		this.dragStartClbk.push(callback);
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
	 * Adds a callback to be executed after the drag event.
	 *
	 * @param  {!Function} callback Callback function.
	 * @public
	 */
	addDragStop: function(callback) {
		this.dragStop.push(callback);
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
 *   are two ways to define the scale. This method is one, the other
 *   is defined it directly in the transformation. If the two are set,
 *   then the two are applied.
 * @param {!Grape2D.Vector=} options.lookAt Defines the (center)
 *   position, to where the camera is looking at.
 * @param {!Grape2D.Matrix=} options.projection Transformation
 *   matrix to be applied to the object coordinates.
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
	 * The projection matrix to apply to the object coordinates.
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.projection = options.projection || new Grape2D.Matrix();

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
	 * Gets the camera projection.
	 *
	 * @return {!Grape2D.Matrix} Camera projection.
	 * @public
	 */
	getProjection: function(){
		return this.projection;
	},
	/**
	 * Computes the matrix for better performances.
	 *
	 * @protected
	 */
	computeMatrix: function() {
		this.cM.setFromMatrix(this.projection);
		this.cM.scale(this.scale.getX(), this.scale.getY());
		this.icM = this.cM.clone().invert();
	},
	/**
	 * Applies the projection, on a vector in the World Coordinate
	 * System (WCS), to get a vector in the Viewport (Renderer)
	 *   Coordinate System (VSC).
	 *
	 * @param  {!Grape2D.Vector} vector Vector in the WCS.
	 * @param  {!Grape2D.Matrix=} modelView Model view matrix. If it's
	 *   passed, it will be multiplied by the cameraMatrix and by the
	 *   vector to transform to the viewport coordinate system.
	 * @return {!Grape2D.Vector} A vector in the VCS.
	 * @public
	 */
	wcsToVcs: function(vector, modelView) {
		if(modelView){
			return this.cM.multiplyByMatrix(modelView).multiplyByVector(vector.clone().sub(this.getLookAt()));
		}else{
			return this.cM.multiplyByVector(vector.clone().sub(this.getLookAt()));
		}
	},
	/**
	 * Applies the projection, on a vector in the Viewport Coordinate
	 * System (VCS), to get a vector in the World Coordinate System (WSC).
	 *
	 * @param  {!Grape2D.Renderer} renderer The viewport.
	 * @param  {!Grape2D.Vector} vector Vector in the VCS.
	 * @return {!Grape2D.Vector} A vector in the WCS
	 * @public
	 */
	vcsToWcs: function(renderer, vector) {
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
	 * @param  {!Grape2D.Vector} position Look at position.
	 * @public
	 */
	setLookAt: function(position) {
		this.lookAt.set(position);
	},
	/**
	 * Gets the center position to where the camera is looking at.
	 *
	 * @return {!Grape2D.Vector} The look at.
	 * @public
	 */
	getLookAt: function() {
		return this.lookAt;
	},
	/**
	 * Gets the current scale. Scale defined in the projection is
	 * not taken into account.
	 *
	 * @return {!Grape2D.Vector} Scale
	 */
	getScale: function() {
		return this.scale;
	},
	/**
	 * Creates a shape, based on the camera projection and renderer
	 *   properties.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer.
	 * @return {!Grape2D.Shape} A bounding volume representing the
	 *   camera view region.
	 * @public
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
 * Camera that follows an {@link Grape2D.IEntity}, this means that
 *   the camera is always looking at the object (the lookAt property
 *   is the same as the object).
 *
 * @param  {!Object} options Setup options. See {@link Grape2D.Camera}
 * @param  {!Grape2D.IEntity} options.entityToFollow Object to be
 *   followed by the camera.
 * @extends {Grape2D.Camera}
 * @constructor
 */
Grape2D.FollowingCamera = function(options){
	Grape2D.Camera.call(this, options);
	/**
	 * Entity to follow.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.entityToFollow = options.entityToFollow;
};
Grape2D.FollowingCamera.prototype = Object.create(Grape2D.Camera.prototype);
/**
 * @override
 */
Grape2D.FollowingCamera.prototype.getLookAt = function(){
	return this.entityToFollow.getPosition();
};
/**
 * Gets the object to follow.
 *
 * @return {!Grape2D.IEntity} Object that is following.
 * @public
 */
Grape2D.FollowingCamera.prototype.getEntityToFollow = function(){
	return this.entityToFollow;
};
/**
 * Sets the object to follow.
 *
 * @param  {!Grape2D.IEntity} fo Object to follow.
 * @public
 */
Grape2D.FollowingCamera.prototype.setEntityToFollow = function(fo){
	this.entityToFollow = fo;
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
	 * @param  {!Grape2D.IEntity} obj2d - The object to e added.
	 * @public
	 */
	add: function(obj2d){},
	/**
	 * Removes an object from the map.
	 *
	 * @param  {!Grape2D.IEntity} obj2d - The object to remove.
	 * @public
	 */
	remove: function(obj2d){},
	/**
	 * Query the shape region, in this map.
	 *
	 * @param  {!Grape2D.Shape} shape - The shape to query.
	 * @return {!Array.<Grape2D.IEntity>} All the objects inside the shape.
	 * @public
	 */
	query: function(shape){},
	/**
	 * Query the point in this map.
	 *
	 * @param  {!Grape2D.Vector} vector - The vector to query.
	 * @return {!Array.<Grape2D.IEntity>} All objects that contains the point.
	 * @public
	 */
	queryPoint: function(vector){},
	/**
	 * Queries a ray against the map.
	 *
	 * @param  {!Grape2D.Vector} start Ray start position
	 * @param  {!Grape2D.Vector} direction Direction of the ray
	 * @param  {!number} length Maximum length of the ray.
	 * @return {?Grape2D.IEntity} Object that first encounters the ray.
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
 *   that just implements a simple array to store entities.
 *
 * @implements {Grape2D.Map}
 * @constructor
 */
Grape2D.SimpleMap = function() {
	/**
	 * Entities of the map.
	 *
	 * @type {!Array.<Grape2D.IEntity>}
	 * @private
	 */
	this.entities = [];
};

Grape2D.SimpleMap.prototype = Object.create(Grape2D.Map);

/**
 * @override
 */
Grape2D.SimpleMap.prototype.add = function(entity) {
	this.entities.push(entity);
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.remove = function(entity) {
	this.entities.splice(this.entities.indexOf(entity), 1);
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.query = function(region) {
	return this.entities;
};
/**
 * Not implemented.
 * @override
 */
Grape2D.SimpleMap.prototype.queryPoint = function(vector) {
	return this.entities;
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
	this.entities = [];
};
/**
 * @override
 */
Grape2D.SimpleMap.prototype.update = function(dt, scene) {
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].update(dt, scene);
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
	}) > 0 && Grape2D.Math.overlaps({
		min: aabb1.getMinY(),
		max: aabb1.getMaxY()
	}, {
		min: aabb2.getMinY(),
		max: aabb2.getMaxY()
	}) > 0;
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
	var axisList = Grape2D.SATUtils.computePolygonAxis(polygon);
	var vertexList = polygon.getComputedVertexList();
	for (var i = 0; i < vertexList.length; i++) {
		axisList.push(circle.getPosition().clone().sub(vertexList[i]).normalize());
	}

	var polyInterval = Grape2D.SATUtils.computeIntervals(vertexList, axisList);
	var circleInterval = [];
	for (i = 0; i < axisList.length; i++) {
		circleInterval.push({
			min: circle.getPosition().dot(axisList[i]) - circle.getRadius(),
			max: circle.getPosition().dot(axisList[i]) + circle.getRadius()
		});
	}
	for (i = 0; i < polyInterval.length; i++) {
		var overlaps = Grape2D.Math.overlaps(polyInterval[i], circleInterval[i]);
		if (overlaps < 0) {
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
 * {@link http://demonstrations.wolfram.com/AnEfficientTestForAPointToBeInAConvexPolygon/}
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsPoint = function(polygon, point) {
	//debugger;
	var list = polygon.getComputedVertexList(),
		tVertex = [],
		i, n;

	for (i = 0; i < list.length; i++) {
		tVertex.push(list[i].clone().sub(point));
	}
	for (i = 0, n = 0; i < tVertex.length; i++) {
		n = (i + 1) % tVertex.length;
		if ((tVertex[n].getX() * tVertex[i].getY() - tVertex[i].getX() * tVertex[n].getY()) < 0) {
			return false;
		}
	}
	return true;
	/*
	//tVertex.push(list[0].clone().sub(point));
	for (i = 0, n = 0; i < tVertex.length; ++i) {
		n = (i + 1) % tVertex.length;
		//if (n > 0) {
			tVertex.push(list[n].clone().sub(point));
		//}
		if ((tVertex[n].getX() * tVertex[i].getY() - tVertex[i].getX() * tVertex[n].getY())>0) {
			return false;
		}
	}
	return true;*/
};
/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsRay = function(polygon, ray) {
	return false;
};
/**
 * SATUtils.
 *
 * @class
 */
Grape2D.SATUtils = {
	/**
	 * Select all unique, non parallel axis, from two list of axis.
	 *
	 * @param  {!Array.<!Grape2D.Vector>} listA List of axis.
	 * @param  {!Array.<!Grape2D.Vector>} listB List of axis.
	 * @return {!Array.<!Grape2D.Vector>} List with all different axis.
	 * @public
	 * @static
	 */
	selectAxis: function(listA, listB) {
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
	},
	/**
	 * Computes all polygon axis.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to compute the axis.
	 * @return {!Array.<!Grape2D.Vector>} List of axis of the polygon,
	 *   multiple equivalent axis (parallel) may be returned.
	 * @public
	 * @static
	 */
	computePolygonAxis: function(polygon) {
		var res = [],
			list = polygon.getComputedVertexList(),
			n, i;
		for (i = 0; i < list.length; i++) {
			n = (i + 1) % list.length;
			res.push(Grape2D.Vector.createFromPoints(list[i], list[n]).normalize().rightNormal());
		}
		return res;
	},
	/**
	 * Computes the intervals of a set of vertex, against a list of
	 *   axis. The result is a set of intervals, where the same index
	 *   of an interval corresponds to the index of the axis
	 *   correspondent to that interval.
	 * 
	 *
	 * @param  {!Array.<!Grape2D.Vector>} vertexList Vertex list to
	 *   compute the intervals.
	 * @param  {!Array.<!Grape2D.Vector>} axis Axis list to compile the
	 *   vertex against.
	 * @return {!Array.<!Object.<!string, !number>>} And object with the
	 *   interval representation. With two properties, min and max,
	 *   representing respectively the lower and the upper bound of the
	 *   interval.
	 * @public
	 * @static
	 */
	computeIntervals: function(vertexList, axis) {
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
	}
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
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[1].setX(aabb.getMaxX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[1].setY(aabb.getMinY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[2].setX(aabb.getMaxX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[2].setY(aabb.getMaxY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[3].setX(aabb.getMinX());
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
	 * @param  {!(Grape2D.IShape|Grape2D.Vector|Grape2D.Ray)} a Shape to test.
	 * @param  {!(Grape2D.IShape|Grape2D.Vector|Grape2D.Ray)} b Shape to collide with the first
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
	 * @param  {!(Grape2D.IShape|Grape2D.Vector)} a Shape or point
	 * @param  {!(Grape2D.IShape|Grape2D.Vector)} b Another shape or point
	 * @return {!boolean} Result of the collision test.
	 * @public
	 * @static
	 */
	collide: function(a, b){
		return Grape2D.CollisionDispatcher.dispatch(Grape2D.CollisionCheckerSingleton.instance, a, b);
	}
};
/**
 * CollisionResolver class.
 *
 * @constructor
 */
Grape2D.CollisionResolver = function() {};

Grape2D.CollisionResolver.prototype = {
	constructor: Grape2D.CollisionResolver,
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.AABB}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.AABB}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsAabb: function(m) {
		var a = m.getA(),
			b = m.getB(),
			n = b.getPosition().clone().sub(a.getPosition()),
			abox = a.getBoundingBox(),
			bbox = b.getBoundingBox(),
			aExtent = (abox.getMaxX() - abox.getMinX()) / 2,
			bExtent = (bbox.getMaxX() - bbox.getMinX()) / 2,
			xOverlap = aExtent + bExtent - Grape2D.Math.abs(n.getX());
		if (xOverlap >= 0) {
			aExtent = (abox.getMaxY() - abox.getMinY()) / 2;
			bExtent = (bbox.getMaxY() - bbox.getMinY()) / 2;
			var yOverlap = aExtent + bExtent - Grape2D.Math.abs(n.getY());
			if (yOverlap > 0) {
				if (xOverlap < yOverlap) {
					if (n.getX() < 0) {
						m.setNormal(new Grape2D.Vector(-1, 0));
					} else {
						m.setNormal(new Grape2D.Vector(1, 0));
					}
					m.setPenetration(xOverlap);
					return true;
				} else {
					if (n.getY() < 0) {
						m.setNormal(new Grape2D.Vector(0, -1));
					} else {
						m.setNormal(new Grape2D.Vector(0, 1));
					}
					m.setPenetration(yOverlap);
					return true;
				}
			}
		}
		return false;
	},
	//this method is still incongruent with the collision checker
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.Circle}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Circle}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsCircle: function(m) {
		var a = m.getA().getBoundingBox(),
			b = m.getB().getBoundingBox(),
			n = b.getPosition().clone().sub(a.getPosition()),
			closest = n.clone(),
			xExtent = a.getHalfWidth(),
			yExtent = a.getHalfHeight(),
			inside = false;
		closest.setX(Grape2D.Math.clamp(closest.getX(), -xExtent, xExtent));
		closest.setY(Grape2D.Math.clamp(closest.getY(), -yExtent, yExtent));
		if (n.equals(closest)) {
			inside = true;
			if (Grape2D.Math.abs(n.getX()) > Grape2D.Math.abs(n.getY())) {
				if (closest.getX() > 0) {
					closest.setX(xExtent);
				} else {
					closest.setX(-xExtent);
				}
			} else {
				if (closest.getY() > 0) {
					closest.setY(yExtent);
				} else {
					closest.setY(-yExtent);
				}
			}
		}

		var normal = n.clone().sub(closest);
		var d = normal.lengthSquared();
		var r = b.getRadius();

		if (d > (r * r) && !inside) {
			return false;
		}

		d = Grape2D.Math.sqrt(d);
		if (inside) {
			m.setNormal(normal.normalize().negate());
			m.setPenetration(r + d);
		} else {
			m.setNormal(normal.normalize());
			m.setPenetration(r - d);
		}

		return true;
	},
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.Polygon}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Polygon}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsPolygon: function(m) {
		var temp = m.getA().getBoundingBox();
		//var aabbAsPolygon = Grape2D.BVFactorySingleton.create(temp);
		var aabbAsPolygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(-temp.getHalfWidth(), -temp.getHalfHeight()),
				new Grape2D.Vector(temp.getHalfWidth(), -temp.getHalfHeight()),
				new Grape2D.Vector(temp.getHalfWidth(), temp.getHalfHeight()),
				new Grape2D.Vector(-temp.getHalfWidth(), temp.getHalfHeight())
			]
		});
		m.getA().setBoundingBox(aabbAsPolygon);
		var result = this.polygonVsPolygon(m);
		m.getA().setBoundingBox(temp);
		return result;
	},
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.Ray}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Ray}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsRay: function(m) {
		return false;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.AABB}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.AABB}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsAabb: function(m) {
		var result = this.aabbVsCircle(m.invert());
		m.invert();
		return result;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.Circle}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Circle}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsCircle: function(m) {
		var a = m.getA().getBoundingBox(),
			b = m.getB().getBoundingBox(),
			n = b.getPosition().clone().sub(a.getPosition()),
			r = a.getRadius() + b.getRadius();

		if (n.lengthSquared() > Grape2D.Math.sq(r)) {
			return false;
		}

		var d = n.length();
		if (d != 0) {
			m.setPenetration(r - d);
			m.setNormal(n.normalize());
		} else {
			m.setPenetration(a.getRadius());
			m.setNormal(new Grape2D.Vector(1, 0));
		}

		return true;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.Polygon}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Polygon}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsPolygon: function(m) {
		var polygon = /** @type {!Grape2D.Polygon} */ (m.getB().getBoundingBox());
		var circle = /** @type {!Grape2D.Circle} */ (m.getA().getBoundingBox());
		var axisList = Grape2D.SATUtils.computePolygonAxis(polygon);
		var vertexList = polygon.getComputedVertexList();
		for (var i = 0; i < vertexList.length; i++) {
			axisList.push(circle.getPosition().clone().sub(vertexList[i]).normalize());
		}
		var axis, min = Infinity;
		var polyInterval = Grape2D.SATUtils.computeIntervals(vertexList, axisList);
		var circleInterval = [];
		for (i = 0; i < axisList.length; i++) {
			circleInterval.push({
				min: circle.getPosition().dot(axisList[i]) - circle.getRadius(),
				max: circle.getPosition().dot(axisList[i]) + circle.getRadius()
			});
		}
		for (i = 0; i < polyInterval.length; i++) {
			var overlaps = Grape2D.Math.overlaps(polyInterval[i], circleInterval[i]);
			if (overlaps < 0) {
				return false;
			}
			if (min > overlaps) {
				axis = axisList[i];
				min = overlaps;
			}
		}
		m.setPenetration(min);
		m.setNormal(axis.negate());
		return true;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.Ray}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Ray}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsRay: function(m) {
		return false;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.AABB}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.AABB}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsAabb: function(m) {
		var result = this.aabbVsPolygon(m.invert());
		m.invert();
		return result;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.Circle}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Circle}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsCircle: function(m) {
		var result = this.circleVsPolygon(m.invert());
		m.invert();
		return result;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.Polygon}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Polygon}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsPolygon: function(m) {
		var polygon1 = /** @type {!Grape2D.Polygon} */ (m.getA().getBoundingBox());
		var polygon2 = /** @type {!Grape2D.Polygon} */ (m.getB().getBoundingBox());
		var pa1 = Grape2D.SATUtils.computePolygonAxis(polygon1);
		var pa2 = Grape2D.SATUtils.computePolygonAxis(polygon2);
		var axisList = Grape2D.SATUtils.selectAxis(pa1, pa2),
			p1Intv = Grape2D.SATUtils.computeIntervals(polygon1.getComputedVertexList(), axisList),
			p2Intv = Grape2D.SATUtils.computeIntervals(polygon2.getComputedVertexList(), axisList),
			overlap, axis;

		var min = Infinity;
		for (var i = 0; i < axisList.length; i++) {
			overlap = Grape2D.Math.overlaps(p1Intv[i], p2Intv[i]);
			if (overlap < 0) {
				return false;
			}
			if (min > overlap) {
				axis = axisList[i];
				min = overlap;
			}
		}
		m.setPenetration(min);
		if (axis.dot(polygon2.getPosition().clone().sub(polygon1.getPosition())) < 0) {
			axis.negate();
		}
		m.setNormal(axis);
		return true;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.Ray}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Ray}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsRay: function(m) {
		return false;
	}
};
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
/**
 * ManifoldDispatcher class.
 *
 * @class
 */
Grape2D.ManifoldDispatcher = {
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.AABB}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsAabb: function(solver, m) {
		return solver.aabbVsAabb(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Circle}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsCircle: function(solver, m) {
		return solver.aabbVsCircle(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Polygon}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsPolygon: function(solver, m) {
		return solver.aabbVsPolygon(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Ray}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsRay: function(solver, m) {
		return solver.aabbVsRay(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.AABB}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsAabb: function(solver, m) {
		return solver.circleVsAabb(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Circle}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsCircle: function(solver, m) {
		return solver.circleVsCircle(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Polygon}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsPolygon: function(solver, m) {
		return solver.circleVsPolygon(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Ray}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsRay: function(solver, m) {
		return solver.circleVsRay(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.AABB}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsAabb: function(solver, m) {
		return solver.polygonVsAabb(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Circle}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsCircle: function(solver, m) {
		return solver.polygonVsCircle(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Polygon}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsPolygon: function(solver, m) {
		return solver.polygonVsPolygon(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Ray}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsRay: function(solver, m) {
		return solver.polygonVsRay(m);
	},
	/**
	 * Jump table.
	 *
	 * @type {!Object.<!string, !Object.<!string, function(*, !Grape2D.Manifold):boolean>>}
	 * @public
	 * @static
	 */
	dcache: {},
	/**
	 * Dispatches a collision, through the jump table,
	 *   selecting the right method to collide the
	 *   {@link Grape2D.Shape}s, in the manifold.
	 *
	 * @param  {*} solver Solver.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @public
	 */
	dispatch: function(solver, m) {
		return Grape2D.ManifoldDispatcher.dcache[m.getA().getBoundingBox().getStaticType()][m.getB().getBoundingBox().getStaticType()](solver, m);
	}
};

Grape2D.ManifoldDispatcher.dcache = {
	"AABB": {
		"AABB": Grape2D.ManifoldDispatcher.aabbVsAabb,
		"Circle": Grape2D.ManifoldDispatcher.aabbVsCircle,
		"Polygon": Grape2D.ManifoldDispatcher.aabbVsPolygon,
		"Ray": Grape2D.ManifoldDispatcher.aabbVsRay
	},
	"Circle": {
		"AABB": Grape2D.ManifoldDispatcher.circleVsAabb,
		"Circle": Grape2D.ManifoldDispatcher.circleVsCircle,
		"Polygon": Grape2D.ManifoldDispatcher.circleVsPolygon,
		"Ray": Grape2D.ManifoldDispatcher.circleVsRay
	},
	"Polygon": {
		"AABB": Grape2D.ManifoldDispatcher.polygonVsAabb,
		"Circle": Grape2D.ManifoldDispatcher.polygonVsCircle,
		"Polygon": Grape2D.ManifoldDispatcher.polygonVsPolygon,
		"Ray": Grape2D.ManifoldDispatcher.polygonVsRay
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
 * @param  {?Array.<Grape2D.IEntity>} objs List with objects. If objects are provided then tree will be build.
 *
 * @implements {Grape2D.BVHTree}
 * @constructor
 */
Grape2D.TopDownBVHTree = function(objs) {
	/**
	 * Objects of the tree
	 * @type {!Array.<Grape2D.IEntity>}
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
 * @param  {?Grape2D.TopDownBVHNode} parent Parent node, or null, it
 *   it's the root node.
 * @param  {!Array.<Grape2D.IEntity>} entities Entities to be added to
 *   the node.
 *
 * @constructor
 */
Grape2D.TopDownBVHNode = function(parent, entities) {
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
	 * Entities of a leaf.
	 *
	 * @type {!Array.<Grape2D.IEntity>}
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
	this.compute(entities);
};

Grape2D.TopDownBVHNode.prototype = {
	constructor: Grape2D.TopDownBVHNode,
	/**
	 * Makes this instance a leaf or a node.
	 *
	 * @param  {!Array.<Grape2D.IEntity>} objects List of objects
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
	 * @return {!Array.<Grape2D.IEntity>} List of the objects.
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
	 *   If so, returns the {@see Grape2D.IEntity} that are colliding with
	 *   the shape.
	 *
	 * @param  {!(Grape2D.Shape|Grape2D.Vector)} shape Shape of to query.
	 * @return {!Array.<Grape2D.IEntity>} Objects that are colliding with
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
 * A BVH Strategy is used to sort and divide entities according to a 
 *   set of rules.
 *
 * @class
 * @interface
 */
Grape2D.BVHStrategy = function(){};
Grape2D.BVHStrategy.prototype = {
	constructor: Grape2D.BVHStrategy,
	/**
	 * Applies the strategy to the a set of entities.
	 *
	 * @param  {!Array.<Grape2D.IEntity>} entities List of entities to
	 *   separate.
	 * @return {!Object} An object with left and right properties,
	 *   each property is an array, that contains
	 *   {@link Grape2D.IEntity} or are empty.
	 * @public
	 */
	solve: function(entities){}
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
		temp = objects[i].getBoundingBox().getPosition();
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
			temp = objects[i].getBoundingBox().getPosition();
			if (temp.getX() > axis) {
				result.right.push(objects[i]);
			} else {
				result.left.push(objects[i]);
			}
		}
	} else {
		axis = minY + Grape2D.Math.abs((maxY - minY) / 2);

		for (i = 0; i < objects.length; i++) {
			temp = objects[i].getBoundingBox().getPosition();
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
	 * @type {!Grape2D.Canvas}
	 * @private
	 */
	this.buffer = new Grape2D.Canvas({
		width: this.width,
		height: this.height
	});
	/**
	 * WebGL buffer. This texture is only suitable to one WegGL context.
	 * It's planned the introduction of shared resources, then it will
	 *   be possile to support multiple WebGL renderers.
	 * This buffer starts <code>null</code>, and after the image loading should be an {@see WegGLTexture}. If the texture turns dirty again, it also should set to <code>null</code>
	 *
	 * @type {?WebGLTexture}
	 * @private
	 */
	this.glBuffer = null;
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
 * Sets the width.
 *
 * @param  {!number} width New width.
 * @public
 */
Grape2D.Texture.prototype.setWidth = function(width) {
	this.width = width;
	this.hwidth = this.width / 2;
};
/**
 * Sets the height.
 *
 * @param  {!number} height New height.
 * @public
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
	return this.buffer.canvas;
};

Grape2D.Texture.prototype.getGlBuffer = function() {
	return this.glBuffer;
};

Grape2D.Texture.prototype.setGlBuffer = function(buffer) {
	this.glBuffer = buffer;
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

	this.buffer = new Grape2D.Canvas({
		width: this.width,
		height: this.height
	}).drawImage(image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
	this.glBuffer = null;
};
/**
 * @override
 */
Grape2D.Texture.prototype.render = function(renderer, camera) {
	renderer.renderTexture(this, camera);
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
	image.crossOrigin = "Anonymous";

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
 * Text's interface.
 * 
 * @extends {Grape2D.ITexture}
 * @class
 * @interface
 */
Grape2D.IText = function(){
	Grape2D.ITexture.call(this);
};
Grape2D.IText.prototype = Object.create(Grape2D.ITexture.prototype);
/**
 * Gets text string.
 *
 * @return {!string} Text string.
 * @public
 */
Grape2D.IText.prototype.getText = function(){};
/**
 * Sets the text string.
 *
 * @param {!string} text Text string.
 * @public
 */
Grape2D.IText.prototype.setText = function(text){};
/**
 * Gets text color.
 *
 * @return {!Grape2D.Color} Text color.
 * @public
 */
Grape2D.IText.prototype.getColor = function(){};
/**
 * Sets the text color.
 *
 * @param {!Grape2D.Color} color Text color.
 * @public
 */
Grape2D.IText.prototype.setColor = function(color){};
/**
 * Sets text size.
 *
 * @return {!number} Text size.
 * @public
 */
Grape2D.IText.prototype.getSize = function(){};
/**
 * Sets the text size.
 *
 * @param {!number} size Text size.
 * @public
 */
Grape2D.IText.prototype.setSize = function(size){};
/**
 * Sets text font.
 *
 * @return {!string} Text font.
 * @public
 */
Grape2D.IText.prototype.getFont = function(){};
/**
 * Gets text font.
 *
 * @param {!string} font Text font.
 * @public
 */
Grape2D.IText.prototype.setFont = function(font){};
/**
 * Represents text to be rendered.
 * This is class stores the text, a style, and a
 *   {@see Grape2D.Texture} as it's buffer. Then at rendering time, 
 *   the heavy work is has been done. However performance issues 
 *   will be noted if at every frame the text is changed, because it
 *   will be needed to rebuild both the Canvas and the WebGL Buffer.
 *
 * @param {!Object} options Setup arguments.
 * @param {!string} options.text Initial text.
 * @param {!Grape2D.Vector=} options.position Texture position.
 * @param {!number} options.size Text size, in px.
 * @param {!string} options.font Text font.
 *
 * @implements {Grape2D.ITexture}
 * @constructor
 */
Grape2D.Text = function(options) {
	/**
	 * Text string.
	 *
	 * @type {!string}
	 * @private
	 */
	this.text = options.text || "";
	/**
	 * Top left position of the text.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector();
	if(options.position){
		this.setPosition(options.position);
	}
	/**
	 * Text buffer.
	 *
	 * @type {!Grape2D.Texture}
	 * @private
	 */
	this.buffer = new Grape2D.Texture();
	/**
	 * Text size.
	 *
	 * @type {!number}
	 * @private
	 */
	this.size = options.size || 10;
	/**
	 * Text font.
	 *
	 * @type {!string}
	 * @private
	 */
	this.font = options.font || "sans-serif";
	/**
	 * Text color.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = options.color || new Grape2D.Color();
	this.refreshBuffer();
};
Grape2D.Text.prototype = Object.create(Grape2D.IText.prototype);
/**
 * Gets the text.
 *
 * @return {!string} Text string.
 * @public
 */
Grape2D.Text.prototype.getText = function(){
	return this.text;
};
/**
 * Gets text rendering position.
 *
 * @return {!Grape2D.Vector} Start rendering position.
 * @public
 */
Grape2D.Text.prototype.getPosition = function(){
	return this.position;
};
/**
 * Gets the text buffer.
 *
 * @return {!Grape2D.Texture} Text buffer.
 * @public
 */
Grape2D.Text.prototype.getBuffer = function(){
	return this.buffer;
};
/**
 * @override
 */
Grape2D.Text.prototype.getWidth = function(){
	return this.buffer.getWidth();
};
/**
 * @override
 */
Grape2D.Text.prototype.getHeight = function(){
	return this.buffer.getHeight();
};
/**
 * @override
 */
Grape2D.Text.prototype.getHalfWidth = function(){
	return this.buffer.getHalfWidth();
};
/**
 * @override
 */
Grape2D.Text.prototype.getHalfHeight = function(){
	return this.buffer.getHalfHeight();
};
/**
 * Sets text. Computes the buffer. 
 *
 * @param {!number} text Text to set.
 * @public
 */
Grape2D.Text.prototype.setText = function(text){
	this.text = text;
	this.refreshBuffer();
};
/**
 * Refresh text buffer.
 *
 * @private
 */
Grape2D.Text.prototype.refreshBuffer = function(){
	var lines = this.text.split("\n"),
		width = -Infinity,
		buffer = this.buffer.buffer;

	buffer.clear();
	buffer.setFont(this.size+"px "+this.font);
	for(var l=0, line; line=lines[l++];){
		width = Math.max(buffer.measureText(line).width, width);
	}
	width = Grape2D.Math.nextPowerOfTwo(width);
	var h = Grape2D.Math.nextPowerOfTwo(lines.length*this.size*1.2);
	buffer.setWidth(width);
	this.buffer.setWidth(width);
	buffer.setHeight(h);
	this.buffer.setHeight(h);

	buffer.setFont(this.size+"px "+this.font);
	buffer.setFillStyle(this.color);
	buffer.setStrokeStyle(this.color);

	for(l=0; line=lines[l++];){
		buffer.fillText(line, 0, l*this.size);
	}
};
/**
 * Sets text's position.
 *
 * @param {!Grape2D.Vector} position Text new position.
 * @public
 */
Grape2D.Text.prototype.setPosition = function(position){
	this.position.set(position);
};
/**
 * Sets text color.
 *
 * @param {!Grape2D.Color} color Color of the text.
 * @public
 */
Grape2D.Text.prototype.setColor = function(color){
	this.color.set(color);
	this.refreshBuffer();
};
/**
 * Gets text's color.
 *
 * @return {!Grape2D.Color} Text color.
 * @public
 */
Grape2D.Text.prototype.getColor = function(){
	return this.color;
};
/**
 * Sets text size.
 *
 * @param {!number} size Size of the text in pixels.
 * @public
 */
Grape2D.Text.prototype.setSize = function(size){
	this.size = size;
	this.refreshBuffer();
};
/**
 * Gets text's size.
 *
 * @return {!number} Text size.
 * @public
 */
Grape2D.Text.prototype.getSize = function(){
	return this.size;
};
/**
 * Sets text font.
 *
 * @param {!string} font Font of the text.
 * @public
 */
Grape2D.Text.prototype.setFont = function(font){
	this.font = font;
	this.refreshBuffer();
};
/**
 * Gets text's font.
 *
 * @return {!string} Text font.
 * @public
 */
Grape2D.Text.prototype.getFont = function(){
	return this.font;
};
/**
 * @override
 */
Grape2D.Text.prototype.render = function(renderer){
	renderer.renderText(this);
};
/**
 * Gets the text size. This is an experimental method.
 *
 * @param  {!string} text Text string.
 * @param  {!string} font Font of the text.
 * @return {!Object.<!string, !number>} Object with width and height properties, those of the text.
 * @public
 * @static
 */
Grape2D.Text.getTextSize = function(text, font){
	text = text.replace("\n", "<br>");
	var elm = document.createElement("span");
	elm.innerHTML = text;
	elm.style.font = font;
	elm.hidden = true;
	document.body.appendChild(elm);
	document.body.removeChild(elm);
	return {
		width: elm.offsetWidth,
		height: elm.offsetHeight
	};
};
/**
 * Text, where it's position relative to the renderer.
 *
 * @param {!Object} options Setup options.
 * @implements {Grape2D.IText}
 * @constructor
 */
Grape2D.AbsoluteText = function(options){
	Grape2D.IText.call(this);
	this.text = new Grape2D.Text(options);
};
Grape2D.AbsoluteText.prototype = Object.create(Grape2D.IText.prototype);
Grape2D.AbsoluteText.prototype.getText = function(){
	return this.text.getText();
};
Grape2D.AbsoluteText.prototype.setText = function(text){
	this.text.setText(text);
};

Grape2D.AbsoluteText.prototype.getColor = function(){
	return this.text.getColor();
};
Grape2D.AbsoluteText.prototype.setColor = function(color){
	this.text.setColor(color);
};

Grape2D.AbsoluteText.prototype.getSize = function(){
	return this.text.getSize();
};
Grape2D.AbsoluteText.prototype.setSize = function(size){
	this.text.getSize(size);
};

Grape2D.AbsoluteText.prototype.getFont = function(){
	return this.text.getFont();
};
Grape2D.AbsoluteText.prototype.setFont = function(font){
	this.text.setFont(font);
};

Grape2D.AbsoluteText.prototype.getWidth = function(){
	return this.text.getWidth();
};
Grape2D.AbsoluteText.prototype.setWidth = function(width){
	this.text.setWidth(width);
};
Grape2D.AbsoluteText.prototype.getHeight = function(){
	return this.text.getHeight();
};
Grape2D.AbsoluteText.prototype.setHeight = function(height){
	this.text.setHeight(height);
};

Grape2D.AbsoluteText.prototype.getHalfWidth = function(){
	return this.text.getHalfWidth();
};
Grape2D.AbsoluteText.prototype.getHalfHeight = function(){
	return this.text.getHalfHeight();
};

Grape2D.AbsoluteText.prototype.getPosition = function(){
	return this.text.getPosition();
};
Grape2D.AbsoluteText.prototype.setPosition = function(vector){
	this.text.setPosition(vector);
};
Grape2D.AbsoluteText.prototype.getBuffer = function(){
	return this.text.getBuffer();
};
Grape2D.AbsoluteText.prototype.render = function(renderer){
	renderer.renderAbsoluteText(this);
};
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
	renderer.start(camera);
	for (var i = 0; i < elms.length; i++) {
		elms[i].render(renderer);
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
	this.fpsText = new Grape2D.AbsoluteText({
		text: "0 fps"
	});
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
	this.fpsText.setText(this.clock.getFps()+" fps"+(this.clock.getFrameCount()%5?"+":""));
	this.fpsText.render(this.renderer);
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
			this.ws.send(msg);
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
	 * @param {function(number):string} pingEncoder Function that
	 *   encodes the ping message.
	 * @public
	 */
	ping: function(pingEncoder) {
		this.pingStop = true;
		this.pingAc = 0;
		this.syncAc = 0;
		this.pongSamplesReceived = 0;
		var that = this,
			fn = function() {
				that.ws.send(pingEncoder(new Date().getTime()));
			};
		for (var i = this.pingSamples; i > 0; i--) {
			setTimeout(fn, 20 * i);
		}
	},
	/**
	 * Sends back a pong message.
	 *
	 * @param  {!function(string, number)} pongEncoder Function that
	 *   encodes the pong function.
	 * @param  {!string} message Ping message, received.
	 * @public
	 */
	pong: function(pongEncoder, message) {
		this.ws.send(pongEncoder(message, this.syncClock.getTime()));
	},
	/**
	 * Pong message handler. This is used to calculate the ping
	 *   and synchronize the clock with the server.
	 *
	 * @param  {!number} t1 Request time.
	 * @param  {!number} t2 Request receiving time.
	 * @param  {!number} t4 Pong message time.
	 * @public
	 */
	pongReceived: function(t1, t2, t4) {
		var t3 = t2,
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
 * Dispatches JSON messages, according with a property.
 *
 * @param {!string} property Property to differentiate when
 *   selecting the dispatcher.
 *
 * @extends {Grape2D.utils.MessageDispatcher}
 * @constructor
 */
Grape2D.utils.JSONMessageDispatcher = function(property) {
	Grape2D.utils.MessageDispatcher.call(this);
	this.property = property;
};

Grape2D.utils.JSONMessageDispatcher.prototype = Object.create(Grape2D.utils.MessageDispatcher.prototype);
/**
 * @override
 */
Grape2D.utils.JSONMessageDispatcher.prototype.dispatch = function(message, param) {
	var parsed, current, testP;
	try {
		parsed = JSON.parse(message);
		testP = parsed[this.property];
	} catch (e) {
		return;
	}
	for (var i = 0; i < this.stack.length; i++) {
		current = this.stack[i];
		if (current.regex.test(testP)) {
			this.stack[i].callback(parsed, param);
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
/**
 * @class
 * @interface
 */
Grape2D.ISoundManager = function(){};
Grape2D.ISoundManager.prototype = {
	constructor: Grape2D.ISoundManager
};
/**
 * @implements {Grape2D.ISoundManager}
 * @constructor
 */
Grape2D.SoundManager = function(){
	/**
	 * Audio context.
	 *
	 * @type {?AudioContext}
	 * @private
	 */
	this.audioContext = null;
	if(typeof Grape2D.WINDOW.AudioContext != "undefined"){
		this.audioContext = new Grape2D.WINDOW.AudioContext();
	}else if(typeof Grape2D.WINDOW.webkitAudioContext != "undefined"){
		this.audioContext = new Grape2D.WINDOW.webkitAudioContext();
	}
};
Grape2D.SoundManager.prototype = Object.create(Grape2D.ISoundManager.prototype);
Grape2D.SoundManager.prototype.getContext = function(){
	return this.audioContext;
};
Grape2D.SoundManager.prototype.getInstance = function(){
	return this.audioContext;
};
Grape2D.SoundManager.prototype.getDestination = function(){
	return this.audioContext.destination;
};
Grape2D.SoundManagerSingleton = {
	instance: new Grape2D.SoundManager(),
	getInstance: function(){
		return Grape2D.SoundManagerSingleton.instance;
	},
	getContext: function(){
		return Grape2D.SoundManagerSingleton.instance.getContext();
	},
	getDestination: function(){
		return Grape2D.SoundManagerSingleton.instance.getDestination();
	}
};
/**
 * Sound input/output interface.
 *
 * @class
 * @interface
 */
Grape2D.SoundIO = function(){};
Grape2D.SoundIO.prototype = {
	constructor: Grape2D.SoundIO,
	/**
	 * Connect this sound output to a valid input node.
	 *
	 * @param  {!(Grape2D.SoundIO|Grape2D.SoundManager|AudioDestinationNode)} connectTo Input to connect this output.
	 * @public
	 */
	connect: function(connectTo) {},
	/**
	 * Gets destination (output) of the sound.
	 *
	 * @return {!AudioDestinationNode} Audio destination.
	 * @public
	 */
	getDestination: function() {}
};
/**
 * Interface for a sound.
 * A sound only have an output and no inputs.
 * 
 * @class
 * @interface
 */
Grape2D.ISound = function() {};
Grape2D.ISound.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Connect this sound output to a valid input node.
 *
 * @param  {!(Grape2D.SoundIO|Grape2D.SoundManager|AudioDestinationNode)} connectTo Input to connect this output.
 * @public
 */
Grape2D.ISound.prototype.connect = function(connectTo) {};
/**
 * Plays a sound.
 *
 * @public
 */
Grape2D.ISound.prototype.play = function(when, offset, duration){};
/**
 * Stop a sound.
 *
 * @public
 */
Grape2D.ISound.prototype.stop = function(){};
/**
 * Sound.
 *
 * @param {!AudioBuffer=} audioBuffer ArrayBuffer of the sound.
 * @implements {Grape2D.ISound}
 * @constructor
 */
Grape2D.Sound = function(audioBuffer){
	/**
	 * Sound source.
	 *
	 * @type {?AudioBufferSourceNode}
	 * @private
	 */
	this.soundSource = null;
	/**
	 * Sound duration.
	 *
	 * @type {!number}
	 * @private
	 */
	this.duration = 0;
	/**
	 * Sound buffer.
	 *
	 * @type {?AudioBuffer}
	 * @private
	 */
	this.buffer = null;
	if(audioBuffer){
		this.setBuffer(audioBuffer);
	}
	/**
	 * Output of the sound.
	 *
	 * @type {?(Grape2D.SoundIO|AudioDestinationNode)}
	 * @private
	 */
	this.connectingTo = null;
};
Grape2D.Sound.prototype = Object.create(Grape2D.ISound.prototype);
/**
 * Prepares the sound to be played.
 *
 * @public
 */
Grape2D.Sound.prototype.prepare = function(){
	this.soundSource = Grape2D.SoundManagerSingleton.getContext().createBufferSource();
	this.soundSource.buffer = this.buffer;
	if(this.connectingTo){
		this.soundSource.connect(this.connectingTo.getDestination());
	}
};
/**
 * @override
 */
Grape2D.Sound.prototype.play = function(when, offset, duration){
	this.prepare();
	this.soundSource.start(when || 0, offset || 0, duration || this.duration);
};
/**
 * @override
 */
Grape2D.Sound.prototype.stop = function(){
	this.soundSource.stop(0);
};
/**
 * Sets the buffer.
 *
 * @param {!AudioBuffer} buffer Audio buffer.
 * @public
 */
Grape2D.Sound.prototype.setBuffer = function(buffer){
	this.buffer = buffer;
	this.duration = Grape2D.Math.floorPositive(buffer.duration);
};
/**
 * @override
 */
Grape2D.Sound.prototype.connect = function(inputToOutput){
	this.connectingTo = inputToOutput;
	return this;
};
/**
 * Creates a sound from a file.
 *
 * @param  {!string} filePath Path to the file.
 * @param  {!function(!Grape2D.Sound)} callback Callback.
 * @return {!Grape2D.Sound} Empty sound.
 * @public
 * @static
 */
Grape2D.Sound.createFromFile = function(filePath, callback){
	var request = new XMLHttpRequest(),
		sound = new Grape2D.Sound();
	request.open("GET", filePath, true);
	request.responseType = "arraybuffer";
	request.onload = function(e){
		var context = Grape2D.SoundManagerSingleton.getContext();
		context.decodeAudioData(request.response, function(audioBuffer){
			sound.setBuffer(audioBuffer);
			if(callback){
				callback(sound);
			}
		});
	};
	request.send();
	return sound;
};
/**
 * Sound gain.
 *
 * @param {!number=} gain Gain.
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundGain = function(gain) {
	/**
	 * Gain node.
	 *
	 * @type {!GainNode}
	 * @private
	 */
	this.gain = Grape2D.SoundManagerSingleton.getContext().createGain();
	if(gain){
		this.setGain(gain);
	}
};
Grape2D.SoundGain.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Gets sound's gain.
 *
 * @return {!number} Gain value.
 * @public
 */
Grape2D.SoundGain.prototype.getGain = function() {
	return this.gain.gain.value;
};
/**
 * Sets sound's gain.
 *
 * @param {!number} gain Gain value.
 * @public
 */
Grape2D.SoundGain.prototype.setGain = function(gain) {
	this.gain.gain.value = gain;
};
/**
 * @override
 */
Grape2D.SoundGain.prototype.connect = function(toConnect) {
	this.gain.connect(toConnect.getDestination());
	return this;
};
/**
 * @override
 */
Grape2D.SoundGain.prototype.getDestination = function() {
	return this.gain;
};
/**
 * Delays a sound.
 *
 * @param {!number=} delayTime Delay time.
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundDelay = function(delayTime) {
	/**
	 * Delay node.
	 *
	 * @type {!DelayNode}
	 * @private
	 */
	this.delay = Grape2D.SoundManagerSingleton.getContext().createDelay(delayTime || 1);
	this.setDelay(delayTime || 1);
};
Grape2D.SoundDelay.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Gets sound's delay.
 *
 * @return {!number} Delay time.
 * @public
 */
Grape2D.SoundDelay.prototype.getDelay = function() {
	return this.delay.delayTime.value;
};
/**
 * Sets sound's delay.
 *
 * @param {!number} delay Delay time.
 * @public
 */
Grape2D.SoundDelay.prototype.setDelay = function(delay) {
	this.delay.delayTime.value = delay;
};
/**
 * @override
 */
Grape2D.SoundDelay.prototype.connect = function(toConnect) {
	this.delay.connect(toConnect.getDestination());
	return this;
};
/**
 * @override
 */
Grape2D.SoundDelay.prototype.getDestination = function() {
	return this.delay;
};
/**
 * Sound spatialization.
 *
 * @param {!Object=} options Setup options.
 * @param {!Grape2D.Vector} options.position Sound position.
 * @param {!Grape2D.Vector} options.velocity Sound velocity.
 * @param {!Grape2D.Vector} options.orientation Sound orientation.
 * @param {!string} options.panningModel Panning model.
 * @param {!string} options.distanceModel Distance model.
 * @param {!number} options.refDistance Reference distance.
 * @param {!number} options.maxDistance Maximum distance.
 * @param {!number} options.rolloffFactor Rolloff factor.
 * @param {!number} options.coneInnerAngle Cone inner angle.
 * @param {!number} options.coneOuterAngle Cone outer angle.
 * @param {!number} options.coneOuterGain Cone outer gain.
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundPanner = function(options) {
	/**
	 * Panner node.
	 *
	 * @type {!AudioPannerNode}
	 * @private
	 */
	this.panner = Grape2D.SoundManagerSingleton.getContext().createPanner();
	/**
	 * Position of the sound.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector();
	if(options.position) {
		this.setPosition(options.position);
	}
	/**
	 * Velocity of the sound.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.velocity = new Grape2D.Vector();
	if(options.velocity) {
		this.setVelocity(options.velocity);
	}
	/**
	 * Orientation of the sound.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.orientation = new Grape2D.Vector();
	if(options.orientation) {
		this.setOrientation(options.orientation);
	}

	if(options.panningModel) {
		this.setPanningModel(options.panningModel);
	}
	if(options.distanceModel) {
		this.setDistanceModel(options.distanceModel);
	}
	if(options.refDistance) {
		this.setRefDistance(options.refDistance);
	}
	if(options.maxDistance) {
		this.setMaxDistance(options.maxDistance);
	}
	if(options.rolloffFactor) {
		this.setRolloffFactor(options.rolloffFactor);
	}
	if(options.coneInnerAngle) {
		this.setConeInnerAngle(options.coneInnerAngle);
	}
	if(options.coneOuterAngle) {
		this.setConeOuterAngle(options.coneOuterAngle);
	}
	if(options.coneOuterGain) {
		this.setConeOuterGain(options.coneOuterGain);
	}
};
Grape2D.SoundPanner.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Get sound's position.
 *
 * @return {!Grape2D.Vector} Sound's position.
 * @public
 */
Grape2D.SoundPanner.prototype.getPosition = function() {
	return this.position;
};
/**
 * Sets sound position.
 *
 * @param {!Grape2D.Vector} position Sound's position.
 * @public
 */
Grape2D.SoundPanner.prototype.setPosition = function(position) {
	this.position.set(position);
	this.panner.setPosition(position.getX(), position.getY(), 0);
};
/**
 * Get sound's velocity.
 *
 * @return {!Grape2D.Vector} Sound's velocity.
 * @public
 */
Grape2D.SoundPanner.prototype.getVelocity = function() {
	return this.velocity;
};
/**
 * Sets sound velocity.
 *
 * @param {!Grape2D.Vector} velocity Sound's velocity.
 * @public
 */
Grape2D.SoundPanner.prototype.setVelocity = function(velocity) {
	this.velocity.set(velocity);
	this.panner.setVelocity(velocity.getX(), velocity.getY(), 0);
};
/**
 * Get sound's orientation.
 *
 * @return {!Grape2D.Vector} Sound's orientation.
 * @public
 */
Grape2D.SoundPanner.prototype.getOrientation = function() {
	return this.orientation;
};
/**
 * Sets sound orientation.
 *
 * @param {!Grape2D.Vector} orientation Sound's orientation.
 * @public
 */
Grape2D.SoundPanner.prototype.setOrientation = function(orientation) {
	this.velocity.set(orientation);
	this.panner.setOrientation(orientation.getX(), orientation.getY(), 0);
};
/**
 * Gets the panning model.
 *
 * @return {!string} Panning model.
 * @public
 */
Grape2D.SoundPanner.prototype.getPanningModel = function() {
	return this.panner.panningModel;
};
/**
 * Sets panning model.
 *
 * @param {!string} panningModel Panning model.
 * @public
 */
Grape2D.SoundPanner.prototype.setPanningModel = function(panningModel) {
	this.panner.panningModel = panningModel;
};
/**
 * Gets the distance model.
 *
 * @return {!string} Distance model.
 * @public
 */
Grape2D.SoundPanner.prototype.getDistanceModel = function() {
	return this.panner.distanceModel;
};
/**
 * Sets distance model.
 *
 * @param {!string} distanceModel Distance model.
 * @public
 */
Grape2D.SoundPanner.prototype.setDistanceModel = function(distanceModel) {
	this.panner.distanceModel = distanceModel;
};
/**
 * Gets the reference distance.
 *
 * @return {!number} Reference distance.
 * @public
 */
Grape2D.SoundPanner.prototype.getRefDistance = function() {
	return this.panner.refDistance;
};
/**
 * Sets the reference distance.
 *
 * @param {!number} refDistance Reference distance.
 * @public
 */
Grape2D.SoundPanner.prototype.setRefDistance = function(refDistance) {
	this.panner.refDistance = refDistance;
};
/**
 * Gets the maximum distance.
 *
 * @return {!number} Maximum distance.
 * @public
 */
Grape2D.SoundPanner.prototype.getMaxDistance = function() {
	return this.panner.maxDistance;
};
/**
 * Sets the maximum distance.
 *
 * @param {!number} maxDistance Maximum distance.
 * @public
 */
Grape2D.SoundPanner.prototype.setMaxDistance = function(maxDistance) {
	this.panner.maxDistance = maxDistance;
};
/**
 * Gets the rolloff distance.
 *
 * @return {!number} Rolloff distance.
 * @public
 */
Grape2D.SoundPanner.prototype.getRolloffFactor = function() {
	return this.panner.rolloffFactor;
};
/**
 * Sets the rolloff factor.
 *
 * @param {!number} rolloffFactor Rolloff factor.
 * @public
 */
Grape2D.SoundPanner.prototype.setRolloffFactor = function(rolloffFactor) {
	this.panner.rolloffFactor = rolloffFactor;
};
/**
 * Gets the cone inner angle.
 *
 * @return {!number} Cone inner angle.
 * @public
 */
Grape2D.SoundPanner.prototype.getConeInnerAngle = function() {
	return this.panner.coneInnerAngle;
};
/**
 * Sets the cone inner angle.
 *
 * @param {!number} coneInnerAngle Cone inner angle.
 * @public
 */
Grape2D.SoundPanner.prototype.setConeInnerAngle = function(coneInnerAngle) {
	this.panner.coneInnerAngle = coneInnerAngle;
};
/**
 * Gets the cone outer angle.
 *
 * @return {!number} Cone outer angle.
 * @public
 */
Grape2D.SoundPanner.prototype.getConeOuterAngle = function() {
	return this.panner.coneOuterAngle;
};
/**
 * Sets the cone outer angle.
 *
 * @param {!number} coneOuterAngle Cone outer angle.
 * @public
 */
Grape2D.SoundPanner.prototype.setConeOuterAngle = function(coneOuterAngle) {
	this.panner.coneOuterAngle = coneOuterAngle;
};
/**
 * Gets the cone outer gain.
 *
 * @return {!number} Cone outer gain.
 * @public
 */
Grape2D.SoundPanner.prototype.getConeOuterGain = function() {
	return this.panner.coneOuterGain;
};
/**
 * Sets the cone outer gain.
 *
 * @param {!number} coneOuterGain Cone outer gain.
 * @public
 */
Grape2D.SoundPanner.prototype.setConeOuterGain = function(coneOuterGain) {
	this.panner.coneOuterGain = coneOuterGain;
};
/**
 * @override
 */
Grape2D.SoundPanner.prototype.connect = function(toConnect) {
	this.panner.connect(toConnect);
	return this;
};
/**
 * @override
 */
Grape2D.SoundPanner.prototype.getDestination = function() {
	return this.panner;
};
/**
 * Panning model.
 *
 * @type {!Object.<!string, !string>}
 * @public
 * @constant
 */
Grape2D.SoundPanner.PANNING_MODEL = {
	EQUALPOWER: "equalpower",
	HRTF: "hrtf"
};
/**
 * Distance model.
 *
 * @type {!Object.<!string, !string>}
 * @public
 * @constant
 */
Grape2D.SoundPanner.DISTANCE_MODEL = {
	LINEAR: "linear",
	INVERSE: "inverse",
	EXPONENTIAL: "exponential"
};
/**
 * Biquad filter.
 *
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundBiquadFilter = function() {
	/**
	 * Biquad filter node.
	 *
	 * @type {BiquadFilterNode}
	 * @private
	 */
	this.biquadFilter = Grape2D.SoundManagerSingleton.getContext().createBiquadFilter();
};
Grape2D.SoundBiquadFilter.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Gets biquad filter type.
 *
 * @return {!number} Biquad's filter type.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getType = function() {
	return this.biquadFilter.type;
};
/**
 * Sets biquad filter type.
 *
 * @param {!number} type Biquad's filter type.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setType = function(type) {
	this.biquadFilter.type = type;
};
/**
 * Gets biquad frequency.
 *
 * @return {!number} Biquad's frequency.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getFrequency = function() {
	return this.biquadFilter.frequency;
};
/**
 * Sets biquad frequency.
 *
 * @param {!number} frequency Biquad's frequency.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setFrequency = function(frequency) {
	this.biquadFilter.frequency = frequency;
};
/**
 * Gets biquad detune.
 *
 * @return {!number} Biquad's detune.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getDetune = function() {
	return this.biquadFilter.detune;
};
/**
 * Sets biquad detune.
 *
 * @param {!number} detune Biquad's detune.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setDetune = function(detune) {
	this.biquadFilter.detune = detune;
};
/**
 * Gets biquad Q.
 *
 * @return {!number} Biquad's Q.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getQ = function() {
	return this.biquadFilter.Q;
};
/**
 * Sets biquad Q.
 *
 * @param {!number} q Biquad's Q.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setQ = function(q) {
	this.biquadFilter.Q = q;
};
/**
 * Gets biquad gain.
 *
 * @return {!number} Biquad's gain.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.getGain = function() {
	return this.biquadFilter.gain;
};
/**
 * Sets biquad gain.
 *
 * @param {!number} gain Biquad's gain.
 * @public
 */
Grape2D.SoundBiquadFilter.prototype.setGain = function(gain) {
	this.biquadFilter.gain = gain;
};
/**
 * @override
 */
Grape2D.SoundBiquadFilter.prototype.connect = function(toConnect) {
	this.biquadFilter.connect(toConnect.getDestination());
	return this;
};
/**
 * @override
 */
Grape2D.SoundBiquadFilter.prototype.getDestination = function() {
	return this.biquadFilter;
};
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.LowpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(0);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.LowpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.HighpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(1);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.HighpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.BandpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(2);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.BandpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.LowshelfFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(3);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.LowshelfFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.HighshelfFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(4);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.HighshelfFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.PeakingFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(5);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.PeakingFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.NotchFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(6);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.NotchFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.AllpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(7);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.AllpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);
})();