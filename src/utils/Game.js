/**
 * Interface that defines high level methods for a game.
 *
 * @class
 * @interface
 */
Grape2D.Game = function() {};

Grape2D.Game.prototype = {
	constructor: Grape2D.Game,
	/**
	 * Sets up the game. It should be executed before any other method.
	 *
	 * @public
	 */
	setup: function() {},
	/**
	 * Starts the animation process.
	 *
	 * @public
	 */
	start: function() {},
	/**
	 * Stop the animation process.
	 *
	 * @public
	 */
	stop: function() {},
	/**
	 * Renders what needed be, to the right places.
	 *
	 * @public
	 */
	render: function() {},
	/**
	 * Updates the game, between frames.
	 *
	 * @param  {!number} dt The miliseconds elapsed since the last
	 *   animation call.
	 *
	 * @public
	 */
	update: function(dt) {},
	/**
	 * Calls the others methods, and "prepare" the next frame.
	 *
	 * @public
	 */
	animate: function() {}
};