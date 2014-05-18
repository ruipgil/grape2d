/**
 * A UUID generator.
 * Found at {@link http://note19.com/2007/05/27/javascript-guid-generator/}
 * 
 * @constructor
 */
Grape2D.utils.UUIDGenerator = function() {};
Grape2D.utils.UUIDGenerator.prototype = {
	constructor: Grape2D.utils.UUIDGenerator,
	/**
	 * Generates a random string.
	 *
	 * @return {!string} UUID chunk.
	 * @protected
	 */
	s4: function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	},
	/**
	 * Generates a proper UUID.
	 *
	 * @return {!string} UUID.
	 * @public
	 */
	generate: function() {
		return (this.s4()+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+this.s4()+this.s4());
	}
};