/**
 * Clock is used to keep count of the time elapse between
 *   game frames.
 *
 * @constructor
 */
Grape2D.utils.Clock = function () {
	this.frameCount = 0;
	this.start = new Date().getTime();
	this.end = this.start;
	this.lastFrame = this.start;
	this.fps = 0;
	this.timeEl = 0;
};

Grape2D.utils.Clock.prototype = {
	constructor: Grape2D.utils.Clock,
	/**
	 * Updates the game. Should be at the beggining
	 *   of the frame.
	 *
	 * @return {!number} Time, in miliseconds, elapsed
	 *   since the last update.
	 * @public
	 */
	update: function () {
		var now = new Date().getTime(),
			t = now - this.lastFrame;

		this.frameCount++;
		this.timeEl+=t;

		if (this.timeEl >= 1000) {
			this.reset(now);
		}

		this.lastFrame = now;
		return t;
	},
	/**
	 * Resets all properties, at least at each
	 *   second passed.
	 *
	 * @param  {!number} time Current time.
	 * @private
	 */
	reset: function (time) {
		this.fps = this.frameCount;
		this.timeEl = 0;
		this.frameCount = 0;
		this.end = time;
	},
	/**
	 * Gets the current time in miliseconds.
	 *
	 * @return {!number} Current time.
	 * @public
	 */
	getTime: function(){
		return new Date().getTime();
	}
};