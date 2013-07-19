/**
 * Dispatch the collisions, providing a simple interface.
 *
 * @class
 */
Grape2D.CollisionDispatcher = {
	/**
	 * Collides an AABB against another AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb1 An AABB.
	 * @param  {!Grape2D.AABB} aabb2 Another AABB.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsAabb: function(cchecker, aabb1, aabb2) {
		return cchecker.aabbVsAabb(aabb1, aabb2);
	},
	/**
	 * Collides an AABB against a Circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsCircle: function(cchecker, aabb, circle) {
		return cchecker.aabbVsCircle(aabb, circle);
	},
	/**
	 * Collides an AABB against a Polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	aabbVsPolygon: function(cchecker, aabb, polygon) {
		return cchecker.aabbVsPolygon(aabb, polygon);
	},
	/**
	 * Checks if a point is inside an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if inside.
	 * @static
	 * @private
	 */
	aabbVsPoint: function(cchecker, aabb, point) {
		return cchecker.aabbVsPoint(aabb, point);
	},
	/**
	 * Collides a Circle against an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	circleVsAabb: function(cchecker, circle, aabb) {
		return cchecker.circleVsAabb(circle, aabb);
	},
	/**
	 * Collides a Circle against another Circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle1 A circle.
	 * @param  {!Grape2D.Circle} circle2 A circle.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	circleVsCircle: function(cchecker, circle1, circle2) {
		return cchecker.circleVsCircle(circle1, circle2);
	},
	/**
	 * Collides a circle against a polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	circleVsPolygon: function(cchecker, circle, polygon) {
		return cchecker.circleVsPolygon(circle, polygon);
	},
	/**
	 * Checks if a point is inside a circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if inside.
	 * @static
	 * @private
	 */
	circleVsPoint: function(cchecker, circle, point) {
		return cchecker.circleVsPoint(circle, point);
	},
	/**
	 * Collides a polygon against an AABB.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.AABB} aabb An AABB.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	polygonVsAabb: function(cchecker, polygon, aabb) {
		return cchecker.polygonVsAabb(polygon, aabb);
	},
	/**
	 * Collides a polygon against a circle.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Circle} circle A circle.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	polygonVsCircle: function(cchecker, polygon, circle) {
		return cchecker.polygonVsCircle(polygon, circle);
	},
	/**
	 * Collides a polygon against another polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon1 A polygon.
	 * @param  {!Grape2D.Polygon} polygon2 Another polygon.
	 * @return {!boolean} Result of the collision.
	 * @static
	 * @private
	 */
	polygonVsPolygon: function(cchecker, polygon1, polygon2) {
		return cchecker.polygonVsPolygon(polygon1, polygon2);
	},
	/**
	 * Checks if a point is inside a polygon.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker Checker of the collision.
	 * @param  {!Grape2D.Polygon} polygon A polygon.
	 * @param  {!Grape2D.Vector} point A point.
	 * @return {!boolean} True if inside.
	 * @static
	 * @private
	 */
	polygonVsPoint: function(cchecker, polygon, point) {
		return cchecker.polygonVsPoint(polygon, point);
	},
	/**
	 * Object used to dispatch the collision.
	 *
	 * @type {!Object}
	 * @private
	 * @static
	 */
	dcache: {},
	/**
	 * Dispatches a collision between two primitives.
	 *
	 * @param  {!Grape2D.CollisionChecker} cchecker A collision checker.
	 * @param  {!(Grape2D.Shape|Grape2D.Vector)} a Shape to test.
	 * @param  {!(Grape2D.Shape|Grape2D.Vector)} b Shape to collide with the first
	 *   one, or a point to check it it's inside.
	 * @return {!boolean} Result of the collision.
	 * @public
	 */
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