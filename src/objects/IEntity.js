/**
 * An entity interface is any object, in a 2D space and bounded by a
 *   shape.
 *
 * @class
 * @interface
 */
Grape2D.IEntity = function() {};
Grape2D.IEntity.prototype = {
	constructor: Grape2D.IEntity,
	/**
	 * Gets the position.
	 *
	 * @return {!Grape2D.Vector} Central position.
	 * @public
	 */
	getPosition: function(){},
	/**
	 * Sets the position.
	 *
	 * @param {!Grape2D.Vector} position Position.
	 * @public
	 */
	setPosition: function(position){},
	/**
	 * Gets the bounding box.
	 *
	 * @return {!Grape2D.IShape} Bounding box.
	 * @public
	 */
	getBoundingBox: function(){},
	/**
	 * Sets the bounding box.
	 *
	 * @param {!Grape2D.IShape} boundingBox Bounding box.
	 * @public
	 */
	setBoundingBox: function(boundingBox){},
	/**
	 * Gets the bounding box offset.
	 *
	 * @return {!Grape2D.Vector} Offset.
	 * @public
	 */
	getBoundingBoxOffset: function(){},
	/**
	 * Sets the bounding box offset.
	 *
	 * @param {!Grape2D.Vector} boundingBoxOffset Offset.
	 * @public
	 */
	setBoundingBoxOffset: function(boundingBoxOffset){},
	/**
	 * Updates the entity.
	 *
	 * @param  {!number} dt Time difference since the last update.
	 * @public
	 */
	update: function(dt) {},
	/**
	 * Processes this entity in a given processor.
	 *
	 * @param  {!Grape2D.IEntityProcessor} processor Processor.
	 * @public
	 */
	process: function(processor){}
};