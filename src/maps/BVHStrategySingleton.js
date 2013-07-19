/**
 * A singleton for BVH strategies.
 *
 * @class
 */
Grape2D.BVHStrategySingleton = {
	/**
	 * Strategy in use.
	 * 
	 * @private {!Grape2D.BVHStrategy}
	 * @static
	 */
	strategy: new Grape2D.MedianCutBVHStrategy(),
	/**
	 * Sets a strategy.
	 * 
	 * @param  {!Grape2D.BVHStrategy} strategy The new strategy.
	 * @static
	 * @public
	 */
	setStrategy: function(strategy){
		Grape2D.BVHStrategySingleton.strategy = strategy;
	},
	/**
	 * Gets the strategy.
	 * 
	 * @return {!Grape2D.BVHStrategy} The strategy
	 * @static
	 * @public
	 */
	getStrategy: function(){
		return Grape2D.BVHStrategySingleton.strategy;
	}
};