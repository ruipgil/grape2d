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