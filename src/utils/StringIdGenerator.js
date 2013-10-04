/**
 * Generates a unique string id, based on a representation of the string in
 *
 * @implements {Grape2D.utils.IdGenerator}
 * @constructor
 */
Grape2D.utils.StringIdGenerator = function() {
	Grape2D.utils.IdGenerator.call(this);
	/**
	 * Number of ids generated.
	 *
	 * @type {!number}
	 * @private
	 */
	this.currentId = 0;
};

Grape2D.utils.StringIdGenerator.prototype = Object.create(Grape2D.utils.IdGenerator.prototype);
/**
 * @override
 */
Grape2D.utils.StringIdGenerator.prototype.request = function() {
	return Grape2D.utils.StringIdGenerator.generate(this.currentId++);
};
/**
 * Generates an string id based on a number.
 *
 * @param  {!number} nid Number id.
 * @return {!string} String representation of the number.
 * @public
 * @static
 */
Grape2D.utils.StringIdGenerator.generate = function(nid) {
	if (nid < 61) {
		return Grape2D.utils.StringIdGenerator.charEncode(nid);
	} else {
		return Grape2D.utils.StringIdGenerator.generate(Grape2D.Math.floorPositive(nid / 62) - 1) + Grape2D.utils.StringIdGenerator.charEncode(nid % 62);
	}
};
/**
 * Encodes a number into a character.
 *
 * @param  {!number} code Number to be encoded.
 * @return {!string} Character encoded.
 * @public
 * @static
 */
Grape2D.utils.StringIdGenerator.charEncode = function(code) {
	if (code > 36) {
		return String.fromCharCode(code + 29);
	} else if (code > 10) {
		return String.fromCharCode(code + 61);
	}
	return code + "";
};