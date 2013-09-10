/**
 * Snapshot class.
 *
 * @param {!number} time Time of the snapshot.
 * @param {!Array.<!Grape2D.SnapshotEvent>=} events List of events in
 *   the snapshots.
 * @param {!Object.<!(number|string), !Grape2D.SnapshotNetworkObject2D>=} networkObjects List
 *   of objects in the snapshot.
 * @constructor
 */
Grape2D.Snapshot = function(time, events, networkObjects) {
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

Grape2D.Snapshot.prototype = {
	constructor: Grape2D.Snapshot,
	/**
	 * Adds an event to the snapshot.
	 *
	 * @param {!Grape2D.SnapshotEvent} event Snapshot event.
	 * @public
	 */
	addEvent: function(event) {
		this.events.push(event);
	},
	/**
	 * Adds an object to the snapshot.
	 *
	 * @param {!Grape2D.SnapshotNetworkObject2D} sno2d Snapshot object.
	 * @public
	 */
	addSnapshotNetworkObject2D: function(sno2d) {
		this.networkObjects[sno2d.getId()] = sno2d;
	},
	/**
	 * Gets the snapshot time.
	 *
	 * @return {!number} Time.
	 * @public
	 */
	getTime: function() {
		return this.time;
	},
	/**
	 * Gets the snapshot events.
	 *
	 * @return {!Array.<!Grape2D.SnapshotEvent>} Snapshot events.
	 * @public
	 */
	getEvents: function() {
		return this.events;
	},
	/**
	 * Gets an object
	 *
	 * @param  {!(number|string)} id Object's id.
	 * @return {!(Grape2D.SnapshotNetworkObject2D|undefined)} Object.
	 */
	getSnapshotNetworkObject2D: function(id) {
		return this.networkObjects[id];
	},
	/**
	 * Fires the events.
	 *
	 * @param  {!Object=} param An arbitrary object to be passed. Since
	 *   events can be used widely an object with the necessary
	 *   information may be passed.
	 * @public
	 */
	fireEvents: function(param) {
		for(var i=0; i<this.events.length; i++){
			this.events[i].fire(param);
		}
	},
	/**
	 * Updates the {@link Grape2D.NetworkObject2D}s of this snapshot.
	 *
	 * @param  {!Object=} param An arbitrary object to be passed.
	 * @public
	 */
	updateNetworkObject2D: function(param){
		for(var x in this.networkObjects){
			this.networkObjects[x].updateNetworkObject2D(param);
		}
	},
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
	dispatch: function(eventsParam, objsParam){
		this.fireEvents(eventsParam);
		this.updateNetworkObject2D(objsParam);
	}
};