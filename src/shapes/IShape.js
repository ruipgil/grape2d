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