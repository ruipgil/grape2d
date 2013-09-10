/**
 * Simulates lag behavior, by delayed function calls.
 *
 * @param {!Object=} options Setup options.
 * @param {!number=} options.latency Desired based latency.
 * @param {!number=} options.variation Variation of the base
 *   latency. This will create an effective latency of <code>
 *   rand(latency-variation, latency+variation)</code>
 * @constructor
 */
Grape2D.LagSimulator = function(options) {
	options = options || {};
	/**
	 * Base latency.
	 *
	 * @type {!number}
	 * @private
	 */
	this.latency = options.latency || 0;
	/**
	 * Latency variation.
	 *
	 * @type {!number}
	 * @private
	 */
	this.variation = options.variation || 0;
};
Grape2D.LagSimulator.prototype = {
	constructor: Grape2D.LagSimulator,
	/**
	 * Gets the latency.
	 *
	 * @return {!number} Latency.
	 * @public
	 */
	getLatency: function(){
		return this.latency;
	},
	/**
	 * Sets the latency.
	 *
	 * @param {!number} latency Latency.
	 * @public
	 */
	setLatency: function(latency){
		this.latency = latency;
	},
	/**
	 * Gets the variation.
	 *
	 * @return {!number} Variation.
	 * @public
	 */
	getVariation: function(){
		return this.variation;
	},
	/**
	 * Sets the variation.
	 *
	 * @param {!number} variation Variation.
	 * @public
	 */
	setVariation: function(variation){
		this.variation = variation;
	},
	/**
	 * Simulates a lagged call to a function.
	 *
	 * @param  {!Function} fn Function to simulate
	 *   the lag.
	 * @public
	 */
	simulate: function(fn){
		var r = Grape2D.Math.randInt(this.latency-this.variation, this.latency+this.variation);
		setTimeout(function(){
			fn(r);
		}, r);
	}
};