/**
 * Creates bounding volumes based in an input object.
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
		list = polygon.getVertexList(),
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
		if (maxX < temp.getY()) {
			maxY = temp.getY();
		}
	}

	x = maxX - minX;
	y = maxY - minY;

	return new Grape2D.AABB({
		position: new Grape2D.Vector((x / 2) + x, (y / 2) + y),
		width: x,
		height: y
	});
};

Grape2D.AabbBVFactory.prototype.createSceneBV = function(renderer, camera) {
	return new Grape2D.AABB({
		position: camera.getLookAt(),
		width: renderer.getWidth()/camera.getScale().getX(),
		height: renderer.getHeight()/camera.getScale().getY()
	});
};

Grape2D.AabbBVFactory.prototype.merge = function(aabb1, aabb2) {
	//bdebugger;
	var dx = aabb2.getPosition().getX() - aabb1.getPosition().getX(),
		dy = aabb2.getPosition().getY() - aabb1.getPosition().getY(),
		w, h, temp,
		position = new Grape2D.Vector();

	if ((Grape2D.Math.abs(dx) + aabb2.getHalfWidth()) <= aabb1.getHalfWidth()) {
		w = aabb1.getWidth();
		position.setX(aabb1.getPosition().getX());
	} else {
		w = Grape2D.Math.abs(dx) + aabb2.getHalfWidth() + aabb1.getHalfWidth();
		if (aabb1.getPosition().getX() >= aabb2.getPosition().getX()) {
			temp = aabb1.getPosition().getX() + aabb1.getHalfWidth() - (w / 2);
		} else {
			temp = aabb1.getPosition().getX() - aabb1.getHalfWidth() + (w / 2);
		}
		position.setX(temp);
	}

	if ((Grape2D.Math.abs(dy) + aabb2.getHalfHeight()) <= aabb1.getHalfHeight()) {
		h = aabb1.getHeight();
		position.setY(aabb1.getPosition().getY());
	} else {
		h = Grape2D.Math.abs(dy) + aabb2.getHalfHeight() + aabb1.getHalfHeight();
		if (aabb1.getPosition().getY() >= aabb2.getPosition().getY()) {
			temp = aabb1.getPosition().getY() + aabb1.getHalfHeight() - (h / 2);
		} else {
			temp = aabb1.getPosition().getY() - aabb1.getHalfHeight() + (h / 2);
		}
		position.setY(temp);
	}

	return new Grape2D.AABB({
		width: w,
		height: h,
		position: position
	});
};