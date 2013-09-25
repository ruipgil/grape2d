/**
 * Decodes a snapshot representation, into a {@link Grape2D.Snapshot}.
 *
 * @implements {Grape2D.ISnapshotDecoder}
 * @constructor
 */
Grape2D.SnapshotDecoder = function() {
	Grape2D.ISnapshotDecoder.call(this);
};

Grape2D.SnapshotDecoder.prototype = Object.create(Grape2D.ISnapshotDecoder.prototype);
/**
 * @override
 */
Grape2D.SnapshotDecoder.prototype.decode = function(string) {
	try {
		var parsed = JSON.parse(string),
			result = new Grape2D.Snapshot(Number(parsed.time));
		for (var e in parsed.events) {
			result.addEvent(this.decodeSnapshotEvent(parsed.events[e]));
		}
		for (var b in parsed.objects) {
			result.addSnapshotNetworkObject2D(this.decodeSnapshotNetworkObject2D(parsed.objects[b]));
		}
		return result;
	} catch (e) {
		return null;
	}
};
/**
 * Decodes a snapshot network object.
 *
 * @param  {!Object} object Encoded object.
 * @return {!Grape2D.SnapshotNetworkObject2D} Decoded snapshot
 *   network object.
 * @protected
 */
Grape2D.SnapshotDecoder.prototype.decodeSnapshotNetworkObject2D = function(object) {
	return new Grape2D.SnapshotNetworkObject2D(object.id, object.position.x, object.position.x);
};
/**
 * Decodes a snapshot event.
 *
 * @param  {!Object} event Encoded event.
 * @return {!Grape2D.SnapshotEvent} Decoded snapshot event.
 * @protected
 */
Grape2D.SnapshotDecoder.prototype.decodeSnapshotEvent = function(event) {
	return new Grape2D.SnapshotEvent(event.id);
};