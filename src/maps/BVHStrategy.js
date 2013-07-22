/**
 * A BVH Strategy is used to sort and divide objects according to a 
 *   set of rules.
 *
 * @class
 * @interface
 */
Grape2D.BVHStrategy = function(){};
Grape2D.BVHStrategy.prototype = {
	constructor: Grape2D.BVHStrategy,
	/**
	 * Applies the strategy to the a set of objects.
	 *
	 * @param  {!Array.<Grape2D.Object2D>} objects List of objects to
	 *   separate.
	 * @return {!Object} An object with left and right properties,
	 *   each property is an array, that contains {@link Grape2D.Object2D}
	 *   or are empty.
	 * @public
	 */
	solve: function(objects){}
};