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