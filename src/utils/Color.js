/**
 * A rgba color.
 *
 * @param {Array.<!number>=} color Color representation as a number array, with four components; red, green, blue and alpha. If this form is too restrictive, consider using the methods to set the color from diferent formats.
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