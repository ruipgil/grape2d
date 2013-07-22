/**
 * A bounding volume hierarchy (BVH) organizes a bounding volumes according
 *   to an hierarchy.
 *   
 * @extends {Grape2D.Map}
 * @class
 * @interface
 */
Grape2D.BVHTree = function(){};

Grape2D.BVHTree.prototype = Object.create(Grape2D.Map.prototype);