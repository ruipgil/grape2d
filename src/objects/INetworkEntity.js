/**
 * An network entity interface is any entity that can be exchanged
 *   between two endpoints.
 * A network entity is identified by an UUID.
 *
 * @extends {Grape2D.RenderableEntity}
 * @class
 * @interface
 */
Grape2D.INetworkEntity = function() {};
Grape2D.INetworkEntity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * Gets the UUID of the entity.
 *
 * @return {!string} UUID of the entity.
 * @public
 */
Grape2D.INetworkEntity.prototype.getUUID = function() {};
/**
 * Updates itself, for optimal performance it should only be used once,
 *   when using a snapshot with the information about this entity.
 *
 * @public
 */
Grape2D.INetworkEntity.prototype.updateNetworkProperties = function() {};