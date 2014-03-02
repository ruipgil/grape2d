/**
 * @extends {Grape2D.SoundBiquadFilter}
 * @constructor
 */
Grape2D.BandpassFilter = function(frequency, q, gain) {
	Grape2D.SoundBiquadFilter.call(this);
	this.setType(2);
	this.setFrequency(frequency);
	this.setQ(q);
	this.setGain(gain);
};
Grape2D.BandpassFilter.prototype = Object.create(Grape2D.SoundBiquadFilter.prototype);