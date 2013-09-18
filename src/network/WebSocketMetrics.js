/**
 * WebSocketMetrics class.
 *
 * @param {!Grape2D.WebSocket} webSocket WebSocket to bind.
 * @param {!Grape2D.utils.SynchronizedClock=} syncClock A clock
 *   synchronized with the server.
 * @constructor
 */
Grape2D.WebSocketMetrics = function(webSocket, syncClock) {
	/**
	 * Web Socket binded.
	 *
	 * @type {!Grape2D.WebSocket}
	 * @public
	 */
	this.ws = webSocket;
	/**
	 * Accumulated ping.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingAc = 0;
	/**
	 * Ping responses received.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingSamplesReceived = 0;
	/**
	 * Accumulative clock synchronization.
	 *
	 * @type {!number}
	 * @private
	 */
	this.syncAc = 0;
	/**
	 * Ping samples to send to the server.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingSamples = 10;
	/**
	 * Last ping value registered.
	 *
	 * @type {!number}
	 * @private
	 */
	this.pingValue = 0;
	/**
	 * Last time the ping value was registered.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lastPing = 0;
	/**
	 * Total number of bytes sent.
	 *
	 * @type {!number}
	 * @private
	 */
	this.bytesSent = 0;
	/**
	 * Total number of bytes received.
	 *
	 * @type {!number}
	 * @private
	 */
	this.bytesReceived = 0;
	/**
	 * Time when the web socket was opened.
	 *
	 * @type {!number}
	 * @private
	 */
	this.start = 0;
	/**
	 * Bytes of the last message received.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lastReceived = 0;
	/**
	 * Bytes of the last message sent.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lastSent = 0;
	/**
	 * Synchronized clock with the server.
	 *
	 * @type {!Grape2D.utils.SynchronizedClock}
	 * @private
	 */
	this.syncClock = syncClock || new Grape2D.utils.SynchronizedClock();

	var that = this;
	this.ws.addOnOpen(function() {
		that.start = that.syncClock.getTime();
	});
	this.ws.addOnMessage(function(message) {
		var byteSize = message.length;
		that.bytesReceived += byteSize;
		that.lastReceived = byteSize;
	});
	this.ws.addOnSend(function(message) {
		var byteSize = message.length;
		that.bytesSent += byteSize;
		that.lastSent = byteSize;
	});
};

Grape2D.WebSocketMetrics.prototype = {
	constructor: Grape2D.WebSocketMetrics,
	/**
	 * Sends a ping message.
	 *
	 * @param {function(number):string} pingEncoder Function that
	 *   encodes the ping message.
	 * @public
	 */
	ping: function(pingEncoder) {
		this.pingStop = true;
		this.pingAc = 0;
		this.syncAc = 0;
		this.pongSamplesReceived = 0;
		var that = this,
			fn = function() {
				that.ws.send(pingEncoder(new Date().getTime()));
			};
		for (var i = this.pingSamples; i > 0; i--) {
			setTimeout(fn, 20 * i);
		}
	},
	/**
	 * Sends back a pong message.
	 *
	 * @param  {!function(string, number)} pongEncoder Function that
	 *   encodes the pong function.
	 * @param  {!string} message Ping message, received.
	 * @public
	 */
	pong: function(pongEncoder, message) {
		this.ws.send(pongEncoder(message, this.syncClock.getTime()));
	},
	/**
	 * Pong message handler. This is used to calculate the ping
	 *   and synchronize the clock with the server.
	 *
	 * @param  {!number} t1 Request time.
	 * @param  {!number} t2 Request receiving time.
	 * @param  {!number} t4 Pong message time.
	 * @public
	 */
	pongReceived: function(t1, t2, t4) {
		var t3 = t2,
			theta, delta;
		theta = ((t2 - t1) + (t3 - t4)) * 0.5;
		delta = (t4 - t1);
		this.pingAc += delta;
		this.syncAc += theta - delta * 0.5;
		this.pingSamplesReceived++;
		this.lastPing = t4;
		if (this.pingSamplesReceived == this.pingSamples) {
			this.pingValue = Grape2D.Math.ceil(this.pingAc / this.pingSamples);
			this.pingSamplesReceived = 0;
			this.syncClock.sync(Grape2D.Math.floor(this.syncAc / this.pingSamples));
		}
	},
	/**
	 * Gets the network latency, in milliseconds.
	 *
	 * @return {!number} Ping value.
	 * @public
	 */
	getPing: function() {
		return this.pingValue;
	},
	/**
	 * Gets the last time a pong response was received.
	 *
	 * @return {!number} Timestamp, in milliseconds.
	 * @public
	 */
	getLastPing: function() {
		return this.lastPing;
	},
	/**
	 * Gets the number of bytes sent, on the last message.
	 *
	 * @return {!number} Bytes sent.
	 * @public
	 */
	getLastBytesSent: function() {
		return this.lastSent;
	},
	/**
	 * Gets the total number of bytes sent.
	 *
	 * @return {!number} Bytes sent.
	 * @public
	 */
	getBytesSent: function() {
		return this.bytesSent;
	},
	/**
	 * Gets the number of bytes sent per second. Average
	 *   between the total number of bytes sent and the
	 *   time since the web socket was open.
	 *
	 * @return {!number} Average bytes per second.
	 * @public
	 */
	getBytesSentPerSec: function() {
		return this.bytesSent / ((new Date().getTime()) - this.start);
	},
	/**
	 * Gets the number of bytes received, on the last message.
	 *
	 * @return {!number} Bytes received.
	 * @public
	 */
	getLastBytesReceived: function() {
		return this.lastReceived;
	},
	/**
	 * Gets the total number of bytes received.
	 *
	 * @return {!number} Bytes received.
	 * @public
	 */
	getBytesReceived: function() {
		return this.bytesSent;
	},
	/**
	 * Gets the number of bytes sent per second. Average
	 *   between the total number of bytes sent and the
	 *   time since the web socket was open.
	 *
	 * @return {!number} Average bytes per second.
	 * @public
	 */
	getBytesReceivedPerSec: function() {
		return this.bytesReceived / ((new Date().getTime()) - this.start);
	}
};