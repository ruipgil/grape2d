/**
 * Snapshot manager.
 *
 * @param {!Grape2D.utils.Clock} clock A clock.
 * @param {!Grape2D.SnapshotHistory} history Snapshot buffer.
 * @param {!number} lerp Interpolation time, in millisecond.
 * @constructor
 */
Grape2D.SnapshotManager = function(clock, history, lerp) {
	/**
	 * Game clock.
	 *
	 * @type {!Grape2D.utils.Clock}
	 * @private
	 */
	this.clock = clock;
	/**
	 * Snapshot history.
	 *
	 * @type {!Grape2D.SnapshotHistory}
	 * @private
	 */
	this.history = history;
	/**
	 * Interpolation time between state and snapshot.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lerp = lerp || 100;
	/**
	 * Inverse of the interpolation time.
	 *
	 * @type {!number}
	 * @private
	 */
	this.iLerp = 1 / this.lerp;
	/**
	 * Current snapshot, being used.
	 *
	 * @type {?Object}
	 * @private
	 */
	this.currentSnapshot = null;
	/**
	 * Interpolation percent, of the cycle.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lerpPercent = 0;
};
Grape2D.SnapshotManager.prototype = {
	constructor: Grape2D.SnapshotManager,
	/**
	 * Gets the current snapshot.
	 *
	 * @return {?Object} Snapshot object.
	 * @public
	 */
	getSnapshot: function() {
		return this.currentSnapshot;
	},
	/**
	 * Gets a network entity by it's id.
	 *
	 * @param  {!string} id Object's id.
	 * @return {?Grape2D.INetworkEntity} Network entity, if there's one,
	 *   or either null or undefined if there's none.
	 * @public
	 */
	getNetworkEntity: function(id) {
		return (this.currentSnapshot ? this.currentSnapshot[id] : null);
	},
	/**
	 * Gets the interpolation percentage.
	 *
	 * @return {!number} Number between 0 and 1.
	 * @public
	 */
	getLerpPercent: function() {
		return this.lerpPercent;
	},
	/**
	 * Method to set up the cycle.
	 *
	 * @public
	 */
	update: function() {
		var time = this.clock.getTime();
		this.currentSnapshot = this.history.getBefore(time);
		if (this.currentSnapshot) {
			this.lerpPercent = (time - this.lerp - this.currentSnapshot.getTime()) / this.iLerp; //TOFIX?
		} else {
			this.lerpPercent = 0;
		}
	}
};