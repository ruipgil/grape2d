/**
 * WebSocket abstraction.
 *
 * @param {!string} address Address of the web socket server.
 * @param {!string=} protocol Web socket protocol.
 * 
 * @constructor
 */
Grape2D.WebSocket = function(address, protocol) {
	/**
	 * Web socket.
	 *
	 * @type {WebSocket}
	 * @private
	 */
	this.ws = new WebSocket(address, protocol);
	var that = this;
	this.ws.onmessage = function(event){
		that.onReceive(event.data, event);
	};
	this.ws.onclose = function(event){
		that.onClose(event);
	};
	this.ws.onopen = function(event){
		that.onOpen(event);
	};
};

Grape2D.WebSocket.prototype = {
	constructor: Grape2D.WebSocket,
	/**
	 * Sends a message to the web socket.
	 *
	 * @param  {!string} msg Message to send.
	 * @return {!boolean} True if it has succeed
	 * @public
	 */
	send: function(msg) {
		return this.ws.send(msg);
	},
	/**
	 * Callback function to be triggered when a message
	 *   has been received.
	 *
	 * @param  {!string} message Message received.
	 * @param  {!Event=} event Event received, it contains
	 *   among other things the message.
	 * @public
	 */
	onReceive: function(message, event) {},
	/**
	 * Callback function to be triggered when a the web
	 *   socket is connected.
	 *
	 * @param  {!Event=} event Event received.
	 * @public
	 */
	onOpen: function(event) {},
	/**
	 * Callback function to be triggered when a the web
	 *   socket is closed.
	 *
	 * @param  {!Event=} event Event received.
	 * @public
	 */
	onClose: function(event) {},
	/**
	 * Closes the web socket.
	 *
	 * @public
	 */
	close: function() {
		this.ws.close();
	}
};