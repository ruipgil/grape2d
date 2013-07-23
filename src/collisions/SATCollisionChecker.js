/**
 * Concrete collision checker, that implements the SAT algorithm.
 *
 *
 * @extends {Grape2D.GenericCollisionChecker}
 * @constructor
 */
Grape2D.SATCollisionChecker = function() {};

Grape2D.SATCollisionChecker.prototype = Object.create(Grape2D.GenericCollisionChecker.prototype);

/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.aabbVsPolygon = function(aabb, polygon) {
	var aabbPoly = new Grape2D.Polygon({
		vertexList: [
			new Grape2D.Vector(aabb.getPosition().getX() - aabb.getHalfWidth(), aabb.getPosition().getY() + aabb.getHalfHeight()),
			new Grape2D.Vector(aabb.getPosition().getX() + aabb.getHalfWidth(), aabb.getPosition().getY() + aabb.getHalfHeight()),
			new Grape2D.Vector(aabb.getPosition().getX() + aabb.getHalfWidth(), aabb.getPosition().getY() - aabb.getHalfHeight()),
			new Grape2D.Vector(aabb.getPosition().getX() - aabb.getHalfWidth(), aabb.getPosition().getY() - aabb.getHalfHeight())
		]
	});
	return this.polygonVsPolygon(aabbPoly, polygon);
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	var ca1 = this.computeAxis(polygon1),
		ca2 = this.computeAxis(polygon2);
	var axis = this.selectAxis(ca1, ca2);
	var p1Intv = this.computeIntervals(polygon1.getComputedVertexList(), axis),
		p2Intv = this.computeIntervals(polygon2.getComputedVertexList(), axis),
		overlap;

	for (var i = 0; i < axis.length; i++) {
		overlap = Grape2D.Math.overlaps(p1Intv[i], p2Intv[i]);
		if (overlap < 0) {
			return false;
		}
	}
	return true;
};
/**
 * Computes the axis of a polygon.
 *
 * @param  {!Grape2D.Polygon} polygon Polygon to compute the axis.
 * @return {!Array.<!Grape2D.Vector>} Array of vectors with the direction of
 *   the axis, perpendicular to the side, and normalized.
 * @public
 */
Grape2D.SATCollisionChecker.prototype.computeAxis = function(polygon) {
	var res = [],
		list = polygon.getComputedVertexList(),
		n, i;
	for (i = 0; i < list.length; i++) {
		n = (i + 1) % list.length;
		res.push(Grape2D.Vector.createFromPoints(list[i], list[n]).normalize().rightNormal());
	}
	return res;
};
/**
 * Select the unique axis in a list.
 *
 * @param  {!Array.<!Grape2D.Vector>} listA A list of axis.
 * @param  {!Array.<!Grape2D.Vector>} listB A list of axis.
 * @return {!Array.<!Grape2D.Vector>} All different axis that are in both
 *   params.
 * @public
 */
Grape2D.SATCollisionChecker.prototype.selectAxis = function(listA, listB) {
	var res = [],
		e;
	for (var i = 0; i < listA.length; i++) {
		res.push(listA[i]);
	}

	for (i = 0, e = true; i < listB.length; i++, e = true) {
		for (var j = 0; j < listA.length; j++) {
			if (res[j].isParallelTo(listB[i])) {
				e = false;
				break;
			}
		}
		if (e) {
			res.push(listB[i]);
		}
	}

	return res;
};
/**
 * Compute the interval that a set of vertexes represent, in an axis.
 *
 * @param  {!Array.<!Grape2D.Vector>} vertexList List of vertexes.
 * @param  {!Array.<!Grape2D.Vector>} axis Axis to receive the
 *   projection of the vertexes.
 * @return {!Object} An object with the properties <code>min</code> and
 *   <code>max</code>
 * @public
 */
Grape2D.SATCollisionChecker.prototype.computeIntervals = function(vertexList, axis) {
	var intrvByAxis = [],
		min = Infinity,
		max = -Infinity,
		aa, ab;

	for (var i = 0; i < axis.length; i++) {
		min = Infinity;
		max = -Infinity;
		for (var j = 0; j < vertexList.length; j++) {
			aa = vertexList[j].dot(axis[i]);
			ab = vertexList[(j + 1) % vertexList.length].dot(axis[i]);
			if (aa > max) {
				max = aa;
			}
			if (aa < min) {
				min = aa;
			}
			if (ab > max) {
				max = ab;
			}
			if (ab < min) {
				min = aa;
			}
		}
		intrvByAxis.push({
			min: min,
			max: max
		});
	}
	return intrvByAxis;
};
/**
 * Cache of the predefined set of AABB axis.
 *
 * @type {!Array.<Grape2D.Vector>}
 * @private
 * @static
 */
Grape2D.SATCollisionChecker.aabbAxis = [new Grape2D.Vector(1, 0), new Grape2D.Vector(0, 1)];