/**
 * Shape is an abstract class that describes "physical", objects.
 *   The main objective of a Shape is to serve as a bounding box. It
 *   should play the main role when selecting the objects to render,
 *   when it comes to collision detection and/or to detect user
 *   interaction with an object.
 *
 * @param {!Grape2D.Vector=} options.position The position of the shape.
 *
 * @constructor
 */
Grape2D.Shape = function(options) {
	options = options || {};
	/**
	 * Shape's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @protected
	 */
	this.position = options.position || new Grape2D.Vector();
};

Grape2D.Shape.prototype = {
	constructor: Grape2D.Shape,
	/**
	 * Gets the position of the object.
	 *
	 * @return {!Grape2D.Vector} The center position of the shape.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Set the position of the shape.
	 *
	 * @param  {!Grape2D.Vector} position The new position of the shape.
	 * @public
	 */
	setPosition: function(position) {
		this.position.set(position);
	},
	/**
	 * Renders the wireframe of the shape.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer to render the
	 *   shape's wireframe.
	 * @param  {!Grape2D.Camera} camera The camera to transform the
	 *   positions.
	 * @public
	 */
	render: function(renderer, camera) {},
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