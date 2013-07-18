/**
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
};