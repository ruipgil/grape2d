/**
 * A scene controls, at a high level, the running of the game.
 *   Being responsible for the updating and rendering.
 *   This is the component object of what is a composite pattern.
 * 
 * @interface
 */
Grape2D.Scene = function () {};

Grape2D.Scene.prototype = {
	constructor: Grape2D.Scene,
	/**
	 * Updates the scene.
	 *
	 * @param  {!number} dt Time elapsed since the last update.
	 * @public
	 */
	update: function (dt) {},
	/**
	 * Renders the scene to a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer Place to render the scene.
	 * @param  {!Grape2D.Camera} camera Camera to transform the coordinates
	 *   and to select the objects to be rendered.
	 * @public
	 */
	render: function (renderer, camera) {}
};