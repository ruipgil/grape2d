/**
 * The median cut algorithm splits the set in two equal parts, along the
 *   selected axis. It creates a more balanced tree. However unbalanced
 *   trees perform better.
 *
 * @implements {Grape2D.BVHStrategy}
 * @constructor
 */
Grape2D.MedianCutBVHStrategy = function() {};

Grape2D.MedianCutBVHStrategy.prototype = Object.create(Grape2D.BVHStrategy.prototype);

/**
 * This heuristic does the follow:
 * <ol>
 * <li> Compute the bounding box of the set of AABB center points
 * <li> Choose the plane that splits the box in half along the longest
 *   axis
 * <li> Objects at the left of the axis will be places at the left side,
 *   the others at the right side.
 * <li> If the bounding box has width and height of 0 then a flag is set
 *   to indicate that the objects should stay at the same leaf.
 * Heuristic described by Gino van den Bergen (gino@dtecta.com), from his GDC
 *   conference titled "Physics for Game Programmers: Spatial Data Structures".
 * @override
 */
Grape2D.MedianCutBVHStrategy.prototype.solve = function(objects) {
	var result = {
		left: [],
		right: [],
		endState: false
	};

	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity,
		axis = 0,
		temp;


	for (var i = 0; i < objects.length; i++) {
		temp = objects[i].getBoundingBox().getPosition();
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

	if ((maxX - minX) === 0 && (maxY - minY) === 0) {
		result.endState = true;
		return result;
	}

	if ((Grape2D.Math.abs(maxX) - Grape2D.Math.abs(minX)) >= (Grape2D.Math.abs(maxY) - Grape2D.Math.abs(minY))) {
		axis = minX + Grape2D.Math.abs((maxX - minX) / 2);

		for (i = 0; i < objects.length; i++) {
			temp = objects[i].getBoundingBox().getPosition();
			if (temp.getX() > axis) {
				result.right.push(objects[i]);
			} else {
				result.left.push(objects[i]);
			}
		}
	} else {
		axis = minY + Grape2D.Math.abs((maxY - minY) / 2);

		for (i = 0; i < objects.length; i++) {
			temp = objects[i].getBoundingBox().getPosition();
			if (temp.getY() > axis) {
				result.right.push(objects[i]);
			} else {
				result.left.push(objects[i]);
			}
		}
	}
	return result;
};