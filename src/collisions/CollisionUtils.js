/**
 * Utilities class for collision detection.
 *
 * @class
 */
Grape2D.CollisionUtils = {
	/**
	 * Calculates the Minkowski difference, between two polygons.
	 *   It's not fully implemented yet.
	 *
	 * @param  {!Grape2D.Polygon} polyA Polygon.
	 * @param  {!Grape2D.Polygon} polyB Polygon.
	 * @return {!Array.<!Grape2D.Vector>} Vertex list.
	 * @public
	 * @static
	 */
	minkowskiDifference: function(polyA, polyB) {
		var vertexList = [],
			a = polyA.getVertexList(),
			b = polyB.getVertexList();
		for (var i = 0; i < polyA.length; i++) {
			for (var j = 0; j < polyB.length; j++) {
				vertexList.push(Grape2D.Vector.createFromPoints(a[i], b[j]));
			}
		}
		return vertexList;
	},
	/**
	 * Calculates a quick hull, from a set of points.
	 *   TODO.
	 *
	 * @param  {!Array.<!Grape2D.Vector>} pointList List of points.
	 * @param  {?} left Left.
	 * @param  {?} right Right.
	 * @return {?} Result.
	 * @public
	 * @static
	 */
	quickHull: function(pointList, left, right) {
		/*QuickHull (S, l, r)

     if S={ }    then return ()
else if S={l, r} then return (l, r)  // a single convex hull edge
else
    z = index of a point that is furthest (max distance) from xy.
    Let A be the set containing points strictly right of (x, z)
    Let B be the set containing points strictly right of (z, y)
    return {QuickHull (A, x, z) U (z) U QuickHull (B, z, y)}*/

		if (pointList.length === 0) {
			return [];
		}
		if (pointList.length == 2) {
			return [left, right];
		}



		//TODO
		/*d = d || new Grape2D.Vector(1,0);
		var min = Grape2D.CollisionUtils.getPointFarthest(d),
			max = Grape2D.CollisionUtils.getPointFarthert(d.negate()),
			lineNormal = Grape2D.Vector.createFromPoints(min, max).rightNormal(),
			setA = [],
			setB = [];

		for(var i=0; i<pointList.length; i++){
			if(lineNormal.isInPositiveSide(pointList[i])){
				setA.push(pointList[i]);
			}else{
				setB.push(pointList[i]);
			}
		}*/



	}
};