/**
 * Generates a unique number id.
 *
 * @implements {Grape2D.utils.IdGenerator}
 * @constructor
 */
Grape2D.utils.NumberIdGenerator = function(){
	Grape2D.utils.IdGenerator.call(this);
	/**
	 * Current id.
	 *
	 * @type {!number}
	 * @private
	 */
	this.currentId = 0;
};

Grape2D.utils.NumberIdGenerator.prototype = Object.create(Grape2D.utils.IdGenerator.prototype);
/**
 * @override
 */
Grape2D.utils.NumberIdGenerator.prototype.request = function(){
	return this.currentId++;
};