/**
 * Represents a simplified version of a network object.
 *   To be converted to or from a snapshot.
 *
 * @param {!(number|string)} id Object unique identifier.
 * @param {!number} posX The x coordinate, of the position.
 * @param {!number} posY The y coordinate, of the position.
 * @implements {Grape2D.SnapshotElement}
 * @constructor
 */
Grape2D.SnapshotNetworkObject2D = function(id, posX, posY) {
	Grape2D.SnapshotElement.call(this);
	/**
	 * Unique object id.
	 *
	 * @type {!(number|string)}
	 * @private
	 */
	this.id = id;
	/**
	 * Object's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector(posX, posY);
};

Grape2D.SnapshotNetworkObject2D.prototype = Object.create(Grape2D.SnapshotElement.prototype);
/**
 * Gets object's id.
 *
 * @return {!(number|string)} Object id.
 * @public
 */
Grape2D.SnapshotNetworkObject2D.prototype.getId = function() {
	return this.id;
};
/**
 * Gets object's position.
 *
 * @return {!Grape2D.Vector} Object position.
 * @public
 */
Grape2D.SnapshotNetworkObject2D.prototype.getPosition = function() {
	return this.position;
};
/**
 * Updates the corresponding {@link Grape2D.NetworkObject2D},
 *   with the data of this one.
 *
 * @param  {!Object=} param An arbitrary object.
 * @public
 */
Grape2D.SnapshotNetworkObject2D.prototype.updateNetworkObject2D = function(param) {};
/**
 * @override
 */
Grape2D.SnapshotNetworkObject2D.prototype.process = function(processor) {
	processor.processSnapshotNetworkObject2D(this);
};