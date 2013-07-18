/**
 * Node of a top down BVH.
 *
 * @param  {?Grape2D.TopDownBVHNode} parent Parent node, or null, it it's
 *   the root node.
 * @param  {Array.<Grape2D.Object2D>} objects Objects to be added to the
 *   node.
 *
 * @constructor
 */
Grape2D.TopDownBVHNode = function(parent, objects) {
	/**
	 * Bounding volume.
	 * @private {Grape2D.Shape}
	 */
	this.bv = null;
	/**
	 * True if it's a leaf (end point of a tree), false if it's a node.
	 * @private {boolean}
	 */
	this.leaf = false;
	/**
	 * Objects of a leaf
	 * @private {Array.<Grape2D.Object2D>}
	 */
	this.objects = [];

	/**
	 * Parent node.
	 * @private {?Grape2D.TopDownBVHNode}
	 */
	this.parent = parent;
	/**
	 * Left child of a node.
	 * @private {?Grape2D.TopDownBVHNode}
	 */
	this.left = null;
	/**
	 * Right child of a node.
	 * @private {?Grape2D.TopDownBVHNode}
	 */
	this.right = null;

	this.depth = parent?parent.getDepth()+1:0;
	//debugger;
	this.compute(objects);
};

Grape2D.TopDownBVHNode.prototype = {
	constructor: Grape2D.TopDownBVHNode,
	/**
	 * Makes this instance a leaf or a node.
	 *
	 * @param  {Array.<Grape2D.Object2D>} objects List of objects to separate
	 *   through the node.
	 *
	 * @public
	 */
	compute: function(objects) {

		if (objects.length <= Grape2D.TopDownBVHNode.DEFAULT_PER_LEAF || this.depth >= Grape2D.TopDownBVHNode.MAX_DEPTH) {
			//this instance will be a leaf
			this.leaf = true;
			for (var i = 0; i < objects.length; i++) {
				this.objects.push(objects[i]);
			}
		} else {
			//this instance will be a node
			var r = Grape2D.BVHStrategySingleton.getStrategy().solve(objects),
				factory = Grape2D.BVFactorySingleton.getFactory();

			this.bv = factory.merge(objects[0].getBoundingBox(), objects[1].getBoundingBox());
			for (var i = 2; i < objects.length; i++) {
				this.bv = factory.merge(this.bv, objects[i].getBoundingBox());
			}

			this.left = new Grape2D.TopDownBVHNode(this, r.left);
			this.right = new Grape2D.TopDownBVHNode(this, r.right);
		}
	},
	/**
	 * Checks if it's a leaf
	 *
	 * @return {boolean} True if it's a leaf.
	 * @public
	 */
	isLeaf: function() {
		return this.leaf;
	},
	/**
	 * Gets the bounding volume.
	 *
	 * @return {Grape2D.Shape} The bounding volume.
	 * @public
	 */
	getBoundingVolume: function() {
		return this.bv;
	},
	/**
	 * Gets the parent.
	 *
	 * @return {?Grape2D.TopDownBVHNode} The parent, or null if it's the root.
	 * @public
	 */
	getParent: function() {
		return this.parent;
	},
	/**
	 * Gets the objects, if it's a leaf.
	 *
	 * @return {Array.<Grape2D.Object2D>} List of the objects.
	 * @public
	 */
	getObjects: function() {
		return this.objects;
	},
	/**
	 * Gets the left side of the node.
	 *
	 * @return {?Grape2D.TopDownBVHNode} Left side node, or null, if it's a
	 *   leaf.
	 * @public
	 */
	getLeft: function() {
		return this.left;
	},
	/**
	 * Gets the right side of the node.
	 *
	 * @return {?Grape2D.TopDownBVHNode} Right side node, or null, if it's a
	 *   leaf.
	 * @public
	 */
	getRight: function() {
		return this.left;
	},
	query: function(shape) {
		var res = [],
			i;
		if (this.leaf) {
			for (i = 0; i < this.objects.length; i++) {
				if (Grape2D.CollisionCheckerSingleton.collide(shape, this.objects[i].getBoundingBox())) {
					res.push(this.objects[i]);
				}
			}
		} else {
			if (Grape2D.CollisionCheckerSingleton.collide(shape, this.bv)) {
				var list = this.left.query(shape);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				list = this.right.query(shape);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				return res;
			}
		}
		return res;
	},
	queryPoint: function(vector) {
		var res = [],
			i;
		if (this.leaf) {
			for (i = 0; i < this.objects.length; i++) {
				if (Grape2D.CollisionCheckerSingleton.contains(vector, this.objects[i].getBoundingBox())) {
					res.push(this.objects[i]);
				}
			}
		} else {
			if (Grape2D.CollisionCheckerSingleton.contains(vector, this.bv)) {
				var list = this.left.queryPoint(vector);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				list = this.right.queryPoint(vector);
				for (i = 0; i < list.length; i++) {
					res.push(list[i]);
				}

				return res;
			} else {
				return res;
			}
		}
	},
	getDepth: function(){
		return this.depth;
	}
};

/**
 * Minimum of objects per leaf.
 * @constant {number}
 */
Grape2D.TopDownBVHNode.DEFAULT_PER_LEAF = 2;

Grape2D.TopDownBVHNode.MAX_DEPTH = 50;