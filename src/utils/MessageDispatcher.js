/**
 * Dispatches messages by callback function if they match the
 *   correspondent regular expression.
 *
 * @constructor
 */
Grape2D.utils.MessageDispatcher = function() {
	this.stack = [];
};

Grape2D.utils.MessageDispatcher.prototype = {
	constructor: Grape2D.utils.MessageDispatcher,
	/**
	 * Adds callback for a message that returns <code>true</code>
	 *   in the test of the regular expression.
	 *
	 * @param {!RegExp} regex Regular expression to match.
	 * @param {function(!string, !Object=)} callback Function to be
	 *   called when the message matches the regular expression.
	 * @public
	 */
	add: function(regex, callback) {
		this.stack.push({
			regex: regex,
			callback: callback
		});
	},
	/**
	 * Removes a callback.
	 *
	 * @param  {!RegExp} regex Regular expression associated with the
	 *   callback to remove.
	 * @public
	 */
	remove: function(regex) {
		var rs = regex.toString();
		for (var i = 0; i < this.stack.length; i++) {
			if (this.stack[i].regex.toString() == rs) {
				this.stack.splice(i, 1);
			}
		}
	},
	/**
	 * Dispatches the callbacks associated with the regular expressions
	 *   matching the message.
	 *
	 * @param  {!string} message Message to be dispatched.
	 * @param  {!Object=} param Additional arguments to be passed
	 *   through.
	 * @public
	 */
	dispatch: function(message, param) {
		var current;
		for (var i = 0; i < this.stack.length; i++) {
			current = this.stack[i];
			if (current.regex.test(message)) {
				this.stack[i].callback(message, param);
			}
		}
	}
};