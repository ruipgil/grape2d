/**
 * SceneLayer allow to render objects and update them, the objects are
 *   store using a {@link Grape2D.Map}.
 *   This is the leaf object of the composite pattern.
 *
 * @implements {Grape2D.Scene}
 * @constructor
 */
Grape2D.SceneLayer = function(options) {
	options = options || {};
	/**
	 * Scene map.
	 *
	 * @type {!Grape2D.Map}
	 * @private
	 */
	this.map = options.map || new Grape2D.SimpleMap();
};

Grape2D.SceneLayer.prototype = Object.create(Grape2D.Scene.prototype);
/**
 * @override
 */
Grape2D.SceneLayer.prototype.update = function(dt) {
	this.map.update(dt);
};
/**
 * @override
 */
Grape2D.SceneLayer.prototype.render = function(renderer, camera) {
	var elms = this.map.query(Grape2D.BVFactorySingleton.getFactory().createSceneBV(renderer, camera));
	renderer.start(camera);
	for (var i = 0; i < elms.length; i++) {
		elms[i].render(renderer);
	}
	renderer.end();
};
/**
 * Gets the map being used.
 *
 * @return {!Grape2D.Map} The map.
 * @public
 */
Grape2D.SceneLayer.prototype.getMap = function() {
	return this.map;
};