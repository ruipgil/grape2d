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
	return new Grape2D.Color([parseInt(rg[1]), parseInt(rg[2]), parseInt(rg[3])]);
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
	return new Grape2D.Color([parseInt(rg[1]), parseInt(rg[2]), parseInt(rg[3]), parseInt(rg[4])]);
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
	return new Grape2D.Color([parseInt(string.substr(1,2), 16), parseInt(string.substr(3,2), 16), parseInt(string.substr(5,2), 16)]);
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
 * @return {?Grape2D.Color} Color class, from the representation. It will return null if the string can't parsed.
 * @public
 * @static
 */
Grape2D.Color.createFromString = function(string){
	var color = null;
	if(string.startsWidth("#")){
		color = Grape2D.Color.createFromHex(string);
	}else if(string.startsWidth("rgba")){
		color = Grape2D.Color.createFromRgba(string);
	}else if(string.startsWidth("rgb")){
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
Grape2D.Color.RED = [255,0,0];
/**
 * Green color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GREEN = [0,255,0];
/**
 * Blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.BLUE = [0,0,255];
/**
 * Black color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.BLACK = [0,0,0];
/**
 * White color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.WHITE = [255,255,255];
/**
 * Yellow color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.YELLOW = [255,255,0];
/**
 * Orange color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.ORANGE = [255,128,0];
/**
 * Ivory color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.IVORY = [255,255,240];
/**
 * Beige color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.BEIGE = [245, 245, 220];
/**
 * Wheat color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.WHEAT = [245,222,179];
/**
 * Tan color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.TAN = [210,180,140];
/**
 * Khaki color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.KHAKI = [195,176,145];
/**
 * Silver color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.Silver = [192,192,192];
/**
 * Gray color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GRAY = [128,128,128];
/**
 * Charcoal color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CHARCOAL = [70,70,70];
/**
 * Navy blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.NAVY_BLUE = [0,0,128];
/**
 * Royal blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.ROYAL_BLUE = [8,76,158];
/**
 * Medium blue color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.MEDIUM_BLUE = [0,0,205];
/**
 * Azure color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.AZURE = [0,127,255];
/**
 * Cyan color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CYAN = [0,255,255];
/**
 * Aquamarine color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.AQUAMARINE = [127,255,212];
/**
 * Teal color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.TEAL = [0, 128, 128];
/**
 * Forest green color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.FOREST_GREEN = [34, 139, 34];
/**
 * Olive color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.OLIVE = [128, 128, 0];
/**
 * Chartreuse color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CHARTREUSE = [127, 255, 0];
/**
 * Lime color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.LIME = [191, 255, 0];
/**
 * Golden color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GOLDEN = [255, 215, 0];
/**
 * Goldenrod color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.GOLDENROD = [218, 165, 32];
/**
 * Coral color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CORAL = [255, 127, 80];
/**
 * Salmon color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.SALMON = [250, 128, 114];
/**
 * Hot pink color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.HOT_PINK = [252, 15, 192];
/**
 * Fuchsia color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.FUCHSIA = [255, 119, 255];
/**
 * Puce color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.PUCE = [204, 136, 153];
/**
 * Mauve color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.MAUVE = [224, 176, 255];
/**
 * Lavender color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.LAVENDER = [181, 126, 220];
/**
 * Plum color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.PLUM = [132, 49, 121];
/**
 * Indigo color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.INDIGO = [75,0,130];
/**
 * Maroon color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.MAROON = [128, 0, 0];
/**
 * Crimson color.
 *
 * @type {!Array.<!number>}
 * @public
 * @constant
 */
Grape2D.Color.CRIMSON = [220, 20, 60];