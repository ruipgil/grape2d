/**
 * Interface for snapshot decoding.
 *
 * @interface
 */
Grape2D.ISnapshotDecoder = function() {};

Grape2D.ISnapshotDecoder.prototype = {
	constructor: Grape2D.ISnapshotDecoder,
	/**
	 * Decodes a string into a snapshot.
	 *
	 * @param  {!string} encoded Snapshot encoded.
	 * @return {?Grape2D.Snapshot} Snapshot decoded.
	 * @public
	 */
	decode: function(encoded) {}
};