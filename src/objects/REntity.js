/**
 * A REntity is an {@see Grape2D.IEntity} that can be rendered in to a
 *   {@see Grape2D.Renderer}.
 * It uses the entity's position as the texture position, and it can
 *   be offsetted. Queries may be performed in the entity's bounding
 *   box to select it or not for rendering.
 *
 * @param {!Object} options Setup options.
 * @param {!Grape2D.IEntity} options.entity Entity to render.
 * @param {!Grape2D.Texture} options.texture Texture to use.
 * @param {!Grape2D.Vector=} options.textureOffset The offset of the
 *   texture, relative to the entity's center. The default
 *   offset is none (0,0). It will copy the object.
 *
 * @extends {Grape2D.IEntity}
 * @constructor
 */
Grape2D.REntity = function(options) {
	/**
	 * Entity.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.entity = options.entity;
	/**
	 * Texture to render.
	 *
	 * @type {!Grape2D.Texture}
	 * @private
	 */
	this.texture = options.texture;
	/**
	 * Texture offset.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.textureOffset = new Grape2D.Vector();
	if(options.textureOffset){
		this.textureOffset.set(options.textureOffset);
	}
};
Grape2D.REntity.prototype = Object.create(Grape2D.Renderable.prototype);
/**
 * Renders the entity to a renderer.
 *
 * @param  {!Grape2D.Renderer} renderer Target render.
 * @public
 */
Grape2D.REntity.prototype.render = function(renderer){
	renderer.renderREntity(this);
};
/**
 * Gets the entity to use to render.
 *
 * @return {!Grape2D.IEntity} Entity.
 * @public
 */
Grape2D.REntity.prototype.getEntity = function(){
	return this.entity;
};
/**
 * Sets the entity to use to render.
 *
 * @param {!Grape2D.IEntity} entity Entity.
 * @public
 */
Grape2D.REntity.prototype.setEntity = function(entity){
	this.entity = entity;
};
/**
 * Gets the texture.
 *
 * @return {!Grape2D.ITexture} Texture.
 * @public
 */
Grape2D.REntity.prototype.getTexture = function(){
	return this.texture;
};
/**
 * Sets the texture to render.
 *
 * @param {!Grape2D.ITexture} texture Texture.
 * @public
 */
Grape2D.REntity.prototype.setTexture = function(texture){
	this.texture = texture;
};
/**
 * Gets the texture's offset.
 *
 * @return {!Grape2D.Vector} Offset.
 * @public
 */
Grape2D.REntity.prototype.getTextureOffset = function(){
	return this.textureOffset;
};
/**
 * Sets the texture's offset.
 *
 * @param {!Grape2D.Vector} textureOffset Offset.
 * @public
 */
Grape2D.REntity.prototype.setTextureOffset = function(textureOffset){
	this.textureOffset = textureOffset;
};
/**
 * @override
 */
Grape2D.REntity.prototype.getPosition = function(){
	return this.entity.getPosition();
};
/**
 * @override
 */
Grape2D.REntity.prototype.setPosition = function(position){
	return this.entity.setPosition(position);
};
/**
 * @override
 */
Grape2D.REntity.prototype.getBoundingBox = function(){
	return this.entity.getBoundingBox();
};
/**
 * @override
 */
Grape2D.REntity.prototype.setBoundingBox = function(boundingBox){
	return this.entity.setBoundingBox(boundingBox);
};
/**
 * @override
 */
Grape2D.REntity.prototype.getBoundingBoxOffset = function(){
	return this.entity.getBoundingBoxOffset();
};
/**
 * @override
 */
Grape2D.REntity.prototype.setBoundingBoxOffset = function(boundingBoxOffset){
	return this.entity.setBoundingBoxOffset(boundingBoxOffset);
};