/**
 * Grape2D.SnapshotEvent class.
 *
 * @param {!(number|string)} id Event unique identifier.
 * @implements {Grape2D.SnapshotElement}
 * @constructor
 */
Grape2D.SnapshotEvent = function(id) {
	Grape2D.SnapshotElement.call(this);
	/**
	 * Event unique identifier.
	 *
	 * @type {!(number|string)}
	 * @private
	 */
	this.id = id;
};

Grape2D.SnapshotEvent.prototype = Object.create(Grape2D.SnapshotElement.prototype);

/**
 * Gets the event id.
 *
 * @return {!(number|string)} Event id.
 * @public
 */
Grape2D.SnapshotEvent.prototype.getId = function() {
	return this.id;
};
/**
 * Fires the event.
 *
 * @param {!Object=} param An arbitrary object.
 * @public
 */
Grape2D.SnapshotEvent.prototype.fire = function(param) {};
/**
 * @override
 */
Grape2D.SnapshotEvent.prototype.process = function(processor) {
	processor.processSnapshotEvent(this);
};