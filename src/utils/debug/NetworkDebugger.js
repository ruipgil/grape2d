/**
 * Debugs the network data income and outcome, by rendering
 *   that information to the renderer.
 *
 * @class
 */
Grape2D.utils.NetworkDebugger = {
	/**
	 * Position of the ping information.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	pingPos: new Grape2D.Vector(85, 20),
	/**
	 * Position of the last income data size.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	inPos: new Grape2D.Vector(20, 35),
	/**
	 * Position of the income rate of data.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	inRatePos: new Grape2D.Vector(88, 35),
	/**
	 * Position of the last outcome data size.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	outPos: new Grape2D.Vector(20, 50),
	/**
	 * Position of the outcome rate of data.
	 *
	 * @type {!Grape2D.Vector}
	 * @public
	 * @static
	 */
	outRatePos: new Grape2D.Vector(88, 50),
	/**
	 * Debug text font.
	 *
	 * @type {!string}
	 * @public
	 * @static
	 */
	textFont: "13px Consolas",
	/**
	 * Renders the information to a renderer.
	 *
	 * @param  {!Grape2D.WebSocket} webSocket Web socket to debug.
	 * @param  {!Grape2D.Renderer} renderer Renderer to render the
	 *   debug information.
	 * @param  {!Grape2D.Camera} camera Camera to transform the
	 *   coordinates.
	 * @public
	 * @static
	 */
	render: function(webSocket, renderer, camera) {
		var metrics = webSocket.getMetrics();
		//renderer.setTextFont(Grape2D.utils.NetworkDebugger.textFont);
		renderer.renderText("ping: " + metrics.getPing() + " ms", Grape2D.utils.NetworkDebugger.pingPos);
		renderer.renderText("in : " + metrics.getLastBytesReceived(), Grape2D.utils.NetworkDebugger.inPos);
		renderer.renderText(Grape2D.Math.roundTwo(metrics.getBytesReceivedPerSec()) + " k/s", Grape2D.utils.NetworkDebugger.inRatePos);
		renderer.renderText("out: " + metrics.getLastBytesSent(), Grape2D.utils.NetworkDebugger.outPos);
		renderer.renderText(Grape2D.Math.roundTwo(metrics.getBytesSentPerSec()) + " k/s", Grape2D.utils.NetworkDebugger.outRatePos);
	}
};