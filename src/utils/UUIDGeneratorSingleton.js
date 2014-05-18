/**
 * A singleton of the UUID generator in use.
 * The default instance is {@see Grape2D.utils.UUIDGenerator}.
 * 
 * @class
 */
Grape2D.utils.UUIDGeneratorSingleton = {
	/**
	 * Instance in use.
	 *
	 * @type {?}
	 * @private
	 * @static
	 */
	instance: new Grape2D.utils.UUIDGenerator(),
	/**
	 * Gets the instance to generate UUID's.
	 *
	 * @return {?} Instance being used to generate the UUID's.
	 * @public
	 * @static
	 */
	getInstance: function(){
		return Grape2D.utils.UUIDGeneratorSingleton.instance;
	},
	/**
	 * Sets the instance to generate UUID's.
	 *
	 * @param {?} generator Some object with the function <code>
	 *   generate</code>.
	 * @public
	 * @static
	 */
	setInstance: function(generator){
		Grape2D.utils.UUIDGeneratorSingleton.instance = generator;
	},
	/**
	 * Generates a UUID. This is a short-cut to <code>
	 *   Grape2D.utils.UUIDGeneratorSingleton.getInstance().generate()
	 *   </code>.
	 *
	 * @return {!string} UUID.
	 * @public
	 * @static
	 */
	generate: function(){
		return Grape2D.utils.UUIDGeneratorSingleton.instance.generate();
	}
};