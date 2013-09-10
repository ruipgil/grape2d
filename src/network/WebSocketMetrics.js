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
		if (message.indexOf(Grape2D.WebSocketMetrics.PING_PREFIX) === 0) {
			that.pongReceived(message);
		}
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
	 * @public
	 */
	ping: function() {
		this.pingStop = true;
		this.pingAc = 0;
		this.syncAc = 0;
		this.pongSamplesReceived = 0;
		var that = this;
		for (var i = this.pingSamples; i > 0; i--) {
			setTimeout(function() {
				that.ws.send(Grape2D.WebSocketMetrics.PING_PREFIX + " " + (new Date().getTime()));
			}, 20 * i);
		}
	},
	/**
	 * Sends back a pong message.
	 *
	 * @param  {!string} message Ping message, received.
	 * @public
	 */
	pong: function(message) {
		this.ws.send(message + " " + this.syncClock.getTime());
	},
	/**
	 * Pong message handler. This is used to calculate the ping
	 *   and synchronize the clock with the server.
	 *
	 * @param  {!string} message Pong response message.
	 * @public
	 */
	pongReceived: function(message) {
		var t4 = new Date().getTime(),
			d = message.split(" "),
			t1 = Number(d[1]),
			t2 = Number(d[2]),
			t3 = t2,
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
/**
 * Prefix of the ping message. Any message with this prefix
 *   is treated as a ping message.
 *
 * @type {!string}
 * @public
 * @constant
 */
Grape2D.WebSocketMetrics.PING_PREFIX = "'";