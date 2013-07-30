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
	var aabbPolygon = new Grape2D.Polygon({
		vertexList: Grape2D.SATCollisionChecker.aabbToVertexList(aabb)
	});
	return this.polygonVsPolygon(aabbPolygon, polygon);
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
 * @override
 */
Grape2D.SATCollisionChecker.prototype.aabbVsRay = function(aabb, start, end, direction) {
	var rayAxis = direction.rightNormal(),
		interval = {
			min: +Infinity,
			max: -Infinity
		}, temp, list = Grape2D.SATCollisionChecker.aabbToVertexList(aabb);
	for (var i = 0; i < list.length; i++) {
		temp = list[i].dot(rayAxis);
		if (temp > interval.max) {
			interval.max = temp;
		} else if (temp < interval.min) {
			interval.min = temp;
		}
	}
	temp = start.dot(rayAxis);
	if (interval.min <= temp && temp <= interval.max) {
		return Grape2D.Math.overlaps({
			min: start.getX(),
			max: end.getX()
		}, {
			min: aabb.getMinX(),
			max: aabb.getMaxX()
		}) >= 0 && Grape2D.Math.overlaps({
			min: start.getY(),
			max: end.getY()
		}, {
			min: aabb.getMinY(),
			max: aabb.getMaxY()
		}) >= 0;
	} else {
		return false;
	}
};
/**
 * A cached list of vertexes. This avoids the creation of a list
 *   and four {@link Grape2D.Vector}. This is shared with all
 *   instances of collision checker, parallel usage can produce
 *   unexpected results.
 *
 * @type {!Array.<!Grape2D.Vector>}
 * @private
 * @static
 */
Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST = [
	new Grape2D.Vector(),
	new Grape2D.Vector(),
	new Grape2D.Vector(),
	new Grape2D.Vector()
];
/**
 * Returns a vertex list, with length four, with vertexes of
 *   an AABB.
 *
 * @param  {!Grape2D.AABB} aabb An AABB.
 * @return {!Array.<!Grape2D.Vector>} Vertex list of an AABB.
 *   The result is {@link Grape2D.SATCollisionChecker#SHARED_AABB_TO_VERTEX_LIST}
 * @private
 */
Grape2D.SATCollisionChecker.aabbToVertexList = function(aabb) {
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[0].setX(aabb.getMinX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[0].setY(aabb.getMinY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[1].setX(aabb.getMinX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[1].setY(aabb.getMaxY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[2].setX(aabb.getMaxX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[2].setY(aabb.getMinY());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[3].setX(aabb.getMaxX());
	Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST[3].setY(aabb.getMaxY());
	return Grape2D.SATCollisionChecker.SHARED_AABB_TO_VERTEX_LIST;
}
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.circleVsRay = function(circle, start, end, direction) {
	var temp, pos = circle.getPosition(),
		r = circle.getRadius(),
		ivr = {
			min: 0,
			max: 0
		}, iv;
	temp = pos.dot(direction);
	iv = {
		min: temp - r,
		max: temp + r
	};
	temp = start.dot(direction);
	if (start.getX() < end.getX()) {
		ivr.min = start.dot(direction);
		ivr.max = end.dot(direction);
	} else {
		ivr.min = start.dot(direction);
		ivr.max = end.dot(direction);
	}

	return Grape2D.Math.overlaps(ivr, iv) >= 0;
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.polygonVsRay = function(polygon, start, end, direction) {
	var rayAxis = direction.rightNormal(),
		polist = polygon.getComputedVertexList(),
		itv = {
			min: 0,
			max: 0
		}, pItv, temp, ia, ib;

	pItv = this.computeIntervals(polist, [rayAxis])[0];
	temp = start.dot(rayAxis);
	if (pItv.min <= temp && temp <= pItv.max) {
		pItv = this.computeIntervals(polist, [direction])[0];
		ia = start.dot(direction);
		ib = end.dot(direction);
		if (ia > ib) {
			itv.max = ia;
			itv.min = ib;
		} else {
			itv.max = ib;
			itv.min = ia;
		}
		return Grape2D.Math.overlaps(pItv, itv) >= 0;
	} else {
		return false;
	}
};
/**
 * Cache of the predefined set of AABB axis.
 *
 * @type {!Array.<Grape2D.Vector>}
 * @private
 * @static
 */
Grape2D.SATCollisionChecker.aabbAxis = [new Grape2D.Vector(1, 0), new Grape2D.Vector(0, 1)];