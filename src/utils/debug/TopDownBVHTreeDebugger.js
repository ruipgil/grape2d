/**
 * Visual debugger for the {@link Grape2D.TopDownBVHTree}
 *   map structure.
 *
 * @class
 */
Grape2D.utils.TopDownBVHTreeDebugger = {
	/**
	 * Renders the debug information for a {@link Grape2D.TopDownBVHNode}.
	 *
	 * @param  {!Grape2D.TopDownBVHNode} node Node.
	 * @param  {!Grape2D.Renderer} renderer Renderer.
	 * @param  {!Grape2D.Camera} camera Camera.
	 * @public
	 * @static
	 */
	renderNode: function(node, renderer, camera) {
		node.getBoundingVolume().render(renderer, camera);
		renderer.renderText(node.getDepth(), camera.wcsToViewport(renderer, node.getBoundingVolume().getPosition()));
		var left = node.getLeft(),
			right = node.getRight();
		if (left) {
			/** typedef {!Grape2D.TopDownBVHNode} */
			left;
			renderer.setStrokeColor("rgba(0,255,0,0.6)");
			Grape2D.utils.TopDownBVHTreeDebugger.renderNode(left, renderer, camera);
			renderer.setStrokeColor("rgba(0,0,0,1)");
		}
		if (right) {
			/** typedef {!Grape2D.TopDownBVHNode} */
			right;
			renderer.setStrokeColor("rgba(0,0,255,0.6)");
			Grape2D.utils.TopDownBVHTreeDebugger.renderNode(right, renderer, camera);
			renderer.setStrokeColor("rgba(0,0,0,1)");
		}
	},
	/**
	 * Renders the debug information for a {@link Grape2D.TopDownBVHTree}.
	 *
	 * @param  {!Grape2D.TopDownBVHTree} tree Tree.
	 * @param  {!Grape2D.Renderer} renderer Renderer.
	 * @param  {!Grape2D.Camera} camera Camera.
	 * @public
	 * @static
	 */
	render: function(tree, renderer, camera) {
		var root = tree.getRootNode();
		if (root) {
			/** typedef {!Grape2D.TopDownBVHNode} */
			root;
			Grape2D.utils.TopDownBVHTreeDebugger.renderNode(root, renderer, camera);
		}
	}
};