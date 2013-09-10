/**
 * Browser independent utils
 *
 * @namespace
 */
Grape2D.utils = {
	/**
	 * Gets the document size, or by other words the size of the screen,
	 *   as an object with width and height properties.
	 * This is the maximum size of the "drawing surface".
	 * 
	 * @return {!Object} the object with the width and height of the
	 *   document
	 * @public
	 * @static
	 */
	getDocumentSize: function() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	},
	/**
	 * Requests an animation frame.
	 *
	 * @param  {!Function} fn Callback function.
	 * @return {!number} Request ID.
	 * @public
	 * @static
	 */
	requestAnimationFrame: function(fn){
		if(Grape2D.NODE){
			return Grape2D.WINDOW.requestAnimationFrame(fn);
		}else{
			return requestAnimationFrame(fn);
		}
	},
	/**
	 * Cancels an animation frame request.
	 *
	 * @param  {!number} op Animation frame request ID.
	 * @public
	 * @static
	 * 
	 * @suppress {undefinedVars}
	 */
	cancelAnimationFrame: function(op){
		if(Grape2D.NODE){
			return Grape2D.WINDOW.cancelAnimationFrame(op);
		}else{
			return cancelAnimationFrame(op);
		}
	},
};