/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.HighshelfFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(4);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.HighshelfFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);