/**
 * Grape2D.Manifold class.
 *
 * @constructor
 */
Grape2D.Manifold = function(a, b) {
	this.a = a;
	this.b = b;
	this.penetration = 0;
	this.normal = new Grape2D.Vector();
};

Grape2D.Manifold.prototype = {
	constructor: Grape2D.Manifold,
	getA: function() {
		return this.a;
	},
	setA: function(a) {
		this.a = a;
	},
	getB: function() {
		return this.b;
	},
	setB: function(b) {
		this.b = b;
	},
	getPenetration: function() {
		return this.penetration;
	},
	setPenetration: function(penetration) {
		this.penetration = penetration;
	},
	getNormal: function() {
		return this.normal;
	},
	setNormal: function(normal) {
		this.normal = normal;
	}
};