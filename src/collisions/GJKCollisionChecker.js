/**
 * Concrete collision checker, that implements the GJK algorithm.
 *
 * @extends {Grape2D.GenericCollisionChecker}
 * @constructor
 */
Grape2D.GJKCollisionChecker = function() {};

Grape2D.GJKCollisionChecker.prototype = Object.create(Grape2D.GenericCollisionChecker.prototype);
/**
 * @override
 */
Grape2D.GJKCollisionChecker.prototype.aabbVsPolygon = function(aabb, polygon) {
	return false;
};
/**
 * @override
 */
Grape2D.GJKCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	/*var cHull = Grape2D.CollisionUtils.convexHull(Grape2D.CollisionUtils.minkowskyDifference(polygon1.getVertexList(), polygon2.getVertexList()));
	return this.polygonVsPoint(Grape2D.GJKCollisionChecker.CENTER);*/
	return false;
};
/**
 * Center point.
 *
 * @type {Grape2D.Vector}
 * @constant
 * @protected
 */
Grape2D.GJKCollisionChecker.CENTER = new Grape2D.Vector();