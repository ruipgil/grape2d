/**
 * Camera that follows an {@link Grape2D.IEntity}, this means that
 *   the camera is always looking at the object (the lookAt property
 *   is the same as the object).
 *
 * @param  {!Object} options Setup options. See {@link Grape2D.Camera}
 * @param  {!Grape2D.IEntity} options.entityToFollow Object to be
 *   followed by the camera.
 * @extends {Grape2D.Camera}
 * @constructor
 */
Grape2D.FollowingCamera = function(options){
	Grape2D.Camera.call(this, options);
	/**
	 * Entity to follow.
	 *
	 * @type {!Grape2D.IEntity}
	 * @private
	 */
	this.entityToFollow = options.entityToFollow;
};
Grape2D.FollowingCamera.prototype = Object.create(Grape2D.Camera.prototype);
/**
 * @override
 */
Grape2D.FollowingCamera.prototype.getLookAt = function(){
	return this.entityToFollow.getPosition();
};
/**
 * Gets the object to follow.
 *
 * @return {!Grape2D.IEntity} Object that is following.
 * @public
 */
Grape2D.FollowingCamera.prototype.getEntityToFollow = function(){
	return this.entityToFollow;
};
/**
 * Sets the object to follow.
 *
 * @param  {!Grape2D.IEntity} fo Object to follow.
 * @public
 */
Grape2D.FollowingCamera.prototype.setEntityToFollow = function(fo){
	this.entityToFollow = fo;
};
