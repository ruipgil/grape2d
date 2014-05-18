/**
 * @extends {Grape2D.IEntity}
 * @class
 * @interface
 */
Grape2D.RenderableEntity = function() {
	Grape2D.IEntity.call(this);
};
Grape2D.RenderableEntity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * Gets the render position.
 *
 * @return {!Grape2D.Vector} Render position.
 * @public
 */
Grape2D.RenderableEntity.prototype.getRenderPosition = function() {};