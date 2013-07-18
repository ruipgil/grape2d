/**
 * Concrete collision checker, that implements the SAT algorithm.
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
	return false;
};
/**
 * @override
 */
Grape2D.SATCollisionChecker.prototype.polygonVsPolygon = function(polygon1, polygon2) {
	var axis = this.selectAxis(this.computeAxis(polygon1.getVertexList()), this.computeAxis(polygon2.getVertexList())),
		p1Intv = this.computeIntervals(polygon1.getVertexList(), axis),
		p2Intv = this.computeIntervals(polygon2.getVertexList(), axis),
		overlap;

	for (var i = 0; i < axis.length; i++) {
		overlap = Grape2D.Math.overlaps(p1Intv, p2Intv);
		if (overlap < 0) {
			return false;
		}
	}
	return true;
};
Grape2D.SATCollisionChecker.prototype.computeAxis = function(polygon) {
	var res = [],
		list = polygon.getVertexList(),
		n, i;
	for (i = 0; i < list.length; i++) {
		n = (i + 1) % list.length;
		res.push(Grape2D.Vector.createFromPoints(list[i], list[n]).normalize().rightNormal());
	}
	return res;
};
Grape2D.SATCollisionChecker.prototype.selectAxis = function(listA, listB) {
	var res = [],
		e;
	for (var i = 0; i < listA.length; i++) {
		res.push(listA);
	}

	for (i = 0, e = true; i < res.length; i++, e = true) {
		for (var j = 0; j < listB.length; j++) {
			if (res[i].isParallelTo(listB[j])) {
				e = false;
			}
		}
		if (e) {
			res.push(listB[i]);
		}
	}

	return res;
};
/**
 * [ description]
 *
 * @param  {Array.<Grape2D.Vector>} vertexList [description]
 * @param  {Array.<Grape2D.Vector>} axis [description]
 *
 * @return {[type]} [description]
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

Grape2D.SATCollisionChecker.aabbAxis = [new Grape2D.Vector(1, 0), new Grape2D.Vector(0, 1)];