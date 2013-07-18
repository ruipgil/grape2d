/**
 * The median cut algorithm splits the set in two equal parts, along the
 *   selected axis. It creates a more balanced tree. However unbalanced
 *   trees perform better.
 * @implements {Grape2D.BVHStrategy}
 * @constructor
 */
Grape2D.MedianCutBVHStrategy = function () {};

Grape2D.MedianCutBVHStrategy.prototype = Object.create(Grape2D.BVHStrategy.prototype);

/**
 * This heuristic does the follow:
 * <ol>
 * <li> Compute the bounding box of the set of AABB center points
 * <li> Choose the plane that splits the box in half along the longest
 *   axis
 * <li> Objects at the left of the axis will be places at the left side,
 *   the others at the right side.
 * <ol>
 * Heuristic described by Gino van den Bergen (gino@dtecta.com), from his GDC conference titled "Physics for Game Programmers:
Spatial Data Structures".
 * @override
 */
Grape2D.MedianCutBVHStrategy.prototype.solve = function (objects) {
	var result = {
		left: [],
		right: []
	};

	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity,
		axis = 0,
		temp;


	for(var i=0; i<objects.length; i++){
		temp = objects[i].getBoundingBoxPosition();
		if(minX>temp.getX()){
			minX = temp.getX();
		}
		if(maxX<temp.getX()){
			maxX = temp.getX();
		}
		if(minY>temp.getY()){
			minY = temp.getY();
		}
		if(maxY<temp.getY()){
			maxY = temp.getY();
		}
	}

	if( (minX+maxX)>=(minY+maxY) ){
		axis = (maxX+minX)/2;

		for(i=0; i<objects.length; i++){
			temp = objects[i].getBoundingBoxPosition();
			if(temp.getX()>axis){
				result.right.push(objects[i]);
			}else{
				result.left.push(objects[i]);
			}
		}
	}else{
		axis = (maxY+minY)/2;

		for(i=0; i<objects.length; i++){
			temp = objects[i].getBoundingBoxPosition();
			if(temp.getY()>axis){
				result.right.push(objects[i]);
			}else{
				result.left.push(objects[i]);
			}
		}
	}
	return result;
};