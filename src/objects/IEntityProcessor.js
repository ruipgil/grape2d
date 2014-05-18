/**
 * @class
 * @interface
 */
Grape2D.IEntityProcessor = function() {};
Grape2D.IEntityProcessor.prototype = {
	constructor: Grape2D.IEntityProcessor,
	/**
	 * Processes an {@see Grape2D.Entity}.
	 *
	 * @param  {!Grape2D.Entity} entity Entity to process.
	 * @public
	 */
	processEntity: function(entity) {},
	/**
	 * Processes an {@see Grape2D.REntity}.
	 *
	 * @param  {!Grape2D.REntity} rentity Entity to process.
	 * @public
	 */
	processREntity: function(rentity) {},
	/**
	 * Processes an {@see Grape2D.NetworkEntity}.
	 *
	 * @param  {!Grape2D.Entity} nentity Entity to process.
	 * @public
	 */
	processNetworkEntity: function(nentity) {}
};