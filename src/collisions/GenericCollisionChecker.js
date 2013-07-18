/**
 * This implements generic methods of the collision controlle. Since
 *   from algorithm to algorithm only a few methods may be different.
 *   So only methods envolving polygons should be refined.
 *
 * @implements {Grape2D.CollisionChecker}
 * @constructor
 */
Grape2D.GenericCollisionChecker = function() {};

Grape2D.GenericCollisionChecker.prototype = Object.create(Grape2D.CollisionChecker);

/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsAabb = function(aabb1, aabb2) {
	return Grape2D.Math.abs(aabb2.getPosition().getX() - aabb1.getPosition().getX()) <= (aabb1.getHalfWidth() + aabb2.getHalfWidth()) &&
		Grape2D.Math.abs(aabb2.getPosition().getY() - aabb1.getPosition().getY()) <= (aabb1.getHalfHeight() + aabb2.getHalfHeight());
};

/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsPoint = function(aabb, point) {
	return Grape2D.Math.abs(aabb.getPosition().getX() - point.getX()) <= aabb.getHalfWidth() && Grape2D.Math.abs(aabb.getPosition().getY() - point.getY()) <= aabb.getHalfHeight();
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsAabb = function(circle, aabb) {
	return this.aabbVsCircle(aabb, circle);
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsCircle = function(aabb, circle) {
	var xC = Grape2D.Math.clamp(circle.getPosition().getX(), aabb.getPosition().getX() - aabb.getHalfWidth(), aabb.getPosition().getX() + aabb.getHalfWidth()),
		yC = Grape2D.Math.clamp(circle.getPosition().getY(), aabb.getPosition().getY() - aabb.getHalfWidth(), aabb.getPosition().getY() + aabb.getHalfWidth());
	return Grape2D.Math.sq(circle.getPosition().getX() - xC) + Grape2D.Math.sq(circle.getPosition().getY() - yC) >= Grape2D.Math.sq(circle.getRadius());
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsCircle = function(circle1, circle2) {
	return Grape2D.Math.sqrt(Grape2D.Math.sq(circle2.getPosition().getX() - circle1.getPosition().getX()) + Grape2D.Math.sq(circle2.getPosition().getY() - circle1.getPosition().getY())) <= (circle1.getRadius() + circle2.getRadius());
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsPoint = function(circle, point) {
	return Grape2D.Math.sqrt(Grape2D.Math.sq(circle.getPosition().getX() - point.getX()) + Grape2D.Math.sq(circle.getPosition().getY() - point.getY())) <= circle.getRadius();
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsAabb = function(polygon, aabb) {
	return this.aabbVsPolygon(aabb, polygon);
};
/**
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsCircle = function(polygon, circle) {
	return this.circleVsPolygon(circle, polygon);
};

/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.aabbVsPolygon = function(aabb, polygon) {
	return false;
};
/**
 * Naive implementation.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.circleVsPolygon = function(circle, polygon) {
	var list = polygon.getVertexList(),
		cPos = circle.getPosition(),
		r = Grape2D.Math.sq(circle.getRadius());
	for (var i = 0; i < list.length; i++) {
		if (list[i].sqDistanceTo(cPos) <= r) {
			return false;
		}
	}
	return true;
};
/**
 * Must be refined.
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	return false;
};
/**
 * Algorithm based upon Walfram's Demonstration project.
 * <link>http://demonstrations.wolfram.com/AnEfficientTestForAPointToBeInAConvexPolygon/</link>
 * @override
 */
Grape2D.GenericCollisionChecker.prototype.polygonVsPoint = function(polygon, point) {
	var list = polygon.getVertexList(),
		tVertex = [],
		i, n;

	tVertex.push(list[0].clone().sub(point));
	for (i = 0, n = 0; i < tVertex.length; ++i) {
		n = (i + 1) % tVertex.length;
		if (n > 0) {
			tVertex.push(list[n].clone().sub(point));
		}
		if (tVertex[n].getX() * tVertex[i].getY() - tVertex[i].getX() * tVertex[n].getY()) {
			return false;
		}
	}
	return true;
};