/**
 * Creates bounding volumes based in an input object.
 *
 * @implements {Grape2D.BVFactory}
 * @constructor
 */
Grape2D.AabbBVFactory = function() {};

Grape2D.AabbBVFactory.prototype = Object.create(Grape2D.BVFactory.prototype);
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createFromAABB = function(aabb) {
	return aabb;
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createFromCircle = function(circle) {
	var w = circle.getRadius() * 2;
	return new Grape2D.AABB({
		position: circle.getPosition(),
		width: w,
		height: w
	});
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createFromPolygon = function(polygon) {
	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity,
		list = polygon.getComputedVertexList(),
		temp, x, y;


	for (var i = 0; i < list.length; i++) {
		temp = list[i];
		if (minX > temp.getX()) {
			minX = temp.getX();
		}
		if (maxX < temp.getX()) {
			maxX = temp.getX();
		}
		if (minY > temp.getY()) {
			minY = temp.getY();
		}
		if (maxY < temp.getY()) {
			maxY = temp.getY();
		}
	}

	x = maxX - minX;
	y = maxY - minY;

	return new Grape2D.AABB({
		position: new Grape2D.Vector(minX + (x / 2), minY + (y / 2)),
		width: x,
		height: y
	});
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.createSceneBV = function(renderer, camera) {
	return new Grape2D.AABB({
		position: camera.getLookAt(),
		width: renderer.getWidth() / camera.getScale().getX(),
		height: renderer.getHeight() / camera.getScale().getY()
	});
};
/**
 * Merge two AABBs into one, so that the one created bounds
 *   the other two.
 *
 * @param  {!Grape2D.AABB} aabb1 An AABB.
 * @param  {!Grape2D.AABB} aabb2 Another AABB.
 * @return {!Grape2D.AABB} An AABB that bounds the other two.
 */
Grape2D.AabbBVFactory.prototype.merge = function(aabb1, aabb2) {
	var ab1 = aabb1.createBV(this),
		ab2 = aabb2.createBV(this);
	var minx = Grape2D.Math.min(ab1.getMinX(), ab2.getMinX()),
		maxx = Grape2D.Math.max(ab1.getMaxX(), ab2.getMaxX()),
		miny = Grape2D.Math.min(ab1.getMinY(), ab2.getMinY()),
		maxy = Grape2D.Math.max(ab1.getMaxY(), ab2.getMaxY());
	return new Grape2D.AABB({
		minX: minx,
		minY: miny,
		maxX: maxx,
		maxY: maxy
	});
};
/**
 * @override
 */
Grape2D.AabbBVFactory.prototype.getPlaceHolder = function() {
	return Grape2D.AabbBVFactory.PLACE_HOLDER;
};
/**
 * Static palce holder for {@link Grape2D.AabbBVFactory.getPlaceHolder}
 *
 * @type {Grape2D.AABB}
 * @private
 * @static
 */
Grape2D.AabbBVFactory.PLACE_HOLDER = new Grape2D.AABB({
	width: 0,
	height: 0
});