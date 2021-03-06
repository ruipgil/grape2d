/**
 * With the top down approach the area of the bounding volume will reduce
 *   at every level.
 *
 * @param  {?Array.<Grape2D.Object2D>} objs List with objects. If objects are provided then tree will be build.
 *
 * @implements {Grape2D.BVHTree}
 * @constructor
 */
Grape2D.TopDownBVHTree = function(objs) {
	/**
	 * Objects of the tree
	 * @type {!Array.<Grape2D.Object2D>}
	 * @private
	 */
	this.objs = objs || [];
	/**
	 * The root node of the tree.
	 * @type {?Grape2D.TopDownBVHNode}
	 * @private
	 */
	this.rootNode = null;
	//builds the tree if needed be.
	if (this.objs.length) {
		this.rebuild();
	}
};

Grape2D.TopDownBVHTree.prototype = Object.create(Grape2D.BVHTree.prototype);
/**
 * (Re)Builds the tree, based on the objects present on the stack.
 *
 * @override
 */
Grape2D.TopDownBVHTree.prototype.rebuild = function() {
	this.rootNode = new Grape2D.TopDownBVHNode(null, this.objs);
};
/**
 * Adding objects to the tree will not cause it to rebuild.
 * @override
 */
Grape2D.TopDownBVHTree.prototype.add = function(obj) {
	this.objs.push(obj);
};
/**
 * Removing objects from the tree will not cause it to rebuild.
 * @override
 */
Grape2D.TopDownBVHTree.prototype.remove = function(obj) {
	this.objs.splice(this.objs.indexOf(obj), 1);
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.query = function(bv) {
	if (this.rootNode) {
		return this.rootNode.query(bv);
	} else {
		return [];
	}
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.queryPoint = function(vector) {
	if (this.rootNode) {
		return this.rootNode.query(vector);
	} else {
		return [];
	}
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.queryRay = function(ray) {
	if (this.rootNode) {
		return this.rootNode.queryRay(ray);
	} else {
		return null;
	}
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.clear = function() {
	this.objs = [];
	this.rootNode = null;
};
/**
 * @override
 */
Grape2D.TopDownBVHTree.prototype.update = function(dt, scene) {
	for (var i = 0; i < this.objs.length; i++) {
		this.objs[i].update(dt, scene);
	}
};
/**
 * Gets the root node of the tree
 *
 * @return  {?Grape2D.TopDownBVHNode} Root node of the tree.
 * @public
 */
Grape2D.TopDownBVHTree.prototype.getRootNode = function() {
	return this.rootNode;
};
/**
 * Maximum depth of the tree.
 *
 * @constant {!number}
 * @public
 */
Grape2D.TopDownBVHTree.MAX_DEPTH = 5;
/**
 * Minimum of objects per leaf.
 * @constant {!number}
 * @public
 */
Grape2D.TopDownBVHTree.DEFAULT_PER_LEAF = 2;