/**
 * This is a modified version of the requestAnimationFrame and cancelAnimationFrame polyfill
 *   {@link https://gist.github.com/paulirish/1579671}
 *   {@link http://paulirish.com/2011/requestanimationframe-for-smart-animating/}
 *   {@link http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating}
 *   requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel.
 *   Under the MIT license.
 */
(function(w) {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
		w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
		w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!w.requestAnimationFrame) {
		w.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!w.cancelAnimationFrame){
		w.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}(Grape2D.WINDOW));