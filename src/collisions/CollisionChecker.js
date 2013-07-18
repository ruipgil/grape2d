/**
 * Collides objects, and returns just if they're colliding, giving
 *   no other information.
 *
 * @interface
 */
Grape2D.CollisionChecker = function() {};

Grape2D.CollisionChecker.prototype = {
	constructor: Grape2D.CollisionChecker,
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {Grape2D.AABB} aabb1 An AABB.
	 * @param  {Grape2D.AABB} aabb2 The other AABB.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	aabbVsAabb: function(aabb1, aabb2) {},
	/**
	 * Collides an AABB against a Circle.
	 *
	 * @param  {Grape2D.AABB} aabb An AABB.
	 * @param  {Grape2D.Circle} circle A circle.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	aabbVsCircle: function(aabb, circle) {},
	/**
	 * Collides an AABB against a Polygon.
	 *
	 * @param  {Grape2D.AABB} aabb An AABB.
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	aabbVsPolygon: function(aabb, polygon) {},
	/**
	 * Checks if a point is inside an AABB.
	 *
	 * @param  {Grape2D.AABB} aabb An AABB.
	 * @param  {Grape2D.Vector} point A point.
	 *
	 * @return {boolean} True if the point is inside the AABB.
	 */
	aabbVsPoint: function(aabb, point) {},
	/**
	 * Collides a Circle against an AABB.
	 *
	 * @param  {Grape2D.Circle} circle A circle.
	 * @param  {Grape2D.AABB} aabb An AABB.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	circleVsAabb: function(circle, aabb) {},
	/**
	 * Collides a Circle against another Circle.
	 *
	 * @param  {Grape2D.Circle} circle1 A circle.
	 * @param  {Grape2D.Circle} circle2 Another cicle.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	circleVsCircle: function(circle1, circle2) {},
	/**
	 * Collides a Circle against a polygon.
	 *
	 * @param  {Grape2D.Circle} circle A circle.
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	circleVsPolygon: function(circle, polygon) {},
	/**
	 * Checks if a point is inside an Circle.
	 *
	 * @param  {Grape2D.Circle} circle A circle.
	 * @param  {Grape2D.Vector} point A point.
	 *
	 * @return {boolean} True if the point is inside the circle.
	 */
	circleVsPoint: function(circle, point) {},
	/**
	 * Collides a Polygon against an AABB.
	 *
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 * @param  {Grape2D.AABB} aabb An AABB.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	polygonVsAabb: function(polygon, aabb) {},
	/**
	 * Collides a Polygon against a circle.
	 *
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 * @param  {Grape2D.Circle} circle A circle.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	polygonVsCircle: function(polygon, circle) {},
	/**
	 * Collides a Polygon against another Polygon.
	 *
	 * @param  {Grape2D.Polygon} polygon1 A polygon.
	 * @param  {Grape2D.Polygon} polygon2 A polygon.
	 *
	 * @return {boolean} True if they're colliding.
	 */
	polygonVsPolygon: function(polygon1, polygon2) {},
	/**
	 * Checks if a point is inside a polygon.
	 *
	 * @param  {Grape2D.Polygon} polygon A polygon.
	 * @param  {Grape2D.Vector} point A point.
	 *
	 * @return {boolean} True if the point is inside the polygon.
	 */
	polygonVsPoint: function(polygon, point) {}

};