/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.LowpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(0);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.LowpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);