/**
 * Represents a simplified version of a network object.
 *   To be converted to or from a snapshot.
 *
 * @param {!(number|string)} id Object unique identifier.
 * @param {!number} posX The x coordinate, of the position.
 * @param {!number} posY The y coordinate, of the position.
 * @constructor
 */
Grape2D.SnapshotNetworkObject2D = function(id, posX, posY) {
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

Grape2D.SnapshotNetworkObject2D.prototype = {
	constructor: Grape2D.SnapshotNetworkObject2D,
	/**
	 * Gets object's id.
	 *
	 * @return {!(number|string)} Object id.
	 * @public
	 */
	getId: function() {
		return this.id;
	},
	/**
	 * Gets object's position.
	 *
	 * @return {!Grape2D.Vector} Object position.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Updates the corresponding {@link Grape2D.NetworkObject2D},
	 *   with the data of this one.
	 *
	 * @param  {!Object=} param An arbitrary object.
	 * @public
	 */
	updateNetworkObject2D: function(param) {
		/*var nob = Grape2D.NetworkObject2DBase.get(this.id);
		if (nob) {
			nob.setPosition(this.position);
		}*/
	}
};