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
	update: function () {
		var now = new Date().getTime(),
			t = now - this.lastFrame;

		this.frameCount++;
		this.timeEl++;

		if (this.timeEl >= 1000) {
			this.reset(now);
		}

		this.lastFrame = now;
		return t;
	},
	reset: function (time) {
		this.fps = this.frameCount;
		this.timeEl = 0;
		this.frameCount = 0;
		this.end = time;
	}
};