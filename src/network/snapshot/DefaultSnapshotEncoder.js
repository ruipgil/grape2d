/**
 * Encodes stuff and creates a snapshot.
 *
 * @param {!Grape2D.utils.Clock} clock Clock to get the time.
 *
 * @implements {Grape2D.IEntityProcessor}
 * @constructor
 */
Grape2D.DefaultSnapshotEncoder = function(clock) {
	/**
	 * Clock to use.
	 *
	 * @type {!Grape2D.utils.Clock}
	 * @private
	 */
	this.clock = clock;
	/**
	 * Network events.
	 *
	 * @type {!Array.<!Object.<!string, !(string|number)>>}
	 * @private
	 */
	this.events = [];
	/**
	 * Simple version of network entities.
	 *
	 * @type {!Object.<!string, !Object.<!string, !Object.<!string, !number>>>}
	 * @private
	 */
	this.entities = {};
};
Grape2D.DefaultSnapshotEncoder.prototype = Object.create(Grape2D.IEntityProcessor.prototype);
/**
 * Clears the data from the last snapshot.
 *
 * @public
 */
Grape2D.DefaultSnapshotEncoder.prototype.start = function() {
	this.events = [];
	this.entities = {};
};
/**
 * The snapshot encoder doesn't support {@see Grape2D.Entity}.
 * 
 * @override
 */
Grape2D.DefaultSnapshotEncoder.prototype.processEntity = function(entity) {};
/**
 * The {@see Grape2D.REntity} may contain a {@see Grape2D.NetworkEntity}.
 * 
 * @override
 */
Grape2D.DefaultSnapshotEncoder.prototype.processREntity = function(entity) {
	entity.process(this);
};
/**
 * Creates a simple version of the given network entity and add's it
 *   to the pool. In a custom implementation it may instead serialize
 *   and then add it to the pool of entities.
 * 
 * @override
 */
Grape2D.DefaultSnapshotEncoder.prototype.processNetworkEntity = function(nentity) {
	this.entities[nentity.getUUID()] = {
		position: {
			x: nentity.getPosition().getX(),
			y: nentity.getPosition().getY(),
		}
	};
};
/**
 * Creates a simple version of the given network event and adds it to
 *   the pool. In a custom implementation it may instead serialize
 *   and then add it to the pool of entities.
 *
 * @param {!Object.<!string, !(string|number)>} nevent Network event.
 * @public
 */
Grape2D.DefaultSnapshotEncoder.prototype.addNetworkEvent = function(nevent) {
	this.events.push(nevent);
};
/**
 * Gets the snapshot encoded. It also destroys the snapshot
 *   information.
 *
 * @return {!string} Snapshot encoded.
 * @public
 */
Grape2D.DefaultSnapshotEncoder.prototype.getSnapshotEncoded = function() {
	var result = JSON.stringify({
		time: this.clock.getTime(),
		networkEvents: this.events,
		NetworkEntities: this.entities
	});
	this.events = [];
	this.entities = {};
	return result;
};