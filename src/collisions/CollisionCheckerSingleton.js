/**
 * Singleton to store the in-use collision checker strategy.
 *
 * @class
 */
Grape2D.CollisionCheckerSingleton = {
	/**
	 * Collision checker instance.
	 *
	 * @type {!Grape2D.CollisionChecker}
	 * @private
	 * @static
	 */
	instance: new Grape2D.SATCollisionChecker(),
	/**
	 * Gets the collision checker instance.
	 *
	 * @return {!Grape2D.CollisionChecker} The instance.
	 * @public
	 * @static
	 */
	getCollisionChecker: function(){
		return Grape2D.CollisionCheckerSingleton.instance;
	},
	/**
	 * Sets the collision checker instance.
	 *
	 * @param  {!Grape2D.CollisionChecker} instance The new instance.
	 * @public
	 * @static
	 */
	setCollisionChecker: function(instance){
		Grape2D.CollisionCheckerSingleton.instance = instance;
	},
	/**
	 * Collides two shpaes. It is syntax sugar for 
	 *   <code>shapeA.collide(Grape2D.CollisionCheckerSingleton.getInstance(),
	 *   shapeB);</code>
	 *
	 * @param  {!(Grape2D.IShape|Grape2D.Vector)} a Shape or point
	 * @param  {!(Grape2D.IShape|Grape2D.Vector)} b Another shape or point
	 * @return {!boolean} Result of the collision test.
	 * @public
	 * @static
	 */
	collide: function(a, b){
		return Grape2D.CollisionDispatcher.dispatch(Grape2D.CollisionCheckerSingleton.instance, a, b);
	}
};