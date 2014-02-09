/**
 * WebSocket abstraction. This, unlike the browser implementation,
 *   doesn't (try to) establish the connection immediately. Instead
 *   the method <code>open()</code> must be called.
 *
 * @param {!Object} options Setup options.
 * @param {!string} options.address Address of the web socket server.
 * @param {!string=} options.protocol Web socket protocol.
 * @param {!Grape2D.utils.SynchronizedClock=} options.clock A clock, to
 *   to be synchronized with the clock of the server.
 *
 * @constructor
 */
Grape2D.WebSocket = function(options) {
	options = options || {};
	/**
	 * List of callback for the on message event.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.onmessageCallback = [];
	/**
	 * List of callback for the on close event.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.oncloseCallback = [];
	/**
	 * List of callback for the on open event.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.onopenCallback = [];
	/**
	 * List of callback for messages sent.
	 *
	 * @type {!Array.<!Function>}
	 * @private
	 */
	this.onsendCallback = [];
	/**
	 * Web socket.
	 *
	 * @type {?WebSocket}
	 * @private
	 */
	this.ws = null;
	/**
	 * Address to connect.
	 *
	 * @type {!string}
	 * @private
	 */
	this.address = options.address;
	/**
	 * Connection's protocol.
	 *
	 * @type {(string|undefined)}
	 * @private
	 */
	this.protocol = options.protocol || undefined;
	/**
	 * Network metrics.
	 *
	 * @type {!Grape2D.WebSocketMetrics}
	 * @private
	 */
	this.metrics = new Grape2D.WebSocketMetrics(this, options.clock || undefined);
};

Grape2D.WebSocket.prototype = {
	constructor: Grape2D.WebSocket,
	/**
	 * Sends a message to the web socket.
	 *
	 * @param  {!string} msg Message to send.
	 * @public
	 */
	send: function(msg) {
		if (this.isOpen()) {
			this.ws.send(msg);
			for (var i = 0; i < this.onsendCallback.length; i++) {
				this.onsendCallback[i](msg);
			}
		}
	},
	/**
	 * Adds a callback for the sned event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnSend: function(callback) {
		this.onsendCallback.push(callback);
	},
	/**
	 * Removes a callback for the send event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnSend: function(callback) {
		var idx = this.onsendCallback.indexOf(callback);
		if (idx > -1) {
			this.onsendCallback.splice(idx, 1);
		}
	},
	/**
	 * Adds a callback for the on message event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnMessage: function(callback) {
		this.onmessageCallback.push(callback);
	},
	/**
	 * Removes a callback for the on message event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnMessage: function(callback) {
		var idx = this.onmessageCallback.indexOf(callback);
		if (idx > -1) {
			this.onmessageCallback.splice(idx, 1);
		}
	},
	/**
	 * Adds a callback for the on close event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnClose: function(callback) {
		this.oncloseCallback.push(callback);
	},
	/**
	 * Removes a callback for the on close event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnClose: function(callback) {
		var idx = this.oncloseCallback.indexOf(callback);
		if (idx > -1) {
			this.oncloseCallback.splice(idx, 1);
		}
	},
	/**
	 * Adds a callback for the on open event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	addOnOpen: function(callback) {
		this.onopenCallback.push(callback);
	},
	/**
	 * Removes a callback for the on open event.
	 *
	 * @param {Function} callback Callback function.
	 * @public
	 */
	removeOnOpen: function(callback) {
		var idx = this.onopenCallback.indexOf(callback);
		if (idx > -1) {
			this.onopenCallback.splice(idx, 1);
		}
	},
	/**
	 * Closes the connection.
	 *
	 * @public
	 */
	close: function() {
		this.ws.close();
	},
	/**
	 * Opens the connection. This method must be called, for
	 *   the connection to be established.
	 *
	 * @public
	 */
	open: function() {
		var that = this;
		this.ws = new WebSocket(this.address, this.protocol);
		this.ws.onopen = function(event) {
			for (var i = 0; i < that.onopenCallback.length; i++) {
				that.onopenCallback[i](event);
			}
		};
		this.ws.onmessage = function(event) {
			for (var i = 0; i < that.onmessageCallback.length; i++) {
				that.onmessageCallback[i](event.data, event);
			}
		};
		this.ws.onclose = function(event) {
			for (var i = 0; i < that.oncloseCallback.length; i++) {
				that.oncloseCallback[i](event);
			}
		};
	},
	/**
	 * Gets the metrics of this web socket.
	 *
	 * @return {!Grape2D.WebSocketMetrics} Web socket's metrics.
	 * @public
	 */
	getMetrics: function() {
		return this.metrics;
	},
	/**
	 * Checks if the web socket is open.
	 *
	 * @return {!boolean} True if it's open.
	 * @public
	 */
	isOpen: function() {
		return this.ws.readyState == this.ws.OPEN;
	}
};