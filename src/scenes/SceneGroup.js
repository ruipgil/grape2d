/**
 * SceneGroup allow to group scenes together.
 * This is the composite object of the composite pattern.
 *
 * @constructor
 * @implements {Grape2D.Scene}
 */
Grape2D.SceneGroup = function () {
	/**
	 * Children of this scene.
	 * @type {Array.<Grape2D.Scene>}
	 */
	this.childs = [];
};

Grape2D.SceneGroup.prototype = Object.create(Grape2D.Scene.prototype);
/**
 * @override
 */
Grape2D.SceneGroup.prototype.update = function (dt) {
	for (var i = 0; i < this.childs.length; i++) {
		this.childs[i].update(dt);
	}
};
/**
 * @override
 */
Grape2D.SceneGroup.prototype.render = function (renderer, camera) {
	for (var i = 0; i < this.childs.length; i++) {
		this.childs[i].render(renderer, camera);
	}
};
/**
 * Adds a child scene
 * @param  {Grape2D.Scene} child Child scene.
 * @public
 */
Grape2D.SceneGroup.prototype.addChild = function (child) {
	this.childs.push(child);
};
/**
 * Removes a child scene.
 *
 * @param  {Grape2D.Scene} child Child to remove.
 */
Grape2D.SceneGroup.prototype.removeChild = function (child) {
	this.childs.splice(this.childs.indexOf(child), 1);
};