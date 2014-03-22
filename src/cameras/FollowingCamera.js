/**
 * Camera that follows an {@link Grape2D.Object2D}, this means that
 *   the camera is always looking at the object (the lookAt property
 *   is the same as the object).
 *
 * @param  {!Object} options Setup options. See {@link Grape2D.Camera}
 * @param  {!Grape2D.Object2D} options.objectToFollow Object to be
 *   followed by the camera.
 * @extends {Grape2D.Camera}
 * @constructor
 */
Grape2D.FollowingCamera = function(options){
	Grape2D.Camera.call(this, options);
	this.objectToFollow = options.objectToFollow;
};
Grape2D.FollowingCamera.prototype = Object.create(Grape2D.Camera.prototype);
/**
 * @override
 */
Grape2D.FollowingCamera.prototype.getLookAt = function(){
	return this.objectToFollow.getPosition();
};
/**
 * Gets the object to follow.
 *
 * @return {!Grape2D.Object2D} Object that is following.
 * @public
 */
Grape2D.FollowingCamera.prototype.getObjectToFollow = function(){
	return this.objectToFollow;
};
/**
 * Sets the object to follow.
 *
 * @param  {!Grape2D.Object2D} fo Object to follow.
 * @public
 */
Grape2D.FollowingCamera.prototype.setObjectToFollow = function(fo){
	this.objectToFollow = fo;
};
