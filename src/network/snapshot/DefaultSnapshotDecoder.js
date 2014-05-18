/**
 * Decodes a snapshot on the client side.
 * This is the default and should be used mainly as an example, since
 *   it only supports few features of entity, and it has steps that
 *   are not necessary. Take for example the method
 *   <code>createNetworkEntity</code>, that in this case creates a
 *   duplicate object of the first, however in a custom implementation
 *   JSON may not be used, or the keys may have diferent names than
 *   a simple representation of the object.
 * Decodes a snapshot created by {@see Grape2D.DefaultSnapshotEncoder}.
 *   The JSON needs:
 *   <ul>
 *     <li>to have a vector of entities UUID's to add to the
 *       {@see Grape2D.INetworkMap};</li>
 *     <li>to have the UUID's to remove from the client's
 *       {@see Grape2D.INetworkMap};</li>
 *     <li>to have a JSON object with {@see Grape2D.NetworkEntity},
 *       where the key's are strings and are the entity UUID, and the
 *       value should be the entity serialized.</li>
 *   </ul>
 *
 * @constructor
 */
Grape2D.DefaultSnapshotDecoder = function(){
	/**
	 * Entities decoded from the snapshot.
	 *
	 * @type {!Object.<!string, !Object.<!string, !Object.<!string, !number>>>}
	 * @private
	 */
	this.entities = {};
	/**
	 * Events. 
	 *
	 * @type {!Array.<!Object.<!string, !(number|string)>>}
	 * @private
	 */
	this.events = [];
	/**
	 * Snapshot time.
	 *
	 * @type {!number}
	 * @private
	 */
	this.time = 0;
};

Grape2D.DefaultSnapshotDecoder.prototype = {
	constructor: Grape2D.DefaultSnapshotDecoder
};
/**
 * Decodes the snapshot, and stores it internally. If another one was
 *   decoded previouslly it will be lost.
 *
 * @param  {!string} snapshot Snapshot to be decoded.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.decode = function(snapshot) {
	this.entities = {};
	this.events = [];
	this.time = 0;

	var decoded = JSON.parse(snapshot),
		events = decoded.events,
		entities = decoded.entities;

	this.time = decoded.time;

	for(var i in entities){
		this.entities[i] = this.createNetworkEntity(entities[i]);
	}

	for(var j=0, nevent; nevent=events[j++];){
		this.events.push(this.createNetworkEvent(nevent));
	}
};
/**
 * Creates a network entity.
 *
 * @param  {!Object.<!string, !Object.<!string, !number>>} entity
 *   Entity serialized.
 * @return {!Object.<!string, !Object.<!string, !number>>} Entity
 *   simple representation.
 * @private
 */
Grape2D.DefaultSnapshotDecoder.prototype.createNetworkEntity = function(entity) {
	return {
		position: {
			x: entity.position.x,
			y: entity.position.y
		}
	};
};
/**
 * Creates a network event.
 *
 * @param  {!Object.<!string, !(number|string)>} nevent
 *   Serialized event.
 * @return {!Object.<!string, !(number|string)>} Event simple
 *   representation.
 * @private
 */
Grape2D.DefaultSnapshotDecoder.prototype.createNetworkEvent = function(nevent) {
	return {
		type: nevent.type,
		data: nevent.data
	};
};
/**
 * Gets the network entities.
 *
 * @return {!Object.<!string, !Object.<!string, !Object.<!string, !number>>>}
 *   Network entities decoded.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getNetworkEntities = function() {
	return this.entities;
};
/**
 * Gets the network events.
 *
 * @return {!Array.<!Object.<!string, !(number|string)>>} Events.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getNetworkEvents = function() {
	return this.events;
};
/**
 * Gets the time of the snapshot.
 *
 * @return {!number} Time of the snapshot.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getTime = function() {
	return this.time;
};
/**
 * Creates an object with the result of the decoding.
 * It object contains:<ul>
 *   <li>time : time of the snapshot</li>
 *   <li>networkEvents : network events in the snapshot</li>
 *   <li>networkEntities : network entities in the snapshot</li>
 * </ul>
 *
 * @return {!Object.<!string, !(Object|Array|number)>} The object
 *   described above.
 * @public
 */
Grape2D.DefaultSnapshotDecoder.prototype.getResultPacked = function(){
	return {
		time: this.time,
		networkEvents: this.events,
		networkEntities: this.entities
	};
};