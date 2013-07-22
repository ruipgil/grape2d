/**
 * Describes a texture.
 *
 * @class
 * @interface
 */
Grape2D.ITexture = function() {};

Grape2D.ITexture.prototype = {
	constructor: Grape2D.ITexture,
	/**
	 * Gets the width.
	 *
	 * @return {!number} Width
	 * @public
	 */
	getWidth: function() {},
	/**
	 * Gets the half width.
	 *
	 * @return {!number} Half width
	 * @public
	 */
	getHalfWidth: function() {},
	/**
	 * Sets the width.
	 *
	 * @param  {!number} width New width.
	 * @public
	 */
	setWidth: function(width) {},
	/**
	 * Gets height.
	 *
	 * @return {!number} Height.
	 * @public
	 */
	getHeight: function() {},
	/**
	 * Gets the half height.
	 *
	 * @return {!number} Half height.
	 * @public
	 */
	getHalfHeight: function() {},
	/**
	 * Sets the height.
	 *
	 * @param  {!number} height New height.
	 * @public
	 */
	setHeight: function(height) {},
	/**
	 * Renderers the texture to a renderer, based upon a camera.
	 *
	 * @param  {!Grape2D.Renderer} renderer Renderer to render the texture.
	 * @param  {!Grape2D.Vector} position Position to render the texture
	 *   in the renderer.
	 * @public
	 */
	render: function(renderer, position) {}
};