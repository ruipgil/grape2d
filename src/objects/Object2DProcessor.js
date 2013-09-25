/**
 * Processes objects. Visitor pattern.
 *
 * @class
 * @interface
 */
Grape2D.Object2DProcessor = function() {};

Grape2D.Object2DProcessor.prototype = {
	constructor: Grape2D.Object2DProcessor,
	/**
	 * Processes an Object2D.
	 *
	 * @param  {!Grape2D.Object2D} object2d An Object2D.
	 * @public
	 */
	processObject2D: function(object2d) {},
	/**
	 * Processes an NetworkObject2D.
	 *
	 * @param  {!Grape2D.NetworkObject2D} networkObject2D A NetworkObject2D.
	 * @public
	 */
	processNetworkObject2D: function(networkObject2D) {}
};