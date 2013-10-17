/**
 * Encodes snapshot.
 *
 * @implements {Grape2D.ISnapshotEncoder}
 * @constructor
 */
Grape2D.SnapshotEncoder = function() {
	Grape2D.SnapshotElementProcessor.call(this);
	this.events = [];
	this.objects = [];
	this.time = 0;
};

Grape2D.SnapshotEncoder.prototype = Object.create(Grape2D.SnapshotElementProcessor.prototype);
/**
 * Adds an encoded event.
 *
 * @param {!Object} event Event encoded.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.addEventEncoded = function(event) {
	this.events.push(event);
};
/**
 * Gets the list of snapshot events encoded.
 *
 * @return {!Array.<!Object>} Events encoded.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.getEventsEncoded = function() {
	return this.events;
};
/**
 * Gets the list of snapshot network objects encoded.
 *
 * @return {!Array.<!Object>} Objects encoded.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.getObjectsEncoded = function() {
	return this.objects;
};
/**
 * Adds an encoded network object.
 *
 * @param {!Object} obj Network object encoded.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.addObjectEncoded = function(obj) {
	this.objects.push(obj);
};
/**
 * Sets the time.
 *
 * @param {!number} time Time.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.setTime = function(time) {
	this.time = time;
};
/**
 * Gets the time.
 *
 * @return {!number} Time.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.getTime = function() {
	return this.time;
};
/**
 * @override
 */
Grape2D.SnapshotEncoder.prototype.getResult = function() {
	return JSON.stringify({
		time: this.time,
		events: this.events,
		objects: this.objects
	});
};
/**
 * @override
 */
Grape2D.SnapshotEncoder.prototype.processSnapshot = function(snapshot) {
	var events = snapshot.getSnapshotEvents(),
		objs = snapshot.getSnapshotNetworkObjects2D();

	this.events = [];
	this.objects = [];
	this.time = snapshot.getTime();

	for (var e in events) {
		events[e].process(this);
	}
	for (var o in objs) {
		objs[o].process(this);
	}
};
/**
 * @override
 */
Grape2D.SnapshotEncoder.prototype.processSnapshotEvent = function(snapshotEvent) {
	this.addEventEncoded({});
};
/**
 * Encodes a {@link Grape2D.Vector}.
 *
 * @param  {!Grape2D.Vector} vector Vector to encode.
 * @return {!Object} Vector encoded.
 * @protected
 */
Grape2D.SnapshotEncoder.prototype.processVector = function(vector) {
	return {
		x: vector.getX(),
		y: vector.getY()
	};
};
/**
 * @override
 */
Grape2D.SnapshotEncoder.prototype.processSnapshotNetworkObject2D = function(snapshotNO2D) {
	this.addObjectEncoded({
		id: snapshotNO2D.getId(),
		position: this.processVector(snapshotNO2D.getPosition())
	});
};