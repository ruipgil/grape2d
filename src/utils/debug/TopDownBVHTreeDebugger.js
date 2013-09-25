Grape2D.utils.TopDownBVHTreeDebugger = {
	renderNode: function(node, renderer, camera) {
		node.getBoundingVolume().render(renderer, camera);
		renderer.renderText(node.getDepth(), camera.wcsToViewport(renderer, node.getBoundingVolume().getPosition()));
		if (node.getLeft()) {
			renderer.setStrokeColor("rgba(0,255,0,0.6)");
			Grape2D.TopDownBVHTreeDebugger.renderNode(node.getLeft(), renderer, camera);
			renderer.setStrokeColor("rgba(0,0,0,1)");
		}
		if (node.getRight()) {
			renderer.setStrokeColor("rgba(0,0,255,0.6)");
			Grape2D.TopDownBVHTreeDebugger.renderNode(node.getRight(), renderer, camera);
			renderer.setStrokeColor("rgba(0,0,0,1)");
		}
	},
	render: function(tree, renderer, camera) {
		if (tree.getRootNode()) {
			Grape2D.TopDownBVHTreeDebugger.renderNode(tree.getRootNode(), renderer, camera);
		}
	}
};