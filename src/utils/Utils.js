/**
 * @author rui_web@hotmail.com (Rui Gil)
 */

/**
 * Browser independent utils
 *
 * @namespace
 */
Grape2D.utils = {
	/**
	 * Gets the document size, or by other words the size of the screen, as an object with width and height properties.
	 * This is the maximum size of the "drawing surface".
	 *
	 * @return {Object} the object with the width and height of the document
	 */
	getDocumentSize: function () {
		return {
			width: document.width || document.documentElement.clientWidth,
			height: document.height || document.documentElement.clientHeight
		};
	},

	/**
	 * This is a semi-polyfill to request an animation frame, since it only changes this function in case it exists or don't.
	 * This may be a ugly and a bad pratice, bad it's only executed once and gives more abstraction to the developer.
	 * Once executed it will also place a polyfill into Grape2D.utils.cancelAnimationFrame.
	 *
	 * These polyfills are adapted from Erik's Moller requestAnimationFrame polyfill and fixed by Paul Irish and Tino Zijdel {@link https://gist.github.com/paulirish/1579671}
	 *
	 * @param  {Object} w Window object. This object may or may not contain the requestAnimationFrame. If null then the global object window is taken.
	 */
	requestAnimationFrame: function (w) {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		var requestPolyfill = null;
		var cancelPolyfill = null;
		w = w || window;
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			requestPolyfill = window[vendors[x] + 'RequestAnimationFrame'];
			cancelPolyfill = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!requestPolyfill) {
			requestPolyfill = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!cancelPolyfill) {
			cancelPolyfill = function (id) {
				clearTimeout(id);
			};
		}

		Grape2D.utils.requestAnimationFrame = requestPolyfill;
		Grape2D.utils.cancelAnimationFrame = cancelPolyfill;
	},
	/**
	 * A semi-polyfill to cancel animations. Be aware that is function does nothing util the requestAnimationFrame polyfill is called. This makes sence because an animation should only be stopped when it's already runnning.
	 */
	cancelAnimationFrame: function () {}
};