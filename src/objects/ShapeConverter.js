/**
 * Converts shapes to other shapes.
 * @static
 * @class
 */
Grape2D.ShapeConverter = {
	/**
	 * Converts an AABB shape to a circle Shape.
	 * @param  {Grape2D.AABB} aabb AABB to convert.
	 * @return {Grape2D.Circle} The result.
	 * @public
	 * @static
	 */
	aabbToCircle: function (aabb) {},
	/**
	 * Converts a circle shape to an AABB Shape.
	 * @param  {Grape2D.Circle} circle Circle to convert.
	 * @return {Grape2D.AABB} The result.
	 * @public
	 * @static
	 */
	circleToAabb: function (circle) {},
	/**
	 * Converts a polygon shape to an AABB Shape.
	 * @param  {Grape2D.Polygon} polygon Polygon to convert.
	 * @return {Grape2D.AABB} The result.
	 * @public
	 * @static
	 */
	polygonToAabb: function (polygon) {},
	/**
	 * Converts a polygon shape to an circle Shape.
	 * @param  {Grape2D.Polygon} polygon Polygon to convert.
	 * @return {Grape2D.Circle} The result.
	 * @public
	 * @static
	 */
	polygonToCircle: function (polygon) {}
};