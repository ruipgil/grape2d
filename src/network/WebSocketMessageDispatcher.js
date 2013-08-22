/**
 * This is a easier way and cleaner way to dispatch messages,
 *   it makes use of regular expressions to identify messages
 *   and call it's respective callback. The RegExp object is
 *   stored alonside the expression and it's callback.
 *
 * @param {!string} address Web socket address.
 * @extends {Grape2D.WebSocket}
 * @constructor
 */
Grape2D.WebSocketMessageDispatcher = function(address) {
	Grape2D.WebSocket.call(this, address);
	/**
	 * Listening list.
	 *
	 * @type {Array.<Object.<string, (string|RegExp|Function)>>}
	 * @private
	 */
	this.listeningTo = [];
};

Grape2D.WebSocketMessageDispatcher.prototype = Object.create(Grape2D.WebSocket.prototype);
/**
 * Registers a callback to be identified and triggered by
 *   the regular expression.
 *
 * @param  {!string} regex Regular expression.
 * @param  {Function} callback A callback function.
 * @public
 */
Grape2D.WebSocketMessageDispatcher.prototype.register = function(regex, callback) {
	this.listeningTo.push({
		expression: regex,
		regexp: new RegExp(regex),
		callback: callback
	});
};
/**
 * Remove a callback by it's regular expression.
 *
 * @param  {!string} regex Regular expression.
 * @return {!boolean} True if it has been removed.
 */
Grape2D.WebSocketMessageDispatcher.prototype.unregister = function(regex) {
	for (var i = 0; i < this.listeningTo.length; i++) {
		if (this.listeningTo[i].expression == regex) {
			this.listeningTo.splice(i, 1);
			return true;
		}
	}
	return false;
};
/**
 * Dispatches the message if it matches any regular
 *   expression registered.
 *
 * @override
 */
Grape2D.WebSocketMessageDispatcher.prototype.onReceive = function(message, data) {
	var temp;
	for(var i=0; i<this.listeningTo.length; i++){
		temp = this.listeningTo[i];
		if( temp.regexp.test(message) ){
			temp.callback(message, data);
		}
	}
};