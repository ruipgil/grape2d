/**
 * Generates unique ids for {@link Grape2D.NetworkObject2D}.
 *
 * @class
 */
Grape2D.NetworkObject2DIdGeneratorSingleton = {
	/**
	 * Id generator instance.
	 *
	 * @type {!Grape2D.utils.IdGenerator}
	 * @private
	 * @static
	 */
	instance: new Grape2D.utils.StringIdGenerator(),
	/**
	 * Gets the generator instance.
	 *
	 * @return {!Grape2D.utils.IdGenerator} Id generator instance.
	 * @public
	 * @static
	 */
	getGenerator: function(){
		return Grape2D.NetworkObject2DIdGeneratorSingleton.instance;
	},
	/**
	 * Sets the generator instance.
	 *
	 * @param  {!Grape2D.utils.IdGenerator} instance Id generator instance.
	 * @public
	 * @static
	 */
	setGenerator: function(instance){
		Grape2D.NetworkObject2DIdGeneratorSingleton.instance = instance;
	},
	/**
	 * Requests an ID. This is a shortcut to
	 *   <code>Grape2D.NetworkObject2DIdGeneratorSingleton.getInstance().request()</code>.
	 *
	 * @return {?} An unique id.
	 * @public
	 */
	request: function(){
		return Grape2D.NetworkObject2DIdGeneratorSingleton.instance.request();
	}
};