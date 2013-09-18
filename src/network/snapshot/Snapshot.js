/**
 * Snapshot class.
 *
 * @param {!number} time Time of the snapshot.
 * @param {!Array.<!Grape2D.SnapshotEvent>=} events List of events in
 *   the snapshots.
 * @param {!Object.<!(number|string), !Grape2D.SnapshotNetworkObject2D>=} networkObjects List
 *   of objects in the snapshot.
 * @implements {Grape2D.SnapshotElement}
 * @constructor
 */
Grape2D.Snapshot = function(time, events, networkObjects) {
	Grape2D.SnapshotElement.call(this);
	/**
	 * Snapshot time.
	 *
	 * @type {!number}
	 * @private
	 */
	this.time = time;
	/**
	 * Snapshot events.
	 *
	 * @type {!Array.<!Grape2D.SnapshotEvent>}
	 * @private
	 */
	this.events = events || [];
	/**
	 * Snapshot objects.
	 *
	 * @type {!Object.<!(number|string), !Grape2D.SnapshotNetworkObject2D>}
	 * @private
	 */
	this.networkObjects = networkObjects || {};
};

Grape2D.Snapshot.prototype = Object.create(Grape2D.SnapshotElement.prototype);
/**
 * Adds an event to the snapshot.
 *
 * @param {!Grape2D.SnapshotEvent} event Snapshot event.
 * @public
 */
Grape2D.Snapshot.prototype.addEvent = function(event) {
	this.events.push(event);
};
/**
 * Adds an object to the snapshot.
 *
 * @param {!Grape2D.SnapshotNetworkObject2D} sno2d Snapshot object.
 * @public
 */
Grape2D.Snapshot.prototype.addSnapshotNetworkObject2D = function(sno2d) {
	this.networkObjects[sno2d.getId()] = sno2d;
};
/**
 * Gets the snapshot time.
 *
 * @return {!number} Time.
 * @public
 */
Grape2D.Snapshot.prototype.getTime = function() {
	return this.time;
};
/**
 * Gets the snapshot events.
 *
 * @return {!Array.<!Grape2D.SnapshotEvent>} Snapshot events.
 * @public
 */
Grape2D.Snapshot.prototype.getSnapshotEvents = function() {
	return this.events;
};
/**
 * Gets the list of objects.
 *
 * @return {!Grape2D.SnapshotNetworkObject2D} Objects.
 * @public
 */
Grape2D.Snapshot.prototype.getSnapshotNetworkObjects2D = function() {
	return this.networkObjects;
};
/**
 * Fires the events.
 *
 * @param  {!Object=} param An arbitrary object to be passed. Since
 *   events can be used widely an object with the necessary
 *   information may be passed.
 * @public
 */
Grape2D.Snapshot.prototype.fireEvents = function(param) {
	for (var i = 0; i < this.events.length; i++) {
		this.events[i].fire(param);
	}
};
/**
 * Updates the {@link Grape2D.NetworkObject2D}s of this snapshot.
 *
 * @param  {!Object=} param An arbitrary object to be passed.
 * @public
 */
Grape2D.Snapshot.prototype.updateNetworkObject2D = function(param) {
	for (var x in this.networkObjects) {
		this.networkObjects[x].updateNetworkObject2D(param);
	}
};
/**
 * Dispatches the tasks of this snapshot, by firing the events and
 *   updating {@link Grape2D.NetworkObject2D}s.
 *
 * @param  {!Object=} eventsParam Arbitrary object. To be passed to
 *   {@link Grape2D.Snapshot.fireEvents}.
 * @param  {!Object=} objsParam Arbitrary object. To be passed to
 *   {@link Grape2D.Snapshot.fireEvents}.
 * @public
 */
Grape2D.Snapshot.prototype.dispatch = function(eventsParam, objsParam) {
	this.fireEvents(eventsParam);
	this.updateNetworkObject2D(objsParam);
};
/**
 * @override
 */
Grape2D.Snapshot.prototype.process = function(processor) {
	processor.processSnapshot(this);
};