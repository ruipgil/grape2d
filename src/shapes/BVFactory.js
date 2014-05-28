/**
 * Creates a bounding volume based on a given shape.
 *
 * @class
 * @interface
 */
Grape2D.BVFactory = function() {};

Grape2D.BVFactory.prototype = {
	constructor: Grape2D.BVFactory,
	/**
	 * Creates a shape, based on the type set, from an {@see Grape2D.AABB}.
	 * 
	 * @param  {!Grape2D.AABB} aabb The object.
	 * @return {!Grape2D.Shape} Shape based on the type of the factory.
	 * @public
	 */
	createFromAABB: function(aabb) {},
	/**
	 * Creates a shape, based on the type set, from an {@see Grape2D.Circle}.
	 * 
	 * @param  {!Grape2D.Circle} circle The object.
	 * @return {!Grape2D.Shape} Shape based on the type of the factory.
	 * @public
	 */
	createFromCircle: function(circle) {},
	/**
	 * Creates a shape, based on the type set, from an {@see Grape2D.Polygon}.
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