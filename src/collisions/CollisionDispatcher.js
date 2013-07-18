/**
 * Dispatch the collisions, providing a simple interface.
 *
 * @class
 */
Grape2D.CollisionDispatcher = {
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {Grape2D.AABB} aabb1 An AABB.
	 * @param  {Grape2D.AABB} aabb2 Another AABB.
	 * @return {boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsAabb: function(cchecker, aabb1, aabb2) {
		return cchecker.aabbVsAabb(aabb1, aabb2);
	},
	aabbVsCircle: function(cchecker, aabb, circle) {
		return cchecker.aabbVsCircle(aabb, circle);
	},
	aabbVsPolygon: function(cchecker, aabb, polygon) {
		return cchecker.aabbVsPolygon(aabb, polygon);
	},
	aabbVsPoint: function(cchecker, aabb, point) {
		return cchecker.aabbVsPoint(aabb, point);
	},

	circleVsAabb: function(cchecker, circle, aabb) {
		return cchecker.circleVsAabb(circle, aabb);
	},
	circleVsCircle: function(cchecker, circle1, circle2) {
		return cchecker.circleVsCircle(circle1, circle2);
	},
	circleVsPolygon: function(cchecker, circle, polygon) {
		return cchecker.aabbVsPolygon(circle, polygon);
	},
	circleVsPoint: function(cchecker, circle, point) {
		return cchecker.circleVsPoint(circle, point);
	},

	polygonVsAabb: function(cchecker, polygon, aabb) {
		return cchecker.polygonVsAabb(polygon, aabb);
	},
	polygonVsCircle: function(cchecker, polygon, circle) {
		return cchecker.polygonVsCircle(polygon, circle);
	},
	polygonVsPolygon: function(cchecker, polygon1, polygon2) {
		return cchecker.polygonVsPolygon(polygon1, polygon2);
	},
	polygonVsPoint: function(cchecker, polygon, point) {
		return cchecker.aabbVsPolygon(polygon, point);
	},
	dcache: {},
	dispatch: function(cchecker, a, b) {
		return Grape2D.CollisionDispatcher.dcache[a.getStaticType()][b.getStaticType()](cchecker, a, b);
	}
};

Grape2D.CollisionDispatcher.dcache = {
	"AABB": {
		"AABB": Grape2D.CollisionDispatcher.aabbVsAabb,
		"Circle": Grape2D.CollisionDispatcher.aabbVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.aabbVsPolygon,
		"Point": Grape2D.CollisionDispatcher.aabbVsPoint
	},
	"Circle": {
		"AABB": Grape2D.CollisionDispatcher.circleVsAabb,
		"Circle": Grape2D.CollisionDispatcher.circleVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.circleVsPolygon,
		"Point": Grape2D.CollisionDispatcher.circleVsPoint
	},
	"Polygon": {
		"AABB": Grape2D.CollisionDispatcher.polygonVsAabb,
		"Circle": Grape2D.CollisionDispatcher.polygonVsCircle,
		"Polygon": Grape2D.CollisionDispatcher.polygonVsPolygon,
		"Point": Grape2D.CollisionDispatcher.polygonVsPoint
	}
}