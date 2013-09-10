/**
 * Grape2D.SnapshotEvent class.
 *
 * @param {!(number|string)} id Event unique identifier.
 * @constructor
 */
Grape2D.SnapshotEvent = function(id) {
	/**
	 * Event unique identifier.
	 *
	 * @type {!(number|string)}
	 * @private
	 */
	this.id = id;
};

Grape2D.SnapshotEvent.prototype = {
	constructor: Grape2D.SnapshotEvent,
	/**
	 * Gets the event id.
	 *
	 * @return {!(number|string)} Event id.
	 * @public
	 */
	getId: function() {
		return this.id;
	},
	/**
	 * Fires the event.
	 *
	 * @param {!Object=} param An arbitrary object.
	 * @public
	 */
	fire: function(param) {}
};