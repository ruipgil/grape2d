/**
 * ManifoldDispatcher class.
 *
 * @class
 */
Grape2D.ManifoldDispatcher = {
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.AABB}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsAabb: function(solver, m) {
		return solver.aabbVsAabb(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Circle}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsCircle: function(solver, m) {
		return solver.aabbVsCircle(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Polygon}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsPolygon: function(solver, m) {
		return solver.aabbVsPolygon(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Ray}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	aabbVsRay: function(solver, m) {
		return solver.aabbVsRay(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.AABB}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsAabb: function(solver, m) {
		return solver.circleVsAabb(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Circle}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsCircle: function(solver, m) {
		return solver.circleVsCircle(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Polygon}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsPolygon: function(solver, m) {
		return solver.circleVsPolygon(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Ray}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	circleVsRay: function(solver, m) {
		return solver.circleVsRay(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.AABB}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsAabb: function(solver, m) {
		return solver.polygonVsAabb(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Circle}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsCircle: function(solver, m) {
		return solver.polygonVsCircle(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Polygon}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsPolygon: function(solver, m) {
		return solver.polygonVsPolygon(m);
	},
	/**
	 * Solves a collision between {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Ray}, the information
	 *   about the resolution is stored in the given
	 *   manifold if the result is true. If the result
	 *   is false the manifold is not modified.
	 *
	 * @param  {*} solver Solver instance.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @private
	 * @static
	 */
	polygonVsRay: function(solver, m) {
		return solver.polygonVsRay(m);
	},
	/**
	 * Jump table.
	 *
	 * @type {!Object.<!string, !Object.<!string, function(*, !Grape2D.Manifold):boolean>>}
	 * @public
	 * @static
	 */
	dcache: {},
	/**
	 * Dispatches a collision, through the jump table,
	 *   selecting the right method to collide the
	 *   {@link Grape2D.Shape}s, in the manifold.
	 *
	 * @param  {*} solver Solver.
	 * @param  {!Grape2D.Manifold} m Manifold.
	 * @return {!boolean} True if the objects collide.
	 * @public
	 */
	dispatch: function(solver, m) {
		return Grape2D.ManifoldDispatcher.dcache[m.getA().getBoundingBox().getStaticType()][m.getB().getBoundingBox().getStaticType()](solver, m);
	}
};

Grape2D.ManifoldDispatcher.dcache = {
	"AABB": {
		"AABB": Grape2D.ManifoldDispatcher.aabbVsAabb,
		"Circle": Grape2D.ManifoldDispatcher.aabbVsCircle,
		"Polygon": Grape2D.ManifoldDispatcher.aabbVsPolygon,
		"Ray": Grape2D.ManifoldDispatcher.aabbVsRay
	},
	"Circle": {
		"AABB": Grape2D.ManifoldDispatcher.circleVsAabb,
		"Circle": Grape2D.ManifoldDispatcher.circleVsCircle,
		"Polygon": Grape2D.ManifoldDispatcher.circleVsPolygon,
		"Ray": Grape2D.ManifoldDispatcher.circleVsRay
	},
	"Polygon": {
		"AABB": Grape2D.ManifoldDispatcher.polygonVsAabb,
		"Circle": Grape2D.ManifoldDispatcher.polygonVsCircle,
		"Polygon": Grape2D.ManifoldDispatcher.polygonVsPolygon,
		"Ray": Grape2D.ManifoldDispatcher.polygonVsRay
	}
};