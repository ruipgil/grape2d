/**
 * Represents the color
 *
 * @param  {?object} options an object with either rgb and rgba properties.
 *   If the two are defined then rgb is taken as the color.
 *   If it's null then the default color (black) is assumed.
 *
 * @constructor
 */
Grape2D.Color = function (options) {
	/**
	 * Color code as an 4 byte component (rgba).
	 *
	 * @type {number}
	 * @private
	 */
	this.code = 0xffffffff;

	/**
	 * The red component, as an byte representation.
	 * This is consistent with the most significant byte from {@see #code}
	 *
	 * @type {number}
	 * @private
	 */
	this.r = 0xff;
	/**
	 * The green component, as an byte representation.
	 * This is consistent with the second most significant byte from {@see #code}
	 *
	 * @type {number}
	 * @private
	 */
	this.g = 0xff;
	/**
	 * The blue component, as an byte representation.
	 * This is consistent with the third most significant byte from {@see #code}
	 *
	 * @type {number}
	 * @private
	 */
	this.b = 0xff;
	/**
	 * The alpha component, as an byte representation.
	 * This is consistent with the least significant byte from {@see #code}
	 *
	 * @type {number}
	 * @private
	 */
	this.a = 0xff;

	if (options.rgb) {
		this.setRgb(options.rgb);
	} else if (options.rgba) {
		this.setRgba(options.rgba);
	}
};

Grape2D.Color.prototype = {
	constructor: Grape2D.Color,
	/**
	 * Sets red component of the color
	 *
	 * @param  {number} red a number between 0 and 255
	 *
	 * @return {Grape.Color} returns the same object
	 * @public
	 */
	setRed: function(red){
		this.r = red;
		return this;
	},
	/**
	 * Gets the red component of the color
	 *
	 * @return {number} the red component, between 0 and 255.
	 * @public
	 */
	getRed: function(){
		return this.r;
	},
	/**
	 * Sets green component of the color
	 *
	 * @param  {number} green a number between 0 and 255
	 *
	 * @return {Grape.Color} returns the same object
	 * @public
	 */
	setGreen: function(green){
		this.g = green;
		return this;
	},
	/**
	 * Gets the green component of the color
	 *
	 * @return {number} the green component, between 0 and 255.
	 * @public
	 */
	getGreen: function(){
		return this.g;
	},
	/**
	 * Sets blue component of the color
	 *
	 * @param  {number} blue a number between 0 and 255
	 *
	 * @return {Grape.Color} returns the same object
	 * @public
	 */
	setBlue: function(blue){
		this.b = blue;
		return this;
	},
	/**
	 * Gets the blue component of the color
	 *
	 * @return {number} the blue component, between 0 and 255.
	 * @public
	 */
	getBlue: function(){
		return this.b;
	},
	/**
	 * Sets alpha component of the color
	 *
	 * @param  {number} alpha a number between 0 and 255
	 *
	 * @return {Grape.Color} returns the same object
	 * @public
	 */
	setAlpha: function(alpha){
		this.a = alpha;
		return this;
	},
	/**
	 * Gets the alpha component of the color
	 *
	 * @return {number} the alpha component, between 0 and 255.
	 * @public
	 */
	getAlpha: function(){
		return this.a;
	},
	/**
	 * Sets the color with rgb components. The color will become opaque.
	 *
	 * @param  {number} code the rgb components
	 *
	 * @return {Grape.Color} returns the same object
	 * @public
	 */
	setRgb: function (code) {
		this.r = (code & 0xff0000) >> 16;
		this.g = (code & 0x00ff00) >> 8;
		this.b = (code & 0x0000ff);
		this.a = 0xff;
		this.code = (code << 8) | 0x000000ff;
		return this;
	},
	/**
	 * Sets the color with the rgba components.
	 *
	 * @param  {number} code the rgba components
	 *
	 * @return {Grape.Color} returns the same object
	 * @public
	 */
	setRgba: function (code) {
		this.r = (code & 0xff000000) >>> 24;
		this.g = (code & 0x00ff0000) >> 16;
		this.b = (code & 0x0000ff00) >> 8;
		this.a = (code & 0x000000ff);
		this.code = code;
		return this;
	},
	/**
	 * Gets the color as an rgba.
	 *
	 * @return {number} the rgba.
	 * @public
	 */
	getRgba: function(){
		return this.code;
	},
	/**
	 * Gets the representation of the color as a string
	 *
	 * @return {string} the color as a string
	 * @public
	 */
	toString: function () {
		return 'rgba(' +
			this.r + ',' + this.g + ',' +
			this.b + ',' + this.a + ')';
	}
};