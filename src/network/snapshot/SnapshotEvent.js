/**
 * Grape2D.SnapshotEvent class.
 *
 * @param {!(number|string)} id Event unique identifier.
 * @implements {Grape2D.SnapshotElement}
 * @constructor
 */
Grape2D.SnapshotEvent = function() {
	Grape2D.SnapshotElement.call(this);
};

Grape2D.SnapshotEvent.prototype = Object.create(Grape2D.SnapshotElement.prototype);
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