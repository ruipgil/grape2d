/**
 * Interface responsible to generate unique ids.
 *
 * @template T
 *
 * @class
 * @interface
 */
Grape2D.utils.IdGenerator = function() {};

Grape2D.utils.IdGenerator.prototype = {
	constructor: Grape2D.utils.IdGenerator,
	/**
	 * Requests a new unique id.
	 *
	 * @return {!T} Id.
	 * @template T
	 * @public
	 */
	request: function() {}
};