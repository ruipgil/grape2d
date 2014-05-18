/**
 * Container for a {@see Grape2D.Entity}, to be exchanged between
 *   two endpoints in a network.
 *
 * @param {!Grape2D.IEntity} entity Entity.
 *
 * @implements {Grape2D.INetworkEntity}
 * @constructor
 */
Grape2D.NetworkEntity = function(entity, uuid) {
	/**
	 * Entity.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.entity = entity;
	/**
	 * Entity's UUID.
	 * 
	 * @type {!string}
	 * @private
	 */
	this.uuid = uuid || Grape2D.utils.UUIDGeneratorSingleton.generate();
	/**
	 * Position to render the entity in a interpolate position.
	 * This position should be consistent with the last snapshot with
	 *   information about this entity.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.interpolatingPosition = new Grape2D.Vector();
};
Grape2D.NetworkEntity.prototype = Object.create(Grape2D.INetworkEntity.prototype);
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getUUID = function(){
	return this.uuid;
};
/**
 * Gets the non-network entity.
 *
 * @return {!Grape2D.IEntity} Entity.
 * @public
 */
Grape2D.NetworkEntity.prototype.getEntity = function(){
	return this.entity;
};
/**
 * Sets the non-network entity to be wrapped by this class.
 *
 * @param {!Grape2D.IEntity} entity Entity.
 * @public
 */
Grape2D.NetworkEntity.prototype.setEntity = function(entity){
	this.entity = entity;
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getRenderPosition = function(){
	return Grape2D.Vector.lerp(this.getPosition(), this.interpolatingPosition, Grape2D.SnapshotManagerSingleton.getLerpPercent());
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getPosition = function(){
	return this.entity.getPosition();
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.setPosition = function(position){
	return this.entity.setPosition(position);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getBoundingBox = function(){
	return this.entity.getBoundingBox();
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.setBoundingBox = function(boundingBox){
	return this.entity.setBoundingBox(boundingBox);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.getBoundingBoxOffset = function(){
	return this.entity.getBoundingBoxOffset();
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.setBoundingBoxOffset = function(boundingBoxOffset){
	return this.entity.setBoundingBoxOffset(boundingBoxOffset);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.update = function(dt){};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.updateNetworkProperties = function() {
	var entity = Grape2D.SnapshotManagerSingleton.getNetworkEntity(this.getEntity());
	this.interpolatingPosition.setXY(entity.position.x, entity.position.y);
};
/**
 * @override
 */
Grape2D.NetworkEntity.prototype.process = function(processor){
	processor.processNetworkEntity(this);
};