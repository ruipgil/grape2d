/**
 * This holds a limited history of snapshots received from the server.
 *   The snapshots are organized by the order received, and hold the
 *   current time when they were received.
 *
 * @param {!number=} cap Maximum number of entries on the history. The
 *   default value is 10.
 * @constructor
 */
Grape2D.SnapshotHistory = function(cap) {
	/**
	 * Maximum length of the history.
	 *
	 * @type {!number}
	 * @private
	 */
	this.cap = cap || 10;
	/**
	 * List with the history record.
	 *
	 * @type {!Array.<!Object>}
	 * @private
	 */
	this.history = [];
};
Grape2D.SnapshotHistory.prototype = {
	constructor: Grape2D.SnapshotHistory,
	/**
	 * Adds a snapshot to the history. Discards the older one
	 *   if it has reached the entry limit.
	 *
	 * @param {!Object} snapshot Snapshot received.
	 * @public
	 */
	add: function(snapshot) {
		if (this.history.length >= this.cap) {
			this.history.shift();
		}
		this.history.push(snapshot);
		this.history.sort(function(a, b){
			return a.time-b.time;
		});
	},
	/**
	 * Gets the snapshot received immediately before a
	 *   given time.
	 *
	 * @param  {!number} time Reference time, in milliseconds.
	 * @return {?Object} A string if it has found a valid
	 *   snapshot before the time, null otherwise.
	 * @public
	 */
	getBefore: function(time) {
		for (var i = this.history.length-1; i >= 0; i--) {
			if (this.history[i].time < time) {
				return this.history[i];
			}
		}
		return null;
	},
	/**
	 * Gets the snapshot received immediately after a
	 *   given time.
	 *
	 * @param  {!number} time Reference time, in milliseconds.
	 * @return {?Object} A string if it has found a valid
	 *   snapshot after the time, null otherwise.
	 * @public
	 */
	getAfter: function(time) {
		for (var i = 0; i < this.history.length; i++) {
			if (this.history[i].time > time) {
				return this.history[i];
			}
		}
		return null;
	},
	/**
	 * Gets the history list.
	 *
	 * @return {!Array.<!Object>} Snapshot
	 *   history record.
	 * @public
	 */
	getHistory: function() {
		return this.history;
	},
	/**
	 * Gets the limit of snapshots recorded.
	 *
	 * @return {!number} Maximum number of snapshots that can
	 *   be stored.
	 * @public
	 */
	getCap: function() {
		return this.cap;
	},
	/**
	 * Sets the limit of snapshots recorded. If the limit is lower
	 *   than the previous one, the record is adjusted to the correct
	 *   length if needed be.
	 *
	 * @param {!number} cap Maximum number of snapshots that can
	 *   be stored.
	 * @public
	 */
	setCap: function(cap) {
		this.cap = cap;
		while (this.history.length > this.cap) {
			this.history.shift();
		}
	}
};