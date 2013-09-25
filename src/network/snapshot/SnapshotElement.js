/**
 * SnapshotElement class.
 *
 * @class
 * @interface
 */
Grape2D.SnapshotElement = function() {};

Grape2D.SnapshotElement.prototype = {
	constructor: Grape2D.SnapshotElement,
	/**
	 * Processes the element.
	 *
	 * @param  {!Grape2D.SnapshotElementProcessor} processor Processor.
	 * @public
	 */
	process: function(processor) {}
};