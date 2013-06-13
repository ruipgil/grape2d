/**
 * A factory to instantiate renderers. All renderers should be instantiated from here.
 *
 * @param  {?number} [type=Grape2D.RendererFactory.Types.CANVAS] The type of canvas to initialize.
 *
 * @constructor
 */
Grape2D.RendererFactory = function (type) {
	this.type = type || Grape2D.RendererFactory.CANVAS;
};

Grape2D.RendererFactory.prototype = {
	constructor: Grape2D.RendererFactory,
	/**
	 * Creates a renderer.
	 *
	 * @param  {?Object} options The options object {@see Grape2D.Renderer}
	 *
	 * @return {Grape2D.Renderer} The renderer.
	 */
	create: function (options) {
		if (this.type == Grape2D.RendererFactory.Types.CANVAS) {
			return new Grape2D.CanvasRenderer(options);
		} else if (this.type == Grape2D.RendererFactory.Types.WEBGL) {
			return null; //TODO
		} else if (this.type == Grape2D.RendererFactory.Types.DOM) {
			return null; //TODO
		}
	}
};

/**
 * Enumeration with the renderer types
 * @enum {number}
 */
Grape2D.RendererFactory.Types = {
	/** The canvas renderer, with the 2D context */
	CANVAS: 01,
	/** The webgl renderer, with the 3D context */
	WEBGL: 02,
	/** The DOM renderer */
	DOM: 03
};