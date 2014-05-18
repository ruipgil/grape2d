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