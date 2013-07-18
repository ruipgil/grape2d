Grape2D.utils.Loader = function (options) {
	this.onLoadWait = 0;
	this.stepCallback = options.step || function () {};
	this.allLoadCallback = options.callback;
};

Grape2D.utils.Loader.prototype = {
	constructor: Grape2D.AssetManager,
	request: function (myCallback) {
		var am = this;
		this.onLoadWait++;
		return function () {
			am.step();
			am.stepCallback();
			if (myCallback) {
				myCallback();
			}
		};
	},
	step: function () {
		this.stepCallback();
		this.onLoadWait--;
		if (this.onLoadWait <= 0) {
			this.onLoadWait = 0;
			this.allLoadCallback();
		}
	}
};