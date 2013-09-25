/**
 * SnapshotElementProcessor class.
 *
 * @class
 * @interface
 */
Grape2D.SnapshotElementProcessor = function() {};

Grape2D.SnapshotElementProcessor.prototype = {
	constructor: Grape2D.SnapshotElementProcessor,
	/**
	 * Processes a snapshot.
	 *
	 * @param  {!Grape2D.Snapshot} snapshot Snapshot.
	 * @public
	 */
	processSnapshot: function(snapshot) {},
	/**
	 * Processes a snapshot event.
	 *
	 * @param  {!Grape2D.SnapshotEvent} snapshotEvent Snapshot event.
	 * @public
	 */
	processSnapshotEvent: function(snapshotEvent) {},
	/**
	 * Processes a snapshot network object 2D.
	 *
	 * @param  {!Grape2D.SnapshotNetworkObject2D} snapshotNO2D Snapshot
	 *   network object 2D.
	 * @public
	 */
	processSnapshotNetworkObject2D: function(snapshotNO2D) {}
};