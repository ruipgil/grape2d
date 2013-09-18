/**
 * Interface for snapshot encoding.
 *
 * @extends {Grape2D.SnapshotElementProcessor}
 * @interface
 */
Grape2D.ISnapshotEncoder = function() {
	Grape2D.SnapshotElementProcessor.call(this);
};

Grape2D.ISnapshotEncoder.prototype = Object.create(Grape2D.SnapshotElementProcessor.prototype);
/**
 * Gets the result of the encoding.
 *
 * @return {!string} Snapshot encoded.
 * @public
 */
Grape2D.ISnapshotEncoder.prototype.getResult = function() {};