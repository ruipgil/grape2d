/**
 * SATUtils.
 *
 * @class
 */
Grape2D.SATUtils = {
	/**
	 * Select all unique, non parallel axis, from two list of axis.
	 *
	 * @param  {!Array.<!Grape2D.Vector>} listA List of axis.
	 * @param  {!Array.<!Grape2D.Vector>} listB List of axis.
	 * @return {!Array.<!Grape2D.Vector>} List with all different axis.
	 * @public
	 * @static
	 */
	selectAxis: function(listA, listB) {
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
	},
	/**
	 * Computes all polygon axis.
	 *
	 * @param  {!Grape2D.Polygon} polygon Polygon to compute the axis.
	 * @return {!Array.<!Grape2D.Vector>} List of axis of the polygon,
	 *   multiple equivalent axis (parallel) may be returned.
	 * @public
	 * @static
	 */
	computePolygonAxis: function(polygon) {
		var res = [],
			list = polygon.getComputedVertexList(),
			n, i;
		for (i = 0; i < list.length; i++) {
			n = (i + 1) % list.length;
			res.push(Grape2D.Vector.createFromPoints(list[i], list[n]).normalize().rightNormal());
		}
		return res;
	},
	/**
	 * Computes the intervals of a set of vertex, against a list of
	 *   axis. The result is a set of intervals, where the same index
	 *   of an interval corresponds to the index of the axis
	 *   correspondent to that interval.
	 * 
	 *
	 * @param  {!Array.<!Grape2D.Vector>} vertexList Vertex list to
	 *   compute the intervals.
	 * @param  {!Array.<!Grape2D.Vector>} axis Axis list to compile the
	 *   vertex against.
	 * @return {!Array.<!Object.<!string, !number>>} And object with the
	 *   interval representation. With two properties, min and max,
	 *   representing respectively the lower and the upper bound of the
	 *   interval.
	 * @public
	 * @static
	 */
	computeIntervals: function(vertexList, axis) {
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
	}
};