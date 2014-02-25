/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.PeakingFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(5);
	this.setFrequency(frequency);
	this.setDetune(detune);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.PeakingFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);