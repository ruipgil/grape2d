/**
 * Describes a simple game "scene", with the basics.
 *
 * @param  {!Grape2D.Renderer} renderer The renderer of the scene.
 * @param  {!Grape2D.Scene} scene A scene with a map.
 * @param  {!Grape2D.Camera} camera A camera to look at the scene.
 *
 * @implements {Grape2D.Game}
 * @constructor
 */
Grape2D.SimpleGame = function(renderer, scene, camera) {
	/**
	 * Camera of the scene.
	 *
	 * @type {!Grape2D.Camera}
	 * @private
	 */
	this.camera = camera;
	/**
	 * Clock to help updating at each frame.
	 *
	 * @type {!Grape2D.utils.Clock}
	 * @private
	 */
	this.clock = new Grape2D.utils.Clock();
	/**
	 * Renderer.
	 *
	 * @type {!Grape2D.Renderer}
	 * @private
	 */
	this.renderer = renderer;
	/**
	 * Scene.
	 *
	 * @type {!Grape2D.Scene}
	 * @private
	 */
	this.scene = scene;
};

Grape2D.SimpleGame.prototype = Object.create(Grape2D.Game.prototype);
/**
 * Gets the camera.
 *
 * @return {!Grape2D.Camera} The camera
 * @public
 */
Grape2D.SimpleGame.prototype.getCamera = function() {
	return this.camera;
};
/**
 * Gets the clock.
 *
 * @return {!Grape2D.utils.Clock} The clock.
 * @public
 */
Grape2D.SimpleGame.prototype.getClock = function() {
	return this.clock;
};
/**
 * Gets the renderer.
 *
 * @return {!Grape2D.Renderer} The renderer.
 * @public
 */
Grape2D.SimpleGame.prototype.getRenderer = function() {
	return this.renderer;
};
/**
 * Gets the scene.
 *
 * @return {!Grape2D.Scene} The scene.
 * @public
 */
Grape2D.SimpleGame.prototype.getScene = function() {
	return this.scene;
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.setup = function() {};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.start = function() {
	this.animate();
};
/**
 * @override
 * @suppress {undefinedVars}
 */
Grape2D.SimpleGame.prototype.stop = function() {
	cancelAnimationFrame();
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.render = function() {
	this.scene.render(this.renderer, this.camera);
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.update = function(dt) {
	this.scene.update(dt);
};
/**
 * @override
 */
Grape2D.SimpleGame.prototype.animate = function() {
	var that = this;
	requestAnimationFrame(function() {
		that.animate();
	});
	this.update(this.clock.update());
	this.render();
};