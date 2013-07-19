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
			width: document.width || document.documentElement.clientWidth,
			height: document.height || document.documentElement.clientHeight
		};
	}
};