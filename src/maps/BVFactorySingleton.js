/**
 * Holds the current bounding volume factory {@link Grape2D.BVFactory}
 *
 * @class
 */
Grape2D.BVFactorySingleton = {
	/**
	 * Factory being used.
	 * 
	 * @type {!Grape2D.BVFactory}
	 * @private
	 * @static
	 */
	bvfactory: new Grape2D.AabbBVFactory(),
	/**
	 * Gets the factory
	 * 
	 * @return {!Grape2D.BVFactory} A bounding volume factory instance.
	 * @public
	 * @static
	 */
	getFactory: function(){
		return Grape2D.BVFactorySingleton.bvfactory;
	},
	/**
	 * Sets the factory
	 * 
	 * @param  {!Grape2D.BVFactory} factory A bounding volume factory
	 *   instance.
	 * @public
	 * @static
	 */
	setFactory: function(factory){
		Grape2D.BVFactorySingleton.bvfactory = factory;
	},
	/**
	 * Sintax sugar for <code>shape.createBV(Grape2D.BVFactorySingleton.getFactory())</code>.
	 * 
	 * @param  {!Grape2D.Shape} shape Shape to create a bounding volume
	 * @return {!Grape2D.Shape} Bounding volume.
	 * @public
	 * @static
	 */
	create: function(shape){
		return shape.createBV(Grape2D.BVFactorySingleton.bvfactory);
	},
	/**
	 * Returns a place holder shape, of the type of the factory.
	 *   It should only be used to avoid using <code>null</code>
	 *
	 * @return {!Grape2D.Shape} A shape has a place holder.
	 * @public
	 * @static
	 */
	getPlaceHolder: function(){
		return Grape2D.BVFactorySingleton.bvfactory.getPlaceHolder();
	}
};